---
id: "index-20251117"
type: "overview"
title: "Context Dashboard"
owner: "agent/web-fe"
status: "ready"
created_at: "2025-11-17T08:30:11Z"
updated_at: "2025-11-19T04:28:54Z"
tags: ["dashboard"]
links:
  pr: []
  issues: []
  refs:
    - "/context/specs/sammok-game.md"
confidential: false
---

## 현재 상황
- 진행 중 작업: 없음 (다음 스프린트 계획 중)
- 최근 완료: 
  - 보드 사이즈 config 적용 및 동적 보드 크기 지원
  - Diagonal 돌 추가 (대각선 4방향 피해)
  - Config 시스템 개선 (stoneStats를 config로 관리)
  - Persistent 돌 추가 (라인 완성 시에도 제거되지 않음)
- 백로그: [bl-20251117-sammok-core-game](/context/backlog/bl-20251117-sammok-core-game.md)
- 최신 스펙: [Sammok 게임 사양](/context/specs/sammok-game.md)

## 최근 결정 / 문서
- 시스템 개요: `/context/architecture/00-system-overview.md`
- 주간 로그: `/context/changelog/weekly-2025-W47.md`
- 최근 변경사항:
  - 보드 사이즈를 config로 관리하여 런타임 조정 가능
  - 돌 타입 확장: Diagonal(대각선 피해), Persistent(라인 완성 시 유지)
  - GameConfig에 stoneStats 통합으로 돌의 최대 HP 등 동적 조정 가능

## 다음 단계
- 게임 밸런싱/애니메이션 폴리시 및 UI 접근성 다듬기
- AI 전략 고도화(차단 우선순위/가중치 튜닝) 및 리플레이 툴링
- Playwright E2E 워크플로우를 CI에 통합

## 참고
- 로드맵: `/context/roadmap-2025.md`
- 마일스톤: `/context/milestone-2025-Q4.md`
- 용어집: `/context/glossary.md`

