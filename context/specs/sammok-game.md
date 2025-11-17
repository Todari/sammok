---
id: "spec-20251117-sammok-game"
type: "spec"
title: "Sammok 5×5 변형 게임 사양"
owner: "agent/web-fe"
status: "ready"
created_at: "2025-11-17T08:30:11Z"
updated_at: "2025-11-17T08:30:11Z"
tags: ["gameplay", "frontend", "ai"]
links:
  pr: []
  issues: []
  refs: []
confidential: false
---

## Summary
- 5×5 보드에서 삼목 규칙을 확장하여 HP 기반 전투를 진행하는 React+TS 웹게임 요구사항 정리.
- 플레이어는 핸드 3개 중 하나를 선택해 배치하고, 특수 효과와 라인 데미지로 상대 HP를 0 이하로 만든다.
- 백 빌딩과 씨드 가능한 RNG를 통해 리플레이 가능한 시스템을 설계한다.

## Core Mechanics
1. **턴 구조**: `P1 → AI` 순환, 매 턴 핸드에서 돌 1개를 배치. 핸드가 비면 즉시 백에서 3개를 무작위 가중치로 보충한다.
2. **보드 판정**: 가로/세로/대각 연속 3개 이상 라인을 완성하면 해당 라인의 데미지가 누적 적용되며, Strong 돌 수만큼 라인 데미지가 가산된다. 완성된 라인에 포함된 돌은 즉시 제거되어 각 소유자의 백으로 되돌아간다.
3. **돌 특수 효과**  
   - Strong: 제거 시 라인당 +1 보너스.  
   - Tough: HP 3.  
   - Cross: 배치 즉시 상하좌우에 피해 1.  
   - AoE: 배치 즉시 8방향 피해 1.  
   - Kamikaze: 다른 돌의 피해로 파괴되는 순간 적 HP -1.
4. **효과 처리 순서**: OnPlace → 부서짐/자폭 → 라인 판정 → 턴 종료 → 교대.
5. **승패 조건**: 상대 HP ≤ 0이면 즉시 승리. 백 고갈로 핸드 리필이 불가하면 패배.

## Systems
- **Bag/Hand**: 플레이어별(각각 10슬롯) 독립 백을 유지한다. 제거된 돌은 소유자 백으로 즉시 귀환하며, 샘플링은 가중치 랜덤. 초기 구성은 양측 모두 `{Strong:2, Tough:1, Cross:2, AoE:2, Kamikaze:1, Basic:2}`에서 시작한다.
- **AI 전략 인터페이스**: 즉시 승리 가능 위치 → 상대 차단 → 효과 기대값 → 랜덤 순 우선순위를 따르는 기본 봇. BotStrategy를 주입식으로 설계해 향후 교체가 용이해야 한다.
- **State 모델**: `GameState` 및 관련 타입은 Prompt 제시 타입을 준수하고, Config를 단일 소스(`/src/core/config.ts`)로 관리.
- **RNG**: `seedrandom` 등 씨드 가능한 RNG를 core/rng 모듈로 래핑해 재현성 확보.

## UI / UX
- 좌측: 5×5 보드. 클릭/탭 또는 키보드(화살표+스페이스)로 배치. 셀 색상은 플레이어별 테마 적용.
- 우측: HP 바, 핸드 UI(선택 강조), 백 구성 뷰, 로그 패널. 모바일 터치와 키보드 접근성 제공.
- 선택한 Cross/AoE 돌을 보드에 호버 시 영향 범위 하이라이트. HP=1 상태는 크랙 스타일로 시각화.
- 애니메이션: 완성/피해에 200~300ms 페이드/진동 효과. 다크/라이트 테마 토글 제공.

## Tech Stack & Structure
- React 18 + TypeScript + Vite. Zustand(+immer)로 상태 관리. core/rules에 게임 로직 집중. UI 컴포넌트는 `src/ui/*`에 프레젠테이션 전용으로 배치.
- 테스트: Vitest(유닛) 및 Playwright(E2E). 리플레이 검증을 위해 Seed 고정 테스트 포함.
- 스타일: Tailwind 우선. 테마 토글을 위한 CSS 변수(primary/danger/grid 등) 정의.

## Acceptance Criteria
1. 5×5 보드 클릭/터치 배치와 핸드 리필이 규칙대로 동작.
2. Cross/AoE OnPlace 효과 및 미리보기 하이라이트.
3. 라인 판정/Strong 보너스/돌 제거 및 백 귀환 동작.
4. Kamikaze 돌이 다른 돌에게 파괴될 때에만 적 HP가 즉시 감소.
5. 백 고갈/HP 0 상태에서 승패 처리 및 로그 기록.
6. 기본 AI 전략 적용, Seed 고정 시 동일 시퀀스 재현.
7. Vitest/Playwright 일부 테스트 녹색.
8. UI에 HP 바, 핸드, 백, 로그 패널, 테마 토글 존재.

## Evidence
- Prompt 기반 요구사항: Sammok 변형 게임 스펙 (2025-11-17).

