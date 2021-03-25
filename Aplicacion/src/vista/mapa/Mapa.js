import React, { Component } from 'react';
import { verificarGrupoUsuario } from '../../datos/usuarioDB.js';
import UsuarioNoValido from '../../componentes/UsuarioNoValido.js';

export class Mapa extends Component {
  render() {
    const usuarioPermitido = verificarGrupoUsuario(); 
    if (usuarioPermitido.grupo > 0) { return (
      <div className="centrado">
        <img style={{width:"80%"}} src="/img/provCusco.jpg" alt="Cusco" />
      </div>
    )} else { return ( <UsuarioNoValido /> ) }  
  }
}
export default Mapa