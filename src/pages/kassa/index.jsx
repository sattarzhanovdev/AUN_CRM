import React from 'react'
import { API } from '../../api'

const Kassa = () => {
  const [cart, setCart] = React.useState([])
  const inputRef = React.useRef()

  // сумма
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  const handleScan = async (e) => {
    if (e.key === 'Enter') {
      const code = e.target.value.trim()
      if (!code) return

      try {
        const res = await API.getStockByCode(code)
        const found = res.data

        setCart(prev => {
          const existing = prev.find(p => p.code === found.code)
          if (existing) {
            return prev.map(p => p.code === found.code ? { ...p, qty: p.qty + 1 } : p)
          }
          return [...prev, { ...found, qty: 1 }]
        })

        e.target.value = ''
      } catch (err) {
        console.error('Товар не найден')
        e.target.value = ''
      }
    }
  }

  const handleSell = async () => {
    try {
      await Promise.all(cart.map(item => (
        API.updateStockQuantity(item.code, item.quantity - item.qty)  // минусуем
      )))
      setCart([])
      alert('Продажа завершена')
    } catch (err) {
      console.error('Ошибка при продаже:', err)
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Касса</h2>

      <input
        type="text"
        placeholder="Сканируйте товар..."
        onKeyDown={handleScan}
        ref={inputRef}
        autoFocus
      />

      <table border="1" cellPadding="10" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>Наименование</th>
            <th>Цена</th>
            <th>Кол-во</th>
            <th>Сумма</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item, idx) => (
            <tr key={idx}>
              <td>{item.name}</td>
              <td>{item.price}</td>
              <td>{item.qty}</td>
              <td>{item.qty * item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Итого: {total} сом</h3>

      <button onClick={handleSell}>Продать</button>
    </div>
  )
}

export default Kassa
