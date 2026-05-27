# Data Model: Simple Todo App

**Branch**: `001-todo-app` | **Date**: 2026-05-11 | **Phase**: 1 — Design

## Entities

### Task

ユーザーが管理する作業単位。Todo アプリの唯一のエンティティ。

| Field        | Type      | Required | Description                                      |
|--------------|-----------|----------|--------------------------------------------------|
| `id`         | number    | auto     | IndexedDB 自動採番の主キー（keyPath）             |
| `title`      | string    | yes      | タスク名。空文字・空白のみは禁止（FR-007）        |
| `completed`  | boolean   | yes      | 完了状態。デフォルト: `false`                    |
| `createdAt`  | string    | yes      | 作成日時。ISO 8601 形式（例: `2026-05-11T09:00:00.000Z`） |

**Validation Rules**:
- `title`: 1文字以上（空白トリム後）、上限 500 文字
- `completed`: `true` または `false` のみ
- `createdAt`: タスク作成時に一度だけセットし、以後変更不可

**State Transitions**:

```
未完了 (completed: false)
    │  チェックボックスをオン
    ▼
完了済み (completed: true)
    │  チェックボックスをオフ
    ▼
未完了 (completed: false)
    │  削除ボタンを押す（どちらの状態からも可）
    ▼
[削除済み / 存在しない]
```

---

## IndexedDB Schema

**Database**: `todo-db` (version: 1)

**Object Store**: `tasks`

```
objectStore("tasks", { keyPath: "id", autoIncrement: true })
```

**Indexes**: なし（全件取得のみ使用するためインデックス不要）

---

## CRUD Operations

| Operation       | Method             | Description                            |
|-----------------|--------------------|----------------------------------------|
| 全件取得        | `getAllTasks()`     | `tasks` ストアの全レコードを配列で返す |
| 追加            | `addTask(title)`   | `title` を受け取り Task を作成して保存 |
| 完了状態の更新  | `updateTask(id, changes)` | 指定 ID の `completed` フィールドを更新 |
| 削除            | `deleteTask(id)`   | 指定 ID のレコードを削除               |

---

## Sample Data

```json
[
  {
    "id": 1,
    "title": "買い物リストを作る",
    "completed": false,
    "createdAt": "2026-05-11T09:00:00.000Z"
  },
  {
    "id": 2,
    "title": "プロジェクト計画書を書く",
    "completed": true,
    "createdAt": "2026-05-11T09:05:00.000Z"
  }
]
```
