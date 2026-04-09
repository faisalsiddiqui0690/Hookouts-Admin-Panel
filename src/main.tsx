import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Load external scripts
const loadScript = (src: string) => {
  const script = document.createElement('script')
  script.src = src
  script.async = true
  document.body.appendChild(script)
}

const Root = () => {
  useEffect(() => {
    // Load Lucide icons
    loadScript('https://unpkg.com/lucide@latest')
    
    return () => {
      // Cleanup if needed
    }
  }, [])

  return <App />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
