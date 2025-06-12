import React from 'react'
import c from './workers.module.scss'
import { periods } from '../../utils'
import { API } from '../../api'

const WorkersBenefit = () => {
  const [ month, setMonth ] = React.useState()
  const [ period, setPeriod ] = React.useState(1)
  const [ workers, setWorkers ] = React.useState(null)

  React.useEffect(() => {
    const date = new Date()
    const month = date.toLocaleString('ru', { month: 'long' })
    setMonth(month.slice(0, 1).toUpperCase() + month.slice(1))
  }, [])

  React.useEffect(() => {
    API.getStaffInfo()
      .then(res => setWorkers(res.data))
  }, [])

  const handlePeriodChange = (id) => {
    API.getStaffInfoWeek(id)
      .then(res => setWorkers(res.data))
  }

  return (
    <div className={c.workers}>
      <div className={c.title}>
        <h1>
          Прибыль сотрудников
        </h1>
        <div className={c.left}>
          <div className={c.date}>
            <span>
              {month}
            </span>
            <button>
              Выбрать месяц
            </button>
          </div>
          <span className={c.line}></span>
          <div className={c.periods}>
            {
              periods.map(item => (
                <button 
                  key={item.id} 
                  className={period === item.id ? c.active : ''} 
                  onClick={() => {
                    handlePeriodChange(item.id)
                    setPeriod(item.id)
                  }}
                >
                  {item.title}
                </button>
              ))
            }
          </div>
        </div>
      </div>
      <div className={c.table}>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Данные сотрудников</th>
              <th>Оборот</th>
              <th>Прибыль</th>
              <th>Сальдо</th>
              <th>Количество записей</th>
            </tr>
          </thead>
          <tbody>
            {
              workers && workers.map((item, i) => (
                <tr key={i}>
                  <td>{i+1}</td>
                  <td>{item.name}</td>
                  <td>{item.revenue}</td>
                  <td>{item.profit}</td>
                  <td>{item.balance}</td>
                  <td>{item.count}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default WorkersBenefit
