import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Montage de l'application dans la balise root de index.html
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
