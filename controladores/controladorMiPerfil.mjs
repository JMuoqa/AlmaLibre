import { CambiarDatos } from "../envios/enviosYConsultasMiPerfil.mjs";
import { ChequearUsuarios } from "../envios/enviosYConsultasAutenticacion.mjs";
const CambiarNombre = async (req, res) =>{
    try{
        const { Usuario } = req.body;
        const usuarioValido = RevisarVulnerabilidad(Usuario);
        if (usuarioValido['estadoDeSolicitud']) {
            return res.json({estadoDeSolicitud: 'malo', mensajeDeError: 'Uno o mas de los datos no son apropiados'});
        }
        const contenido = await ValidarUsuario(Usuario)
        const usuarioAntiguo = req.signedCookies.usuario; 
        const estado = await CambiarDatos(Usuario, usuarioAntiguo, 'NombreDeUsuario');
        console.log(estado['estadoDeSolicitud']);
        if(estado['estadoDeSolicitud'] == 'malo' || contenido != 'exitoso'){
            return res.json({estadoDeSolicitud: 'malo', mensajeDeError: 'No se pudo cambiar el nombre de usuario'});
        };
        res.cookie('usuario', Usuario, { httpOnly: true, signed: true, maxAge: 30 * 60 * 1000 });
        return res.json({ estadoDeSolicitud: 'exitoso' });
    } catch(error){
        return res.json({estadoDeSolicitud: 'muyMalo', mensajeDeError: error});
    }
}
const CambiarMail = async (req, res) => {
    try{
        const { Mail } = req.body;
        if(!/^[a-zA-Z0-9@._-]+$/.test(Mail) || Mail == '' || Mail == null || Mail == undefined){
            return res.json({estadoDeSolicitud: 'malo', mensajeDeError: 'El email contiene caracteres prohibidos'});
        }
        const usuario = req.signedCookies.usuario; 
        const estado = await CambiarDatos(Mail, usuario, 'Mail');
        console.log(estado);
        if(estado['estadoDeSolicitud'] == 'malo'){
            return res.json({estadoDeSolicitud: 'malo', mensajeDeError: 'No se pudo cambiar el mail'});
        };
        return res.json({ estadoDeSolicitud: 'exitoso' });
    }catch(error){
        return res.json({estadoDeSolicitud: 'muyMalo', mensajeDeError: error});
    }
}
const CambairDireccion = async (req, res) => {
    try{
        const { Direccion } = req.body;
        const direccionValida = RevisarVulnerabilidad(Direccion);
        if (direccionValida['estadoDeSolicitud']) {
            return res.json({estadoDeSolicitud: 'malo', mensajeDeError: 'Uno o mas de los datos no son apropiados'});
        }
        const usuario = req.signedCookies.usuario;
        const estado = await CambiarDatos (Direccion, usuario, 'DireccionDeMiCasa');
        if(estado['estadoDeSolicitud'] == 'malo'){
            return res.json({estadoDeSolicitud: 'malo', mensajeDeError: 'No se pudo cambiar la direccion de tu casa'});
        }
        return res.json({ estadoDeSolicitud: 'exitoso' });
    }catch(error){
        return res.json({estadoDeSolicitud: 'muyMalo', mensajeDeError: error});
    }
}
function RevisarVulnerabilidad(Dato){
    if (!/^[a-zA-Z0-9 _-]+$/.test(Dato) || Dato == '' || Dato == null || Dato == undefined) {
        return {estadoDeSolicitud: true, mensajeDeError: 'Unos de los datos no son apropiados'};
    }
    return {estadoDeSolicitud: false};
}
async function ValidarUsuario(Usuario){
    if(Usuario == 'July'){
        return 'Ese nombre de usuario ya existe';
    }
    if(!Usuario || Usuario == '' || Usuario == null || Usuario == undefined){
        return 'El dato que intentas cambiar esta vacio';
    }
    const chequeDeUsuario = await ChequearUsuarios(Usuario);//Verifica el nombre de ususario
    console.log(chequeDeUsuario['estado']);
    if(!chequeDeUsuario['estado']){
        return chequeDeUsuario['mensaje'];
    }
    return 'exitoso';
}
export default { CambiarNombre, CambiarMail, CambairDireccion };