import { ObtenerDatosDeMiPerfil, ObtenerJerarquia } from "../envios/enviosYConsultasMiPerfil.mjs";
import { ObtenerPrendasNuevas, ObtenerPrendas, ObtenerVerMas, VerGeneroYTipo, ObtenerTalles, ObtenerPromocionesDe, ObtenerColores } from "../envios/enviosYConsultasCatalogos.mjs";
let urlOriginal = '';
let urlDeImagenes
if(process.env.NODE_ENV === 'development'){
    urlOriginal = 'https://almalibre54.com:5443';
    urlDeImagenes = 'C:/Users/Joaquin/Desktop/almalibre/ImagenesCargadas';
}
else{
    urlOriginal = 'https://almalibre54.com';
    urlDeImagenes = '/home/joaquin/Imagenes/AlmaLibre/';
}
//Url
const urlMiPerfil = '/mi-perfil';
const urlRegistrarse = '/registrarse';
const urlAutenticacion = '/autenticacion';
const urlCargarProductos = '/cargar-productos';
const urlBuscarYEditar = '/buscar-y-editar';
const Inicio = async (req, res) => {
    let accionesRecientes = '';
    let Bandera = false;
    let prendasSeleccionadas = req.signedCookies.carrito ?? [];
    if(prendasSeleccionadas == false || prendasSeleccionadas == undefined){
        prendasSeleccionadas = [];
    }
    const usuario = req.signedCookies.usuario;
    const jerarquiaObtenida = await ObtenerJerarquia(usuario) ?? { Jerarquia: 20 };
    const prendas = await ObtenerPrendasNuevas();
    const prendasVerMas = await ObtenerVerMas();
    const fechaActual = new Date().toISOString().split('T')[0];
    if(req.query.mensajeExitoso && req.query.mensajeExitoso != '' && req.query.mensajeExitoso != null){
        accionesRecientes = req.query.mensajeExitoso;
        Bandera = true;
    }
    const tope = 8;
    let indiceDeLista = req.query.indice ?? 1;
    let principio = (indiceDeLista * tope) - tope;
    if(principio<0){
        principio = 0;
    } 
    let final = indiceDeLista * tope;
    if(final == 0){
        final += tope;
    }
    if(principio>prendas.length){
        principio = 0;
        final = tope;
    }
    res.render('principal/inicio', { 
        Url: urlOriginal,
        UrlMiPerfil: urlMiPerfil,
        UrlRegistrarse: urlRegistrarse,
        UrlAutenticacion: urlAutenticacion,
        UrlCargarProductos: urlCargarProductos,
        UrlBuscarYEditar: urlBuscarYEditar, 
        Aviso: accionesRecientes,
        Dialog: Bandera,
        Jerarquia: jerarquiaObtenida['Jerarquia'],
        Usuario: usuario,
        Prendas: prendas,
        PrendasVerMas: prendasVerMas,
        UrlDeImagenes: urlDeImagenes,
        FechaActual: fechaActual,
        Principio: principio,
        Final: final,
        Carrito: prendasSeleccionadas,
        FormatoDelPrecio: ConseguirFormatoDelPrecio,
        PrecioOrignal: ConseguirFormatoDelPrecioOriginal,
        ControlDelUsuario: ControlarQueElUsuarioExista,
        Dias: DiferenciaEnDIas,
    });
}
const PrendasPorUnidad = async (req, res) => {
    const usuario = req.signedCookies.usuario;
    const numeroDePrenda = req.query.prenda;
    let Bandera = false;
    let prendasSeleccionadas = req.signedCookies.carrito ?? [];
    if(prendasSeleccionadas == false || prendasSeleccionadas == undefined){
        prendasSeleccionadas = [];
    }
    let accionesRecientes = '';
    if(numeroDePrenda.length==0){
        return Error(req, res);
    }
    const infoDePrenda = await ObtenerPrendas(numeroDePrenda);
    const infoDeTalles =  await ObtenerTalles(numeroDePrenda);
    const infoDeColores = await ObtenerColores(numeroDePrenda);
    const jerarquiaObtenida = await ObtenerJerarquia(usuario) ?? { Jerarquia: 20 };
    res.render('experienciaDelCliente/vistaDeUnaPrenda', { 
        Url: urlOriginal,
        UrlMiPerfil: urlMiPerfil,
        UrlRegistrarse: urlRegistrarse,
        UrlAutenticacion: urlAutenticacion,
        UrlCargarProductos: urlCargarProductos,
        UrlBuscarYEditar: urlBuscarYEditar, 
        Aviso: accionesRecientes,
        Dialog: Bandera,
        Jerarquia: jerarquiaObtenida['Jerarquia'],
        Usuario: usuario,
        DatosDeLaPrenda: infoDePrenda,
        TallesSeleccionados: infoDeTalles,
        ColoresSeleccionados: infoDeColores,
        Carrito: prendasSeleccionadas,
        FormatoDelPrecio: ConseguirFormatoDelPrecio,
        PrecioOrignal: ConseguirFormatoDelPrecioOriginal,
        ControlDelUsuario: ControlarQueElUsuarioExista,
    });
}
const Autenticacion = async (req, res) =>{
    let accionesRecientes = '';
    let Bandera = false;
    let prendasSeleccionadas = req.signedCookies.carrito ?? [];
    if(prendasSeleccionadas == false || prendasSeleccionadas == undefined){
        prendasSeleccionadas = [];
    }
    const usuario = req.signedCookies.usuario;
    const jerarquiaObtenida = await ObtenerJerarquia(usuario) ?? { Jerarquia: 20 };
    let Perfil = {};
    if( usuario != undefined && usuario != null && usuario != '' && usuario != false){
        Perfil = await ObtenerDatosDeMiPerfil(usuario);
    }
    if(req.query.mensajeExitoso && req.query.mensajeExitoso != '' && req.query.mensajeExitoso != null){
        accionesRecientes = req.query.mensajeExitoso;
        Bandera = true;
    }
    res.render('autenticacion/miPerfil', { 
        Url: urlOriginal,
        UrlMiPerfil: urlMiPerfil,
        UrlRegistrarse: urlRegistrarse,
        UrlAutenticacion: urlAutenticacion,
        UrlCargarProductos: urlCargarProductos,
        UrlBuscarYEditar: urlBuscarYEditar, 
        Aviso: accionesRecientes,
        Dialog: Bandera,
        Jerarquia: jerarquiaObtenida['Jerarquia'],
        Usuario: usuario,
        DatosDeMiPerfil: Perfil['Perfil'],
        Carrito: prendasSeleccionadas,
        ControlDelUsuario: ControlarQueElUsuarioExista,
    });
}
const Registrase = async (req, res) =>{
    let Bandera = false;
    let prendasSeleccionadas = req.signedCookies.carrito ?? [];
    if(prendasSeleccionadas == false || prendasSeleccionadas == undefined){
        prendasSeleccionadas = [];
    }
    const usuario = req.signedCookies.usuario;
    const jerarquiaObtenida = await ObtenerJerarquia(usuario) ?? { Jerarquia: 20 };
    res.render('autenticacion/registrarse', { 
        Url: urlOriginal,
        UrlMiPerfil: urlMiPerfil,
        UrlRegistrarse: urlRegistrarse,
        UrlAutenticacion: urlAutenticacion,
        UrlCargarProductos: urlCargarProductos,
        UrlBuscarYEditar: urlBuscarYEditar, 
        Aviso: '',
        Dialog: Bandera,
        Jerarquia: jerarquiaObtenida['Jerarquia'],
        Usuario: usuario,
        Carrito: prendasSeleccionadas,
        ControlDelUsuario: ControlarQueElUsuarioExista,
    });
}
const CargarProductos = async (req, res) =>{
    let Bandera = false;
    let prendasSeleccionadas = req.signedCookies.carrito ?? [];
    if(prendasSeleccionadas == false || prendasSeleccionadas == undefined){
        prendasSeleccionadas = [];
    }
    const usuario = req.signedCookies.usuario;
    const jerarquiaObtenida = await ObtenerJerarquia(usuario) ?? { Jerarquia: 20 };
    if(jerarquiaObtenida['Jerarquia'] == 0){
        res.render('administracion/cargarProductos', {
            Url: urlOriginal,
            UrlMiPerfil: urlMiPerfil,
            UrlRegistrarse: urlRegistrarse,
            UrlAutenticacion: urlAutenticacion,
            UrlCargarProductos: urlCargarProductos,
            UrlBuscarYEditar: urlBuscarYEditar, 
            Aviso: '',
            Dialog: Bandera,
            Jerarquia: jerarquiaObtenida['Jerarquia'],
            Usuario: usuario,
            Carrito: prendasSeleccionadas,
            ControlDelUsuario: ControlarQueElUsuarioExista,
        });
    }else{
        Inicio(req, res);
    }
}
const BuscarYEditar = async (req, res) => {
    let accionesRecientes = '';
    let Bandera = false;
    let prendasSeleccionadas = req.signedCookies.carrito ?? [];
    if(prendasSeleccionadas == false || prendasSeleccionadas == undefined){
        prendasSeleccionadas = [];
    }
    const usuario = req.signedCookies.usuario;
    const jerarquiaObtenida = await ObtenerJerarquia(usuario) ?? { Jerarquia: 20 };
    if(req.query.mensajeExitoso && req.query.mensajeExitoso != '' && req.query.mensajeExitoso != null){
        accionesRecientes = req.query.mensajeExitoso;
        Bandera = true;
    }
    if(jerarquiaObtenida['Jerarquia'] == 0){
        res.render('administracion/editarProductos', {
            Url: urlOriginal,
            UrlMiPerfil: urlMiPerfil,
            UrlRegistrarse: urlRegistrarse,
            UrlAutenticacion: urlAutenticacion,
            UrlCargarProductos: urlCargarProductos,
            UrlBuscarYEditar: urlBuscarYEditar, 
            Aviso: accionesRecientes,
            Dialog: Bandera,
            Jerarquia: jerarquiaObtenida['Jerarquia'],
            Usuario: usuario,
            Carrito: prendasSeleccionadas,
            ControlDelUsuario: ControlarQueElUsuarioExista,
        });
    }else{
        Inicio(req, res);
    }
}
const PrevioWhatsApp = async (req, res) => {
    let Bandera = false;
    let prendasSeleccionadas = req.signedCookies.carrito ?? [];
    if(prendasSeleccionadas == false || prendasSeleccionadas == undefined)
        prendasSeleccionadas = [];
    const usuario = req.signedCookies.usuario;
    const jerarquiaObtenida = await ObtenerJerarquia(usuario) ?? { Jerarquia: 20 };
    res.render('experienciaDelCliente/previoWhatsApp', {
        Url: urlOriginal,
        UrlMiPerfil: urlMiPerfil,
        UrlRegistrarse: urlRegistrarse,
        UrlAutenticacion: urlAutenticacion,
        UrlCargarProductos: urlCargarProductos,
        UrlBuscarYEditar: urlBuscarYEditar, 
        Aviso: '',
        Dialog: Bandera,
        Jerarquia: jerarquiaObtenida['Jerarquia'],
        Usuario: usuario,
        Carrito: prendasSeleccionadas,
        ControlDelUsuario: ControlarQueElUsuarioExista,
    });
}
const VerPrendas = async (req, res) => {
    let Bandera = false;
    const genero = req.query.genero;
    const tipo = req.query.tipo;
    let verTodo = false;
    if(tipo == 'Ver-todo')
        verTodo = true;
    const tiposPermitidos = ['Remera', 'Saco', 'Poleron', 'Cárdigan', 'Campera', 'Suéter', 'Chaleco', 'Buzo', 'Pantalon', 'Ver-todo'];
    const generosPermitidos = ['Mujer', 'Niño/Niña'];
    if(!tiposPermitidos.includes(tipo))
            return Error(req, res);
    if(!generosPermitidos.includes(genero))
            return Error(req, res);
    const listaDePrendas = await VerGeneroYTipo(genero, tipo, verTodo);
    const prendasVerMas = await ObtenerPromocionesDe(genero, tipo, verTodo);
    let prendasSeleccionadas = req.signedCookies.carrito ?? [];
    if(prendasSeleccionadas == false || prendasSeleccionadas == undefined)
        prendasSeleccionadas = [];
    const usuario = req.signedCookies.usuario;
    const jerarquiaObtenida = await ObtenerJerarquia(usuario) ?? { Jerarquia: 20 };let indiceDeLista = req.query.indice ?? 1;
    let principio = (indiceDeLista * 8) - 8;
    if(principio<0)
        principio = 0;
    let final = indiceDeLista * 8;
    if(final == 0)
        final += 8;
    if(principio>listaDePrendas.length){
        principio = 0;
        final = 8;
    }
    res.render('experienciaDelCliente/verPrendas', {
        Url: urlOriginal,
        UrlMiPerfil: urlMiPerfil,
        UrlRegistrarse: urlRegistrarse,
        UrlAutenticacion: urlAutenticacion,
        UrlCargarProductos: urlCargarProductos,
        UrlBuscarYEditar: urlBuscarYEditar, 
        Aviso: '',
        Dialog: Bandera,
        Jerarquia: jerarquiaObtenida['Jerarquia'],
        Usuario: usuario,
        Carrito: prendasSeleccionadas,
        PrendasVerMas: prendasVerMas,
        Prendas: listaDePrendas,
        Genero: genero,
        Tipo: tipo,
        Principio: principio,
        Final: final,
        ControlDelUsuario: ControlarQueElUsuarioExista,
        FormatoDelPrecio: ConseguirFormatoDelPrecio,
        PrecioOrignal: ConseguirFormatoDelPrecioOriginal,
        Dias: DiferenciaEnDIas,
    });
}
const VerPromos = async (req, res) =>{
    let Bandera = false;
    const genero = req.query.genero;
    const tipo = req.query.tipo;
    let verTodo = false;
    if(tipo == 'Ver-todo')
        verTodo = true;
    const tiposPermitidos = ['Remera', 'Saco', 'Poleron', 'Cárdigan', 'Campera', 'Suéter', 'Chaleco', 'Buzo', 'Pantalon', 'Ver-todo'];
    const generosPermitidos = ['Mujer', 'Niño/Niña'];
    if(!tiposPermitidos.includes(tipo))
            return Error(req, res);
    if(!generosPermitidos.includes(genero))
            return Error(req, res);
    const listaDePrendas = await ObtenerPromocionesDe(genero, tipo, verTodo);
    let prendasSeleccionadas = req.signedCookies.carrito ?? [];
    if(prendasSeleccionadas == false || prendasSeleccionadas == undefined)
        prendasSeleccionadas = [];
    const usuario = req.signedCookies.usuario;
    const jerarquiaObtenida = await ObtenerJerarquia(usuario) ?? { Jerarquia: 20 };let indiceDeLista = req.query.indice ?? 1;
    let principio = (indiceDeLista * 8) - 8;
    if(principio<0)
        principio = 0;
    let final = indiceDeLista * 8;
    if(final == 0)
        final += 8;
    if(principio>listaDePrendas.length){
        principio = 0;
        final = 8;
    }
    res.render('experienciaDelCliente/verPromos', {
        Url: urlOriginal,
        UrlMiPerfil: urlMiPerfil,
        UrlRegistrarse: urlRegistrarse,
        UrlAutenticacion: urlAutenticacion,
        UrlCargarProductos: urlCargarProductos,
        UrlBuscarYEditar: urlBuscarYEditar, 
        Aviso: '',
        Dialog: Bandera,
        Jerarquia: jerarquiaObtenida['Jerarquia'],
        Usuario: usuario,
        Carrito: prendasSeleccionadas,
        Prendas: listaDePrendas,
        Genero: genero,
        Tipo: tipo,
        Principio: principio,
        Final: final,
        ControlDelUsuario: ControlarQueElUsuarioExista,
        FormatoDelPrecio: ConseguirFormatoDelPrecio,
        PrecioOrignal: ConseguirFormatoDelPrecioOriginal,
        Dias: DiferenciaEnDIas,
    });
}
const Guia = async (req, res) => {
    let Bandera = false;
    let prendasSeleccionadas = req.signedCookies.carrito ?? [];
    if(prendasSeleccionadas == false || prendasSeleccionadas == undefined)
        prendasSeleccionadas = [];
    const usuario = req.signedCookies.usuario;
    const jerarquiaObtenida = await ObtenerJerarquia(usuario) ?? { Jerarquia: 20 };
    res.render('experienciaDelCliente/guia', {
        Url: urlOriginal,
        UrlMiPerfil: urlMiPerfil,
        UrlRegistrarse: urlRegistrarse,
        UrlAutenticacion: urlAutenticacion,
        UrlCargarProductos: urlCargarProductos,
        UrlBuscarYEditar: urlBuscarYEditar, 
        Aviso: '',
        Dialog: Bandera,
        Jerarquia: jerarquiaObtenida['Jerarquia'],
        Usuario: usuario,
        Carrito: prendasSeleccionadas,
        ControlDelUsuario: ControlarQueElUsuarioExista,
    });
}
const Contacto = async (req, res) => {
    let Bandera = false;
    let prendasSeleccionadas = req.signedCookies.carrito ?? [];
    if(prendasSeleccionadas == false || prendasSeleccionadas == undefined)
        prendasSeleccionadas = [];
    const usuario = req.signedCookies.usuario;
    const jerarquiaObtenida = await ObtenerJerarquia(usuario) ?? { Jerarquia: 20 };
    res.render('experienciaDelCliente/contacto', {
        Url: urlOriginal,
        UrlMiPerfil: urlMiPerfil,
        UrlRegistrarse: urlRegistrarse,
        UrlAutenticacion: urlAutenticacion,
        UrlCargarProductos: urlCargarProductos,
        UrlBuscarYEditar: urlBuscarYEditar, 
        Aviso: '',
        Dialog: Bandera,
        Jerarquia: jerarquiaObtenida['Jerarquia'],
        Usuario: usuario,
        Carrito: prendasSeleccionadas,
        ControlDelUsuario: ControlarQueElUsuarioExista,
    });
}
const Error = async (req, res) =>{
    let Bandera = false;
    let prendasSeleccionadas = req.signedCookies.carrito ?? [];
    if(prendasSeleccionadas == false || prendasSeleccionadas == undefined)
        prendasSeleccionadas = [];
    const usuario = req.signedCookies.usuario;
    const jerarquiaObtenida = await ObtenerJerarquia(usuario) ?? { Jerarquia: 20 };
    const error  = req.query.mensaje ?? 'Se produjo un error inesperado';
    res.render('principal/errores',{ 
        Url: urlOriginal,
        UrlMiPerfil: urlMiPerfil,
        UrlRegistrarse: urlRegistrarse,
        UrlAutenticacion: urlAutenticacion,
        UrlCargarProductos: urlCargarProductos,
        UrlBuscarYEditar: urlBuscarYEditar, 
        Aviso: '',
        Dialog: Bandera,
        MensajeDelError: error,
        Jerarquia: jerarquiaObtenida['Jerarquia'],
        Usuario: usuario,
        Carrito: prendasSeleccionadas,
        ControlDelUsuario: ControlarQueElUsuarioExista,
    });
}
function DiferenciaEnDIas(FechaRegistrada){
    let nuevo = false;
    const fechaActual = new Date();
    const fechaRegistrada = new Date(FechaRegistrada);
    let dias = fechaActual - fechaRegistrada;
    dias = dias / (1000*60*60*24);
    if(dias < 15)
        nuevo = true;
    return nuevo;
}
function ConseguirFormatoDelPrecio(precio, descuento){
    let precioFinal = precio;
    precioFinal = precioFinal - (precioFinal * descuento) / 100;
    const arregloDeNumeros = precioFinal.toString().split('');
    const arregloAux = [];
    for(let i = arregloDeNumeros.length-1; i>=0; i--){ 
        let largoDelArreglo = arregloDeNumeros.length-1;
        let controlador = largoDelArreglo - i;
        if(controlador%3==0 && i != arregloDeNumeros.length-1){
            arregloAux.push('.');
            arregloAux.push(arregloDeNumeros[i]);
        }else{
            arregloAux.push(arregloDeNumeros[i]);
        }
    }
    arregloAux.push('$');
    let cadenaDeTexto = '';
    for(let i = arregloAux.length-1; i>=0; i--){
        cadenaDeTexto += arregloAux[i];
    }
    cadenaDeTexto += ',00';
    return cadenaDeTexto;
}
function ConseguirFormatoDelPrecioOriginal(precio){
    let precioFinal = precio;
    const arregloDeNumeros = precioFinal.toString().split('');
    const arregloAux = [];
    for(let i = arregloDeNumeros.length-1; i>=0; i--){ 
        let largoDelArreglo = arregloDeNumeros.length-1;
        let controlador = largoDelArreglo - i;
        if(controlador%3==0 && i != arregloDeNumeros.length-1){
            arregloAux.push('.');
            arregloAux.push(arregloDeNumeros[i]);
        }else{
            arregloAux.push(arregloDeNumeros[i]);
        }
    }
    arregloAux.push('$');
    let cadenaDeTexto = '';
    for(let i = arregloAux.length-1; i>=0; i--){
        cadenaDeTexto += arregloAux[i];
    }
    cadenaDeTexto += ',00';
    return cadenaDeTexto;
}
function ControlarQueElUsuarioExista(usuario){
    if(usuario == undefined || usuario == '' || usuario == false || usuario == null){
        return true;
    }
    return false;
}
export default { 
    Inicio, Autenticacion, Registrase,
    Error, CargarProductos, BuscarYEditar,
    PrendasPorUnidad, PrevioWhatsApp, VerPrendas,
    Guia, Contacto, VerPromos
};