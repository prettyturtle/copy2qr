import { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
}

interface QRCodeDisplayHandle {
  downloadQR: () => void;
}

const QRCodeDisplay = forwardRef<QRCodeDisplayHandle, QRCodeDisplayProps>(
  ({ value, size = 256 }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [qrError, setQrError] = useState(false);

    // value가 바뀌면 에러 상태 초기화
    useEffect(() => {
      setQrError(false);
    }, [value]);

    const downloadQR = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = 'qrcode.png';
      a.click();
    };

    useImperativeHandle(ref, () => ({ downloadQR }));

    if (!value) {
      return (
        <div
          className="flex items-center justify-center rounded-2xl w-[200px] h-[200px] sm:w-[256px] sm:h-[256px]"
          aria-label="QR 코드 없음"
        >
          <span className="text-[var(--color-text-muted)] text-sm text-center px-4">
            내용을 붙여넣으면 QR이 생성됩니다
          </span>
        </div>
      );
    }

    // QR 생성 실패 (데이터 용량 초과 등)
    if (qrError) {
      return (
        <div
          className="flex items-center justify-center rounded-2xl w-[224px] h-[224px] sm:w-[280px] sm:h-[280px] border border-red-400/30 bg-white/[0.03]"
          aria-label="QR 코드 생성 실패"
          role="alert"
        >
          <span className="text-[var(--color-text-muted)] text-xs text-center px-6 leading-relaxed">
            QR 코드를 생성할 수 없습니다. 내용이 너무 길거나 지원하지 않는 형식입니다.
          </span>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center animate-scale-up">
        {/* 모바일: w-[224px] (200px canvas + 24px padding), sm 이상: w-[280px] (256px + 24px) */}
        <div
          className="rounded-2xl p-3 w-[224px] h-[224px] sm:w-[280px] sm:h-[280px] shadow-[0_0_32px_rgba(124,90,240,0.2)] flex items-center justify-center"
          style={{ background: '#ffffff' }}
          aria-label="QR 코드"
        >
          {/* canvas는 size={256} 고정, CSS로 모바일에서 200px로 축소 */}
          <QRCodeCanvas
            ref={canvasRef}
            value={value}
            size={size}
            fgColor="#1a1a2e"
            bgColor="#ffffff"
            level="M"
            className="w-[200px] h-[200px] sm:w-[256px] sm:h-[256px]"
            onError={() => setQrError(true)}
          />
        </div>
      </div>
    );
  }
);

QRCodeDisplay.displayName = 'QRCodeDisplay';

export { QRCodeDisplay };
export type { QRCodeDisplayProps, QRCodeDisplayHandle };
export default QRCodeDisplay;
