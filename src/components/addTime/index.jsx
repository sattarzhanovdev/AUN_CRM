import React from 'react'
import c from './add.module.scss'
import { InputMask } from '@react-input/mask'
import { Icons } from '../../assets/icons'

const AddTime = ({ type, setActive }) => {
  const [time, setTime] = React.useState('')
  const [name, setName] = React.useState('')
  const master = JSON.parse(localStorage.getItem('master'))

  const timeData = JSON.parse(localStorage.getItem('time'))
  const cabinetData = JSON.parse(localStorage.getItem('cabinetData'))

  const handleAddTime = () => {
    const data = {
      name,
      time,
      master
    }
    if(type === 'time') {
      timeData.push(data)
      localStorage.setItem('time', JSON.stringify(timeData))
    }else{
      cabinetData.push(data)
      localStorage.setItem('cabinetData', JSON.stringify(cabinetData))
    }
    setActive(false)


    // API.postTime(data)
    //   .then(res => {
    //     setActive(false)
    //   })
    //   .catch(err => console.error(err))
  }

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActive(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [setActive])

  return (
    <div className={c.container}>
      <div className={c.addTime}>
        <h1>Добавить время</h1>
        <p className={c.master}>Мастер: {master}</p>
        <div className={c.timeInput}>
          <p>Наименование услуги</p>
          <input type="text" onChange={e => setName(e.target.value)} placeholder='Введите наименование услуги'/>
        </div>
        <div className={c.timeInput}>
          <p>Введите время</p>
          <InputMask
            mask="99:99"
            placeholder="00:00"
            className={c.input}
            type="text"
            value={time}
            onChange={e => setTime(e.target.value)}
            replacement={{ 9: /\d/ }} // ✅ это обязательно

          />
        </div>
        <div className={c.btns}>
          <button onClick={() => setActive(false)}>
            Отменить
          </button>
          <button onClick={() => handleAddTime()}>
            <img src={Icons.addGreen} alt="" />
            Добавить
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddTime;
