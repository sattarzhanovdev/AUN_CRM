import React from 'react'
import { API } from '../../api'

const Kassa = () => {
  const [cart, setCart] = React.useState([])
  const [goods, setGoods] = React.useState([])
  const inputRef = React.useRef()
  const [paymentType, setPaymentType] = React.useState('cash')

  const total = cart.reduce((sum, item) => sum + parseFloat(item.price) * item.qty, 0)

  React.useEffect(() => {
    API.getStocks()
      .then(res => setGoods(res.data))
      .catch(err => console.error('Ошибка загрузки товаров:', err))
  }, [])

  const handleScan = (e) => {
    if (e.key === 'Enter') {
      const code = e.target.value.trim()
      if (!code) return

      const item = goods.find(g => g.code === code)
      if (!item) {
        alert('Товар не найден')
        e.target.value = ''
        return
      }

      setCart(prev => {
        const existing = prev.find(p => p.id === item.id)
        if (existing) {
          return prev.map(p =>
            p.id === item.id ? { ...p, qty: p.qty + 1 } : p
          )
        }
        return [...prev, { ...item, qty: 1 }]
      })

      e.target.value = ''
    }
  }

  const handleSell = async () => {
    if (!cart.length) return alert('Корзина пуста')

    try {
      // Обновляем количество на складе
      await Promise.all(cart.map(item => {
        const newQty = parseFloat(item.quantity) - item.qty
        return API.updateStockQuantity(item.id, {
          code: item.code,
          name: item.name,
          price: item.price,
          unit: item.unit,
          quantity: newQty
        })
      }))

      // Отправляем историю продажи
      const salePayload = {
        total: total,
        payment_type: paymentType,
        items: cart.map(item => ({
          stock_id: item.id,
          code: item.code, // ✅ добавляем код
          name: item.name,
          price: item.price,
          quantity: item.qty,
          total: (parseFloat(item.price) * item.qty).toFixed(2)
        }))
}

      await API.createSale(salePayload)

      setCart([])
      alert('Продажа завершена и чек напечатан')
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

      <div style={{ marginTop: 10 }}>
        <label>Тип оплаты: </label>
        <select value={paymentType} onChange={e => setPaymentType(e.target.value)}>
          <option value="cash">Наличные</option>
          <option value="card">Карта</option>
        </select>
      </div>

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
