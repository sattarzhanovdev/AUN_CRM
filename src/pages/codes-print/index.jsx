import React, { useState } from 'react'
import Barcode from 'react-barcode'
import { BiPrinter } from 'react-icons/bi'
import { useParams } from 'react-router-dom'
import './code-print.css'               // ⬅️ стили ниже

const CodePrint = () => {
  const { code, name, price } = useParams()
  const [qty, setQty] = useState(1)

  const labels = Array.from({ length: qty })

  return (
    <div className="label-wrapper">
      {labels.map((_, i) => (
        <div key={i} className="label">
          <h3>{name}</h3>
          <p>Стоимость: {price} сом</p>
          <Barcode
            value={code}
            width={1.4}
            height={40}      /* подгоняй под рулон */
            fontSize={10}
            margin={0}
          />
        </div>
      ))}

      <div className="controls">
        <input
          type="number"
          min="1"
          value={qty}
          onChange={e => setQty(+e.target.value || 1)}
        />
        <button onClick={() => window.print()}>
          Распечатать чек <BiPrinter />
        </button>
      </div>
    </div>
  )
}

export default CodePrint
