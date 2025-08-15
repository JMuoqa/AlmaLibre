document.addEventListener('DOMContentLoaded', function(){
    CargarColores();
    CargarImagenes();
    AñadirPrendaAlCarro();
    CargarDatosPrevios();
})
function CargarImagenes(){
    if(document.getElementById('seleccionImagenes')){
        const medio = document.getElementById('imagen-medio');
        const arriba = document.getElementById('imagen-arriba');
        const abajo = document.getElementById('imagen-abajo');
        const imagenActual = document.getElementById('imagenActual');
        const botonArriba = document.getElementById('botonArriba');
        const botonAbajo = document.getElementById('botonAbajo');
        let anterior = parseInt(imagenSeleccionada) - 1 ;
        let indiceActual = imagenSeleccionada;
        let siguiente = parseInt(imagenSeleccionada) + 1;
        if(anterior<0){
            anterior = listaDeImagenes.length - 1;
        }
        if(siguiente >= listaDeImagenes.length ){
            siguiente = 0;
        }
        imagenActual.src = `/Imagenes/${listaDeImagenes[indiceActual]}`;
        medio.src = `/Imagenes/${listaDeImagenes[imagenSeleccionada]}`;
        arriba.src = `/Imagenes/${listaDeImagenes[anterior]}`;
        abajo.src = `/Imagenes/${listaDeImagenes[siguiente]}`;
        function CambiarImagen(indice, indiceAnterior, indiceSiguiente){
            if (listaDeImagenes.length === 0) return; //Si no hay imagnes cargadas no se miestra nada
            imagenActual.src = `/Imagenes/${listaDeImagenes[indice]}`;
            imagenActual.style.display = 'block';
            medio.src = `/Imagenes/${listaDeImagenes[indice]}`;
            arriba.src = `/Imagenes/${listaDeImagenes[indiceAnterior]}`;
            abajo.src = `/Imagenes/${listaDeImagenes[indiceSiguiente]}`;
        }
        botonArriba.addEventListener('click', function(){
            if (listaDeImagenes.length === 0) return; //Si no hay imagnes cargadas no se miestra nada
            indiceActual = (indiceActual - 1 + listaDeImagenes.length) % listaDeImagenes.length; //permite hacer que el índice "vuelva al final" si estaba en la primera imagen (comportamiento circular)
            anterior = (anterior - 1 + listaDeImagenes.length ) % listaDeImagenes.length;
            siguiente = (siguiente - 1 + listaDeImagenes.length ) % listaDeImagenes.length;
            CambiarImagen(indiceActual, anterior, siguiente);
        });
        botonAbajo.addEventListener('click', () => {
            if (listaDeImagenes.length === 0) return; //Si no hay imagnes cargadas no se miestra nada
            indiceActual = (indiceActual + 1) % listaDeImagenes.length; //Similar al boton anterior pero si esta al final vuelve a la primera
            anterior = (anterior + 1 ) % listaDeImagenes.length;
            siguiente = (siguiente + 1 ) % listaDeImagenes.length;
            CambiarImagen(indiceActual, anterior, siguiente);
        });
    }else{
        const imagenActual = document.getElementById('imagenActual');
        imagenActual.src = `/Imagenes/${listaDeImagenes[0]}`;
    }
}
function AñadirPrendaAlCarro(){
    const añadirAlCarrito = document.getElementById('añadirAlCarrito');
    añadirAlCarrito.addEventListener('click', function(){
        const prenda = document.getElementById('idDeLaPrenda').value; 
        const nombre = document.getElementById('nombreDeLaPrenda').value;
        const precio = document.getElementById('precioDeLaPrenda').value;
        const imagen = listaDeImagenes;
        const seleccionada = document.getElementById('imagenSeleccionadaDeLaPrenda').value;
        const entradasDeCantidades = document.querySelectorAll('.entrada-cantidad-talles');
        const listaDePrendasSeleccionadas = [];
        for(let i = 0; i < entradasDeCantidades.length; i++){
            if(entradasDeCantidades[i].value > 0){
                const datos = entradasDeCantidades[i].id.split('-');
                const color = datos[0];       
                const talle = datos[1];
                const IDColor = datos[2];
                const cantidad = entradasDeCantidades[i].value;
                const objeto = {
                    OColor: color,
                    OIDColor: IDColor,
                    OTalle: talle,
                    OCantidad: cantidad
                }
                listaDePrendasSeleccionadas.push(objeto);  
            }      
        }
        fetch('carrito/sumar-prenda', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Id: prenda, Lista: listaDePrendasSeleccionadas,
                Nombre: nombre, Precio: precio, 
                Imagen: imagen, Seleccionada: seleccionada
            })
        }).then(respuesta => {
            if(!respuesta.ok){
                throw new Error('Hubo un error al intentar sumar una prenda al carrito');
            }
            return respuesta.json();
        }).then(respuesta => {
            if(respuesta && respuesta['mensajeDeError']){
                if(respuesta['estadoDeSolicitud'] == 'muyMalo'){
                    console.log('prueba');
                    window.location.href = `${url}/errores?mensaje=${respuesta['mensajeDeError']}`;
                }
                const p = document.getElementById('textoDeErrores');
                p.innerText = respuesta['mensajeDeError'];
                p.style.color = 'var(--color-rojo)';
                p.style.display = 'inline-block';
            }else{
                const carrito = document.getElementById('cantidadDePrendasEnElCarrito');
                const p = document.getElementById('textoDeErrores');
                p.innerText = `Se añadio un elemento al carrito`;
                p.style.display = 'inline-block';
                p.style.color = 'var(--color-verde)';
                carrito.innerText = respuesta['Cantidad'] ?? 0;
                setTimeout(function(){
                    p.innerText = '';
                    p.style.display = 'none';
                },2500);
            }
        }).catch(error => {
            windo.location.href = `${url}/errores?mensaje=${error}`
        })
    });
}
function CargarColores (){
    const tallesDeReferencia = [{T: 'XS', P: 0}, {T: 'S', P: 1}, {T: 'M', P: 2}, {T: 'L', P: 3}, {T: 'XL', P: 4}, {T: 'XXL', P: 5}];
    let tallesOrdenados = ['','','','','',''];
    let contador = 0;
    for(let i = 0;  i < listaDeColores.length; i++){
        for(let x = 0; x < listaDeTalles.length; x++){
            for(let j = 0; j < tallesDeReferencia.length; j++){
                if(listaDeTalles[x].Talle == tallesDeReferencia[j].T && tallesOrdenados[tallesDeReferencia[j].P] != listaDeTalles[x].Talle){
                    tallesOrdenados[tallesDeReferencia[j].P] = listaDeTalles[x].Talle; 
                    contador++;
                }
            }
        }
    }
    for(let i = 0; i < tallesOrdenados.length; i++){
        if(tallesOrdenados[i] != ''){
            const filaEncabezado = document.getElementById('filaEncabezado');
            filaEncabezado.innerHTML += `<div class="columnas">${tallesOrdenados[i]}</div>`;
        }
    }
    
    for(let i = 0; i < listaDeColores.length; i++){
        const tabla = document.getElementById('tabla');
        tabla.innerHTML += '<div class="fila"></div>';
        const fila = document.querySelectorAll('.fila');
        fila[fila.length-1].innerHTML += `<div class="columnas">${listaDeColores[i].ID}</div>`+
        `<div class="columnas"><div class="contenedor-color"><div class="previa-color" style="background-color:${listaDeColores[i].Color};"></div></div></div>`; 
        for(let j = 0; j < tallesOrdenados.length; j++){
            let bandera = true;
            if(tallesOrdenados[j] != ''){
                for(let x = 0; x < listaDeTalles.length; x++){
                    if(listaDeColores[i].ID == listaDeTalles[x].IDColor && listaDeTalles[x].Talle == tallesOrdenados[j]){
                        fila[fila.length-1].innerHTML += `<div class="columnas"><input class="entrada-cantidad-talles" id="${listaDeColores[i].Color}-${tallesOrdenados[j]}-${listaDeColores[i].ID}" value="0" type="number" min="0"></div>`;
                        bandera = false;
                        break;
                    }
                }
                if(bandera){
                    fila[fila.length-1].innerHTML += `<div class="columnas"><img class="nohay" src="/imagenes_carpeta/DisenoPrincipal/nohay.png"></div>`;
                }
            }
        }
    }
    window.addEventListener("resize", function() {
        if(window.innerWidth > 700){
            const tabla = document.getElementById('tabla');
            const columna1 = 23.65625;
            const columna2 = 70.96875;
            const columna3 = 62.578125;
            const anchoFinal = columna1 + columna2 + (columna3*contador);
            tabla.style = `width: ${anchoFinal}px`;
        }else if(window.innerWidth > 600){
            const tabla = document.getElementById('tabla');
            const columna1 = 18.925;
            const columna2 = 66.2375;
            const columna3 = 57.846875;
            const anchoFinal = columna1 + columna2 + (columna3*contador);
            tabla.style = `width: ${anchoFinal}px`;
        }else if(window.innerWidth > 500){
            const tabla = document.getElementById('tabla');
            const columna1 = 14.19375;
            const columna2 = 61.50625;
            const columna3 = 53.115625;
            const anchoFinal = columna1 + columna2 + (columna3*contador);
            tabla.style = `width: ${anchoFinal}px`;
        }else if(window.innerWidth > 400){
            const tabla = document.getElementById('tabla');
            const columna1 = 14.19375;
            const columna2 = 52.04375;
            const columna3 = 43.653125;
            const anchoFinal = columna1 + columna2 + (columna3*contador);
            tabla.style = `width: ${anchoFinal}px`;
        }   else if(window.innerWidth > 350){
            const tabla = document.getElementById('tabla');
            const columna1 = 14.19375;
            const columna2 = 42.58125;
            const columna3 = 34.190625;
            const anchoFinal = columna1 + columna2 + (columna3*contador);
            tabla.style = `width: ${anchoFinal}px`;
        }else if(window.innerWidth > 200){
            const tabla = document.getElementById('tabla');
            const columna1 = 14.19375;
            const columna2 = 33.11875;
            const columna3 = 24.728125;
            const anchoFinal = columna1 + columna2 + (columna3*contador);
            tabla.style = `width: ${anchoFinal}px`;
        } 
    });
}
function CargarEventosDeLosColores(){
    const divisores = document.querySelectorAll('.caja-de-color');
    for(let i = 0; i<divisores.length; i++){
        divisores[i].addEventListener('click', function(){
            const elemento = document.getElementById('elementoListaDeTalles');
            let html = '';
            for(let j = 0; j< listaDeTalles.length; j++){
                if(listaDeColores[i].ID == listaDeTalles[j].IDColor){
                    html += 
                    '<li class="item-lista-talles">'+
                        `<p class="talle-seccion-ver-prenda">${listaDeTalles[j].Talle}</p>`+
                        `<input type="radio" id="talle${listaDeTalles[j].Talle}${listaDeTalles[j].Cantidad}${listaDeColores[i].Color}" class="checkbutton" value="${listaDeTalles[j].Talle}">`+
                    '</li>'
                }
            }
            elemento.innerHTML = html;
            CargarEventosDeCheckBoxs();
        });
    }
    divisores[0].dispatchEvent(new Event('click'));
}
function SeleccionarCaja(){
    const cajas = document.querySelectorAll('.caja-de-color');
    for(let i = 0; i<cajas.length; i++){
        cajas[i].addEventListener('click', function(){
            cajas[i].classList.add('caja-de-color-seleccionada');
        })    
    }
}
function PedirPorWhatsApp(){
    const boton = document.getElementById('botonPedir');
    boton.addEventListener('click', function(){
        fetch('carrito/vaciar-carrito', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(respuesta => {
            if(!respuesta.ok){
                throw new Error('Hay un error');
            }
            return respuesta.json();
        }).then(respuesta => {
            listadoDeMiCarrito.innerHTML = '<p class="texto-centrado">Vacio</p>';
            const detallesCantidadTotal = document.getElementById('detallesCantidadTotal');
            const detallesPrecioTotal = document.getElementById('detallesPrecioTotal');
            const cantidadDePrendasEnElCarrito = document.getElementById('cantidadDePrendasEnElCarrito');
            cantidadDePrendasEnElCarrito.innerText = 0;
            detallesCantidadTotal.innerText = 0;
            detallesPrecioTotal.innerText = 0;
            const prenda = document.getElementById('idDeLaPrenda').value; 
            const nombre = document.getElementById('nombreDeLaPrenda').value;
            const precio = document.getElementById('precioDeLaPrenda').value;
            const imagen = listaDeImagenes;
            const seleccionada = document.getElementById('imagenSeleccionadaDeLaPrenda').value;
            const cajas = [];
            let talle = '';
            for(let i = 0; i<listaDeTalles.length; i++){
                if(document.getElementById(`talle${listaDeTalles[i].Talle}${listaDeTalles[i].Cantidad}`)){
                    const caja = document.getElementById(`talle${listaDeTalles[i].Talle}${listaDeTalles[i].Cantidad}`);
                    if(caja.checked){
                        talle = listaDeTalles[i];
                    }
                }
            }
            fetch('carrito/sumar-prenda', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Id: prenda, TalleSeleccioando: talle,
                    Nombre: nombre, Precio: precio, 
                    Imagen: imagen, Seleccionada: seleccionada
                })
            }).then(respuesta => {
                if(!respuesta.ok){
                    throw new Error('Hubo un error al intentar sumar una prenda al carrito');
                }
                return respuesta.json();
            }).then(respuesta => {
                if(respuesta && respuesta['mensajeDeError']){
                    if(respuesta['estadoDeSolicitud'] == 'muyMalo'){
                        console.log('prueba');
                        window.location.href = `${url}/errores?mensaje=${respuesta['mensajeDeError']}`;
                    }
                    const p = document.getElementById('textoDeErrores');
                    p.innerText = respuesta['mensajeDeError'];
                    p.style.color = 'var(--color-rojo)';
                    p.style.display = 'inline-block';
                }else{
                    const carrito = document.getElementById('cantidadDePrendasEnElCarrito');
                    const p = document.getElementById('textoDeErrores');
                    p.innerText = `Se añadio un elemento al carrito`;
                    p.style.display = 'inline-block';
                    p.style.color = 'var(--color-verde)';
                    carrito.innerText = respuesta['Cantidad'] ?? 0;
                    window.location.href = `${url}/previo-whatsApp`;
                }
            }).catch(error => {
                windo.location.href = `${url}/errores?mensaje=${error}`
            })
        }).catch(error => {
            window.location.href = `${url}/errores?mensaje=${error}`
        });
    });
}
function CargarDatosPrevios(){
    const entradas = document.querySelectorAll('.entrada-cantidad-talles');
    for(let i = 0; i< entradas.length; i++){
        entradas[i].addEventListener('input',function(){ // El evento input es para saber cuando el usuario agrego/cambio el valor de este, din importar como.
            const textoDePrendas = document.getElementById('PrendasASumar');
            const textoDelPrecio = document.getElementById('precioDePrendasASumar');
            const precioDeLaPrenda = document.getElementById('precioDeLaPrenda');
            let precio = 0;
            let cantidad = 0;
            for(let j = 0; j< entradas.length; j++){
                let valorDeLaEntrada = entradas[j].value;
                if(valorDeLaEntrada == false || valorDeLaEntrada == null || valorDeLaEntrada == undefined || valorDeLaEntrada == '' ){
                    valorDeLaEntrada = 0;
                }
                cantidad += parseInt(valorDeLaEntrada);
                precio = parseInt(precioDeLaPrenda.value * cantidad);
            }

            textoDePrendas.innerText = cantidad;
            textoDelPrecio.innerText = ConseguirFormatoDelPrecioOriginal(precio);
        });
        entradas[i].addEventListener('focus', function() {
            this.select();
        });
    }

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