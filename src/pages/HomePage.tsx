import { useState, useRef, useCallback } from "react";
import type { PasteData } from "../types";
import { useShareData } from "../hooks/useShareData";
import { useToast } from "../hooks/useToast";
import { isImageOversized, resizeImage } from "../utils/image";
import PasteZone from "../components/PasteZone";
import Preview from "../components/Preview";
import QRCodeDisplay from "../components/QRCodeDisplay";
import type { QRCodeDisplayHandle } from "../components/QRCodeDisplay";
import ActionBar from "../components/ActionBar";
import ToastContainer from "../components/ui/Toast";

// 이미지 URL 길이 기준: 공유 URL에 넣기에 적합한 압축 후 최대 바이트
const IMAGE_MAX_BYTES = 150_000;

interface ImageSizeDialogProps {
  onResize: () => void;
  onPreviewOnly: () => void;
}

const ImageSizeDialog = ({ onResize, onPreviewOnly }: ImageSizeDialogProps) => (
  <div
    role="alertdialog"
    aria-labelledby="img-dialog-title"
    aria-describedby="img-dialog-desc"
    className="w-full bg-white/8 backdrop-blur-xl border border-amber-400/30 rounded-2xl p-5 flex flex-col gap-4"
  >
    <div className="flex items-start gap-3">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="shrink-0 mt-0.5 text-amber-400"
        aria-hidden="true"
      >
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
      <div>
        <p
          id="img-dialog-title"
          className="text-sm font-medium text-[var(--color-text-primary)]"
        >
          이미지가 공유 가능 크기를 초과합니다
        </p>
        <p
          id="img-dialog-desc"
          className="text-xs text-[var(--color-text-muted)] mt-1"
        >
          이미지를 축소하여 공유하거나, 미리보기만 볼 수 있습니다.
        </p>
      </div>
    </div>
    <div className="flex gap-2">
      <button
        type="button"
        onClick={onResize}
        className="flex-1 px-3 py-2 rounded-xl text-xs font-medium bg-[var(--color-accent-violet)]/20 border border-[var(--color-accent-violet)]/40 text-[var(--color-accent-violet)] hover:bg-[var(--color-accent-violet)]/30 transition-colors focus-ring focus:outline-none"
      >
        줄여서 공유
      </button>
      <button
        type="button"
        onClick={onPreviewOnly}
        className="flex-1 px-3 py-2 rounded-xl text-xs font-medium bg-white/5 border border-white/15 text-[var(--color-text-secondary)] hover:bg-white/10 transition-colors focus-ring focus:outline-none"
      >
        미리보기만
      </button>
    </div>
  </div>
);

const HomePage = () => {
  const [pasteData, setPasteData] = useState<PasteData | null>(null);
  const [shareUrl, setShareUrl] = useState<string>("");
  const [shareDisabled, setShareDisabled] = useState<boolean>(false);
  const [pendingImageData, setPendingImageData] = useState<PasteData | null>(null);

  const qrRef = useRef<QRCodeDisplayHandle>(null);
  const { encodeShareUrl, copyShareLink } = useShareData();
  const { toasts, showToast, removeToast } = useToast();

  const buildShareUrl = useCallback(
    (data: PasteData) => encodeShareUrl(data.content, data.type),
    [encodeShareUrl],
  );

  const handlePaste = useCallback(
    async (data: PasteData) => {
      if (data.type === "image") {
        const oversized = isImageOversized(data.content, IMAGE_MAX_BYTES);
        if (oversized) {
          setPendingImageData(data);
          return;
        }
      }
      setPasteData(data);
      setShareDisabled(false);
      setShareUrl(buildShareUrl(data));
    },
    [buildShareUrl],
  );

  const handleResize = useCallback(async () => {
    if (!pendingImageData) return;
    try {
      const resized = await resizeImage(pendingImageData.content, 300, 300, 0.7);
      const resizedData: PasteData = {
        ...pendingImageData,
        content: resized,
        timestamp: Date.now(),
      };
      // 리사이즈 후에도 여전히 URL 크기 초과 시 — 공유 불가 안내 후 미리보기만 표시
      if (isImageOversized(resized, IMAGE_MAX_BYTES)) {
        showToast("이미지를 충분히 줄일 수 없습니다. 미리보기만 표시합니다.");
        setPendingImageData(null);
        setPasteData(resizedData);
        setShareDisabled(true);
        setShareUrl("");
        return;
      }
      setPendingImageData(null);
      setPasteData(resizedData);
      setShareDisabled(false);
      setShareUrl(buildShareUrl(resizedData));
    } catch {
      showToast("이미지 축소에 실패했습니다.");
    }
  }, [pendingImageData, buildShareUrl, showToast]);

  const handlePreviewOnly = useCallback(() => {
    if (!pendingImageData) return;
    setPendingImageData(null);
    setPasteData(pendingImageData);
    setShareDisabled(true);
    setShareUrl("");
  }, [pendingImageData]);

  const handleContentChange = useCallback(
    (content: string) => {
      if (!pasteData) return;
      const updated: PasteData = { ...pasteData, content };
      setPasteData(updated);
      if (!shareDisabled) {
        setShareUrl(buildShareUrl(updated));
      }
    },
    [pasteData, shareDisabled, buildShareUrl],
  );

  const handleCopyLink = useCallback(async () => {
    if (!shareUrl) return;
    try {
      await copyShareLink(shareUrl);
      showToast("링크가 복사되었습니다.");
    } catch {
      showToast("링크 복사에 실패했습니다.");
    }
  }, [shareUrl, copyShareLink, showToast]);

  const handleDownloadQR = useCallback(() => {
    qrRef.current?.downloadQR();
  }, []);

  const handleReset = useCallback(() => {
    setPasteData(null);
    setPendingImageData(null);
    setShareUrl("");
    setShareDisabled(false);
  }, []);

  // ClipboardEvent 지원 여부 (PasteZone 내부의 useClipboard와 별도로 판별만 수행)
  const isClipboardSupported = typeof ClipboardEvent !== "undefined";

  const hasPastedData = pasteData !== null || pendingImageData !== null;

  return (
    <main aria-label="홈" className="flex flex-col items-center gap-6 w-full">
      {!isClipboardSupported && (
        <div
          role="alert"
          className="w-full bg-white/8 backdrop-blur-xl border border-red-400/30 rounded-2xl px-5 py-4 flex items-start gap-3 text-sm"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            className="shrink-0 mt-0.5 text-red-400"
          >
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4" />
            <path d="M8 5v4M8 10.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="text-[var(--color-text-secondary)]">
            이 브라우저는 클립보드 붙여넣기를 지원하지 않습니다. 최신 브라우저(Chrome, Firefox, Safari)를 사용해 주세요.
          </span>
        </div>
      )}
      <PasteZone onPaste={handlePaste} hasPastedData={hasPastedData} />

      {pendingImageData && (
        <ImageSizeDialog onResize={handleResize} onPreviewOnly={handlePreviewOnly} />
      )}

      {pasteData && (
        <Preview data={pasteData} onChange={handleContentChange} />
      )}

      {hasPastedData && (
        <section aria-label="QR 코드 및 공유" className="w-full">
          <div className="flex flex-col items-center gap-6">
            <QRCodeDisplay ref={qrRef} value={shareUrl} size={256} />
            <ActionBar
              onCopyLink={handleCopyLink}
              onDownloadQR={handleDownloadQR}
              onReset={handleReset}
              disabled={shareDisabled || !shareUrl}
            />
          </div>
        </section>
      )}

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </main>
  );
};

export default HomePage;
