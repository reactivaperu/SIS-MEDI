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
                    <a className="actividad_boton_link" href="/app/conexion">{"< Módulo de Conexiones Activas >"}</a>
                    <a className="actividad_boton_link" href="/app/aguafuente">{"< Módulo de Fuentes de Agua >"}</a>
                    <a className="actividad_boton_link" href="/app/zonafuente">{"< Módulo de Fuentes de Agua y Zonas Comerciales >"}</a>
                    <a className="actividad_boton_link" href="/app/conexion/prodagua">{"< Módulo de Conexiones del Departameto de Prod. Agua >"}</a>
                </div>
            </div>
        </div>)
        } else { return( <UsuarioNoValido /> )}
    }
}

export default Actividad;

/*
<a className="actividad_boton_link" href="/app/actividad/administrador/presion">{"< Módulo de Actividades/Presión >"}</a>
<a className="actividad_boton_link" href="/app/actividad/administrador/continuidad">{"< Módulo de Actividades/Continuidad >"}</a>
<a className="actividad_boton_link" href="/app/reporte/presion">{"< Módulo de Reporte/Presión >"}</a>
<a className="actividad_boton_link" href="/app/reporte/continuidad">{"< Módulo de Reporte/Continuidad >"}</a>
*/