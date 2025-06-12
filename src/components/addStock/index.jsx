import React from 'react'
import c from './add.module.scss'
import { Icons } from '../../assets/icons'
import { API } from '../../api'

const AddStock = ({ setActive }) => {
  const [count, setCount] = React.useState(1)
  const [data, setData] = React.useState([{name: '', amount: '', plusToday: '', minusToday: '', quantity: '', status: ''}])

  const handleChange = (index, field, value) => {
    const newData = [...data]
    newData[index] = { ...newData[index], [field]: value }
    setData(newData)
  }

  const handleAddForm = () => {
    setCount(prev => prev + 1)
    setData(prev => [...prev, {name: '', amount: '', plusToday: '', minusToday: '', quantity: '', status: '', price: ''}]);
  }

  const handleSave = (value) => {
    API.postStock(value)
      .then(() => {
        setActive(false)
      })
      .catch(err => console.error(err))
  };

  console.log(data);

  return (
    <div className={c.addExpense}>
      <div className={c.addExpense__header}>
        <h2>Добавление закупа</h2>
      </div>

      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={c.addExpense__form}
        >
          <div className={c.addExpense__form__item}>
            <label htmlFor={`name-${index}`}>Наименование расхода</label>
            <input
              type="text"
              id={`name-${index}`}
              placeholder="Введите наименование расхода"
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
            <div className={c.addExpense__form__item__unit}>
              {['мл', 'единица', 'шт', 'л'].map(unit => (
                <div key={unit}>
                  <input
                    type="radio"
                    id={`${unit}-${index}`}
                    name={`unit-${index}`} // группировка радио для текущей формы
                    value={unit}
                    checked={data[index]?.unit === unit}
                    onChange={e => handleChange(index, 'unit', e.target.value)}
                  />
                  <label htmlFor={`${unit}-${index}`}>
                    {unit.slice(0, 1).toUpperCase() + unit.slice(1)}
                  </label>
                </div>
              ))}
            </div>
            <input
              type="number"
              id={`expense-${index}`}
              placeholder="Единица измерения и в сумме сколько"
              value={data[index]?.quantity || ''}
              onChange={e => handleChange(index, 'quantity', e.target.value)}
            />
          </div>
          <div className={c.addExpense__form__item}>
            <label htmlFor={`price-${index}`}>Стоимость</label>
            <input
              type="number"
              id={`price-${index}`}
              placeholder="Введите стоимость"
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
