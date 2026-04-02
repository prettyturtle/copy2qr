/**
 * 앱 전체에서 사용하는 공통 타입 정의
 */

/** 붙여넣기 데이터의 종류 */
export type DataType = "text" | "url" | "image";

/** 클립보드에서 수신한 붙여넣기 데이터 */
export interface PasteData {
  type: DataType;
  content: string;
  timestamp: number;
}

/** QR 코드 공유 URL에 인코딩되는 페이로드 */
export interface SharePayload {
  data: string;
  type: DataType;
}

/** 이미지 크기 초과 시 처리 방법 선택 */
export type ImageSizeOption = "resize" | "preview-only";
