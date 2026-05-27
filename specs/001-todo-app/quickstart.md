# Quickstart: Simple Todo App

**Branch**: `001-todo-app` | **Date**: 2026-05-11

## Prerequisites

- モダンウェブブラウザ（Chrome 80+, Firefox 75+, Safari 14+, Edge 80+）
- ローカル HTTP サーバー（ES Modules は `file://` では動作しないため必須）

## セットアップと起動

### Option A: Python（標準インストール済みが多い）

```bash
cd src/
python3 -m http.server 8080
# → http://localhost:8080 をブラウザで開く
```

### Option B: Node.js

```bash
npx serve src/
# → 表示された URL をブラウザで開く
```

### Option C: VS Code Live Server 拡張機能

1. VS Code で `src/index.html` を開く
2. 右下の「Go Live」ボタンをクリック
3. 自動的にブラウザが開く

## ファイル構成

```
src/
├── index.html      # アプリのエントリーポイント
├── css/
│   └── styles.css  # スタイル定義
└── js/
    ├── app.js      # メインロジック（イベント処理・UI 更新）
    └── db.js       # IndexedDB 抽象レイヤー（CRUD 操作）
```

## 動作確認（受け入れシナリオ）

1. **タスク作成**: 入力欄にテキストを入力し「追加」ボタンをクリック → リストに追加される
2. **タスク完了**: チェックボックスをクリック → 打ち消し線が表示される
3. **タスク削除**: 「削除」ボタンをクリック → リストから消える
4. **永続化確認**: ページを再読み込みしてもタスクが残っている
5. **空入力チェック**: 空のまま送信するとエラーメッセージが表示される

## IndexedDB の確認方法（開発者向け）

1. ブラウザの DevTools を開く（F12 または Cmd+Option+I）
2. 「Application」タブ → 「IndexedDB」→ `todo-db` → `tasks`
3. タスクのレコードを直接確認できる

## テスト実行

```bash
# vitest + fake-indexeddb でユニットテストを実行
npm install
npm test
```
