import React, {Component} from 'react';
import UsuarioNoValido from '../../componentes/UsuarioNoValido.js';
import ModalDescargarArchivo from '../../componentes/DescargaArchivo.js';
import TablaReporteEncuesta from './TablaReporteEncuesta.js';
import TablaReportePonderado from './TablaReportePonderado.js';
import TablaReporteSevicio from './TablaReporteServicio.js';
import TablaRerporte6Hr from './TablaReporte6Hr.js';
import TablaRerporte18Hr from './TablaReporte18Hr.js';
import TablaReporteResumen6Hrs from  './TablaReporteResumen6Hrs.js';
import TablaReporteResumen18Hrs from  './TablaReporteResumen18Hrs.js';
import TablaReporteResumen from './TablaReporteResumen.js';

import { verificarGrupoUsuario } from '../../datos/usuarioDB.js';
import { reporteEncuestaContinuidad } from '../../datos/reporteDB.js';
import { totalHoraZonaAltitudContinuidad } from '../../datos/continuidadDB.js';
import { promesaListarZonasComponente} from '../../datos/zonaDB.js';
import { numeroArabigoEnRomano, obtenerCodigoTipoAltitud } from '../../datos/funcionesSistema';

var mesActual = parseInt(new Date().getMonth()) + 1;
var agnoActual = parseInt(new Date().getFullYear());

