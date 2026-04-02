import { Link } from 'react-router'

const Header = () => {
  return (
    <header
      className="sticky top-0 z-10 px-6 py-4 border-b border-[#30302e] backdrop-blur-md"
      style={{ backgroundColor: 'rgba(20, 20, 19, 0.92)' }}
    >
      <div className="mx-auto max-w-2xl flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3898ec] rounded"
          aria-label="홈으로 이동"
        >
          <div
            className="flex items-center justify-center w-7 h-7 rounded-lg text-sm font-semibold"
            style={{
              backgroundColor: '#c96442',
              color: '#faf9f5',
              fontFamily: 'Georgia, serif',
            }}
          >
            C
          </div>
          <span
            className="text-base sm:text-lg font-medium tracking-tight"
            style={{ color: '#d97757', fontFamily: 'Georgia, serif' }}
          >
            Copy2QR
          </span>
        </Link>

        <nav aria-label="상단 메뉴">
          <Link
            to="/history"
            className={[
              'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors',
              'text-[#87867f] hover:text-[#faf9f5]',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3898ec]',
            ].join(' ')}
            aria-label="공유 내역 보기"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3" />
              <path
                d="M7 4v3l2 1.5"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            내역
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
