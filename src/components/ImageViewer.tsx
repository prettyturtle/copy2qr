import { useState, useRef, useCallback } from 'react'
import Modal from './ui/Modal'

interface ImageViewerProps {
  src: string
  isOpen: boolean
  onClose: () => void
}

const MIN_SCALE = 0.5
const MAX_SCALE = 3
const SCALE_STEP = 0.25

const ImageViewer = ({ src, isOpen, onClose }: ImageViewerProps) => {
  const [scale, setScale] = useState(1)
  const touchStartDistRef = useRef<number | null>(null)
  const touchStartScaleRef = useRef<number>(1)

  const zoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev + SCALE_STEP, MAX_SCALE))
  }, [])

  const zoomOut = useCallback(() => {
    setScale((prev) => Math.max(prev - SCALE_STEP, MIN_SCALE))
  }, [])

  const reset = useCallback(() => {
    setScale(1)
  }, [])

  // 핀치줌 — 두 손가락 거리 계산
  const getTouchDist = (touches: React.TouchList): number => {
    const dx = touches[0].clientX - touches[1].clientX
    const dy = touches[0].clientY - touches[1].clientY
    return Math.hypot(dx, dy)
  }

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      touchStartDistRef.current = getTouchDist(e.touches)
      touchStartScaleRef.current = scale
    }
  }, [scale])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchStartDistRef.current !== null) {
      const currentDist = getTouchDist(e.touches)
      const ratio = currentDist / touchStartDistRef.current
      const nextScale = Math.min(
        Math.max(touchStartScaleRef.current * ratio, MIN_SCALE),
        MAX_SCALE,
      )
      setScale(nextScale)
    }
  }, [])

  const handleTouchEnd = useCallback(() => {
    touchStartDistRef.current = null
  }, [])

  const scalePercent = Math.round(scale * 100)

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-4">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#87867f] tracking-wide uppercase">
            이미지 뷰어
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="뷰어 닫기"
            className={[
              'rounded-lg p-1.5',
              'text-[#b0aea5]',
              'hover:text-[#faf9f5] hover:bg-[#30302e]',
              'transition-colors duration-150',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c96442]',
            ].join(' ')}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M1 1l14 14M15 1L1 15"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* 이미지 영역 */}
        <div
          className={[
            'relative overflow-hidden rounded-xl',
            'bg-[rgba(255,255,255,0.03)]',
            'border border-[#30302e]',
            'flex items-center justify-center',
            'min-h-[260px] max-h-[60vh]',
          ].join(' ')}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <img
            src={src}
            alt="확대/축소 뷰어"
            draggable={false}
            style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}
            className="max-w-full max-h-[60vh] object-contain transition-transform duration-150 select-none"
          />
        </div>

        {/* 컨트롤 바 */}
        <div className="flex items-center justify-between gap-2">
          {/* 줌 컨트롤 */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={zoomOut}
              disabled={scale <= MIN_SCALE}
              aria-label="축소"
              className={[
                'w-8 h-8 flex items-center justify-center rounded-lg',
                'border border-[#4d4c48]',
                'text-[#faf9f5]',
                'hover:bg-[#30302e] active:bg-[#4d4c48]',
                'disabled:opacity-30 disabled:cursor-not-allowed',
                'transition-colors duration-150',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c96442]',
              ].join(' ')}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 7h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>

            <span
              className="min-w-[3.5rem] text-center text-sm font-medium tabular-nums text-[#b0aea5]"
              aria-live="polite"
              aria-label={`현재 배율 ${scalePercent}%`}
            >
              {scalePercent}%
            </span>

            <button
              type="button"
              onClick={zoomIn}
              disabled={scale >= MAX_SCALE}
              aria-label="확대"
              className={[
                'w-8 h-8 flex items-center justify-center rounded-lg',
                'border border-[#4d4c48]',
                'text-[#faf9f5]',
                'hover:bg-[#30302e] active:bg-[#4d4c48]',
                'disabled:opacity-30 disabled:cursor-not-allowed',
                'transition-colors duration-150',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c96442]',
              ].join(' ')}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M7 2v10M2 7h10"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          {/* 리셋 */}
          <button
            type="button"
            onClick={reset}
            disabled={scale === 1}
            aria-label="원래 크기로 초기화"
            className={[
              'px-3 py-1.5 rounded-lg text-sm',
              'text-[#b0aea5]',
              'border border-[#4d4c48]',
              'hover:text-[#faf9f5] hover:bg-[#30302e]',
              'disabled:opacity-30 disabled:cursor-not-allowed',
              'transition-colors duration-150',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c96442]',
            ].join(' ')}
          >
            초기화
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default ImageViewer
