import React from 'react'
import c from './add.module.scss'
import { Icons } from '../../assets/icons'
import { API } from '../../api'

const AddStock = ({ setActive }) => {
  const [count, setCount] = React.useState(1)
  const [data, setData] = React.useState([{name: '', amount: '', price: '', price_seller: '', code: '', unit: 'шт'}])

  const handleChange = (index, field, value) => {
    const newData = [...data]
    newData[index] = { ...newData[index], [field]: value }
    setData(newData)
  }

  const handleAddForm = () => {
    setCount(prev => prev + 1)
    setData(prev => [...prev, {name: '', amount: '', price: '', price_seller: '', code: '', unit: 'шт'}]);
  }

  const handleSave = (value) => {
    API.postStock(value)
      .then(res => {
        if(res.status === 500) {
          setActive(false)
          window.location.reload()
        }
      })
      .catch(err =>{
        if(err.status === 500) {
          setActive(false)
          window.location.reload()
        }
      })
  };

  console.log(data);

  return (
    <div className={c.addExpense}>
      <div className={c.addExpense__header}>
        <h2>Добавление товара</h2>
      </div>

      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={c.addExpense__form}
        >
          <div className={c.addExpense__form__item}>
            <label htmlFor={`name-${index}`}>Код товара</label>
            <input
              type="text"
              id={`name-${index}`}
              placeholder="Код товара"
              value={data[index]?.code || ''}
              onChange={e => handleChange(index, 'code', e.target.value)}
            />
          </div>
          <div className={c.addExpense__form__item}>
            <label htmlFor={`name-${index}`}>Наименование товара</label>
            <input
              type="text"
              id={`name-${index}`}
              placeholder="Введите наименование товара"
              value={data[index]?.name || ''}
              onChange={e => handleChange(index, 'name', e.target.value)}
            />
          </div>
          <div className={c.addExpense__form__item}>
            <label htmlFor={`amount-${index}`}>Количество</label>
            <input
              type="number"
              id={`amount-${index}`}
              placeholder="Введите количество"
              value={data[index]?.amount || ''}
              onChange={e => handleChange(index, 'amount', e.target.value)}
            />
          </div>
          <div className={c.addExpense__form__item}>
            <label htmlFor={`price-${index}`}>Стоимость поставщика</label>
            <input
              type="number"
              id={`price-${index}`}
              placeholder="Введите стоимость поставщика"
              value={data[index]?.price_seller || ''}
              onChange={e => handleChange(index, 'price_seller', e.target.value)}
            />
          </div>
          <div className={c.addExpense__form__item}>
            <label htmlFor={`price-${index}`}>Стоимость на продаже</label>
            <input
              type="number"
              id={`price-${index}`}
              placeholder="Введите стоимость на продаже"
              value={data[index]?.price || ''}
              onChange={e => handleChange(index, 'price', e.target.value)}
            />
          </div>
        </div>
      ))}

      <button onClick={handleAddForm}>
        <img src={Icons.plus} alt="plus" />
        Добавить наименование
      </button>

      <div className={c.res}>
        <button onClick={() => setActive(false)}>
          Отменить
        </button>
        <button onClick={() => handleSave(data)}>
          <img src={Icons.addGreen} alt="add" />
          Сохранить
        </button>
      </div>
    </div>
  )
}

export default AddStock