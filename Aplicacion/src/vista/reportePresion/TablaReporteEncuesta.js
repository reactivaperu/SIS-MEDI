import React from 'react';
import { numeroArabigoEnRomano, obtenerCodigoTipoAltitud } from '../../datos/funcionesSistema';

const TablaReportePresionEncuesta = ( 
    { mostrarReporte, actividadPresiones, zonas, tiposAltitud, zonaReporte, altitudReporte, tipoReportePresion } ) => {
        
    if(mostrarReporte && tipoReportePresion === "1"){ 
        return (
        <div id="reportePresionEncuesta">
            <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
            <table id="tablaReportePresionEncuesta">
                <thead>
                <tr>
                    <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;Zona&nbsp;</th>
                    <th style={{border:'1px solid black',textAlign:'center'}}>Tipo de<br />Altitud&nbsp;</th>
                    <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;Urbanización - Calle&nbsp;</th>
                    <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;Presión<br />A.Arriba&nbsp;</th>
                    <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;Presión<br />A.Abajo&nbsp;</th>
                    <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;PRESION&nbsp;</th>
                    <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;H=RED&nbsp;</th>
                    <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;PRES. EN<br/>MCA&nbsp;</th>
                </tr>
                </thead>
                { 
                    zonas
                    .filter(zona => {
                        if(zonaReporte === "%" ){ return zona.esSector }
                        else { return zona.esSector && zona.codigoZona.toString() === zonaReporte }
                    })
                    .map(zona => {                   
                        const cantidadRegistrosZona = actividadPresiones.filter(actividad =>
                            actividad.codigoZonaReporte === zona.codigoZona
                        ).length;
                        if(cantidadRegistrosZona > 0){
                            return(
                                <tbody key={zona.codigoZona}>
                                    <tr>
                                        <td rowSpan={cantidadRegistrosZona + 7} style={{border:'1px solid black',textAlign:'center'}}>
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
                                            var promedioPresionAltitud = 0;
                                            var cantidadPresionAltitud = 0;
                                            const cantidadRegistrosZonaAltitud = actividadPresiones.filter(actividad => {
                                                return actividad.codigoZonaReporte === zona.codigoZona && actividad.tipoAltitud === tipoAltitud;
                                            }).length;
                                            if(cantidadRegistrosZonaAltitud > 0){
                                                return(
                                                    <React.Fragment key={zona.codigoZona+"-"+altitud}>
                                                    <tr>
                                                        <td rowSpan={cantidadRegistrosZonaAltitud + 2} style={{border:'1px solid black', textAlign:'center'}}>&nbsp;{altitud}</td>
                                                    </tr>
                                                    {
                                                    actividadPresiones.filter( actividad => {
                                                        return actividad.codigoZonaReporte === zona.codigoZona && actividad.tipoAltitud === tipoAltitud;
                                                    }).map((actividad, indice) => {
                                                        promedioPresionAltitud = promedioPresionAltitud + (actividad.lecturaAbajo * 0.703) + 1;
                                                        cantidadPresionAltitud = cantidadPresionAltitud + 1;
                                                        return (
                                                        <tr key={indice}>
                                                            <td style={{border: '1px solid black', textAlign:'left', paddingLeft:'8px'}}>
                                                                {actividad.denominacionLote}
                                                            </td>
                                                            <td style={{border: '1px solid black', textAlign:'center'}}>
                                                                {parseFloat(actividad.lecturaArriba) || 0}
                                                            </td>
                                                            <td style={{border: '1px solid black', textAlign:'center'}}>
                                                                {parseFloat(actividad.lecturaAbajo)||0}
                                                            </td>
                                                            <td style={{border: '1px solid black', textAlign:'center'}}>
                                                                {parseFloat(actividad.lecturaAbajo)||0}
                                                            </td>
                                                            <td style={{border: '1px solid black', textAlign:'center'}}>
                                                                {1}
                                                            </td>
                                                            <td style={{border: '1px solid black', textAlign:'center'}}>
                                                                {(actividad.promedioPresion||0).toFixed(2)}
                                                            </td>
                                                        </tr>
                                                        )
                                                    }) 
                                                    }
                                                    <tr>
                                                        <td style={{border:'1px solid black', textAlign:'center'}}>&nbsp;<b>PROMEDIO PARTE {(altitud).toUpperCase()}</b>&nbsp;</td>
                                                        <td colSpan={5} style={{border:'1px solid black', textAlign:'center'}}>&nbsp;{(promedioPresionAltitud/cantidadPresionAltitud).toFixed(2)}&nbsp;</td>
                                                    </tr>
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
export default TablaReportePresionEncuesta
