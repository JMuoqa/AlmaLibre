document.addEventListener('DOMContentLoaded', async function(){
    ActivacionDeLasCajas();
    EventosDeLasCajas();
    VerificarDescuento();
    CambiarOpcionDeDescuento();
    await MostrarGaleriaDeImagenes();
    RealizarBusqueda();
    BorrarDatos();
    CambiarDatos();
    CambiarImagenes();
    GuardarColores();
});
function ActivacionDeLasCajas(){
    const cajaUno = document.getElementById('entradaNombre');
    const cajaDos = document.getElementById('entradaId');
    const cajaTres = document.getElementById('entradaTipo');
    if(cajaUno.checked){
        cajaDos.checked = false;
        cajaTres.checked = false;
    }else if(cajaDos.checked){
        cajaUno.checked = false;
        cajaTres.checked = false;
    }else if(cajaTres.checked){
        cajaUno.checked = false;
        cajaDos.checked = false;
    }else{
        cajaUno.checked = true;
        cajaDos.checked = false;
        cajaTres.checked = false;
    }
}
function EventosDeLasCajas(){
    const cajaUno = document.getElementById('entradaNombre');
    const cajaDos = document.getElementById('entradaId');
    const cajaTres = document.getElementById('entradaTipo');
    cajaUno.addEventListener('change', function(){
            cajaUno.checked = true;
            cajaDos.checked = false;
            cajaTres.checked = false;
    });
    cajaDos.addEventListener('change', function(){
            cajaUno.checked = false;
            cajaDos.checked = true;
            cajaTres.checked = false;
    });
    
    cajaTres.addEventListener('change', function(){
            cajaUno.checked = false;
            cajaDos.checked = false;
            cajaTres.checked = true;
    })
}
function RealizarBusqueda(){
    const form = document.getElementById('formularioBusqueda');
    form.addEventListener('submit', function(event){
        event.preventDefault();
        const nombre = document.getElementById('entradaNombre');
        const id = document.getElementById('entradaId');
        const tipo = document.getElementById('entradaTipo');
        const valor = document.getElementById('entradaBusqueda').value;
        let indicacion = 'Nombre';
        const lista = [nombre,id,tipo];
        for(let i = 0; i<lista.length;i++){
            if(lista[i].checked){
                indicacion = lista[i].value;
                break;
            }
        }
        fetch(`administracion/buscar?indicacion=${indicacion}&valor=${valor}`)
        .then(respuesta =>{
            if(!respuesta.ok){
                throw new Error('Hubo un error en la respuesta');
            }
            return respuesta.json();
        }).then(respuesta => {
            const contenedor = document.getElementById('contenedorProductos');
            contenedor.innerHTML = '';
            for(let i = 0; i<respuesta['Ropa'].length; i++){
                let html = '';
                html += `<article class="contenedor-producto" id="contenedorProducto${respuesta['Ropa'][i].id}">`;
                html += `<img src="/Imagenes/${respuesta['Ropa'][i].Imagen[respuesta['Ropa'][i].ImagenSeleccionada]}" class="imagen-producto" alt="${respuesta['Ropa'][i].Nombre}" loading="lazy"> `;
                let fechaActual = new Date();
                let fechaRegistrada = new Date(respuesta['Ropa'][i].Publicacion)
                let dias = Math.floor((fechaActual - fechaRegistrada)/(1000*60*60*24));
                if(dias<=15){
                    html += `<p class="estado-ropa">Nuevo</p>`
                }
                html += `<h3 class="titulo-producto">${respuesta['Ropa'][i].Nombre}</h3>`;
                let precioFinal = respuesta['Ropa'][i].Precio;
                precioFinal = precioFinal- (precioFinal * respuesta['Ropa'][i].Descuento) / 100;
                const arregloDeNumeros = precioFinal.toString().split('');
                const arregloAux = [];
                for(let i = arregloDeNumeros.length-1; i>=0; i--){
                    let largoDelArreglo = arregloDeNumeros.length-1;
                    let controlador = largoDelArreglo - i;
                    if(controlador%3==0 && i!= arregloDeNumeros.length-1){
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
                html += `<p class="precio-producto">${cadenaDeTexto}</p>`;
                html += `<input type="hidden" name="_ID" value="${respuesta['Ropa'][i].id}">`;
                html += `<strong class="texto-centrado texto-editar">Editar prenda</strong>`
                html += `</article>`;
                contenedor.innerHTML += html;
            }
            CargarDatosAlFormularioDeEdicion(respuesta['Ropa']);
        }).catch(error=>{
            window.location.href = `${url}/errores?mensaje=${error}`
        })
    });
}
function GuardarColores(){
    const boton = document.getElementById('botonGuardar');
    boton.addEventListener('click', function(){
        const contenedor = document.getElementById('conjuntoCompletoDetallesNuevos');
        if(contenedor.innerHTML != ''){
            const entradaColores = document.getElementsByName('ColoresNuevos');
            const entradaTalles = document.getElementsByName('TallesNuevos');
            const entradaCantidades = document.getElementsByName('CantidadesNuevas');
            const entradaOculta = document.getElementById('entradaOculta');
            const colores = [];
            const talles = [];
            const cantidades = [];
            for(let i = 0; i< entradaColores.length; i++){
                colores.push(entradaColores[i].value);
                talles.push(entradaTalles[i].value);
                cantidades.push(entradaCantidades[i].value);
            }
            const idPrenda = document.getElementById('entradaOculta').value;
            const datos = {
                ColoresNuevos: colores, TallesNuevos: talles, CantidadesNuevas: cantidades, 
                IDPrenda: idPrenda
            };
            fetch('administracion/guardar-colores', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos)
            }).then(respuesta =>{
                if(!respuesta.ok){
                    throw new Error('Hubo un error en la respuesta');
                }
                return respuesta.json();
            }).then(respuesta=>{
                if(respuesta && respuesta['mensajeDeError']){
                    if(respuesta['estadoDeSolicitud'] == 'muyMalo'){
                        window.location.href = `${url}/errores?mensaje=${respuesta['mensajeDeError']}`
                    }
                    const p = document.getElementById('mensajeError');
                    p.innerText = respuesta['mensajeDeError'];
                    p.style.display = 'inline-block';
                    p.style.color = 'var(--color-rojo)';
                }else{
                    window.location.href = `${url}/buscar-y-editar`;
                }
            }).catch(error=>{
                window.location.href = `${url}/errores?mensaje=${error}`
            });
        }else{

        }
    });
}
function CambiarDatos(){
    const cambiarNombre = document.getElementById('cambiarNombre');
    cambiarNombre.addEventListener('click', function(){
        const entrada = document.getElementById('entradaDelNombre');
        const entradaOculta = document.getElementById('entradaOculta');
        fetch('administracion/cambiar-dato', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({Dato: entrada.value, Columna: 'Nombre', ID: entradaOculta.value})
        }).then(respuesta=>{
            if(!respuesta.ok){
                throw new Error('Se produjo un error en la respuesta');
            }
            return respuesta.json();
        }).then(respuesta=>{
            if(respuesta && respuesta['mensajeDeError']){
                if(respuesta['estadoDeSolicitud'] == 'muyMalo'){
                    window.location.href = `${url}/errores?mensaje=${respuesta['mensajeDeError']}`
                }
                const p = document.getElementById('mensajeError');
                p.innerText = respuesta['mensajeDeError'];
                p.style.display = 'inline-block';
                p.style.color = 'var(--color-rojo)';
            }else{
                const mensaje = 'Se cambio el NOMBRE correctamente';
                PostEdicionExitosa(entradaOculta.value, mensaje);
            }
        }).catch(error=>{
            window.location.href = `${url}/errores?mensaje=${error}`
        })
    });
    const cambiarPrecio = document.getElementById('cambiarPrecio');
    cambiarPrecio.addEventListener('click', function(){
        const entrada = document.getElementById('entradaDelPrecio');
        const entradaOculta = document.getElementById('entradaOculta');
        fetch('administracion/cambiar-dato', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({Dato: entrada.value, Columna: 'Precio', ID: entradaOculta.value})
        }).then(respuesta=>{
            if(!respuesta.ok){
                throw new Error('Se produjo un error en la respuesta');
            }
            return respuesta.json();
        }).then(respuesta=>{
            if(respuesta && respuesta['mensajeDeError']){
                if(respuesta['estadoDeSolicitud'] == 'muyMalo'){
                    window.location.href = `${url}/errores?mensaje=${respuesta['mensajeDeError']}`
                }
                const p = document.getElementById('mensajeError');
                p.innerText = respuesta['mensajeDeError'];
                p.style.display = 'inline-block';
                p.style.color = 'var(--color-rojo)';
            }else{
                const mensaje = 'Se cambio el PRECIO correctamente';
                PostEdicionExitosa(entradaOculta.value, mensaje);
            }
        }).catch(error=>{
            window.location.href = `${url}/errores?mensaje=${error}`
        })
    });
    const cambiarTipo = document.getElementById('cambiarTipo');
    cambiarTipo.addEventListener('click', function(){
        const entrada = document.getElementById('entradaDeTipo');
        const entradaOculta = document.getElementById('entradaOculta');
        fetch('administracion/cambiar-dato', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({Dato: entrada.value, Columna: 'Tipo', ID: entradaOculta.value})
        }).then(respuesta=>{
            if(!respuesta.ok){
                throw new Error('Se produjo un error en la respuesta');
            }
            return respuesta.json();
        }).then(respuesta=>{
            if(respuesta && respuesta['mensajeDeError']){
                if(respuesta['estadoDeSolicitud'] == 'muyMalo'){
                    window.location.href = `${url}/errores?mensaje=${respuesta['mensajeDeError']}`
                }
                const p = document.getElementById('mensajeError');
                p.innerText = respuesta['mensajeDeError'];
                p.style.display = 'inline-block';
                p.style.color = 'var(--color-rojo)';
            }else{
                const mensaje = 'Se cambio el TIPO de prenda correctamente';
                PostEdicionExitosa(entradaOculta.value, mensaje);
            }
        }).catch(error=>{
            window.location.href = `${url}/errores?mensaje=${error}`
        })
    });
    const cambiarGenero = document.getElementById('cambiarGenero');
    cambiarGenero.addEventListener('click', function(){
        const entrada = document.getElementById('entradaDeGenero');
        const entradaOculta = document.getElementById('entradaOculta');
        fetch('administracion/cambiar-dato', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({Dato: entrada.value, Columna: 'Genero', ID: entradaOculta.value})
        }).then(respuesta=>{
            if(!respuesta.ok){
                throw new Error('Se produjo un error en la respuesta');
            }
            return respuesta.json();
        }).then(respuesta=>{
            if(respuesta && respuesta['mensajeDeError']){
                if(respuesta['estadoDeSolicitud'] == 'muyMalo'){
                    window.location.href = `${url}/errores?mensaje=${respuesta['mensajeDeError']}`
                }
                const p = document.getElementById('mensajeError');
                p.innerText = respuesta['mensajeDeError'];
                p.style.display = 'inline-block';
                p.style.color = 'var(--color-rojo)';
            }else{
                const mensaje = 'Se cambio el GENERO correctamente';
                PostEdicionExitosa(entradaOculta.value, mensaje);
            }
        }).catch(error=>{
            window.location.href = `${url}/errores?mensaje=${error}`
        })
    });
    const cambiarDescuento = document.getElementById('cambiarDescuento');
    cambiarDescuento.addEventListener('click', function(){
        const entrada = document.getElementById('entradaDelDescuento');
        const entradaOculta = document.getElementById('entradaOculta');
        fetch('administracion/cambiar-dato', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({Dato: entrada.value, Columna: 'Descuento', ID: entradaOculta.value})
        }).then(respuesta=>{
            if(!respuesta.ok){
                throw new Error('Se produjo un error en la respuesta');
            }
            return respuesta.json();
        }).then(respuesta=>{
            if(respuesta && respuesta['mensajeDeError']){
                if(respuesta['estadoDeSolicitud'] == 'muyMalo'){
                    window.location.href = `${url}/errores?mensaje=${respuesta['mensajeDeError']}`
                }
                const p = document.getElementById('mensajeError');
                p.innerText = respuesta['mensajeDeError'];
                p.style.display = 'inline-block';
                p.style.color = 'var(--color-rojo)';
            }else{
                const mensaje = 'Se cambio el DESCUENTO correctamente';
                PostEdicionExitosa(entradaOculta.value, mensaje);
            }
        }).catch(error=>{
            window.location.href = `${url}/errores?mensaje=${error}`
        })
    });
    const cambiarImagenSeleccionada = document.getElementById('cambiarImagenSeleccionada');
    cambiarImagenSeleccionada.addEventListener('click', function(){
        const entrada = document.getElementById('imagenSeleccionadaActual');
        const entradaOculta = document.getElementById('entradaOculta');
        fetch('administracion/cambiar-dato', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({Dato: entrada.value, Columna: 'ImagenSeleccionada', ID: entradaOculta.value})
        }).then(respuesta=>{
            if(!respuesta.ok){
                throw new Error('Se produjo un error en la respuesta');
            }
            return respuesta.json();
        }).then(respuesta=>{
            if(respuesta && respuesta['mensajeDeError']){
                if(respuesta['estadoDeSolicitud'] == 'muyMalo'){
                    window.location.href = `${url}/errores?mensaje=${respuesta['mensajeDeError']}`
                }
                const p = document.getElementById('mensajeError');
                p.innerText = respuesta['mensajeDeError'];
                p.style.display = 'inline-block';
                p.style.color = 'var(--color-rojo)';
            }else{
                const mensaje = 'Se cambio la IMAGEN PRINCIPAL correctamente';
                PostEdicionExitosa(entradaOculta.value, mensaje);
            }
        }).catch(error=>{
            window.location.href = `${url}/errores?mensaje=${error}`
        })
    })
    const botonMostrar = document.getElementById('botonMostrar');
    botonMostrar.addEventListener('click', function(){
        const entrada = document.getElementById('entradaMostrar');
        const entradaOculta = document.getElementById('entradaOculta');
        fetch('administracion/cambiar-estado-mostrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({Dato: entrada.value, ID: entradaOculta.value})
        }).then(respuesta=>{
            if(!respuesta.ok){
                throw new Error('Se produjo un error en la respuesta');
            }
            return respuesta.json();
        }).then(respuesta=>{
            if(respuesta && respuesta['mensajeDeError']){
                if(respuesta['estadoDeSolicitud'] == 'muyMalo'){
                    window.location.href = `${url}/errores?mensaje=${respuesta['mensajeDeError']}`
                }
                const p = document.getElementById('mensajeError');
                p.innerText = respuesta['mensajeDeError'];
                p.style.display = 'inline-block';
                p.style.color = 'var(--color-rojo)';
            }else{
                const mensaje = 'Se modifico el ESTADO de MOSTRAR correctamente';
                PostEdicionExitosa(entradaOculta.value, mensaje);
            }
        }).catch(error=>{
            window.location.href = `${url}/errores?mensaje=${error}`
        })
    })
    const botonDescripcion = document.getElementById('cambiarDescripcion')
    botonDescripcion.addEventListener('click', function(){
        const entrada = document.getElementById('entradaDescripcion')
        const entradaOculta = document.getElementById('entradaOculta');
        console.log('EVENTO');
        fetch('administracion/cambiar-dato', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({Dato: entrada.value, Columna: 'Descripcion', ID: entradaOculta.value})
        }).then(respuesta=>{
            if(!respuesta.ok){
                throw new Error('Se produjo un error en la respuesta');
            }
            return respuesta.json();
        }).then(respuesta=>{
            if(respuesta && respuesta['mensajeDeError']){
                if(respuesta['estadoDeSolicitud'] == 'muyMalo'){
                    window.location.href = `${url}/errores?mensaje=${respuesta['mensajeDeError']}`
                }
                const p = document.getElementById('mensajeError');
                p.innerText = respuesta['mensajeDeError'];
                p.style.display = 'inline-block';
                p.style.color = 'var(--color-rojo)';
            }else{
                const mensaje = 'Se cambio la DESCRIPCION correctamente';
                PostEdicionExitosa(entradaOculta.value, mensaje);
            }
        }).catch(error=>{
            window.location.href = `${url}/errores?mensaje=${error}`
        })
    })
}
function CambiarCantidad(){
    const botones = document.querySelectorAll('.boton-cambiar-cantidad');
    for(let i = 0; i < botones.length; i++){
        botones[i].addEventListener('click', function(){
            const _IDPrenda = document.getElementById('entradaOculta').value;
            const entradaDeCantidad = document.querySelectorAll('.entrada-cantidad');
            const talle = document.querySelectorAll('.entrada-talles');
            fetch('administracion/cambiar-cantidad', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({IDPrenda: _IDPrenda, Cantidad: entradaDeCantidad[i].value, Talle: talle[i].value})
            }).then(respuesta=>{
                if(!respuesta.ok){
                    throw new Error('Se produjo un error en la respuesta');
                }
                return respuesta.json();
            }).then(respuesta=>{
                if(respuesta && respuesta['mensajeDeError']){
                    if(respuesta['estadoDeSolicitud'] == 'muyMalo'){
                        window.location.href = `${url}/errores?mensaje=${respuesta['mensajeDeError']}`
                    }
                    const p = document.getElementById('mensajeError');
                    p.innerText = respuesta['mensajeDeError'];
                    p.style.display = 'inline-block';
                    p.style.color = 'var(--color-rojo)';
                }else{
                    const mensaje = 'Se cambio la cantidad del talle ' + botones[i].value + ' correctamente';
                    PostEdicionExitosa(entradaOculta.value, mensaje);
                }
        }).catch(error=>{
            //window.location.href = `${url}/errores?mensaje=${error}`
            console.log(error)
        })
        });
    }
}
function PostEdicionExitosa(IdEditado, mensaje){
    const form = document.getElementById('formularioBusqueda');
    const id = document.getElementById('entradaId');
    const valor = document.getElementById('entradaBusqueda')
    valor.value = IdEditado;
    if(!id.checked){
        id.dispatchEvent(new Event('change'));
    }
    form.dispatchEvent(new Event('submit'));
    setTimeout(function(){
        window.location.href = `${url}/buscar-y-editar`;
    },2000)
    const p = document.getElementById('mensajeError');
    p.innerText = mensaje;
    p.style.color = 'var(--color-verde)';
}
function CambiarImagenes(){
    const cambiarImagen = document.getElementById('cambiarImagen');
    cambiarImagen.addEventListener('click', function(){
        const entradaImagenes = document.getElementById('entradaImagenes');
        const entradaOculta = document.getElementById('entradaOculta');
        const imagenSeleccionada = document.getElementById('imagenSeleccionada').value;
        const formData = new FormData();
        const archivos = entradaImagenes.files;
        for (let i = 0; i < archivos.length; i++) {
            formData.append('Imagenes', archivos[i]); 
        }
        formData.append('Id', entradaOculta.value)
        formData.append('ImagenSeleccionada', imagenSeleccionada);
        fetch('administracion/cambiar-imagenes',{
            method: 'POST',
            body: formData
        }).then(respuesta=>{
            if(!respuesta.ok){
                throw new Error('Se produjo un error en la respuesta');
            }
            return respuesta.json();
        }).then(respuesta=>{
            if(respuesta && respuesta['mensajeDeError']){
                if(respuesta['estadoDeSolicitud'] == 'muyMalo'){
                    window.location.href = `${url}/errores?mensaje=${respuesta['mensajeDeError']}`
                }
                const p = document.getElementById('mensajeError');
                p.innerText = respuesta['mensajeDeError'];
                p.style.display = 'inline-block';
                p.style.color = 'var(--color-rojo)';
            }else{
                window.location.href = `${url}/buscar-y-editar?mensajeExitoso=Se%20realizo%20el%20cambio%20correctamente!`
            }
        }).catch(error=>{
            window.location.href = `${url}/errores?mensaje=${error}`
        })
    })
}
function CargarDatosAlFormularioDeEdicion(arreglo){
    const imagenes = document.getElementById('imagenesActualesRopa');
    const btnAnterior = document.getElementById('btnAnteriorImgActuales');
    const btnSiguiente = document.getElementById('btnSiguienteImgActuales');
    const imagenSeleccionada = document.getElementById('imagenSeleccionadaActual');
    let nombresDeImagenes = [];
    let indiceActual = 0;
    for(let i = 0; i<arreglo.length; i++){
        const elemento = document.getElementById(`contenedorProducto${arreglo[i].id}`);
        elemento.addEventListener('click', function(){
            const idDeLaPrenda = arreglo[i].id;
            fetch(`administracion/obtener-talles-colores?id=${idDeLaPrenda}`)
            .then(respuesta =>{
                if(!respuesta.ok){
                    throw new Error('Hubo un error en la respuesta');
                }
                return respuesta.json();
            }).then(respuesta => {
                let talles = respuesta['Talles'];
                let colores = respuesta['Colores'];
                const etiqueta = document.getElementById('idDeLaPrenda');
                const nombre = document.getElementById('entradaDelNombre');
                const precio = document.getElementById('entradaDelPrecio');
                const tipo = document.getElementById('entradaDeTipo');
                const genero = document.getElementById('entradaDeGenero');
                const oculto = document.getElementById('entradaOculta');
                const mostrar = document.getElementById('entradaMostrar');
                const descripcion = document.getElementById('entradaDescripcion')
                const entradaDeCantidadDeTalles = [
                    document.getElementById('entradaDeCantidadXS'), document.getElementById('entradaDeCantidadS'), document.getElementById('entradaDeCantidadM'),
                    document.getElementById('entradaDeCantidadL'), document.getElementById('entradaDeCantidadXL'), document.getElementById('entradaDeCantidadXXL'),
                ];
                const promo = document.getElementById('entradaDePromocion');
                const descuento = document.getElementById('entradaDelDescuento');
                const contenedor = document.getElementById('conjuntoCompletoDetalles');
                const contenedorNuevo = document.getElementById('conjuntoCompletoDetallesNuevos');
                resetearValores(etiqueta, nombre, precio, tipo, genero, entradaDeCantidadDeTalles, promo, descuento, oculto, imagenSeleccionada, contenedor, contenedorNuevo, oculto, descripcion);
                for(let j = 0; j < colores.length; j++){
                    InsertarClasesExistentes(colores[j], talles);
                    if(j == colores.length-1){
                        console.log(i, 'Repetido')
                        CargarClaseNueva();
                        CambiarCantidad();
                    }
                }
                if(arreglo[i].Descuento>0){
                    promo.checked = true;
                    promo.dispatchEvent(new Event('change'));
                    descuento.value = arreglo[i].Descuento;
                }
                mostrar.value = arreglo[i].Mostrar;
                console.log(arreglo[i].Descripcion);
                console.log(arreglo[i]);
                descripcion.value = arreglo[i].Descripcion;
                imagenSeleccionada.value = arreglo[i].ImagenSeleccionada;
                oculto.value = arreglo[i].id;
                const tallesSelecciondos = arreglo[i].Talles;
                etiqueta.innerText = arreglo[i].id;
                nombre.value = arreglo[i].Nombre;
                precio.value = arreglo[i].Precio;
                nombresDeImagenes = arreglo[i].Imagen;
                mostrarImagen(arreglo[i].ImagenSeleccionada);
                for(let j = 0; j< tipo.options.length; j++){
                    if(arreglo[i].Tipo == tipo.options[j].text){
                        tipo.selectedIndex = j;
                        break;
                    }
                }
                for(let j = 0; j< genero.options.length; j++){
                    if(arreglo[i].Genero == genero.options[j].text){
                        genero.selectedIndex = j;
                        break;
                    }
                }
                for(let j = 0; j<tallesSelecciondos.length; j++){
                    for(let x = 0; x< talles.length; x++){
                        if(tallesSelecciondos[j] == talles[x].value){
                            talles[x].checked = true;
                        }
                    }
                }
                window.location.href = '#etiquetaDePrendaSeleccionada';
            }).catch(error => {
                window.location.href = `${url}/errores?mensaje=${error}`
                console.log(error)
            })
            
        });
    }
    function mostrarImagen(indice) {
        if (nombresDeImagenes.length === 0) return; //Si no hay imagnes cargadas no se miestra nada
        imagenSeleccionada.value = indice;
        imagenes.src = `/Imagenes/${nombresDeImagenes[indice]}`;
        imagenes.style.display = 'block';
    }
    btnAnterior.addEventListener('click', () => {
        if (nombresDeImagenes.length === 0) return; //Si no hay imagnes cargadas no se miestra nada
        indiceActual = (indiceActual - 1 + nombresDeImagenes.length) % nombresDeImagenes.length; //permite hacer que el índice "vuelva al final" si estaba en la primera imagen (comportamiento circular)
        mostrarImagen(indiceActual);
    });
    btnSiguiente.addEventListener('click', () => {
        if (nombresDeImagenes.length === 0) return; //Si no hay imagnes cargadas no se miestra nada
        indiceActual = (indiceActual + 1) % nombresDeImagenes.length; //Similar al boton anterior pero si esta al final vuelve a la primera
        mostrarImagen(indiceActual);
    });
}
function CopiarColoresExistentes(){
    const botones = document.querySelectorAll('.boton-copiar-color');
    for(let i = 0; i<botones.length; i++){
        botones[i].addEventListener('click', function(){
            const entradasColores = document.querySelectorAll('.color');
            const color = entradasColores[i].value;
            InsertarClaseNueva(color);
            const contenedor = document.getElementById('conjuntoCompletoDetallesNuevos');
            if(contenedor.innerHTML != ''){
                const p = document.getElementById('mensajeAgregarColor');
                p.innerText = '¡Tenes que guardar los cambios!';
                p.style = 'display: block';
            }
        });
    }
}
function CopiarColoresNuevos(){
    const botones = document.querySelectorAll('.boton-copiar-color-nuevos');
    for(let i = 0; i<botones.length; i++){
        botones[i].addEventListener('click', function(){
            const entradasColores = document.querySelectorAll('.color-nuevo');
            const color = entradasColores[i].value;
            InsertarClaseNueva(color);
            const contenedor = document.getElementById('conjuntoCompletoDetallesNuevos');
            if(contenedor.innerHTML != ''){
                const p = document.getElementById('mensajeAgregarColor');
                p.innerText = '¡Tenes que guardar los cambios!';
                p.style = 'display: block';
            }
        });
    }
}
function InsertarClasesExistentes(color, talles){
    for(let z = 0; z<talles.length; z++){
        if(color.ID == talles[z].IDColor){
            const contenedor = document.getElementById('conjuntoCompletoDetalles');
            let id = 0; 
            if(document.querySelectorAll('color').length){
                id = document.querySelectorAll('color').length;
            }else{
                id = 1;
            }
            let nuevoColor = color.Color ?? '#000000';
            let guardarTalle = talles[z].Talle ?? 'XS';
            const valoresColor = document.querySelectorAll('.color') ?? [];
            const valoresCantidad = document.querySelectorAll('.entrada-cantidad') ?? [];
            const valoresTalles = document.querySelectorAll('.entrada-talles');
            contenedor.innerHTML += 
            '<article class="conjunto-entradas-detalles">'+
                `<input type="color" class="color" name="Color" onmousedown="return false;" value="${nuevoColor}">`+
                '<select class="entrada entrada-talles" name="Talle" disabled>'+
                    '<option class="opciones-de-talles">XS</option>'+
                    '<option class="opciones-de-talles">S</option> '+
                    '<option class="opciones-de-talles">M</option> '+
                    '<option class="opciones-de-talles">L</option> '+
                    '<option class="opciones-de-talles">XL</option> '+
                    '<option class="opciones-de-talles">XXL</option> '+
                '</select>'+
                `<input class="entrada entrada-cantidad" type="number" value="${talles[z].Cantidad}" name="Cantidad" min="0" required>`+
                `<button class="boton-cambiar-cantidad" type="button">C/Cantidad</button>`+
                `<button class="boton-copiar-color" type="button">Color</button>`+
            '</article>';
            const entradasColores = document.querySelectorAll('.color') ?? [];
            const entradasCantidad = document.querySelectorAll('.entrada-cantidad') ?? [];
            const entradasTalles = document.querySelectorAll('.entrada-talles') ?? [];
            for(let i = 0; i<valoresColor.length; i++){
                entradasColores[i].value = valoresColor[i].value;
                entradasCantidad[i].value = valoresCantidad[i].value;
                entradasTalles[i].value = valoresTalles[i].value;
            };
            const cantidadDeEntradasTalles = document.querySelectorAll('.entrada-talles');
            const entradaTalles = cantidadDeEntradasTalles[cantidadDeEntradasTalles.length-1];
            for(let i = 0; i < entradaTalles.options.length; i++){
                if(guardarTalle == entradaTalles.options[i].value ){
                    entradaTalles.selectedIndex = i; // deja seleccionada la opción
                    break;
                }
            }
            CopiarColoresExistentes();
        }
    }
}
function CargarClaseNueva(){
    const boton = document.getElementById('agregarClaseDePrenda');
    boton.addEventListener('click', function(){
        InsertarClaseNueva();
        const contenedor = document.getElementById('conjuntoCompletoDetallesNuevos');
        if(contenedor.innerHTML != ''){
            const p = document.getElementById('mensajeAgregarColor');
            p.innerText = '¡Tenes que guardar los cambios!';
            p.style = 'display: block';
        }
    });
}
function InsertarClaseNueva(color, talle){
    const contenedor = document.getElementById('conjuntoCompletoDetallesNuevos');
    let id = 0; 
    if(document.querySelectorAll('color').length){
        id = document.querySelectorAll('color').length;
    }else{
        id = 1;
    }
    let nuevoColor = color ?? '#000000';
    let guardarTalle = 'XS';
    const valoresColor = document.querySelectorAll('.color-nuevo') ?? [];
    const valoresCantidad = document.querySelectorAll('.entrada-cantidad-nuevo') ?? [];
    const valoresTalles = document.querySelectorAll('.entrada-talles-nuevos') ?? [];
    contenedor.innerHTML += 
    '<article class="conjunto-entradas-detalles">'+
        `<input type="color" class="color color-nuevo" name="ColoresNuevos" value="${nuevoColor}" readonly>`+
        '<select class="entrada entrada-talles-nuevos" name="TallesNuevos">'+
            '<option class="opciones-de-talles">XS</option>'+
            '<option class="opciones-de-talles">S</option> '+
            '<option class="opciones-de-talles">M</option> '+
            '<option class="opciones-de-talles">L</option> '+
            '<option class="opciones-de-talles">XL</option> '+
            '<option class="opciones-de-talles">XXL</option> '+
        '</select>'+
        '<input class="entrada entrada-cantidad-nuevo" type="number" value="1" name="CantidadesNuevas" min="0" step="1" required>'+
        `<button class="boton-detalles boton-detalles-nuevos" id="botonDetalles${id}" type="button">Quitar</button>`+
        `<button class="boton-copiar-color boton-copiar-color-nuevos" type="button">Color</button>`+
    '</article>';
    const entradasColores = document.querySelectorAll('.color-nuevo');
    const entradasCantidad = document.querySelectorAll('.entrada-cantidad-nuevo') ?? [];
    const entradasTalles = document.querySelectorAll('.entrada-talles-nuevos');
    for(let i = 0; i<valoresColor.length; i++){
        entradasColores[i].value = valoresColor[i].value;
        entradasCantidad[i].value = valoresCantidad[i].value;
        entradasTalles[i].value = valoresTalles[i].value;
    };
    const cantidadDeEntradasTalles = document.querySelectorAll('.entrada-talles-nuevos');
    const entradaTalles = cantidadDeEntradasTalles[cantidadDeEntradasTalles.length-1];
    for(let i = 0; i < entradaTalles.options.length; i++){
        if(guardarTalle == entradaTalles.options[i].value ){
            entradaTalles.selectedIndex = i; // deja seleccionada la opción
            break;
        }
    }
    QuitarClase();
    CopiarColoresNuevos();
}
function QuitarClase(){
    document.querySelectorAll('.boton-detalles-nuevos').forEach(boton => {
        boton.addEventListener('click', () => {
            boton.parentElement.remove();
            const contenedor = document.getElementById('conjuntoCompletoDetallesNuevos');
            if(contenedor.innerHTML == ''){
                const p = document.getElementById('mensajeAgregarColor');
                p.innerText = '';
                p.style = 'display: none';
            }
        });
    });
}
function BorrarDatos(){
    const cancelar = document.getElementById('botonCancelar');
    cancelar.addEventListener('click', function(){
        const etiqueta = document.getElementById('idDeLaPrenda');
        const nombre = document.getElementById('entradaDelNombre');
        const precio = document.getElementById('entradaDelPrecio');
        const tipo = document.getElementById('entradaDeTipo');
        const genero = document.getElementById('entradaDeGenero');
        const entradaDeCantidadDeTalles = [
                document.getElementById('entradaDeCantidadXS'), document.getElementById('entradaDeCantidadS'), document.getElementById('entradaDeCantidadM'),
                document.getElementById('entradaDeCantidadL'), document.getElementById('entradaDeCantidadXL'), document.getElementById('entradaDeCantidadXXL'),
            ];
        const imagenSeleccionada = document.getElementById('imagenSeleccionadaActual');
        const promo = document.getElementById('entradaDePromocion');
        const descuento = document.getElementById('entradaDelDescuento');
        const oculto = document.getElementById('entradaOculta');
        const imagenes = document.getElementById('imagenesActualesRopa');
        const contenedor = document.getElementById('conjuntoCompletoDetalles');
        const contenedorNuevo = document.getElementById('conjuntoCompletoDetallesNuevos');
        const descripcion = document.getElementById('entradaDescripcion')
        imagenes.src = ``;
        imagenes.style.display = 'none';
        resetearValores(etiqueta, nombre, precio, tipo, genero, entradaDeCantidadDeTalles, promo, descuento, oculto, imagenSeleccionada, contenedor, contenedorNuevo, oculto, descripcion);
    });
}
function resetearValores(etiqueta, nombre, precio, tipo, genero, cantidades, promo, descuento, oculto, imagenSeleccionada, contenedor, contenedorNuevo, oculto, descripcion){
    etiqueta.innerText = 'No hay ninguno seleccionado';
    nombre.value = '';
    precio.value = '';
    tipo.selectedIndex = 0;
    genero.selectedIndex = 0;
    contenedor.innerHTML = '';
    contenedorNuevo.innerHTML = '';
    oculto.value = '';
    descripcion.value = '';
    imagenSeleccionada.value = 0;
    const p = document.getElementById('mensajeAgregarColor');
    p.innerText = '';
    p.style = 'display: none';
    if(promo.checked){
        promo.checked = false;
        promo.dispatchEvent(new Event('change'));
    }
    descuento.value = 0;
}
//Formulario de edicion
function VerificarDescuento(){
    const caja = document.getElementById('entradaDePromocion');
    const etiquetaPromo = document.getElementById('etiquetaDePromocion');
    const etiquetaDescuento = document.getElementById('etiquetaDescuento');
    const entradaDescuento = document.getElementById('entradaDelDescuento');
    if(!caja.checked){
        etiquetaPromo.style.color = '#999';
        etiquetaDescuento.style.color = '#999';
        entradaDescuento.disabled = true;
    }else{
        etiquetaPromo.style.color = '#000';
        etiquetaDescuento.style.color = '#000';
        entradaDescuento.disabled = false;
    }
}
function CambiarOpcionDeDescuento(){
    const caja = document.getElementById('entradaDePromocion');
    const etiquetaPromo = document.getElementById('etiquetaDePromocion');
    const etiquetaDescuento = document.getElementById('etiquetaDescuento');
    const entradaDescuento = document.getElementById('entradaDelDescuento');
    caja.addEventListener('change', function(){
        if(!caja.checked){
            etiquetaPromo.style.color = '#999';
            etiquetaDescuento.style.color = '#999';
            entradaDescuento.disabled = true;
        }else{
            etiquetaPromo.style.color = '#000';
            etiquetaDescuento.style.color = '#000';
            entradaDescuento.disabled = false;
        }
    });
}
async function MostrarGaleriaDeImagenes(){//Hecho CON CHATGPT
    const entrada = document.getElementById('entradaImagenes');
    const imagenes = document.getElementById('imagenesRopa');
    const btnAnterior = document.getElementById('btnAnterior');
    const btnSiguiente = document.getElementById('btnSiguiente');
    const imagenSeleccionada = document.getElementById('imagenSeleccionada');
    let imagenesBase64 = [];
    let indiceActual = 0;


    entrada.addEventListener('change', async function(event){
        const archivosHeic = Array.from(event.target.files); // Se convierte el objeto FileList en un array real
        const archivos = [];
        for(const file of archivosHeic){
            if(file && file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')){ 
                //En teoria no es necesario poner file.name, esto es solo cuando se cambia la extencion y no el tipo de la imagen
                try {
                    const convertedBlob = await heic2any({ //HEIC2ANY sirve para convertir heic2any a jpg
                        blob: file,
                        toType: "image/jpeg",
                        quality: 0.9
                    });
                    // Crear objeto File para que tenga type y name correctos
                    const convertedFile = new File([convertedBlob], file.name.replace(/\.heic$/i, '.jpg'), { type: "image/jpeg" });
                    archivos.push(convertedFile);
                } catch (err) {
                    console.error("Error convirtiendo HEIC:", err);
                }
            }else{
                archivos.push(file);
            }
        }
        imagenesBase64 = []; //Estas dos variables se reinician de vuelta cada vez que se ejecuta el evento change
        indiceActual = 0;
        if(archivos.length > 0){
            let cargadas = 0;
            archivos.forEach((archivo, index) =>{ //Iteramos sobre un array de archivos
                if(archivo.type.startsWith('image/')){
                    const lector = new FileReader();
                    lector.onload = function(e){ /*
                        reader.onload = function(e){}; esto le dice como va a ser la funcion 'onload',
                        que se ejecutara cada ves que termine de leer un archivo*/
                        imagenesBase64[index] = e.target.result;
                        cargadas++;
                        if (cargadas === archivos.length) {
                                mostrarImagen(0);
                        }
                    };
                    lector.readAsDataURL(archivo); // Convierte el archivo a base64
                } 
            });
        }else{
            imagenes.style.display = 'none';
        }
    });
    function mostrarImagen(indice) {
        if (imagenesBase64.length === 0) return; //Si no hay imagnes cargadas no se miestra nada
        imagenSeleccionada.value = indice;
        imagenes.src = imagenesBase64[indice];
        imagenes.style.display = 'block';
    }
    btnAnterior.addEventListener('click', () => {
        if (imagenesBase64.length === 0) return; //Si no hay imagnes cargadas no se miestra nada
        indiceActual = (indiceActual - 1 + imagenesBase64.length) % imagenesBase64.length; //permite hacer que el índice "vuelva al final" si estaba en la primera imagen (comportamiento circular)
        mostrarImagen(indiceActual);
    });
    btnSiguiente.addEventListener('click', () => {
        if (imagenesBase64.length === 0) return; //Si no hay imagnes cargadas no se miestra nada
        indiceActual = (indiceActual + 1) % imagenesBase64.length; //Similar al boton anterior pero si esta al final vuelve a la primera
        mostrarImagen(indiceActual);
    });
}