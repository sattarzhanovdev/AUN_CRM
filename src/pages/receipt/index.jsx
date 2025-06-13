import React from 'react'
import { useNavigate } from 'react-router-dom'
import { IoIosArrowRoundBack } from 'react-icons/io'
import { BiPrinter } from 'react-icons/bi'
import c from './receipt.module.scss'

const Receipt = () => {
  const navigate = useNavigate()

  // чек в localStorage
  const sale = JSON.parse(localStorage.getItem('receipt'))   // { id, total, items: [...] }

  if (!sale) return <p>Нет данных для чека</p>

  const sum = parseFloat(sale.total)                    // общая сумма
  const vat = sum * 0.1                                 // условно «НДС 10%»
  const grand = sum + vat

  return (
    <div id={c.invoicePos}>
      <h3 style={{ textAlign: 'center' }}>Чек №{sale.id}</h3>

      <div id={c.bot}>
        <div id={c.table}>
          <table>
            <thead>
              <tr className={c.tabletitle}>
                <th className={c.item}><h2>Название</h2></th>
                <th className={c.Hours}><h2>Кол-во</h2></th>
                <th className={c.Rate}><h2>Сумма</h2></th>
              </tr>
            </thead>

            <tbody>
              {sale.items.map(it => (
                <tr key={it.code} className={c.service}>
                  <td className={c.tableitem}>{it.name}</td>
                  <td className={c.tableitem}>{it.quantity}</td>
                  <td className={c.tableitem}>{it.total}</td>
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr className={c.tabletitle}>
                <td></td>
                <td className={c.Rate}><h2>Всего:</h2></td>
                <td className={c.payment}><h2>{sum.toFixed(2)} сом</h2></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className={c.buttons}>
        <button className={c.back} onClick={() => navigate(-1)}>
          <IoIosArrowRoundBack />
        </button>
        <button className={c.print} onClick={() => window.print()}>
          <BiPrinter />
        </button>
      </div>
    </div>
  )
}

export default Receipt
