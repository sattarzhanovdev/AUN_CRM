import React from 'react'
import { API } from '../../api'

const Kassa = () => {
  const [cart, setCart] = React.useState([])
  const inputRef = React.useRef()

  const total = cart.reduce((sum, item) => sum + parseFloat(item.price) * item.qty, 0)

  const handleScan = async (e) => {
    if (e.key === 'Enter') {
      const code = e.target.value.trim()
      if (!code) return

      try {
        const res = await API.getStockByCode(code)
        const found = Array.isArray(res.data) ? res.data[0] : res.data

        if (!found) {
          alert('Товар не найден')
          e.target.value = ''
          return
        }

        setCart(prev => {
          const existing = prev.find(p => p.id === found.id)
          if (existing) {
            return prev.map(p =>
              p.id === found.id ? { ...p, qty: p.qty + 1 } : p
            )
          }
          return [...prev, { ...found, qty: 1 }]
        })

        e.target.value = ''
      } catch (err) {
        console.error('Ошибка при поиске товара:', err)
        e.target.value = ''
      }
    }
  }

  const handleSell = async () => {
    try {
      await Promise.all(cart.map(item => {
        const newQty = parseFloat(item.quantity) - item.qty
        return API.updateStockById(item.id, { quantity: newQty })
      }))
      setCart([])
      alert('Продажа завершена')
    } catch (err) {
      console.error('Ошибка при продаже:', err)
      alert('Ошибка при продаже')
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Касса</h2>

      <input
        type="text"
        placeholder="Сканируйте штрихкод..."
        onKeyDown={handleScan}
        ref={inputRef}
        autoFocus
      />

      <table border="1" cellPadding="10" style={{ marginTop: 20, width: '100%' }}>
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
              <td>{parseFloat(item.price)} сом</td>
              <td>{item.qty}</td>
              <td>{(parseFloat(item.price) * item.qty).toFixed(2)} сом</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Итого: {total.toFixed(2)} сом</h3>

      <button onClick={handleSell}>Продать</button>
    </div>
  )
}

export default Kassa
