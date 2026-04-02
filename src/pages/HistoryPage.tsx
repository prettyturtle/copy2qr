import { useState, useCallback, useEffect } from "react";
import { useHistory } from "../hooks/useHistory";
import { useToast } from "../hooks/useToast";
import type { HistoryEntry, HistoryType } from "../types";
import ToastContainer from "../components/ui/Toast";
import QRCodeDisplay from "../components/QRCodeDisplay";

// 상대 시간 포맷
const formatRelativeTime = (timestamp: number): string => {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);

  if (diff < 60_000) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days < 7) return `${days}일 전`;
  return new Date(timestamp).toLocaleDateString("ko-KR", {
    month: "short",
    day: "numeric",
  });
};

// 데이터 타입 배지 라벨
const DATA_TYPE_LABEL: Record<string, string> = {
  text: "텍스트",
  url: "링크",
  image: "이미지",
};

interface HistoryItemProps {
  entry: HistoryEntry;
  onRemove: (id: string) => void;
  onReshare: (entry: HistoryEntry) => void;
  expandedId: string | null;
  onToggleQR: (id: string | null) => void;
}

const HistoryItem = ({
  entry,
  onRemove,
  onReshare,
  expandedId,
  onToggleQR,
}: HistoryItemProps) => {
  const isQROpen = expandedId === entry.id;

  return (
    <article
      aria-label={`${DATA_TYPE_LABEL[entry.dataType]} 히스토리 항목`}
      className="bg-[#30302e] border border-[#3d3c39] rounded-xl p-4 flex flex-col gap-3"
    >
      {/* 상단: 배지 + 시간 */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide bg-[#1e1e1c] text-[#87867f] border border-[#3d3c39]">
            {DATA_TYPE_LABEL[entry.dataType]}
          </span>
          <span
            className={[
              "px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide border",
              entry.historyType === "sent"
                ? "bg-[#c96442]/10 text-[#c96442] border-[#c96442]/30"
                : "bg-[#3898ec]/10 text-[#3898ec] border-[#3898ec]/30",
            ].join(" ")}
          >
            {entry.historyType === "sent" ? "보냄" : "받음"}
          </span>
        </div>
        <time
          dateTime={new Date(entry.createdAt).toISOString()}
          className="text-xs text-[#87867f] shrink-0"
        >
          {formatRelativeTime(entry.createdAt)}
        </time>
      </div>

      {/* 미리보기 */}
      <p className="text-sm text-[#b0aea5] leading-relaxed break-words line-clamp-2">
        {entry.preview}
      </p>

      {/* QR 코드 인라인 표시 */}
      {isQROpen && (
        <div className="flex flex-col items-center gap-2 pt-1 pb-1">
          <QRCodeDisplay value={entry.shareUrl} size={180} />
          <p className="text-xs text-[#87867f] break-all text-center max-w-full">
            {entry.shareUrl}
          </p>
        </div>
      )}

      {/* 액션 버튼 */}
      <div className="flex items-center gap-2 pt-1 border-t border-[#3d3c39]">
        <button
          type="button"
          onClick={() => onReshare(entry)}
          className={[
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
            "bg-[#c96442]/15 border border-[#c96442]/30 text-[#c96442]",
            "hover:bg-[#c96442]/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3898ec]",
          ].join(" ")}
          aria-label="링크 복사하여 재공유"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <circle cx="2.5" cy="6" r="1.8" stroke="currentColor" strokeWidth="1.3" />
            <circle cx="9.5" cy="2" r="1.8" stroke="currentColor" strokeWidth="1.3" />
            <circle cx="9.5" cy="10" r="1.8" stroke="currentColor" strokeWidth="1.3" />
            <path d="M4.2 5.2l3.6-2.2M4.2 6.8l3.6 2.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          링크 복사
        </button>
        <button
          type="button"
          onClick={() => onToggleQR(isQROpen ? null : entry.id)}
          className={[
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
            isQROpen
              ? "bg-[#3d3c39] border border-[#4d4c48] text-[#faf9f5]"
              : "bg-transparent border border-[#3d3c39] text-[#87867f] hover:text-[#faf9f5] hover:border-[#4d4c48]",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3898ec]",
          ].join(" ")}
          aria-label={isQROpen ? "QR 코드 닫기" : "QR 코드 보기"}
          aria-expanded={isQROpen}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <rect x="1" y="1" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.3" />
            <rect x="7" y="1" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.3" />
            <rect x="1" y="7" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.3" />
            <path d="M7 7h1v1H7zM9 7h2v2H9zM7 9h2v2H7zM9 9v2h2" stroke="currentColor" strokeWidth="1" />
          </svg>
          QR
        </button>
        <button
          type="button"
          onClick={() => onRemove(entry.id)}
          className={[
            "ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
            "bg-transparent border border-transparent text-[#87867f]",
            "hover:text-[#b53333] hover:border-[#b53333]/30 hover:bg-[#b53333]/10",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3898ec]",
          ].join(" ")}
          aria-label="이 항목 삭제"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M1.5 3h9M4 3V2h4v1M5 5.5v3M7 5.5v3M2.5 3l.5 7h6l.5-7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          삭제
        </button>
      </div>
    </article>
  );
};

