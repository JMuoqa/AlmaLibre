document.addEventListener('DOMContentLoaded', function(){
    EventosDeCheckBoxs();
    PedirPorWhatsApp();
});

function EventosDeCheckBoxs(){
    const local = document.getElementById('local'); 
    const casa = document.getElementById('casa');
    local.addEventListener('change', function(){
        casa.checked = false;
        local.checked = true;
        const entradaDireccion = document.getElementById('entradaDireccion');
        const etiquetaDireccion = document.getElementById('etiquetaDireccion');
        etiquetaDireccion.style.color= '#999';
        entradaDireccion.disabled = true;
    })
    casa.addEventListener('change', function(){
        casa.checked = true;
        local.checked = false;
        const entradaDireccion = document.getElementById('entradaDireccion');
        const etiquetaDireccion = document.getElementById('etiquetaDireccion');
        etiquetaDireccion.style.color= '#000';
        entradaDireccion.disabled = false;
    })
    local.dispatchEvent(new Event('change'));
    const efectivo = document.getElementById('efectivo'); 
    const transferencia = document.getElementById('transferencia');
    efectivo.addEventListener('change', function(){
        transferencia.checked = false;
        efectivo.checked = true;
    })
    transferencia.addEventListener('change', function(){
        transferencia.checked = true;
        efectivo.checked = false;
    })
    efectivo.dispatchEvent(new Event('change'));
}
function PedirPorWhatsApp(){
    const pedirPorWhatsApp = document.getElementById('pedirPorWhatsApp');
    pedirPorWhatsApp.addEventListener('submit', function(event){
        event.preventDefault();
        const datosFormulario = new FormData(this);
        const datos = {};
        datosFormulario.forEach((value,key)=>{
            datos[key] = value;
        });
        fetch('carrito/pedir', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        }).then(respuesta =>{
            if(!respuesta.ok){
                throw new Error('Hubo un error');
            }
            return respuesta.json();
        }).then(respuesta => {
            if(respuesta && respuesta['estadoDeSolicitud'] == 'muyMalo'){
                window.location.href = `${url}/errores?mensaje=${respuesta['mensajeDeError']}`;return;
            }
            window.open(respuesta['URL'], '_blank');
            VaciarElCarrito();
            setTimeout(function(){
                window.location.href = `${url}`;
            },1500);
        }).catch(error=> {
            window.location.href = `${url}/errores?mensaje=${error}`;
        })
    })
}
function VaciarElCarrito(){
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
}