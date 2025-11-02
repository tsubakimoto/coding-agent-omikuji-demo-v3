# おみくじアプリケーション Design Document

## 1. プロジェクト概要

### 1.1 アプリケーション名
おみくじアプリ (Omikuji Fortune-Telling Application)

### 1.2 目的
GitHub Pages で公開される静的Webアプリケーションとして、ユーザーがおみくじを引いて運勢を占うことができるインタラクティブな体験を提供する。

### 1.3 主要機能
- ランダムなおみくじ結果の表示（6種類の運勢）
- ライトテーマ/ダークテーマの切り替え
- アニメーション効果による視覚的フィードバック
- テーマ設定の永続化（localStorage）

### 1.4 対象ユーザー
- 日本語を理解するユーザー
- おみくじに興味のあるユーザー
- モダンブラウザを使用するユーザー

---

## 2. アーキテクチャ設計

### 2.1 システム構成

```
┌─────────────────────────────────────┐
│         GitHub Pages (Host)          │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│      Static Web Application          │
│  ┌─────────────────────────────┐    │
│  │   index.html (Structure)    │    │
│  └─────────────────────────────┘    │
│  ┌─────────────────────────────┐    │
│  │   style.css (Presentation)  │    │
│  └─────────────────────────────┘    │
│  ┌─────────────────────────────┐    │
│  │   omikuji.js (Behavior)     │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   Browser (User Environment)         │
│  - DOM Manipulation                  │
│  - LocalStorage API                  │
│  - CSS Animations                    │
└─────────────────────────────────────┘
```

### 2.2 技術スタック

| レイヤー | 技術 | バージョン |
|---------|------|-----------|
| マークアップ | HTML5 | - |
| スタイリング | CSS3 (CSS Variables) | - |
| スクリプティング | Vanilla JavaScript (ES6+) | - |
| テスティング | Jest + JSDOM | 30.x |
| ホスティング | GitHub Pages | - |
| バージョン管理 | Git | - |

### 2.3 ファイル構成

```
.
├── index.html              # メインHTMLファイル
├── style.css               # スタイルシート
├── omikuji.js              # アプリケーションロジック
├── omikuji.test.js         # ユニットテスト
├── jest.config.js          # Jestテスト設定
├── package.json            # プロジェクト設定
├── package-lock.json       # 依存関係ロック
├── .gitignore             # Git除外設定
├── README.md              # プロジェクトドキュメント
└── DESIGN_DOC.md          # 本設計書
```

---

## 3. UI/UX 設計

### 3.1 レイアウト構造

```
┌─────────────────────────────────────┐
│  ┌─────────────────────────────┐ 🌙│  ← Theme Toggle Button
│  │                             │   │
│  │     🎋 おみくじ 🎋           │   │
│  │                             │   │
│  │    ┌─────────────────┐      │   │
│  │    │                 │      │   │  ← Result Display Area
│  │    │   (運勢結果)     │      │   │
│  │    │                 │      │   │
│  │    └─────────────────┘      │   │
│  │                             │   │
│  │   ┌───────────────────┐     │   │
│  │   │ おみくじを回す    │     │   │  ← Draw Button
│  │   └───────────────────┘     │   │
│  │                             │   │
│  │  ボタンを押して、            │   │  ← Description
│  │  今日の運勢を占おう！        │   │
│  │                             │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

### 3.2 カラーパレット

#### ライトテーマ
| 要素 | カラーコード | 用途 |
|-----|------------|-----|
| 背景グラデーション開始 | `#667eea` | ページ背景（紫） |
| 背景グラデーション終了 | `#764ba2` | ページ背景（深紫） |
| コンテナ背景 | `#ffffff` | メインコンテナ（白） |
| プライマリテキスト | `#333333` | 見出し・本文 |
| セカンダリテキスト | `#666666` | 補助説明文 |
| 結果テキスト | `#667eea` | おみくじ結果（紫） |
| ボタングラデーション | `#667eea` → `#764ba2` | アクションボタン |

