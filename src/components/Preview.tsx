import { useState, useEffect } from "react";
import type { PasteData } from "../types";
import Card from "./ui/Card";

interface PreviewProps {
  data: PasteData;
  onChange: (content: string) => void;
}

const ExternalLinkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const TextPreview = ({
  content,
  onChange,
}: {
  content: string;
  onChange: (v: string) => void;
}) => (
  <textarea
    className="w-full min-h-[120px] resize-y bg-[#141413] border border-[#30302e] text-[#faf9f5] text-sm leading-relaxed placeholder:text-[#87867f] focus:outline-none focus:border-[#3898ec] rounded-xl px-3 py-2 scrollbar-thin transition-colors duration-150"
    value={content}
    onChange={(e) => onChange(e.target.value)}
    aria-label="텍스트 편집"
  />
);

const UrlPreview = ({
  content,
  onChange,
}: {
  content: string;
  onChange: (v: string) => void;
}) => (
  <div className="flex flex-col gap-3">
    <input
      type="text"
      className="w-full bg-[#141413] border border-[#30302e] rounded-xl px-3 py-2 text-sm text-[#faf9f5] focus:outline-none focus:border-[#3898ec] placeholder:text-[#87867f] transition-colors duration-150"
      value={content}
      onChange={(e) => onChange(e.target.value)}
      aria-label="URL 편집"
    />
    <a
      href={content}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-xs text-[#d97757] hover:text-[#c96442] transition-colors truncate rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3898ec]"
    >
      <ExternalLinkIcon />
      <span className="truncate">{content}</span>
    </a>
  </div>
);

const ImagePreview = ({ content }: { content: string }) => (
  <div className="flex justify-center">
    <img
      src={content}
      alt="붙여넣은 이미지"
      className="max-w-full max-h-64 rounded-xl object-contain border border-[#30302e]"
    />
  </div>
);

const TYPE_LABEL: Record<PasteData["type"], string> = {
  text: "텍스트",
  url: "URL",
  image: "이미지",
};

export const Preview = ({ data, onChange }: PreviewProps) => {
  const [localContent, setLocalContent] = useState(data.content);

  useEffect(() => {
    setLocalContent(data.content);
  }, [data.content, data.timestamp]);

  const handleChange = (value: string) => {
    setLocalContent(value);
    onChange(value);
  };

  return (
    <section aria-label="붙여넣기 미리보기">
      <Card>
        <div className="flex flex-col gap-3">
          <header className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
              {TYPE_LABEL[data.type]}
            </span>
          </header>

          <div>
            {data.type === "text" && (
              <TextPreview content={localContent} onChange={handleChange} />
            )}
            {data.type === "url" && (
              <UrlPreview content={localContent} onChange={handleChange} />
            )}
            {data.type === "image" && (
              <ImagePreview content={localContent} />
            )}
          </div>
        </div>
      </Card>
    </section>
  );
};

export default Preview;
