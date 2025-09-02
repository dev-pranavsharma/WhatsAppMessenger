import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './global.css'
import App from './App.jsx'
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider } from './components/theme-provider'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
  <QueryClientProvider client={queryClient}>
    <App />
  <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
  </ThemeProvider>

  </StrictMode>
)
