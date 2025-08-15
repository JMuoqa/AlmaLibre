import express from 'express';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import crypto from 'crypto';
import expressLayouts from 'express-ejs-layouts';
import rutasPrincipales from './rutas/rutasPrincipales.mjs';
import rutasAutenticacion from './rutas/rutasAutenticacion.mjs';
import rutasMiPerfil from './rutas/rutasMiPerfil.mjs';
import rutasAdministracion from './rutas/rutasAdministracion.mjs';
import rutasCarrito from './rutas/rutasCarrito.mjs';
import minifyHTML from 'express-minify-html';
const app = express();
const secreto = crypto.randomBytes(32).toString('hex');
// Define __nombreDelArchivo manualmentes
const __nombreDelArchivo = fileURLToPath(import.meta.url); // Obtiene el archivo actual
const __nombreDelDirectorio = path.dirname(__nombreDelArchivo);       // Obtiene el directorio actual
console.log(path.join(__nombreDelDirectorio, 'vistas'))
app.set('view engine', 'ejs');
app.set('views', path.join(__nombreDelDirectorio, 'vistas'));
app.use(express.static(path.join(__nombreDelDirectorio, 'publico')));
app.use(expressLayouts); // Es para usar una vista en comun, como el RenderBody() en c# .net
app.use(cookieParser(secreto));
app.use(express.json()); // para JSON
app.use(express.urlencoded({ extended: true })); // para datos de formulario
app.set('layout', '_Diseno');
app.set('view cache', true);
app.use(minifyHTML({
  override: true,
  htmlMinifier: {
    removeComments: true,
    collapseWhitespace: true,
    collapseBooleanAttributes: true,
    removeAttributeQuotes: false,
    minifyJS: true
  }
}));
app.use('/', rutasPrincipales);
app.use('/autenticacion', rutasAutenticacion);
app.use('/miperfil', rutasMiPerfil);
app.use('/administracion', rutasAdministracion);
app.use('/carrito', rutasCarrito);
const PORT = 5443;

if(process.env.NODE_ENV === 'development'){
    app.use('/Imagenes', express.static('C:/Users/Joaquin/Desktop/almalibre/ImagenesCargadas'));
    const sslOptions = {
        pfx: fs.readFileSync('C:\\Certs\\almalibre54.pfx'),
        passphrase: 'MiContraseñaSegura'
      };
    https.createServer(sslOptions, app).listen(PORT, () => {
        console.log(`Servidor escuchando en https://almalibre54.com:${PORT}`);
    });
}
else{
    app.use('/Imagenes', express.static('/home/joaquin/Imagenes/AlmaLibre'));
    app.listen(PORT, () => {
        console.log(`Servidor escuchando por el puerto ${PORT}: http://almalibre54:${PORT}`);
    });
}

