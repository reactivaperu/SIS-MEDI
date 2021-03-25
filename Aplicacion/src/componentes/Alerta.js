import React from 'react';
import Modal from "./Modal.js";
const Alerta = ({ titulo,mensaje,cancelar,confirmar,mostrarAlerta,controlAlerta }) => {
    return(
        <Modal
            mostrarModal = {mostrarAlerta}
            controlModal = {controlAlerta}
            tituloModal = {titulo || "Alerta"}
        >
        <form noValidate onSubmit={confirmar} className="una_columna">
            <div>{mensaje}</div>
            <div className="centrado">
                <div className="dos_columnas">
                    <button className="boton boton_verde" type="submit">Confirmar</button>
                    <button className="boton boton_rojo" onClick={cancelar}>Cancelar</button> 
                </div>
            </div>
        </form>
        </Modal>
    );
}

export default Alerta;