import { useEffect, useState } from 'react'
import type { Toast } from '../../hooks/useToast'

interface ToastItemProps {
  toast: Toast
  onRemove: (id: string) => void
}

const ToastItem = ({ toast, onRemove }: ToastItemProps) => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // 마운트 직후 visible을 true로 전환해 슬라이드-인 트리거
    const enterFrame = requestAnimationFrame(() => {
      setVisible(true)
    })
    return () => cancelAnimationFrame(enterFrame)
  }, [])

  const handleDismiss = () => {
    setVisible(false)
    // 슬라이드-아웃 완료 후 제거
    setTimeout(() => onRemove(toast.id), 300)
  }

  return (
    <div
      role="alert"
      aria-live="polite"
      className={[
        'flex items-center justify-between gap-3 px-4 py-3',
        'rounded-xl border border-[#4d4c48]',
        'bg-[#30302e] text-[#faf9f5]',
        'shadow-[#000_0_0_0_0,#000_0_0_0_1px,0_4px_12px_rgba(0,0,0,0.30)]',
        'transition-all duration-300 ease-out',
        visible
          ? 'translate-x-0 opacity-100'
          : 'translate-x-8 opacity-0',
      ].join(' ')}
    >
      <span className="text-sm leading-snug">{toast.message}</span>
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="닫기"
        className={[
          'shrink-0 rounded-md p-1',
          'text-[#87867f] transition-colors duration-150',
          'hover:text-[#faf9f5] hover:bg-[#4d4c48]/50',
          'focus-ring focus:outline-none',
        ].join(' ')}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M1 1l12 12M13 1L1 13"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

const ToastContainer = ({ toasts, onRemove }: ToastContainerProps) => {
  if (toasts.length === 0) return null

  return (
    <div
      aria-label="알림 목록"
      className="fixed right-4 top-4 z-50 flex flex-col gap-2 w-72 sm:w-80"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  )
}

export default ToastContainer
