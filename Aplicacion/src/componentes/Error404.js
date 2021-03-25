/*
-- File:             Error404.js
-- Project Name:     MediSeda
-- Version:          0.0.1
-- Description:      Interfaz UI para mostrar Error 404
-- Author:           Jorge Muñiz
-- Create Date:      2019-10-02
-- @Copyright        Jorge.Muñiz.Velasquez - World Connect Perú - 2019           
*/

import React, { Component } from 'react'

export class Error404 extends Component {
    render() {
        return (
            <div>
                <h1>ERROR 404</h1>
                <h4> No existe Pagina </h4>           
            </div>
        )
    }
}

export default Error404;