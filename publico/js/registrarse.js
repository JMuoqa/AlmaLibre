document.addEventListener('DOMContentLoaded', function(){
    Registrarse();
});

function Registrarse(){
    const formulario = document.getElementById('formularioParaRegistrarse');
    formulario.addEventListener('submit', function(event){
        event.preventDefault();
        const datosFormulario = new FormData(this);
        const datos = {};
        datosFormulario.forEach((value,key)=>{
            datos[key] = value;
        });
        fetch('autenticacion/confirmar-registro',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos)
        }).then(respuesta =>{
            if(!respuesta.ok){
                throw new Error('Hubo un error al registrarse');
            }
            return respuesta.json();
        }).then(respuesta => {
            if(respuesta && respuesta['mensajeDeError']){
                if(respuesta['estadoDeSolicitud'] == 'muyMalo'){
                    window.location.href = `${url}/errores?mensaje=${respuesta['mensajeDeError']}`;
                }
                const p = document.getElementById('textoDeErrores');
                p.innerText = respuesta['mensajeDeError'];
                p.style.display = 'inline-block';
            }else{
                window.location.href = `${url}?mensajeExitoso=Te%20registraste%20corectamente!`
            }
        }).catch(error => {
            windo.location.href = `${url}/errores?mensaje=${error}`
        });
    });
}