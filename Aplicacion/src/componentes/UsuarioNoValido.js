/*
-- File:             UsuarioNoValido.js
-- Project Name:     MediSeda
-- Version:          0.0.1
-- Description:      Interfaz UI para mostrar Mensaje de Usuario no Valido
-- Author:           Jorge Muñiz
-- Create Date:      2019-10-02
-- @Copyright        Jorge.Muñiz.Velasquez - World Connect Perú - 2019           
*/

import React, { Component } from 'react'

export class Error404 extends Component {
    render() {
        return (
            <div className="centrado">
                <div className="cuadro_mensaje peligro" style={{width:"50%"}}> 
                   <p> Usuario no Valido </p>
                   <p> Esta acción sera Reportada</p>
                </div>
            </div>
        )
    }
}

export default Error404;