---
id: "task-202511170900-sammok-mvp"
type: "task"
title: "Sammok 웹게임 MVP 구현"
owner: "agent/web-fe"
status: "done"
created_at: "2025-11-17T09:00:16Z"
updated_at: "2025-11-17T09:00:16Z"
tags: ["frontend", "gameplay"]
links:
  pr: []
  issues: []
  refs:
    - "/web/src/core/rules.ts"
    - "/web/src/ui/Board.tsx"
    - "/web/tests/rules.spec.ts"
confidential: false
origin: "bl-20251117-sammok-core-game"
depends_on: []
---

## Summary
- Vite+React+TS 기반 프로젝트를 초기화하고 Tailwind, Zustand, Vitest, Playwright 스택을 구성하여 Sammok 5×5 변형 게임을 구현했다.
- core/rules.ts에 초기화·배치·라인 판정·OnPlace·Kamikaze·백 빌딩 로직을 통합하고 seedable RNG로 재현성을 확보했다.
- Board/Hud/Hand/Bag/Log UI와 Theme 토글, 키보드/터치 입력을 구현하고 Vitest/Playwright 테스트 스켈레톤을 추가했다.

## Plan
1. Vite React TS 템플릿 및 의존성(zustand/immer/seedrandom/tailwind) 구성
2. core 타입/Config/RNG/Rules/AI/Store 계층 구현
3. UI 컴포넌트, 테마, 상호작용 및 테스트(Vitest, Playwright) 작성

## Worklog
- 2025-11-17 08:35 UTC: Vite 프로젝트 생성, Tailwind/Playwright/Vitest 의존성 설치
- 2025-11-17 08:45 UTC: core/types, config, RNG, rules, AI 전략, Zustand 스토어 구현
- 2025-11-17 08:55 UTC: Board/Hud/Hand 등 UI와 테마/키보드 컨트롤 구현, Vitest & Playwright 테스트 추가 및 실행

## Result
- `web/src/core/rules.ts`: 게임 루프, 백 빌딩, 라인 데미지, Kamikaze 처리
- `web/src/store/gameStore.ts`: Zustand 상태 관리 + AI 턴 로직
- `web/src/ui/*.tsx`: 보드/핸드/HUD/로그/테마 토글 UI
- `web/tests/rules.spec.ts`, `web/e2e/app.spec.ts`: 핵심 규칙 및 E2E 시나리오 테스트
- Vitest 통과(`npm test`), EPERM 경고는 샌드박스 제한으로 보고함

