document.addEventListener('DOMContentLoaded', async function(){
    VerificarDescuento();
    CambiarOpcionDeDescuento();
    await MostrarGaleriaDeImagenes();
    CargarProducto();
    AgregarClase();
    CopiarColor();
});

function CargarProducto(){
    const formulario = document.getElementById('formularioRopa');
    formulario.addEventListener('submit', function(event){
        event.preventDefault();
        const datosDelFormulario = new FormData(this);
        fetch('administracion/subir-ropa', {
            method: 'POST',
            body: datosDelFormulario
        }).then(respuesta=>{
            if(!respuesta.ok){
                throw new Error('Hubo un error al intentar cargar la prenda');
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
                window.location.href = `${url}${cargarProductos}`;
            }
        }).catch(error=>{
            window.location.href = `${url}/errores?mensaje=${error}`;
        });
    });
}
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
async function MostrarGaleriaDeImagenes(){
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
    })
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
function AgregarClase(color){
    const boton = document.getElementById('agregarClaseDePrenda');
    boton.addEventListener('click', function(){
        const contenedor = document.getElementById('conjuntoCompletoDetalles');
        let id = 0; 
        if(document.querySelectorAll('.color').length){
            id = document.querySelectorAll('.color').length + 1;
        }else{
            id = 1;
        }
        console.log(id);
        let nuevoColor = color ?? '#000000';
        const valoresColor = document.querySelectorAll('.color') ?? [];
        const valoresCantidad = document.querySelectorAll('.entrada-cantidad') ?? [];
        const valoresTalles = document.querySelectorAll('.entrada-talles');
        contenedor.innerHTML += 
        '<article class="conjunto-entradas-detalles">'+
            `<input type="color" class="color" id="color${id}" name="Color" value="${nuevoColor}">`+
            '<select class="entrada entrada-talles" name="Talle">'+
                '<option class="opciones-de-talles">XS</option>'+
                '<option class="opciones-de-talles">S</option> '+
                '<option class="opciones-de-talles">M</option> '+
                '<option class="opciones-de-talles">L</option> '+
                '<option class="opciones-de-talles">XL</option> '+
                '<option class="opciones-de-talles">XXL</option> '+
            '</select>'+
            '<input class="entrada entrada-cantidad" type="number" value="1" name="Cantidad" min="0" step="1" required>'+
            `<button class="boton-detalles" id="botonDetalles${id}" type="button">Quitar</button>`+
            `<button class="boton-copiar-color" type="button">Color</button>`+
        '</article>';
        const entradasColores = document.querySelectorAll('.color');
        const entradasCantidad = document.querySelectorAll('.entrada-cantidad') ?? [];
        const entradasTalles = document.querySelectorAll('.entrada-talles');
        for(let i = 0; i<valoresColor.length; i++){
            entradasColores[i].value = valoresColor[i].value;
            entradasCantidad[i].value = valoresCantidad[i].value;
            entradasTalles[i].value = valoresTalles[i].value;
        };
        QuitarClase();
        CopiarColor()
    })
}

function QuitarClase(){
    document.querySelectorAll('.boton-detalles').forEach(boton => {
        boton.addEventListener('click', () => {
            boton.parentElement.remove();
        });
    });
}
function CopiarColor(){
    const botones = document.querySelectorAll('.boton-copiar-color');
    const entradasColores = document.querySelectorAll('.color');
    for(let i = 0; i<botones.length; i++){
        botones[i].addEventListener('click', function(){
            const color = entradasColores[i].value;
            InsertarClase(color);
        });
    }
}
function InsertarClase(color){
    const contenedor = document.getElementById('conjuntoCompletoDetalles');
    let id = 0; 
    if(document.querySelectorAll('color').length){
        id = document.querySelectorAll('color').length;
    }else{
        id = 1;
    }
    let nuevoColor = color ?? '#000000';
    const valoresColor = document.querySelectorAll('.color') ?? [];
    const valoresCantidad = document.querySelectorAll('.entrada-cantidad') ?? [];
    const valoresTalles = document.querySelectorAll('.entrada-talles');
    contenedor.innerHTML += 
    '<article class="conjunto-entradas-detalles">'+
        `<input type="color" class="color" name="Color" value="${nuevoColor}">`+
        '<select class="entrada entrada-talles" name="Talle">'+
            '<option class="opciones-de-talles">XS</option>'+
            '<option class="opciones-de-talles">S</option> '+
            '<option class="opciones-de-talles">M</option> '+
            '<option class="opciones-de-talles">L</option> '+
            '<option class="opciones-de-talles">XL</option> '+
            '<option class="opciones-de-talles">XXL</option> '+
        '</select>'+
        '<input class="entrada entrada-cantidad" type="number" value="1" name="Cantidad" min="0" step="1" required>'+
        `<button class="boton-detalles" id="botonDetalles${id}" type="button">Quitar</button>`+
        `<button class="boton-copiar-color" type="button">Color</button>`
    '</article>';
    const entradasColores = document.querySelectorAll('.color');
    const entradasCantidad = document.querySelectorAll('.entrada-cantidad') ?? [];
    const entradasTalles = document.querySelectorAll('.entrada-talles');
    for(let i = 0; i<valoresColor.length; i++){
        entradasColores[i].value = valoresColor[i].value;
        entradasCantidad[i].value = valoresCantidad[i].value;
        entradasTalles[i].value = valoresTalles[i].value;
    };
    QuitarClase(valoresColor);
    CopiarColor();
}