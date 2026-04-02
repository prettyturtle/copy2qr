## 구현 결과: UI 컴포넌트 Claude/Anthropic 디자인 시스템 교체

### 상태: OK

### 변경 파일

- `src/components/ui/Button.tsx`: primary/secondary/ghost variant 전면 교체. 보라/파랑 그라데이션 및 glow shadow 제거. primary → `bg-[#c96442]` + ring shadow 패턴, secondary → `bg-[#141413] border-[#30302e]`, ghost → `hover:bg-[#30302e]/50`. focus-visible → `ring-2 ring-[#3898ec]`
- `src/components/ui/Card.tsx`: `bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl` 제거 → `bg-[#30302e] border border-[#30302e] rounded-xl`. hover shadow를 따뜻한 톤 `rgba(0,0,0,0.20)`으로 교체
- `src/components/ui/Toast.tsx`: glass 스타일(`bg-rgba(22,22,42,0.75) backdrop-blur`) 제거 → `bg-[#30302e] border border-[#4d4c48]` + ring shadow. 텍스트 `text-[#faf9f5]`. 닫기 버튼 hover `bg-[#4d4c48]/50`
- `src/components/ui/Modal.tsx`: 오버레이 `bg-black/60 backdrop-blur` → `bg-[#141413]/80`. 내부 콘텐츠 `glass` 클래스 제거 → `bg-[#30302e] border border-[#30302e] rounded-2xl`
- `src/components/PasteZone.tsx`: 점선 테두리 `border-white/20` → `border-[#4d4c48]`. hover `border-[#b0aea5]/50`. 아이콘/안내 텍스트 `text-[#87867f]`. kbd 요소 `bg-[#4d4c48] border-[#4d4c48]`
- `src/components/Preview.tsx`: textarea `bg-[#141413] border border-[#30302e] text-[#faf9f5] rounded-xl focus:border-[#3898ec]`. URL input 동일 패턴. 링크 색상 `text-[#d97757]` (코랄). 이미지 border `border-[#30302e]`

### 생성된 테스트 파일

없음 (스타일 전용 변경 — 테스트 스킵 조건 해당)

### 검증 결과

- 디자인 셀프체크: PASS (폰트/컬러/레이아웃/모션 위반 없음)
  - 글래스모피즘 완전 제거: backdrop-blur, bg-white/5, bg-white/10 모두 제거
  - 보라/파랑 그라데이션 완전 제거: from-[var(--color-accent-violet)] 등 모두 제거
  - 새로 도입한 컬러: 테라코타(#c96442), 코랄(#d97757), 따뜻한 배경계열(#141413, #30302e, #4d4c48)
- 새 테스트: SKIP (테스트 미생성)
- 기존 테스트 회귀: SKIP (테스트 미생성)

### 적용된 디자인 토큰

| 토큰 | 값 | 용도 |
|------|-----|------|
| `--bg-card` | `#30302e` | Card, Toast, Modal 배경 |
| `--text-primary` | `#faf9f5` | 주요 텍스트 |
| `--text-secondary` | `#87867f` | 보조 텍스트, 아이콘 |
| `--color-terracotta` | `#c96442` | primary CTA |
| `--color-coral` | `#d97757` | 링크 색상 |
| `--color-warm-silver` | `#b0aea5` | secondary 텍스트 |
| `--border-color` | `#30302e` | 카드/인풋 기본 보더 |
| `--color-charcoal-warm` | `#4d4c48` | 활성 보더, kbd, hover 상태 |

### 제거된 패턴

- `backdrop-blur-xl`, `backdrop-blur-[12px]`, `backdrop-blur-[2px]`
- `bg-white/5`, `bg-white/10`, `border-white/10`, `border-white/20`
- `bg-gradient-to-r from-[var(--color-accent-violet)] to-[var(--color-accent-blue)]`
- `shadow-[0_0_16px_rgba(124,90,240,0.35)]` (glow shadow)
- `glass` CSS 클래스
- `var(--color-accent-violet)`, `var(--color-accent-blue)` 참조
