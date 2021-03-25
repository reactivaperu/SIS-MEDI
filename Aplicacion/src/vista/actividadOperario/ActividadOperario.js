/*
-- File:             ActividadOperario.js
-- Project Name:     MediSeda
-- Version:          0.0.1
-- Description:      Interfaz UI para Actividad de Operarios
-- Author:           Jorge Muñiz
-- Create Date:      2019-10-02
-- @Copyright        Jorge.Muñiz.Velasquez - World Connect Perú - 2019           
*/
//IMPORTAR FUNCIONES
import React, { Component } from 'react'
import { promesaListarActividadPorUsuario, promesaBuscarActividad } from '../../datos/actividadDB';
import { registrarMedicionPresion,modificarLecturasPresion } from '../../datos/presionDB';
import { registrarMedicionContinuidad,modificarHorasContinuidad } from '../../datos/continuidadDB';
import { buscarObservacion,registrarObservacion,modificarObservacion } from '../../datos/observacionDB.js';
import { obtenerFecha, verificarEstadoActividad, listaMesesAgno, listaAgnos } from '../../datos/funcionesSistema';
import { verificarGrupoUsuario } from '../../datos/usuarioDB.js';

//IMPORTAR COMPONENTES
import ModalMedicion from './ModalMedicion.js';
import ModalObservacion from './ModalObservacion.js';
import CuadroMensaje from '../../componentes/CuadroMensaje.js';
import UsuarioNoValido from '../../componentes/UsuarioNoValido.js';

var fechaHoy = obtenerFecha();

const actividadInicial = {

    codigoContinuidad : "",
    codigoPresion : "",

    codigoActividad : "",
    codigoDireccion : "",
    codigoUsuario : "",
    denominacionLote : "",
    estadoActividad : "",
    fechaCreacion : "",
    fechaFinal : "",
    microSector : "",
    sector : "",
    subSector : "",
    tipoInscripcion : "",
    tipoMedicion : "",
    lecturaArriba : "",
    lecturaAbajo : "",
    r1HoraDe : "",
    r1HoraA : "",
    r2HoraDe : "",
    r2HoraA : "",

    codigoObservacion : "",
    textoObservacion : "",
}

const estadoInicial = {

    usuario : verificarGrupoUsuario(), // Usuario registrado
    codigoZona : "1", // Codigo de Zona Seleccionada para filtrado de Actividades
    codigoUrbano : "%", // Codigo de Bloque Urbano para filtrado de Actividades
    tipoAltitud : "%", // Tipo de altitud para filtrado de Actividades
    tipoActividad : "1", // Tipo de Actividad para filtrado de Actividades (Presión - 1) (Continuidad - 0)

    mesPeriodo : fechaHoy.split('-')[1], // Mes del Periodo para filtrar Actividades
    agnoPeriodo : fechaHoy.split('-')[0], // Agno del Periodo para filtrar Actividades

    actividades : [],
    sugerenciasActividades : [],
    paginaActual : 1, // Pagina Actual del Paginado
    articulosPagina : 10, // Articulos que se mostraran por Pagina
    cantidadPaginas : 0, // Cantidad de Paginas que tendra la paginacion
    textoActividadBuscar :"",

    mostrarModalMedicion : false,
    mostrarModalObservacion : false,

    zonas : [], // Lista de Zonas registradas y habilitadas
    direcciones : [], // Lista de Direcciones habilitados
    bloques : [], // Lista de Bloques Urbanos habilitados

    actividadSeleccion : actividadInicial,
}

export class Actividad extends Component {
    constructor(props){
        super(props);
        this.state = estadoInicial;
    }

    cambiarPeriodo = (evento) => this.setState({ [evento.target.id]: evento.target.value },() => this.listarActividadesPorUsuario());
        
    cambiarTipoActividad = (evento) => this.setState({ tipoActividad : evento.target.value },() => this.listarActividadesPorUsuario());

    cambiarBloqueUrbano = (evento) => this.setState({ codigoUrbano : evento.target.value },() => this.listarActividadesPorUsuario());

    listarActividadesPorUsuario = () => {
        const Busqueda = {
            codigoUsuario : this.state.usuario.codigoUsuario,
            codigoUrbano: this.state.codigoUrbano,
            mesPeriodo : this.state.mesPeriodo,
            agnoPeriodo : this.state.agnoPeriodo,
            //tipoActividad : this.state.tipoActividad
        }
        var { bloques } = this.state;
        promesaListarActividadPorUsuario(Busqueda).then(actividades => {
            if(!actividades.error) {
                if(bloques.length<1){
                    actividades.forEach(actividad=> {
                        var existe = false;
                        if(bloques.length<1){
                            bloques.push({codigoUrbano:actividad.codigoUrbano,denominacionBloque:actividad.denominacionBloque});
                        }else{
                            for(var j=0;j<bloques.length;j++){
                                if(actividad.codigoUrbano === bloques[j].codigoUrbano){existe=true;}
                            }
                            if(!existe){
                                bloques.push({codigoUrbano:actividad.codigoUrbano,denominacionBloque:actividad.denominacionBloque});
                            }
                        }
                    });
                }
                this.setState({ actividades:actividades,sugerenciasActividades:actividades,bloques});
            };
        });
    }

