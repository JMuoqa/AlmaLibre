document.addEventListener('DOMContentLoaded', function(){
    VerProducto();
    CargarIndice();
    CambiarIndice();
    Ir_A_VerPromos();
})
function CargarIndice(){
    if(document.getElementById('indicadorDelIndice')){
        const p = document.getElementById('indicadorDelIndice');
        const indice = finalDeLCiclo / 8;
        p.innerText = indice;
    }
}

function CambiarIndice(){
    const siguiente = document.getElementById('botonDelIndiceSiguiente');
    const anterior = document.getElementById('botonDelIndiceAnterior');
    if(document.getElementById('botonDelIndiceSiguiente') && document.getElementById('botonDelIndiceAnterior')){
        siguiente.addEventListener('click', function(){
            const indiceSiguiente = (finalDeLCiclo / 8) + 1;
            window.location.href = `${url}/ver-prendas/?genero=${genero}&tipo=${tipo}&indice=${indiceSiguiente}`;
        });
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
            window.location.href = `${url}/ver-prendas/?genero=${genero}&tipo=${tipo}&indice=${indiceSiguiente}`;
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

function Ir_A_VerPromos(){
    const articulo = document.getElementById('promos');
    articulo.addEventListener('click', function(){
        window.location.href = `${url}/ver-promos/?genero=${genero}&tipo=${tipo}`;
    })
}