# おみくじアプリケーション Design Document

> **Version**: 1.0.0  
> **Last Updated**: 2025-11-02  
> **Author**: GitHub Copilot

---

## 1. プロジェクト概要

### 目的
GitHub Pages で公開される静的Webアプリケーションとして、ユーザーがおみくじを引いて運勢を占うことができるインタラクティブな体験を提供する。

### 主要機能
- ランダムなおみくじ結果の表示（6種類の運勢）
- ライトテーマ/ダークテーマの切り替え
- アニメーション効果による視覚的フィードバック
- テーマ設定の永続化（localStorage）

### 対象ユーザー
- 日本語を理解するユーザー
- おみくじに興味のあるユーザー
- モダンブラウザを使用するユーザー

---

## 2. アーキテクチャ

### システム構成

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

### 技術スタック

| レイヤー | 技術 |
|---------|------|
| マークアップ | HTML5 |
| スタイリング | CSS3 (CSS Variables) |
| スクリプティング | Vanilla JavaScript (ES6+) |
| テスティング | Jest + JSDOM 30.x |
| ホスティング | GitHub Pages |

### ファイル構成

```
.
├── index.html              # メインHTMLファイル
├── style.css               # スタイルシート
├── omikuji.js              # アプリケーションロジック
├── omikuji.test.js         # ユニットテスト
├── jest.config.js          # Jestテスト設定
├── package.json            # プロジェクト設定
├── .gitignore             # Git除外設定
├── README.md              # プロジェクトドキュメント
└── DESIGN_DOC.md          # 本設計書
```

---

## 3. 機能仕様

### おみくじ抽選機能

**運勢の種類:**
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

**処理フロー:**
1. ユーザーがボタンクリック
2. ボタン無効化（二重クリック防止）
3. スピンアニメーション開始（500ms）
4. ランダム運勢を取得 (`Math.random()`)
5. 結果をDOMに表示
6. スケールアニメーション（300ms）
7. ボタン再有効化

**実装詳細:**
```javascript
function getRandomFortune() {
    const randomIndex = Math.floor(Math.random() * fortunes.length);
    return fortunes[randomIndex];
}
```

### テーマ切り替え機能

**概要:** ライト/ダークテーマの切り替えとlocalStorageによる永続化

**処理フロー:**
1. ページロード時に保存されたテーマを読み込み
2. トグルボタンクリックでテーマ切り替え
3. アイコン更新（🌙 ⇔ ☀️）
4. localStorageに保存

**実装詳細:**
```javascript
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('omikuji-theme', isDark ? 'dark' : 'light');
}
```

---

## 4. UI/UX設計

### レイアウト

```
┌─────────────────────────────────────┐
│  ┌─────────────────────────────┐ 🌙│  ← Theme Toggle Button
│  │                             │   │
│  │     🎋 おみくじ 🎋           │   │
│  │                             │   │
│  │    ┌─────────────────┐      │   │
│  │    │   (運勢結果)     │      │   │  ← Result Display Area
│  │    └─────────────────┘      │   │
│  │                             │   │
│  │   ┌───────────────────┐     │   │
│  │   │ おみくじを回す    │     │   │  ← Draw Button
│  │   └───────────────────┘     │   │
│  │                             │   │
│  │  ボタンを押して、            │   │  ← Description
│  │  今日の運勢を占おう！        │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

### カラーパレット

#### ライトテーマ
| 用途 | カラーコード |
|-----|------------|
| 背景グラデーション | #667eea → #764ba2 |
| コンテナ背景 | #ffffff |
| プライマリテキスト | #333333 |
| セカンダリテキスト | #666666 |
| 結果テキスト | #667eea |
| ボタングラデーション | #667eea → #764ba2 |

#### ダークテーマ
| 用途 | カラーコード |
|-----|------------|
| 背景グラデーション | #1a1a2e → #16213e |
| コンテナ背景 | #0f3460 |
| プライマリテキスト | #e8e8e8 |
| セカンダリテキスト | #b8b8b8 |
| 結果テキスト | #00d4ff |
| ボタングラデーション | #00d4ff → #0077b6 |

### アニメーション

**スピンアニメーション:** 0.5秒、rotate(360deg) + scale(1.2)  
**スケールアニメーション:** 0.3秒、scale(1.1)  
**ホバーエフェクト:** translateY(-3px) + shadow拡大

---

## 5. データ設計

### 状態管理

アプリケーションは以下の状態を管理：

```javascript
{
    currentTheme: 'light' | 'dark',      // 現在のテーマ
    isDrawing: boolean,                   // おみくじ抽選中フラグ
    lastResult: string | null             // 最後の抽選結果
}
```

### LocalStorage仕様

| キー | 値 | 説明 |
|-----|---|-----|
| `omikuji-theme` | `'light'` または `'dark'` | ユーザーのテーマ設定 |

### イベントフロー

```
User Actions
    │
    ├─── Click Draw Button ──→ drawOmikuji() ──→ getRandomFortune() ──→ DOM Update
    │
    └─── Click Theme Toggle ──→ toggleTheme() ──→ localStorage.setItem() ──→ CSS Update
