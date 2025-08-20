import { 
    CargarRopa, Buscar, ModificarDato,
    ModificarImagenes, RestarCantidadPorVenta , ModificarEstadoMostrar,
    ObtenerTalles, ModificarCantidad, ObtenerColoresDeLaPrenda,
    ObtenerDetalles, SubirTalles, SubirColor
} from "../envios/enviosYConsultasAdministracion.mjs";
import fs from 'fs';
import path from "path";
import sharp from 'sharp';
import convert from "heic-convert";
let rutaDeLaCarpeta = '';
if(process.env.NODE_ENV === 'development'){
    rutaDeLaCarpeta = 'C:\\Users\\Joaquin\\Desktop\\almalibre\\ImagenesCargadas';
}
else{
    rutaDeLaCarpeta = '/home/joaquin/Imagenes/AlmaLibre/';
}
const SubirRopa = async (req, res) => {
    try{
        const imagenes = req.files;
        if (!imagenes || imagenes.length === 0) {
            return res.status(400).json({estadoDeSolicitud: 'malo', mensajeDeError: 'No hay imagenes cargadas'});
        }
        const imagenesProcesadas = [];
        for(const file of imagenes){
            const rutaOriginal = path.join(rutaDeLaCarpeta, file.filename);
            const extencion = path.extname(file.originalname).toLowerCase();
            if(extencion == '.heic'){
                //En esta parte convierto las imagenes que son .heic
                //El convert convierte la imagen y el sharp la guarda
                //A el convert no se le puede pasar una ruta, primero se tiene que leer el archivo con fs.readFileSync(la ruta del archivo);
                const nuevoNombre = file.filename.replace(/\.heic$/i,'.jpg');
                const nuevaRuta = path.join(rutaDeLaCarpeta, nuevoNombre);
                const bufferDeEntrada = fs.readFileSync(rutaOriginal); // esto lee el archivo por que convert(heic-convert), no lee el archivo pasandole la ruta.
                const jpegBuffer = await convert({
                    buffer: bufferDeEntrada,  // buffer de entrada
                    format: 'JPEG',       // formato de salida
                    quality: 0.9          // calidad jpeg
                });
                await sharp(jpegBuffer).jpeg({ quality: 90 }).toFile(nuevaRuta); //Guarda la nueva imagen
                fs.unlinkSync(rutaOriginal);//Esto borra la imagen .heic que se subio.
                imagenesProcesadas.push(nuevoNombre);
            }else{
                imagenesProcesadas.push(file.filename);
            }
        }
        const usuario = req.signedCookies.usuario;
        if (!/^[a-zA-Z0-9_-]+$/.test(usuario) || usuario == '' || usuario == null || usuario == undefined) {
            return res.status(400).json({ estadoDeSolicitud: 'malo', mensajeDeError: 'El usuario no esta registrado'});
        }
        let nombresDeLasImagenes = '';
        imagenesProcesadas.forEach((imagen) => {
            if(nombresDeLasImagenes.length == 0)
                nombresDeLasImagenes += imagen;
            else
                nombresDeLasImagenes += `,${imagen}`;
        });
        if(!/^[a-zA-Z0-9.,-]+$/.test(nombresDeLasImagenes)){
            return res.status(400).json({ estadoDeSolicitud: 'malo', mensajeDeError: 'Hay un problema con los nombres de los datos enviados'});
        }
        const { 
            Nombre, Precio, Tipo, 
            Genero, Descuento, ImagenSeleccionada,
            Descripcion
        } = req.body;
        let { Color, Talle, Cantidad } = req.body;
        if(Color && !Array.isArray(Color)){
            Color = [Color];
        }
        if(Talle && !Array.isArray(Talle)){
            Talle = [Talle];
        }
        if(Cantidad && !Array.isArray(Cantidad)){
            Cantidad = [Cantidad];
        }
        const precioFinal = ResetearPrecio(Precio);
        if(!Color || !Color.length || Color.length == 0){
            return res.json({ estadoDeSolicitud: 'malo', mensajeDeError: 'Los detalles (Color, Talle, y Cantidad) estan vacios'});
        }
        let descuentoFinal = 0;
        if(Descuento != undefined || Descuento != null || Descuento != ''){
            descuentoFinal = Descuento;
        }
        const coloresOrdenados = [];
        for(let i = 0; i < Color.length; i++){
            let banderita = true;
            for(let j = 0; j<coloresOrdenados.length; j++){
                if(j!=i && Color[i] == coloresOrdenados[j].OColor){
                    coloresOrdenados[j].OListaTalles.push({ OTalles: '', OCantidad: 0});
                    const largoOListaTalles = coloresOrdenados[j].OListaTalles.length;
                    coloresOrdenados[j].OListaTalles[largoOListaTalles-1].OTalles = Talle[i];
                    coloresOrdenados[j].OListaTalles[largoOListaTalles-1].OCantidad = Cantidad[i];
                    banderita = false;
                    break;
                }
            }
            if(banderita){
                coloresOrdenados.push({ OColor: Color[i], OListaTalles: [{ OTalles: '', OCantidad: 0}]})
                coloresOrdenados[coloresOrdenados.length-1].OListaTalles[0].OTalles = Talle[i];
                coloresOrdenados[coloresOrdenados.length-1].OListaTalles[0].OCantidad = Cantidad[i];
            }
        }
        const verificarDatosVacios = VerificarDatosVacios([Nombre, Tipo, Genero, ImagenSeleccionada, Descripcion, Cantidad]);
        const verificarListasVacias = VerificarListasVacias(Talle, Color)
        if(verificarDatosVacios && verificarListasVacias){
            return res.json({ estadoDeSolicitud: 'malo', mensajeDeError: 'Hay un problema con los datos enviados'});
        }
        const booleanoRopa = await CargarRopa(
            Nombre, precioFinal, Tipo,
            Genero, descuentoFinal, nombresDeLasImagenes, 
            ImagenSeleccionada, Descripcion, coloresOrdenados
        )
        if(booleanoRopa){
            return res.json({estadoDeSolicitud: 'exitoso'});
        }else{
            return res.json({estadoDeSolicitud: 'muyMalo', mensajeDeError: 'No pudimos cargar el producto, o hubo un error inesperado'});
        }
    } catch (error){
        console.log('Error - Controlador - Administracion - SubirRopa: \n' + error +'\n\nError: \n' + error.message);
        return res.status(400).json({estadoDeSolicitud: 'muyMalo', mensajeDeError: error});
    }
}
const ObtenerBusqueda = async (req, res) =>{
    try{
        const busqueda = req.query.valor;
        const indicacion = req.query.indicacion;
        const ropa = await Buscar(indicacion, busqueda);
        return res.json({ estadoDeSolicitud: 'exitoso', Ropa : ropa});
    }catch (error){
        return res.status(400).json({estadoDeSolicitud: 'muyMalo', mensajeDeError: error});
    }
}
const AD_ObtenerTallesColores = async (req, res) => {
    try{
        const id = req.query.id;
        const talles = await ObtenerTalles(id);
        const colores = await ObtenerColoresDeLaPrenda(id);
        return res.json({ estadoDeSolicitud: 'exitoso', Talles : talles, Colores: colores});
    }catch (error){
        return res.status(400).json({estadoDeSolicitud: 'muyMalo', mensajeDeError: error});
    }
}
const CambiarDato = async (req, res) => {
    try{
        const { Dato, Columna, ID} = req.body;
        const tiposPermitidos = ['Remera', 'Saco', 'Poleron', 'Cárdigan', 'Campera', 'Suéter', 'Chaleco', 'Buzo', 'Pantalon'];
        const generosPermitidos = ['Mujer', 'Niño/Niña'];
        if(Columna == 'Genero' && !generosPermitidos.includes(Dato)){
            return res.status(400).json({
                estadoDeSolicitud: 'malo', 
                mensajeDeError: 'Error: El genero de la prenda no existe en los parametros establecidos. Contacte al desarrollador. F(Administracion->CambiarDato)'
            });
        }
        if(Columna == 'Tipo' && !tiposPermitidos.includes(Dato)){
            return res.status(400).json({
                estadoDeSolicitud: 'malo', 
                mensajeDeError: 'Error: El tipo de la prenda no existe en los parametros establecidos. Contacte al desarrollador. F(Administracion->CambiarDato)'
            });
        }
        const estado = await ModificarDato(Dato, Columna, ID);
        if(estado['estadoDeSolicitud']!='exitoso')
            return res.status(400).json({estadoDeSolicitud: 'malo', mensajeDeError: 'Ocurrio un error. Contacte al desarrollador. F(Administracion->CambiarDato)'});
        return res.status(200).json({estadoDeSolicitud: 'exitoso'});
    }catch (error){
        return res.status(400).json({estadoDeSolicitud: 'muyMalo', mensajeDeError: error});
    }
}
const CambiarCantiadDeLosTalles = async (req, res) => {
    try{
        const {IDPrenda, Talle, Cantidad} = req.body;
        const tallesPermitidos = [ 'XS', 'S', 'M' , 'L', 'XL', 'XXL', 'XXXL'];
        if(!tallesPermitidos.includes(Talle)){
            return res.status(400).json({estadoDeSolicitud: 'muyMalo', mensajeDeError: error});
        }
        const estado = await ModificarCantidad(IDPrenda, Talle, Cantidad);
        if(estado['estadoDeSolicitud']!='exitoso')
            return res.status(400).json({estadoDeSolicitud: 'malo', mensajeDeError: 'Ocurrio un error. Contacte al desarrollador. F(Administracion->CambiarCantiadDeLosTalles)'});
        return res.status(200).json({estadoDeSolicitud: 'exitoso'});
    }catch (error){
        return res.status(400).json({estadoDeSolicitud: 'muyMalo', mensajeDeError: error});
    }
}
const AgregarColor = async (req, res) =>{
    try{
        const { IDPrenda } = req.body;
        let { ColoresNuevos, TallesNuevos, CantidadesNuevas }= req.body;    
        console.log(ColoresNuevos);
        if(!Array.isArray(ColoresNuevos)){
            ColoresNuevos = [ColoresNuevos];
        }
        if(!Array.isArray(TallesNuevos)){
            TallesNuevos = [TallesNuevos];
        }
        if(!Array.isArray(CantidadesNuevas)){
            CantidadesNuevas = [CantidadesNuevas];
        }
        const verificarListasVacias = VerificarListasVacias(TallesNuevos, ColoresNuevos, CantidadesNuevas);
        if(verificarListasVacias){
            return res.json({ estadoDeSolicitud: 'malo', mensajeDeError: 'Hay un problema con los datos enviados'});
        }
        const coloresOrdenados = [];
        for(let i = 0; i < ColoresNuevos.length; i++){
            let banderita = true;
            for(let j = 0; j<coloresOrdenados.length; j++){
                if(j!=i && ColoresNuevos[i] == coloresOrdenados[j].OColor){
                    coloresOrdenados[j].OListaTalles.push({ OTalles: '', OCantidad: 0});
                    const largoOListaTalles = coloresOrdenados[j].OListaTalles.length;
                    coloresOrdenados[j].OListaTalles[largoOListaTalles-1].OTalles = TallesNuevos[i];
                    coloresOrdenados[j].OListaTalles[largoOListaTalles-1].OCantidad = CantidadesNuevas[i];
                    banderita = false;
                    break;
                }
            }
            if(banderita){
                coloresOrdenados.push({ OColor: ColoresNuevos[i], OListaTalles: [{ OTalles: '', OCantidad: 0}]})
                coloresOrdenados[coloresOrdenados.length-1].OListaTalles[0].OTalles = TallesNuevos[i];
                coloresOrdenados[coloresOrdenados.length-1].OListaTalles[0].OCantidad = CantidadesNuevas[i];
            }
        }
        const detallesExistentes = await ObtenerDetalles(IDPrenda)
        const coloresExistentes = detallesExistentes.listaColor;
        const tallesExistentes = detallesExistentes.listaTalles;
        let banderita = true;
        for(let i = 0; i < coloresOrdenados.length; i++){
            for(let j = 0; j < coloresExistentes.length; j++){
                if(coloresOrdenados[i].OColor == coloresExistentes[j].Color){
                    ComprobarTalles(coloresExistentes[j].ID, IDPrenda, coloresOrdenados[i], tallesExistentes);
                    banderita = false;
                }         
            }
            if(banderita){
                SubirColor(IDPrenda, coloresOrdenados[i]);
            }   
        }
        return res.json({estadoDeSolicitud: 'exitoso'});
    }catch (error){
        console.log('Error - Controlador - Administracion - SubirRopa: \n' + error +'\n\nError: \n' + error.message);
        return res.status(400).json({estadoDeSolicitud: 'muyMalo', mensajeDeError: error});
    }
}
function ComprobarTalles(IDColor, IDPrenda, color, tallesExistentes){
    console.log(IDColor, IDPrenda, color, tallesExistentes)
    for(let i = 0; i < color.OListaTalles.length; i++){
        for(let j = 0; j < tallesExistentes.length; j++){
            if(color.OListaTalles[i].OTalles != tallesExistentes[j].Talle){
                const bandera = SubirTalles(IDColor, IDPrenda, color.OListaTalles[i]);
                if(bandera){
                    break;
                }
            }
        }
    }
}
const CambiarImagenes = async (req, res) =>{
    try{
        const imagenes = req.files;
        if (!imagenes || imagenes.length === 0) {
            return res.status(400).json({estadoDeSolicitud: 'malo', mensajeDeError: 'No hay imagenes cargadas'});
        }
        const imagenesProcesadas = [];
        for(const file of imagenes){
            const rutaOriginal = path.join(rutaDeLaCarpeta, file.filename);
            const extencion = path.extname(file.originalname).toLowerCase();
            if(extencion == '.heic'){
                //En esta parte convierto las imagenes que son .heic
                //El convert convierte la imagen y el sharp la guarda
                //A el convert no se le puede pasar una ruta, primero se tiene que leer el archivo con fs.readFileSync(la ruta del archivo);
                const nuevoNombre = file.filename.replace(/\.heic$/i,'.jpg');
                const nuevaRuta = path.join(rutaDeLaCarpeta, nuevoNombre);
                const bufferDeEntrada = fs.readFileSync(rutaOriginal); // esto lee el archivo por que convert(heic-convert), no lee el archivo pasandole la ruta.
                const jpegBuffer = await convert({
                    buffer: bufferDeEntrada,  // buffer de entrada
                    format: 'JPEG',       // formato de salida
                    quality: 0.9          // calidad jpeg
                });
                await sharp(jpegBuffer).jpeg({ quality: 90 }).toFile(nuevaRuta); //Guarda la nueva imagen
                fs.unlinkSync(rutaOriginal);//Esto borra la imagen .heic que se subio.
                imagenesProcesadas.push(nuevoNombre);
            }else{
                imagenesProcesadas.push(file.filename);
            }
        }
        const { Id, ImagenSeleccionada } = req.body;
        if (!imagenes || imagenes.length === 0) {
            return res.status(400).json({estadoDeSolicitud: 'malo', mensajeDeError: 'No hay imagenes cargadas'});
        }
        let nombresDeLasImagenes = '';
        imagenesProcesadas.forEach((imagen) => {
            if(nombresDeLasImagenes.length == 0)
                nombresDeLasImagenes += imagen;
            else
                nombresDeLasImagenes += `,${imagen}`;
        });
        if(!/^[a-zA-Z0-9.,-]+$/.test(nombresDeLasImagenes) && /^[A-Z,-]+$/.test(tallesDisponibles)){
            return res.status(400).json({ estadoDeSolicitud: 'malo', mensajeDeError: 'Hay un problema con los nombres de los datos enviados'});
        }
        const estado = await ModificarImagenes(nombresDeLasImagenes, Id, ImagenSeleccionada);
        if(estado['estadoDeSolicitud']!='exitoso')
            return res.status(400).json({estadoDeSolicitud: 'malo', mensajeDeError: 'Ocurrio un error. Contacte al desarrollador. F(Administracion->CambiarImagenes)'});
        return res.status(200).json({estadoDeSolicitud: 'exitoso'});
    }catch (error){
        return res.status(400).json({estadoDeSolicitud: 'muyMalo', mensajeDeError: error});
    }
}
const RestarCantidad = async (req, res) =>{
    try{
        const { Dato, ID } = req.body;
        let resta = 0;
        if(Dato>=1){
            resta = Dato - 1;
        }
        const estado = await RestarCantidadPorVenta(resta, ID);
        if(estado['estadoDeSolicitud']!='exitoso')
            return res.status(400).json({estadoDeSolicitud: 'malo', mensajeDeError: 'Ocurrio un error. Contacte al desarrollador. F(Administracion->RestarCantidad)'});
        return res.status(200).json({estadoDeSolicitud: 'exitoso'});
    }catch (error){
        return res.status(400).json({estadoDeSolicitud: 'muyMalo', mensajeDeError: error});
    }
}
const CambiarEstadoMostrar = async (req, res)=>{
    try{
        const { Dato, ID } = req.body;
        let estadoNuevo = '';
        if(Dato == 'si'){
            estadoNuevo = 'no';
        }else{
            estadoNuevo = 'si'
        }
        const estado = await ModificarEstadoMostrar(estadoNuevo, ID);
        if(estado['estadoDeSolicitud']!='exitoso')
            return res.status(400).json({estadoDeSolicitud: 'malo', mensajeDeError: 'Ocurrio un error. Contacte al desarrollador. F(Administracion->CambiarEstadoMostrar)'});
        return res.status(200).json({estadoDeSolicitud: 'exitoso'});
    }catch (error){
        return res.status(400).json({estadoDeSolicitud: 'muyMalo', mensajeDeError: error});
    }
}
function ResetearPrecio(Precio){
    let resultado = Precio.replace('.','');
    resultado = resultado.replace(',','');
    resultado = resultado.replace('$','');
    return resultado;
}
function VerificarDatosVacios(Arreglo){
    for(let i = 0; i<Arreglo.length; i++){
        if(Arreglo[i] == '' || Arreglo[i] == null || Arreglo[i] == undefined ){
            return true;
        }
    }
    return false;
}
function VerificarListasVacias (lista1, lista2){
    if(lista1.length == 0 && lista2 == 0)
        return true;
    return false;
}
export default { 
    SubirRopa, ObtenerBusqueda, CambiarDato,
    CambiarImagenes, RestarCantidad, CambiarEstadoMostrar,
    AD_ObtenerTallesColores, CambiarCantiadDeLosTalles, AgregarColor
};