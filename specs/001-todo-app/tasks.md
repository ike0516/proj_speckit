# Tasks: Simple Todo App

**Input**: Design documents from `/specs/001-todo-app/`
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, contracts/ui-contract.md ✓

**Stack**: Vanilla HTML5/CSS3/JavaScript (ES Modules), IndexedDB, vitest + fake-indexeddb (unit tests)  
**Structure**: `src/` (index.html, css/styles.css, js/app.js, js/db.js), `tests/unit/db.test.js`

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: 並行実行可能（別ファイル、未完了タスクへの依存なし）
- **[Story]**: 対応するユーザーストーリー（US1/US2/US3）

---

## Phase 1: Setup（プロジェクト初期化）

**Purpose**: ディレクトリ構成と開発ツールのセットアップ

- [x] T001 Create project directory structure: `src/`, `src/css/`, `src/js/`, `tests/unit/`
- [x] T002 Create `package.json` with devDependencies: `vitest`, `fake-indexeddb`, and `"test": "vitest"` script
- [x] T003 [P] Create `vitest.config.js` with `environment: 'node'` and `globals: true`

---

## Phase 2: Foundational（基盤 — 全ユーザーストーリーのブロッカー）

**Purpose**: 全ユーザーストーリーが依存する IndexedDB レイヤーと HTML シェルを構築する

**⚠️ CRITICAL**: このフェーズ完了前にユーザーストーリーの実装を開始しないこと

- [x] T004 Implement IndexedDB abstraction layer in `src/js/db.js` — export async functions: `openDB()` (opens `todo-db` v1, creates `tasks` objectStore with `{ keyPath: "id", autoIncrement: true }`), `getAllTasks()`, `addTask(title)` (stores `{ title, completed: false, createdAt: new Date().toISOString() }`), `updateTask(id, changes)`, `deleteTask(id)`
- [x] T005 [P] Create `src/index.html` with HTML5 boilerplate: charset UTF-8, viewport meta, title "Simple Todo App", link to `css/styles.css`, `<script type="module" src="js/app.js">`, and empty `<main>` container with id `app`

**Checkpoint**: `db.js` の全関数が定義済み、`index.html` がブラウザで表示できる状態

---

## Phase 3: User Story 1 - タスクの作成 (Priority: P1) 🎯 MVP

**Goal**: ユーザーがタスク名を入力して追加でき、リストに表示される。ページ再読み込み後も維持される。

**Independent Test**: `src/` を HTTP サーバーで配信し、テキストを入力して「追加」をクリック → リストに表示される。ページ再読み込み後もタスクが残る。空入力で送信するとエラーメッセージが出る。

- [x] T006 [P] [US1] Add base layout styles in `src/css/styles.css`: CSS reset, body font/margin, `#app` max-width centering, `h1` heading, `#task-form` flex layout with input growing and button fixed-width, input/button border and padding styles
- [x] T007 [US1] Add task form and list HTML inside `<main id="app">` in `src/index.html`: `<h1>Simple Todo App</h1>`, `<form id="task-form">` containing `<input type="text" id="task-input" placeholder="タスクを入力...">` and `<button type="submit">追加</button>`, `<p id="error-msg" hidden>タスク名を入力してください</p>`, `<ul id="task-list"></ul>` (depends on T005)
- [x] T008 [US1] Implement `src/js/app.js`: import `{ openDB, getAllTasks, addTask }` from `./db.js`; on DOMContentLoaded call `renderTaskList()`; `renderTaskList()` calls `getAllTasks()` and renders each task as `<li>` with checkbox, label, and delete button (stubs for now); form submit handler: trim input value, show/hide `#error-msg`, call `addTask(title)`, clear input, call `renderTaskList()` (depends on T004, T007)
- [x] T009 [US1] Add validation UX in `src/js/app.js` and `src/css/styles.css`: on empty submit add `.error` class to `#task-input` and show `#error-msg`; on valid input remove `.error` class and hide `#error-msg`; add `.error` style (red border) to `src/css/styles.css` (depends on T008)

**Checkpoint**: タスク作成・リスト表示・バリデーション・永続化がすべて動作する（US1 独立テスト合格）

---

## Phase 4: User Story 2 - タスクの完了 (Priority: P2)

**Goal**: ユーザーがチェックボックスをクリックしてタスクの完了・未完了を切り替えられる。視覚的に区別され、再読み込み後も状態が維持される。

**Independent Test**: タスクが1件以上ある状態でチェックボックスをクリック → 打ち消し線が表示される。再読み込み後も完了状態が維持される。チェックを外すと未完了に戻る。

- [x] T010 [US2] Add completion toggle handler in `src/js/app.js`: import `updateTask` from `./db.js`; in `renderTaskList()`, set checkbox `checked` state from `task.completed` and add `dataset.id` to `<li>`; add `change` event listener on each checkbox that calls `updateTask(task.id, { completed: e.target.checked })` then calls `renderTaskList()` (depends on T008)
- [x] T011 [US2] Add completed task visual styles in `src/css/styles.css`: `li.completed label { text-decoration: line-through; color: #888; }` and apply `.completed` class to `<li>` in `renderTaskList()` when `task.completed === true` (depends on T010)

