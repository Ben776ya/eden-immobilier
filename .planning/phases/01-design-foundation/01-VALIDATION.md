---
phase: 1
slug: design-foundation
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-04-08
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | No test framework detected — visual validation via build + manual |
| **Config file** | none — no test runner installed |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build && npm run lint` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run build && npm run lint`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 1-01-01 | 01 | 1 | CLR-01 | build | `npm run build` | ✅ | ⬜ pending |
| 1-01-02 | 01 | 1 | CLR-02 | build | `npm run build` | ✅ | ⬜ pending |
| 1-01-03 | 01 | 1 | CLR-03 | grep | `grep -cE "'gold-deep':\|'gold-light':" tailwind.config.ts` | ✅ | ⬜ pending |
| 1-01-04 | 01 | 1 | CLR-04 | visual | manual — inspect dark/light zones | N/A | ⬜ pending |
| 1-01-05 | 01 | 1 | CLR-05 | grep | `grep -c "WCAG" .planning/phases/01-design-foundation/01-RESEARCH.md` | ✅ | ⬜ pending |
| 1-02-01 | 02 | 2 | TYP-01 | grep | `grep -c "Outfit" app/layout.tsx` | ✅ | ⬜ pending |
| 1-02-02 | 02 | 2 | TYP-02 | build | `npm run build` | ✅ | ⬜ pending |
| 1-02-03 | 02 | 2 | TYP-03 | grep | `grep "300\|400\|500\|600" app/layout.tsx` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- Existing infrastructure covers all phase requirements (build + lint + grep verification)
- Tasks 1-02-01 and 1-02-03 use inline grep checks against files produced by Plan 01 — no separate test scaffold needed

*No test framework install needed — Phase 1 is a config-level change verified by successful build and grep checks.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Dark header/footer renders correctly | CLR-04 | Visual layout check — no automated way to verify rendered colors | Open site in browser, verify header and footer use dark (#1C1917) background |
| Gold accents visible on decorative elements | CLR-03 | Visual check for correct gold rendering | Inspect gold dividers, borders — should be #C5A47E |
| No invisible text anywhere | CLR-05 | Full visual sweep required | Scroll all pages, verify all text is readable against backgrounds |
| Outfit font renders at all weights | TYP-03 | Font rendering is visual | Check headings (600), body (400), light text (300) render distinct weights |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 15s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved
