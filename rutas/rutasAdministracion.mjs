import express from 'express';
import path from 'path';
import multer from 'multer';
import controladorAdministracion from '../controladores/controladorAdministracion.mjs';
const enrutador = express.Router();

/*
    //EN ESTE CASO COMO LOS USUARIOS NO TIENEN QUE CARGAR IMAGENES NO HACE FALTA CREAR UN DIRECTORIO PARA CADA UNO. SOLO PODRA EL/LA ADMINISTRADOR/ADMINISTRADORA 
    //EN ESTE CASO COMO LOS USUARIOS NO TIENEN QUE CARGAR IMAGENES NO HACE FALTA CREAR UN DIRECTORIO PARA CADA UNO. SOLO PODRA EL/LA ADMINISTRADOR/ADMINISTRADORA 
    //EN ESTE CASO COMO LOS USUARIOS NO TIENEN QUE CARGAR IMAGENES NO HACE FALTA CREAR UN DIRECTORIO PARA CADA UNO. SOLO PODRA EL/LA ADMINISTRADOR/ADMINISTRADORA 
function ValidarDirectorio(directorio){//Aca vemos si existe una carpeta con el nombre del usuario
    let bandera = false;
    const estadisticas = fs.stat(directorio);//Conseguimos infomracion del directorio; si es carpeta o archivo, tamaño, si existe etc.
    try{
        if(estadisticas.isDirectory()) flag = true;
        return bandera;
    } catch(error){
        console.log('Error: ', error)
    }
}
    //EN ESTE CASO COMO LOS USUARIOS NO TIENEN QUE CARGAR IMAGENES NO HACE FALTA CREAR UN DIRECTORIO PARA CADA UNO. SOLO PODRA EL/LA ADMINISTRADOR/ADMINISTRADORA 
    //EN ESTE CASO COMO LOS USUARIOS NO TIENEN QUE CARGAR IMAGENES NO HACE FALTA CREAR UN DIRECTORIO PARA CADA UNO. SOLO PODRA EL/LA ADMINISTRADOR/ADMINISTRADORA 
    //EN ESTE CASO COMO LOS USUARIOS NO TIENEN QUE CARGAR IMAGENES NO HACE FALTA CREAR UN DIRECTORIO PARA CADA UNO. SOLO PODRA EL/LA ADMINISTRADOR/ADMINISTRADORA 
function CrearDirectorio(ususario){
    const directorio = `${rutaDeLaCarpeta}/${ususario}`
    try{
        if(!ValidarDirectorio(directorio)){
            fs.mkdir(directorio, { recursive: true }); //INFORMARME QUE ES RECURSIVE Y SI ES NECESARIO QUE SE LLAME ASI
            console.log('Directorio creado');
        }
    }catch (error){
        console.log('Error: ', error)
    }
}//EN ESTE CASO COMO LOS USUARIOS NO TIENEN QUE CARGAR IMAGENES NO HACE FALTA CREAR UN DIRECTORIO PARA CADA UNO. SOLO PODRA EL/LA ADMINISTRADOR/ADMINISTRADORA 
function ValidarUsuario(nombreDeUsuario){
    let usuario = nombreDeUsuario;
    if (usuario && !/^[a-zA-Z0-9_-]+$/.test(usuario)) {
        return res.status(400).send('Nombre de usuario inválido');
    }
    return usuario;
}
*/
let rutaDeLaCarpeta = '';
const almacenamiento = multer.diskStorage({
    destination: function(req, file, cb){
        if(process.env.NODE_ENV === 'development'){
            rutaDeLaCarpeta = 'C:\\Users\\Joaquin\\Desktop\\almalibre\\ImagenesCargadas';
        }
        else{
            //Configurar direccion donde guardar imagenes 
            rutaDeLaCarpeta = '/home/joaquin/Imagenes/AlmaLibre/';
        }
        cb(null, rutaDeLaCarpeta);//direccion donde guardo las imagenes
    },
    filename: function(req, file, cb){
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Genera un nombre único + extensión
    }
});

const subir = multer({'storage': almacenamiento,
    limits: {
        fileSize: 6 * 1024 * 1024,
        files: 10
    }
});

// subir.single Sirve para subir una sola imagen, el subir.array es para enviar las iamgenes dentro de un array, 
// esto permite enviar mas imagenes
enrutador.post('/subir-ropa', subir.array('Imagenes', 10), (req, res)=>{
    controladorAdministracion.SubirRopa(req, res);
});
enrutador.get('/buscar', controladorAdministracion.ObtenerBusqueda);
enrutador.get('/obtener-talles-colores', controladorAdministracion.AD_ObtenerTallesColores);
enrutador.post('/cambiar-cantidad', controladorAdministracion.CambiarCantiadDeLosTalles);
enrutador.post('/cambiar-dato', controladorAdministracion.CambiarDato);
enrutador.post('/cambiar-imagenes', subir.array('Imagenes', 10), (req, res)=>{
    controladorAdministracion.CambiarImagenes(req, res);
});
enrutador.post('/cambiar-estado-mostrar', controladorAdministracion.CambiarEstadoMostrar);
enrutador.post('/guardar-colores', controladorAdministracion.AgregarColor);
export default enrutador;