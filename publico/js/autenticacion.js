document.addEventListener('DOMContentLoaded', function(){
    IniciarSesion();
});

function IniciarSesion(){
    const formulario = document.getElementById('formularioParaIniciarSesion');
    formulario.addEventListener('submit', function(event){
        event.preventDefault();
        const datosDelFormulario = new FormData(this);
        const datos = {};
        datosDelFormulario.forEach((value, key)=>{
            datos[key] = value;
        })
        fetch('autenticacion/confirmar-inicio',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos)
        }).then(respuesta=>{
            if(!respuesta.ok){
                throw new Error('Hubo un error al intentar logearte');
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
            }else{
                window.location.href = `${url}?mensajeExitoso=Iniciaste%20sesion%20corectamente!`
            }
        }).catch(error=>{
            window.location.href = `${url}/errores?mensaje=${error}`
        });
    });
}