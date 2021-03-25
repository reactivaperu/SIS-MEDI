import React from 'react';
import { numeroArabigoEnRomano, convertirNumeroAHora } from '../../datos/funcionesSistema';

const TablaReporteContinuidadServicio = ( 
    { mostrarReporte, promedioPonderados, zonas, zonaReporte, tipoReporteContinuidad} ) => {
        
    if(mostrarReporte  && tipoReporteContinuidad === "3"){
        var promedioTotalConexiones = 0;
        var promedioPesoPonderado = 0;
        var promedioGeneralHora = 0;
        return (
        <div id = "reporteContinuidadServicio">
            <div style = {{display:'flex', justifyContent:'center', alignItems:'center'}}>
            <table id = "tablaReporteContinuidadServicio">
                <thead>
                    <tr>
                        <th colSpan={5} style={{border:'1px solid black',textAlign:'center'}}>&nbsp;SEGÚN PROCESO OPRATIVO&nbsp;</th>
                    </tr>
                    <tr>
                        <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;ZONA&nbsp;</th>
                        <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;AREA DE SERVICIO&nbsp;</th>
                        <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;NUMERO DE<br />CONEXIONES&nbsp;</th>
                        <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;HORAS&nbsp;</th>
                        <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;PESO(1)<br /> PONDERADO&nbsp;</th>
                    </tr>
                </thead>
                { 
                    zonas
                    .filter(zona => {
                        if(zonaReporte === "%" ){ return zona.esSector }
                        else { return zona.esSector && zona.codigoZona.toString() === zonaReporte }
                    })
                    .map(zona => {
                        var promedioConexionesZona = 0, promedioProductoZona = 0, promedioHoraZona = 0, promedioPesoPonderadoZona = 0;       
                        
                        promedioPonderados.map(promedio => {
                            if(zona.codigoZona === promedio.codigoZona){
                                promedioConexionesZona = promedioConexionesZona + promedio.conexionesActivas;
                                promedioTotalConexiones = promedioTotalConexiones + promedio.conexionesActivas;
                                promedioProductoZona = promedioProductoZona + promedio.producto;
                            }
                            return 0;
                        });
                        promedioHoraZona = parseFloat(promedioProductoZona / promedioConexionesZona).toFixed(2);
                        promedioHoraZona = promedioHoraZona === "NaN" ? 0 : promedioHoraZona;
                        promedioPesoPonderadoZona = parseFloat(promedioHoraZona * promedioConexionesZona).toFixed(2);
                        promedioPesoPonderado = promedioPesoPonderado + parseFloat(promedioPesoPonderadoZona);
                        promedioGeneralHora = promedioPesoPonderado / promedioTotalConexiones;
                        return(
                            <tbody key={zona.codigoZona}>
                                <tr>
                                    <td style={{border:'1px solid black',textAlign:'center'}}>
                                    { '\u0020' + numeroArabigoEnRomano(zona.sector) + (parseInt(zona.subSector) === 0 ? '':" \u2014 " + numeroArabigoEnRomano(zona.subSector)) + (zona.microSector === '-' ? '':" \u2014 "+zona.microSector)}
                                    </td>
                                    <td style={{border: '1px solid black'}}> {zona.denominacionZona} </td>
                                    <td style={{border: '1px solid black', textAlign:'center'}}> { promedioConexionesZona } </td>
                                    <td style={{border: '1px solid black', textAlign:'center'}}> { promedioHoraZona } </td>
                                    <td style={{border: '1px solid black', textAlign:'center'}}> { promedioPesoPonderadoZona } </td>                                        
                                </tr>
                            </tbody>
                        )              
                    })
                }
                <tbody>
                    <tr>
                        <td colSpan={2} style={{border:'1px solid black', textAlign:'center'}}>PROMEDIO</td>
                        <td style={{border:'1px solid black', textAlign:'center'}}>{promedioTotalConexiones}</td>
                        <td style={{border:'1px solid black', textAlign:'center'}}></td>
                        <td style={{border:'1px solid black', textAlign:'center'}}>{ promedioPesoPonderado.toFixed() }</td>
                    </tr>
                    <tr>
                        <td colSpan={5} style={{border:'1px solid black', textAlign:'center'}}>&nbsp; </td>
                    </tr>
                    <tr>
                        <td colSpan={2} style={{border:'1px solid black', textAlign:'center'}}>CONTINUIDAD</td>
                    </tr>
                    <tr>
                        <td style={{border:'1px solid black', textAlign:'center'}}>PROMEDIO GENERAL</td>
                        <td style={{border:'1px solid black', textAlign:'center'}}>{ promedioGeneralHora.toFixed(2) } &nbsp; (Horas)</td>
                    </tr>
                    <tr>
                        <td style={{border:'1px solid black', textAlign:'center'}}>PROMEDIO GENERAL</td>
                        <td style={{border:'1px solid black', textAlign:'center'}}>{ convertirNumeroAHora(promedioGeneralHora,"hh:mm:ss")} &nbsp; (Hr:Min:Seg)</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <br />
        </div>
    )} else { return null}
    
}
export default TablaReporteContinuidadServicio
