import React from 'react'
import { API } from '../../api'
import { useNavigate } from 'react-router-dom'

const Kassa = () => {
  const [cart, setCart] = React.useState([])
  const [goods, setGoods] = React.useState([])
  const [paymentType, setPaymentType] = React.useState('cash')
  const inputRef = React.useRef()

  const total = cart.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.qty, 0
  )

  const Navigate = useNavigate()

  React.useEffect(() => {
    API.getStocks()
      .then(res => setGoods(res.data))
      .catch(err => console.error('Ошибка загрузки товаров:', err))
  }, [])

  const handleScan = (e) => {
    if (e.key !== 'Enter') return
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
      return existing
        ? prev.map(p =>
            p.id === item.id ? { ...p, qty: p.qty + 1 } : p
          )
        : [...prev, { ...item, qty: 1 }]
    })
    e.target.value = ''
  }

  const handleSell = async () => {
  if (!cart.length) return alert('Корзина пуста')

  try {
    const payload = {
      total: total.toFixed(2),
      payment_type: paymentType,
      items: cart.map(i => ({
        code: i.code,
        name: i.name,
        price: +i.price,
        quantity: i.qty,
        total: (+i.price * i.qty).toFixed(2)
      }))
    }

    const res = await API.createSale(payload)   // ← backend вернёт чек
    localStorage.setItem('receipt', JSON.stringify(res.data))   // 👈

    setCart([])
    Navigate('/receipt')                         // 👈 переход
  } catch (err) {
    console.error('Ошибка при продаже:', err)
    alert('Ошибка при продаже')
  }
}

  return (
    <div style={{
      padding: 24,
      maxWidth: 800,
      margin: '0 auto',
      fontFamily: 'sans-serif'
    }}>
      <h2>🧾 Касса</h2>

      <input
        type="text"
        placeholder="Сканируйте штрихкод..."
        onKeyDown={handleScan}
        ref={inputRef}
        autoFocus
        style={{
          width: '100%',
          padding: 12,
          fontSize: 16,
          marginBottom: 20
        }}
      />

      <div style={{ marginBottom: 20 }}>
        <label>Тип оплаты: </label>
        <select
          value={paymentType}
          onChange={e => setPaymentType(e.target.value)}
          style={{ padding: 6, marginLeft: 8 }}
        >
          <option value="cash">Наличные</option>
          <option value="card">Карта</option>
        </select>
      </div>

      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: 20
      }}>
        <thead style={{ backgroundColor: '#f0f0f0' }}>
          <tr>
            <th style={thStyle}>Наименование</th>
            <th style={thStyle}>Цена</th>
            <th style={thStyle}>Кол-во</th>
            <th style={thStyle}>Сумма</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item, idx) => (
            <tr key={idx}>
              <td style={tdStyle}>{item.name}</td>
              <td style={tdStyle}>{parseFloat(item.price)} сом</td>
              <td style={tdStyle}>{item.qty}</td>
              <td style={tdStyle}>
                {(parseFloat(item.price) * item.qty).toFixed(2)} сом
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ textAlign: 'right' }}>Итого: {total.toFixed(2)} сом</h3>

      <div style={{ textAlign: 'right' }}>
        <button onClick={handleSell} style={{
          backgroundColor: '#27ae60',
          color: '#fff',
          padding: '10px 20px',
          fontSize: 16,
          border: 'none',
          cursor: 'pointer'
        }}>
          ✅ Продать
        </button>
      </div>
    </div>
  )
}

const thStyle = {
  border: '1px solid #ccc',
  padding: 10,
  textAlign: 'left'
}

const tdStyle = {
  border: '1px solid #eee',
  padding: 10
}

export default Kassa
