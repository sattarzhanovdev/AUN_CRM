import React from 'react'
import './App.scss'
import { Components } from './components'
import MainRoutes from './routes'
import axios from 'axios'
import BarcodeScanner from './pages/code'
import { API } from './api'
import { useNavigate } from 'react-router-dom'

axios.defaults.baseURL = 'https://auncrm.pythonanywhere.com/clients'
// axios.defaults.baseURL = 'http://127.0.0.1:8000/clients'

function App() {
  const nav = useNavigate()

  const path = window.location.pathname
  React.useEffect(() => {
    if(path !== '/kassa' || path !== '/kassa-report' || path !== 'receipt' || path !== '/codes-print' || path !== '/return'){
      const code = prompt('Введите код доступа к админке')
      if(code !== '4542'){
        alert('Неверный код доступа')
        nav('/kassa')
      }
    }
  }, [path])
  
  return (
    <div>
      <Components.Navbar />
      <MainRoutes />
    </div>
  )
}

export default App
