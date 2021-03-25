import React from 'react';
import { numeroArabigoEnRomano, obtenerCodigoTipoAltitud } from '../../datos/funcionesSistema';

const TablaReportePresionPonderado = ( 
    { mostrarReporte, promedioPresiones, zonas, tiposAltitud, zonaReporte, altitudReporte, tipoReportePresion } ) => {
        
    if(mostrarReporte  && tipoReportePresion === "2"){
        var promedioConexionesReporte = 0;
        var promedioProductoReporte = 0;
        return (
        <div id="reportePresionPonderado">
            <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
            <table id="tablaReportePresionPonderado">
                <thead>
                <tr>
                    <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;Zona&nbsp;</th>
                    <th style={{border:'1px solid black',textAlign:'center'}}>Tipo de<br />Altitud&nbsp;</th>
                    <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;PRESION (MCA)&nbsp;</th>
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
                        var promedioConexionesZona = 0,promedioProductoZona = 0;
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
                                .map(altitud  => {
                                    const tipoAltitud = obtenerCodigoTipoAltitud(altitud);
                                    return(
                                        <React.Fragment key={zona.codigoZona+"-"+altitud}>
                                        <tr>
                                            <td style={{border:'1px solid black', textAlign:'center'}}>&nbsp;{altitud}</td>
                                        {
                                        promedioPresiones.filter( promedio => {
                                            return promedio.codigoZona === zona.codigoZona && promedio.tipoAltitud === tipoAltitud;
                                        }).map(promedio => {
                                            promedioConexionesZona = promedioConexionesZona + promedio.conexionesActivas;
                                            promedioConexionesReporte = promedioConexionesReporte + promedio.conexionesActivas;
                                            
                                            promedioProductoZona = promedioProductoZona + promedio.producto;
                                            promedioProductoReporte = promedioProductoReporte + promedio.producto;

                                            return (
                                            <React.Fragment key={zona.codigoZona+"-"+tipoAltitud}>
                                                <td style={{border: '1px solid black', textAlign:'center'}}>
                                                    {promedio.promedio.toFixed(2)}
                                                </td>
                                                <td style={{border: '1px solid black', textAlign:'center'}}>
                                                    {promedio.conexionesActivas}
                                                </td>
                                                <td style={{border: '1px solid black', textAlign:'center'}}>
                                                    {promedio.producto.toFixed(2)}
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
                                <td colSpan={2} style={{border:'1px solid black', textAlign:'center'}}>PROMEDIO</td>
                                <td style={{border:'1px solid black', textAlign:'center'}}>{ (promedioConexionesZona || 0).toFixed(0)}</td>
                                <td style={{border:'1px solid black', textAlign:'center'}}>{ (promedioProductoZona || 0).toFixed(2)}</td>
                                <td style={{border:'1px solid black', textAlign:'center'}}>{ promedioConexionesZona > 0 ?(promedioProductoZona / promedioConexionesZona).toFixed(2) : 0}</td>
                            </tr>
                        </tbody>
                        )             
                    })
                }
                <tbody>
                    <tr>
                        <td colSpan={3} style={{border:'1px solid black', textAlign:'center'}}>PROMEDIO PONDERADO</td>
                        <td style={{border:'1px solid black', textAlign:'center'}}>{(promedioConexionesReporte).toFixed(0)}</td>
                        <td style={{border:'1px solid black', textAlign:'center'}}>{(promedioProductoReporte).toFixed(2)}</td>
                        <td style={{border:'1px solid black', textAlign:'center'}}></td>
                    </tr>
                    <tr >
                        <td colSpan={5} style={{border:'1px solid black', textAlign:'center'}}>PRESION PROMEDIO PONDERADO</td>
                        <td style={{border:'1px solid black', textAlign:'center'}}>{ (promedioProductoReporte/promedioConexionesReporte).toFixed(3) }</td>                    
                    </tr>
                    <tr>
                        <td colSpan={5} style={{border:'1px solid black', textAlign:'center'}}>INDICE DE CUMPLIMIENTO INDIVIDUAL (ICI) PRESION MINIMA</td>
                        <td style={{border:'1px solid black', textAlign:'center'}}>{(((promedioProductoReporte/promedioConexionesReporte)/10)*100).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colSpan={5} style={{border:'1px solid black', textAlign:'center'}}>INDICE DE CUMPLIMIENTO INDIVIDUAL (ICI) PRESION MAXIMA</td>
                        <td style={{border:'1px solid black', textAlign:'center'}}>{(( 49.89 / 50 ) * 100 ).toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
            </div>
        </div>
    )} else { return null}
    
}
export default TablaReportePresionPonderado
