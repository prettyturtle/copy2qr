const Header = () => {
  return (
    <header
      className="sticky top-0 z-10 px-6 py-4 border-b border-[#30302e] backdrop-blur-md"
      style={{ backgroundColor: 'rgba(20, 20, 19, 0.92)' }}
    >
      <div className="mx-auto max-w-2xl flex items-center justify-between">
        <div className="flex items-center gap-2.5">
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
        </div>
      </div>
    </header>
  )
}

export default Header
