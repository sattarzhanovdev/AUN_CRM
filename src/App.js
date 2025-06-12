import React from 'react'
import './App.scss'
import { Components } from './components'
import MainRoutes from './routes'
import axios from 'axios'
import BarcodeScanner from './pages/code'

axios.defaults.baseURL = 'https://auncrm.pythonanywhere.com/clients'

function App() {
  return (
    <div>
      {/* <Components.Navbar />
      <MainRoutes /> */}
      <BarcodeScanner />
    </div>
  )
}

export default App
