import React from 'react';
import c from './workers.module.scss';
import { periods } from '../../utils';
import { Icons } from '../../assets/icons';
import { API } from '../../api';
import { Components } from '..';
import Barcode from 'react-barcode';

const StockTable = () => {  
  const [month, setMonth] = React.useState('');
  const [clients, setClients] = React.useState(null);
  const [active, setActive] = React.useState(false);
  const [editActive, setEditActive] = React.useState(false);
  const [selectedWeek, setSelectedWeek] = React.useState(5); // 5 — Весь месяц
  const [categories, setCategories] = React.useState(''); // 5 — Весь месяц

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
        setClients(res.data.reverse());
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

  React.useEffect(() => {
    API.getCategories()
      .then(res => {
        setCategories(res.data)
      })
  }, [])

  const filterGoods = (id) => {
    return id ? clients?.filter(item => Number(item.id) === Number(id)) : clients 
  }

  return (
    <div className={c.workers}>
      <div className={c.table}>
        {/* <h2>Сумма товаров: {clients?.length}</h2> */}
        <select className={c.filteration} onChange={e => filterGoods(e.target.value)}>
          {
            categories && categories.map(item => (
              <option value={item.id}>{item.name}</option>
            ))
          } 
        </select>
        <table>
          <thead>
            <tr>
              <th>_</th>
              <th>{clients?.length} позиций</th>
              <th></th>
              <th>{clients?.reduce((a, b) => Number(a)+Number(b.fixed_quantity), 0)}</th>
              <th>{clients?.reduce((a, b) => Number(a)+Number(b.quantity), 0)}</th>
              <th>{clients?.reduce((a, b) => Number(a)+Number(b.price_seller*b.fixed_quantity), 0)} сом</th>
              <th>{clients?.reduce((a, b) => Number(a)+Number(b.price*b.fixed_quantity), 0)} сом</th>
              <th></th>
              <th>
                
              </th>
            </tr>
            <tr>
              <th><img src={Icons.edit} alt="edit" /></th>
              <th>№</th>
              <th>Наименование</th>
              <th>Было добавлено (кол-во)</th>
              <th>Осталось</th>
              <th>Цена поставщика за ед</th>
              <th>Цена на продаже за ед</th>
              <th>Штрих-код</th>
              <th>
                <button onClick={() => setActive(true)}>
                  + Добавить
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {filterGoods()?.length > 0 ? (
              filterGoods().map((item, i) => (
                <tr 
                  key={item.id}
                  style={
                    Number(item.quantity) <= 15 ?
                    {
                      background: 'rgba(255, 0, 0, 0.3)'
                    } 
                    : Number(item.quantity) <= 50 ?
                    {
                      background: 'rgba(255, 255, 0, 0.3)'
                    } :
                    {

                    }
                  }
                >
                  <td><img src={Icons.edit} alt="edit" onClick={() => {
                    localStorage.setItem('editStock', JSON.stringify(item))
                    setEditActive(true)
                  }}/></td>
                  <td>{i+1}</td>
                  <td>{item.name}</td>
                  <td>{item.fixed_quantity}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price_seller}</td>
                  <td>{item.price}</td>
                  <td>
                    <Barcode 
                      value={item.code}
                      width={0.6}
                      height={20}
                      fontSize={12}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td><img src={Icons.edit} alt="edit" /></td>
                <td colSpan={6}>Товаров нет</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editActive && <Components.EditStock setActive={setEditActive} />}
      {active && <Components.AddStock setActive={setActive} />}
    </div>
  );
};

export default StockTable;