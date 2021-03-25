
import React, { Component } from 'react';
import { verificarGrupoUsuario } from '../datos/usuarioDB.js';
import { obtenerDenominacionGrupoUsuario } from '../datos/funcionesSistema';
import UsuarioNoValido from './UsuarioNoValido.js';

const estadoInicial = {
    codigoUsuario : "",
    cuentaUsuario : "",
    nombres : "",
    apellidosPaterno : "",
    apellidosMaterno : "",
    firmaDigital : "",
    grupo : "",
}

export class Perfil extends Component {

    constructor(props){
        super(props);
        this.state = estadoInicial; 
    }

    componentDidMount () {
        const usuario = verificarGrupoUsuario();
        if(usuario){ this.setState(usuario) }
        else{ this.props.history.push('/app') }
    }

    render() {
        if(this.state.codigoUsuario){
            return (
                <div className="contenedor">
                    <div className="centrado">
                        <table style={{width:"25%"}}>
                            <tbody>
                                <tr className="tabla_fila">
                                    <td><b>Nombres</b></td>
                                    <td>{this.state.nombres}</td>
                                </tr>
                                <tr className="tabla_fila">
                                    <td><b>Apellido Paterno</b></td>
                                    <td>{this.state.apellidosPaterno}</td>
                                </tr>
                                <tr className="tabla_fila">
                                    <td><b>Apellido Materno</b></td>
                                    <td>{this.state.apellidosMaterno}</td>
                                </tr>
                                <tr className="tabla_fila">
                                    <td><b>Grupo</b></td>
                                    <td>{obtenerDenominacionGrupoUsuario(this.state.grupo)}</td>
                                </tr>
                                <tr className="tabla_fila">
                                    <td><b>Contraseña</b></td>
                                    <td><a href="/app/cambiocontra">Actualizar</a></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>        
            )
        }else{
            return(<UsuarioNoValido />)
        }

    }
}

export default Perfil;