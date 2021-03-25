import React from 'react';
import { numeroArabigoEnRomano, obtenerCodigoTipoAltitud, convertirNumeroAHora } from '../../datos/funcionesSistema';
const TablaReporteContinuidadMenor18Hrs = ({mostrarReporte,tipoReporteContinuidad,actividadContinuidades,promedioPonderados,zonas,tiposAltitud,zonaReporte,altitudReporte})=>{
    var sumaConexionesActivas = 0;
    var sumaConexionesMenor18Hrs = 0;
    var sumaContConex = 0;
    
    function sumarConexionesMenor18Hrs (continuidadMenor18Hrs, conexionesMenor18Hrs){
        sumaContConex = sumaContConex + (continuidadMenor18Hrs / 24 * conexionesMenor18Hrs);
        sumaConexionesMenor18Hrs = sumaConexionesMenor18Hrs + conexionesMenor18Hrs;
    }

    if(mostrarReporte  && tipoReporteContinuidad === "6"){ 
    return (
    <div id="reporteContinuidadMenor18Hrs">
        <div className="centrado">
            <table id="tablaReporteContinuidadMenor18Hrs">
                <thead>
                <tr>
                    <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;Zona&nbsp;</th>
                    <th style={{border:'1px solid black',textAlign:'center'}}>Tipo de<br />Altitud&nbsp;</th>
                    <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;Urbanización - Calle&nbsp;</th>
                    <th style={{border:'1px solid black',textAlign:'center'}}>Horas<br/>Servicio</th>
                    <th style={{border:'1px solid black',textAlign:'center'}}>CANT.</th>
                    <th style={{border:'1px solid black',textAlign:'center'}}>Conexiones<br/>Activas</th>
                    <th style={{border:'1px solid black',textAlign:'center'}}>Conexiones<br/>Menor 18 Hrs</th>
                    <th style={{border:'1px solid black',textAlign:'center'}}>Continuidad<br/>Menor 18 Hrs</th>
                    <th style={{border:'1px solid black',textAlign:'center'}}>CONTx CONEX</th>
                </tr>
                </thead>
                {(zonas||[]).filter(zona => {
                    if(zonaReporte === "%" ){ return zona.esSector }
                    else { return zona.esSector && zona.codigoZona.toString() === zonaReporte }
                }).map(zona => {
                    var conexionesActivas = 0;
                    var cant = 0;
                    var conexionesMenor18hrs = 0;

                    const cantidadRegistrosZona = (actividadContinuidades||[]).filter(actividad =>
                        actividad.codigoZonaReporte === zona.codigoZona).length;
                        if(cantidadRegistrosZona > 0){
                            return(
                            <tbody key={zona.codigoZona}>
                                <tr>
                                    <td rowSpan={cantidadRegistrosZona + 4} style={{border:'1px solid black',textAlign:'center'}}>
                                    { '\u0020' + numeroArabigoEnRomano(zona.sector) + (parseInt(zona.subSector) === 0 ? '':" \u2014 " + numeroArabigoEnRomano(zona.subSector)) + (zona.microSector === '-' ? '':" \u2014 "+zona.microSector)}
                                    </td>
                                </tr>
                                {(tiposAltitud||[]).filter(altitud => {
                                    if(altitudReporte === "%"){ return obtenerCodigoTipoAltitud(altitud) !== 0 }
                                    else { return obtenerCodigoTipoAltitud(altitud).toString() === altitudReporte } 
                                }).map(altitud  => {
                                    var horasAcumulado = 0;
                                    var cantAcumulado = 0;
                                    var continuidadMenor18Hrs = 0;

                                    const tipoAltitud = obtenerCodigoTipoAltitud(altitud);
                                    const cantidadRegistrosZonaAltitud = actividadContinuidades.filter(actividad => {
                                        return actividad.codigoZonaReporte === zona.codigoZona && actividad.tipoAltitud === tipoAltitud;
                                    }).length;
                                    
                                    (promedioPonderados||[]).filter(promedio => promedio.codigoZona === zona.codigoZona && promedio.tipoAltitud ===tipoAltitud)
                                    .forEach(promedio => conexionesActivas = promedio.conexionesActivas);
                                    sumaConexionesActivas = sumaConexionesActivas + conexionesActivas;
                                    if(cantidadRegistrosZonaAltitud > 0){
                                        return(
                                            <React.Fragment key={zona.codigoZona+"-"+altitud}>
                                            <tr>
                                                <td rowSpan={cantidadRegistrosZonaAltitud + 1} style={{border:'1px solid black', textAlign:'center'}}>&nbsp;{altitud}</td>
                                            </tr>
                                            {(actividadContinuidades||[]).filter(actividad=>{return actividad.codigoZonaReporte === zona.codigoZona && actividad.tipoAltitud === tipoAltitud})
                                            .forEach(actividad => {
                                                var hora = parseInt(actividad.horaServicio.substring(0,2));
                                                var minuto = parseInt(((actividad.horaServicio.substring(3,5)*100)/60).toFixed(2));
                                                var totalHora = hora + (minuto/100);
                                                cant = totalHora < 18 ? 1 : 0;
                                                cantAcumulado = cant + cantAcumulado;
                                                conexionesMenor18hrs = conexionesActivas / cantidadRegistrosZonaAltitud * cantAcumulado; // CONEXIONES
                                                continuidadMenor18Hrs = ((horasAcumulado/cantAcumulado)||0).toFixed(2);
                                                if(conexionesMenor18hrs !== 0){horasAcumulado = horasAcumulado + (cant === 1 ? totalHora : 0)}
                                            })}
                                            {(actividadContinuidades||[]).filter(actividad=>{return actividad.codigoZonaReporte === zona.codigoZona && actividad.tipoAltitud === tipoAltitud})
                                            .map((actividad,indice) => {
                                                return (
                                                <tr key={indice}>
                                                    <td style={{border: '1px solid black', textAlign:'left', paddingLeft:'8px'}}>
                                                        {actividad.denominacionLote}
                                                    </td>
                                                    <td style={{border: '1px solid black', textAlign:'center'}}>
                                                        {actividad.horaServicio}
                                                    </td>
                                                    <td style={{border: '1px solid black', textAlign:'center'}}>
                                                        { cant }
                                                    </td>
                                                    { indice < 1 ?  <td rowSpan={cantidadRegistrosZonaAltitud} style={{border:'1px solid black', textAlign:'center'}}> { conexionesActivas } </td> : null }
                                                    { indice < 1 ?  <td rowSpan={cantidadRegistrosZonaAltitud} style={{border:'1px solid black', textAlign:'center'}}> { conexionesMenor18hrs.toFixed(2) } </td> : null }
                                                    { indice < 1 ?  <td rowSpan={cantidadRegistrosZonaAltitud} style={{border:'1px solid black', textAlign:'center'}}> { convertirNumeroAHora(continuidadMenor18Hrs,"hh:mm")} </td> : null }
                                                    { indice < 1 ?  <td rowSpan={cantidadRegistrosZonaAltitud} style={{border:'1px solid black', textAlign:'center'}}> { (continuidadMenor18Hrs / 24 * conexionesMenor18hrs).toFixed(2)} </td> : null }
                                                </tr>
                                                )
                                            })}
                                            {sumarConexionesMenor18Hrs(continuidadMenor18Hrs, conexionesMenor18hrs)}
                                            </React.Fragment>
                                        )
                                    }else { return null} 
                                })}
                            </tbody>)
                        } else{ return  null }               
                    })
                }
                <tbody>
                    <tr>
                        <td colSpan={5} style={{border:'1px solid black', textAlign:'center'}}>SUMATORIA</td>
                        <td style={{border:'1px solid black', textAlign:'center'}}>{sumaConexionesActivas}</td>
                        <td style={{border:'1px solid black', textAlign:'center'}}>{sumaConexionesMenor18Hrs.toFixed(2)}</td>
                        <td style={{border:'1px solid black', textAlign:'center'}}>&nbsp;</td>
                        <td style={{border:'1px solid black', textAlign:'center'}}>{sumaContConex.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colSpan={2}>&nbsp;</td>
                        <td colSpan={2} style={{border:'1px solid black', textAlign:'center'}}>Continuidad Promedio Menor a 6 Horas</td>
                        <td colSpan={5} style={{border:'1px solid black', textAlign:'center'}}>{ convertirNumeroAHora((sumaContConex/sumaConexionesMenor18Hrs)*24,"hh:mm")}</td>
                    </tr>
                    <tr>
                        <td colSpan={2}>&nbsp;</td>
                        <td colSpan={2} style={{border:'1px solid black', textAlign:'center'}}>Porcentaje de Usuarios con Continuidad menor a 6 Horas</td>
                        <td colSpan={5} style={{border:'1px solid black', textAlign:'center'}}>{((sumaConexionesMenor18Hrs/sumaConexionesActivas)*100).toFixed(2)} %</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    )} else { return null}
}
export default TablaReporteContinuidadMenor18Hrs