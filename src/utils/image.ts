import { compressToEncodedURIComponent } from "lz-string";

/** File 객체를 base64 data URL 문자열로 변환한다 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("FileReader 결과가 문자열이 아닙니다."));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
};

/**
 * base64 이미지를 canvas로 리사이즈하여 JPEG data URL로 반환한다.
 * 비율을 유지하며 maxWidth x maxHeight(최대 300x300) 내로 축소한다.
 */
export const resizeImage = (
  base64: string,
  maxWidth: number,
  maxHeight: number,
  quality: number,
): Promise<string> => {
  const clampedMaxWidth = Math.min(maxWidth, 300);
  const clampedMaxHeight = Math.min(maxHeight, 300);
  const clampedQuality = Math.max(0, Math.min(1, quality));

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;

      if (width > clampedMaxWidth || height > clampedMaxHeight) {
        const ratio = Math.min(
          clampedMaxWidth / width,
          clampedMaxHeight / height,
        );
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("canvas 2d context를 가져올 수 없습니다."));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", clampedQuality));
    };
    img.onerror = () => reject(new Error("이미지 로드 실패"));
    img.src = base64;
  });
};

/**
 * base64 문자열 길이로 크기를 추정하여 maxBytes 초과 여부를 반환한다.
 * base64는 원본 바이트의 약 4/3 배 크기이므로 역산한다.
 */
export const isImageOversized = (
  base64: string,
  maxBytes: number,
): boolean => {
  // data URL 헤더(예: "data:image/jpeg;base64,") 제거 후 계산
  const base64Data = base64.includes(",") ? base64.split(",")[1] : base64;
  const estimatedBytes = Math.ceil((base64Data.length * 3) / 4);
  return estimatedBytes > maxBytes;
};

/**
 * base64 이미지를 lz-string으로 압축했을 때 예상 URL 길이를 반환한다.
 */
export const getCompressedImageSize = (base64: string): number => {
  const compressed = compressToEncodedURIComponent(base64);
  return compressed.length;
};
