/*
-- File:             ActividadAdministrador.js
-- Project Name:     MediSeda
-- Version:          0.0.1
-- Description:      Interfaz UI para Administrar las Acitividades de Continuidad y Presion
-- Author:           Jorge Muñiz
-- Create Date:      2019-10-02
-- @Copyright        Jorge.Muñiz.Velasquez - World Connect Perú - 2019           
*/

import React, { Component } from 'react'
import { verificarGrupoUsuario } from '../../datos/usuarioDB.js';
import UsuarioNoValido from '../../componentes/UsuarioNoValido.js';
const estadoInicial = {}

export class Actividad extends Component {
    constructor(props){
        super(props);
        this.state = estadoInicial;
    }
    componentDidMount(){
        if(verificarGrupoUsuario().grupo > 0){
        }// else{ this.props.history.push('/') }
    }

    render() {
        if(verificarGrupoUsuario().grupo > 0){ return( 
        <div className="contenedor" style={{marginTop:"30px"}}>
            <div className="centrado">
                <div className="una_columna">
                    <a className="actividad_boton_link" href="/app/actividad/administrador/presion">{"< Módulo de Actividades/Presión >"}</a>
                    <a className="actividad_boton_link" href="/app/actividad/administrador/continuidad">{"< Módulo de Actividades/Continuidad >"}</a>
                    <a className="actividad_boton_link" href="/app/reporte/presion">{"< Módulo de Reporte/Presión >"}</a>
                    <a className="actividad_boton_link" href="/app/reporte/continuidad">{"< Módulo de Reporte/Continuidad >"}</a>
                </div>
            </div>
        </div>)
        } else { return( <UsuarioNoValido /> )}
    }
}

export default Actividad;

/*
            <table>
                <thead>
                    <tr>
                        <th><b>Actividad</b></th>
                        <th><b>Reporte</b></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={{border:'1px solid #ccc',textAlign:'center'}}><div style={{borderRadius:"10px"}} className="centrado informacion"><a className="actividad_boton_link" href="/app/actividad/administrador/presion">Presión</a></div></td>
                        <td style={{border:'1px solid #ccc',textAlign:'center'}}><div style={{borderRadius:"10px"}} className="centrado informacion"><a className="actividad_boton_link" href="/app/reporte/presion">Presión</a></div></td>
                    </tr>
                    <tr>
                        <td style={{border:'1px solid #ccc',textAlign:'center'}}><div style={{borderRadius:"10px"}} className="centrado exito"><a className="actividad_boton_link" href="/app/actividad/administrador/continuidad">Continuidad</a></div></td>
                        <td style={{border:'1px solid #ccc',textAlign:'center'}}><div style={{borderRadius:"10px"}} className="centrado exito"><a className="actividad_boton_link" href="/app/reporte/continuidad">Continuidad</a></div></td>
                    </tr>
                </tbody>
            </table>
*/