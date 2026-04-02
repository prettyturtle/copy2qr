import { useEffect, useCallback } from "react";
import type { PasteData } from "../types";
import { detectType } from "../utils/detect-type";
import { fileToBase64 } from "../utils/image";

export interface UseClipboardOptions {
  onPaste: (data: PasteData) => void;
}

export interface UseClipboardReturn {
  /** paste 이벤트 API 지원 여부 (ClipboardEvent 미지원 환경에서 false) */
  isSupported: boolean;
}

export const useClipboard = ({ onPaste }: UseClipboardOptions): UseClipboardReturn => {
  const handlePaste = useCallback(
    async (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (!items) return;

      // image/* MIME 아이템 우선 탐색
      for (const item of Array.from(items)) {
        if (item.type.startsWith("image/")) {
          const blob = item.getAsFile();
          if (!blob) continue;

          // Blob을 File로 래핑 (fileToBase64는 File을 받음)
          const file = new File([blob], "pasted-image", { type: item.type });
          try {
            const base64 = await fileToBase64(file);
            onPaste({ type: "image", content: base64, timestamp: Date.now() });
          } catch {
            // 이미지 변환 실패 시 무시
          }
          return; // 이미지가 있으면 텍스트 처리 건너뜀
        }
      }

      // 텍스트 아이템 처리
      for (const item of Array.from(items)) {
        if (item.kind === "string" && item.type === "text/plain") {
          item.getAsString((text) => {
            const trimmed = text.trim();
            if (!trimmed) return;
            const type = detectType(trimmed);
            onPaste({ type, content: trimmed, timestamp: Date.now() });
          });
          return;
        }
      }
    },
    [onPaste],
  );

  // ClipboardEvent 지원 여부 감지 (paste 이벤트 기반이므로 ClipboardEvent 존재 여부로 판별)
  const isSupported = typeof ClipboardEvent !== "undefined";

  useEffect(() => {
    if (!isSupported) return;
    document.addEventListener("paste", handlePaste);
    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, [handlePaste, isSupported]);

  return { isSupported };
};
