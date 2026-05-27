# Implementation Plan: Simple Todo App

**Branch**: `001-todo-app` | **Date**: 2026-05-11 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-todo-app/spec.md`

## Summary

シンプルな Todo Web アプリケーション。タスクの作成・完了・削除をブラウザ上で管理する。
フロントエンド専用（サーバーなし）で、IndexedDB を永続ストレージとして使用する。
バニラ HTML/CSS/JavaScript（ES Modules）でビルドステップなしに動作する。

## Technical Context

**Language/Version**: HTML5 / CSS3 / JavaScript (ES2020+, ES Modules)  
**Primary Dependencies**: なし（ゼロ依存、テストのみ vitest + fake-indexeddb）  
**Storage**: IndexedDB（ブラウザ内蔵、非同期 API）  
**Testing**: vitest + fake-indexeddb（ユニット）、手動テスト（UI/受け入れ）  
**Target Platform**: モダンウェブブラウザ（Chrome 80+, Firefox 75+, Safari 14+, Edge 80+）  
**Project Type**: フロントエンド専用 Web アプリケーション（SPA）  
**Performance Goals**: 操作後 100ms 以内に UI 反映  
**Constraints**: ビルドツール不要、オフライン動作可能、ゼロサーバー依存  
**Scale/Scope**: シングルユーザー、タスク数 数百件以内

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

`constitution.md` はテンプレートのプレースホルダーのみを含み、有効な原則が定義されていない。
アクティブなゲートなし — 全フェーズを通過。

**Post-design re-check**: 変更なし。設計はシンプルな単一フロントエンド構成であり問題なし。

## Project Structure

### Documentation (this feature)

```text
specs/001-todo-app/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/
│   └── ui-contract.md   # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── index.html          # エントリーポイント（ES Module として app.js を読み込む）
├── css/
│   └── styles.css      # 全スタイル（レイアウト・完了状態の視覚表現など）
└── js/
    ├── app.js          # メインロジック（イベントハンドリング・DOM 操作・UI 更新）
    └── db.js           # IndexedDB 抽象レイヤー（open/addTask/getAllTasks/updateTask/deleteTask）

tests/
└── unit/
    └── db.test.js      # db.js のユニットテスト（fake-indexeddb でモック）

package.json            # devDependencies のみ（vitest, fake-indexeddb）
```

**Structure Decision**: フロントエンド専用の単一プロジェクト構成（Option 1 相当）。
バックエンドなし。ビルドツールなし。テストツールのみ devDependencies に含む。

## Complexity Tracking

> 有効な Constitution Check がないため、このセクションは省略。
