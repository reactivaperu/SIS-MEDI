import React from 'react';
import { numeroArabigoEnRomano, obtenerCodigoTipoAltitud } from '../../datos/funcionesSistema';

const TablaReporteContinuidadPonderado = ( 
    { mostrarReporte, promedioPonderados, zonas, tiposAltitud, zonaReporte, altitudReporte, tipoReporteContinuidad } ) => {
        
    if(mostrarReporte  && tipoReporteContinuidad === "2"){
        var promedioConexionesReporte = 0;
        var promedioProductoReporte = 0;
        return (
        <div id="reporteContinuidadPonderado">
            <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
            <table id="tablaReporteContinuidadPonderado">
                <thead>
                <tr>
                    <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;Zona&nbsp;</th>
                    <th style={{border:'1px solid black',textAlign:'center'}}>Tipo de<br />Altitud&nbsp;</th>
                    <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;prom&nbsp;</th>
                    <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;Hora&nbsp;</th>
                    <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;Minuto&nbsp;</th>
                    <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;Representa&nbsp;</th>
                    <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;CONT. PROM&nbsp;</th>
                    <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;CONEX. ACT.&nbsp;</th>
                    <th style={{border:'1px solid black',textAlign:'center'}}>PRODUCTO&nbsp;</th>
                    <th style={{border:'1px solid black',textAlign:'center'}}>CONT POND. <br/>SECTOR &nbsp;</th>
                </tr>
                </thead>
                { 
                    zonas
                    .filter(zona => {
                        if(zonaReporte === "%" ){ return zona.esSector }
                        else { return zona.esSector && zona.codigoZona.toString() === zonaReporte }
                    })
                    .map(zona => {
                        var promedioConexionesZona = 0;
                        var promedioProductoZona = 0;
                        return(
                            <tbody key={zona.codigoZona}>
                                <tr>
                                    <td rowSpan={5} style={{border:'1px solid black',textAlign:'center'}}>
                                    { '\u0020' + numeroArabigoEnRomano(zona.sector) + (parseInt(zona.subSector) === 0 ? '':" \u2014 " + numeroArabigoEnRomano(zona.subSector)) + (zona.microSector === '-' ? '':" \u2014 "+zona.microSector)}
                                    </td>
                                </tr>
                                { 
                                    tiposAltitud
                                    .filter(altitud => {
                                        if(altitudReporte === "%"){ return obtenerCodigoTipoAltitud(altitud) !== 0 }
                                        else { return obtenerCodigoTipoAltitud(altitud).toString() === altitudReporte } 
                                    })
                                    .map((altitud,indiceAltitud)  => {
                                        const tipoAltitud = obtenerCodigoTipoAltitud(altitud);
                                        return(
                                            <React.Fragment key={zona.codigoZona+"-"+altitud}>
                                            <tr>
                                                <td style={{border:'1px solid black', textAlign:'center'}}>&nbsp;{altitud}</td>
                                            {
                                            promedioPonderados.filter( promedio => {
                                                return promedio.codigoZona === zona.codigoZona && promedio.tipoAltitud === tipoAltitud;
                                            }).map(promedio => {

                                                promedioConexionesZona = promedioConexionesZona + promedio.conexionesActivas;
                                                promedioConexionesReporte = promedioConexionesReporte + promedio.conexionesActivas;
                                                
                                                promedioProductoZona = promedioProductoZona + promedio.producto;
                                                promedioProductoReporte = promedioProductoReporte + promedio.producto;

                                                return (
                                                <React.Fragment key={zona.codigoZona+"-"+tipoAltitud}>
                                                    <td style={{border: '1px solid black', textAlign:'center'}}>
                                                        {(promedio.promedioHora || "-").substring(0,5)}
                                                    </td>
                                                    <td style={{border: '1px solid black', textAlign:'center'}}>
                                                        {(promedio.hora || "-")}
                                                    </td>
                                                    <td style={{border: '1px solid black', textAlign:'center'}}>
                                                        {(promedio.minuto || "-")}
                                                    </td>
                                                    <td style={{border: '1px solid black', textAlign:'center'}}>
                                                        {(promedio.representa || "-")}
                                                    </td>
                                                    <td style={{border: '1px solid black', textAlign:'center'}}>
                                                        {(promedio.contProm || "-")}
                                                    </td>
                                                    <td style={{border: '1px solid black', textAlign:'center'}}>
                                                        {(promedio.conexionesActivas || "-")}
                                                    </td>
                                                    <td style={{border: '1px solid black', textAlign:'center'}}>
                                                        {(promedio.producto || "-")}
                                                    </td>
                                                    <td style={{ borderRight : '1px solid black'}}>&nbsp;</td>
                                                </React.Fragment>
                                                )
                                            })
                                            }
                                            </tr>
                                        </React.Fragment>
                                        )
                                    })
                                }
                                <tr>
                                    <td colSpan={6} style={{border:'1px solid black', textAlign:'center'}}>PROMEDIO</td>
                                    <td style={{border:'1px solid black', textAlign:'center'}}>{ (promedioConexionesZona || 0).toFixed(0)}</td>
                                    <td style={{border:'1px solid black', textAlign:'center'}}>{ (promedioProductoZona || 0).toFixed(4)}</td>
                                    <td style={{border:'1px solid black', textAlign:'center'}}>{ ((promedioProductoZona / promedioConexionesZona) || 0).toFixed(2)}</td>
                                </tr>
                            </tbody>
                        )             
                    })
                    
                }
                <tbody>
                    <tr>
                        <td colSpan={7} style={{border:'1px solid black', textAlign:'center'}}>PROMEDIO PONDERADO</td>
                        <td style={{border:'1px solid black', textAlign:'center'}}>{(promedioConexionesReporte).toFixed(0)}</td>
                        <td style={{border:'1px solid black', textAlign:'center'}}>{(promedioProductoReporte).toFixed(5)}</td>
                        <td style={{border:'1px solid black', textAlign:'center'}}></td>
                    </tr>
                    <tr >
                        <td colSpan={9} style={{border:'1px solid black', textAlign:'center'}}>CONTINUIDAD PROMEDIO PONDERADO</td>
                        <td style={{border:'1px solid black', textAlign:'center'}}>{ (promedioProductoReporte/promedioConexionesReporte).toFixed(4) }</td>                    
                    </tr>
                    <tr>
                        <td colSpan={9} style={{border:'1px solid black', textAlign:'center'}}>INDICE DE CUMPLIMIENTO INDIVIDUAL (ICI) CONTINUIDAD</td>
                        <td style={{border:'1px solid black', textAlign:'center'}}>{(((promedioProductoReporte/promedioConexionesReporte)/20)*100).toFixed(0)}</td>
                    </tr>
                </tbody>
            </table>
            </div>
        </div>
    )} else { return null}
    
}
export default TablaReporteContinuidadPonderado
