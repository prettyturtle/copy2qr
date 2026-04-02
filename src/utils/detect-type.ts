import type { DataType } from "../types";

/**
 * 텍스트 콘텐츠를 분석하여 DataType을 반환한다.
 * 이미지는 클립보드 MIME 타입으로 별도 감지하므로 이 함수는 텍스트/URL 판별에만 집중한다.
 */
const URL_PATTERN = /^https?:\/\//i;

export const detectType = (content: string): DataType => {
  if (URL_PATTERN.test(content.trim())) {
    return "url";
  }
  return "text";
};
