import React , { Component } from 'react';
import { promesaModificarFechaSalidaSesion } from '../../datos/sesionDB.js';
import { verificarGrupoUsuario } from '../../datos/usuarioDB';

export default class inicioSesion extends Component {
    constructor(props){
        super(props);
        this.state={usuario:verificarGrupoUsuario()}
    }
    cerrarSesion = () => {
        const firma = {
            firmaSesion : this.state.usuario.firmaSesion,
            firmaUsuario : this.state.usuario.firmaDigital
        }       
        promesaModificarFechaSalidaSesion(firma).then(res => {
            localStorage.removeItem('tokenUsuario');
            this.props.actualizarUsuario()
            this.props.history.push("/app/ingresar");
        });
    }

    redireccionar = (ruta) => {this.props.history.push(ruta) }

    componentDidMount(){
        if(!this.state.usuario.codigoUsuario){
            this.redireccionar('/app/ingresar');
        }
    }
    
    render(){
        if(this.state.usuario.codigoUsuario){
        return(
            <div className="contenedor">
                <div className="centrado">
                    <div className="cuadro_mensaje una_columna" style={{padding:"20px"}}>
                        <div className="centrado">
                            <img src="/img/Logo-Seda-Cusco.png" alt="Logo WCS"/>
                        </div>
                        <br />
                        <div className="centrado">
                            <button className="boton boton_rojo" onClick={this.cerrarSesion}>CONFIRMAR</button>
                        </div>
                    </div>
                </div>
                <br />
            </div>
        )} else { return null }
    }
}


