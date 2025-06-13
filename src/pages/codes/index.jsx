import React from 'react'
import Barcode from 'react-barcode'
import { useNavigate } from 'react-router-dom';

const Codes = () => {
  const [ barcodeValue, setBarcodeValue ] = React.useState('')
  const [ name, setName ] = React.useState('')
  const [ price, setPrice ] = React.useState('')
  
  function generateBarcode(length = 13) {
    let barcode = '';
    while (barcode.length < length) {
      barcode += Math.floor(Math.random() * 10); // добавляет цифру от 0 до 9
    }
    return barcode;
  }

  const handleBarcodeChange = (e) => {
    setBarcodeValue(generateBarcode())
    localStorage.setItem('values', JSON.stringify({name: name, price: price, barcode: barcodeValue}))
  }

  const Navigate = useNavigate()

  return (
    <div>
      <input 
        type="text" 
        placeholder='Наименование товара' 
        onChange={e => setName(e.target.value)} 
        style={{width: '200px', height: '40px'}}
      />
      <input 
        type="number" 
        placeholder='Стоимость товара' 
        onChange={e => setPrice(e.target.value)}  
        style={{width: '200px', height: '40px', marginLeft: '20px'}}
      />
      <button 
        onClick={() => handleBarcodeChange()} 
        style={{width: '200px', height: '46px', marginLeft: '20px', background: '#216EFD', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '5px'}}
      >
        Сгенерировать
      </button>
      <button 
        onClick={() => Navigate(`/codes-print/${barcodeValue}/${name}/${price}`)} 
        style={{width: '200px', height: '46px', marginLeft: '20px', background: 'green', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '5px'}}      
      >
        Распечатать
      </button>
      <div 
        style={{
          width: "300px",
        }}
      >
        <h3>{name}</h3>
        <h3>Стомость: {price}</h3>
        <Barcode value={barcodeValue} width={1} height={50} fontSize={12}/>
      </div>
    </div>
  )
}

export default Codes