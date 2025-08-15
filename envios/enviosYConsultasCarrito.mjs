import { Conexion, CerrarConexion  } from "../modelos/baseDeDatos/conexiones.mjs";

async function VerificarExistencia(id) {
    const conexion = await Conexion();
    try{
        const sql = 'SELECT Id FROM Ropa WHERE Id = ?';
        const [filas, columnas] = await conexion.execute(sql, [id]);
        if(filas.length == 0){
            return { estado:'malo', mensaje: 'No se encontro la prenda'};
        }
        return { estado: 'exitoso'};
    }catch (error){ 
        console.error('Error al obtener datos: ', error);
        return [];
    }finally{
        await CerrarConexion(conexion);
    }
}

export { VerificarExistencia };