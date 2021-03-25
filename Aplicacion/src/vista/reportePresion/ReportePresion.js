import React, {Component} from 'react';
import { verificarGrupoUsuario } from '../../datos/usuarioDB.js';
import { promesaListarZonasComponente} from '../../datos/zonaDB.js';
import { promesaTotalConexionesActivasZonaAltitud } from '../../datos/conexionDB';
import { numeroArabigoEnRomano , obtenerCodigoTipoAltitud} from '../../datos/funcionesSistema';
import { reporteEncuestaPresion } from '../../datos/reporteDB.js';

import UsuarioNoValido from '../../componentes/UsuarioNoValido.js';
import ModalDescargarArchivo from '../../componentes/DescargaArchivo.js';
import TablaReporteEncuesta from './TablaReporteEncuesta.js';
import TablaReportePonderado from './TablaReportePonderado.js';
import TablaReporteSevicio from './TablaReporteServicio.js';
import TablaReportePreMin from './TablaReportePreMin';
import TablaReportePreMax from './TablaReportePreMax';
import TablaReporteResumenPreMax from './TablaReporteResumenPreMax';
import TablaReporteResumenPreMin from './TablaReporteResumenPreMin';

var mesActual = parseInt(new Date().getMonth()) + 1;
var agnoActual = parseInt(new Date().getFullYear());

const estadoInicial = {
    usuario : verificarGrupoUsuario(),
    actividadPresiones : [], // Lista de actividades de presion
    promedioPresiones : [], // Lista de Promedios de Presiones
    zonas : [], // Lista de Zonas

    zonaReporte : "%",
    urbanoReporte : "%",
    altitudReporte : "%",
    mesReporte : mesActual,
    agnoReporte : agnoActual,
    
    agnos : [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026],
    mesesAgno : ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre' ,'Diciembre'],
    tiposAltitud : ['Alta','Media','Baja','Sin Especificar'],
    
    cantidadZonas : 0,
    cantidadPuntosMedidos : 0,
    cantidadPuntosRegistrados : 0,

    tipoReportePresion : "1",
    tituloReportePresion : [
        'REPORTE NO ENCONTRADO', // REPORTE N° 0
        'ENCUESTA DE PRESIONES DEL SERVICIO POR ZONA DE ABASTECIMIENTO',
        'PRESIONES PROMEDIO PONDERADO',
        'PRESIÓN DE SERVICIO',
        'PRESIONES MINIMA PROMEDIO',
        'RESUMEN PRESIÓN MINIMA',
        'PRESIONES MAXIMA PROMEDIO',
        'RESUMEN PRESIÓN MAXIMA',
    ],

    documento: {
        nombreArchivo : "",
        contenido : "",
        orientacion : "",
        idTabla : "",
    },

    mostrarReporte : false,
    mostrarDescargaArchivo : false
}

export class ReportePresion extends Component{
    constructor(props){
        super(props);
        this.state = estadoInicial;
    }

    listarZonas = () => { promesaListarZonasComponente().then(zonas => this.setState({ zonas }) )}
    
    mostrarReporte = () => { this.setState({ mostrarReporte : !this.state.mostrarReporte }) }

    mostrarDescargaArchivo = () => { 
        this.generarInformacionDocumento(this.state.actividadPresiones);
        this.setState({ mostrarDescargaArchivo : !this.state.mostrarDescargaArchivo })
    }

    cambiarMesReporte = (evento) => {
        this.setState({ mesReporte : evento.target.value, mostrarReporte : false },() => this.reportePresion());
    }

    cambiarAgnoReporte = (evento) => {
        this.setState({ agnoReporte : evento.target.value, mostrarReporte : false },() => this.reportePresion());
    }

    cambiarZonaReporte = (evento) => {
        this.setState({ zonaReporte : evento.target.value, mostrarReporte : false },() => this.reportePresion());     
    }

    cambiarAltitudReporte = (evento) => {
        this.setState({ altitudReporte : evento.target.value, mostrarReporte : false },() => this.reportePresion());
    }

