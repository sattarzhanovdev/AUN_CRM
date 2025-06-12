import React from 'react'
import './App.scss'
import { Components } from './components'
import MainRoutes from './routes'
import axios from 'axios'

axios.defaults.baseURL = 'http://127.0.0.1:8000/clients'

function App() {
  return (
    <div>
      <Components.Navbar />
      <MainRoutes />
    </div>
  )
}

export default App
