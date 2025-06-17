import React from 'react'
import { useNavigate } from 'react-router-dom'
import { API } from '../../api'

const th = { border: '1px solid #ccc', padding: 10, textAlign: 'left' }
const td = { border: '1px solid #eee', padding: 10 }

const Kassa = () => {
  const [cart, setCart]   = React.useState([])
  const [goods, setGoods] = React.useState([])
  const [sales, setSales] = React.useState([])
  const [payment, setPay] = React.useState('cash')
  const navigate          = useNavigate()
  const inputRef          = React.useRef()

  const total = cart.reduce((s, i) => s + i.qty * +i.price, 0)

  /* ───────── Загрузка ассортимента ───────── */
  React.useEffect(() => {
    API.getStocks()
      .then(r => setGoods(r.data))
      .catch(e => console.error('Ошибка загрузки товаров', e))
  }, [])

  React.useEffect(() => {
    API.getSales()
      .then(r => setSales(r.data))
  }, [])

  /* ───────── Сканирование ───────── */
  const handleScan = e => {
    if (e.key !== 'Enter') return
    const code = e.target.value.trim()
    if (!code) return
    const item = goods.find(g => g.code === code)
    if (!item) { alert('Товар не найден'); e.target.value = ''; return }

    setCart(prev => {
      const ex = prev.find(p => p.id === item.id)
      return ex
        ? prev.map(p => p.id === item.id ? { ...p, qty: p.qty + 1 } : p)
        : [...prev, { ...item, qty: 1 }]
    })
    e.target.value = ''
  }

  /* ───────── Изменение количества ───────── */
  const changeQty = (idx, delta) =>
    setCart(prev =>
      prev.map((r, i) =>
        i === idx ? { ...r, qty: Math.max(1, r.qty + delta) } : r
      ))

  const setQtyManually = (idx, val) =>
    setCart(prev =>
      prev.map((r, i) =>
        i === idx ? { ...r, qty: Math.max(1, parseInt(val) || 1) } : r
      ))

  /* ───────── Удаление позиции ───────── */
  const removeItem = idx =>
    setCart(prev => prev.filter((_, i) => i !== idx))

  /* ───────── Продажа ───────── */
  const handleSell = async () => {
    if (!cart.length) return alert('Корзина пуста')
    try {
      const payload = {
        total: total.toFixed(2),
        payment_type: payment,
        items: cart.map(i => ({
          code: i.code, name: i.name, price: +i.price,
          quantity: i.qty,
          total: (+i.price * i.qty).toFixed(2)
        }))
      }
      const res = await API.createSale(payload)
      localStorage.setItem('receipt', JSON.stringify(res.data))
      setCart([])
      navigate('/receipt')
    } catch (e) {
      console.error('Ошибка при продаже', e)
      alert('Ошибка при продаже')
    }
  }

  const openKassa = () => {
    localStorage.setItem('open-kassa', 0) // очистка предыдущего чека
    navigate('/kassa-report')
  }
const closeKassa = () => {
    // берём только продажи текущего дня
    const today = new Date().toISOString().slice(0, 10);        // YYYY‑MM‑DD
    const summa = sales
      ?.filter(s => (s.date || s.created_at || '').slice(0, 10) === today)
      .reduce((sum, i) => sum + Number(i.total || 0), 0) || 0;

    localStorage.setItem('open-kassa', summa.toFixed(2));       // сохраняем итог
    navigate('/kassa-report');
}
  /* ───────── UI ───────── */
  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2>🧾 Касса</h2>

      <input
        ref={inputRef}
        placeholder="Сканируйте штрихкод…"
        onKeyDown={handleScan}
        autoFocus
        style={{ width: '100%', padding: 12, fontSize: 16, marginBottom: 20 }}
      />

      <div style={{ marginBottom: 20 }}>
        <label>Тип оплаты: </label>
        <select value={payment} onChange={e => setPay(e.target.value)} style={{ padding: 6, marginLeft: 8 }}>
          <option value="cash">Наличные</option>
          <option value="card">Карта</option>
        </select>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 20 }}>
        <thead style={{ background: '#f0f0f0' }}>
          <tr>
            <th style={th}>Название</th>
            <th style={th}>Цена</th>
            <th style={th}>Кол-во</th>
            <th style={th}>Сумма</th>
            <th style={th}></th>{/* столбец для удаления */}
          </tr>
        </thead>
        <tbody>
          {cart.map((it, idx) => (
            <tr key={idx}>
              <td style={td}>{it.name}</td>
              <td style={td}>{(+it.price).toFixed(2)} сом</td>

              {/* Кол-во */}
              <td style={td}>
                <button onClick={() => changeQty(idx, -1)} style={btn}>−</button>
                <input
                  type="number" min={1}
                  value={it.qty}
                  onChange={e => setQtyManually(idx, e.target.value)}
                  style={{ width: 50, textAlign: 'center' }}
                />
                <button onClick={() => changeQty(idx, +1)} style={btn}>+</button>
                <div style={{ fontSize: 11, color: '#888' }}>
                  Остаток: {it.quantity - it.qty}
                </div>
              </td>

              <td style={td}>{(it.qty * +it.price).toFixed(2)} сом</td>

              {/* Кнопка удаления */}
              <td style={td}>
                <button onClick={() => removeItem(idx)} style={delBtn}>×</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ textAlign: 'right' }}>Итого: {total.toFixed(2)} сом</h3>

      <div style={{ textAlign: 'right' }}>
        <button onClick={handleSell} style={sellBtn}>✅ Продать</button>
      </div>

      <div style={{ textAlign: 'right', marginTop: 20 }}>
        {
          localStorage.getItem('open-kassa')
            ? <button onClick={closeKassa} style={sellBtn}>Закрыть кассу</button>
            : <button onClick={openKassa} style={sellBtn}>Открыть кассу</button>
        }
      </div>

    </div>
  )
}

/* ───────── Styles ───────── */
const btn = {
  width: 28, height: 28, margin: '0 4px',
  border: '1px solid #ccc', background: '#fff', cursor: 'pointer'
}

const delBtn = {
  ...btn,
  width: 30, background: '#ff4d4f', color: '#fff', border: 'none'
}

const sellBtn = {
  background: '#27ae60', color: '#fff',
  padding: '10px 20px', fontSize: 16, border: 'none', cursor: 'pointer'
}

export default Kassa
