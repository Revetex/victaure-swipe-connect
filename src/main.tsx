
import React from 'react'
import ReactDOM from 'react-dom/client'
import AppWrapper from './AppWrapper'
import './index.css'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
)
