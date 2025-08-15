import { Conexion, CerrarConexion } from "../modelos/baseDeDatos/conexiones.mjs";
import { MiPerfil } from "../modelos/clases/miPerfil.mjs";
async function ObtenerDatosDeMiPerfil(Usuario) {
    const conexion = await Conexion();
    try{
        const sql = 'SELECT * FROM Usuarios WHERE NombreDeUsuario = ?';
        const [filas, columnas] = await conexion.execute(sql, [Usuario]);
        const perfil = new MiPerfil()
        perfil.NombreDeUsuario = filas[0].NombreDeUsuario;
        perfil.Mail = filas[0].Mail;
        if(filas[0].DireccionDeMiCasa == '' || filas[0].DireccionDeMiCasa == null || filas[0].DireccionDeMiCasa == undefined){
            filas[0].DireccionDeMiCasa = '';
        }
        perfil.DireccionDeMiCasa = filas[0].DireccionDeMiCasa;
        return { estadoDeSolicitud: 'exitoso', Perfil: perfil};
    } catch(error){
        return { estadoDeSolicitud: 'malo', Perfil: null, mensajeDeError: error};
    } finally{
        await CerrarConexion(conexion);
    }
}
async function CambiarDatos(DatoNuevo, Usuario, Campo) {
    const conexion = await Conexion();
    try{
        if(!/^[a-zA-Z]+$/.test(Campo) || Campo == '' || Campo == null || Campo == undefined){
            return { estadoDeSolicitud: 'malo', mensajeDeError: 'Los caracteres del campo a cambiar son incorrectos, intentelo mas tarde'};
        }
        const sql = `UPDATE Usuarios SET ${Campo} = ? WHERE NombreDeUsuario = ?;`;
        const valores = [DatoNuevo, Usuario]
        await conexion.execute(sql, valores);
        return { estadoDeSolicitud: 'exitoso'};
    } catch(error){
        return { estadoDeSolicitud: 'malo', mensajeDeError: error};
    }finally{
        await CerrarConexion(conexion);
    }
}
async function ObtenerJerarquia(Usuario) {
    const conexion = await Conexion();
    try{
        if(!/^[a-zA-Z]+$/.test(Usuario) || Usuario == '' || Usuario == null || Usuario == undefined){
            return { estadoDeSolicitud: 'malo', mensajeDeError: 'Los caracteres del campo a cambiar son incorrectos, intentelo mas tarde'};
        }
        const sql = 'Select Jerarquia FROM Usuarios WHERE NombreDeUsuario = ?'
        const [fila] = await conexion.execute(sql,[Usuario]);
        if(fila.length == 0){
            return { estado:'malo', mensaje: 'No se encontro el usuario, para la jerarquia'};
        } 
        return { estado: 'exitoso', Jerarquia: fila[0].Jerarquia };
    }catch(error){
        return { estadoDeSolicitud: 'malo', mensajeDeError: error};
    }finally{
        await CerrarConexion(conexion);
    }
}
export { ObtenerDatosDeMiPerfil, CambiarDatos, ObtenerJerarquia  };