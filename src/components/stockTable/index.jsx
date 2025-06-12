import React from 'react';
import c from './workers.module.scss';
import { periods } from '../../utils';
import { Icons } from '../../assets/icons';
import { API } from '../../api';
import { Components } from '..';

const StockTable = () => {
  const [month, setMonth] = React.useState('');
  const [clients, setClients] = React.useState(null);
  const [active, setActive] = React.useState(false);
  const [editActive, setEditActive] = React.useState(false);
  const [selectedWeek, setSelectedWeek] = React.useState(5); // 5 — Весь месяц

  const months = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
  ];

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  React.useEffect(() => {
    const monthName = currentDate.toLocaleString('ru', { month: 'long' });
    setMonth(monthName.charAt(0).toUpperCase() + monthName.slice(1));

    API.getStocks()
      .then(res => {
        setClients(res.data);
      });
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('ru-RU', { month: 'long' });
    return `${day} ${month}`;
  };

  const getWeekNumber = (dateStr) => {
    const day = new Date(dateStr).getDate();
    if (day >= 1 && day <= 7) return 1;
    if (day >= 8 && day <= 14) return 2;
    if (day >= 15 && day <= 21) return 3;
    if (day >= 22) return 4;
    return null;
  };

  const filteredClients = clients?.filter(item => {
    if (selectedWeek === 5) return true; // Весь месяц
    const clientWeek = getWeekNumber(item.appointment_date);
    return clientWeek === selectedWeek;
  });

  return (
    <div className={c.workers}>
      <div className={c.table}>
        <table>
          <thead>
            <tr>
              <th><img src={Icons.edit} alt="edit" /></th>
              <th>Наименование</th>
              <th>Количество</th>
              <th>+ за сегодня</th>
              <th>- за сегодня</th>
              <th>- ед/мл/шт</th>
              <th style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: "10px", margin: 0}}>
                <img
                  src={Icons.status}
                  alt="статус"
                />
                Статус
              </th>
              <th>
                <button onClick={() => setActive(true)}>
                  + Добавить
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {clients?.length > 0 ? (
              clients.map(item => (
                <tr key={item.id}>
                  <td><img src={Icons.edit} alt="edit" /></td>
                  <td>{item.name}</td>
                  <td>{item.amount}</td>
                  <td>{item.plusToday} {item.unit === 'единица' ? 'единиц' : item.unit}</td>
                  <td>{item.minusToday}</td>
                  <td>{item.quantity}</td>
                  <td style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: "10px"}}>
                    {item.status}% запаса
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td><img src={Icons.edit} alt="edit" /></td>
                <td colSpan={6}>Клиентов нет</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {active && <Components.AddStock setActive={setActive} />}
    </div>
  );
};

export default StockTable;