#### ダークテーマ
| 要素 | カラーコード | 用途 |
|-----|------------|-----|
| 背景グラデーション開始 | `#1a1a2e` | ページ背景（濃紺） |
| 背景グラデーション終了 | `#16213e` | ページ背景（深紺） |
| コンテナ背景 | `#0f3460` | メインコンテナ（ダークブルー） |
| プライマリテキスト | `#e8e8e8` | 見出し・本文（明るいグレー） |
| セカンダリテキスト | `#b8b8b8` | 補助説明文 |
| 結果テキスト | `#00d4ff` | おみくじ結果（シアン） |
| ボタングラデーション | `#00d4ff` → `#0077b6` | アクションボタン |

### 3.3 タイポグラフィ

| 要素 | フォントサイズ | フォントウェイト |
|-----|-------------|--------------|
| 見出し (h1) | 2.5em | normal |
| 結果表示 | 4em | bold |
| ボタンテキスト | 1.5em | bold |
| 説明文 | 0.9em | normal |

### 3.4 アニメーション

#### スピンアニメーション
```css
@keyframes spin {
    0%   { transform: rotate(0deg) scale(1); }
    50%  { transform: rotate(180deg) scale(1.2); }
    100% { transform: rotate(360deg) scale(1); }
}
```
- **持続時間**: 0.5秒
- **タイミング**: ease-in-out
- **用途**: おみくじを引くときの結果表示エリア

#### スケールアニメーション
```css
.show { transform: scale(1.1); }
```
- **持続時間**: 0.3秒
- **用途**: 結果表示時の強調効果

#### ホバーエフェクト
- **ボタン**: translateY(-3px) + shadow拡大
- **テーマトグル**: scale(1.1) + shadow拡大

---

## 4. 機能仕様

### 4.1 おみくじ抽選機能

#### 4.1.1 運勢の種類
```javascript
const fortunes = ['大吉', '中吉', '小吉', '吉', '凶', '大凶'];
```

| 運勢 | 意味 | 確率 |
|-----|-----|-----|
| 大吉 | 最高の運勢 | 1/6 (16.67%) |
| 中吉 | 良好な運勢 | 1/6 (16.67%) |
| 小吉 | やや良い運勢 | 1/6 (16.67%) |
| 吉 | 普通の運勢 | 1/6 (16.67%) |
| 凶 | 悪い運勢 | 1/6 (16.67%) |
| 大凶 | 最悪の運勢 | 1/6 (16.67%) |

#### 4.1.2 抽選アルゴリズム
```javascript
function getRandomFortune() {
    const randomIndex = Math.floor(Math.random() * fortunes.length);
    return fortunes[randomIndex];
}
```

- **ランダム性**: `Math.random()` を使用した疑似乱数生成
- **分布**: 均等分布（各運勢が等確率）
- **実装**: Fisher-Yatesアルゴリズムではなく、シンプルなインデックス選択

#### 4.1.3 抽選フロー

```
[ユーザーがボタンクリック]
        ↓
[ボタン無効化 (二重クリック防止)]
        ↓
[スピンアニメーション開始]
        ↓
[500ms待機]
        ↓
[ランダム運勢を取得]
        ↓
[結果をDOMに表示]
        ↓
[スピンアニメーション終了]
        ↓
[スケールアニメーション開始]
        ↓
[300ms待機]
        ↓
[スケールアニメーション終了]
        ↓
[ボタン再有効化]
```

### 4.2 テーマ切り替え機能

#### 4.2.1 テーマ状態管理

```javascript
// テーマ初期化
function initTheme() {
    let savedTheme = localStorage.getItem('omikuji-theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeIcon.textContent = '☀️';
    } else {
        themeIcon.textContent = '🌙';
    }
}

// テーマ切り替え
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('omikuji-theme', isDark ? 'dark' : 'light');
}
```

#### 4.2.2 LocalStorage仕様

| キー | 値 | 説明 |
|-----|---|-----|
| `omikuji-theme` | `'light'` または `'dark'` | ユーザーのテーマ設定 |

#### 4.2.3 テーマ切り替えフロー

```
[ページロード]
        ↓
[localStorageから設定読み込み]
        ↓
[保存されたテーマを適用]
        ↓
[アイコン更新]

[ユーザーがトグルボタンクリック]
        ↓
[dark-themeクラスをトグル]
        ↓
[アイコン更新 (🌙 ⇔ ☀️)]
        ↓
[localStorageに保存]
```

