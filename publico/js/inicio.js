document.addEventListener('DOMContentLoaded',function(){
    CargarIndice();
    CambiarIndice();
    VerProducto();
    MenuPrincipalAdaptable();
    Ir_A_VerPromos();
});
function CargarIndice(){
    if(document.getElementById('indicadorDelIndice')){
        const p = document.getElementById('indicadorDelIndice');
        const indice = finalDeLCiclo / 8;
        p.innerText = indice;
    }
}
function CambiarIndice(){
    if(document.getElementById('botonDelIndiceSiguiente') && document.getElementById('botonDelIndiceAnterior')){
        const siguiente = document.getElementById('botonDelIndiceSiguiente');
        siguiente.addEventListener('click', function(){
            const indiceSiguiente = (finalDeLCiclo / 8) + 1;
            window.location.href = `${url}/?indice=${indiceSiguiente}#seccionNovedades`;
        });
        const anterior = document.getElementById('botonDelIndiceAnterior');
        anterior.addEventListener('click', function(){
            let indiceSiguiente = (finalDeLCiclo / 8) - 1;
            if(indiceSiguiente<=0 && finalDeLCiclo<cantidadDePrendas){
                for(let i = 1; i<cantidadDePrendas; i++){
                    if(finalDeLCiclo*i>cantidadDePrendas){
                        indiceSiguiente = i;
                        break;
                    }
                }
            }
            window.location.href = `${url}/?indice=${indiceSiguiente}#seccionNovedades`;
        });
    }
}
function VerProducto(){
    const articulos = document.querySelectorAll('.contenedor-producto');
    articulos.forEach((articulo)=>{
        articulo.addEventListener('click', function(){
            window.location.href = `${url}/ver-prenda?prenda=${articulo.id}`;
        });
    });
}
function MenuPrincipalAdaptable(){
    window.addEventListener('resize', function(){
        const ancho = window.innerWidth;
    });
}

function Ir_A_VerPromos(){
    if(document.getElementById('promos')){
        const articulo = document.getElementById('promos');
        articulo.addEventListener('click', function(){
            window.location.href = `${url}/ver-promos/?genero=Mujer&tipo=Ver-todo`;
        })
    }
}