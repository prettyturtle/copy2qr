import { HashRouter, Routes, Route } from 'react-router'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import SharePage from './pages/SharePage'

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="share" element={<SharePage />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App