---

## 5. データフロー設計

### 5.1 状態管理

アプリケーションは以下の状態を管理します：

```javascript
// グローバル状態
{
    currentTheme: 'light' | 'dark',      // 現在のテーマ
    isDrawing: boolean,                   // おみくじ抽選中フラグ
    lastResult: string | null             // 最後の抽選結果
}
```

### 5.2 イベントフロー

```
┌──────────────┐
│ User Actions │
└──────┬───────┘
       │
       ├─── Click Draw Button ──→ drawOmikuji()
       │                              ↓
       │                        getRandomFortune()
       │                              ↓
       │                          DOM Update
       │
       └─── Click Theme Toggle ──→ toggleTheme()
                                      ↓
                                  localStorage.setItem()
                                      ↓
                                   CSS Update
```

---

## 6. エラーハンドリング

### 6.1 DOM要素の存在チェック

```javascript
// 全ての DOM 操作前に null チェック実施
if (!resultElement || !drawButton) return;
```

### 6.2 LocalStorage エラーハンドリング

```javascript
try {
    localStorage.setItem('omikuji-theme', theme);
} catch (e) {
    console.warn('Could not save theme preference:', e);
    // アプリケーションは継続動作（degradation gracefully）
}
```

### 6.3 エラーシナリオ

| エラーケース | 対処方法 |
|-----------|--------|
| DOM要素が見つからない | 早期リターン、処理をスキップ |
| localStorage無効 | try-catchでキャッチ、デフォルトテーマ使用 |
| localStorage容量超過 | try-catchでキャッチ、警告ログ出力 |
| プライベートモード | try-catchでキャッチ、機能は制限なく動作 |

---

## 7. パフォーマンス最適化

### 7.1 最適化戦略

| 項目 | 実装内容 | 効果 |
|-----|---------|-----|
| CSS Variables | テーマごとの変数定義 | 再描画の最小化 |
| CSS Transitions | 0.3秒のスムーズ遷移 | GPU加速による滑らかなアニメーション |
| Event Delegation | 最小限のイベントリスナー | メモリ使用量削減 |
| Disable Button | 抽選中のボタン無効化 | 二重実行防止 |

### 7.2 バンドルサイズ

| ファイル | サイズ（概算） |
|---------|-------------|
| index.html | ~700 bytes |
| style.css | ~3.5 KB |
| omikuji.js | ~3.1 KB |
| **合計** | **~7.3 KB** |

---

## 8. テスト戦略

### 8.1 テストツール

- **フレームワーク**: Jest 30.x
- **環境**: jsdom (ブラウザ環境のシミュレーション)
- **カバレッジ**: 自動収集

### 8.2 テストスイート構成

```javascript
describe('Omikuji Application', () => {
    describe('fortunes array', () => {
        // 運勢配列の検証（3テスト）
    });
    
    describe('getRandomFortune function', () => {
        // ランダム抽選関数の検証（5テスト）
    });
    
    describe('Fortune distribution', () => {
        // 確率分布の検証（1テスト）
    });
});
```

### 8.3 テストケース一覧

| # | カテゴリ | テスト内容 | 期待結果 |
|---|---------|----------|---------|
| 1 | 配列検証 | 運勢の数が6種類 | length === 6 |
| 2 | 配列検証 | 正しい運勢が含まれる | 大吉、中吉、小吉、吉、凶、大凶 |
| 3 | 配列検証 | 配列が空でない | length > 0 |
| 4 | 関数検証 | 配列内の値を返す | fortunes.includes(result) |
| 5 | 関数検証 | 文字列型を返す | typeof === 'string' |
| 6 | 関数検証 | 期待される運勢を返す | expectedFortunes.includes(result) |
| 7 | 確率検証 | 複数回で異なる結果 | 100回中2種類以上 |
| 8 | 確率検証 | 常に有効な値を返す | 50回全て配列内の値 |
| 9 | 分布検証 | 全運勢が抽選可能 | 1000回中6種類全て |

### 8.4 テスト実行

```bash
# テスト実行
npm test

# カバレッジ付きテスト
npm test -- --coverage

# ウォッチモード
npm test -- --watch
```

---

