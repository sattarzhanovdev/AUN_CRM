import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { BiPrinter } from 'react-icons/bi';
import s from './receipt.module.scss';

const KassaReport = () => {
  const navigate = useNavigate();
  const sale = JSON.parse(localStorage.getItem('open-kassa'));

  // if (!sale) return <p>Нет данных для чека</p>;

  // const sum = Number(sale.total);

  const date = new Date();
  
  return (
    /* 👇 важно: id статичный, className — из модуля */
    <div id="invoicePos" className={s.invoicePos}>
      <h3>{Number(sale) > 0 ? 'Закрытие кассы' : 'Открытие кассы'} {`${date.getDate()}.${date.getMonth() < 10 ? `0${date.getMonth()}` : date.getMonth()}.${date.getFullYear()}`}</h3>
      <table className={s.table}>
        <tfoot>
          <tr><td colSpan="3">Сумма:</td><td className={s.right}>{Number(sale).toFixed(2)}</td></tr>
        </tfoot>
      </table>


      {/* кнопки (видимы только на экране) */}
      <div className={s.buttons}>
        <button className={s.back} onClick={() => navigate(-1)}><IoIosArrowRoundBack /></button>
        <button className={s.print} onClick={() => {
          localStorage.removeItem('open-kassa');
          window.print()
        }}>Печать&nbsp;<BiPrinter /></button>
      </div>
    </div>
  );
};

export default KassaReport;