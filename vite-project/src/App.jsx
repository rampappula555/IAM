import { useState } from 'react'
import DocumentViewer from './components/documentViewer'
import './App.css'
import { IAMProvider } from './context/IAMContext'
function App() {
  return (
    <>
      <IAMProvider>
        <h1>IAM</h1>
        <DocumentViewer user='john' documentId={123} />
      </IAMProvider>
    </>
  )
}

export default App