**Checkpoint**: 完了トグル・視覚変化・永続化がすべて動作する（US2 独立テスト合格）

---

## Phase 5: User Story 3 - タスクの削除 (Priority: P3)

**Goal**: ユーザーが削除ボタンを押してタスクをリストから完全に削除できる。0件時は空状態メッセージが表示される。

**Independent Test**: タスクが1件以上ある状態で「削除」ボタンをクリック → リストから消える。再読み込み後も復元されない。全削除後は「タスクがありません」が表示される。

- [x] T012 [US3] Add delete handler in `src/js/app.js`: import `deleteTask` from `./db.js`; in `renderTaskList()`, render `<button class="delete-btn">削除</button>` in each `<li>`; add `click` event listener on delete button that calls `deleteTask(task.id)` then calls `renderTaskList()` (depends on T010)
- [x] T013 [US3] Add empty state display in `src/js/app.js` and `src/css/styles.css`: in `renderTaskList()`, if tasks array is empty render `<li class="empty-state">タスクがありません</li>` instead of task items; add `.empty-state` style (gray, italic, centered) to `src/css/styles.css` (depends on T012)

**Checkpoint**: 削除・空状態メッセージがすべて動作する（US3 独立テスト合格）

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: コード品質・スタイル完成度・テストカバレッジの向上

- [x] T014 Write unit tests for `src/js/db.js` in `tests/unit/db.test.js` using `fake-indexeddb`: test `addTask()` saves record, `getAllTasks()` returns all records, `updateTask()` modifies `completed` field, `deleteTask()` removes record (depends on T004, T002)
- [x] T015 [P] Add edge case styles in `src/css/styles.css`: `word-break: break-word` on task label for long titles; `max-height` + `overflow-y: auto` on `#task-list` for many tasks; delete button hover/focus styles; responsive max-width for mobile
- [x] T016 Run manual acceptance test per `quickstart.md`: start local HTTP server, verify all acceptance scenarios from spec.md (タスク作成・完了・削除・空入力バリデーション・ページ再読み込み後の永続化)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 依存なし — 即時開始可能
- **Foundational (Phase 2)**: Phase 1 完了後 — 全ユーザーストーリーをブロック
- **User Story Phases (3–5)**: Phase 2 完了後に順次または並行で実行可能
- **Polish (Phase 6)**: 全ユーザーストーリー完了後

### User Story Dependencies

- **US1 (P1)**: Phase 2 完了後に開始可能（他ストーリーへの依存なし）
- **US2 (P2)**: Phase 3 の T008 完了後に開始可能（`renderTaskList()` が必要）
- **US3 (P3)**: Phase 4 の T010 完了後に開始可能（`renderTaskList()` の完成版が必要）

### 各ストーリー内の順序

```
db.js (T004) → index.html シェル (T005)
  └→ US1: CSS (T006) → HTML (T007) → app.js (T008) → バリデーション (T009)
       └→ US2: トグルハンドラ (T010) → 完了スタイル (T011)
            └→ US3: 削除ハンドラ (T012) → 空状態 (T013)
```

### 並行実行の機会

- T002 と T003 は並行実行可能（別ファイル）
- T004 と T005 は並行実行可能（別ファイル）
- T006 と T007 は並行実行可能（CSS と HTML は独立）
- T014 と T015 は並行実行可能（テストとスタイルは独立）

---

## Parallel Example: Phase 2

```
並行実行可能:
  Task T004: "src/js/db.js の IndexedDB レイヤー実装"
  Task T005: "src/index.html の HTML5 ボイラープレート作成"
```

---

## Implementation Strategy

### MVP First（User Story 1 のみ）

1. Phase 1: Setup 完了（T001–T003）
2. Phase 2: Foundational 完了（T004–T005）— **CRITICAL**
3. Phase 3: User Story 1 完了（T006–T009）
4. **STOP & VALIDATE**: ブラウザでタスク作成・表示・永続化を手動確認
5. 必要であればデモ/レビュー

### Incremental Delivery

1. Setup + Foundational → 基盤完成
2. User Story 1 → 検証 → デモ（MVP）
3. User Story 2 → 検証 → デモ
4. User Story 3 → 検証 → デモ
5. Polish → 最終品質確認

---

## Notes

- [P] タスクは異なるファイルを対象としており依存関係なし
- [Story] ラベルはスペックのユーザーストーリーとのトレーサビリティを確保
- 各ユーザーストーリーは独立してテスト可能な状態で完成させること
- ES Modules は `file://` で動作しないため、必ずローカル HTTP サーバー経由でテストすること
- IndexedDB は非同期 API のため、`app.js` 内の全 DB 呼び出しは `async/await` で処理すること
