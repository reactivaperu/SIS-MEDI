import React from 'react'
const OpcionesIcono = ({grupoUsuario}) => {
    if(grupoUsuario === 0){ return (
        <div className="menu_cuadro menu_cuadro_operador">
            <a href="/app/actividad/operario">
                <div className="centrado">
                    <img style={{cursor:"pointer"}} src="/img/actividad_operador.png" alt="Descargar Archivo Pdf" title="Descargar Archivo Pdf"/>
                </div>
                <div className="centrado">Actividades</div>
            </a>
            <a href="/app/cambiocontra">
                <div className="centrado">
                    <img style={{cursor:"pointer"}} src="/img/contrasena.png" alt="Descargar Archivo Pdf" title="Descargar Archivo Pdf"/>
                </div>
                <div className="centrado">Contraseña</div>
            </a>
        </div>
    )}
    if(grupoUsuario > 0){ return (
        <div className="menu_cuadro menu_cuadro_administrador">
            <a href="/app/cambiocontra">
                <div className="centrado">
                    <img style={{cursor:"pointer"}} src="/img/contrasena.png" alt="Descargar Archivo Pdf" title="Descargar Archivo Pdf"/>
                </div>
                <div className="centrado">Cambiar Contraseña</div>
            </a>
            <a href="/app/usuario">
                <div className="centrado">
                    <img style={{cursor:"pointer"}} src="/img/usuario.png" alt="Descargar Archivo Pdf" title="Descargar Archivo Pdf"/>
                </div>
                <div className="centrado">Usuarios Sistema</div>
            </a>
            <a href="/app/zona">
                <div className="centrado">
                    <img style={{cursor:"pointer"}} src="/img/zona.png" alt="Descargar Archivo Pdf" title="Descargar Archivo Pdf"/>
                </div>
                <div className="centrado">Zonas Comerciales</div>
            </a>
            <a href="/app/bloque">
                <div className="centrado">
                    <img style={{cursor:"pointer"}} src="/img/urbano.png" alt="Descargar Archivo Pdf" title="Descargar Archivo Pdf"/>
                </div>
                <div className="centrado">Bloques Urbanos</div>
            </a>
            <a href="/app/direccion">
                <div className="centrado">
                    <img style={{cursor:"pointer"}} src="/img/direccion.png" alt="Descargar Archivo Pdf" title="Descargar Archivo Pdf"/>
                </div>
                <div className="centrado">Direcciones Activas</div>
            </a>
            <a href="/app/fuente/conexion">
                <div className="centrado">
                    <img style={{cursor:"pointer"}} src="/img/fuente.png" alt="Descargar Archivo Pdf" title="Descargar Archivo Pdf"/>
                </div>
                <div className="centrado">Fuentes/Conexiones</div>
            </a>
            <a href="/app/actividad/administrador">
                <div className="centrado">
                    <img style={{cursor:"pointer"}} src="/img/actividad_admi.png" alt="Descargar Archivo Pdf" title="Descargar Archivo Pdf"/>
                </div>
                <div className="centrado">Actividades/Gestion</div>
            </a>
            <a href="/app/reporte">
                <div className="centrado">
                    <img style={{cursor:"pointer"}} src="/img/reporte1.png" alt="Descargar Archivo Pdf" title="Descargar Archivo Pdf"/>
                </div>
                <div className="centrado">Reportes/Periodo</div>
            </a>
        </div>
    )}
    return null
}

const MenuCuadro = ({grupoUsuario, mostrarMenu, controlMenu}) => {
    if(mostrarMenu){ return (
    <div className="modal" onClick={controlMenu}>
        <div className="modal_ventana">
            <div className="">
                <OpcionesIcono grupoUsuario={grupoUsuario}></OpcionesIcono>
            </div>
        </div>
    </div>
    )} else { return null }
}

export default MenuCuadro;