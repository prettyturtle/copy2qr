import type { PasteData } from "../types";
import { useClipboard } from "../hooks/useClipboard";
import Card from "./ui/Card";

interface PasteZoneProps {
  onPaste: (data: PasteData) => void;
  hasPastedData: boolean;
}

const ClipboardIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="9" y="2" width="6" height="4" rx="1" />
    <path d="M8 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-2" />
    <path d="M12 11v6M9 14h6" />
  </svg>
);

export const PasteZone = ({ onPaste, hasPastedData }: PasteZoneProps) => {
  useClipboard({ onPaste });

  if (hasPastedData) {
    return null;
  }

  return (
    <section aria-label="붙여넣기 영역">
      <Card className="cursor-default">
        <div
          className="border-2 border-dashed border-[#4d4c48] rounded-xl px-8 py-14 flex flex-col items-center gap-4 text-[#87867f] transition-colors hover:border-[#b0aea5]/50 hover:text-[#faf9f5]"
          role="presentation"
        >
          <span className="text-[#87867f] transition-colors">
            <ClipboardIcon />
          </span>
          <div className="text-center space-y-1">
            <p className="text-base font-medium text-[#faf9f5]">
              <kbd className="px-1.5 py-0.5 text-xs font-mono rounded bg-[#4d4c48] border border-[#4d4c48] mr-1">
                Ctrl+V
              </kbd>
              로 붙여넣기
            </p>
            <p className="text-sm text-[#87867f]">
              텍스트, URL, 이미지를 지원합니다
            </p>
          </div>
        </div>
      </Card>
    </section>
  );
};

export default PasteZone;
