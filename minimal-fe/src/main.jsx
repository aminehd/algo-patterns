import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AlgoViz from './AlgoViz'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename="/algopatterns">
      <Routes>
        <Route path="/" element={<AlgoViz />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)