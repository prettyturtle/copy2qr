import Button from './ui/Button';

interface ActionBarProps {
  onCopyLink: () => void;
  onDownloadQR: () => void;
  onReset: () => void;
  disabled?: boolean;
}

const ActionBar = ({
  onCopyLink,
  onDownloadQR,
  onReset,
  disabled = false,
}: ActionBarProps) => {
  return (
    <div
      className="flex flex-col sm:flex-row gap-3 w-full"
      role="group"
      aria-label="공유 액션"
    >
      <Button
        variant="primary"
        size="md"
        disabled={disabled}
        onClick={onCopyLink}
        className="flex-1"
        aria-label="공유 링크 복사"
      >
        링크 복사
      </Button>
      <Button
        variant="secondary"
        size="md"
        disabled={disabled}
        onClick={onDownloadQR}
        className="flex-1"
        aria-label="QR 코드 PNG 다운로드"
      >
        QR 다운로드
      </Button>
      <Button
        variant="ghost"
        size="md"
        disabled={false}
        onClick={onReset}
        className="flex-1 sm:flex-none"
        aria-label="초기화"
      >
        초기화
      </Button>
    </div>
  );
};

export { ActionBar };
export type { ActionBarProps };
export default ActionBar;
