---
level: L3
confidence: high
estimated_files: 18
has_schema_change: false
has_external_dependency: true
recommended_pipeline: clarify → planner → build-orchestrator → cleanup
key_constraints:
  - "프론트엔드 전용 (백엔드 없음) — 데이터 공유는 URL 인코딩 방식"
  - "QR 코드 용량 한계 ~4KB — 데이터 압축 필수"
  - "이미지 공유 시 크기 제한 — 초과 시 얼럿으로 안내"
  - "Arrow function 필수"
  - "시멘틱 HTML 필수"
  - "다크모드 + 글래스모피즘 디자인"
  - "React + Vite + TypeScript + Tailwind CSS"
downstream: ["plan"]
---

# Copy2QR 요구사항

## 개요
클립보드에 복사한 콘텐츠(텍스트, URL, 이미지)를 웹 페이지에 붙여넣으면 미리보기와 QR 코드를 생성하고, 링크 또는 QR 스캔으로 다른 사람에게 공유할 수 있는 프론트엔드 유틸리티 앱.

## 프로젝트 컨텍스트
| 항목 | 내용 |
|------|------|
| 기술 스택 | React 19 + Vite + TypeScript + Tailwind CSS v4 |
| 아키텍처 | SPA, React Router (메인뷰 / 공유뷰), 프론트엔드 전용 |
| QR 라이브러리 | qrcode.react (React 컴포넌트 기반 QR 생성) |
| 압축 | lz-string (URL-safe 압축/해제) |
| 관련 기존 모듈 | 없음 (신규 프로젝트) |

## 목적 및 배경
- **해결할 문제**: 텍스트, URL, 이미지 등을 다른 디바이스/사람에게 빠르게 전달하려면 여러 단계가 필요함
- **기대 효과**: 붙여넣기 한 번으로 QR 코드 + 공유 링크가 즉시 생성되어 빠른 공유 가능
- **대상 사용자**: 디바이스 간 데이터 전송이 필요한 일반 사용자

## 기능 요구사항

### Must-have (필수)

