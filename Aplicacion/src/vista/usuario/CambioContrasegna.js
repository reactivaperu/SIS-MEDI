import React, { Component } from 'react';
import { verificarGrupoUsuario,modificarContrasegnaCuenta } from '../../datos/usuarioDB';

const estadoInicial = {

    usuario : verificarGrupoUsuario(),
    mensajeTexto : "",
    mensajeAlerta : "",

    codigoUsuario : "",
    actualContrasegna : "",
    nuevaContrasegna : "",
    confiContrasegna : ""
}
export class CambioContraseña extends Component{
    constructor(props){
        super(props);
        this.state = estadoInicial;
    }

    ingresarDatos = (e) => {
        this.setState({ [e.target.id] : e.target.value });
    }

    actualizarContrasegna = () => {
        if(this.state.nuevaContrasegna === this.state.confiContrasegna){
            const contrasegna = {
                codigoUsuario : this.state.usuario.codigoUsuario,
                quien : this.state.usuario.firmaDigital,
                actualContrasegna : this.state.actualContrasegna,
                nuevaContrasegna : this.state.nuevaContrasegna
            }
            modificarContrasegnaCuenta(contrasegna).then(res => {
                if(res[0].codigo === "200"){ 
                    this.setState({ 
                        mensajeTexto:"Cambio de contraseña con exito!...",
                        mensajeAlerta:"success"
                    }, () => { setTimeout(this.setState.bind(this,estadoInicial),3000) });
                }else{ 
                    this.setState({ 
                        mensajeTexto:"Contraseña actual incorrecta!...",
                        mensajeAlerta:"danger"
                    }, () => { setTimeout(this.setState.bind(this,estadoInicial),3000) });
                }
            });
        }else{
            this.setState({ 
                mensajeTexto:"Contraseña nueva no coincide con la confirmación!...",
                mensajeAlerta:"danger"
            }, () => { setTimeout(this.setState.bind(this,estadoInicial),3000) });
        }
    }

    componentDidMount(){
        if(!this.state.usuario){
            this.props.history.push('/');
        }
    }

    render(){
        return(
            <div className="contenedor">
                {this.state.mensajeTexto !==''?( <div>{this.state.mensajeTexto}</div>): '' }
                <div className="centrado">
                    <div className="una_columna">
                        <input className="cuadro_dato" type="password" id="actualContrasegna" placeholder="Ingrese su contraseña actual"
                            value = {this.state.actualContrasegna} onChange = { (e) => this.ingresarDatos(e) }
                        />
                        <input className="cuadro_dato" type="password" id="nuevaContrasegna" placeholder="Ingrese su nueva contraseña"
                            value = {this.state.nuevaContrasegna} onChange = { (e) => this.ingresarDatos(e) }
                        />
                        <input className="cuadro_dato" type="password" id="confiContrasegna" placeholder="Repetir contraseña nueva" 
                            value = {this.state.confiContrasegna} onChange = { (e) => this.ingresarDatos(e) }
                        />
                    </div>
                </div>
                <br />
                <div className="centrado">
                    <button className="boton boton_verde" onClick = { () => this.actualizarContrasegna() }>Actualizar</button>
                </div>
            </div>
        );
    }
}

export default CambioContraseña