import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { BiPrinter } from 'react-icons/bi';
import s from './receipt.module.scss';
import { API } from '../../api';

const KassaReport = () => {
  const navigate = useNavigate();
  const sale = JSON.parse(localStorage.getItem('open-kassa'));
  const [ salePrice, setSalePrice ] = React.useState(0);
  const kassaId = localStorage.getItem('kassa-id');

  // if (!sale) return <p>Нет данных для чека</p>;

  // const sum = Number(sale.total);

  const date = new Date();
  React.useEffect(() => {
    API.kassaItem(kassaId)
      .then(res => {
        setSalePrice(res.data.closing_sum);
      })
  }, [])
  
  return (
    /* 👇 важно: id статичный, className — из модуля */
    <div id="invoicePos" className={s.invoicePos}>
      <h3 style={{
        margin: 0,
        marginBottom: '10px'
      }}>{Number(sale) > 0 ? 'Закрытие кассы' : 'Открытие кассы'}</h3>
      <p style={{
        margin: 0,
        fontSize: '14px',
        fontWeight: '300',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {`${date.getDate()}.${date.getMonth() < 10 ? `0${date.getMonth()}` : date.getMonth()}.${date.getFullYear()}`}
        <span>{`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`}</span>
      </p>
      <table className={s.table}>
        <tfoot>
          <tr><td colSpan="3">Сумма:</td><td className={s.right}>{Number(salePrice).toFixed(2)}</td></tr>
        </tfoot>
      </table>


      {/* кнопки (видимы только на экране) */}
      <div className={s.buttons}>
        <button className={s.back} onClick={() => navigate(-1)}><IoIosArrowRoundBack /></button>
        <button className={s.print} onClick={() => {
          localStorage.removeItem('kassa-id');
          window.print()
        }}>Печать&nbsp;<BiPrinter /></button>
      </div>
    </div>
  );
};

export default KassaReport;