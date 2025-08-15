document.addEventListener('DOMContentLoaded', function(){
    DesactivarFormulario();
    CambairNombre();
    CambairEmail();
    CambairDireccion();
});

function DesactivarFormulario(){
    const formulario = document.getElementById('formularioMiPerfil');
    formulario.addEventListener('submit', function(event){
        event.preventDefault();
    });
}

function CambairDireccion(){
    const boton = document.getElementById('cambiarDireccionDeTuCasa');
    boton.addEventListener('click', function(){
        const entrada = document.getElementById('entradaDirrecion');
        const direccion = entrada.value;
        fetch('miperfil/cambiar-direccion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({Direccion: direccion})
        }).then(respuesta => {
            if(!respuesta.ok){
                throw new Error('Hubo un error en la respuesta');
            }
            return respuesta.json();
        }).then(respuesta => {
            if(respuesta && respuesta['mensajeDeError']){
                if(respuesta['estadoDeSolicitud'] == 'muyMalo'){
                    window.location.href = `${url}/errores?mensaje=${respuesta['mensajeDeError']}`;
                }
                const p = document.getElementById('mensajeError2');
                p.innerText = respuesta['mensajeDeError'];
                p.style.display = 'inline-block';
            }else{
                window.location.href = `${url}${miPerfil}?mensajeExitoso=Se%20cambio%20el%20dato%20correctamente!`;
            }
        }).catch(error => {
            windo.location.href = `${url}/errores?mensaje=${error}`;
        });
    });
}

function CambairNombre(){
    const boton = document.getElementById('cambiarNombreDeUsuario');
    boton.addEventListener('click', function(){
        const entrada = document.getElementById('entradaUsusario');
        const usuario = entrada.value;
        fetch('miperfil/cambiar-nombre', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({Usuario: usuario})
        }).then(respuesta=>{
            if(!respuesta.ok){
                throw new Error('Hubo un error en la respuesta');
            }
            return respuesta.json();
        }).then(respuesta => {
            if(respuesta && respuesta['mensajeDeError']){
                if(respuesta['estadoDeSolicitud'] == 'muyMalo'){
                    window.location.href = `${url}/errores?mensaje=${respuesta['mensajeDeError']}`;
                }
                const p = document.getElementById('mensajeError2');
                p.innerText = respuesta['mensajeDeError'];
                p.style.display = 'inline-block';
            }else{
                window.location.href = `${url}${miPerfil}?mensajeExitoso=Se%20cambio%20el%20dato%20correctamente!`;
            }
        }).catch(error=>{
            windo.location.href = `${url}/errores?mensaje=${error}`;
        });
    });
}
function CambairEmail(){
    let boton = document.getElementById('cambiarEmail');
    boton.addEventListener('click', function(){
        const entrada = document.getElementById('entradaEmail');
        const mail = entrada.value;
        fetch('miperfil/cambiar-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'  
            },
            body: JSON.stringify({Mail: mail})
        }).then(respuesta => {
            if(!respuesta.ok){
                throw new Error('Hubo un error en la respuesta');
            }
            return respuesta.json();
        }).then(respuesta =>{
            if(respuesta && respuesta['mensajeDeError']){
                if(respuesta['estadoDeSolicitud'] == 'muyMalo'){
                    window.location.href = `${url}/errores?mensaje=${respuesta['mensajeDeError']}`;
                }
                const p = document.getElementById('mensajeError2');
                p.innerText = respuesta['mensajeDeError'];
                p.style.display = 'inline-block';
            }else{
                window.location.href = `${url}${miPerfil}?mensajeExitoso=Se%20cambio%20el%20dato%20correctamente!`;
            }
        }).catch(error => {
            windo.location.href = `${url}/errores?mensaje=${error}`;
        })
    });
}