```

---

## 6. エラーハンドリング

| エラーケース | 対処方法 |
|-----------|--------|
| DOM要素が見つからない | 早期リターン、処理をスキップ |
| localStorage無効 | try-catchでキャッチ、デフォルトテーマ使用 |
| localStorage容量超過 | try-catchでキャッチ、警告ログ出力 |
| プライベートモード | try-catchでキャッチ、機能は制限なく動作 |

**実装例:**
```javascript
// DOM要素の存在チェック
if (!resultElement || !drawButton) return;

// LocalStorage エラーハンドリング
try {
    localStorage.setItem('omikuji-theme', theme);
} catch (e) {
    console.warn('Could not save theme preference:', e);
}
```

---

## 7. テスト戦略

### テストケース

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

### テスト実行方法

```bash
# テスト実行
npm test

# カバレッジ付きテスト
npm test -- --coverage

# ウォッチモード
npm test -- --watch
```

### テストツール

- **フレームワーク**: Jest 30.x
- **環境**: jsdom (ブラウザ環境のシミュレーション)
- **カバレッジ**: 自動収集

---

## 8. デプロイメント

### 環境要件

**ブラウザサポート:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**必須機能:**
- CSS Variables サポート
- ES6+ JavaScript サポート
- LocalStorage API

### デプロイ手順

1. リポジトリにプッシュ
2. GitHub Pages が自動的にホスティング
3. 即座にアクセス可能

**URL:** https://tsubakimoto.github.io/coding-agent-omikuji-demo-v3/

### セキュリティ対策

| 脅威 | 対策 |
|-----|-----|
| XSS攻撃 | textContent使用 (`resultElement.textContent = fortune`) |
| CSRF | 不要（APIなし） |
| データ改ざん | クライアント側のみ、localStorage検証なし |
| プライバシー | 個人情報収集なし |

**CodeQL分析結果:** 0件の脆弱性

---

## 9. 保守・運用

### コード品質基準

| 項目 | 基準 |
|-----|-----|
| テストカバレッジ | コア機能100% |
| Null チェック | 全DOM操作で実施 |
| エラーハンドリング | try-catch使用 |
| コメント | 複雑なロジックに記載 |

### 今後の拡張予定

- [ ] 運勢の詳細説明追加
- [ ] アニメーション種類の選択
- [ ] おみくじ履歴の保存・表示
- [ ] ソーシャルシェア機能
- [ ] 多言語対応（英語、中国語など）
- [ ] カスタムテーマ作成
- [ ] サウンドエフェクト

### パフォーマンス最適化

| 項目 | 実装内容 |
|-----|---------|
| CSS Variables | テーマごとの変数定義で再描画最小化 |
| CSS Transitions | 0.3秒のGPU加速アニメーション |
| Event Delegation | 最小限のイベントリスナーでメモリ削減 |
| バンドルサイズ | 合計 ~7.3 KB（HTML ~700B、CSS ~3.5KB、JS ~3.1KB） |

### 依存関係

**プロダクション:** なし（Vanilla JavaScript）

**開発依存関係:**
```json
{
  "@types/jest": "^30.0.0",
  "jest": "^30.2.0",
  "jest-environment-jsdom": "^30.2.0",
  "jsdom": "^27.1.0"
}
```

---

## 10. 参考資料

- [MDN Web Docs - CSS Variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [MDN Web Docs - LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- GitHub Repository: https://github.com/tsubakimoto/coding-agent-omikuji-demo-v3
- Live Demo: https://tsubakimoto.github.io/coding-agent-omikuji-demo-v3/

---

## 付録

### 用語集

| 用語 | 説明 |
|-----|-----|
| おみくじ | 日本の伝統的な占いで、神社や寺院で引く籤（くじ） |
| 大吉 | 最も良い運勢 |
| 中吉 | 中程度の良い運勢 |
| 小吉 | 小さな良い運勢 |
| 吉 | 普通の運勢 |
| 凶 | 悪い運勢 |
| 大凶 | 最も悪い運勢 |

### 変更履歴

| バージョン | 日付 | 変更内容 |
|----------|-----|---------|
| 1.0.0 | 2025-11-02 | 初回リリース - おみくじ抽選機能、テーマ切り替え、ユニットテスト |

