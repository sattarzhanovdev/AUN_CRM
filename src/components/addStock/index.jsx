import React from 'react'
import c from './add.module.scss'
import { Icons } from '../../assets/icons'

const emptyRow = {
  name: '',
  quantity: '',
  price: '',
  category: '',
  price_seller: '',
  code: '',
  unit: 'шт',
  fixed_quantity: ''
}

const AddStock = ({ setActive }) => {
  const [rows, setRows] = React.useState([emptyRow])
  const [categories, setCategories] = React.useState([])
  const [loading, setLoading] = React.useState(false)

  const branchAPI = 'https://auncrm.pythonanywhere.com' // Только Сокулук

  const handleChange = (index, field, value) => {
    setRows(prev =>
      prev.map((row, i) => {
        if (i !== index) return row
        if (field === 'quantity') {
          return {
            ...row,
            quantity: value,
            fixed_quantity: row.fixed_quantity || value
          }
        }
        return { ...row, [field]: value }
      })
    )
  }

  const addRow = () => setRows(prev => [...prev, emptyRow])

  const handleSave = async () => {
    const payload = rows.map(item => ({
      name: item.name,
      code: item.code.split(',').map(c => c.trim()).filter(Boolean),
      quantity: +item.quantity || 0,
      price: +item.price || 0,
      price_seller: +item.price_seller || 0,
      unit: item.unit || 'шт',
      fixed_quantity: +item.fixed_quantity || +item.quantity || 0,
      category_id: +item.category || null
    }))

    try {
      setLoading(true)
      const res = await fetch(`${branchAPI}/clients/stocks/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      setLoading(false)

      if (res.status === 201 || res.status === 200) {
        alert('Товары успешно добавлены')
        setActive(false)
        window.location.reload()
      } else {
        alert('Ошибка при сохранении товара')
      }
    } catch (err) {
      setLoading(false)
      console.error('Ошибка при сохранении товара:', err)
    }
  }

  React.useEffect(() => {
    fetch(`${branchAPI}/clients/categories/`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error('Не удалось загрузить категории:', err))
  }, [])

  return (
    <div className={c.modalOverlay} onClick={() => setActive(false)}>
      <div className={c.modalWindow} onClick={e => e.stopPropagation()}>
        {loading && (
          <div className={c.loadingOverlay}>
            <div className={c.loader}></div>
            <span>Сохраняем товары...</span>
          </div>
        )}

        <div className={c.addExpense}>
          <div className={c.addExpense__header}>
            <h2>Добавление товара</h2>
          </div>

          {rows.map((row, idx) => (
            <div key={idx} className={c.addExpense__form}>
              <div className={c.addExpense__form__item}>
                <label>Код</label>
                <input value={row.code} onChange={e => handleChange(idx, 'code', e.target.value)} placeholder="Код товара (через запятую)" />
              </div>
              <div className={c.addExpense__form__item}>
                <label>Наименование</label>
                <input value={row.name} onChange={e => handleChange(idx, 'name', e.target.value)} placeholder="Введите наименование" />
              </div>
              <div className={c.addExpense__form__item}>
                <label>Категория</label>
                <select value={row.category} onChange={e => handleChange(idx, 'category', e.target.value)}>
                  <option value="">‒ выберите ‒</option>
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>
              <div className={c.addExpense__form__item}>
                <label>Количество</label>
                <input type="number" value={row.quantity} onChange={e => handleChange(idx, 'quantity', e.target.value)} placeholder="0" />
              </div>
              <div className={c.addExpense__form__item}>
                <label>Цена поставщика</label>
                <input type="number" value={row.price_seller} onChange={e => handleChange(idx, 'price_seller', e.target.value)} placeholder="0" />
              </div>
              <div className={c.addExpense__form__item}>
                <label>Цена продажи</label>
                <input type="number" value={row.price} onChange={e => handleChange(idx, 'price', e.target.value)} placeholder="0" />
              </div>
            </div>
          ))}

          <button onClick={addRow} className={c.addRowBtn}>
            <img src={Icons.plus} alt="" /> Добавить строку
          </button>

          <div className={c.res}>
            <button onClick={() => setActive(false)}>Отменить</button>
            <button onClick={handleSave}>
              <img src={Icons.addGreen} alt="" /> Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddStock