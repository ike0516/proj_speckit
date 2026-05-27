# Research: Simple Todo App

**Branch**: `001-todo-app` | **Date**: 2026-05-11 | **Phase**: 0 — Pre-design research

## Technology Stack

### Decision: Vanilla HTML/CSS/JavaScript (no framework)

**Rationale**:  
スペックが「シンプルな」アプリを強調しており、状態管理ライブラリや仮想 DOM は不要。
バニラ JS はビルドツールなしでブラウザ直接実行でき、依存関係ゼロで最小構成を実現できる。
ES Modules (`type="module"`) を使うことでファイル分割とスコープ分離が可能。

**Alternatives considered**:

| Option | Rejected Because |
|--------|-----------------|
| React / Vue.js | ビルドツール・npm・バンドラーが必要でシンプルさに反する |
| jQuery | モダンブラウザでは不要な依存関係 |
| Preact / Alpine.js | 小さいが、バニラ JS で十分対応できる規模のため過剰 |

---

## Persistence Strategy

### Decision: IndexedDB（ユーザー指定）

**Rationale**:  
ユーザーより「IndexedDB を使うこと」と明示的に指定された。
IndexedDB は非同期 API であり、localStorage より大容量・高機能だが、シンプルな Todo アプリでは
`idb`（軽量 Promise ラッパー）を使わず素の IndexedDB API を採用することでゼロ依存を維持する。

**IndexedDB 設計方針**:
- データベース名: `todo-db`
- バージョン: `1`
- オブジェクトストア: `tasks`（キー: `id`、自動採番）
- すべての操作は Promise でラップし、async/await で呼び出す

**Alternatives considered**:

| Option | Rejected Because |
|--------|-----------------|
| localStorage | ユーザーが IndexedDB を指定したため不採用 |
| idb ライブラリ | 依存関係を増やすためゼロ依存方針と相反する |
| IndexedDB + Dexie.js | 同上、依存関係不要の規模 |
| sessionStorage | ページ再読み込みでデータが消える（FR-006 違反） |

---

## Project Structure

### Decision: Single-page application, no build step

**Rationale**:  
ビルドステップなしで `index.html` をブラウザで直接開くか、
簡易 HTTP サーバー（例: `python -m http.server`）で配信するだけで動作する構成とする。
ES Modules は `file://` プロトコルで CORS エラーになるため、ローカル HTTP サーバーが必要。

**Selected structure**:

```
src/
├── index.html      # エントリーポイント（スタイルと JS を読み込む）
├── css/
│   └── styles.css  # 全スタイル定義
└── js/
    ├── app.js      # メインロジック（イベントハンドリング、UI 更新）
    └── db.js       # IndexedDB の開閉・CRUD を Promise でラップした抽象レイヤー

tests/
└── unit/
    └── db.test.js  # db.js のユニットテスト（モック IndexedDB 使用）
```

---

## Testing Approach

### Decision: 手動テスト + db.js ユニットテスト

**Rationale**:  
ビジネスロジックは `db.js` に集中するため、そこだけユニットテストで保護する。
UI の結合動作はスペックの受け入れシナリオに基づく手動テストで確認する。

**Tooling**: テストランナーは `vitest`（ブラウザ互換 API モック対応）を採用。
`fake-indexeddb` パッケージで Node.js 環境での IndexedDB モックを実現。

---

## Performance Assessment

IndexedDB の非同期操作は Promise チェーンで処理され、タスク数が数千件以内であれば
ユーザーが体感できる遅延は発生しない。SC-002「即座に反映」は十分に達成可能。