type TabType = "all" | HistoryType;

const HistoryPage = () => {
  const { getEntries, removeEntry, clearAll } = useHistory();
  const { toasts, showToast, removeToast } = useToast();

  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // 탭 변경 시 목록 갱신
  useEffect(() => {
    const filter = activeTab === "all" ? undefined : activeTab;
    setEntries(getEntries(filter));
    setExpandedId(null);
  }, [activeTab, getEntries]);

  const handleRemove = useCallback(
    (id: string) => {
      removeEntry(id);
      const filter = activeTab === "all" ? undefined : activeTab;
      setEntries(getEntries(filter));
      setExpandedId((prev) => (prev === id ? null : prev));
    },
    [removeEntry, getEntries, activeTab],
  );

  const handleClearAll = useCallback(() => {
    clearAll();
    setEntries([]);
    setExpandedId(null);
  }, [clearAll]);

  const handleReshare = useCallback(
    async (entry: HistoryEntry) => {
      try {
        await navigator.clipboard.writeText(entry.shareUrl);
        showToast("링크가 복사되었습니다");
      } catch {
        showToast("링크 복사에 실패했습니다");
      }
    },
    [showToast],
  );

  const handleToggleQR = useCallback((id: string | null) => {
    setExpandedId(id);
  }, []);

  const tabs: { key: TabType; label: string }[] = [
    { key: "all", label: "전체" },
    { key: "sent", label: "보낸 내역" },
    { key: "received", label: "받은 내역" },
  ];

  return (
    <main aria-label="공유 내역" className="flex flex-col gap-6 w-full">
      {/* 페이지 제목 */}
      <div className="flex items-center justify-between">
        <h1
          className="text-xl font-semibold text-[#faf9f5]"
          style={{ fontFamily: "Georgia, serif" }}
        >
          공유 내역
        </h1>
        {entries.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className={[
              "text-xs text-[#87867f] hover:text-[#b53333] transition-colors",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3898ec] rounded",
            ].join(" ")}
          >
            전체 삭제
          </button>
        )}
      </div>

      {/* 탭 */}
      <nav
        aria-label="공유 내역 필터"
        className="flex gap-1 bg-[#1e1e1c] rounded-xl p-1"
      >
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={activeTab === key}
            onClick={() => setActiveTab(key)}
            className={[
              "flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3898ec]",
              activeTab === key
                ? "bg-[#30302e] text-[#faf9f5]"
                : "text-[#87867f] hover:text-[#b0aea5]",
            ].join(" ")}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* 목록 */}
      {entries.length === 0 ? (
        <section
          aria-label="빈 상태"
          className="flex flex-col items-center gap-3 py-16 text-center"
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            aria-hidden="true"
            className="text-[#3d3c39]"
          >
            <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" />
            <path d="M13 20h14M20 13v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <p className="text-sm text-[#87867f]">공유 내역이 없습니다</p>
          <p className="text-xs text-[#3d3c39]">
            {activeTab === "sent"
              ? "링크를 복사하면 여기에 기록됩니다"
              : activeTab === "received"
                ? "공유 링크를 열면 여기에 기록됩니다"
                : "공유하거나 받은 내역이 여기에 쌓입니다"}
          </p>
        </section>
      ) : (
        <section aria-label="히스토리 목록" className="flex flex-col gap-3">
          {entries.map((entry) => (
            <HistoryItem
              key={entry.id}
              entry={entry}
              onRemove={handleRemove}
              onReshare={handleReshare}
              expandedId={expandedId}
              onToggleQR={handleToggleQR}
            />
          ))}
        </section>
      )}

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </main>
  );
};

export default HistoryPage;