    cambiarTipoReporte = (evento) => {
        this.setState({ tipoReportePresion : evento.target.value, mostrarReporte : false });
    }

    reportePresion = () => {
        const Busqueda = {
            codigoZona : this.state.zonaReporte,
            codigoUrbano : this.state.urbanoReporte,
            tipoAltitud : this.state.altitudReporte,
            mesPeriodo : this.state.mesReporte,
            agnoPeriodo : this.state.agnoReporte,
        }
        reporteEncuestaPresion(Busqueda).then(presiones => {
            this.setState({
                actividadPresiones : presiones,
                cantidadPuntosRegistrados : presiones.length, 
                cantidadPuntosMedidos : this.verificarRegistrosCompletos(presiones)
            });
            if(presiones.length > 0){ this.generarReporte(presiones) }
        });
    }

    generarReporte = (presiones) => {

        var cantidadZonas = 0;
        var actividadPresiones = [];
        var promedioPresiones = [];

        this.state.zonas.filter(zona => { 
            if(this.state.zonaReporte === "%" ){ return zona.esSector }
            else { return zona.esSector && zona.codigoZona.toString() === this.state.zonaReporte }
         }).map(zonaSector => {
            cantidadZonas = cantidadZonas + 1;
            this.state.tiposAltitud.filter(altitud => {
                if(this.state.altitudReporte === "%"){ return obtenerCodigoTipoAltitud(altitud) !== 0 }
                else { return obtenerCodigoTipoAltitud(altitud).toString() === this.state.altitudReporte }   
            })
            .map(altitud => {
                var tipoAltitud = obtenerCodigoTipoAltitud(altitud);
                this.state.zonas.map( z => {
                    if(zonaSector.sector === 1){
                        if(z.sector === zonaSector.sector && z.subSector === zonaSector.subSector ){
                            const actividades = this.insertarPromedioZonaAltitud(presiones,z.codigoZona,zonaSector.codigoZona,tipoAltitud)
                            actividades.forEach(actividad => { actividadPresiones.push(actividad) });
                        }
                    }else{
                        if(z.sector === zonaSector.sector){
                            const actividades = this.insertarPromedioZonaAltitud(presiones,z.codigoZona,zonaSector.codigoZona,tipoAltitud)
                            actividades.forEach(actividad => { actividadPresiones.push(actividad) });                        
                        }
                    }
                    return 0;
                });
                const Busqueda = {
                    codigoZona : zonaSector.codigoZona,
                    tipoAltitud : tipoAltitud,
                    mesPeriodo : this.state.mesReporte,
                    agnoPeriodo : this.state.agnoReporte,
                }
                promesaTotalConexionesActivasZonaAltitud(Busqueda).then(conexion => {
                    const promedioPresionZonaAltitud = this.insertarTotalConexionesActivas(actividadPresiones,zonaSector.codigoZona,tipoAltitud,(conexion.conexionesActivas ||0 ))
                    promedioPresiones.push(promedioPresionZonaAltitud);
                });
                return 0;
            });
            return 0;
        });

        this.setState({ actividadPresiones: actividadPresiones, promedioPresiones: promedioPresiones, cantidadZonas });
    }

    insertarTotalConexionesActivas = (actividadPresiones, codigoZonaReporte, tipoAltitud, conexionesActivas ) => {

        var promedioPresionAltitud = 0;
        var cantidadPresionAltitud = 0;

        actividadPresiones.map(presion => {
            if(presion.codigoZonaReporte === codigoZonaReporte && presion.tipoAltitud === tipoAltitud){           
                promedioPresionAltitud = promedioPresionAltitud + presion.promedioPresion;
                cantidadPresionAltitud = cantidadPresionAltitud + 1;
            }
            return 0;
        });

        var promedio  = (promedioPresionAltitud / cantidadPresionAltitud) || 0;

        var producto = promedio * conexionesActivas;

        const promedioPresion = {
            promedio : promedio,
            conexionesActivas : conexionesActivas,
            producto : producto,
            codigoZona : codigoZonaReporte,
            tipoAltitud : tipoAltitud,
        };
        

        return promedioPresion ;
    }

