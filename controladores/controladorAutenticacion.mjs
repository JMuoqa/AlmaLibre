import { CargarUsuario, ObtenerContraseña, ChequearUsuarios, ChequearEmails } from "../envios/enviosYConsultasAutenticacion.mjs";
import bcrypt from 'bcrypt';
const saltoDeRondas = 10
const Registrarse = async (req, res) => {
    const { Usuario, Email, Contraseña } = req.body;
    if(!/^[a-zA-Z0-9@._-]+$/.test(Email) || Email == '' || Email == null || Email == undefined){
        return res.json({estadoDeSolicitud: 'malo', mensajeDeError: 'El E-mail contiene caracteres prohibidos'});
    }
    const usuarioValido = RevisarVulnerabilidad(Usuario);
    if (usuarioValido['estadoDeSolicitud']) {
        return res.json({estadoDeSolicitud: 'malo', mensajeDeError: 'Uno o mas de los datos no son apropiados'})
    }
    let bandera = await ValidarDatosParaRegistrarse(Usuario, Email, Contraseña) ?? null;
    try{
        if(bandera != 'exitoso'){
            return res.json({estadoDeSolicitud: 'malo', mensajeDeError: bandera})
        }else{
            const contraseñaEncriptada = await bcrypt.hash(Contraseña, saltoDeRondas) ?? '';
            if(contraseñaEncriptada == ''){
                return res.json({estadoDeSolicitud: 'malo', mensajeDeError: 'La contraseña no se puede encriptar'})
            }
            let fila = await CargarUsuario(Usuario, contraseñaEncriptada, Email);
            if(fila && fila>0){
                res.cookie('usuario', Usuario, { httpOnly: true, signed: true, maxAge: 30 * 60 * 1000 }); 
                //El httpOnly es para evitar que se vea en el frontend
                return res.json({estadoDeSolicitud: 'exitoso'});
            }else{
                return res.json({estadoDeSolicitud: 'muyMalo', mensajeDeError: 'No pudimos cargar el usuario, o hubo un error inesperado'});
            }
        }
    }catch(error){
        return res.json({estadoDeSolicitud: 'muyMalo', mensajeDeError: error});
    }
}
const IniciarSesion = async (req, res) => {
    const { Contraseña, Usuario } = req.body;
    const usuarioValido = RevisarVulnerabilidad(Usuario);
    if (usuarioValido['estadoDeSolicitud']) {
        return res.json({estadoDeSolicitud: 'malo', mensajeDeError: 'Uno o mas de los datos no son apropiados'})
    }
    try{
        const validacion = ValidarDatosParaIniciarSesion(Usuario, Contraseña)
        if(validacion != 'exitoso'){
            return res.json({estadoDeSolicitud: 'malo', mensajeDeError: validacion});
        }
        const contraseñaEncriptada = await ObtenerContraseña(Usuario);
        if(contraseñaEncriptada['estado'] != 'exitoso'){
            return res.json({estadoDeSolicitud: contraseñaEncriptada['estado'], mensajeDeError: contraseñaEncriptada['mensaje']});
        }
        const bandera = await bcrypt.compare(Contraseña, contraseñaEncriptada['contraseña']);
        if(bandera){
            res.cookie('usuario', Usuario, { httpOnly: true, signed: true, maxAge: 30 * 60 * 1000 });
            return res.json({estadoDeSolicitud: 'exitoso'});
        }else{
            return res.json({estadoDeSolicitud: 'malo', mensajeDeError: 'Las contraseñas es incorrecta'})
        }
    }catch(error){
        return res.json({estadoDeSolicitud: 'muyMalo', mensajeDeError: error});
    }
}
const SalirDeLaSesion = (req, res) =>{
    try{
        res.clearCookie('usuario');
        res.clearCookie('carrito');
        return res.json({estadoDeSolicitud: 'exitoso'})
    }catch(error){
        return res.json({estadoDeSolicitud: 'muyMalo', mensajeDeError: error});
    }
}
function ValidarDatosParaIniciarSesion(Usuario, Contraseña){
    if(!Usuario || Usuario == '' || Usuario == undefined){
        return 'El nombre de usuario esta vacio';
    }
    if(!Contraseña || Usuario == '' || Usuario == undefined){
        return 'La contraseña esta vacia';
    }
    return 'exitoso';
}
function RevisarVulnerabilidad(Dato){
    if (!/^[a-zA-Z0-9_-]+$/.test(Dato) || Dato == '' || Dato == null || Dato == undefined) {
        return {estadoDeSolicitud: true, mensajeDeError: 'Unos de los datos no son apropiados'};
    }
    return {estadoDeSolicitud: false};
}
async function ValidarDatosParaRegistrarse(Usuario, Email, Contraseña){
    if(Usuario == 'july' || Usuario == 'July'){
        return 'Ese nombre de usuario ya existe'
    }
    const chequeDeUsuario = await ChequearUsuarios(Usuario)//Verifica el nombre de ususario
    if(!chequeDeUsuario['estado']){
        return chequeDeUsuario['mensaje'];
    }
    const chequeDeMail = await ChequearEmails(Email);//Verifica el mail
    if(!chequeDeMail['estado']){
        return chequeDeMail['mensaje'];
    }
    if(!Usuario && !Contraseña && !Email){
        return 'Algunos parametros estan vacios';
    }
    if(Contraseña.length < 8){
        return 'La contraseña debe tener un minimo de ocho caracteres';
    }
    return 'exitoso'
}
export default { IniciarSesion, Registrarse, SalirDeLaSesion };