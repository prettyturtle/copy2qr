## 구현 결과: 디자인 시스템 교체 (CSS + Layout)

### 상태: OK

### 변경 파일

- `src/index.css`: @theme 색상 토큰 전면 교체 (보라/파랑 → 따뜻한 다크). `.glass`, `.glass-subtle`, `.gradient-accent`, `.gradient-accent-text` 유틸리티 제거. `.ring-warm` 신규 추가. 노이즈 그라데이션 배경 제거. 폰트 Georgia serif + system-ui 적용. body line-height 1.60 설정.
- `src/components/layout/Header.tsx`: `glass-subtle` 제거 → `rgba(20,20,19,0.92)` 네비게이션 배경 + `backdrop-blur-md` + `border-b border-[#30302e]` 적용. `gradient-accent-text` 제거 → `#d97757` 코랄 텍스트. 테라코타(`#c96442`) 28x28 rounded-lg 로고 마크 ("C") 추가. 폰트 Georgia serif 적용.
- `src/components/layout/Footer.tsx`: 따뜻한 보더 `border-t border-[#30302e]` 추가. 텍스트 색상 `#87867f` (따뜻한 보조 텍스트) 적용.
- `src/components/layout/Layout.tsx`: 루트 div에 `backgroundColor: '#141413'` 명시적 적용.

### 생성된 테스트 파일

없음 (스타일시트 및 마크업 구조 변경 — 테스트 스킵 조건 해당)

### 검증 결과

- 디자인 셀프체크: 수정 0건 (신규 도입 패턴 모두 통과)
  - 폰트: Georgia serif + system-ui 사용. 금지 폰트(Inter/Roboto 등) 없음
  - 컬러: 순수 검정/흰색 없음. cyan-on-dark/purple gradient 제거 확인
  - 레이아웃: 카드 남용 없음
  - 모션: 기존 키프레임 유지, bounce/elastic/layout 속성 애니메이션 없음
- 새 테스트: SKIP (테스트 미생성)
- 기존 테스트 회귀: SKIP (기존 테스트 없음)

### 주의사항 — 구 토큰 잔존 파일

요청 범위(4개 파일) 외에 아래 파일들이 삭제된 CSS 변수를 여전히 참조합니다.
이 파일들은 별도 태스크로 처리가 필요합니다:

| 파일 | 잔존 패턴 |
|------|----------|
| `src/components/Preview.tsx` | `--color-accent-blue`, `--color-accent-violet` |
| `src/pages/HomePage.tsx` | `--color-accent-violet` |
| `src/components/PasteZone.tsx` | `--color-text-secondary`, `--color-text-muted`, `--color-accent-violet` |
| `src/components/ImageViewer.tsx` | `--color-accent-violet`, `--color-border-glass` |
| `src/pages/SharePage.tsx` | `--color-accent-violet`, `--color-accent-blue` |
| `src/components/ui/Modal.tsx` | `.glass` 클래스 |

### 적용된 색상 토큰 요약

```
--color-bg-page:         #141413   (페이지 배경 — 따뜻한 올리브 블랙)
--color-bg-card:         #30302e   (카드 배경 — 따뜻한 차콜)
--color-bg-nav:          rgba(20,20,19,0.92)
--color-text-primary:    #faf9f5   (기본 텍스트 — 아이보리)
--color-text-secondary:  #87867f   (보조 텍스트 — 따뜻한 회색)
--color-text-tertiary:   #b0aea5   (3차 텍스트)
--color-border:          #30302e
--color-terracotta:      #c96442   (브랜드)
--color-coral:           #d97757   (액센트)
--color-error:           #b53333
--color-focus-blue:      #3898ec   (포커스 — 유일한 쿨톤)
--color-charcoal-warm:   #4d4c48
--color-ring-warm:       #d1cfc5
```

### 롤백 기준점

ROLLBACK_REF: cdffc6e84e6fac442a3e0d1dbe074549edf4e780
