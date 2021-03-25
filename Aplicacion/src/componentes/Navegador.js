import React, {Component} from 'react';
import { modulos } from '../datos/funcionesSistema.js';

export class Navegador extends Component {
    constructor(props){
        super(props);
        this.state = {
            moduloAtivo : []
        };
    }

    identificarModulo = () => modulos.forEach(moduloAtivo=>{ if(moduloAtivo.url===window.location.pathname) { this.setState({ moduloAtivo }) } })

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
