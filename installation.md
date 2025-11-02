# GitHub App セットアップ手順

このドキュメントでは、おみくじアプリにGitHub OAuth認証を統合するための手順を説明します。

## 概要

おみくじアプリは、GitHubアカウントでのログイン機能を提供します。ログインすることで、おみくじの結果がブラウザのセッションストレージに保存され、履歴として表示されます。

## GitHub OAuth Appの作成

### 1. GitHubでOAuth Appを作成

1. GitHubにログインし、[Settings > Developer settings > OAuth Apps](https://github.com/settings/developers)にアクセスします
2. 「New OAuth App」ボタンをクリックします
3. 以下の情報を入力します：

   | フィールド | 値 | 説明 |
   |----------|---|------|
   | **Application name** | `おみくじアプリ` | アプリケーションの名前（任意） |
   | **Homepage URL** | `https://tsubakimoto.github.io/coding-agent-omikuji-demo-v3/` | アプリのホームページURL |
   | **Application description** | `おみくじで遊べる静的Webアプリケーション` | 説明（オプション） |
   | **Authorization callback URL** | `https://tsubakimoto.github.io/coding-agent-omikuji-demo-v3/` | OAuth認証後のリダイレクト先 |

4. 「Register application」ボタンをクリックします

### 2. Client IDを取得

OAuth App作成後、以下の情報が表示されます：

- **Client ID**: 公開識別子（例: `Iv1.a1b2c3d4e5f6g7h8`）
- **Client secrets**: クライアントシークレット（機密情報）

**重要**: Client secretsは機密情報です。フロントエンドコードには含めないでください。

### 3. ローカル開発環境でのセットアップ

ローカル環境で開発する場合、別のOAuth Appを作成することをお勧めします：

1. 新しいOAuth Appを作成（手順1を参照）
2. 以下の設定を使用：
   - **Homepage URL**: `http://localhost:8000`
   - **Authorization callback URL**: `http://localhost:8000`

## アプリケーションへの統合

### コード内のClient ID設定

`omikuji.js` ファイルの以下の部分を更新します：

```javascript
const GITHUB_CLIENT_ID = 'YOUR_CLIENT_ID_HERE';
```

`'YOUR_CLIENT_ID_HERE'`を、作成したOAuth AppのClient IDに置き換えてください。

**例:**
```javascript
const GITHUB_CLIENT_ID = 'Iv1.a1b2c3d4e5f6g7h8';
```

## バックエンドサーバーのセットアップ（本番環境）

### 重要な注意事項

このアプリケーションは静的サイトとして設計されていますが、完全なGitHub OAuth認証を実装するには**バックエンドサーバーが必要**です。これは、クライアントシークレットを安全に保つためです。

### なぜバックエンドが必要か

GitHub OAuthフローは以下のステップで構成されます：

1. ユーザーをGitHub認証ページにリダイレクト
2. ユーザーが承認後、認証コードとともにアプリにリダイレクト
3. **認証コードをアクセストークンに交換**（←ここでバックエンドが必要）
4. アクセストークンを使用してユーザー情報を取得

ステップ3では、クライアントシークレットが必要ですが、これはフロントエンドで公開できません。

### バックエンド実装オプション

#### オプション1: Node.js + Express

```javascript
const express = require('express');
const axios = require('axios');
const app = express();

app.get('/api/auth/github/callback', async (req, res) => {
    const { code } = req.query;
    
    try {
        // トークン交換
        const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code: code
        }, {
            headers: { Accept: 'application/json' }
        });
        
        const accessToken = tokenResponse.data.access_token;
        
        // ユーザー情報取得
        const userResponse = await axios.get('https://api.github.com/user', {
            headers: { Authorization: `token ${accessToken}` }
        });
        
        res.json({ user: userResponse.data, token: accessToken });
    } catch (error) {
        res.status(500).json({ error: 'Authentication failed' });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

環境変数の設定:
```bash
export GITHUB_CLIENT_ID=your_client_id
export GITHUB_CLIENT_SECRET=your_client_secret
```

#### オプション2: Serverless Functions (Vercel, Netlify)

**Vercel Functions (`/api/auth/github/callback.js`):**

```javascript
export default async function handler(req, res) {
    const { code } = req.query;
    
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code: code
        })
    });
    
    const { access_token } = await tokenResponse.json();
    
    const userResponse = await fetch('https://api.github.com/user', {
        headers: { Authorization: `token ${access_token}` }
    });
    
    const user = await userResponse.json();
    
    res.json({ user, token: access_token });
}
```

#### オプション3: GitHub Actions + GitHub Pages（現在の実装）

**現在の実装では、デモ目的でバックエンドなしで動作します：**

- OAuth認証フローを開始
- 認証コードを受け取った後、ユーザーに手動でユーザー名を入力してもらう
- モックユーザーデータを使用して機能をテスト

**本番環境では、上記のバックエンドオプションのいずれかを実装してください。**

## フロントエンドコードの更新（バックエンド使用時）

バックエンドを実装した場合、`omikuji.js`の`handleOAuthCallback`関数を以下のように更新します：

```javascript
async function handleOAuthCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    
    if (!code || !state) return false;
    
    const savedState = sessionStorage.getItem('oauth-state');
    if (state !== savedState) {
        console.error('OAuth state mismatch');
        return false;
    }
    
    sessionStorage.removeItem('oauth-state');
    
    try {
        // バックエンドAPIを呼び出してトークンを取得
        const response = await fetch(`/api/auth/github/callback?code=${code}&state=${state}`);
        const data = await response.json();
        
        if (data.user) {
            loginUser(data.user);
            
            // オプション: トークンを保存（注意: XSS対策が必要）
            // sessionStorage.setItem('github-token', data.token);
        }
        
        // URLパラメータをクリア
        window.history.replaceState({}, document.title, window.location.pathname);
        
        return true;
    } catch (e) {
        console.error('OAuth callback error:', e);
        return false;
    }
}
```

## セキュリティのベストプラクティス

### 1. Client Secretを保護

- **絶対にフロントエンドコードに含めない**
- 環境変数として管理
- バージョン管理システムにコミットしない（`.gitignore`に追加）

### 2. State パラメータ

- CSRF攻撃を防ぐため、ランダムなstateパラメータを使用
- セッションストレージで検証

### 3. HTTPS使用

- 本番環境では必ずHTTPSを使用
- GitHub OAuth callbackはHTTPSを推奨

### 4. トークンの保管

- アクセストークンはセッションストレージに保存（セッション終了で削除）
- ローカルストレージは避ける（XSS攻撃のリスク）
- 可能であれば、httpOnlyクッキーを使用

### 5. スコープの最小化

- 必要最小限のスコープのみ要求
- 現在の実装: `read:user`（ユーザー情報の読み取りのみ）

## トラブルシューティング

### 問題: 「Client IDが設定されていません」エラー

**解決方法:**
1. `omikuji.js`で`GITHUB_CLIENT_ID`が正しく設定されているか確認
2. Client IDが正しい形式（`Iv1.`で始まる）か確認

### 問題: 認証後にエラーが発生

**解決方法:**
1. Callback URLが正確にOAuth App設定と一致しているか確認
2. ブラウザのコンソールでエラーメッセージを確認
3. State パラメータの不一致がないか確認

### 問題: ローカルホストで動作しない

**解決方法:**
1. ローカル開発用の別のOAuth Appを作成
2. Callback URLを`http://localhost:8000`に設定
3. 対応するClient IDを使用

