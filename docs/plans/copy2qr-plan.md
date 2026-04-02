---
upstream: "docs/requirements/copy2qr-requirements.md"
upstream_constraints_verified: true
key_constraints:
  - "from requirements: 프론트엔드 전용 (백엔드 없음) -- 데이터 공유는 URL 인코딩 방식"
  - "from requirements: QR 코드 용량 한계 ~4KB -- 데이터 압축 필수"
  - "from requirements: 이미지 공유 시 크기 제한 -- 초과 시 얼럿으로 안내"
  - "from requirements: Arrow function 필수"
  - "from requirements: 시멘틱 HTML 필수"
  - "from requirements: 다크모드 + 글래스모피즘 디자인"
  - "from requirements: React 19 + Vite + TypeScript + Tailwind CSS v4"
  - "plan decision: qrcode.react로 QR 생성, lz-string으로 URL-safe 압축"
  - "plan decision: React Router v7 hash 기반 라우팅 (SPA, 정적 호스팅 대응)"
  - "plan decision: QR 다운로드 형식은 PNG (범용성), 토스트 자동 사라짐 3초"
level: L3
status: draft
created: 2026-04-02
---

# Copy2QR 태스크 계획서

## 1. 개요

클립보드에 복사한 콘텐츠(텍스트, URL, 이미지)를 웹 페이지에 붙여넣으면 미리보기와 QR 코드를 생성하고, 링크 또는 QR 스캔으로 다른 사람에게 공유할 수 있는 프론트엔드 유틸리티 앱을 신규 구축한다.

**왜**: 디바이스 간 데이터 전송에 여러 단계가 필요한 불편함을 해결하여, 붙여넣기 한 번으로 QR 코드 + 공유 링크를 즉시 생성한다.

## 2. 프로젝트 컨텍스트

| 항목 | 감지 결과 |
|------|----------|
| 기술 스택 | React 19 + Vite + TypeScript + Tailwind CSS v4 |
| 아키텍처 | SPA, React Router (hash 기반), 프론트엔드 전용 |
| 주요 의존성 | qrcode.react, lz-string, react-router |
| 관련 모듈 | 없음 (신규 프로젝트, Initial commit만 존재) |
| 영향 범위 | 신규 생성 24개 파일 (설정 포함) |
| 요구사항 문서 | `docs/requirements/copy2qr-requirements.md` |

## 3. 기술 결정 및 트레이드 오프

### 결정 1: QR 코드 라이브러리 -- qrcode.react vs qr-code-styling

| 기준 | qrcode.react | qr-code-styling |
|------|-------------|-----------------|
| React 통합 | React 컴포넌트 네이티브 | DOM 직접 조작 필요 |
| 번들 크기 | 작음 (~15KB) | 큼 (~50KB) |
| 커스터마이징 | 기본 (색상, 크기) | 풍부 (로고, 그라데이션) |
| 유지보수 | 활발 | 보통 |

**결정**: qrcode.react 채택. 요구사항에 QR 커스터마이징이 nice-to-have이므로 가벼운 라이브러리가 적합하다. React 컴포넌트로 바로 렌더링되어 상태 변경 시 자동 갱신이 자연스럽다.

**수용한 트레이드 오프**: QR 스타일링 자유도가 낮지만, MVP에서는 불필요하다.

### 결정 2: 라우팅 -- Hash Router vs Browser Router

| 기준 | Hash Router | Browser Router |
|------|------------|----------------|
| 정적 호스팅 | 추가 설정 없이 동작 | 서버 리다이렉트 설정 필요 |
| URL 깔끔함 | `/#/share?data=...` | `/share?data=...` |
| SEO | 불리 | 유리 |

**결정**: Hash Router 채택. 프론트엔드 전용이므로 정적 호스팅(GitHub Pages, Netlify 등) 어디서든 별도 설정 없이 동작해야 한다. SEO는 유틸리티 앱 특성상 불필요하다.

### 결정 3: 미결 사항 결정

- **QR 다운로드 형식**: PNG 채택 (범용성, 모든 디바이스/앱에서 열 수 있음)
- **토스트 자동 사라짐**: 3초 (사용자가 메시지를 읽기에 충분하면서 방해되지 않는 시간)

## 4. 리스크 평가

| 리스크 | 종류 | 심각도 | 대비책 |
|--------|------|--------|--------|
| URL 길이 한계(~8KB)로 큰 데이터 공유 불가 | 기술 | 높음 | lz-string 압축 + 이미지 리사이즈(최대 300x300) + 한계 초과 시 얼럿으로 QR/공유 비활성화 |
| 브라우저별 클립보드 API 차이 | 기술 | 중간 | paste event 기반 구현 (Clipboard API보다 호환성 높음), 이미지는 DataTransfer items에서 Blob 추출 |
| 이미지 base64 인코딩 시 데이터 1.37배 증가 | 기술 | 중간 | canvas JPEG 리사이즈 + 품질 조절로 원본 크기 제한 |
| QR 코드가 너무 복잡해 스캔 실패 | 기술 | 중간 | 데이터량에 따라 QR 에러 수정 레벨 조절 + 링크 복사 대안 항상 제공 |

## 5. 마일스톤별 태스크 목록

---

### 마일스톤 1: 프로젝트 초기화 + 기반 구조

> 태스크 4개

| # | 태스크 | 중요도 | 상태 | 의존성 | 완료 기준 |
|---|--------|--------|------|--------|----------|
| T1.1 | Vite + React + TypeScript 프로젝트 스캐폴딩 | P0 | ✅ | - | `package.json`에 react 19, vite, typescript 의존성이 존재하고, `npm run dev`로 개발 서버가 기동됨 |
| T1.2 | Tailwind CSS v4 설치 및 설정 | P0 | ✅ | T1.1 | `src/index.css`에 `@import "tailwindcss"` 구문이 포함되고, `vite.config.ts`에 tailwindcss 플러그인이 설정됨 |
| T1.3 | React Router 설정 + 레이아웃 컴포넌트 | P0 | ✅ | T1.2 | `src/App.tsx`에 HashRouter와 `/`, `/share` 라우트가 정의되고, `src/components/layout/Layout.tsx`, `Header.tsx`, `Footer.tsx`가 존재함 |
| T1.4 | 공통 타입 정의 | P0 | ✅ | T1.1 | `src/types/index.ts`에 `DataType` 유니온 타입(`"text" \| "url" \| "image"`)과 `PasteData` 인터페이스가 export됨 |

