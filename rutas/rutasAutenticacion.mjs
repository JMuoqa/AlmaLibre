import controladorAutenticacion from '../controladores/controladorAutenticacion.mjs';
import express from 'express';
const enrutador = express.Router();

enrutador.post('/confirmar-registro', controladorAutenticacion.Registrarse);
enrutador.post('/confirmar-inicio', controladorAutenticacion.IniciarSesion);
enrutador.post('/salir-sesion', controladorAutenticacion.SalirDeLaSesion);
export default enrutador;