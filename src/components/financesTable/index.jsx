import React from 'react'
import c from './workers.module.scss'
import { API } from '../../api'

const FinancesTable = () => {
  const [month, setMonth] = React.useState('')
  const [data, setData] = React.useState([])
  const [selectedSale, setSelectedSale] = React.useState(null)

  React.useEffect(() => {
    const date = new Date()
    const m = date.toLocaleString('ru', { month: 'long' })
    setMonth(m.charAt(0).toUpperCase() + m.slice(1))
  }, [])

  React.useEffect(() => {
    API.getSales()
      .then(res => {
        const uniqueSales = []
        const seen = new Set()

        for (let sale of res.data) {
          const key = new Date(sale.date).toISOString()
          if (!seen.has(key)) {
            seen.add(key)
            uniqueSales.push(sale)
          }
        }

        setData(uniqueSales)
      })
      .catch(err => console.error('Ошибка загрузки транзакций:', err))
  }, [])

  const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    const day = date.toLocaleDateString('ru')
    const time = date.toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })
    return `${day} ${time}`
  }

  return (
    <div className={c.workers}>
      <div className={c.table}>
        <table>
          <thead>
            <tr>
              <th>Дата и время</th>
              <th>Сумма</th>
              <th>Тип оплаты</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{formatDateTime(item.date)}</td>
                <td>{(+item.total).toFixed(2)} сом</td>
                <td>{item.payment_type === 'cash' ? 'Наличными' : 'Картой'}</td>
                <td>
                  <button onClick={() => setSelectedSale(item)}>👁 Подробнее</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedSale && (
        <div className={c.popupOverlay} onClick={() => setSelectedSale(null)}>
          <div className={c.popup} onClick={e => e.stopPropagation()}>
            <h3>Продажа от {formatDateTime(selectedSale.date)}</h3>
            <table>
              <thead>
                <tr>
                  <th>Наименование</th>
                  <th>Цена</th>
                  <th>Количество</th>
                  <th>Сумма</th>
                </tr>
              </thead>
              <tbody>
                {selectedSale.items.map((item, i) => (
                  <tr key={i}>
                    <td>{item.name}</td>
                    <td>{(+item.price).toFixed(2)} сом</td>
                    <td>{item.quantity}</td>
                    <td>{(item.price * item.quantity).toFixed(2)} сом</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ textAlign: 'right', marginTop: 16 }}>
              <button onClick={() => setSelectedSale(null)}>Закрыть</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FinancesTable