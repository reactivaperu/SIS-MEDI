import React from 'react';

export const TAMAGNO_PAGINA = 15; // Numero de resultados por página/pantalla 
export const CANTIDAD_PAGINA = 40; // Numero total de paginas

const Paginacion = ({ cantidadElementos, cambiarPagina, paginaActual }) => {

    function disminuirPagina(){ if(paginaActual > 1){ cambiarPagina(paginaActual - 1) } }
    
    function incrementarPagina(){ if(cantidadElementos === TAMAGNO_PAGINA){ cambiarPagina(paginaActual + 1) } }

    return(
        <div className="centrado">
            <button className="boton boton_azul" style={{fontSize:"15px"}} onClick={disminuirPagina} title="Página anterior">&larr;</button>
            
            <input style={{textAlign:'center',border:'none',fontSize:"17px"}} size={2} type="number" value={paginaActual} 
                    min="1" pattern="[0-9]*" name="pagina_" id="pagina_" title={'Número de Página : ' + paginaActual} 
                    onChange={cambiarPagina} 
            /> 
            
            <button className="boton boton_azul" style={{fontSize:"15px"}} onClick={incrementarPagina} title="Página siguiente">&rarr;</button>                
        </div>
    )
}

export default Paginacion
