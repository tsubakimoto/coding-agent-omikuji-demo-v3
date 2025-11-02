# coding-agent-omikuji-demo-v3

おみくじで遊べる静的Webアプリケーションです。

## 機能

- おみくじを回して運勢を占うことができます
- 以下の6種類のおみくじ結果がランダムで表示されます：
  - 大吉
  - 中吉
  - 小吉
  - 吉
  - 凶
  - 大凶
- ライトテーマとダークテーマの切り替えが可能
  - 右上のテーマ切り替えボタン（🌙/☀️）をクリックして切り替え
  - テーマ設定はローカルストレージに保存され、次回アクセス時も保持されます

## ローカル環境での実行手順

このアプリケーションは静的なHTMLファイルで構成されているため、ブラウザで直接開くだけで実行できます。

### 方法1: ブラウザで直接開く

1. リポジトリをクローンします：
   ```bash
   git clone https://github.com/tsubakimoto/coding-agent-omikuji-demo-v3.git
   cd coding-agent-omikuji-demo-v3
   ```

2. `index.html` をブラウザで開きます：
   - ファイルをダブルクリックして開く
   - または、ブラウザに `index.html` をドラッグ&ドロップ

### 方法2: ローカルサーバーを使用する（推奨）

より本番環境に近い動作を確認したい場合は、ローカルサーバーを使用することをお勧めします。

#### Pythonを使用する場合

```bash
# Python 3の場合
python -m http.server 8000

# Python 2の場合
python -m SimpleHTTPServer 8000
```

ブラウザで `http://localhost:8000` を開きます。

#### Node.jsを使用する場合

```bash
# http-serverをインストール（初回のみ）
npm install -g http-server

# サーバーを起動
http-server -p 8000
```

ブラウザで `http://localhost:8000` を開きます。

## GitHub Pagesでの公開

このリポジトリはGitHub Pagesで公開されています。以下のURLからアクセスできます：

https://tsubakimoto.github.io/coding-agent-omikuji-demo-v3/

## 使い方

1. 右上のテーマ切り替えボタン（🌙/☀️）でライトテーマとダークテーマを切り替えられます
2. 「おみくじを回す」ボタンをクリックします
3. ランダムでおみくじ結果が表示されます
4. 何度でもおみくじを回すことができます

## テストの実行

このプロジェクトにはJestを使用したユニットテストが含まれています。

### テストの準備

```bash
# 依存関係をインストール
npm install
```

### テストの実行

```bash
# テストを実行
npm test
```

テストはおみくじのロジック（ランダム抽選機能、運勢の種類など）を検証します。

## プロジェクト構成

```
.
├── index.html          # メインHTMLファイル
├── style.css           # スタイルシート
├── omikuji.js          # おみくじのロジック
├── omikuji.test.js     # ユニットテスト
├── jest.config.js      # Jestの設定
├── package.json        # プロジェクト設定とテスト依存関係
└── README.md           # このファイル
```