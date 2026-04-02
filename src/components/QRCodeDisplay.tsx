import { forwardRef, useImperativeHandle, useRef, Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
}

interface QRCodeDisplayHandle {
  downloadQR: () => void;
}

/* ---------- QR ErrorBoundary ---------- */

interface QRErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
  resetKey: string;
}

interface QRErrorBoundaryState {
  hasError: boolean;
}

class QRErrorBoundary extends Component<QRErrorBoundaryProps, QRErrorBoundaryState> {
  state: QRErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): QRErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    // QR 인코딩 에러를 조용히 처리
  }

  componentDidUpdate(prevProps: QRErrorBoundaryProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

/* ---------- QRCodeDisplay ---------- */

const QRErrorFallback = () => (
  <div
    className="flex items-center justify-center rounded-2xl w-[224px] h-[224px] sm:w-[280px] sm:h-[280px] border border-[#b53333]/30 bg-white/[0.03]"
    aria-label="QR 코드 생성 실패"
    role="alert"
  >
    <span className="text-[#87867f] text-xs text-center px-6 leading-relaxed">
      QR 코드를 생성할 수 없습니다.<br />내용이 너무 길거나 지원하지 않는 형식입니다.
    </span>
  </div>
);

const QRCodeDisplay = forwardRef<QRCodeDisplayHandle, QRCodeDisplayProps>(
  ({ value, size = 256 }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

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
          <span className="text-[#87867f] text-sm text-center px-4">
            내용을 붙여넣으면 QR이 생성됩니다
          </span>
        </div>
      );
    }

    return (
      <QRErrorBoundary resetKey={value} fallback={<QRErrorFallback />}>
        <div className="flex flex-col items-center animate-scale-up">
          <div
            className="rounded-2xl p-3 w-[224px] h-[224px] sm:w-[280px] sm:h-[280px] shadow-[rgba(0,0,0,0.20)_0px_4px_24px] flex items-center justify-center"
            style={{ background: '#ffffff' }}
            aria-label="QR 코드"
          >
            <QRCodeCanvas
              ref={canvasRef}
              value={value}
              size={size}
              fgColor="#1a1a2e"
              bgColor="#ffffff"
              level="M"
              className="w-[200px] h-[200px] sm:w-[256px] sm:h-[256px]"
            />
          </div>
        </div>
      </QRErrorBoundary>
    );
  }
);

QRCodeDisplay.displayName = 'QRCodeDisplay';

export { QRCodeDisplay };
export type { QRCodeDisplayProps, QRCodeDisplayHandle };
export default QRCodeDisplay;
