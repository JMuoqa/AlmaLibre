import controladorMiPerfil from '../controladores/controladorMiPerfil.mjs';
import express from 'express';
const enrutador = express.Router();

enrutador.post('/cambiar-nombre', controladorMiPerfil.CambiarNombre);
enrutador.post('/cambiar-email', controladorMiPerfil.CambiarMail);
enrutador.post('/cambiar-direccion', controladorMiPerfil.CambairDireccion);

export default enrutador;