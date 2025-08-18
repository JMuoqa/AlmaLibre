import { Conexion, CerrarConexion  } from "../modelos/baseDeDatos/conexiones.mjs";
import { Ropa } from "../modelos/clases/Ropa.mjs";
import { Talles } from "../modelos/clases/Talles.mjs";
import { Color } from "../modelos/clases/Colores.mjs";
async function CargarRopa(
        Nombre, Precio, Tipo,
        Genero, Descuento, Imagen, 
        ImagenSeleccionada, Descripcion, ColoresOrdenados
    ){
    const conexion = await Conexion();
    try{
        const hoy = new Date().toISOString().split('T')[0]; //Obtiene solo la fecha y la convierte en una cadena de texto
        const sql = 'INSERT INTO Ropa (Nombre, Precio, Imagen, Colores, Tipo, Genero, Cantidad, Publicacion, Talles, Descuento, Mostrar, ImagenSeleccionada, Descripcion) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)'
        const valores = [Nombre, Precio, Imagen, 'OBSOLETO', Tipo, Genero, 1, hoy, 'OBSOLETO', Descuento, 'si', ImagenSeleccionada, Descripcion];
        const [prenda] = await conexion.query(sql, valores);
        if(prenda.affectedRows == 0){
            return false;
        }
        for(let i = 0; i < ColoresOrdenados.length; i++){
            const sqlColores = 'INSERT INTO Colores (IDPrenda, Color, Mostrar) VALUES(?,?,?)';
            const tablaColores = [prenda.insertId, ColoresOrdenados[i].OColor, 'si'];
            const [datosColores] = await conexion.query(sqlColores, tablaColores);
            if(datosColores.affectedRows == 0){
                return false;
            }
            for(let j = 0; j < ColoresOrdenados[i].OListaTalles.length; j++){
                const listaTalles = ColoresOrdenados[i].OListaTalles[j];
                const sqlTalles = 'INSERT INTO Talles (IDColor, IDPrenda, Talle, Cantidad, Mostrar) VALUES(?,?,?,?,?)';
                const tablaTalles = [datosColores.insertId, prenda.insertId, listaTalles.OTalles, listaTalles.OCantidad, 'si'];
                const [datosTalles] = await conexion.query(sqlTalles, tablaTalles);
                if(datosTalles.affectedRows == 0){
                    return false;
                }
            } 
        }
        return true;
    } catch(error){
        console.error('Error al obtener datos: ', error);
        return false;
    }finally{
        await CerrarConexion(conexion);
    }
}
async function ModificarDato(Dato, Columna, ID){
    const conexion = await Conexion();
    try{
        const columnasPermitidas = ['Nombre', 'Precio', 'Tipo', 'Genero', 'Cantidad', 'Descuento', 'Descripcion', 'ImagenSeleccionada'];
        if(!columnasPermitidas.includes(Columna) || !/^[1-9]+$/.test(ID)){
            return {estadoDeSolicitud: 'malo', mensajeDeError: 'Hay datos erroneos'};
        }
        const sql = `UPDATE Ropa SET \`${Columna}\` = ? WHERE Id = ?`;
        const valores = [Dato, ID];
        const [filas] = await conexion.execute(sql,valores);
        if(filas['affectedRows']==0){
            return {estadoDeSolicitud: 'malo', mensajeDeError: 'Ocurrió un problema en la consulta'};
        }
        return { estadoDeSolicitud: 'exitoso'};
    }catch(error){
        console.error('Error al modificar: ', error);
        return { estadoDeSolicitud: 'muyMalo'};
    }finally{
        await CerrarConexion(conexion);
    }
}
async function ModificarCantidad(IDPrenda, Talle, Cantidad) {
    const conexion = await Conexion();
    try{
        const sql = 'UPDATE Talles SET Cantidad = ? WHERE IDPrenda = ? AND Talle = ?';
        const valores = [Cantidad, IDPrenda, Talle];
        const [filas] = await conexion.execute(sql,valores);
        if(filas['affectedRows']==0){
            return {estadoDeSolicitud: 'malo', mensajeDeError: 'Ocurrió un problema en la consulta'};
        }
        return { estadoDeSolicitud: 'exitoso'};
    }catch(error){
        console.error('Error al modificar: ', error);
        return { estadoDeSolicitud: 'muyMalo'};
    }finally{
        await CerrarConexion(conexion);
    }
}
async function ModificarImagenes(Imagenes, ID, ImagenSeleccionada) {
    const conexion = await Conexion();
    try{
        const sql = 'UPDATE Ropa SET Imagen = ? WHERE Id = ?';
        const valores = [Imagenes, ID];
        const [filas] = await conexion.execute(sql,valores);
        if(filas['affectedRows']==0){
            return {estadoDeSolicitud: 'malo', mensajeDeError: 'Ocurrió un problema en la consulta'};
        }
        const sql2 = 'UPDATE Ropa SET ImagenSeleccionada = ? WHERE Id = ?';
        const valores2 = [ImagenSeleccionada, ID];
        const [filas2] = await conexion.execute(sql2,valores2);
        if(filas2['affectedRows']==0){
            return {estadoDeSolicitud: 'malo', mensajeDeError: 'Ocurrió un problema en la consulta'};
        }
        return { estadoDeSolicitud: 'exitoso'};
    }catch(error){
        console.error('Error al modificar: ', error);
        return { estadoDeSolicitud: 'muyMalo'};
    }finally{
        await CerrarConexion(conexion);
    }
}
async function RestarCantidadPorVenta(Dato, ID) {
    const conexion = await Conexion();
    try{
        const sql = 'UPDATE Ropa SET Cantidad = ? WHERE Id = ?';
        const valores = [Dato, ID];
        const [filas] = await conexion.execute(sql,valores);
        if(filas['affectedRows']==0){
            return {estadoDeSolicitud: 'malo', mensajeDeError: 'Ocurrió un problema en la consulta'};
        }
        return { estadoDeSolicitud: 'exitoso'};
    }catch(error){
        console.error('Error al modificar: ', error);
        return { estadoDeSolicitud: 'muyMalo'};
    }finally{
        await CerrarConexion(conexion);
    }
}
async function ModificarEstadoMostrar(Dato, ID) {
    const conexion = await Conexion();
    try{
        const sql = 'UPDATE Ropa SET Mostrar = ? WHERE Id = ?';
        const valores = [Dato, ID];
        const [filas] = await conexion.execute(sql,valores);
        if(filas['affectedRows']==0){
            return {estadoDeSolicitud: 'malo', mensajeDeError: 'Ocurrió un problema en la consulta'};
        }
        return { estadoDeSolicitud: 'exitoso'};
    }catch(error){
        console.error('Error al modificar: ', error);
        return { estadoDeSolicitud: 'muyMalo'};
    }finally{
        await CerrarConexion(conexion);
    }
}
async function ObtenerDetalles(ID) {
    const conexion = await Conexion();
    try{
        const sqlColor = 'SELECT * FROM Colores WHERE IDPrenda = ?';
        const sqlTalles = 'SELECT * FROM Talles WHERE IDPrenda = ?';
        const valor = [ID];
        const [filasDeColores, columnasDeColores] = await conexion.execute(sqlColor, valor); 
        const [filaDeTalles, columnasDeTalles] = await conexion.execute(sqlTalles, valor);
        const arregloDeTalles = [];
        for(let i = 0; i < filaDeTalles.length; i++){
            const talles = new Talles();
            talles.ID = filaDeTalles[i].ID;
            talles.IDColor = filaDeTalles[i].IDColor;
            talles.IDPrenda = filaDeTalles[i].IDPrenda;
            talles.Talle = filaDeTalles[i].Talle;
            talles.Cantidad = filaDeTalles[i].Cantidad;
            talles.Mostrar = filaDeTalles[i].Mostrar;
            arregloDeTalles.push(talles);
        }
        const arregloDeColores = [];
        for(let i = 0; i < filasDeColores.length; i++){
            const colores = new Color();
            colores.ID = filasDeColores[i].ID;
            colores.IDPrenda = filasDeColores[i].IDPrenda;
            colores.Color = filasDeColores[i].Color;
            colores.Mostrar = filasDeColores[i].Mostrar;
            arregloDeColores.push(colores);
        }
        console.log(arregloDeColores, arregloDeTalles);
        return { estadoDeSolicitud: 'exitoso', listaColor: arregloDeColores, listaTalles: arregloDeTalles};
    }catch(error){
        console.error('Error al obtener datos: ', error);
        return {listaColor: [], listaTalles: []};
    }finally{
        await CerrarConexion(conexion);
    }
}
async function SubirTalles(IDColor, IDPrenda, Talle){
    const conexion = await Conexion();
    try{
        const sql = 'INSERT INTO Talles (IDColor, IDPrenda, Talle, Cantidad, Mostrar) VALUES(?,?,?,?,?)';
        const valores = [IDColor, IDPrenda, Talle.OTalles, Talle.OCantidad, 'si'];
        const [talles] = await conexion.query(sql, valores);
        if(talles.affectedRows == 0){
            return false;
        }
        return true;
    }catch(error){
        console.error('Error al obtener datos: ', error);
        return false;
    }finally{
        await CerrarConexion(conexion);
    }
}
async function SubirColor(IDPrenda, coloresOrdenados) {
    const conexion = await Conexion();
    try{
        const sqlColores = 'INSERT INTO Colores (IDPrenda, Color, Mostrar) VALUES(?,?,?)';
        const tablaColores = [IDPrenda, coloresOrdenados.OColor, 'si'];
        const [datosColores] = await conexion.query(sqlColores, tablaColores);
        if(datosColores.affectedRows == 0){
            return false;
        } 
        for(let j = 0; j < coloresOrdenados.OListaTalles.length; j++){
            const listaTalles = coloresOrdenados.OListaTalles[j];
            const sqlTalles = 'INSERT INTO Talles (IDColor, IDPrenda, Talle, Cantidad, Mostrar) VALUES(?,?,?,?,?)';
            const tablaTalles = [datosColores.insertId, IDPrenda, listaTalles.OTalles, listaTalles.OCantidad, 'si'];
            const [datosTalles] = await conexion.query(sqlTalles, tablaTalles);
            if(datosTalles.affectedRows == 0){
                return false;
            }
        } 
        return true;
    }catch(error){
    }finally{
        await CerrarConexion(conexion);
    }
}
async function ObtenerTalles(ID) {
    const conexion = await Conexion();
    try{
        const sql = 'SELECT * FROM Talles WHERE IDPrenda = ? AND Mostrar = \'si\'';
        const [filas, columnas] = await conexion.execute(sql,[ID]);
        const arregloDeTalles = [];
        for(let i = 0; i < filas.length; i++){
            const talles = new Talles();
            talles.ID = filas[i].ID;
            talles.IDColor = filas[i].IDColor;
            talles.IDPrenda = filas[i].IDPrenda;
            talles.Talle = filas[i].Talle;
            talles.Cantidad = filas[i].Cantidad;
            talles.Mostrar = filas[i].Mostrar;
            arregloDeTalles.push(talles);
        }
        return arregloDeTalles;
    }catch (error){ 
        console.error('Error al obtener datos: ', error);
        return [];
    }finally{
        await CerrarConexion(conexion);
    }
}
async function ObtenerColoresDeLaPrenda(ID) {
    const conexion = await Conexion();
    try{
        const sql = 'SELECT * FROM Colores WHERE IDPrenda = ? AND Mostrar = \'si\'';
        const [filas, columnas] = await conexion.execute(sql,[ID]);
        const arregloDeColores = [];
        for(let i = 0; i < filas.length; i++){
            const colores = new Color();
            colores.ID = filas[i].ID;
            colores.IDPrenda = filas[i].IDPrenda;
            colores.Color = filas[i].Color;
            colores.Mostrar = filas[i].Mostrar;
            arregloDeColores.push(colores);
        }
        return arregloDeColores;
    }catch (error){ 
        console.error('Error al obtener datos: ', error);
        return [];
    }finally{
        await CerrarConexion(conexion);
    }
}
async function Buscar(Indicacion, Busqueda) {
    const conexion = await Conexion();
    try{
        const columnasPermitidas = ['Nombre', 'Id', 'Tipo'];
        if (!columnasPermitidas.includes(Indicacion)) {
            throw new Error('La indicación de "Buscar por" tiene caracteres prohibidos');
        }
        let sql = `SELECT * FROM Ropa WHERE \`${Indicacion}\` LIKE ?`;
        let valor = [`%${Busqueda}%`];
        if(Indicacion == 'Id'){
            sql = 'SELECT * FROM Ropa WHERE `Id` = ?'
            valor = [Busqueda];
        }
        const [filas, columnas] = await conexion.execute(sql, valor);
        const arregloDePrendas = [];
        for(let i = 0; i< filas.length; i++){
            const arregloDeImagenes = filas[i].Imagen.split(',');
            const arregloDeTalles = filas[i].Talles.split(',');
            const ropa = new Ropa();
            ropa.id = filas[i].Id;
            ropa.Nombre = filas[i].Nombre;
            ropa.Precio = filas[i].Precio;
            ropa.Imagen = arregloDeImagenes;
            ropa.Colores = filas[i].Colores;
            ropa.Tipo = filas[i].Tipo;
            ropa.Genero = filas[i].Genero;
            ropa.Cantidad = filas[i].Cantidad;
            ropa.Publicacion = filas[i].Publicacion;
            ropa.Talles = arregloDeTalles;
            ropa.Promocion = filas[i].Promocion;
            ropa.Descuento = filas[i].Descuento;
            ropa.Descripcion = filas[i].Descripcion;
            ropa.ImagenSeleccionada = filas[i].ImagenSeleccionada;
            ropa.Mostrar = filas[i].Mostrar;
            arregloDePrendas.push(ropa);
        }
        return arregloDePrendas;
    }catch (error){ 
        console.error('Error al obtener datos: ', error);
        return [];
    }finally{
        await CerrarConexion(conexion);
    }
}
export { 
    CargarRopa, Buscar, ModificarDato,
    ModificarImagenes, RestarCantidadPorVenta, ModificarEstadoMostrar,
    ObtenerTalles, ModificarCantidad, ObtenerColoresDeLaPrenda,
    ObtenerDetalles, SubirTalles, SubirColor
}