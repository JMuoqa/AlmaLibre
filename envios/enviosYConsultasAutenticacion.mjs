import { Conexion, CerrarConexion  } from "../modelos/baseDeDatos/conexiones.mjs";

async function CargarUsuario(usuario, contraseña, mail) {
        const conexion = await Conexion();
    try{
        const no = 'No';
        const token = '0';
        const sql = 'INSERT INTO Usuarios (NombreDeUsuario, Contraseña, Mail, MailValido, Token, Jerarquia) VALUES(?,?,?,?,?,10)';
        const valores = [usuario, contraseña, mail, no, token];
        await conexion.query(sql, valores, (error, resultado)=>{
            if (error) {
                console.error('Error al registrarse: ', error);
                return 0;
            }
        });
        return 1;
    }
    catch (error){
        console.error('Error al obtener datos: ', error);
        return 0;
    }
    finally{
        await CerrarConexion(conexion);
    }
}
async function ObtenerContraseña(Usuario) {
    const conexion = await Conexion();
    try{
        const sql = 'SELECT Contraseña FROM Usuarios WHERE NombreDeUsuario = ?';
        const [fila] = await conexion.execute(sql, [Usuario]);
        if(fila.length == 0){
            return { estado:'malo', mensaje: 'No se encontro el usuario'};
        }
        if(fila[0].Contraseña == undefined){
            return { estado:'malo', mensaje: 'Hubo un error, intentelo mas tarde'};
        }
        return { estado: 'exitoso', contraseña: fila[0].Contraseña };
    }catch (error){
        return { estado: 'muyMalo', contraseña: '', mensaje: `Hubo un error, intentalo mas tarde. Error: ${error}`}
    }
    finally{
        await CerrarConexion(conexion);
    }
}

async function ChequearUsuarios(Usuario){
    const conexion = await Conexion();
    try{
        const sql = 'SELECT NombreDeUsuario FROM Usuarios WHERE NombreDeUsuario = ?';
        const [fila] = await conexion.execute(sql, [Usuario]);
        if(fila.length > 0 && fila[0].NombreDeUsuario && fila[0].NombreDeUsuario == Usuario){
            return {estado: false, mensaje: 'Ya existe ese usuario registrado'};
        }
        return {estado: true};
    }catch(error){
        return {estado: false, mensaje: 'Hubo un error inesperado'};
    }finally{
        await CerrarConexion(conexion);
    }
}
async function ChequearEmails(Email) {
    const conexion = await Conexion();
    try{
        const sql = 'SELECT Mail FROM Usuarios WHERE Mail = ?';
        const [fila] = await conexion.execute(sql, [Email]);
        console.log(fila);
        if(fila.length > 0 && fila[0].Mail && fila[0].Mail == Email){
            return {estado: false, mensaje: 'Ya existe ese mail registrado'};
        }
        return {estado: true};
    }catch(error){
        return {estado: false, mensaje: 'Hubo un error inesperado'};
    }finally{
        await CerrarConexion(conexion);
    }
}
export { CargarUsuario, ObtenerContraseña, ChequearUsuarios, ChequearEmails };