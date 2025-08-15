import { VerificarExistencia } from "../envios/enviosYConsultasCarrito.mjs";

const AñadirPrendaAlCarrito = async (req, res) => {
    try{
        const { 
            Id, Lista, 
            Nombre, Precio, 
            Imagen, Seleccionada 
        } = req.body;
        if(!/^[0-9]+$/.test(Id)){
            return res.status(400);
        }
        if(Lista.length == 0){
            return res.json({estadoDeSolicitud: 'malo', mensajeDeError: 'No hay nada para agregar'});
        }
        const estado = await VerificarExistencia(Id);
        if(estado['estado'] != 'exitoso'){
            return res.json({estadoDeSolicitud: 'muyMalo', mensajeDeError: estado['mensaje']});
        }
        let carrito = req.signedCookies.carrito;
        if(carrito == false || carrito == undefined){
            carrito = [];
        }
        for(let i = 0; i < Lista.length; i++){
            let bandera = true;
            const objetoModelo = {
                ID: Id, Talle: Lista[i].OTalle, Color: Lista[i].OColor, 
                CantidadDePrendas: parseInt(Lista[i].OCantidad), NombreDeLaPrenda: Nombre, 
                PrecioDeLaPrenda: Precio, UrlImagen: Imagen,
                ImagenSeleccionada: Seleccionada, IDColor: Lista[i].OIDColor
            };
            for(let j = 0; j < carrito.length; j++){
                if(carrito[j].ID == Id && carrito[j].Color == Lista[i].OColor && carrito[j].Talle == Lista[i].OTalle){
                    carrito[j].CantidadDePrendas = parseInt(carrito[j].CantidadDePrendas) + parseInt(Lista[i].OCantidad);
                    bandera = false;
                    break;
                }
            }
            if(bandera){
                carrito.push(objetoModelo);
            }
        }
        res.cookie('carrito', carrito,{ httpOnly: true, signed: true, maxAge: 30 * 60 * 1000 }); 
        return res.json({estadoDeSolicitud: 'exitoso', Cantidad: carrito.length});
    }catch(error){
        console.log(error);
        return res.json({estadoDeSolicitud: 'muyMalo', mensajeDeError: error});
    }
}

const VerCarrito = (req, res) =>{
    try{
        let carrito = req.signedCookies.carrito;
        if(carrito == false || carrito == undefined){
            carrito = [];
        }
        console.log(carrito[0]);
        return res.json({estadoDeSolicitud: 'exitoso', Carrito: carrito});
    }catch(error){
        console.log(error);
        return res.json({estadoDeSolicitud: 'muyMalo', mensajeDeError: error});
    }
}

const VaciarCarrito = (req, res) => {
    try{
        res.clearCookie('carrito');
        return res.json({estadoDeSolicitud: 'exitoso'})
    }catch(error){
        return res.json({estadoDeSolicitud: 'muyMalo', mensajeDeError: error});
    }
}