#### FR-1: 클립보드 붙여넣기 + 타입 감지
- [ ] 페이지 어디서든 Ctrl+V / Cmd+V로 클립보드 데이터 수신
- [ ] 붙여넣은 데이터의 타입 자동 감지 (텍스트 / URL / 이미지)
- [ ] URL 패턴 감지: http(s)://로 시작하는 문자열은 URL 타입으로 분류
- [ ] 이미지: clipboard event의 image/* MIME 타입 감지

#### FR-2: 미리보기 표시
- [ ] 텍스트: 붙여넣은 텍스트를 카드 형태로 표시
- [ ] URL: 링크 형태로 표시 (클릭 가능)
- [ ] 이미지: 썸네일 미리보기 표시

#### FR-3: 미리보기 편집
- [ ] 텍스트: 인라인 편집 가능 (textarea)
- [ ] URL: 인라인 편집 가능 (input)
- [ ] 편집 시 QR 코드가 실시간으로 갱신됨
- [ ] 이미지: 편집 불가 (읽기 전용 미리보기)

#### FR-4: QR 코드 생성
- [ ] 붙여넣기 즉시 QR 코드 자동 생성
- [ ] 텍스트/URL: 공유 URL을 QR 코드로 인코딩
- [ ] 이미지: 압축된 이미지 데이터를 포함한 공유 URL을 QR 코드로 인코딩
- [ ] QR 코드 이미지 다운로드 기능

#### FR-5: 링크 공유
- [ ] 데이터를 lz-string으로 압축 → URL-safe base64 인코딩 → URL hash에 포함
- [ ] URL 형식: `https://domain/#/share?data={압축된데이터}&type={text|url|image}`
- [ ] "링크 복사" 버튼 클릭 시 공유 URL을 클립보드에 복사
- [ ] 복사 완료 시 토스트 알림 표시

#### FR-6: 이미지 크기 제한
- [ ] 붙여넣은 이미지가 공유 가능 크기를 초과하면 사용자에게 선택지 제공:
  - "이미지를 줄여서 공유" — canvas로 리사이즈 후 공유 진행
  - "원본 미리보기만" — 미리보기는 표시하되 QR/공유 기능은 비활성화
- [ ] 리사이즈 시 최대 300x300, JPEG 품질 조절로 URL 허용 범위 내 압축
- [ ] 리사이즈 후에도 URL 길이가 한계(~8KB)를 초과하면 "이미지가 너무 큽니다" 얼럿 표시 → QR/공유 비활성화
- [ ] 공유 가능 크기 이하의 이미지는 확인 없이 바로 처리

#### FR-7: 공유 데이터 뷰어
- [ ] QR 스캔 또는 링크 접속 시 공유 데이터를 보여주는 뷰 표시
- [ ] URL hash에서 데이터를 디코딩 + 해제하여 원본 복원
- [ ] 텍스트: 내용 표시 + "복사" 버튼
- [ ] URL: 내용 표시 + "이동" 버튼 + "복사" 버튼
- [ ] 이미지: 이미지 표시 + "복사" 버튼 + "저장" 버튼 + 이미지 뷰어(확대/축소)

#### FR-8: 초기화
- [ ] "초기화" 버튼 클릭 시 모든 상태(붙여넣은 데이터, 미리보기, QR 코드) 리셋
- [ ] 초기 "붙여넣기 대기" 화면으로 복귀

### Nice-to-have (선택)
- [ ] QR 코드 색상/스타일 커스터마이징
- [ ] 붙여넣기 히스토리 (localStorage)
- [ ] PWA 지원 (오프라인 사용)

### Out-of-scope (제외)
- 백엔드 서버 / 데이터베이스
- 사용자 인증/회원가입
- 파일(문서, 동영상 등) 지원 — 텍스트/URL/이미지만
- 다국어 지원 (한국어 기본)

## 비기능 요구사항
- **성능**: QR 코드 생성 200ms 이내, 붙여넣기 → 미리보기 100ms 이내
- **호환성**: Chrome, Safari, Firefox 최신 버전, 모바일 웹 지원
- **UI/UX**: 다크모드 기본, 글래스모피즘(Glassmorphism) 디자인, 미니멀 레이아웃
- **반응형**: 모바일/태블릿/데스크톱 대응 (mobile-first)

## UI/디자인 명세

### 디자인 톤
- **다크 모드 기본**: 어두운 배경 (#0f0f23 계열)
- **글래스모피즘**: 반투명 카드 + backdrop-blur, 미묘한 border
- **미니멀**: 단일 컬럼 중심, 충분한 여백, 불필요한 장식 없음
- **컬러 포인트**: 보라/파랑 그라데이션 계열 액센트

### 레이아웃 구조
- **Header**: 앱 로고/타이틀
- **Main (메인뷰)**:
  - 붙여넣기 대기 영역 (드롭존 스타일)
  - 미리보기 카드 (글래스 효과)
  - QR 코드 표시 영역
  - 액션 바 (링크 복사, QR 다운로드, 초기화)
- **Main (공유뷰)**:
  - 공유된 데이터 표시 카드
  - 타입별 액션 버튼들
  - 이미지 뷰어 (모달)
- **Footer**: 간단한 크레딧

## 영향 범위 (Impact Scope)

### 신규 생성 파일

| 파일 | 용도 |
|------|------|
| `src/main.tsx` | 앱 엔트리 포인트 |
| `src/App.tsx` | 라우터 설정 + 레이아웃 |
| `src/index.css` | Tailwind 글로벌 + 글래스모피즘 커스텀 스타일 |
| `src/pages/HomePage.tsx` | 메인뷰 — 붙여넣기 + 미리보기 + QR |
| `src/pages/SharePage.tsx` | 공유뷰 — 공유 데이터 표시 + 액션 |
| `src/components/layout/Header.tsx` | 공통 헤더 |
| `src/components/layout/Footer.tsx` | 공통 푸터 |
| `src/components/layout/Layout.tsx` | 페이지 래퍼 레이아웃 |
| `src/components/ui/Button.tsx` | 공통 버튼 컴포넌트 |
| `src/components/ui/Card.tsx` | 글래스 효과 카드 컴포넌트 |
| `src/components/ui/Toast.tsx` | 토스트 알림 컴포넌트 |
| `src/components/ui/Modal.tsx` | 이미지 뷰어용 모달 |
| `src/components/PasteZone.tsx` | 붙여넣기 대기 영역 |
| `src/components/Preview.tsx` | 타입별 미리보기 (텍스트/URL/이미지) |
| `src/components/QRCodeDisplay.tsx` | QR 코드 표시 + 다운로드 |
| `src/components/ActionBar.tsx` | 링크복사/QR다운로드/초기화 버튼 모음 |
| `src/components/ImageViewer.tsx` | 이미지 확대/축소 뷰어 |
| `src/hooks/useClipboard.ts` | 클립보드 붙여넣기 이벤트 훅 |
| `src/hooks/useShareData.ts` | 공유 데이터 인코딩/디코딩 훅 |
| `src/hooks/useToast.ts` | 토스트 상태 관리 훅 |
| `src/utils/compress.ts` | lz-string 압축/해제 유틸 |
| `src/utils/detect-type.ts` | 클립보드 데이터 타입 감지 |
| `src/utils/image.ts` | 이미지 리사이즈/압축 유틸 |
| `src/types/index.ts` | 공통 타입 정의 (PasteData, DataType 등) |

## 리스크 평가

> 쉽게 말하면: 이미지 크기 제한과 URL 길이 한계가 가장 큰 리스크이고, 브라우저별 클립보드 API 차이도 주의가 필요합니다.

| 리스크 | 종류 | 심각도 | 대비책 |
|--------|------|--------|--------|
| URL 길이 한계로 큰 데이터 공유 불가 | 기술 | 높음 | lz-string 압축 적용 + 이미지 리사이즈 + 한계 초과 시 얼럿 |
| 브라우저별 클립보드 API 차이 | 기술 | 중간 | Clipboard API + fallback(paste event) 병행 |
| 이미지 base64 인코딩 시 데이터 1.37배 증가 | 기술 | 중간 | canvas 리사이즈로 원본 크기 제한 (최대 200x200 or JPEG 품질 조절) |
| QR 코드가 너무 복잡해 스캔 실패 | 기술 | 중간 | 데이터량에 따라 QR 에러 수정 레벨 조절 + 스캔 불가 시 링크 복사 대안 제공 |

## 요구사항 의존성

- 공통 UI 컴포넌트 (Button, Card, Modal, Toast) → 페이지 컴포넌트
- utils (compress, detect-type, image) → hooks → 페이지 컴포넌트
- 라우터 설정 → 페이지 분기 (메인뷰/공유뷰)

권장 구현 순서: 프로젝트 초기화 → 타입/유틸 → 공통 UI → hooks → 메인뷰(HomePage) → 공유뷰(SharePage)

## 제약 조건
- **기술**: 프론트엔드 전용, 백엔드 없음. 데이터 공유는 URL 인코딩 방식만 사용
- **코딩 컨벤션**: Arrow function 필수, 시멘틱 HTML, 컴포넌트 기반 구조
- **디자인**: 다크모드 기본, 글래스모피즘, 미니멀

## 인수 기준 (Acceptance Criteria)
- [ ] 텍스트를 붙여넣으면 미리보기 + QR 코드가 즉시 표시됨
- [ ] URL을 붙여넣으면 URL 타입으로 감지되어 링크 형태 미리보기 표시됨
- [ ] 이미지를 붙여넣으면 썸네일 미리보기 표시됨 (큰 이미지는 얼럿)
- [ ] 미리보기에서 텍스트를 수정하면 QR 코드가 실시간 갱신됨
- [ ] "링크 복사" 클릭 시 공유 URL이 클립보드에 복사되고 토스트 표시됨
- [ ] 공유 URL 접속 시 원본 데이터가 정확히 복원되어 표시됨
- [ ] 공유뷰에서 텍스트 "복사", URL "이동"/"복사", 이미지 "복사"/"저장"/"뷰어" 동작함
- [ ] "초기화" 클릭 시 모든 상태가 리셋되고 붙여넣기 대기 화면으로 복귀함
- [ ] 모바일에서 반응형 레이아웃이 정상 동작함
- [ ] 글래스모피즘 + 다크모드 디자인이 적용됨

## 미결 사항
- QR 코드 다운로드 파일 형식 (PNG? SVG?)
- 토스트 자동 사라짐 시간 (2초? 3초?)
