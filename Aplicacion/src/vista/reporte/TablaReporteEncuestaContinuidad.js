import React from 'react';
import { numeroArabigoEnRomano, obtenerCodigoTipoAltitud } from '../../datos/funcionesSistema';

const TablaReporteContinuidadEncuestaContinuidad = ( 
    { mostrarReporte, actividadContinuidades, zonas, tiposAltitud, zonaReporte, altitudReporte, tipoReporte } ) => {
        
    if(mostrarReporte && tipoReporte === "2"){ 
        return (
        <div id="reporteContinuidadEncuesta">
            <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
            <table id="tablaReporteContinuidadEncuesta">
                <thead>
                <tr>
                    <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;Zona&nbsp;</th>
                    <th style={{border:'1px solid black',textAlign:'center'}}>Tipo de<br />Altitud&nbsp;</th>
                    <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;Urbanización - Calle&nbsp;</th>
                    <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;Mañanas<br />DE&nbsp;</th>
                    <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;Mañanas<br />A&nbsp;</th>
                    <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;Tardes<br />DE&nbsp;</th>
                    <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;Tardes<br />A&nbsp;</th>
                    <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;Total&nbsp;</th>
                    <th style={{border:'1px solid black',textAlign:'center'}}>Promedio<br />Ponderado&nbsp;</th>
                </tr>
                </thead>
                { 
                    zonas
                    .filter(zona => {
                        if(zonaReporte === "%" ){ return zona.esSector }
                        else { return zona.esSector && zona.codigoZona.toString() === zonaReporte }
                    })
                    .map(zona => {                   
                        const cantidadRegistrosZona=actividadContinuidades.filter(a=>a.codigoZonaReporte===zona.codigoZona).length;
                        if(cantidadRegistrosZona > 0){
                            return(
                                <tbody key={zona.codigoZona}>
                                    <tr>
                                        <td rowSpan={cantidadRegistrosZona + 4} style={{border:'1px solid black',textAlign:'center'}}>
                                        { '\u0020' + numeroArabigoEnRomano(zona.sector) + (parseInt(zona.subSector) === 0 ? '':" \u2014 " + numeroArabigoEnRomano(zona.subSector)) + (zona.microSector === '-' ? '':" \u2014 "+zona.microSector)}
                                        </td>
                                    </tr>
                                    { 
                                        tiposAltitud
                                        .filter(altitud => {
                                            if(altitudReporte === "%"){ return obtenerCodigoTipoAltitud(altitud) !== 0 }
                                            else { return obtenerCodigoTipoAltitud(altitud).toString() === altitudReporte } 
                                        })
                                        .map(altitud  => {
                                            const tipoAltitud = obtenerCodigoTipoAltitud(altitud);
                                            const cantidadRegistrosZonaAltitud=actividadContinuidades.filter(a=>{return a.codigoZonaReporte===zona.codigoZona&&a.tipoAltitud === tipoAltitud;
                                            }).length;
                                            if(cantidadRegistrosZonaAltitud > 0){
                                                return(
                                                    <React.Fragment key={zona.codigoZona+"-"+altitud}>
                                                    <tr>
                                                        <td rowSpan={cantidadRegistrosZonaAltitud + 1} style={{border:'1px solid black', textAlign:'center'}}>&nbsp;{altitud}</td>
                                                    </tr>
                                                    {
                                                    actividadContinuidades.filter(a=>{return a.codigoZonaReporte===zona.codigoZona&&a.tipoAltitud===tipoAltitud;})
                                                    .map((actividad,indice) => {
                                                        return (
                                                        <tr key={indice}>
                                                            <td style={{border: '1px solid black', textAlign:'left', paddingLeft:'8px'}}>
                                                                {actividad.denominacionLote}
                                                            </td>
                                                            <td style={{border: '1px solid black', textAlign:'center'}}>
                                                                {actividad.r1HoraDe}
                                                            </td>
                                                            <td style={{border: '1px solid black', textAlign:'center'}}>
                                                                {actividad.r1HoraA}
                                                            </td>
                                                            <td style={{border: '1px solid black', textAlign:'center'}}>
                                                                {actividad.r2HoraDe}
                                                            </td>
                                                            <td style={{border: '1px solid black', textAlign:'center'}}>
                                                                {actividad.r2HoraA}
                                                            </td>
                                                            <td style={{border: '1px solid black', textAlign:'center'}}>
                                                                {actividad.horaServicio}
                                                            </td>
                                                            { indice < 1 ?  <td rowSpan={cantidadRegistrosZonaAltitud} style={{border:'1px solid black', textAlign:'center'}}>{ (actividad.promedioHora || "00:00").substring(0,5)}</td> : null }
                                                        </tr>
                                                        )
                                                    }) 
                                                    }
                                                    </React.Fragment>
                                                )
                                            }else { return null} 
                                        })
                                    }
                                </tbody>
                            )
                        } else{ return  null }               
                    })
                }
            </table>
            </div>
        </div>
    )} else { return null}
    
}
export default TablaReporteContinuidadEncuestaContinuidad