## 機能説明

### ログイン機能

- GitHubアカウントでログイン
- ユーザーのアバターと名前を表示
- セッション中はログイン状態を保持

### おみくじ履歴

- ログイン中のおみくじ結果を自動保存
- セッションストレージに保管（タブを閉じるまで保持）
- 最新10件の履歴を表示
- ユーザーごとに個別の履歴管理

### データ保存仕様

| データ | ストレージ | キー形式 | 説明 |
|-------|----------|---------|------|
| ユーザー情報 | sessionStorage | `github-user` | ログインユーザーの情報 |
| おみくじ履歴 | sessionStorage | `omikuji-history-{username}` | ユーザーごとの履歴 |
| テーマ設定 | localStorage | `omikuji-theme` | ライト/ダークテーマ |

### SessionStorage vs LocalStorage

**SessionStorageを使用する理由:**
- タブを閉じると自動的にクリア（プライバシー保護）
- セッション単位でのデータ管理
- 複数タブで独立したセッション

**LocalStorageを使用する場合:**
- テーマ設定など、永続的に保存したいデータ
- セッションをまたいで保持する必要があるデータ

## 参考リンク

- [GitHub OAuth Apps Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [Authorizing OAuth Apps](https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps)
- [Web Storage API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
- [OAuth 2.0 Security Best Practices](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics)

## サポート

問題が発生した場合は、GitHubリポジトリでIssueを作成してください：
https://github.com/tsubakimoto/coding-agent-omikuji-demo-v3/issues
