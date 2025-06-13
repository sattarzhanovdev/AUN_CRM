import React, { useEffect, useState } from 'react'
import c from './add.module.scss'
import { Icons } from '../../assets/icons'
import { API } from '../../api'

const emptyRow = {
  id: null,
  name: '',
  quantity: '',
  price: '',
  category: '',
  price_seller: '',
  code: '',
  unit: 'шт',
  fixed_quantity: ''
}

const EditStock = ({ setActive }) => {
  /* выбранные товары из localStorage */
  const initial = JSON.parse(localStorage.getItem('editStock')) || []
  const [rows, setRows] = useState(initial.length ? initial : [emptyRow])
  const [cats, setCats] = useState([])

  /* универсальный onChange */
  const handleChange = (idx, field, value) =>
    setRows(prev => prev.map((r, i) => (i === idx ? { ...r, [field]: value } : r)))

  const addRow = () => setRows(prev => [...prev, emptyRow])

  /* ============= Сохранить ============= */
  const handleSave = async () => {
    const toUpdate = rows.filter(r => r.id)
    const toCreate = rows.filter(r => !r.id && r.name && r.code)

    try {
      /* PATCH существующее */
      await Promise.all(
        toUpdate.map(r =>
          API.updateStock(r.id, {
            code: r.code,
            name: r.name,
            quantity: +r.quantity,
            price: +r.price,
            price_seller: +r.price_seller,
            category_id: r.category || null
          })
        )
      )

      /* bulk-POST новые */
      if (toCreate.length) {
        const payload = toCreate.map(r => ({
          ...r,
          quantity: +r.quantity || 0,
          price: +r.price || 0,
          price_seller: +r.price_seller || 0,
          category_id: r.category || null,
          fixed_quantity: r.fixed_quantity || r.quantity || 0
        }))
        await API.putStocks(initial.id, payload[0])
      }

      alert('Товары сохранены')
      setActive(false)
      window.location.reload()
    } catch (err) {
      console.error('Ошибка при сохранении:', err)
      alert('Ошибка при сохранении')
    }
  }

  /* загрузка категорий */
  useEffect(() => {
    API.getCategories()
      .then(res => setCats(res.data))
      .catch(e => console.error('Не удалось загрузить категории', e))
  }, [])


  const handleDelete = async () => {

    if (!window.confirm('Вы уверены, что хотите удалить этот товар?')) return

    try {
      await API.deleteStocks(initial.id)
      alert('Товар удален')
      setActive(false)
      window.location.reload()
    } catch (err) {
      console.error('Ошибка при удалении товара:', err)
      alert('Ошибка при удалении товара')
    }
  }
  /* --------------- UI --------------- */
  return (
    <div className={c.addExpense}>
      <div className={c.addExpense__header}>
        <h2>Изменение товара</h2>
      </div>

      {rows.map((row, idx) => (
        <div key={idx} className={c.addExpense__form}>
          {/* код */}
          <div className={c.addExpense__form__item}>
            <label htmlFor={`code-${idx}`}>Код</label>
            <input
              id={`code-${idx}`}
              value={row.code}
              placeholder="Код товара"
              onChange={e => handleChange(idx, 'code', e.target.value)}
            />
          </div>

          {/* наименование */}
          <div className={c.addExpense__form__item}>
            <label htmlFor={`name-${idx}`}>Наименование</label>
            <input
              id={`name-${idx}`}
              value={row.name}
              placeholder="Введите наименование"
              onChange={e => handleChange(idx, 'name', e.target.value)}
            />
          </div>

          {/* категория */}
          <div className={c.addExpense__form__item}>
            <label htmlFor={`cat-${idx}`}>Категория</label>
            <select
              id={`cat-${idx}`}
              value={row.category || ''}
              onChange={e => handleChange(idx, 'category', e.target.value)}
            >
              <option value="">‒ выберите ‒</option>
              {cats.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* количество */}
          <div className={c.addExpense__form__item}>
            <label htmlFor={`qty-${idx}`}>Количество</label>
            <input
              id={`qty-${idx}`}
              type="number"
              value={row.quantity}
              placeholder="0"
              onChange={e => handleChange(idx, 'quantity', e.target.value)}
            />
          </div>

          {/* цена поставщика */}
          <div className={c.addExpense__form__item}>
            <label htmlFor={`ps-${idx}`}>Цена поставщика</label>
            <input
              id={`ps-${idx}`}
              type="number"
              value={row.price_seller}
              placeholder="0"
              onChange={e => handleChange(idx, 'price_seller', e.target.value)}
            />
          </div>

          {/* цена продажи */}
          <div className={c.addExpense__form__item}>
            <label htmlFor={`pr-${idx}`}>Цена продажи</label>
            <input
              id={`pr-${idx}`}
              type="number"
              value={row.price}
              placeholder="0"
              onChange={e => handleChange(idx, 'price', e.target.value)}
            />
          </div>
        </div>
      ))}

      <button onClick={addRow}>
        <img src={Icons.plus} alt="" /> Добавить строку
      </button>

      <div className={c.res}>
        <button onClick={() => setActive(false)}>Отменить</button>
        <button onClick={handleSave}>
          <img src={Icons.addGreen} alt="" /> Сохранить
        </button>
        <button onClick={() => handleDelete()}>Удалить</button>
      </div>
    </div>
  )
}

export default EditStock
