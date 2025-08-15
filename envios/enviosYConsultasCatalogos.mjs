import { Conexion, CerrarConexion  } from "../modelos/baseDeDatos/conexiones.mjs";
import { Ropa } from "../modelos/clases/Ropa.mjs";
import { Talles } from "../modelos/clases/Talles.mjs";
import { Color } from "../modelos/clases/Colores.mjs";
async function ObtenerPrendasNuevas() {
    const conexion = await Conexion();
    try{
        const fechaActual = new Date();
        const quinceDiasEnMiilisegundos = 1296000000;
        const diferencia = fechaActual - quinceDiasEnMiilisegundos;
        const Fecha = new Date(diferencia).toISOString().split('T')[0];
        const sql = 'SELECT * FROM Ropa WHERE Mostrar = \'si\' AND Publicacion > ?';
        let [filas, columnas] = await conexion.execute(sql,[Fecha]);
        const arregloDePrendas = [];
        for(let i = filas.length-1; i>=0; i--){
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
            ropa.ImagenSeleccionada = filas[i].ImagenSeleccionada;
            ropa.Mostrar = filas[i].Mostrar;
            ropa.Descripcion = filas[i].Descripcion;
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

async function ObtenerVerMas() {
    const conexion = await Conexion();
    try{
        const sql = 'SELECT * FROM Ropa WHERE Mostrar = \'si\' AND Cantidad > 0 AND Descuento > 0';
        let [filas, columnas] = await conexion.execute(sql);
        const arregloDePrendas = [];
        for(let i = 0; i< filas.length; i++){
            if(i==4){
                break;
            }
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
            ropa.ImagenSeleccionada = filas[i].ImagenSeleccionada;
            ropa.Mostrar = filas[i].Mostrar;
            ropa.Descripcion = filas[i].Descripcion;
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
async function ObtenerPromocionesDe(Genero, Tipo, VerTodo) {
    const conexion = await Conexion();
    try{
        let sql = 'SELECT * FROM Ropa WHERE Genero = ? AND Tipo = ? AND Mostrar = \'si\' AND Cantidad > 0 AND Descuento > 0';
        let valores = [Genero, Tipo]
        if(VerTodo){
            sql = 'SELECT * FROM Ropa WHERE Genero = ? AND Mostrar = \'si\' AND Cantidad > 0 AND Descuento > 0'
            valores = [Genero];
        }
        const [filas, columnas] = await conexion.execute(sql,valores);
        const arregloDePrendas = [];
        for(let i = 0; i < filas.length; i++){
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
            ropa.ImagenSeleccionada = filas[i].ImagenSeleccionada;
            ropa.Mostrar = filas[i].Mostrar;
            ropa.Descripcion = filas[i].Descripcion;
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
async function ObtenerPrendas(prenda) {
    const conexion = await Conexion();
    try{
        const sql = 'SELECT * FROM Ropa WHERE Id = ? AND Mostrar = \'si\' AND Cantidad > 0';
        const [filas, columnas] = await conexion.execute(sql,[prenda]);
        const arregloDePrendas = [];
        for(let i = 0; i < filas.length; i++){
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
            ropa.ImagenSeleccionada = filas[i].ImagenSeleccionada;
            ropa.Mostrar = filas[i].Mostrar;
            ropa.Descripcion = filas[i].Descripcion;
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
async function ObtenerTalles(prenda) {
    const conexion = await Conexion();
    try{
        const sql = 'SELECT * FROM Talles WHERE IDPrenda = ? AND Mostrar = \'si\' AND Cantidad > 0';
        const [filas, columnas] = await conexion.execute(sql,[prenda]);
        const arregloDeTalles = [];
        for(let i = 0; i < filas.length; i++){
            const talles = new Talles();
            talles.ID = filas[i].ID;
            talles.IDPrenda = filas[i].IDPrenda;
            talles.IDColor = filas[i].IDColor;
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
async function ObtenerColores(prenda) {
    const conexion = await Conexion();
    try{
        const sql = 'SELECT * FROM Colores WHERE IDPrenda = ? AND Mostrar = \'Si\'';
        const [filas, columnas] = await conexion.execute(sql, [prenda]);
        const listaDeColores = [];
        for(let i = 0; i < filas.length; i++){
            const colores = new Color();
            colores.ID = filas[i].ID;
            colores.IDPrenda = filas[i].IDPrenda;
            colores.Color = filas[i].Color;
            colores.Mostrar = filas[i].Mostrar;
            listaDeColores.push(colores);
        }
        return listaDeColores;
    }catch (error){ 
        console.error('Error al obtener datos: ', error);
        return [];
    }finally{
        await CerrarConexion(conexion);
    }
}
async function VerGeneroYTipo(Genero, Tipo, VerTodo) {
    // const tiposPermitidos = ['Remera', 'Saco', 'Poleron', 'Cárdigan', 'Campera', 'Sweter', 'Chaleco', 'Buzo', 'Pantalon'];
    const conexion = await Conexion();
    try{
        let sql = 'SELECT * FROM Ropa WHERE Genero = ? AND Tipo = ? AND Mostrar = \'si\' AND Cantidad > 0';
        let valores = [Genero, Tipo]
        if(VerTodo){
            sql = 'SELECT * FROM Ropa WHERE Genero = ? AND Mostrar = \'si\' AND Cantidad > 0'
            valores = [Genero];
        }
        const [filas, columnas] = await conexion.execute(sql,valores);
        const arregloDePrendas = [];
        for(let i = 0; i < filas.length; i++){
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
            ropa.ImagenSeleccionada = filas[i].ImagenSeleccionada;
            ropa.Mostrar = filas[i].Mostrar;
            ropa.Descripcion = filas[i].Descripcion;
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
    ObtenerPrendasNuevas, ObtenerPrendas, ObtenerVerMas, 
    VerGeneroYTipo, ObtenerTalles, ObtenerPromocionesDe,
    ObtenerColores
};