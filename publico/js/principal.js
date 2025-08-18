document.addEventListener('DOMContentLoaded', function(){
    AñadirEventosPrincipales();
    if(dialog != true && document.getElementById('aviso')){
        document.getElementById('aviso').show();
    }
});

function AñadirEventosPrincipales(){
    AbrirMenu();
    CerrarMenu();
    IrIniciarSesion();
    IrA();
    CerrarMenuDelMensaje();
    SalirDeLaSesion();
    VaciarCarrito();
    IrAPedir();
    MenuPrincipalAdaptable();
    window.dispatchEvent(new Event('resize'));
}
function IrIniciarSesion(){
    if(document.getElementById('imagenIniciarSesion')){
        const botonMiPerfil = document.getElementById('imagenIniciarSesion');
        botonMiPerfil.addEventListener('click', function(){
            window.location.href = `${url}${miPerfil}`
        });
    }
}
function SalirDeLaSesion(){
    if(document.getElementById('imagenSalir')){
        const boton = document.getElementById('imagenSalir');
        boton.addEventListener('click', function(){
            fetch('autenticacion/salir-sesion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(respuesta =>{
                if(!respuesta.ok){
                    throw new Error('Esta habiendo un error al salir');
                }
                return respuesta.json();
            }).then(respuesta =>{
                if(respuesta && respuesta['mensajeDeError']){
                    window.location.href = `${url}/errores?mensaje=${respuesta['mensajeDeError']}`;
                }else{
                    window.location.href = `${url}?mensajeExitoso=Saliste%20de%20la%20sesion%20correctamente!`
                }
            }).catch(error=>{
                windo.location.href = `${url}/errores?mensaje=${error}`
            });
        });
    }
}
function IrA(){
    const titulo = document.getElementById('titulo');
    titulo.addEventListener('click', function(){
        window.location.href= `${url}`;
    });
}
function CerrarMenuDelMensaje(){
    if(document.getElementById('cerrarMenu2')){//verificamos si existe
        const boton = document.getElementById('cerrarMenu2');
        boton.addEventListener('click', function(){
            const dialogo = document.getElementById('aviso');
            dialogo.close();
        });
    }
}
function AbrirMenu(){
    //Para que abrir el dialog
    const botonMenuIzq = document.getElementById('imagenMenuSecundario');
    botonMenuIzq.addEventListener('click', function(){
        const dialogo = document.getElementById('contenedorMenuSecundario');
        const menu = document.getElementById('menuSecundario');
        menu.classList.remove("oculto");
        dialogo.show();
        void menu.offsetWidth;
        menu.classList.add("activo");
    });
    const imagenCarrito = document.getElementById('imagenCarrito');
    imagenCarrito.addEventListener('click', function(){
        const dialog = document.getElementById('carritoDePrendas');
        const menu = document.getElementById('prendasSeleccionadas');
        menu.classList.remove('oculto');
        dialog.show();
        void menu.offsetWidth;
        menu.classList.add("activo");
        ObtenerElementosDelCarro();
    })
    
}
function CerrarMenu(){
    const cerrar = document.getElementById('cerrarMenu');
    cerrar.addEventListener('click', function(){
        const dialogo = document.getElementById('contenedorMenuSecundario');
        //cerrarMenu
        const menu = document.getElementById("menuSecundario");
        menu.classList.remove("activo");
        // Esperamos a que termine la animación antes de ocultar
        setTimeout(() => {
            menu.classList.add("oculto");
            dialogo.close()
        }, 300); // debe coincidir con el tiempo de `transition`
    });
    const boton = document.getElementById('cerrarMenuDelCarrito');
    boton.addEventListener('click', function(){
        const dialogo = document.getElementById('carritoDePrendas');
        const menu = document.getElementById('prendasSeleccionadas');
        menu.classList.remove("activo");
        ;setTimeout(() => {
            menu.classList.add("oculto");
            dialogo.close()
        }, 300);
    });
}
function ObtenerElementosDelCarro(){
    fetch('carrito/ver-carrito')
    .then(respuesta => {
        if(!respuesta.ok){
            throw new Error('Hay un error');
        }
        return respuesta.json();
    }).then(respuesta => {
        const listadoDeMiCarrito = document.getElementById('listadoDeMiCarrito');
        if(!respuesta['Carrito'] || respuesta['Carrito'].length == 0){
            listadoDeMiCarrito.innerHTML = '';
            listadoDeMiCarrito.innerHTML = '<p class="texto-centrado" style="color: var(--color-letra-principal);">Vacio</p>';
        }else{
            listadoDeMiCarrito.innerHTML = '';
        }
        const arreglo = respuesta['Carrito'];
        let precioTotal = 0;
        let cantidadTotal = 0;
        const listaDeID = [];
        const listaTalles = [];
        const listaIDColor = [];
        const detallesCantidadTotal = document.getElementById('detallesCantidadTotal');
        const detallesPrecioTotal = document.getElementById('detallesPrecioTotal');
        detallesCantidadTotal.innerText = cantidadTotal;
        for(let i = 0; i < arreglo.length; i++){
            const precio = ConseguirFormatoDelPrecio(arreglo[i].PrecioDeLaPrenda);
            precioTotal = parseInt(precioTotal) + (parseInt(arreglo[i].PrecioDeLaPrenda) * parseInt(arreglo[i].CantidadDePrendas));
            cantidadTotal += parseInt(arreglo[i].CantidadDePrendas);
            listadoDeMiCarrito.innerHTML += '<li class="items-carrito">'+
            '<article class="contenedor-de-prendas-seleccionadas">'+
                `<img class="imagen-dentro-del-carrito" src="/Imagenes/${arreglo[i].UrlImagen[arreglo[i].ImagenSeleccionada]}">`+
                '<div class="contenedores-del-carrito contenedor-de-los-precios">'+
                    `<p class="detalles-de-las-prendas">${arreglo[i].NombreDeLaPrenda}</p>`+
                    `<p class="detalles-de-las-prendas">${precio}</p>`+
                '</div>'+
                `<div class="color-de-muestra" style="background-color: ${arreglo[i].Color};"></div>`+
                `<p class="detalles-de-las-prendas detalles-del-talle">${arreglo[i].Talle}</p>`+
                `<p class="detalles-de-las-prendas detalle-de-la-cantidad">${arreglo[i].CantidadDePrendas}</p>`+
                '<div class="contenedores-del-carrito contenedor-de-la-cantidad">'+
                    `<button class="botones-del-carrito" id="botonSuma${arreglo[i].ID}${arreglo[i].Talle}${arreglo[i].IDColor}" >+</button>`+
                    `<button class="botones-del-carrito" id="botonResta${arreglo[i].ID}${arreglo[i].Talle}${arreglo[i].IDColor}" >-</button>`+
                '</div>'+
            '</article>'+
            '</li>';
            listaDeID.push(parseInt(arreglo[i].ID));
            listaTalles.push(arreglo[i].Talle);
            listaIDColor.push(arreglo[i].IDColor)
        }
        AgregarEventosDeLosBotonesDelCarrito(arreglo.length, listaDeID, listaTalles, listaIDColor);
        const precioTotalConvertido = ConseguirFormatoDelPrecio(precioTotal);
        detallesPrecioTotal.innerText = precioTotalConvertido;
        detallesCantidadTotal.innerText = cantidadTotal;
    }).catch(error => {
        window.location.href = `${url}/errores?mensaje=${error}`
    });
}
function VaciarCarrito(){
    const vaciarCarrito = document.getElementById('vaciarCarrito');
    vaciarCarrito.addEventListener('click', function(){
        const listadoDeMiCarrito = document.getElementById('listadoDeMiCarrito');
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
        }).catch(error => {
            window.location.href = `${url}/errores?mensaje=${error}`
        });
    })
}
function AgregarEventosDeLosBotonesDelCarrito(limiteDeCiclos, id, talles, listaIDColor){
    for(let i = 0; i < limiteDeCiclos; i++){
        if(document.getElementById(`botonSuma${id[i]}${talles[i]}${listaIDColor[i]}`) && document.getElementById(`botonResta${id[i]}${talles[i]}${listaIDColor[i]}`))
        {
            const botonSuma = document.getElementById(`botonSuma${id[i]}${talles[i]}${listaIDColor[i]}`)
            botonSuma.addEventListener('click', function(){
                fetch('carrito/sumar-al-carrito', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({Id: id[i], Talle: talles[i], IDColor: listaIDColor[i]})
                }).then(respuesta => {
                    if(!respuesta.ok){
                        throw new Error('Hay un error');
                    }
                    return respuesta.json();
                }).then(respuesta => {
                    if(respuesta['estadoDeSolicitud'] && respuesta['estadoDeSolicitud'] == 'exitoso'){
                        const cantidadDePrendasEnElCarrito = document.getElementById('cantidadDePrendasEnElCarrito');
                        cantidadDePrendasEnElCarrito.innerText = respuesta['Cantidad'];
                        ObtenerElementosDelCarro();
                    }else{
                        window.location.href = `${url}/errores?mensaje=${respuesta['mensajeDeError']}`;
                    }
                }).catch(error => {
                    window.location.href = `${url}/errores?mensaje=${error}`;
                })
            })
            const botonResta = document.getElementById(`botonResta${id[i]}${talles[i]}${listaIDColor[i]}`)
            botonResta.addEventListener('click', function(){
                fetch('carrito/quitar-del-carrito', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({Id: id[i], Talle: talles[i], IDColor: listaIDColor[i]})
                }).then(respuesta => {
                    if(!respuesta.ok){
                        throw new Error('Hay un error');
                    }
                    return respuesta.json();
                }).then(respuesta => {
                    if(respuesta['estadoDeSolicitud'] && respuesta['estadoDeSolicitud'] == 'exitoso'){
                        const cantidadDePrendasEnElCarrito = document.getElementById('cantidadDePrendasEnElCarrito');
                        cantidadDePrendasEnElCarrito.innerText = respuesta['Cantidad'];
                        ObtenerElementosDelCarro();
                    }else{
                        window.location.href = `${url}/errores?mensaje=${respuesta['mensajeDeError']}`
                    }
                }).catch(error => {
                    window.location.href = `${url}/errores?mensaje=${error}`
                })
            });
        }
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
function IrAPedir(){
    const botonIrAPedir = document.getElementById('botonIrAPedir');
    botonIrAPedir.addEventListener('click', function(){
        window.location.href = `${url}/previo-whatsApp`;
    })
}
function MenuPrincipalAdaptable(){
    window.addEventListener('resize', function () {
        const ancho = window.innerWidth;
        const menuSecundario = document.getElementById('menuSecundario');
        const listaDelNavegador = document.getElementById('listaDelNavegador');
        const padreDeListaNavegador = document.getElementById('navegador');
        if (ancho <= 1280) {
            if (listaDelNavegador.parentElement !== menuSecundario) {
                menuSecundario.appendChild(listaDelNavegador);
            }
        } else {
            if (listaDelNavegador.parentElement !== padreDeListaNavegador) {
                padreDeListaNavegador.appendChild(listaDelNavegador);
            }
        }
    });
}