# Project Rules — Davion AI

- **Project Name:** Davion AI
- **Repository Root:** `c:\Users\Despair\Projects\Web_and_AI\Davion-AI`
- **Source of Truth (Implementation State):** This Git repository (`main` branch).
- **Source of Truth (Project Knowledge):** Notion root page `Davion AI` (currently `PENDING_NOTION_SYNC` — see `docs/ai/PENDING_NOTION_SYNC.md`).

## 1. Core Operating Workflow

Follow this sequence for all work:

```text
Detect Runtime -> Read Context -> Inspect Repository -> Understand Task -> Plan -> Implement -> Validate -> Update Knowledge -> Sync Notion or Record Pending Sync -> Update Context
```

## 2. Mandatory Rules

1. **Verify Runtime & Scope First:** At the start of each session, identify the active AI/host runtime, actual tool capabilities, and repository scope before making changes.
2. **Repository Over Assumptions:** Treat actual inspected files in this repository as the source of truth for implementation state. Distinguish verified facts from requirements, plans, and `UNKNOWN` items.
3. **Read Context Before Changes:** Read `docs/ai/PROJECT_RULES.md`, `docs/ai/AI_CONTEXT.md`, and Notion `01. Current State` / `05. Project Decisions` / `15. Project Memory` (when connected) before significant changes.
4. **Preserve Historical Decisions:** Never delete historical decisions. Mark superseded decisions as `SUPERSEDED` and record the reason for change.
5. **Synchronize Knowledge:** After meaningful changes, update `docs/ai/AI_CONTEXT.md` and synchronize affected Notion sections (`01. Current State`, `05. Project Decisions`, `07. Features & Modules`, `12. Known Issues & Technical Debt`, `13. Progress & Milestones`, `15. Project Memory`, `17. Tasks & Next Steps`, `18. AI Context`).
6. **Fallback When Notion Is Unavailable:** Never claim Notion is synced when write access is unavailable. Record unsynchronized updates in `docs/ai/PENDING_NOTION_SYNC.md` with clear `PENDING_NOTION_SYNC` status.
7. **Security & Privacy:** Never store passwords, API keys, tokens, credentials, secrets, or sensitive patient/personal data (PHI/PII) in Notion, rules, context files, or logs. Use placeholders (e.g., `API_KEY=<API_KEY>`).
8. **Factual Reporting:** Report validation, test results, and tool actions strictly as observed. Mark unrun checks as `VALIDATION_NOT_RUN`.
9. **No Cross-Session Memory Assumptions:** Never assume persistent memory or automatic context loading across sessions or AI systems. Always load rules and context explicitly.

## 3. How to Load Rules & Context in a New Session

Because native project auto-loading is not verified across all AI runtimes (`ACTIVE_AI_INSTRUCTION_TARGET = NONE`), load context explicitly at the start of any session:

1. Read `docs/ai/PROJECT_RULES.md` (this file).
2. Read `docs/ai/AI_CONTEXT.md` for current objective, state, and handoff notes.
3. Check `docs/ai/PENDING_NOTION_SYNC.md` if Notion has not yet been synchronized.
4. If Notion is connected, search for root page `Davion AI` and read `18. AI Context` and `01. Current State`.
