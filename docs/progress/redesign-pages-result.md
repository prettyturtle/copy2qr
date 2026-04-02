## 구현 결과: 페이지 및 컴포넌트 디자인 — Claude/Anthropic 디자인 시스템 교체

### 상태: OK

### 변경 파일

- `src/components/QRCodeDisplay.tsx`:
  - QR 컨테이너 shadow: `shadow-[0_0_32px_rgba(124,90,240,0.2)]` → `shadow-[rgba(0,0,0,0.20)_0px_4px_24px]` (보라 글로우 제거, whisper shadow 적용)
  - 빈 상태 텍스트 및 에러 텍스트: `var(--color-text-muted)` → `text-[#87867f]`
  - 에러 보더: `border-red-400/30` → `border-[#b53333]/30`

- `src/components/ActionBar.tsx`:
  - 별도 스타일 변경 불필요 (Button 컴포넌트 variant 기반 렌더링, 컴포넌트 변경 자동 반영)

- `src/components/ImageViewer.tsx`:
  - 닫기 버튼 hover: `hover:bg-white/10` → `hover:bg-[#30302e]`
  - focus-visible outline: `var(--color-accent-violet)` → `#c96442`
  - 줌 버튼 hover: `hover:bg-white/8 active:bg-white/12` → `hover:bg-[#30302e] active:bg-[#4d4c48]`
  - 줌 버튼 보더: `var(--color-border-glass)` → `border-[#4d4c48]`
  - 줌 버튼 텍스트: `var(--color-text-primary)` → `text-[#faf9f5]`
  - 이미지 영역 보더: `var(--color-border-subtle)` → `border-[#30302e]`
  - 리셋 버튼 hover: `hover:bg-white/8` → `hover:bg-[#30302e]`
  - 헤더 텍스트: `var(--color-text-secondary)` → `text-[#87867f]`
  - 배율 표시 텍스트: `var(--color-text-secondary)` → `text-[#b0aea5]`
  - 전체 `var(--color-*)` 참조 제거 완료

- `src/pages/HomePage.tsx`:
  - ImageSizeDialog 배경: `bg-white/8 backdrop-blur-xl` → `bg-[#30302e]` (글래스모피즘 제거)
  - ImageSizeDialog 보더: `border-amber-400/30` → `border-[#c96442]/30`
  - 경고 아이콘: `text-amber-400` → `text-[#c96442]`
  - 제목 텍스트: `var(--color-text-primary)` → `text-[#faf9f5]`
  - 설명 텍스트: `var(--color-text-muted)` → `text-[#87867f]`
  - "줄여서 공유" 버튼: `var(--color-accent-violet)/20, /40` → `#c96442/20, /40` (테라코타 CTA)
  - "미리보기만" 버튼: `bg-white/5 border-white/15 var(--color-text-secondary)` → `bg-[#30302e] border-[#4d4c48] text-[#87867f]`
  - 클립보드 미지원 알림: `bg-white/8 backdrop-blur-xl border-red-400/30` → `bg-[#30302e] border-[#b53333]/30`
  - 알림 텍스트: `var(--color-text-secondary)` → `text-[#b0aea5]`
  - 전체 `var(--color-*)` 참조 제거 완료

- `src/pages/SharePage.tsx`:
  - 공유 배너 뱃지: `var(--color-text-muted)` → `text-[#87867f]`, `var(--color-border-subtle) bg-white/[0.03]` → `border-[#30302e] bg-[#30302e]`
  - 에러 카드 아이콘: `var(--color-text-muted)` → `text-[#87867f]`
  - 에러 카드 제목: `var(--color-text-primary)` → `text-[#faf9f5]`
  - 에러 카드 설명: `var(--color-text-secondary)` → `text-[#b0aea5]`
  - 에러 카드 링크: `var(--color-accent-violet)` → `text-[#d97757]`, hover `var(--color-accent-blue)` → `#c96442`
  - 로딩 텍스트: `var(--color-text-muted)` → `text-[#87867f]`
  - 타입 라벨 (텍스트/링크/이미지): `var(--color-text-muted)` → `text-[#87867f]` (3개소)
  - 본문 텍스트: `var(--color-text-primary)` → `text-[#faf9f5]`
  - URL 링크: `var(--color-accent-blue)` → `text-[#d97757]` (코랄), hover → `#c96442`
  - 이미지 썸네일 보더: `var(--color-border-subtle)` → `border-[#30302e]`
  - 하단 링크: `var(--color-text-secondary)` → `text-[#b0aea5]`, hover → `#d97757`
  - 전체 `var(--color-*)` 참조 제거 완료

### 생성된 테스트 파일

없음 (스타일 전용 변경 — 테스트 스킵 조건 해당)

### 검증 결과

- 디자인 셀프체크: 수정 4건
  - 디자인 수정: `shadow-[0_0_32px_rgba(124,90,240,0.2)]` 보라 글로우 shadow → whisper shadow
  - 디자인 수정: `bg-white/8 backdrop-blur-xl` 글래스모피즘 → `bg-[#30302e]` (2개소 HomePage)
  - 디자인 수정: `text-amber-400` → `text-[#c96442]` 테라코타 일관성
  - 디자인 수정: accent-violet/accent-blue 링크 색상 → 코랄/테라코타 톤
- 새 테스트: SKIP (스타일 변경만)
- 기존 테스트 회귀: SKIP (테스트 미생성)

### 적용된 디자인 토큰 매핑

| 이전 토큰 | 새 토큰 | 용도 |
|-----------|---------|------|
| `var(--color-text-primary)` | `#faf9f5` | 주요 텍스트 |
| `var(--color-text-secondary)` | `#b0aea5` | 보조 텍스트 |
| `var(--color-text-muted)` | `#87867f` | 흐린 텍스트 |
| `var(--color-border-subtle)` | `#30302e` | 테두리 |
| `var(--color-border-glass)` | `#4d4c48` | 버튼 테두리 |
| `var(--color-accent-violet)` | `#c96442` | Primary CTA (테라코타) |
| `var(--color-accent-blue)` | `#d97757` | 링크 색상 (코랄) |
| `bg-white/8 backdrop-blur-xl` | `bg-[#30302e]` | 카드/다이얼로그 배경 |
| `border-amber-400/30` | `border-[#c96442]/30` | 경고 보더 |
| `border-red-400/30` | `border-[#b53333]/30` | 에러 보더 |
| `shadow-[0_0_32px_rgba(124,90,240,0.2)]` | `shadow-[rgba(0,0,0,0.20)_0px_4px_24px]` | QR 컨테이너 shadow |