    seleccionarActividad = (Actividad) => {
        const Busqueda={
            codigoDireccion:Actividad.codigoDireccion,
            mesPeriodo:this.state.mesPeriodo,
            agnoPeriodo:this.state.agnoPeriodo
        }
        promesaBuscarActividad(Busqueda).then(res => {
            if(!res.error){ this.setState({actividadSeleccion : res}) }
            else { this.setState({actividadSeleccion : Actividad}) }
            this.controlModalMedicion();
        });
    }

    agregarObservacion = (actividad) => {
        buscarObservacion(actividad.codigoActividadPresion).then(res => {
            if(!res.error){
                actividad["codigoObservacion"] = res.codigoObservacion;
                actividad["textoObservacion"] = res.textoObservacion;
                this.setState({ actividadSeleccion : actividad });
            }else{
                this.setState({ actividadSeleccion : actividad });
            }
        });
        this.controlModalObservacion();
    }

    controlModalObservacion = () => {
        if(this.state.mostrarModalObservacion){
            this.setState({ actividadSeleccion: actividadInicial });
        }
        this.setState({ mostrarModalObservacion : !this.state.mostrarModalObservacion });
    }

    controlModalMedicion = () => {
        if(this.state.mostrarModalMedicion){
            this.setState({ actividadSeleccion: actividadInicial });
        }
        this.setState({ mostrarModalMedicion : !this.state.mostrarModalMedicion });
    }

    modificarActividadEstado = (evento) => {
        const { actividadSeleccion } = this.state;
        actividadSeleccion[evento.target.id] = evento.target.value
        this.setState({ actividadSeleccion });
        if(evento.target.id === "codigoZona"){
            this.listarDirecciones();
        }
    }

    guardarActividad = (evento) => {
        evento.preventDefault();

        const presion = {
            codigoActividad:this.state.actividadSeleccion.codigoActividadPresion,
            lecturaArriba:this.state.actividadSeleccion.lecturaArriba,
            lecturaAbajo:this.state.actividadSeleccion.lecturaAbajo,
            quien : this.state.usuario.firmaDigital
        }
        const continuidad = {
            codigoActividad : this.state.actividadSeleccion.codigoActividadContinuidad,
            r1HoraDe : this.state.actividadSeleccion.r1HoraDe,
            r1HoraA : this.state.actividadSeleccion.r1HoraA,
            r2HoraDe : this.state.actividadSeleccion.r2HoraDe,
            r2HoraA : this.state.actividadSeleccion.r2HoraA,
            quien : this.state.usuario.firmaDigital
        }

        if(this.state.actividadSeleccion.codigoPresion === "Sin datos"){
            registrarMedicionPresion(presion).then(res => {} );
        }else{
            modificarLecturasPresion(presion).then(res => {});                
        }
        if(this.state.actividadSeleccion.codigoContinuidad === "Sin datos"){
            registrarMedicionContinuidad(continuidad).then(res => this.listarActividadesPorUsuario() );
        }else{
            modificarHorasContinuidad(continuidad).then(res => this.listarActividadesPorUsuario() );
        }
        
        this.controlModalMedicion();
    }

    guardarObservacion = (evento) => {
        evento.preventDefault();
        const observacion = {
            codigoObservacion: this.state.actividadSeleccion.codigoObservacion,
            codigoActividad: this.state.actividadSeleccion.codigoActividadPresion,
            textoObservacion: this.state.actividadSeleccion.textoObservacion,
            tipoActividad: 1,quien: this.state.usuario.firmaDigital
        }
        if(observacion.codigoObservacion > 0){ modificarObservacion(observacion) }
        else{ registrarObservacion(observacion) }
        this.controlModalObservacion();
    }

    componentDidMount(){
        if(this.state.usuario.grupo === 0){
                this.listarActividadesPorUsuario();

        }//else{ this.props.history.push('/') }
    }

