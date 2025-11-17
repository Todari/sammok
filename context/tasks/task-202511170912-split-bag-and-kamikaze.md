---
id: "task-202511170912-split-bag-and-kamikaze"
type: "task"
title: "플레이어별 백/라인 제거/카미카제 규칙 반영"
owner: "agent/web-fe"
status: "done"
created_at: "2025-11-17T09:12:33Z"
updated_at: "2025-11-17T09:12:33Z"
tags: ["gameplay", "balance"]
links:
  pr: []
  issues: []
  refs:
    - "/context/specs/sammok-game.md"
    - "/web/src/core/rules.ts"
    - "/web/src/ui/BagView.tsx"
    - "/web/tests/rules.spec.ts"
confidential: false
origin: "bl-20251117-sammok-core-game"
depends_on: []
---

## Summary
- 사용자 피드백에 따라 플레이어별 독립 백, 라인 완성 시 즉시 제거, Kamikaze 파괴 조건을 반영했다.
- BagView와 Board UI에 소유자 구분을 명확히 표시하고, 문서(`specs`)를 갱신했다.

## Plan
1. BagState/Config를 플레이어별 슬롯으로 재설계하고 draw/return 로직 수정
2. 라인 제거 즉시 백 귀환 및 Kamikaze 파괴 시 HP 감소 로직 구현
3. UI/테스트/문서 업데이트

## Worklog
- 2025-11-17 09:05 UTC: BagState/Config/Store 로직을 플레이어별로 리팩터링
- 2025-11-17 09:08 UTC: Kamikaze 트리거 조건 및 라인 제거/로그 수정, BagView·Board UI 업데이트
- 2025-11-17 09:10 UTC: Vitest 실행 및 스펙 문서/컨텍스트 기록 갱신

## Result
- `web/src/core/rules.ts`, `web/src/core/types.ts`, `web/src/core/config.ts`: 플레이어별 백, 라인 제거, Kamikaze 파괴 조건 구현
- `web/src/ui/BagView.tsx`, `web/src/ui/Board.tsx`: 소유자별 백 뷰와 돌 라벨링
- `web/tests/rules.spec.ts`: Kamikaze 파괴 조건 테스트
- `/context/specs/sammok-game.md`: 규칙 변경사항 문서화

