import controladorCarrito from '../controladores/controladorCarrito.mjs';
import express from 'express';
const enrutador = express.Router();

enrutador.post('/sumar-prenda', controladorCarrito.AñadirPrendaAlCarrito);
enrutador.get('/ver-carrito', controladorCarrito.VerCarrito);
enrutador.post('/vaciar-carrito', controladorCarrito.VaciarCarrito);
enrutador.post('/quitar-del-carrito', controladorCarrito.QuitarDelCarro);
enrutador.post('/sumar-al-carrito', controladorCarrito.SumarAlCarro);
enrutador.post('/pedir', controladorCarrito.Pedir);

export default enrutador;