const estadoInicial = {
    usuario : verificarGrupoUsuario(),
    actividadContinuidades : [], // Lista de actividades de Continuidad
    promedioPonderados : [], // Lista de Promedios Ponderados

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

    tipoReporteContinuidad : "1",
    tituloReporteContinuidad : [
        'REPORTE NO ENCONTRADO', // REPORTE N° 0
        'ENCUESTA DE CONTINUIDAD DEL SERVICIO POR ZONA DE ABASTECIMIENTO',
        'CONTINUIDAD PROMEDIO PONDERADO',
        'CONTINUIDAD DE HORAS DE SERVICIO',
        'CONTINUIDAD MENOR A 6 HORAS',
        'RESUMEN CONTINUIDAD MENOR A 6 HORAS',
        'CONTINUIDAD MENOR A 18 HORAS',
        'RESUMEN CONTINUIDAD MENOR A 18 HORAS',
        'RESUMEN CONTINUIDAD'
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

export class ReporteContinuidad extends Component{

    constructor(props){
        super(props);
        this.state = estadoInicial;
    }

    listarZonas = () => { promesaListarZonasComponente().then(zonas => this.setState({ zonas }) )}
    
    mostrarReporte = () => { this.setState({ mostrarReporte : !this.state.mostrarReporte }) }

    mostrarDescargaArchivo = () => { 
        this.generarInformacionDocumento(this.state.actividadContinuidades);
        this.setState({ mostrarDescargaArchivo : !this.state.mostrarDescargaArchivo })
    }

    cambiarMesReporte = (evento) => {
        this.setState({ mesReporte : evento.target.value, mostrarReporte : false },() => this.reporteContinuidad());
    }

    cambiarAgnoReporte = (evento) => {
        this.setState({ agnoReporte : evento.target.value, mostrarReporte : false },() => this.reporteContinuidad());
    }

    cambiarZonaReporte = (evento) => {
        this.setState({ zonaReporte : evento.target.value, mostrarReporte : false },() => this.reporteContinuidad());     
    }

    cambiarAltitudReporte = (evento) => {
        this.setState({ altitudReporte : evento.target.value, mostrarReporte : false },() => this.reporteContinuidad());
    }

    cambiarTipoReporte = (evento) => {
        this.setState({ tipoReporteContinuidad : evento.target.value, mostrarReporte : false });
    }

    reporteContinuidad = () => {
        const Busqueda = {
            codigoZona : this.state.zonaReporte,
            codigoUrbano : this.state.urbanoReporte,
            tipoAltitud : this.state.altitudReporte,
            mesPeriodo : this.state.mesReporte,
            agnoPeriodo : this.state.agnoReporte,
        }
        reporteEncuestaContinuidad(Busqueda).then(continuidades => {
            this.setState({ 
                cantidadPuntosRegistrados : continuidades.length, 
                cantidadPuntosMedidos : this.verificarRegistrosCompletos(continuidades)
            });
            this.generarReporte(continuidades);
        });
    }

    verificarRegistrosCompletos = (continuidades) => {
        var datosVacios = 0;
        continuidades.map( continuidad => {
            if(continuidad.codigoContinuidad === 'sin datos'){ datosVacios = datosVacios + 1;}
            return 0;
        });
        return continuidades.length - datosVacios;
    }

    generarReporte = ( continuidades ) => {
        
        var cantidadZonas = 0;
        var actividadContinuidades = [];
        var promedioPonderados = [];        
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
                const Busqueda = {
                    codigoZona : zonaSector.codigoZona,
                    codigoUrbano : "%",
                    tipoAltitud : tipoAltitud,
                    mesPeriodo : this.state.mesReporte,
                    agnoPeriodo : this.state.agnoReporte,
                }
                totalHoraZonaAltitudContinuidad(Busqueda).then(promedio => {
                    this.state.zonas.map( z => {
                        if(zonaSector.sector === 1){
                            if(z.sector === zonaSector.sector && z.subSector === zonaSector.subSector ){
                                const actividades = this.insertarPonderado(continuidades,z.codigoZona,zonaSector.codigoZona,tipoAltitud,promedio.promedioHora)
                                actividades.forEach(actividad => { actividadContinuidades.push(actividad) });
                            }
                        }else{
                            if(z.sector === zonaSector.sector){
                                const actividades = this.insertarPonderado(continuidades,z.codigoZona,zonaSector.codigoZona,tipoAltitud,promedio.promedioHora)
                                actividades.forEach(actividad => { actividadContinuidades.push(actividad) });
                            }
                        }
                        return 0;
                    });
                    promedio = this.calcularPromedios(promedio);
                    promedio["codigoZona"] = zonaSector.codigoZona;
                    promedio["tipoAltitud"] = tipoAltitud;

                    promedioPonderados.push(promedio);
                })
                return 0;
            });
            return 0;
        });

        this.setState({ 
            actividadContinuidades: actividadContinuidades,
            promedioPonderados : promedioPonderados, cantidadZonas
        });
    }

    calcularPromedios = ( promedio ) => {
        var hora = parseFloat((promedio.promedioHora || "00:00").substring(0,2));
        var minuto = parseFloat((promedio.promedioHora || "00:00").substring(3,5));
        var representa = parseFloat((minuto / 60).toFixed(2));

        var contProm = (hora + representa);
        var producto = parseFloat((contProm * promedio.conexionesActivas).toFixed(6));

        promedio["hora"] = hora;
        promedio["minuto"] = minuto;
        promedio["representa"] = representa;
        promedio["contProm"] = contProm;
        promedio["producto"] = producto;

        return promedio;
    }

    insertarPonderado = (continuidades, codigoZona, codigoZonaReporte, tipoAltitud, promedioPonderado) => {
        const actividades = [];
        continuidades.map(continuidad => {
            if(continuidad.codigoZona === codigoZona && continuidad.tipoAltitud === tipoAltitud){
                continuidad["promedioHora"] = promedioPonderado;
                continuidad["codigoZonaReporte"] = codigoZonaReporte;
                actividades.push(continuidad);
            }
            return 0;
        });
        return actividades;
    }

    generarInformacionDocumento = (actividadContinuidades) => {
        var { documento } = this.state;

        switch (this.state.tipoReporteContinuidad) {
            case "1":
                documento.nombreArchivo = "ReporteContinuidadEncuesta";
                documento.idTabla = "tablaReporteContinuidadEncuesta";
                documento.contenido = "Zona;Altitud;Urbanización-Calle;MañanasDe;MañanasA;TardesDe;TardesA;Total;PromedioPonderado\n";
                documento.orientacion = "landscape";
                actividadContinuidades.map(a => documento.contenido = documento.contenido + 
                    a.codigoContinuidad + ";" + a.tipoAltitud + "\n" )     
            break;
            case "2":
                documento.nombreArchivo = "ReporteContinuidadPonderado";
                documento.idTabla = "tablaReporteContinuidadPonderado";
                documento.contenido = "Zona;Altitud;Prom;Hora;Minuto;Representa;Cont. Prom.;Conex. Act.;Producto;Cont Pond\n";
                documento.orientacion = "landscape";
                actividadContinuidades.map(a =>  documento.contenido = documento.contenido + 
                    a.codigoContinuidad + ";" + a.tipoAltitud + "\n" )
            break;
            case "3":
                documento.nombreArchivo = "ReporteContinuidadServicio";
                documento.idTabla = "tablaReporteContinuidadServicio";
                documento.contenido = "Zona;Area De Servicio;Numero De Conexiones;Horas;Peso(1)Ponderado\n";
                documento.orientacion = "portrait";
                actividadContinuidades.map(a =>  documento.contenido = documento.contenido + 
                    a.codigoContinuidad + ";" + a.tipoAltitud + "\n" ) 
            break;
            case "4":                
            documento.nombreArchivo = "ReporteContinuidadMenor6Hrs";
            documento.idTabla = "tablaReporteContinuidadMenor6Hrs";
            documento.contenido = "CODIGO_ZONA;DENOMINACION_ZONA;VALORNUMERO\n";
            documento.orientacion = "landscape";
            actividadContinuidades.map(a =>  documento.contenido = documento.contenido + 
                a.codigoContinuidad + ";" + a.tipoAltitud + "\n" )
            break;
            case "5":                
                documento.nombreArchivo = "ReporteContinuidadResumen6Hrs";
                documento.idTabla = "tablaReporteResumenContinuidadReporte6Hrs";
                documento.contenido = "CODIGO_ZONA;DENOMINACION_ZONA;VALORNUMERO\n";
                documento.orientacion = "portrait";
                actividadContinuidades.map(a =>  documento.contenido = documento.contenido + 
                    a.codigoContinuidad + ";" + a.tipoAltitud + "\n" )
            break;
            case "6":                
                documento.nombreArchivo = "ReporteContinuidadMenor18Hrs";
                documento.idTabla = "tablaReporteContinuidadMenor18Hrs";
                documento.contenido = "CODIGO_ZONA;DENOMINACION_ZONA;VALORNUMERO\n";
                documento.orientacion = "landscape";
                actividadContinuidades.map(a =>  documento.contenido = documento.contenido + 
                    a.codigoContinuidad + ";" + a.tipoAltitud + "\n" )
            break;
            case "7":                
                documento.nombreArchivo = "ReporteContinuidadResumen18Hrs";
                documento.idTabla = "tablaReporteResumenContinuidad";
                documento.contenido = "CODIGO_ZONA;DENOMINACION_ZONA;VALORNUMERO\n";
                documento.orientacion = "portrait";
                actividadContinuidades.map(a =>  documento.contenido = documento.contenido + 
                    a.codigoContinuidad + ";" + a.tipoAltitud + "\n" )
            break;
            case "8":                
                documento.nombreArchivo = "ReporteContinuidadResumen";
                documento.idTabla = "tablaReporteResumenContinuidad";
                documento.contenido = "N°;DENOMINACION_ZONA;SECTOR;CODF;FUENTE;CONEX;HORA;ESTADO\n";
                documento.orientacion = "portrait";
                actividadContinuidades.map(a =>  documento.contenido = documento.contenido + 
                    a.codigoContinuidad + ";" + a.tipoAltitud + "\n" )
            break;
            default:
                break;
        }
        this.setState({ documento });
    }
    
    componentDidMount(){
        if(this.state.usuario.grupo > 0){ // Si es administrador
            this.listarZonas();
            this.reporteContinuidad();
        }// else{ this.props.history.push('/') }
    }

    render(){
        if(this.state.usuario.grupo > 0){ // Si es administrador
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
                                <select className="cuadro_dato"  value={this.state.agnoReporte} onChange={this.cambiarAgnoReporte}>
                                    { this.state.agnos.map((a, indice) => <option key={indice} value={a}>{a}</option> )}
                                </select>
                            </div>
                        </div>
                        <select hidden={true} className="cuadro_dato" onChange={this.cambiarZonaReporte}>
                            <option value="%">Zonas (TODO)</option>
                            {this.state.zonas.filter(zona => { return zona.esSector } ).map(zona => (
                                <option key={zona.codigoZona} value={zona.codigoZona}>
                                    { zona.denominacionZona + '( Zona \u0020' + numeroArabigoEnRomano(zona.sector) + (parseInt(zona.subSector) === 0 ? '':" \u2014 " + numeroArabigoEnRomano(zona.subSector)) + (zona.microSector === '-' ? '':" \u2014 "+zona.microSector)+" )"}
                                </option> 
                            ))}
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
                            <option value="1">Encuesta de Continuidad del Servicio</option>
                            <option value="2">Continuidad Promedio Ponderado</option>
                            <option value="3">Continuidad de Horas de Servicio</option>
                            <option value="4">Continuidad menor a 6 Hrs</option>
                            <option value="5">Resumen Continuidad menor a 6 Hrs</option>
                            <option value="6">Continuidad menor a 18 Hrs</option>
                            <option value="7">Resumen Continuidad menor a 18 Hrs</option>
                            <option value="8">Resumen Comercial de Continuidad</option>
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
                        <div className="centrado">
                            <div hidden = {this.state.cantidadPuntosRegistrados < 1} className="dos_columnas">
                                <button className="boton boton_verde" onClick={this.mostrarReporte}>Generar<br/>Reporte</button>
                                <button className={"boton "+(!this.state.mostrarReporte?"boton_rojo":"boton_verde")} onClick={this.mostrarDescargaArchivo} disabled={ !this.state.mostrarReporte }>Descargar<br/>Reporte</button>
                            </div>
                        </div>                              

                    </div>
                </div>
                <hr />
                <h2 style={{textAlign:'center'}}>{this.state.tituloReporteContinuidad[this.state.tipoReporteContinuidad]}<br />{this.state.mesesAgno[this.state.mesReporte-1]}, {this.state.agnoReporte}</h2> 
                
                {/* REPORTE N° 1 */}
                <TablaReporteEncuesta
                    mostrarReporte = {this.state.mostrarReporte}
                    zonas = {this.state.zonas}
                    tiposAltitud = {this.state.tiposAltitud}
                    zonaReporte = {this.state.zonaReporte}
                    altitudReporte = {this.state.altitudReporte}
                    actividadContinuidades = {this.state.actividadContinuidades}
                    tipoReporteContinuidad = {this.state.tipoReporteContinuidad}
                />

                 {/* REPORTE N° 2 */}
                <TablaReportePonderado
                    mostrarReporte = {this.state.mostrarReporte} 
                    promedioPonderados = {this.state.promedioPonderados}
                    zonas = {this.state.zonas}
                    tiposAltitud = {this.state.tiposAltitud}
                    zonaReporte = {this.state.zonaReporte}
                    altitudReporte = {this.state.altitudReporte}
                    tipoReporteContinuidad = {this.state.tipoReporteContinuidad}
                />

                {/* REPORTE N° 3 */}
                <TablaReporteSevicio
                    mostrarReporte = {this.state.mostrarReporte} 
                    promedioPonderados = {this.state.promedioPonderados}
                    zonas = {this.state.zonas}
                    zonaReporte = {this.state.zonaReporte}
                    tipoReporteContinuidad = {this.state.tipoReporteContinuidad}
                />

                {/* REPORTE N° 4 */}
                <TablaRerporte6Hr
                    mostrarReporte = {this.state.mostrarReporte} 
                    tipoReporteContinuidad = {this.state.tipoReporteContinuidad}
                    promedioPonderados = {this.state.promedioPonderados}
                    zonas = {this.state.zonas}
                    tiposAltitud = {this.state.tiposAltitud}
                    zonaReporte = {this.state.zonaReporte}
                    altitudReporte = {this.state.altitudReporte}
                    actividadContinuidades = {this.state.actividadContinuidades}
                />

                {/* REPORTE N° 5 */}
                <TablaReporteResumen6Hrs
                    mostrarReporte = {this.state.mostrarReporte} 
                    tipoReporteContinuidad = {this.state.tipoReporteContinuidad}
                    zonas = {this.state.zonas}
                    zonaReporte = {this.state.zonaReporte}
                />

                {/* REPORTE N° 6 */}     
                <TablaRerporte18Hr
                    mostrarReporte = {this.state.mostrarReporte} 
                    tipoReporteContinuidad = {this.state.tipoReporteContinuidad}
                    promedioPonderados = {this.state.promedioPonderados}
                    zonas = {this.state.zonas}
                    tiposAltitud = {this.state.tiposAltitud}
                    zonaReporte = {this.state.zonaReporte}
                    altitudReporte = {this.state.altitudReporte}
                    actividadContinuidades = {this.state.actividadContinuidades}
                />

                {/* REPORTE N° 7 */}
                <TablaReporteResumen18Hrs
                    mostrarReporte = {this.state.mostrarReporte} 
                    tipoReporteContinuidad = {this.state.tipoReporteContinuidad}
                    zonas = {this.state.zonas}
                    zonaReporte = {this.state.zonaReporte}
                />

                {/* REPORTE N° 8 */}
                <TablaReporteResumen
                    mostrarReporte = {this.state.mostrarReporte} 
                    tipoReporteContinuidad = {this.state.tipoReporteContinuidad}
                    zonas = {this.state.zonas}
                />
                
                <ModalDescargarArchivo
                    titulo = {""}
                    mensaje = {"Escoja el tipo de Documento que se Descargara"}
                    mostrarDescargaArchivo = { this.state.mostrarDescargaArchivo }
                    controlDescargaArchivo = { this.mostrarDescargaArchivo }
                    documento = { this.state.documento }
                    tipoReporte = {this.state.tipoReporteContinuidad}
                />
            </div>
        )} else { return <UsuarioNoValido /> }
    }
}

export default ReporteContinuidad