const QuitarDelCarro = (req, res) => {
    try{
        const { Id, Talle, IDColor } = req.body;
        console.log(Id, Talle);
        let carrito = req.signedCookies.carrito;
        for(let i = 0; i<carrito.length; i++){
            if(carrito[i].ID == Id && carrito[i].Talle == Talle && carrito[i].IDColor == IDColor){
                carrito[i].CantidadDePrendas = parseInt(carrito[i].CantidadDePrendas) - 1;
                if(carrito[i].CantidadDePrendas<=0){
                    carrito.splice(i, 1); //El .splice() permite eliminar un elemento desde una posicion en especifica en adelante. El "1" es la cantidad de elementos a eliminar desde esa posición
                    break;
                }
            }
        }
        res.cookie('carrito', carrito,{ httpOnly: true, signed: true, maxAge: 30 * 60 * 1000 }); 
        return res.json({estadoDeSolicitud: 'exitoso', Cantidad: carrito.length});
    } catch(error){
        return res.json({estadoDeSolicitud: 'muyMalo', mensajeDeError: error});
    }
}
const SumarAlCarro = (req, res) => {
    try{
        const { Id, Talle, IDColor } = req.body;
        let carrito = req.signedCookies.carrito;
        for(let i = 0; i<carrito.length; i++){
            if(carrito[i].ID == Id && carrito[i].Talle == Talle && carrito[i].IDColor == IDColor){
                carrito[i].CantidadDePrendas = parseInt(carrito[i].CantidadDePrendas) + 1;
            }
        }
        res.cookie('carrito', carrito,{ httpOnly: true, signed: true, maxAge: 30 * 60 * 1000 }); 
        return res.json({estadoDeSolicitud: 'exitoso', Cantidad: carrito.length});
    }catch(error){
        return res.json({estadoDeSolicitud: 'muyMalo', mensajeDeError: error});
    }
}
const Pedir = (req, res) => {
    try{
        const { Nombre, Direccion, Entrega, Pago } = req.body; 
        const carrito = req.signedCookies.carrito;
        if(carrito == false || carrito == undefined || carrito.length <= 0){
            return res.json({estadoDeSolicitud: 'muyMalo', mensajeDeError: 'No hay prendas seleccionadas'});
        }
        let precio = 0;
        let cantidad = 0;
        let mensaje = `https://wa.me/${process.env.TEL2}?text=Hola%20soy%20${Nombre}%20y%20me%20interesaron%20estas%20prendas%3A`;
        for(let i = 0; i<carrito.length; i++){
            precio += parseInt(carrito[i].PrecioDeLaPrenda)*parseInt(carrito[i].CantidadDePrendas)
            const precioCU = ConseguirFormatoDelPrecio(carrito[i].PrecioDeLaPrenda);
            console.log(carrito[i]);
            const precioSumado = ConseguirFormatoDelPrecio(parseInt(carrito[i].PrecioDeLaPrenda)*parseInt(carrito[i].CantidadDePrendas));
            cantidad += carrito[i].CantidadDePrendas;
            mensaje += '%0A%0A';
            mensaje += `-%20%28%23${carrito[i].ID}%29%20${carrito[i].NombreDeLaPrenda}%2C%0A%20%20%20%20Color%3A%20%23${carrito[i].ID}%2C%0A%20%20%20%20Talle%3A%20${carrito[i].Talle}%2C%0A`;
            mensaje += `%20%20%20%20Cantidad%3A%20${carrito[i].CantidadDePrendas}%2C%0A%20%20%20%20Precio%20por%20c/u%3A%20${precioCU}%2C%0A`;
            mensaje += `%20%20%20%20Precio%20total%3A%20${precioSumado}`;
        }
        const precioConvertido = ConseguirFormatoDelPrecio(precio);
        mensaje += '%0A%0A';
        mensaje +=  `Forma%20de%20pago%3A%20${Pago}.`;
        mensaje += '%0A';
        mensaje +=  `Forma%20de%20entrega%3A%20${Entrega}.`;
        mensaje += '%0A%0A';
        if(Direccion != null || Direccion != undefined){
            mensaje += `Enviar%20mi%20pedido%20a%3A%20${Direccion}.`
            mensaje += '%0A%0A';
            mensaje += `Cantitad%20de%20prendas%3A%20${cantidad}`;
            mensaje += '%0A';
            mensaje += `Total%20a%20pagar%20%28sin%20contar%20el%20envío%29%3A%20${precioConvertido}`;
            mensaje += '%0A%0A';
            mensaje += 'Aguardo%20su%20respuesta%2C%20así%20me%20dice%20el%20costo%20de%20envío%20y%20su%20ALIAS.';
        }else{
            mensaje += `Cantitad%20de%20prendas%3A%20${cantidad}`;
            mensaje += '%0A';
            mensaje += `Total%20a%20pagar%3A%20${precioConvertido}`;
            mensaje += '%0A%0A';
            mensaje += 'Aguardo%20su%20respuesta%2C%20así%20me%20dice%20cuando%20puedo%20ir%20a%20retirar%20mi%20pedido';
        }

        return res.json({estadoDeSolicitud: 'exitoso', URL: mensaje});
    }catch(error){
        return res.json({estadoDeSolicitud: 'muyMalo', mensajeDeError: error});
    }
}
function ConseguirFormatoDelPrecio(precio){
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
export default { AñadirPrendaAlCarrito, VerCarrito, VaciarCarrito, QuitarDelCarro, SumarAlCarro, Pedir };