    render() {
        if(this.state.usuario.grupo === 0){
        return(
            <div className="contenedor">
                <div className="centrado">
                    <div>
                        <select className="cuadro_dato" onChange={this.cambiarPeriodo} id="mesPeriodo" value={this.state.mesPeriodo}>
                        { listaMesesAgno.map(mes => ( 
                            <option value={mes.letra} key={mes.numero}>{mes.nombre}</option>
                        ))}
                        </select>
                        &nbsp; &mdash; &nbsp;
                        <select className="cuadro_dato" onChange={this.cambiarPeriodo} value={this.state.agnoPeriodo} id="agnoPeriodo">
                        {listaAgnos.map((agno,key) => ( 
                            <option value={agno} key={key}>{agno}</option>
                        ))}
                        </select>
                    </div>
                </div>
                <br />
                <div className="centrado">
                    <select className="cuadro_dato actividad_operador" onChange={this.cambiarBloqueUrbano} id="bloqueUrbano" value={this.state.codigoUrbano}>
                        <option value="%">-- Bloque Urbano --</option>
                        {(this.state.bloques||[]).map(bloque=>
                        <option key={bloque.codigoUrbano} value={bloque.codigoUrbano}>{(bloque.denominacionBloque||"").toUpperCase()}</option>
                        )}
                    </select>
                </div>
                <br />
                <div className="centrado">
                <table className="actividad_operador">
                    <thead>
                        <tr>
                            <th>Actividad</th>
                            <th>Obs.</th>
                        </tr>
                    </thead>
                    {(this.state.bloques||[]).filter(b=>{
                        if(parseInt(this.state.codigoUrbano) === b.codigoUrbano){ return true }
                        if(this.state.codigoUrbano === '%'){ return true } else { return false; }
                    })
                    .map(bloque => {
                        return ( 
                        <tbody key={bloque.codigoUrbano}>
                            <tr><td colSpan={6} style={{color:"red",textAlign:'center',padding:"10px", fontSize:"20px", borderBottom:"3px solid #10679E"}}>
                                <b> { (bloque.denominacionBloque||"").toUpperCase()} - SECTOR ({bloque.codigoUrbano})</b>
                            </td></tr>
                            {(this.state.sugerenciasActividades.filter(a=>a.codigoUrbano===bloque.codigoUrbano)
                            .sort((a1,a2)=>{return a1.ordenBloque-a2.ordenBloque}).map(actividad=>{
                                var estadoActividad = verificarEstadoActividad(actividad.estadoPresion, actividad.estadoContinuidad,actividad.fechaFinal); // Para verificar el estado de la actividad
                                return(
                                <tr key={actividad.codigoDireccion} style={{borderBottom:"1px solid lightgray"}}>
                                    <td style={{textAlign:'center'}} onClick={() => this.seleccionarActividad(actividad)}>
                                        <div className="item_actividad_operador">
                                            <div>
                                                <b>{actividad.denominacionLote}</b>
                                                <br/>
                                                <label style={{fontSize:"13px"}}><b>Inscripcción: </b>{actividad.codigoInscripcion}</label>
                                            </div>
                                            <div style={{color:estadoActividad.colorAvance}}><b>Avance: {estadoActividad.mensaje}</b></div>
                                            <div className={"cuadro_mensaje "+(estadoActividad.cuadro)} style={{color:estadoActividad.colorFecha}}><b>Entrega: {actividad.fechaFinal}</b></div>
                                        </div>
                                    </td>
                                    <td style={{textAlign:'center'}} onClick={() => this.agregarObservacion(actividad)}>
                                        <img src="/img/agregarObservacion.png" alt="Agregar Observacion" title="Agregar Observacion"/>
                                    </td>
                                </tr>
                                )
                            }))
                            }
                        </tbody>
                    )})}
                </table> 
                </div>
                <div className="centrado">
                    {this.state.sugerenciasActividades.length > 0 ? null : <div className="actividad_operador"><CuadroMensaje tipoCuadro={"basico"}>No EXISTEN datos para mostrar</CuadroMensaje></div>  }
                </div>
                <ModalMedicion
                    actividad = {this.state.actividadSeleccion}
                    controlModalMedicion = {this.controlModalMedicion}
                    mostrarModalMedicion = {this.state.mostrarModalMedicion}
                    guardarActividad = {this.guardarActividad}
                    modificarActividadEstado = {this.modificarActividadEstado}
                    mesPeriodo={this.state.mesPeriodo}
                    agnoPeriodo={this.state.agnoPeriodo}
                ></ModalMedicion>
                <ModalObservacion
                    actividad={this.state.actividadSeleccion}
                    controlModalObservacion={this.controlModalObservacion}
                    mostrarModalObservacion={this.state.mostrarModalObservacion}
                    guardarObservacion={this.guardarObservacion}
                    modificarActividadEstado={this.modificarActividadEstado}
                ></ModalObservacion>
            </div>
        )} else { return <UsuarioNoValido /> }
    }
}

export default Actividad;