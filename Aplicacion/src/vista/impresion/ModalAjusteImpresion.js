/*
-- File:             ModalAjusteImpresion.js
-- Project Name:     MediSeda
-- Version:          0.0.1
-- Description:      Interfaz UI para Configurar la impresion
-- Author:           Jorge Muñiz
-- Create Date:      2019-10-02
-- @Copyright        Jorge.Muñiz.Velasquez - World Connect Perú - 2019           
*/

import React, { Component } from 'react'
import Modal from "../../componentes/Modal.js";
import { promesaListarBloqueImpresionPaginaActividad } from '../../datos/impresionDB.js';

const estadoInicial = {
    bloquesImpresion : []
}

export class ModalAjusteImpresion extends Component {
    constructor(props){
        super(props);
        this.state = estadoInicial;
    }

    listarBloquesImpresion = () => {
        promesaListarBloqueImpresionPaginaActividad({pagina:"%"}).then(bloques=>{
            if(!bloques.error){ this.setState({ bloquesImpresion: bloques[0] }); }
        });
    }

    componentDidMount(){
        this.listarBloquesImpresion();
    }

    render() {
        if(this.props.mostrarModalAjusteImpresion){ return(
        <Modal
            mostrarModal = {this.props.mostrarModalAjusteImpresion}
            controlModal = {this.props.controlModalAjusteImpresion}
            tituloModal = {"Ajustes de Imprimir"}
        >
        <div className="centrado">
            <label>Modificar Bloques de Impresión <b>(Mantenimiento).</b></label>
        </div>
        </Modal>
        )} else { return null }
    }
}

export default ModalAjusteImpresion;