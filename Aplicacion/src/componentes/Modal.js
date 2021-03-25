import React from 'react';
const Modal = ( {mostrarModal,controlModal,tituloModal,children} ) => {
    if(mostrarModal){ return (
        <div className="modal">
            <div className="modal_ventana">
                <div className="modal_encabezado">
                    <div> {tituloModal} </div>   
                    <div className="boton_cerrar" onClick={controlModal}>&times;</div>    
                </div>
                <hr />
                { children }
            </div>
      </div>
    )}
    return null;
}
export default Modal