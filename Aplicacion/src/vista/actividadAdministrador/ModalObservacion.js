import React from 'react';
import Modal from "../../componentes/Modal.js";

const ModificarActividad = ({ actividad , controlModalObservacion , mostrarModalObservacion } ) => {  
    return (
        <Modal
            mostrarModal = {mostrarModalObservacion}
            controlModal = {controlModalObservacion}
            tituloModal = {"Observación de " + (actividad.tipoActividad ? "Presión" : "Continuidad")}
        >
        <form noValidate onSubmit={controlModalObservacion} className="una_columna">
            <div><b>Periodo: </b> {actividad.agnoPeriodo + " - " + actividad.mesPeriodo } </div>
            <div><b>Bloque Urbano:  </b>{(actividad.denominacionBloque||"").toUpperCase() } </div>
            <div><b>Dirección:  </b><input size={"28"} defaultValue={actividad.denominacionLote} readOnly/></div>
            <div><b>Observación: </b></div>
            <textarea readOnly className="cuadro_dato" id="textoObservacion" value={actividad.textoObservacion || "" }/>
            <div className="centrado">
                <button className="boton boton_rojo" type="submit">Cerrar</button>
            </div>
        </form>
        </Modal>
    )
}
export default ModificarActividad