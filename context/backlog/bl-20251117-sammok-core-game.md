---
id: "bl-20251117-sammok-core-game"
type: "backlog"
title: "Sammok 5×5 변형 게임 구현"
owner: "agent/web-fe"
status: "doing"
created_at: "2025-11-17T08:30:11Z"
updated_at: "2025-11-17T09:00:16Z"
tags: ["gameplay", "frontend"]
links:
  pr: []
  issues: []
  refs:
    - "/context/specs/sammok-game.md"
    - "/context/tasks/task-202511170900-sammok-mvp.md"
confidential: false
priority: "P1"
area: "web-frontend"
depends_on: []
okrs:
  - objective: "웹 미니게임 MVP 출시"
    key_results:
      - "턴제 삼목 파생 게임 DAU 200 달성"
      - "리플레이 가능한 테스트 인프라 구축"
impact: "Seed RNG 기반 전략 퍼즐 게임 MVP"
rice:
  reach: 1200
  impact: 2
  confidence: 0.7
  effort: 8
wsjf:
  business_value: 8
  time_criticality: 5
  risk_reduction: 4
  job_size: 8
metrics:
  baseline:
    daily_active_users: "0"
    average_sessions_per_user: "0"
  target:
    daily_active_users: "200"
    average_sessions_per_user: "2"
acceptance_criteria:
  - "보드/핸드/백/HP 루프가 요구사항대로 동작"
  - "Strong/AoE/Cross/Kamikaze 효과가 처리 순서대로 반영"
  - "AI가 즉승/차단/랜덤 우선순위를 따른다"
  - "Vitest/Playwright 테스트가 일부라도 통과"
telemetry_spec: "/context/specs/sammok-game.md"
rollout:
  strategy: "1%→10%→50%→100%"
  guardrails:
    - "에러율 5% 이상 시 즉시 롤백"
    - "게임 크래시 0.5% 이상 시 경보"
risk:
  - "AI 난이도 조절 실패로 사용자 이탈"
  - "Bag RNG 편향으로 UX 악화"

