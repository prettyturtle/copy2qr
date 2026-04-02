import { Outlet } from 'react-router'
import Header from './Header'
import Footer from './Footer'

const Layout = () => {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto max-w-2xl">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Layout
