import LZString from "lz-string";
import type { DataType } from "../types";

/**
 * 문자열을 URL-safe 압축 형태로 인코딩한다.
 */
export const compressData = (data: string): string =>
  LZString.compressToEncodedURIComponent(data);

/**
 * URL-safe 압축 문자열을 원래 문자열로 복원한다.
 * 복원에 실패하면 null을 반환한다.
 */
export const decompressData = (compressed: string): string | null => {
  const result = LZString.decompressFromEncodedURIComponent(compressed);
  return result ?? null;
};

/**
 * 공유 URL을 생성한다.
 * 형식: `${origin}/#/share?data=${compressed}&type=${type}`
 */
export const buildShareUrl = (data: string, type: DataType): string => {
  const compressed = compressData(data);
  return `${window.location.origin}/#/share?data=${compressed}&type=${type}`;
};
