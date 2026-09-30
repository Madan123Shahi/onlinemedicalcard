import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
// ⚡ 1. Import the TanStack React Query Provider elements
import { QueryClient, QueryClientProvider } from '@tanstack/react-query' 
import './index.css'
import App from './App.jsx'

// ⚡ 2. Initialize a persistent global QueryClient instance framework
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevents aggressive network calls on tab switching
      retry: 1, // Number of automatic attempts before showing error states
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* ⚡ 3. Wrap everything inside the core QueryClientProvider layer */}
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
