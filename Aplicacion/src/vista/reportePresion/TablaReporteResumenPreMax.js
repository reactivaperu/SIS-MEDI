import React from 'react';
import { numeroArabigoEnRomano } from '../../datos/funcionesSistema';

const TablaReporteResumenPresionMaxima=({mostrarReporte,tipoReportePresion,zonas,zonaReporte})=>{
    if(mostrarReporte  && tipoReportePresion === "7"){
        return (
        <div id = "ReporteResumenPresionMaxima">
            <div style = {{display:'flex', justifyContent:'center', alignItems:'center'}}>
            <table id = "tablaReporteResumenPresionMaxima">
                <thead>
                    <tr>
                        <th colSpan={5} style={{border:'1px solid black',textAlign:'center'}}>&nbsp;PORCENTAJE DE LA POBLACION CON SERVICIO MAYOR A 50 mca DE PRESIÓN&nbsp;</th>
                    </tr>
                    <tr>
                        <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;ZONA&nbsp;</th>
                        <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;AREA DE SERVICIO&nbsp;</th>
                        <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;CONEXIONES <br/>SERVICIO&nbsp;</th>
                        <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;CONEXIONES CON SERVICIO<br />MAYOR A 50mca&nbsp;</th>
                    </tr>
                </thead>
                {zonas
                    .filter(zona => {
                        if(zonaReporte === "%" ){ return zona.esSector }
                        else { return zona.esSector && zona.codigoZona.toString() === zonaReporte }
                    })
                    .map(zona => {     
                        return(
                            <tbody key={zona.codigoZona}>
                                <tr>
                                    <td style={{border:'1px solid black',textAlign:'center'}}>
                                    { '\u0020' + numeroArabigoEnRomano(zona.sector) + (parseInt(zona.subSector) === 0 ? '':" \u2014 " + numeroArabigoEnRomano(zona.subSector)) + (zona.microSector === '-' ? '':" \u2014 "+zona.microSector)}
                                    </td>
                                    <td style={{border: '1px solid black'}}> {zona.denominacionZona} </td>
                                    <td style={{border: '1px solid black', textAlign:'center'}}> 2,641 </td>
                                    <td style={{border: '1px solid black', textAlign:'center'}}> 177 </td>                                      
                                </tr>
                            </tbody>
                        )              
                    })
                }
                <tbody>
                    <tr>
                        <td colSpan={2} rowSpan={2} style={{border:'1px solid black', textAlign:'center'}}>PORCION DE POBLACION CON MAS DE 50 mca</td>
                        <td style={{border:'1px solid black', textAlign:'center'}}>86135</td>
                        <td style={{border:'1px solid black', textAlign:'center'}}>(%)</td>
                    </tr>
                    <tr>
                        <td style={{border:'1px solid black', textAlign:'center'}}>7606</td>
                        <td style={{border:'1px solid black', textAlign:'center'}}>8.83%</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <br />
        </div>
    )} else { return null}
    
}
export default TablaReporteResumenPresionMaxima
