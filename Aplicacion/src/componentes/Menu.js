import React from 'react'
import IconoUsuario from './IconoUsuario.js';
import IconoSesion from './IconoSesion.js';
import { obtenerDenominacionGrupoUsuario} from '../datos/funcionesSistema';

const Menu = props => {
    return(
    <header className="barra_herramientas">
        <nav className="barra_herramientas_navegador">
            <div className="barra_herramientas_boton_logo">
                <div hidden={props.usuario.grupo === undefined} className="barra_herramientas_boton" onClick={props.controlMenuLateral}>
                    &#9776;
                </div>
                <a href='/app'><img className="barra_herramientas_logo" src="/img/Logo-Seda-Cusco.png" alt="MEMBRETE SEDACUSCO" title={"MEMBRETE SEDACUSCO"}/></a>
            </div>
            <div></div>
            <div className="barra_herramientas_sesion">
                { props.usuario ? 
                <a href='/app/perfil' className="barra_herramientas_navegador_usuario" title={obtenerDenominacionGrupoUsuario(props.usuario.grupo)}>
                    <div><IconoUsuario fill="#28a745"/></div>
                    <div className="usuario_nombre">{(props.usuario.nombres).substring(0,20)}</div>
                    <div className="usuario_apellido">{props.usuario.apellidosPaterno}</div>
                </a> : <div></div> }
                <a href={props.usuario?"/app/salir":"/app/ingresar"} style={{textDecoration:"none"}}><IconoSesion conectado={props.usuario?1:0} fill={"white"}/></a>
            </div>
        </nav>
    </header>
)}

export default Menu;
/*

<MenuDesplegable grupoUsuario={props.usuario.grupo} mostrar={props.mostrar}/>
<div className="barra_herramientas_boton_linea"/>
<div className="barra_herramientas_boton_linea"/>
<div className="barra_herramientas_boton_linea"/>
*/