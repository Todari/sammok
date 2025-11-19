---
id: "weekly-2025-W47"
type: "weekly"
title: "2025-W47 주간 로그"
owner: "agent/web-fe"
status: "ready"
created_at: "2025-11-17T08:30:11Z"
updated_at: "2025-11-19T04:28:54Z"
tags: ["weekly"]
links:
  pr: []
  issues: []
  refs:
    - "/context/tasks/task-202511170830-context-bootstrap.md"
confidential: false
---

## 이번 주 목표
- Sammok 게임 컨텍스트 부트스트랩
- 핵심 스펙/백로그 정의

## 완료
- `/context/specs/sammok-game.md` 초안 작성
- `/context/backlog/bl-20251117-sammok-core-game.md` 등록
- `web` Vite 앱과 core/game UI/AI 구현, 초기 테스트(Vitest/Playwright) 추가
- **보드 사이즈 config 적용**: 하드코딩된 BOARD_SIZE 제거, config.boardSize를 모든 로직에서 사용하도록 수정
- **Diagonal 돌 추가**: 대각선 4방향에 피해를 주는 새로운 돌 타입 추가
- **Config 시스템 개선**: GameConfig에 stoneStats 추가, getStoneStats가 config를 받아 동적으로 돌 스탯 조회 가능
- **Persistent 돌 추가**: 라인 완성 시에도 제거되지 않는 특수 돌 타입 추가

## 다음주 계획
- AI 전략 고도화 및 밸런싱 플레이터스트
- Playwright E2E 파이프라인 안정화

