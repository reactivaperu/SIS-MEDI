import React, {Component} from 'react';
import { modulos, urlAplicacion } from '../datos/funcionesSistema.js';

export class Navegador extends Component {
    constructor(props){
        super(props);
        this.state = {
            moduloAtivo : []
        };
    }

    identificarModulo = () => {
        var direccion = (window.location.href).substring(urlAplicacion.length);
        direccion = direccion.split("/app")[1];
        modulos.forEach(moduloAtivo=>{
            if(moduloAtivo.url==="/app"+direccion) { this.setState({ moduloAtivo })}
        });
    }

    componentDidMount(){
        this.identificarModulo();
    }

    render(){
        return(
        <div className="navegador">
            <div className="navegador_titulo"><b>{this.state.moduloAtivo.titulo}</b></div>
        </div>
        );
    }
}

export default Navegador;
