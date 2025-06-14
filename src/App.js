import React from 'react'
import './App.scss'
import { Components } from './components'
import MainRoutes from './routes'
import axios from 'axios'
import BarcodeScanner from './pages/code'
import { API } from './api'

axios.defaults.baseURL = 'https://auncrm.pythonanywhere.com/clients'

function App() {
  return (
    <div>
      <Components.Navbar />
      <MainRoutes />
    </div>
  )
}

export default App
