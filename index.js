var js = require("johnny-five")
const express = require('express')
const cors = require('cors')

var tarjeta = new js.Board();
tarjeta.on("ready", init)

const app = express()
app.use(express.json())



function apagar(foco){
  foco.off()
}
function encender(foco){
  foco.on()
}


function init (){
  app.listen(2223, ()=>{
    console.log('estas conectado al puerto 2220')
  })
  var foco   = new js.Led(13)
  const lm35 = new js.Sensor("A0");
  const sensorHumedad = new js.Sensor("A1");
  let ventilador = new js.Relay(6);
  ventilador.close()
  let bomba = new js.Relay(7);
  bomba.close()

  apagar(foco)
  
  app.use(cors({origin: '*'}));
  
  app.use(express.json())

  app.get('/encender',function On (req,res){
    encender(foco)
    res.status(200).send('ON')
  })

  app.get('/apagar',function Off(req, res){
    apagar(foco)
    res.status(200).send('OFF')
  })

app.get('/medir/temperatura',function temperatura(req,res) {
  // Convierte el valor a temperatura en grados Celsius
  const temperatura = (lm35.scaleTo([0, 330])).toFixed(2);
  console.log(`Temperatura: ${temperatura} °C`);
  res.status(200).json({
    temperatura: `${temperatura} °C` 
  })

})

app.get('/medir/humedad',function humedad(req,res) {
  const humedad = sensorHumedad.scaleTo(0, 100); // Escala el valor del sensor a un rango de 0 a 100
  console.log(`Humedad: ${humedad}%`);
  res.status(200).json({humedad: `${humedad} %`})
})

app.get('/encender/ventilador',function humedad(req,res) {
  ventilador.open()
  res.status(200).send('ventilador encendido')
})

app.get('/apagar/ventilador',function humedad(req,res) {
  ventilador.close()
  res.status(200).send('ventilador apagado')
})

app.get('/encender/bomba',function humedad(req,res) {
  bomba.open()
  res.status(200).send('bomba encendido')
})

app.get('/apagar/bomba',function humedad(req,res) {
  bomba.close()
  res.status(200).send('bomba apagado')
})

  
}