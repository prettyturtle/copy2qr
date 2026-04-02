import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router'
import { useShareData } from '../hooks/useShareData'
import { useToast } from '../hooks/useToast'
import { useHistory } from '../hooks/useHistory'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import ToastContainer from '../components/ui/Toast'
import ImageViewer from '../components/ImageViewer'
import type { SharePayload } from '../types'

const SharePage = () => {
  const { decodeShareData } = useShareData()
  const { toasts, showToast, removeToast } = useToast()
  const { addEntry } = useHistory()

  const [payload, setPayload] = useState<SharePayload | null>(null)
  const [decodeError, setDecodeError] = useState(false)
  const [viewerOpen, setViewerOpen] = useState(false)

  // URL hash에서 데이터 복원
  useEffect(() => {
    const result = decodeShareData()
    if (result === null) {
      setDecodeError(true)
    } else {
      setPayload(result)
      addEntry({
        historyType: 'received',
        dataType: result.type,
        content: result.type === 'image' ? '' : result.data,
        shareUrl: window.location.href,
        preview:
          result.type === 'image' ? '[이미지]' : result.data.slice(0, 50),
      })
    }
  }, [decodeShareData, addEntry])

  // 텍스트 / URL 클립보드 복사
  const handleCopyText = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text)
        showToast('클립보드에 복사됐습니다')
      } catch {
        showToast('복사에 실패했습니다')
      }
    },
    [showToast],
  )

  // URL 새 탭 열기
  const handleOpenUrl = useCallback((url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }, [])

  // 이미지 클립보드 복사 (ClipboardItem)
  const handleCopyImage = useCallback(
    async (base64: string) => {
      try {
        // data:image/png;base64,... 에서 MIME 타입과 데이터 분리
        const match = base64.match(/^data:([^;]+);base64,(.+)$/)
        const mimeType = match ? match[1] : 'image/png'
        const raw = match ? match[2] : base64
        const bytes = Uint8Array.from(atob(raw), (c) => c.charCodeAt(0))
        const blob = new Blob([bytes], { type: mimeType })
        await navigator.clipboard.write([
          new ClipboardItem({ [mimeType]: blob }),
        ])
        showToast('이미지를 클립보드에 복사했습니다')
      } catch {
        showToast('이미지 복사에 실패했습니다 (브라우저 미지원일 수 있습니다)')
      }
    },
    [showToast],
  )

  // 이미지 저장
  const handleSaveImage = useCallback(
    (base64: string) => {
      const a = document.createElement('a')
      a.href = base64
      a.download = 'copy2qr-image.png'
      a.click()
      showToast('이미지를 저장했습니다')
    },
    [showToast],
  )

  // 공통 헤더 — 안내 배너
  const renderBanner = () => (
    <header className="text-center mb-8">
      <p className="inline-flex items-center gap-2 text-xs text-[#87867f] tracking-wide uppercase px-3 py-1 rounded-full border border-[#30302e] bg-[#30302e]">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.4" />
          <path d="M6 5v4M6 3.5v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        Copy2QR로 공유된 내용입니다
      </p>
    </header>
  )

  // 에러 상태
  if (decodeError) {
    return (
      <main className="min-h-dvh flex flex-col items-center justify-center px-4 py-12">
        {renderBanner()}
        <Card className="w-full max-w-md text-center">
          <div className="flex flex-col items-center gap-4">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              aria-hidden="true"
              className="text-[#87867f]"
            >
              <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M20 12v10M20 26v2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <div>
              <p className="font-semibold text-[#faf9f5] mb-1">
                공유 데이터를 복원할 수 없습니다
              </p>
              <p className="text-sm text-[#b0aea5]">
                링크가 올바르지 않거나 만료됐을 수 있습니다.
              </p>
            </div>
            <Link
              to="/"
              className={[
                'mt-2 inline-flex items-center gap-1.5 text-sm',
                'text-[#d97757]',
                'hover:text-[#c96442] transition-colors duration-150',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c96442]',
              ].join(' ')}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M9 2L4 7l5 5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              메인으로 돌아가기
            </Link>
          </div>
        </Card>
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </main>
    )
  }

  // 로딩 (payload 아직 없음)
  if (payload === null) {
    return (
      <main className="min-h-dvh flex items-center justify-center">
        <span className="text-[#87867f] text-sm">불러오는 중…</span>
      </main>
    )
  }

  return (
    <main className="min-h-dvh flex flex-col items-center px-4 py-12">
      {renderBanner()}

      <section
        aria-label="공유 내용"
        className="w-full max-w-lg flex flex-col gap-4"
      >
        {/* 텍스트 타입 */}
        {payload.type === 'text' && (
          <Card>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#87867f]">
                  텍스트
                </span>
              </div>
              <p className="text-[#faf9f5] leading-relaxed whitespace-pre-wrap break-words text-sm">
                {payload.data}
              </p>
              <div className="flex justify-end">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleCopyText(payload.data)}
                  aria-label="텍스트 복사"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <rect x="4" y="1" width="9" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
                    <path d="M1 4v8a1.5 1.5 0 001.5 1.5H9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                  복사
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* URL 타입 */}
        {payload.type === 'url' && (
          <Card>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#87867f]">
                  링크
                </span>
              </div>
              <a
                href={payload.data}
                target="_blank"
                rel="noopener noreferrer"
                className={[
                  'text-sm break-all',
                  'text-[#d97757]',
                  'hover:text-[#c96442] transition-colors duration-150',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c96442]',
                ].join(' ')}
              >
                {payload.data}
              </a>
              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopyText(payload.data)}
                  aria-label="링크 복사"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <rect x="4" y="1" width="9" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
                    <path d="M1 4v8a1.5 1.5 0 001.5 1.5H9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                  복사
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleOpenUrl(payload.data)}
                  aria-label="링크 열기"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path
                      d="M6 2H2.5A1.5 1.5 0 001 3.5v8A1.5 1.5 0 002.5 13h8A1.5 1.5 0 0012 11.5V8"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                    <path
                      d="M8 1h5v5M13 1L7 7"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  이동
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* 이미지 타입 (T5.2 + T5.3 통합) */}
        {payload.type === 'image' && (
          <>
            <Card>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#87867f]">
                    이미지
                  </span>
                </div>

                {/* 썸네일 */}
                <div
                  className={[
                    'rounded-xl overflow-hidden',
                    'bg-[rgba(255,255,255,0.03)]',
                    'border border-[#30302e]',
                    'flex items-center justify-center',
                    'max-h-64',
                  ].join(' ')}
                >
                  <img
                    src={payload.data}
                    alt="공유된 이미지"
                    className="max-w-full max-h-64 object-contain"
                  />
                </div>

                {/* 액션 버튼들 */}
                <div className="flex items-center justify-end gap-2 flex-wrap">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewerOpen(true)}
                    aria-label="이미지 확대 뷰어 열기"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.4" />
                      <path d="M9.5 9.5L13 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                      <path d="M4 6h4M6 4v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    </svg>
                    뷰어
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleSaveImage(payload.data)}
                    aria-label="이미지 저장"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path
                        d="M7 1v8M4 6l3 3 3-3"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M1 11v.5A1.5 1.5 0 002.5 13h9a1.5 1.5 0 001.5-1.5V11"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                      />
                    </svg>
                    저장
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleCopyImage(payload.data)}
                    aria-label="이미지 클립보드 복사"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <rect x="4" y="1" width="9" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
                      <path d="M1 4v8a1.5 1.5 0 001.5 1.5H9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    </svg>
                    복사
                  </Button>
                </div>
              </div>
            </Card>

            {/* ImageViewer 모달 */}
            <ImageViewer
              src={payload.data}
              isOpen={viewerOpen}
              onClose={() => setViewerOpen(false)}
            />
          </>
        )}
      </section>

      {/* 하단 — 나도 공유하기 */}
      <footer className="mt-12 text-center">
        <Link
          to="/"
          className={[
            'inline-flex items-center gap-1.5',
            'text-sm text-[#b0aea5]',
            'hover:text-[#d97757] transition-colors duration-150',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c96442]',
          ].join(' ')}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <circle cx="3" cy="7" r="2" stroke="currentColor" strokeWidth="1.4" />
            <circle cx="11" cy="2.5" r="2" stroke="currentColor" strokeWidth="1.4" />
            <circle cx="11" cy="11.5" r="2" stroke="currentColor" strokeWidth="1.4" />
            <path
              d="M4.8 6.2l4.4-2.6M4.8 7.8l4.4 2.6"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
          나도 Copy2QR로 공유하기
        </Link>
      </footer>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </main>
  )
}

export default SharePage
