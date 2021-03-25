import React from 'react';
import Modal from "../../componentes/Modal.js";
import { obtenerFecha,listaMesesAgno } from '../../datos/funcionesSistema.js';
const ModificarActividad = ( 
    { actividad,usuarios,mostrarModal,controlModalAgregar,seleccionDatosActividad,guardarActividad } ) => {
    function handleEnter(event) {
        if (event.keyCode === 13) {
            const form = event.target.form;
            const index = Array.prototype.indexOf.call(form, event.target);
            form.elements[index + 1].focus();
            event.preventDefault();
        }
    }
    if(mostrarModal){
        return (
        <div>
        <Modal
            mostrarModal = {mostrarModal}
            controlModal = {controlModalAgregar}
            tituloModal = {"Actividad"}
        >     
            <form noValidate onSubmit={guardarActividad} className="una_columna">
                <div><b>Periodo: </b> {actividad.agnoPeriodo + " - " + (listaMesesAgno[parseInt(actividad.mesPeriodo||1)-1].nombre||"") } </div>
                <div><b>Bloque Urbano:  </b>{ (actividad.denominacionBloque || "Todos de la Zona").toUpperCase()} </div>
                <div><b>Dirección:</b></div>
                <input readOnly className="cuadro_dato" defaultValue={actividad.denominacionLote}/>
                <div><b>Operario:</b></div>
                <select className="cuadro_dato" onChange={seleccionDatosActividad} value={(actividad.codigoUsuario || "0")} id="codigoUsuario">
                    <option value="0">-- Seleccione Operario --</option>
                    { usuarios.map((usuario) => ( <option value={usuario.codigoUsuario} key={usuario.codigoUsuario}>{usuario.nombres + " " + usuario.apellidosPaterno + " " + usuario.apellidosMaterno}</option>))}
                </select>
                <div><b>Fecha Entrega:</b></div>
                <input className="cuadro_dato" type="date" onChange={seleccionDatosActividad} value={(actividad.fechaFinal || obtenerFecha())} id="fechaFinal"/>
                <label className="centrado"><b>Presion</b></label>
                <div className="una_columna">
                    <label><b>Alta Arriba</b><div className="dato_anterior">Dato Anterior: {actividad.lecturaArribaAnterior}</div></label>
                    <input className="cuadro_dato" type="number" id="lecturaArriba" onChange={seleccionDatosActividad} value={actividad.lecturaArriba || ""} onKeyDown={handleEnter}/>
                    <label><b>Alta Abajo</b><div className="dato_anterior">Dato Anterior: {actividad.lecturaAbajoAnterior}</div></label>
                    <input className="cuadro_dato" type="number" id="lecturaAbajo" onChange={seleccionDatosActividad} value={actividad.lecturaAbajo || ""} onKeyDown={handleEnter}/>
                </div>
                <label className="centrado"><b>Continuidad</b></label>
                <div className="una_columna">
                    <label><b>Mañanas</b><div className="dato_anterior">Dato Anterior: {actividad.r1HoraDeAnterior} a {actividad.r1HoraAAnterior}</div></label>
                    <div className="dos_columnas">
                        <input className="cuadro_dato" type="time" id="r1HoraDe" onChange={seleccionDatosActividad} value={actividad.r1HoraDe || "" } onKeyDown={handleEnter}/>
                        <input className="cuadro_dato" type="time" id="r1HoraA" onChange={seleccionDatosActividad} value={actividad.r1HoraA || "" } onKeyDown={handleEnter}/>
                    </div>
                    <label><b>Tardes</b><div className="dato_anterior">Dato Anterior: {actividad.r2HoraDeAnterior} a {actividad.r2HoraAAnterior}</div></label>
                    <div className="dos_columnas">
                        <input className="cuadro_dato" type="time" id="r2HoraDe" onChange={seleccionDatosActividad} value={actividad.r2HoraDe || "" } onKeyDown={handleEnter}/>
                        <input className="cuadro_dato" type="time" id="r2HoraA" onChange={seleccionDatosActividad} value={actividad.r2HoraA || "" }/>
                    </div>
                </div>

                <div className="centrado">
                    <button className="boton boton_verde" type="submit">Guardar</button>
                </div>
            </form>             
        </Modal>
        </div>
        )
    }else{ return null}
}
export default ModificarActividad