    insertarPromedioZonaAltitud = (presiones, codigoZona, codigoZonaReporte, tipoAltitud ) => {
        
        const actividades = [];

        var hRed = 1;
        var decimalMultiplicador = 0.703;

        presiones.map(presion => {
            if(presion.codigoZona === codigoZona && presion.tipoAltitud === tipoAltitud){
                               
                var promedioPresion = (presion.lecturaAbajo * decimalMultiplicador) + hRed;

                presion["promedioPresion"] = promedioPresion;
                presion["codigoZonaReporte"] = codigoZonaReporte;

                actividades.push(presion);
            }
            return 0;
        });

       return actividades ;
    }

    verificarRegistrosCompletos = (presiones) => {
        var datosVacios = 0;
        presiones.map( presion => {
            if(presion.codigoPresion === 'sin datos'){ datosVacios = datosVacios + 1;}
            return 0;
        });
        return presiones.length - datosVacios;
    }

    generarInformacionDocumento = (actividadPresiones) => {
        var { documento } = this.state;
        switch (this.state.tipoReportePresion) {
            case "1":
                documento.nombreArchivo = "ReportePresionEncuesta";
                documento.idTabla = "tablaReportePresionEncuesta";
                documento.contenido = "Zona;Altitud;Urbanización-Calle;MañanasDe;MañanasA;TardesDe;TardesA;Total;PromedioPonderado\n";
                documento.orientacion = "landscape";
                actividadPresiones.map(a => documento.contenido = documento.contenido + 
                    a.codigoPresion + ";" + a.tipoAltitud + "\n" )
            break;
            case "2":
                documento.nombreArchivo = "ReportePresionPonderado";
                documento.idTabla = "tablaReportePresionPonderado";
                documento.contenido = "Zona;Altitud;Prom;Hora;Minuto;Representa;Cont. Prom.;Conex. Act.;Producto;Cont Pond\n";
                documento.orientacion = "landscape";
                actividadPresiones.map(a =>  documento.contenido = documento.contenido + 
                    a.codigoPresion + ";" + a.tipoAltitud + "\n" ) 
            break;
            case "3":
                documento.nombreArchivo = "ReportePresionServicio";
                documento.idTabla = "tablaReportePresionServicio";
                documento.contenido = "Zona;Area De Servicio;Numero De Conexiones;Horas;Peso(1)Ponderado\n";
                documento.orientacion = "portrait";
                actividadPresiones.map(a =>  documento.contenido = documento.contenido + 
                    a.codigoPresion + ";" + a.tipoAltitud + "\n" )
            break;
            case "4":                
                documento.nombreArchivo = "ReportePresionMinima";
                documento.idTabla = "tablaReportePresionMinima";
                documento.contenido = "CODIGO_ZONA;DENOMINACION_ZONA;VALORNUMERO\n";
                documento.orientacion = "landscape";
                actividadPresiones.map(a =>  documento.contenido = documento.contenido + 
                    a.codigoPresion + ";" + a.tipoAltitud + "\n" )
            break;
            case "5":                
                documento.nombreArchivo = "ReportePresionResumenPreMin";
                documento.idTabla = "tablaReportePresionResumenPreMin";
                documento.contenido = "CODIGO_ZONA;DENOMINACION_ZONA;VALORNUMERO\n";
                documento.orientacion = "portrait";
                actividadPresiones.map(a =>  documento.contenido = documento.contenido + 
                    a.codigoPresion + ";" + a.tipoAltitud + "\n" )
            break;
            case "6":                
                documento.nombreArchivo = "ReportePresionMaxima";
                documento.idTabla = "tablaReportePresionMaxima";
                documento.contenido = "CODIGO_ZONA;DENOMINACION_ZONA;VALORNUMERO\n";
                documento.orientacion = "landscape";
                actividadPresiones.map(a =>  documento.contenido = documento.contenido + 
                    a.codigoPresion + ";" + a.tipoAltitud + "\n" )
            break;
            case "7":                
                documento.nombreArchivo = "ReportePresionResumenPreMax";
                documento.idTabla = "tablaReportePresionResumenPreMax";
                documento.contenido = "CODIGO_ZONA;DENOMINACION_ZONA;VALORNUMERO\n";
                documento.orientacion = "portrait";
                actividadPresiones.map(a =>  documento.contenido = documento.contenido + 
                    a.codigoPresion + ";" + a.tipoAltitud + "\n" )
            break;
            default: break;
        }
        this.setState({ documento });
    }
    
