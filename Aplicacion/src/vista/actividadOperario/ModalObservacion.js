import React from 'react';
import Modal from "../../componentes/Modal.js";

const ModificarActividad = ({ actividad , controlModalObservacion , mostrarModalObservacion , guardarObservacion , modificarActividadEstado } ) => {  
    return (
        <div>
            <Modal
                mostrarModal = {mostrarModalObservacion}
                controlModal = {controlModalObservacion}
                tituloModal = {actividad.tipoActividad ? "Presión" : "Continuidad"}
            >
            <form noValidate onSubmit={guardarObservacion} className="una_columna">
                <div><b>Periodo: </b> {actividad.agnoPeriodo + " - " + actividad.mesPeriodo } </div>
                <div><b>Bloque Urbano:  </b>{(actividad.denominacionBloque||"").toUpperCase() }</div>
                <div><b>Dirección:  </b><input size={"28"} defaultValue={actividad.denominacionLote} readOnly/></div>
                <div><b>Inscripcion:  </b>{(actividad.codigoInscripcion||"").toUpperCase() }</div> 
                <div><b>Observación: </b></div>
                <textarea className="cuadro_dato" id="textoObservacion" onChange={ modificarActividadEstado } value={actividad.textoObservacion || "" }/>
                <div className="centrado">
                    <button className="boton boton_verde" type="submit">Guardar</button>
                </div>
            </form>
            </Modal>
        </div>
    )
}
export default ModificarActividad