## 9. セキュリティ設計

### 9.1 セキュリティ対策

| 脅威 | 対策 | 実装 |
|-----|-----|-----|
| XSS攻撃 | textContent使用 | `resultElement.textContent = fortune` |
| CSRF | 不要（APIなし） | - |
| データ改ざん | クライアント側のみ | localStorage検証なし |
| プライバシー | 個人情報収集なし | 運勢結果のみ保存 |

### 9.2 CodeQL分析結果

```
Analysis Result for 'javascript': Found 0 alerts
- **javascript**: No alerts found.
```

---

## 10. デプロイメント

### 10.1 GitHub Pages 設定

```yaml
# 想定される GitHub Pages 設定
Source: 
  Branch: main / copilot/create-omikuji-app
  Folder: / (root)

URL: https://tsubakimoto.github.io/coding-agent-omikuji-demo-v3/
```

### 10.2 ビルドプロセス

このアプリケーションは静的ファイルのため、ビルドプロセスは不要：

1. リポジトリにプッシュ
2. GitHub Pages が自動的にホスティング
3. 即座にアクセス可能

### 10.3 環境要件

**ブラウザサポート:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**必須機能:**
- CSS Variables サポート
- ES6+ JavaScript サポート
- LocalStorage API

---

## 11. 保守性

### 11.1 コード品質基準

| 項目 | 基準 |
|-----|-----|
| テストカバレッジ | コア機能100% |
| Null チェック | 全DOM操作で実施 |
| エラーハンドリング | try-catch使用 |
| コメント | 複雑なロジックに記載 |

### 11.2 拡張性

将来的な機能追加の候補：

- [ ] 運勢の詳細説明追加
- [ ] アニメーション種類の選択
- [ ] おみくじ履歴の保存・表示
- [ ] ソーシャルシェア機能
- [ ] 多言語対応（英語、中国語など）
- [ ] カスタムテーマ作成
- [ ] サウンドエフェクト

### 11.3 リファクタリングポイント

コードレビューで指摘された改善余地：

1. **ヘルパー関数の抽出**
   - テーマ関連のDOM取得を共通化
   - コード重複の削減

2. **設定の集約**
   ```javascript
   const CONFIG = {
       STORAGE_KEY: 'omikuji-theme',
       ANIMATION_DURATION: {
           spin: 500,
           scale: 300
       }
   };
   ```

---

## 12. 依存関係管理

### 12.1 プロダクション依存関係

なし（Vanilla JavaScript使用）

### 12.2 開発依存関係

```json
{
  "@types/jest": "^30.0.0",
  "jest": "^30.2.0",
  "jest-environment-jsdom": "^30.2.0",
  "jsdom": "^27.1.0"
}
```

---

## 13. バージョン履歴

| バージョン | 日付 | 変更内容 |
|----------|-----|---------|
| 1.0.0 | 2025-11-02 | 初回リリース |
| - | - | ・おみくじ抽選機能 |
| - | - | ・ライト/ダークテーマ切り替え |
| - | - | ・ユニットテスト追加 |
| - | - | ・localStorage対応 |

---

## 14. 参考資料

### 14.1 技術ドキュメント

- [MDN Web Docs - CSS Variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [MDN Web Docs - LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [Jest Documentation](https://jestjs.io/docs/getting-started)

### 14.2 関連リソース

- GitHub Repository: https://github.com/tsubakimoto/coding-agent-omikuji-demo-v3
- Live Demo: https://tsubakimoto.github.io/coding-agent-omikuji-demo-v3/

---

## 15. 付録

### 15.1 用語集

| 用語 | 説明 |
|-----|-----|
| おみくじ | 日本の伝統的な占いで、神社や寺院で引く籤（くじ） |
| 大吉 | 最も良い運勢 |
| 中吉 | 中程度の良い運勢 |
| 小吉 | 小さな良い運勢 |
| 吉 | 普通の運勢 |
| 凶 | 悪い運勢 |
| 大凶 | 最も悪い運勢 |

### 15.2 コントリビューション

このプロジェクトはGitHub Copilotによって生成されました。

---

**Document Version**: 1.0.0  
**Last Updated**: 2025-11-02  
**Author**: GitHub Copilot