    componentDidMount(){
        if(this.state.usuario.grupo > 0) {
            this.listarZonas();
            this.reportePresion();
        }// else{ this.props.history.push('/') }
    }

    render(){
        if(this.state.usuario.grupo > 0){
        return(
            <div className="contenedor">
                <div className="centrado">
                    <div className="buscador_actividad_reporte">
                        <div className="centrado">
                            <div>
                                <select className="cuadro_dato" value={this.state.mesReporte} onChange={this.cambiarMesReporte}>
                                    { this.state.mesesAgno.map( (mes, indice) => ( <option key={indice} value={indice + 1}> {mes} </option> ) ) }
                                </select> 
                                &nbsp; &mdash; &nbsp;
                                <select className="cuadro_dato" value={this.state.agnoReporte} onChange={this.cambiarAgnoReporte}>
                                    { this.state.agnos.map((a, indice) => <option key={indice} value={a}>{a}</option> )}
                                </select>
                            </div>
                        </div>
                        <select hidden={true} className="cuadro_dato" onChange={this.cambiarZonaReporte}>
                            <option value="%">Zonas (TODO)</option>
                            {   this.state.zonas.filter(zona => { return zona.esSector } ).map(zona => (
                                <option key={zona.codigoZona} value={zona.codigoZona}>
                                    { zona.denominacionZona + '( Zona \u0020' + numeroArabigoEnRomano(zona.sector) + (parseInt(zona.subSector) === 0 ? '':" \u2014 " + numeroArabigoEnRomano(zona.subSector)) + (zona.microSector === '-' ? '':" \u2014 "+zona.microSector)+" )"}
                                </option> ))}
                        </select>
                        <select hidden={true} className="cuadro_dato" onChange={this.cambiarAltitudReporte}>
                            <option value="%">Altitud (TODO)</option>
                            {   this.state.tiposAltitud.filter(altitud => { return obtenerCodigoTipoAltitud(altitud) !== 0 }).map(altitud => (
                                <option key={altitud} value={ obtenerCodigoTipoAltitud(altitud) }>
                                    {altitud}
                                </option>
                            ))}
                        </select>
                        <select className="cuadro_dato" value={this.state.tipoReporteContinuidad} onChange={this.cambiarTipoReporte}>
                            <option value="1">Encuesta de Presiones del Servicio</option>
                            <option value="2">Presiones Promedio Ponderado</option>
                            <option value="3">Presión de Servicio</option>
                            <option value="4">Presión Minima</option>
                            <option value="5">Resumen Presión Minima</option>
                            <option value="6">Presión Maxima</option>
                            <option value="7">Resumen Presión Maxima</option>
                        </select>
                    </div>
                </div> 
                <br />
                <div className="centrado">
                    <div className="cuadro_mensaje informacion">
                        <div><b>Resumen de Reporte</b></div>
                        <hr />
                        <p>Zonas: {this.state.cantidadZonas}</p>
                        <p>Puntos Registrados: {this.state.cantidadPuntosRegistrados}</p>
                        <p>Puntos Medidos: {this.state.cantidadPuntosMedidos}</p>                                
                        <div hidden = {this.state.cantidadPuntosRegistrados < 1} className="dos_columnas">
                            <button className="boton boton_verde" onClick={this.mostrarReporte}>Generar<br/>Reporte</button>
                            <button className={"boton "+(!this.state.mostrarReporte?"boton_rojo":"boton_verde")} onClick={this.mostrarDescargaArchivo} disabled={ !this.state.mostrarReporte }>Descargar<br/>Reporte</button>
                        </div>
                    </div>
                </div>
                <hr />   
                <h2 style={{textAlign:'center'}}>{this.state.tituloReportePresion[this.state.tipoReportePresion]}<br />{this.state.mesesAgno[this.state.mesReporte-1]}, {this.state.agnoReporte}</h2> 
                
                {/* REPORTE N° 1*/}
                <TablaReporteEncuesta
                    mostrarReporte = {this.state.mostrarReporte}
                    zonas = {this.state.zonas}
                    tiposAltitud = {this.state.tiposAltitud}
                    zonaReporte = {this.state.zonaReporte}
                    altitudReporte = {this.state.altitudReporte}
                    actividadPresiones = {this.state.actividadPresiones}
                    tipoReportePresion = {this.state.tipoReportePresion}
                />

                {/* REPORTE N° 2*/}
                <TablaReportePonderado
                    mostrarReporte = {this.state.mostrarReporte} 
                    promedioPresiones = {this.state.promedioPresiones}
                    zonas = {this.state.zonas}
                    tiposAltitud = {this.state.tiposAltitud}
                    zonaReporte = {this.state.zonaReporte}
                    altitudReporte = {this.state.altitudReporte}
                    tipoReportePresion = {this.state.tipoReportePresion}
                />

                {/* REPORTE N° 3*/}
                <TablaReporteSevicio
                    mostrarReporte = {this.state.mostrarReporte} 
                    promedioPresiones = {this.state.promedioPresiones}
                    zonas = {this.state.zonas}
                    zonaReporte = {this.state.zonaReporte}
                    tipoReportePresion = {this.state.tipoReportePresion}
                />

                {/* REPORTE N° 4*/}
                <TablaReportePreMin
                    mostrarReporte = {this.state.mostrarReporte} 
                    tipoReportePresion = {this.state.tipoReportePresion}
                    promedioPresiones = {this.state.promedioPresiones}
                    zonas = {this.state.zonas}
                    tiposAltitud = {this.state.tiposAltitud}
                    zonaReporte = {this.state.zonaReporte}
                    altitudReporte = {this.state.altitudReporte}
                    actividadPresiones = {this.state.actividadPresiones}
                />

                {/* REPORTE N° 5*/}
                <TablaReporteResumenPreMin
                    mostrarReporte = {this.state.mostrarReporte} 
                    tipoReportePresion = {this.state.tipoReportePresion}
                    zonas = {this.state.zonas}
                    zonaReporte = {this.state.zonaReporte}
                />

                {/* REPORTE N° 6*/}
                <TablaReportePreMax
                    mostrarReporte = {this.state.mostrarReporte} 
                    tipoReportePresion = {this.state.tipoReportePresion}
                    promedioPresiones = {this.state.promedioPresiones}
                    zonas = {this.state.zonas}
                    tiposAltitud = {this.state.tiposAltitud}
                    zonaReporte = {this.state.zonaReporte}
                    altitudReporte = {this.state.altitudReporte}
                    actividadPresiones = {this.state.actividadPresiones}
                />

                {/* REPORTE N° 7*/}
                <TablaReporteResumenPreMax
                    mostrarReporte = {this.state.mostrarReporte} 
                    tipoReportePresion = {this.state.tipoReportePresion}
                    zonas = {this.state.zonas}
                    zonaReporte = {this.state.zonaReporte}
                />

                <ModalDescargarArchivo
                    titulo = {""}
                    mensaje = {"Escoja el tipo de Documento que se Descargara"}
                    mostrarDescargaArchivo = { this.state.mostrarDescargaArchivo }
                    controlDescargaArchivo = { this.mostrarDescargaArchivo }
                    documento = { this.state.documento }
                    tipoReporte = { this.state.tipoReportePresion }
                />
            </div>
        )
        } else { return <UsuarioNoValido /> }
    }
}

export default ReportePresion