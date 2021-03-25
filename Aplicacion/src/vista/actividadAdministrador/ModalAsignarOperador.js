import React from 'react';
import Modal from "../../componentes/Modal.js";
import { obtenerFecha,listaMesesAgno } from '../../datos/funcionesSistema.js';

const AsignarOperador = ({ usuarios,bloques,bloquesSeleccionados,actividad,mostrarModalAsignar,controlModalAsignar,asignarOperadorBloque,seleccionarUsuarioActividad,seleccionarSectorActividad,seleccionarFechaFinalActividad } ) => {
    return (
        <div>
        <Modal
            mostrarModal = {mostrarModalAsignar}
            controlModal = {controlModalAsignar}
            tituloModal = {"Asignar Operador Actividad"}
        >
        <form noValidate onSubmit={asignarOperadorBloque} className="una_columna">                              
            <div><b>Periodo: </b> {actividad.agnoPeriodo + " - " + (listaMesesAgno[parseInt(actividad.mesPeriodo||1)-1].nombre||"")} </div>
            <label> <b>Operario: </b> </label>
            <select className="cuadro_dato" onChange = { seleccionarUsuarioActividad } value = {actividad.codigoUsuario} id="codigoUsuario">
                <option value="0">-- Seleccione Operario --</option>
                { (usuarios||[]).map((usuario) => ( <option value={usuario.codigoUsuario} key={usuario.codigoUsuario}>{usuario.nombres + " " + usuario.apellidosPaterno + " " + usuario.apellidosMaterno}</option>))}
            </select>

            <label> <b>Sector: </b> </label>
            <select multiple={true} className="cuadro_dato multiSelect" onChange={seleccionarSectorActividad} value={bloquesSeleccionados} id="codigoUsuario">
                <option value="0">-- Seleccione Sector --</option>
                { (bloques||[]).map((bloque) => ( 
                <option value={bloque.codigoUrbano} key={bloque.codigoUrbano}>{bloque.denominacionBloque}</option>))}
            </select>

            <label><b>Fecha Entrega:</b></label>
            <input className="cuadro_dato" type="date" onChange={seleccionarFechaFinalActividad} defaultValue={(actividad.fechaFinal || obtenerFecha())} id="fechaFinal"/>
            
            <div className="centrado">
                <div className="dos_columnas">
                    <button className="boton boton_verde" type="submit">Asignar</button>
                    <button className="boton boton_rojo" onClick={()=>controlModalAsignar()}>Cancelar</button>
                </div>
            </div>
        </form>                    
        </Modal>
        </div>
    )
}
export default AsignarOperador

/*

*/