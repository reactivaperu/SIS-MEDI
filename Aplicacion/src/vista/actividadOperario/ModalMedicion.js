import React from 'react';
import Modal from "../../componentes/Modal.js";

const ModificarActividad=({actividad,controlModalMedicion,mostrarModalMedicion,guardarActividad,modificarActividadEstado,mesPeriodo,agnoPeriodo})=>{  
    if(mostrarModalMedicion){
    return (
    <Modal
        mostrarModal = {mostrarModalMedicion}
        controlModal = {controlModalMedicion}
        tituloModal = "Toma de Presión y Continuidad"
    >
        <form noValidate onSubmit={guardarActividad} className="una_columna">
            <div><b>Periodo: </b> {agnoPeriodo + " - " + mesPeriodo } </div>
            <div><b>Bloque Urbano:  </b>{(actividad.denominacionBloque||"").toUpperCase() }</div>
            <div><b>Dirección:  </b><input size={"28"} defaultValue={actividad.denominacionLote} readOnly/></div>
            <div><b>Inscripcion:  </b>{(actividad.codigoInscripcion||"null").toUpperCase() }</div>
            <div className="una_columna">
                <label><b>Presion Alta Arriba</b></label>
                <input className="cuadro_dato" type="number" id="lecturaArriba" onChange = { modificarActividadEstado } value={actividad.lecturaArriba || ""}/>
                <label><b>Presion Alta Abajo</b></label>
                <input className="cuadro_dato" type="number" id="lecturaAbajo" onChange = { modificarActividadEstado } value={actividad.lecturaAbajo || ""}/>
            </div>
            <div className="una_columna">
                <label><b>Mañanas</b></label>
                <div className="dos_columnas">
                    <input className="cuadro_dato" type="time" id="r1HoraDe" onChange={ modificarActividadEstado } value={actividad.r1HoraDe || "" }/>
                    <input className="cuadro_dato" type="time" id="r1HoraA" onChange={ modificarActividadEstado } value={actividad.r1HoraA || "" } />
                </div>
                <label><b>Tardes</b></label>
                <div className="dos_columnas">
                    <input className="cuadro_dato" type="time" id="r2HoraDe" onChange={ modificarActividadEstado } value={actividad.r2HoraDe || "" }/>
                    <input className="cuadro_dato" type="time" id="r2HoraA" onChange={ modificarActividadEstado } value={actividad.r2HoraA || "" }/>
                </div>
            </div>
            <div className="centrado">
                <button className="boton boton_verde" type="submit">Guardar</button>
            </div>
        </form>
    </Modal>
    )} else { return null}
}
export default ModificarActividad