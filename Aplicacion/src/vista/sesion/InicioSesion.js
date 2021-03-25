import React, { Component } from 'react';
import { hex_sha1 } from '../../datos/sha1';
import { promesaVerificarIngreso } from '../../datos/sesionDB.js';
import { verificarGrupoUsuario } from '../../datos/usuarioDB';

/** COMPONENTES **/
import CuadroMensaje from '../../componentes/CuadroMensaje.js';

const estadoInicial = {  
    cuentaUsuario : "",
    contrasegna : "",
    mensajeTexto : ""
}

export class InicioSesion extends Component {
    constructor(props){
        super(props);
        this.state = estadoInicial;
    }

    ingresarDatos = (evento) =>{
        this.setState({ [evento.target.id] : evento.target.value });
    }

    ingresar = (evento) => {
        evento.preventDefault();
        const credenciales = {
            cuentaUsuario : document.getElementById("cuentaUsuario").value,
            contrasegnaUsuario : hex_sha1(document.getElementById("contrasegna").value) // ENCRIPTAR TEXTO 
        }
        promesaVerificarIngreso(credenciales).then(respuesta => {
            if(!respuesta.error){
                localStorage.setItem('tokenUsuario',respuesta.token);
                this.props.actualizarUsuario()
                this.props.history.push('/app/perfil');
            }else{
                this.setState({mensajeTexto:respuesta.error},()=>{setTimeout(this.setState.bind(this,estadoInicial),5000) });
            }
        });
    }

    redireccionar = (ruta) => { this.props.history.push(ruta) }

    componentDidMount(){
        if(verificarGrupoUsuario().codigoUsuario){
            this.redireccionar('/app/perfil')
        }
    }

    render(){
        return(
            <div className="contenedor">
                <div className="centrado">
                    <form noValidate onSubmit={this.ingresar} className="cuadro_mensaje una_columna" style={{padding:"20px"}}>
                        <div className="centrado">
                            <img src="/img/Logo-Seda-Cusco.png" alt="Logo WCS"/>
                        </div>
                        <br />
                        {this.state.mensajeTexto.length < 1 ? null: 
                        <div className="centrado">
                            <div style={{width:"100%"}}><CuadroMensaje tipoCuadro={"peligro"}>{this.state.mensajeTexto}</CuadroMensaje></div>
                        </div>}
                        <fieldset><legend align="left">Número Celular</legend>
                            <input type="text" id="cuentaUsuario" placeholder="Ejem: 956789871" maxLength="9"/>
                        </fieldset>
                        <fieldset><legend align="left">Contraseña</legend>
                            <input type="password" id="contrasegna"/>        
                        </fieldset>

                        <div className="centrado">
                            <button className="boton boton_verde" type="submit">INGRESAR</button>
                        </div>
                    </form>
                </div>
                <br />
            </div>
        )
    }
}

export default InicioSesion