#### 태스크 상세 명세

**T1.1: Vite + React + TypeScript 프로젝트 스캐폴딩**
- **Input**: `-` (첫 태스크)
- **Do**: `npm create vite@latest . -- --template react-ts`로 프로젝트 생성. `.gitignore`, `tsconfig.json`, `vite.config.ts` 등 기본 설정 파일 생성. `qrcode.react`, `lz-string`, `react-router` 의존성 설치. React 19가 설치되었는지 확인.
- **Output**: `package.json` (의존성 포함), `vite.config.ts`, `tsconfig.json`, `src/main.tsx`, `src/App.tsx` (기본 스캐폴드)
- **Files**: `package.json` (생성), `vite.config.ts` (생성), `tsconfig.json` (생성), `tsconfig.app.json` (생성), `src/main.tsx` (생성), `src/App.tsx` (생성), `index.html` (생성), `.gitignore` (생성)

**T1.2: Tailwind CSS v4 설치 및 설정**
- **Input**: T1.1이 생성한 `vite.config.ts`, `package.json`
- **Do**: `@tailwindcss/vite` 플러그인 설치. `vite.config.ts`에 tailwindcss 플러그인 추가. `src/index.css`에 `@import "tailwindcss"` 추가 및 다크모드 기본 배경색(#0f0f23), 글래스모피즘 커스텀 유틸리티 클래스(`.glass` 등), 보라/파랑 그라데이션 액센트 변수 정의.
- **Output**: `src/index.css` (Tailwind + 커스텀 스타일), `vite.config.ts` (tailwindcss 플러그인 포함)
- **Files**: `src/index.css` (생성), `vite.config.ts` (수정)

**T1.3: React Router 설정 + 레이아웃 컴포넌트**
- **Input**: T1.2가 생성한 `src/index.css` (스타일 시스템)
- **Do**: `src/App.tsx`에 HashRouter 기반 라우터 설정. `/` -> HomePage(빈 페이지), `/share` -> SharePage(빈 페이지) 라우트 등록. Layout 컴포넌트로 Header + main + Footer 구조 래핑. Header에 앱 타이틀 "Copy2QR", Footer에 크레딧 텍스트 배치. 시멘틱 HTML 태그(header, main, footer) 사용.
- **Output**: `src/App.tsx` (라우터 설정), `src/components/layout/Layout.tsx`, `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx`, `src/pages/HomePage.tsx` (빈 페이지), `src/pages/SharePage.tsx` (빈 페이지)
- **Files**: `src/App.tsx` (수정), `src/components/layout/Layout.tsx` (생성), `src/components/layout/Header.tsx` (생성), `src/components/layout/Footer.tsx` (생성), `src/pages/HomePage.tsx` (생성), `src/pages/SharePage.tsx` (생성)

**T1.4: 공통 타입 정의**
- **Input**: `-` (T1.1 이후 TypeScript 환경만 필요)
- **Do**: `src/types/index.ts`에 앱 전체에서 사용할 타입 정의. `DataType` 유니온 타입(`"text" | "url" | "image"`), `PasteData` 인터페이스(`type: DataType`, `content: string`, `timestamp: number`), `SharePayload` 인터페이스(`data: string`, `type: DataType`), `ImageSizeOption` 유니온 타입(`"resize" | "preview-only"`) 등.
- **Output**: `src/types/index.ts` (타입 export)
- **Files**: `src/types/index.ts` (생성)

#### 체크포인트
- [ ] `npm run dev`로 개발 서버가 정상 기동됨
- [ ] 브라우저에서 `/#/`와 `/#/share` 라우트가 각각 빈 페이지를 렌더링함
- [ ] Header, Footer가 모든 페이지에 공통으로 표시됨
- [ ] 다크모드 배경(#0f0f23)과 글래스모피즘 기본 스타일이 적용됨
- 데모 시나리오: 개발 서버 기동 후 두 라우트 간 이동 확인
- 다음 단계 진입 조건: 라우팅, 레이아웃, 타입 시스템 모두 정상 동작

---

### 마일스톤 2: 코어 유틸리티 + 커스텀 훅

> 태스크 6개

| # | 태스크 | 중요도 | 상태 | 의존성 | 완료 기준 |
|---|--------|--------|------|--------|----------|
| T2.1 | 타입 감지 유틸리티 | P0 | ✅ | T1.4 | `src/utils/detect-type.ts`에 `detectType()` 함수가 export되고, URL 패턴(`http(s)://`) 감지와 기본 텍스트 폴백 로직이 포함됨 |
| T2.2 | 압축/해제 유틸리티 | P0 | ✅ | T1.1 | `src/utils/compress.ts`에 `compressData()`, `decompressData()` 함수가 export되고, lz-string의 `compressToEncodedURIComponent`/`decompressFromEncodedURIComponent`를 사용함 |
| T2.3 | 이미지 처리 유틸리티 | P0 | ✅ | T1.4 | `src/utils/image.ts`에 `resizeImage()`, `fileToBase64()`, `isImageOversized()` 함수가 export되고, canvas 기반 리사이즈(최대 300x300) 로직이 포함됨 |
| T2.4 | useClipboard 훅 | P0 | ✅ | T2.1, T2.3 | `src/hooks/useClipboard.ts`에 `useClipboard` 훅이 export되고, paste 이벤트 리스너 등록/해제와 DataTransfer에서 텍스트/이미지 추출 로직이 포함됨 |
| T2.5 | useShareData 훅 | P0 | ✅ | T2.2, T1.4 | `src/hooks/useShareData.ts`에 `useShareData` 훅이 export되고, 인코딩(`encodeShareUrl`), 디코딩(`decodeShareData`) 로직이 포함됨 |
| T2.6 | useToast 훅 | P1 | ✅ | T1.1 | `src/hooks/useToast.ts`에 `useToast` 훅이 export되고, `showToast(message)`, `toasts` 상태, 3초 자동 제거 로직이 포함됨 |

#### 태스크 상세 명세

**T2.1: 타입 감지 유틸리티**
- **Input**: T1.4가 생성한 `src/types/index.ts`의 `DataType`
- **Do**: `detectType(content: string): DataType` 구현. 정규식 `/^https?:\/\//i`로 URL 판별, 그 외 텍스트. 이미지는 별도로 클립보드 이벤트에서 MIME 타입으로 감지하므로 이 함수는 텍스트/URL 판별에 집중.
- **Output**: `src/utils/detect-type.ts`에 `detectType` export
- **Files**: `src/utils/detect-type.ts` (생성)

**T2.2: 압축/해제 유틸리티**
- **Input**: T1.1에서 설치한 `lz-string` 패키지
- **Do**: `compressData(data: string): string` -- lz-string의 `compressToEncodedURIComponent` 래핑. `decompressData(compressed: string): string | null` -- `decompressFromEncodedURIComponent` 래핑 + null 체크. URL 생성 헬퍼 `buildShareUrl(data: string, type: DataType): string` -- 현재 origin + hash 경로 + 압축 데이터 조합.
- **Output**: `src/utils/compress.ts`에 `compressData`, `decompressData`, `buildShareUrl` export
- **Files**: `src/utils/compress.ts` (생성)

**T2.3: 이미지 처리 유틸리티**
- **Input**: T1.4가 생성한 `src/types/index.ts`
- **Do**: `fileToBase64(file: File): Promise<string>` -- FileReader로 base64 변환. `resizeImage(base64: string, maxWidth: number, maxHeight: number, quality: number): Promise<string>` -- canvas에 이미지 로드 후 비율 유지 리사이즈, toDataURL JPEG 출력. `isImageOversized(base64: string, maxBytes: number): boolean` -- base64 문자열 길이로 크기 추정. `getCompressedImageSize(base64: string): number` -- lz-string 압축 후 예상 URL 길이 계산.
- **Output**: `src/utils/image.ts`에 `fileToBase64`, `resizeImage`, `isImageOversized`, `getCompressedImageSize` export
- **Files**: `src/utils/image.ts` (생성)

**T2.4: useClipboard 훅**
- **Input**: T2.1의 `detectType`, T2.3의 `fileToBase64`, T1.4의 `PasteData`
- **Do**: `useClipboard()` 훅 구현. `useEffect`로 document에 paste 이벤트 리스너 등록/cleanup. `ClipboardEvent`에서 `clipboardData.items` 순회: image/* MIME이면 Blob -> File -> fileToBase64로 변환, 텍스트면 getData("text/plain") 후 detectType 호출. 결과를 `PasteData` 형태로 콜백(`onPaste`) 호출. 반환값: `{ onPaste: (callback) => void }` 또는 상태 기반 `{ pasteData, clearPaste }`.
- **Output**: `src/hooks/useClipboard.ts`에 `useClipboard` export
- **Files**: `src/hooks/useClipboard.ts` (생성)

**T2.5: useShareData 훅**
- **Input**: T2.2의 `compressData`, `decompressData`, `buildShareUrl`, T1.4의 `DataType`, `SharePayload`
- **Do**: `useShareData()` 훅 구현. `encodeShareUrl(content: string, type: DataType): string` -- buildShareUrl 호출. `decodeShareData(): SharePayload | null` -- 현재 URL hash에서 query params 파싱, data 파라미터 decompressData로 복원, type 파라미터 추출. `copyShareLink(url: string): Promise<void>` -- navigator.clipboard.writeText로 복사. 반환값: `{ encodeShareUrl, decodeShareData, copyShareLink }`.
- **Output**: `src/hooks/useShareData.ts`에 `useShareData` export
- **Files**: `src/hooks/useShareData.ts` (생성)

**T2.6: useToast 훅**
- **Input**: T1.1 (React 환경만 필요)
- **Do**: `useToast()` 훅 구현. `toasts` 상태 배열(id + message). `showToast(message: string)` -- 새 토스트 추가 + 3초 후 자동 제거(setTimeout). `removeToast(id: string)` -- 수동 제거. 반환값: `{ toasts, showToast, removeToast }`.
- **Output**: `src/hooks/useToast.ts`에 `useToast` export
- **Files**: `src/hooks/useToast.ts` (생성)

#### 체크포인트
- [ ] `detectType("https://example.com")`이 `"url"`을 반환함
- [ ] `compressData`로 압축 후 `decompressData`로 원본 복원 가능
- [ ] `resizeImage`가 300x300 이하로 리사이즈한 base64를 반환함
- [ ] `useClipboard` 훅이 paste 이벤트를 수신하여 `PasteData`를 생성함
- 데모 시나리오: 콘솔에서 유틸 함수 호출하여 입력/출력 확인
- 다음 단계 진입 조건: 모든 유틸 함수가 정상 동작하고, 훅이 이벤트를 정상 수신

---

### 마일스톤 3: 공통 UI 컴포넌트

> 태스크 4개

| # | 태스크 | 중요도 | 상태 | 의존성 | 완료 기준 |
|---|--------|--------|------|--------|----------|
| T3.1 | Button 컴포넌트 | P1 | ✅ | T1.2 | `src/components/ui/Button.tsx`에 `Button` 컴포넌트가 export되고, variant(primary/secondary/ghost), size(sm/md/lg), disabled 속성을 지원하며, 보라/파랑 그라데이션 스타일이 적용됨 |
| T3.2 | Card 컴포넌트 | P1 | ✅ | T1.2 | `src/components/ui/Card.tsx`에 `Card` 컴포넌트가 export되고, 글래스모피즘 효과(backdrop-blur, 반투명 배경, border)가 적용됨 |
| T3.3 | Toast 컴포넌트 | P1 | ✅ | T2.6 | `src/components/ui/Toast.tsx`에 `ToastContainer` 컴포넌트가 export되고, `useToast`의 `toasts` 배열을 받아 화면 우측 상단에 토스트 목록을 렌더링하며, 진입/퇴장 애니메이션이 포함됨 |
| T3.4 | Modal 컴포넌트 | P1 | ✅ | T1.2 | `src/components/ui/Modal.tsx`에 `Modal` 컴포넌트가 export되고, `isOpen`/`onClose` props를 받으며, 배경 오버레이 클릭 시 닫힘, ESC 키 닫힘, body scroll lock이 포함됨 |

#### 태스크 상세 명세

**T3.1: Button 컴포넌트**
- **Input**: T1.2의 Tailwind 스타일 시스템
- **Do**: `Button` 컴포넌트 구현. Props: `variant` ("primary" | "secondary" | "ghost", 기본 "primary"), `size` ("sm" | "md" | "lg", 기본 "md"), `disabled`, `children`, `onClick`, 나머지 button HTML 속성 spread. primary는 보라->파랑 그라데이션 배경, secondary는 border만, ghost는 투명. hover/active/disabled 상태 스타일. arrow function, 시멘틱 `<button>` 태그.
- **Output**: `src/components/ui/Button.tsx`에 `Button` export
- **Files**: `src/components/ui/Button.tsx` (생성)

**T3.2: Card 컴포넌트**
- **Input**: T1.2의 Tailwind 스타일 시스템 (글래스모피즘 커스텀 클래스)
- **Do**: `Card` 컴포넌트 구현. Props: `children`, `className` (추가 스타일). 글래스모피즘: `bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl`. padding, shadow 적용. arrow function.
- **Output**: `src/components/ui/Card.tsx`에 `Card` export
- **Files**: `src/components/ui/Card.tsx` (생성)

**T3.3: Toast 컴포넌트**
- **Input**: T2.6의 `useToast` 훅 인터페이스
- **Do**: `ToastContainer` 컴포넌트 구현. Props: `toasts` 배열, `onRemove` 콜백. 화면 우측 상단 fixed 포지션. 각 토스트는 글래스 카드 스타일 + 슬라이드 인 애니메이션 (CSS transition 또는 Tailwind animate). 닫기 버튼 선택적.
- **Output**: `src/components/ui/Toast.tsx`에 `ToastContainer` export
- **Files**: `src/components/ui/Toast.tsx` (생성)

**T3.4: Modal 컴포넌트**
- **Input**: T1.2의 Tailwind 스타일 시스템
- **Do**: `Modal` 컴포넌트 구현. Props: `isOpen`, `onClose`, `children`. 오버레이(bg-black/60 fixed inset-0) + 중앙 콘텐츠 영역. 오버레이 클릭 시 onClose 호출. ESC 키 이벤트로 닫힘. `isOpen`일 때 body overflow hidden. `createPortal`로 document.body에 렌더링. arrow function.
- **Output**: `src/components/ui/Modal.tsx`에 `Modal` export
- **Files**: `src/components/ui/Modal.tsx` (생성)

#### 체크포인트
- [ ] Button의 3가지 variant가 시각적으로 구분됨
- [ ] Card에 글래스모피즘 효과(반투명 + blur)가 적용됨
- [ ] Toast가 화면 우측 상단에 나타나고 3초 후 사라짐
- [ ] Modal이 ESC키와 배경 클릭으로 닫힘
- 데모 시나리오: 스토리북 없이 임시 페이지에서 각 컴포넌트 렌더링 확인
- 다음 단계 진입 조건: 모든 UI 컴포넌트가 의도한 스타일로 렌더링

---

### 마일스톤 4: 메인뷰 (HomePage) -- 붙여넣기 -> 미리보기 -> QR -> 공유

> 태스크 5개

| # | 태스크 | 중요도 | 상태 | 의존성 | 완료 기준 |
|---|--------|--------|------|--------|----------|
| T4.1 | PasteZone 컴포넌트 | P0 | ✅ | T2.4, T3.2 | `src/components/PasteZone.tsx`에 `PasteZone` 컴포넌트가 export되고, Ctrl+V 수신 시 `onPaste` 콜백을 호출하며, 대기 상태에서 점선 테두리 + 안내 텍스트가 표시됨 |
| T4.2 | Preview 컴포넌트 | P0 | ✅ | T1.4, T3.2 | `src/components/Preview.tsx`에 `Preview` 컴포넌트가 export되고, `PasteData` props에 따라 텍스트(textarea 편집 가능)/URL(input 편집 가능)/이미지(읽기 전용 썸네일) 미리보기를 렌더링하며, `onChange` 콜백으로 편집 내용을 전달함 |
| T4.3 | QRCodeDisplay 컴포넌트 | P0 | ✅ | T1.1 | `src/components/QRCodeDisplay.tsx`에 `QRCodeDisplay` 컴포넌트가 export되고, `qrcode.react`의 `QRCodeCanvas`를 렌더링하며, `downloadQR()` 함수로 canvas를 PNG로 다운로드하는 기능이 포함됨 |
| T4.4 | ActionBar 컴포넌트 | P1 | ✅ | T3.1, T2.5 | `src/components/ActionBar.tsx`에 `ActionBar` 컴포넌트가 export되고, "링크 복사", "QR 다운로드", "초기화" 3개 버튼이 포함되며, 각 버튼의 onClick 핸들러가 props로 전달됨 |
| T4.5 | HomePage 통합 | P0 | ✅ | T4.1, T4.2, T4.3, T4.4, T2.5, T2.6, T3.3 | `src/pages/HomePage.tsx`에 PasteZone, Preview, QRCodeDisplay, ActionBar, ToastContainer가 통합되고, 붙여넣기 -> 타입감지 -> 미리보기 -> QR생성 -> 링크복사 전체 플로우가 동작하며, 이미지 크기 초과 시 선택 다이얼로그(줄여서 공유/미리보기만)가 표시됨 |

#### 태스크 상세 명세

**T4.1: PasteZone 컴포넌트**
- **Input**: T2.4의 `useClipboard` 훅, T3.2의 `Card` 컴포넌트
- **Do**: `PasteZone` 컴포넌트 구현. Props: `onPaste: (data: PasteData) => void`, `hasPastedData: boolean`. 데이터 없을 때: Card 안에 점선 테두리(border-dashed) + "Ctrl+V로 붙여넣기" 안내 텍스트 + 아이콘. 데이터 있을 때: 숨김 또는 축소. `useClipboard` 훅으로 paste 이벤트 수신하여 onPaste 호출. arrow function, 시멘틱 `<section>`.
- **Output**: `src/components/PasteZone.tsx`에 `PasteZone` export
- **Files**: `src/components/PasteZone.tsx` (생성)

**T4.2: Preview 컴포넌트**
- **Input**: T1.4의 `PasteData`, `DataType`, T3.2의 `Card`
- **Do**: `Preview` 컴포넌트 구현. Props: `data: PasteData`, `onChange: (content: string) => void`. type별 분기 렌더링: "text" -> `<textarea>` (편집 가능, onChange 연결), "url" -> `<input type="text">` (편집 가능) + 클릭 가능 링크 미리보기, "image" -> `<img>` 썸네일 (읽기 전용). Card로 래핑, 글래스 효과 적용. arrow function.
- **Output**: `src/components/Preview.tsx`에 `Preview` export
- **Files**: `src/components/Preview.tsx` (생성)

**T4.3: QRCodeDisplay 컴포넌트**
- **Input**: T1.1에서 설치한 `qrcode.react` 패키지
- **Do**: `QRCodeDisplay` 컴포넌트 구현. Props: `value: string` (QR에 인코딩할 URL), `size: number` (기본 256). `QRCodeCanvas`로 QR 렌더링. `ref`로 canvas 참조하여 `downloadQR()` -- canvas.toDataURL("image/png")로 PNG 다운로드 링크 생성, a 태그 click() 트리거. QR 값이 비어있으면 빈 상태 렌더링. arrow function.
- **Output**: `src/components/QRCodeDisplay.tsx`에 `QRCodeDisplay` export, `downloadQR` ref 메서드 또는 콜백
- **Files**: `src/components/QRCodeDisplay.tsx` (생성)

**T4.4: ActionBar 컴포넌트**
- **Input**: T3.1의 `Button`, T2.5의 `useShareData`
- **Do**: `ActionBar` 컴포넌트 구현. Props: `onCopyLink: () => void`, `onDownloadQR: () => void`, `onReset: () => void`, `disabled: boolean`. 3개 Button 가로 배열: "링크 복사" (primary), "QR 다운로드" (secondary), "초기화" (ghost). disabled일 때 모든 버튼 비활성화. 반응형: 모바일에서 세로 스택. arrow function.
- **Output**: `src/components/ActionBar.tsx`에 `ActionBar` export
- **Files**: `src/components/ActionBar.tsx` (생성)

**T4.5: HomePage 통합**
- **Input**: T4.1~T4.4의 모든 컴포넌트, T2.5의 `useShareData`, T2.6의 `useToast`, T2.3의 이미지 유틸, T3.3의 `ToastContainer`
- **Do**: `HomePage` 컴포넌트 통합 구현. 상태 관리: `pasteData: PasteData | null`, `shareUrl: string`, `isImageOversized: boolean`. 플로우: (1) PasteZone에서 붙여넣기 수신 -> pasteData 설정, (2) 이미지면 크기 체크 -> 초과 시 confirm/선택 다이얼로그 (줄여서 공유: resizeImage 호출, 미리보기만: QR/공유 비활성화), (3) Preview로 미리보기 표시, (4) 편집 시 content 업데이트 + shareUrl 재생성, (5) QRCodeDisplay에 shareUrl 전달, (6) ActionBar의 링크 복사 -> copyShareLink + showToast, QR 다운로드 -> QRCodeDisplay의 downloadQR, 초기화 -> 모든 상태 리셋. ToastContainer 렌더링.
- **Output**: `src/pages/HomePage.tsx` (완전한 메인뷰)
- **Files**: `src/pages/HomePage.tsx` (수정)

#### 체크포인트
- [ ] 텍스트를 붙여넣으면 미리보기 카드 + QR 코드가 즉시 표시됨
- [ ] URL을 붙여넣으면 URL 타입으로 감지되어 링크 형태 미리보기가 표시됨
- [ ] 미리보기에서 텍스트를 수정하면 QR 코드가 실시간으로 갱신됨
- [ ] "링크 복사" 클릭 시 공유 URL이 클립보드에 복사되고 토스트가 표시됨
- [ ] "QR 다운로드" 클릭 시 PNG 파일이 다운로드됨
- [ ] "초기화" 클릭 시 모든 상태가 리셋되고 붙여넣기 대기 화면으로 복귀함
- [ ] 이미지 붙여넣기 시 크기 초과면 선택 다이얼로그가 표시됨
- 데모 시나리오: 텍스트, URL, 이미지를 각각 붙여넣고 QR 생성 + 링크 복사 동작 확인
- 다음 단계 진입 조건: 메인뷰의 핵심 플로우(붙여넣기->QR->공유) 전체 동작

---

### 마일스톤 5: 공유뷰 (SharePage) -- 데이터 복원 + 타입별 액션

> 태스크 3개

| # | 태스크 | 중요도 | 상태 | 의존성 | 완료 기준 |
|---|--------|--------|------|--------|----------|
| T5.1 | ImageViewer 컴포넌트 | P1 | ✅ | T3.4 | `src/components/ImageViewer.tsx`에 `ImageViewer` 컴포넌트가 export되고, Modal 안에서 이미지 확대/축소(CSS transform scale) 기능이 포함되며, 핀치줌 또는 버튼 줌이 동작함 |
| T5.2 | SharePage 데이터 복원 + 렌더링 | P0 | ✅ | T2.5, T3.1, T3.2 | `src/pages/SharePage.tsx`에 URL hash에서 데이터를 디코딩하여 타입별로 렌더링하는 로직이 포함되고, 텍스트(내용 표시 + 복사 버튼), URL(내용 표시 + 이동 버튼 + 복사 버튼), 이미지(썸네일 + 복사/저장/뷰어 버튼)가 동작함 |
| T5.3 | SharePage 이미지 액션 통합 | P1 | ✅ | T5.1, T5.2 | `src/pages/SharePage.tsx`에서 이미지 타입일 때 "복사" (클립보드 API), "저장" (a 태그 download), "뷰어" (ImageViewer 모달) 3개 액션이 모두 동작함 |

#### 태스크 상세 명세

**T5.1: ImageViewer 컴포넌트**
- **Input**: T3.4의 `Modal` 컴포넌트
- **Do**: `ImageViewer` 컴포넌트 구현. Props: `src: string` (base64 또는 URL), `isOpen: boolean`, `onClose: () => void`. Modal로 래핑. 이미지를 중앙에 배치하고, 확대/축소 버튼 (+/-) + CSS transform scale로 줌 조절 (0.5x ~ 3x). 리셋 버튼. 모바일에서는 핀치줌 감지 (touch 이벤트). arrow function.
- **Output**: `src/components/ImageViewer.tsx`에 `ImageViewer` export
- **Files**: `src/components/ImageViewer.tsx` (생성)

**T5.2: SharePage 데이터 복원 + 렌더링**
- **Input**: T2.5의 `useShareData` (decodeShareData), T3.1의 `Button`, T3.2의 `Card`
- **Do**: `SharePage` 구현. `useEffect`에서 `decodeShareData()` 호출하여 URL hash에서 데이터 복원. 복원 실패 시 에러 메시지 표시. 타입별 렌더링: "text" -> Card 안에 텍스트 표시 + "복사" Button, "url" -> Card 안에 URL 표시 + "이동" Button (window.open) + "복사" Button, "image" -> Card 안에 img 썸네일 + 액션 버튼들(T5.3에서 통합). 텍스트/URL 복사는 navigator.clipboard.writeText + toast.
- **Output**: `src/pages/SharePage.tsx` (공유뷰 기본 렌더링)
- **Files**: `src/pages/SharePage.tsx` (수정)

**T5.3: SharePage 이미지 액션 통합**
- **Input**: T5.1의 `ImageViewer`, T5.2의 `SharePage`
- **Do**: SharePage에 이미지 타입 액션 추가. "복사" -- base64를 Blob으로 변환 -> navigator.clipboard.write(ClipboardItem)로 이미지 복사. "저장" -- a 태그 생성, href=base64, download="copy2qr-image.png", click() 트리거. "뷰어" -- ImageViewer 모달 열기 (isOpen 상태 토글). 모든 액션 후 toast 표시.
- **Output**: `src/pages/SharePage.tsx` (이미지 액션 포함 완성)
- **Files**: `src/pages/SharePage.tsx` (수정)

#### 체크포인트
- [ ] 메인뷰에서 생성한 공유 URL로 접속 시 원본 데이터가 정확히 복원됨
- [ ] 텍스트 공유: "복사" 클릭 시 클립보드에 복사됨
- [ ] URL 공유: "이동" 클릭 시 새 탭에서 해당 URL이 열림
- [ ] 이미지 공유: "뷰어" 클릭 시 확대/축소 가능한 모달이 열림
- [ ] 이미지 공유: "저장" 클릭 시 PNG 파일이 다운로드됨
- 데모 시나리오: 메인뷰에서 각 타입 데이터를 공유하고, 공유 URL로 이동하여 타입별 액션 확인
- 다음 단계 진입 조건: 메인뷰->공유뷰 전체 e2e 플로우 동작

---

### 마일스톤 6: 통합 + 반응형 + 폴리시

> 태스크 3개

| # | 태스크 | 중요도 | 상태 | 의존성 | 완료 기준 |
|---|--------|--------|------|--------|----------|
| T6.1 | 반응형 레이아웃 최적화 | P1 | ✅ | T4.5, T5.3 | 모든 컴포넌트에 모바일(< 640px) / 태블릿(640~1024px) / 데스크톱(> 1024px) 브레이크포인트 대응 스타일이 적용되고, 모바일에서 QR 코드 크기가 자동 축소됨 |
| T6.2 | 에러 처리 + 엣지 케이스 | P1 | ✅ | T4.5, T5.3 | 빈 클립보드 붙여넣기 시 무시, 잘못된 공유 URL 접속 시 에러 메시지 표시, 클립보드 API 미지원 브라우저에서 폴백 안내 메시지가 동작함 |
| T6.3 | 최종 스타일 + 애니메이션 + 접근성 | P2 | ✅ | T6.1, T6.2 | 컴포넌트 전환 애니메이션(fade-in 등), hover/focus 인터랙션, aria-label 등 접근성 속성이 주요 인터랙티브 요소에 추가됨 |

#### 태스크 상세 명세

**T6.1: 반응형 레이아웃 최적화**
- **Input**: T4.5의 HomePage, T5.3의 SharePage (완성된 모든 컴포넌트)
- **Do**: 전체 컴포넌트 반응형 점검 및 수정. mobile-first 접근: 기본 모바일 스타일 -> sm/md/lg 브레이크포인트로 확장. QRCodeDisplay: 모바일 200px, 데스크톱 256px. ActionBar: 모바일 세로 스택, 데스크톱 가로 배열. Preview textarea: 모바일 전체 너비, 데스크톱 max-width 제한. Layout: 모바일 padding 축소. Header: 모바일 텍스트 크기 축소.
- **Output**: 수정된 컴포넌트 파일들 (반응형 스타일 추가)
- **Files**: `src/components/QRCodeDisplay.tsx` (수정), `src/components/ActionBar.tsx` (수정), `src/components/Preview.tsx` (수정), `src/components/layout/Layout.tsx` (수정), `src/components/layout/Header.tsx` (수정), `src/pages/HomePage.tsx` (수정), `src/pages/SharePage.tsx` (수정)

**T6.2: 에러 처리 + 엣지 케이스**
- **Input**: T4.5의 HomePage, T5.3의 SharePage
- **Do**: 에러 핸들링 추가. (1) useClipboard: 빈 클립보드 데이터 무시, 지원하지 않는 MIME 타입 무시. (2) SharePage: decodeShareData 실패 시 "공유 데이터를 복원할 수 없습니다" 에러 카드 표시 + 메인으로 돌아가기 링크. (3) 클립보드 API 미지원: navigator.clipboard 체크 후 폴백 메시지 (document.execCommand). (4) QR 생성 실패 시 에러 메시지. (5) 이미지 리사이즈 후에도 URL 길이 초과 시 얼럿.
- **Output**: 수정된 훅/컴포넌트/페이지 파일들
- **Files**: `src/hooks/useClipboard.ts` (수정), `src/pages/SharePage.tsx` (수정), `src/pages/HomePage.tsx` (수정), `src/hooks/useShareData.ts` (수정)

**T6.3: 최종 스타일 + 애니메이션 + 접근성**
- **Input**: T6.1, T6.2의 결과물
- **Do**: (1) 애니메이션: PasteZone -> Preview 전환 시 fade-in, QR 코드 나타남 시 scale-up, Toast 슬라이드-인/아웃. Tailwind `@keyframes` 및 `animate-*` 유틸리티 사용. (2) 인터랙션: 버튼 hover glow 효과, 카드 hover 미묘한 lift, focus-visible outline. (3) 접근성: 모든 Button에 aria-label, img에 alt 텍스트, Modal에 role="dialog" + aria-modal, Toast에 role="alert", PasteZone에 aria-label="붙여넣기 영역".
- **Output**: 수정된 CSS 및 컴포넌트 파일들
- **Files**: `src/index.css` (수정), `src/components/PasteZone.tsx` (수정), `src/components/QRCodeDisplay.tsx` (수정), `src/components/ui/Button.tsx` (수정), `src/components/ui/Card.tsx` (수정), `src/components/ui/Toast.tsx` (수정), `src/components/ui/Modal.tsx` (수정)

#### 체크포인트
- [ ] 모바일(375px 뷰포트)에서 레이아웃이 깨지지 않고 모든 기능이 사용 가능함
- [ ] 잘못된 공유 URL 접속 시 에러 메시지가 표시되고 메인 링크가 제공됨
- [ ] 빈 클립보드 붙여넣기 시 아무 반응 없음 (에러 없음)
- [ ] 주요 인터랙티브 요소에 aria-label이 있음
- [ ] 컴포넌트 전환 시 애니메이션이 자연스럽게 동작함
- 데모 시나리오: 모바일 뷰포트에서 전체 플로우 + 에러 케이스 확인
- 다음 단계 진입 조건: 반응형, 에러 처리, 접근성 모두 통과

---

## 6. 추적 매트릭스: 요구사항 -> 태스크

| 요구사항 | 태스크 |
|----------|--------|
| FR-1: 클립보드 붙여넣기 + 타입 감지 | T2.1, T2.4, T4.1 |
| FR-2: 미리보기 표시 | T4.2 |
| FR-3: 미리보기 편집 | T4.2, T4.5 |
| FR-4: QR 코드 생성 | T4.3, T4.5 |
| FR-5: 링크 공유 | T2.2, T2.5, T4.4, T4.5 |
| FR-6: 이미지 크기 제한 | T2.3, T4.5 |
| FR-7: 공유 데이터 뷰어 | T5.1, T5.2, T5.3 |
| FR-8: 초기화 | T4.4, T4.5 |
| NFR: 다크모드 + 글래스모피즘 | T1.2, T3.2 |
| NFR: 반응형 | T6.1 |
| NFR: 에러 처리 | T6.2 |
| NFR: 접근성 | T6.3 |
| 제약: Arrow function | 모든 컴포넌트 태스크 |
| 제약: 시멘틱 HTML | 모든 컴포넌트 태스크 |

## 7. 파일 맵

| 파일 | 태스크 | 작업 |
|------|--------|------|
| `package.json` | T1.1 | 생성 |
| `vite.config.ts` | T1.1 | 생성 |
| `vite.config.ts` | T1.2 | 수정 |
| `tsconfig.json` | T1.1 | 생성 |
| `tsconfig.app.json` | T1.1 | 생성 |
| `index.html` | T1.1 | 생성 |
| `.gitignore` | T1.1 | 생성 |
| `src/main.tsx` | T1.1 | 생성 |
| `src/index.css` | T1.2 | 생성 |
| `src/index.css` | T6.3 | 수정 |
| `src/App.tsx` | T1.1 | 생성 |
| `src/App.tsx` | T1.3 | 수정 |
| `src/types/index.ts` | T1.4 | 생성 |
| `src/utils/detect-type.ts` | T2.1 | 생성 |
| `src/utils/compress.ts` | T2.2 | 생성 |
| `src/utils/image.ts` | T2.3 | 생성 |
| `src/hooks/useClipboard.ts` | T2.4 | 생성 |
| `src/hooks/useClipboard.ts` | T6.2 | 수정 |
| `src/hooks/useShareData.ts` | T2.5 | 생성 |
| `src/hooks/useShareData.ts` | T6.2 | 수정 |
| `src/hooks/useToast.ts` | T2.6 | 생성 |
| `src/components/layout/Layout.tsx` | T1.3 | 생성 |
| `src/components/layout/Layout.tsx` | T6.1 | 수정 |
| `src/components/layout/Header.tsx` | T1.3 | 생성 |
| `src/components/layout/Header.tsx` | T6.1 | 수정 |
| `src/components/layout/Footer.tsx` | T1.3 | 생성 |
| `src/components/ui/Button.tsx` | T3.1 | 생성 |
| `src/components/ui/Button.tsx` | T6.3 | 수정 |
| `src/components/ui/Card.tsx` | T3.2 | 생성 |
| `src/components/ui/Card.tsx` | T6.3 | 수정 |
| `src/components/ui/Toast.tsx` | T3.3 | 생성 |
| `src/components/ui/Toast.tsx` | T6.3 | 수정 |
| `src/components/ui/Modal.tsx` | T3.4 | 생성 |
| `src/components/ui/Modal.tsx` | T6.3 | 수정 |
| `src/components/PasteZone.tsx` | T4.1 | 생성 |
| `src/components/PasteZone.tsx` | T6.3 | 수정 |
| `src/components/Preview.tsx` | T4.2 | 생성 |
| `src/components/Preview.tsx` | T6.1 | 수정 |
| `src/components/QRCodeDisplay.tsx` | T4.3 | 생성 |
| `src/components/QRCodeDisplay.tsx` | T6.1 | 수정 |
| `src/components/QRCodeDisplay.tsx` | T6.3 | 수정 |
| `src/components/ActionBar.tsx` | T4.4 | 생성 |
| `src/components/ActionBar.tsx` | T6.1 | 수정 |
| `src/components/ImageViewer.tsx` | T5.1 | 생성 |
| `src/pages/HomePage.tsx` | T1.3 | 생성 |
| `src/pages/HomePage.tsx` | T4.5 | 수정 |
| `src/pages/HomePage.tsx` | T6.1 | 수정 |
| `src/pages/HomePage.tsx` | T6.2 | 수정 |
| `src/pages/SharePage.tsx` | T1.3 | 생성 |
| `src/pages/SharePage.tsx` | T5.2 | 수정 |
| `src/pages/SharePage.tsx` | T5.3 | 수정 |
| `src/pages/SharePage.tsx` | T6.1 | 수정 |
| `src/pages/SharePage.tsx` | T6.2 | 수정 |

## 8. 크리티컬 패스

최장 의존 체인:

```
T1.1 -> T1.2 -> T1.3 -> (T1.4) -> T2.4 -> T4.1 -> T4.5 -> T6.1 -> T6.3
```

상세 분석:
- **병목 태스크**: T1.1 (모든 것의 시작점), T4.5 (메인뷰 통합 -- 4개 컴포넌트 의존)
- **병렬 가능 그룹**:
  - [T1.3, T1.4]: T1.2 이후 병렬 가능 (파일 겹침 없음, 단 T1.3은 App.tsx 수정이므로 T1.1 이후)
  - [T2.1, T2.2, T2.3, T2.6]: T1.4 이후 각각 독립적 (파일 겹침 없음)
  - [T3.1, T3.2, T3.3, T3.4]: T1.2 이후 각각 독립적 (파일 겹침 없음)
  - [T4.1, T4.2, T4.3, T4.4]: 선행 조건만 충족하면 각각 독립적 (파일 겹침 없음)
  - [T6.1, T6.2]: T4.5, T5.3 이후 병렬 가능 (일부 파일 겹침 있으나 수정 영역 다름)

## 9. 의존성 다이어그램

```
T1.1 (Vite 스캐폴딩)
 |
 +-- T1.2 (Tailwind 설정)
 |    |
 |    +-- T1.3 (Router + Layout)
 |    |    |
 |    |    +-- T4.1 (PasteZone) --+
 |    |    +-- T4.2 (Preview) ----+
 |    |                           |
 |    +-- T3.1 (Button) ----------+-- T4.4 (ActionBar) --+
 |    +-- T3.2 (Card) -----------/                        |
 |    +-- T3.4 (Modal) -- T5.1 (ImageViewer) --+          |
 |                                              |          |
 +-- T1.4 (타입 정의)                           |          |
 |    |                                         |          |
 |    +-- T2.1 (detect-type) --+                |          |
 |    +-- T2.3 (image utils) --+-- T2.4 (useClipboard) -- T4.1
 |                              |                          |
 +-- T2.2 (compress) -- T2.5 (useShareData) ----+          |
 |                                               |          |
 +-- T2.6 (useToast) -- T3.3 (Toast) -----------+          |
                                                 |          |
                                          T4.3 (QRCode) ---+
                                                 |          |
                                                 +----------+
                                                 |
                                           T4.5 (HomePage 통합)
                                                 |
                                           T5.2 (SharePage 기본)
                                                 |
                                           T5.3 (SharePage 이미지)
                                                 |
                                        +--------+--------+
                                        |                 |
                                  T6.1 (반응형)     T6.2 (에러)
                                        |                 |
                                        +--------+--------+
                                                 |
                                           T6.3 (폴리시)
```

## 10. 요약 통계

| 항목 | 값 |
|------|-----|
| 총 태스크 | 25개 |
| P0 (Critical) | 11개 |
| P1 (High) | 11개 |
| P2 (Medium) | 3개 |
| P3 (Low) | 0개 |
| 마일스톤 | 6단계 |
| 신규 생성 파일 | 24개 (설정 파일 포함) |
| 크리티컬 패스 길이 | 9 태스크 |
| 병렬 가능 그룹 | 5개 |

## 11. 영향 범위

### 신규 생성 파일

| 파일 | 용도 |
|------|------|
| `package.json` | 프로젝트 매니페스트 + 의존성 |
| `vite.config.ts` | Vite + Tailwind 빌드 설정 |
| `tsconfig.json`, `tsconfig.app.json` | TypeScript 설정 |
| `index.html` | SPA 엔트리 HTML |
| `.gitignore` | Git 무시 파일 |
| `src/main.tsx` | React 앱 마운트 포인트 |
| `src/App.tsx` | 라우터 + 레이아웃 루트 |
| `src/index.css` | Tailwind + 글래스모피즘 글로벌 스타일 |
| `src/types/index.ts` | 공통 타입 (DataType, PasteData 등) |
| `src/utils/detect-type.ts` | 텍스트/URL 타입 감지 |
| `src/utils/compress.ts` | lz-string 압축/해제 래퍼 |
| `src/utils/image.ts` | 이미지 리사이즈/변환 유틸 |
| `src/hooks/useClipboard.ts` | 클립보드 붙여넣기 이벤트 훅 |
| `src/hooks/useShareData.ts` | 공유 URL 인코딩/디코딩 훅 |
| `src/hooks/useToast.ts` | 토스트 상태 관리 훅 |
| `src/components/layout/Layout.tsx` | 페이지 래퍼 (Header + main + Footer) |
| `src/components/layout/Header.tsx` | 공통 헤더 |
| `src/components/layout/Footer.tsx` | 공통 푸터 |
| `src/components/ui/Button.tsx` | 공통 버튼 (variant/size) |
| `src/components/ui/Card.tsx` | 글래스모피즘 카드 |
| `src/components/ui/Toast.tsx` | 토스트 알림 컨테이너 |
| `src/components/ui/Modal.tsx` | 모달 오버레이 |
| `src/components/PasteZone.tsx` | 붙여넣기 대기/수신 영역 |
| `src/components/Preview.tsx` | 타입별 미리보기 (편집 가능) |
| `src/components/QRCodeDisplay.tsx` | QR 코드 렌더링 + 다운로드 |
| `src/components/ActionBar.tsx` | 액션 버튼 모음 |
| `src/components/ImageViewer.tsx` | 이미지 확대/축소 뷰어 |
| `src/pages/HomePage.tsx` | 메인뷰 페이지 |
| `src/pages/SharePage.tsx` | 공유뷰 페이지 |

### 기존 기능 영향
- 영향 없음 (신규 프로젝트)

## 12. 미결 사항

| 항목 | 상태 | 기본값 |
|------|------|--------|
| QR 다운로드 파일 형식 | 결정: PNG | PNG (범용성 우선) |
| 토스트 자동 사라짐 시간 | 결정: 3초 | 3초 |
| 이미지 리사이즈 최대 크기 | 요구사항 명시 | 300x300 |
| URL 길이 한계 | 요구사항 명시 | ~8KB (브라우저 URL 바 한계) |

## 13. Anti-LLM-Mistake 경고

| 실수 패턴 | 방지책 |
|-----------|--------|
| Tailwind v4와 v3 설정 혼동 | v4는 `@import "tailwindcss"` 사용, `tailwind.config.js` 불필요, `@tailwindcss/vite` 플러그인 사용 |
| React Router v7에서 v6 API 사용 | v7의 `createHashRouter` 또는 `HashRouter` 컴포넌트 사용, `useSearchParams` 대신 URL hash 직접 파싱 |
| qrcode.react에서 잘못된 export 사용 | v4에서는 `QRCodeSVG`/`QRCodeCanvas` 명시적 import 필요 (기본 export 없음) |
| lz-string URI 인코딩 메서드 혼동 | `compressToEncodedURIComponent` 사용 (Base64 아님) -- URL hash에 안전한 문자만 포함 |
| 이미지 클립보드 복사 API 브라우저 제한 | `navigator.clipboard.write`는 HTTPS + Secure Context 필요 -- 로컬 개발에서는 localhost만 동작 |
