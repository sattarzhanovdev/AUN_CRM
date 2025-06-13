import React from 'react'
import Barcode from 'react-barcode';
import { set } from 'react-hook-form';
import { BiPrinter } from 'react-icons/bi';
import { useLocation, useParams } from 'react-router-dom'

const CodePrint = () => {
  const {code, name, price} = useParams()
  const [ count, setCount ] = React.useState(1)
  const items = []
  
  const changeCount = (e) => {
    setCount(e.target.value)
  }
  for(let i = 0; i < count; i++) {
    items.push(i)
  }

  return (
    <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px', width: '100%'}}>
      {
        items.map(() => <div
        style={{
          width: "300px",
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #000',
          padding: '10px',
          marginBottom: '10px'
        }}
      >
        <h3 style={{margin: 0}}>{name}</h3>
        <p style={{margin: 0}}>Стоимость: {price} сом</p>
        <Barcode value={code} width={1} height={50} fontSize={12}/>
      </div>)
      }

      <input type="number" onChange={e => changeCount(e)} />
      <button onClick={() => window.print()}>
        <BiPrinter />
      </button>
    </div>
  )
}

export default CodePrint