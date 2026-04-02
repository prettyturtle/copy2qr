# Copy2QR

클립보드 콘텐츠를 QR 코드와 공유 링크로 즉시 변환하는 웹 애플리케이션입니다.

텍스트, URL, 이미지를 붙여넣기만 하면 QR 코드가 생성되어 디바이스 간 빠른 공유가 가능합니다.

## Features

- **붙여넣기 한 번으로 QR 생성** - `Ctrl+V` 또는 탭 한 번으로 클립보드 내용을 QR 코드로 변환
- **텍스트 / URL / 이미지 지원** - 콘텐츠 타입을 자동 감지하여 최적의 방식으로 처리
- **공유 링크** - QR 코드 외에 공유 가능한 URL도 함께 생성
- **공유 히스토리** - 보낸/받은 공유 내역을 localStorage에 자동 저장
- **모바일 지원** - Clipboard API를 활용한 모바일 붙여넣기 지원
- **QR 다운로드** - 생성된 QR 코드를 PNG 이미지로 저장

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS 4
- [qrcode.react](https://github.com/zpao/qrcode.react) - QR 코드 생성
- [lz-string](https://github.com/pieroxy/lz-string) - URL-safe 데이터 압축

## Getting Started

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview
```

## How It Works

```
붙여넣기 → 타입 감지 → 데이터 압축 → QR 코드 생성 → 링크 복사 / QR 다운로드
                                                         ↓
공유 링크 열기 → URL 해시 디코딩 → 데이터 복원 → 콘텐츠 표시
```

1. 사용자가 텍스트, URL, 또는 이미지를 붙여넣기
2. LZString으로 데이터를 압축하여 URL-safe 문자열로 인코딩
3. 압축된 데이터를 포함한 공유 URL과 QR 코드 생성
4. 공유 링크를 열면 데이터를 디코딩하여 원본 콘텐츠 표시

## Project Structure

```
src/
├── pages/          # 페이지 컴포넌트 (Home, Share, History)
├── components/     # UI 컴포넌트
│   ├── layout/     # Layout, Header, Footer
│   └── ui/         # Button, Card, Modal, Toast
├── hooks/          # 커스텀 훅 (useClipboard, useShareData, useHistory, useToast)
├── utils/          # 유틸리티 (압축, 타입 감지, 이미지 처리)
└── types/          # TypeScript 타입 정의
```

## License

MIT
