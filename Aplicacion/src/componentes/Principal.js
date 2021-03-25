/*
-- File:             Principal.js
-- Project Name:     MediSeda
-- Version:          0.0.1
-- Description:      Interfaz UI Principal de la Aplicación
-- Author:           Jorge Muñiz
-- Create Date:      2019-10-02
-- @Copyright        Jorge.Muñiz.Velasquez - World Connect Perú - 2019           
*/

import React, { Component } from 'react'
import { verificarGrupoUsuario } from '../datos/usuarioDB.js';
import { resolucionActual } from '../datos/funcionesSistema.js';

const estadoInicial = {
    codigoUsuario : "",
    cuentaUsuario : "",
    nombres : "",
    apellidosPaterno : "",
    apellidosMaterno : "",
    firmaDigital : "",
    grupo : -1, // 1 -> Operador - 0 -> Administrador 

    mostrarModal: false,
}

export class Principal extends Component {
    constructor(props){
        super(props);
        this.state = estadoInicial;
    }

    accesosDirectos = () => {
        var accesos = (  <div>MEDI SEDA</div>  );
        switch (this.state.grupo) {
            case 0: accesos = ( // Usuario Operador
                <div>
                    <a href="/actividad/operario">Acitividades de Presión</a>
                </div>);
            break;
            case 1: accesos = ( // Usuario Administrador
                <div>
                    <a href="/actividad/administrador/presion">Acitividades de Presión</a>
                    <a href="/actividad/administrador/continuidad">Acitividades de Presión</a>
                    <a href="/reporte/presion">Reporte de Presión</a>
                    <a href="/reporte/continuidad">Reporte de Continuidad</a>
                </div>);
            break; 
            case 2: accesos = ( // Usuario Gerente
                <div>
                    <a href="/reporte/presion">Reporte de Presión</a>
                    <a href="/reporte/continuidad">Reporte de Continuidad</a>
                </div>);
            break;
            default: break;
        }
        return accesos;
    }

    controlModal = () => {
        this.setState({ mostrarModal : !this.state.mostrarModal });
    }

    componentDidMount () {
        const res = verificarGrupoUsuario();
        if(res){ this.setState(res) }
        else{ this.setState(estadoInicial) }
    }

    render() { return(
        <div>
            <div className="contenedor">
                <div className="centrado" style={{fontSize:"20px"}}><b>SISTEMA WEB MEDI SEDA V.0.1</b></div>
                <br />
                <div className="centrado">Toma de valores de continuidad y presión.</div>
                <br />
                <div className="centrado">La resolución de tu pantalla es: { resolucionActual() }</div>
            </div>
        </div>
    )}
}

export default Principal;