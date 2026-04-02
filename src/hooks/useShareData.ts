import { useCallback } from "react";
import { buildShareUrl, decompressData } from "../utils/compress";
import type { DataType, SharePayload } from "../types";

export interface UseShareDataReturn {
  encodeShareUrl: (content: string, type: DataType) => string;
  decodeShareData: () => SharePayload | null;
  copyShareLink: (url: string) => Promise<void>;
}

export const useShareData = (): UseShareDataReturn => {
  const encodeShareUrl = useCallback(
    (content: string, type: DataType): string => buildShareUrl(content, type),
    [],
  );

  const decodeShareData = useCallback((): SharePayload | null => {
    const hash = window.location.hash; // e.g. "#/share?data=...&type=..."
    const queryIndex = hash.indexOf("?");
    if (queryIndex === -1) return null;

    const params = new URLSearchParams(hash.slice(queryIndex + 1));
    const compressed = params.get("data");
    const type = params.get("type") as DataType | null;

    if (!compressed || !type) return null;

    const data = decompressData(compressed);
    if (data === null) return null;

    return { data, type };
  }, []);

  const copyShareLink = useCallback(async (url: string): Promise<void> => {
    // navigator.clipboard API 우선 시도, 미지원/권한 거부 시 execCommand 폴백
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      await navigator.clipboard.writeText(url);
      return;
    }
    // execCommand 폴백 (레거시 브라우저 / 보안 컨텍스트 미충족)
    const textArea = document.createElement("textarea");
    textArea.value = url;
    textArea.style.cssText = "position:fixed;top:-9999px;left:-9999px;opacity:0;";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textArea);
    if (!ok) {
      throw new Error("execCommand copy failed");
    }
  }, []);

  return { encodeShareUrl, decodeShareData, copyShareLink };
};
