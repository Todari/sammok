---
id: "overview-20251117-system"
type: "overview"
title: "Sammok 시스템 개요"
owner: "agent/web-fe"
status: "ready"
created_at: "2025-11-17T08:30:11Z"
updated_at: "2025-11-17T08:30:11Z"
tags: ["architecture"]
links:
  pr: []
  issues: []
  refs:
    - "/context/specs/sammok-game.md"
confidential: false
---

## Context
- React 18 + Vite SPA에서 5×5 보드 게임 규칙을 구현.
- Zustand 스토어는 core/rules 모듈을 호출해 상태 전이를 수행하고, UI 컴포넌트는 store hook을 통해 상태를 읽는다.
- seedrandom 기반 RNG를 store 초기화 시 주입하여 리플레이/테스트 일관성을 확보한다.

## Components
1. **Core Layer (`src/core`)**
   - `types.ts`: GameState/Config 등 도메인 타입.
   - `config.ts`: 가변 파라미터(HP, bag 구성 등).
   - `rng.ts`: seedable RNG 유틸.
   - `rules.ts`: 초기화, draw/return, 배치, 라인 판정, 데미지 계산, AI 인터페이스.
2. **State Layer (`src/store/gameStore.ts`)**
   - Zustand + immer store.
   - 액션: `init`, `selectHand`, `hoverCell`, `playTurn`, `toggleTheme` 등.
3. **UI Layer (`src/ui`)**
   - `Board`, `Cell`, `Hand`, `Hud`, `BagView`, `LogPanel`, `ThemeToggle`.
   - Tailwind 기반, 접근성(키보드/스크린리더) 고려.
4. **AI Layer (`src/ai/bot.ts`)**
   - `BotStrategy` 인터페이스, 기본 구현 `GreedyHeuristicBot`.

## Data Flow
1. 사용자가 핸드 돌 선택 → `gameStore`에 선택 상태 업데이트.
2. 보드 셀 클릭 → `rules.placeStone` 호출 → OnPlace/라인 판정 → HP/백 상태 갱신 → 로그 기록.
3. 턴 종료 → AI 차례면 `bot.chooseMove` 실행 → 동일한 규칙으로 처리.
4. 상태 변화는 UI 컴포넌트에 전달되어 보드/HP/백 뷰 재렌더.

## Evidence
- `/context/specs/sammok-game.md`

