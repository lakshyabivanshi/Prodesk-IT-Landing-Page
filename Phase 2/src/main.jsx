import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import KanbanBoard from './components/pages/KanbanBoard'

createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App/>
    </StrictMode>
        
)