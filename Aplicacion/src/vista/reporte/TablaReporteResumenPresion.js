import React from 'react';
import { numeroArabigoEnRomano } from '../../datos/funcionesSistema';

const variablePSI = 0.7039;

function mostrarPromedios(promedioProductoPonderado,promedioTotalConexiones, sumaPresionPSI, sumaPresionMCA, cantidadZonas ) {
    var promedioProductoConexiones = (promedioProductoPonderado / promedioTotalConexiones);
    var promedioPresionPSI = (sumaPresionPSI / cantidadZonas);
    var promedioPresionMCA = (sumaPresionMCA / cantidadZonas);

    return (
    <tbody>
        <tr>
            <td colSpan={2} style={{border:'1px solid black', textAlign:'center'}}>PROMEDIO PONDERADO DE PRESIÓN</td>
            <td style={{border:'1px solid black', textAlign:'center'}}>{ ((promedioProductoConexiones / variablePSI)||0).toFixed(2) }</td>
            <td style={{border:'1px solid black', textAlign:'center'}}>{ (promedioProductoConexiones||0).toFixed(2) }</td>
            <td style={{border:'1px solid black', textAlign:'center'}}>{ promedioTotalConexiones }</td>
            <td style={{border:'1px solid black', textAlign:'center'}}>{ (promedioProductoPonderado||0).toFixed(2) }</td>
        </tr>
        <tr>
            <td colSpan={2} style={{border:'1px solid black', textAlign:'center'}}>PROMEDIO ARITMETICO DE PRESIÓN</td>
            <td style={{border:'1px solid black', textAlign:'center'}}>{ (promedioPresionPSI||0).toFixed(2) }</td>
            <td style={{border:'1px solid black', textAlign:'center'}}>{ (promedioPresionMCA||0).toFixed(2) }</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
        </tr>
        <tr>
            <td colSpan={2} style={{border:'1px solid black', textAlign:'center'}}>PROMEDIO GENERAL DE PRESIÓN</td>
            <td style={{border:'1px solid black', textAlign:'center'}}>{ ((((promedioProductoConexiones / variablePSI) + promedioPresionPSI ) / 2)||0).toFixed(2) }</td>
            <td style={{border:'1px solid black', textAlign:'center'}}>{ (((promedioProductoConexiones + promedioPresionMCA ) / 2)||0).toFixed(2) }</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
        </tr>
    </tbody>
    );
}

const TablaReporteResumenPresion = ( 
    { mostrarReporte, promedioPresiones, zonas, zonaReporte, tipoReporte } ) => {
    if(mostrarReporte && tipoReporte === "3"){
        var promedioProductoPonderado=0,promedioTotalConexiones=0,sumaPresionMCA=0,sumaPresionPSI=0,cantidadZonas=0;
        return (
        <div id="reporteResumenPresion">
            <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
            <table id="tablaReporteResumenPresion">
                <thead>
                    <tr>
                        <th colSpan={6} style={{border:'1px solid black',textAlign:'center'}}>&nbsp;PRESIÓN SEGÚN PROCESO OPRATIVO&nbsp;</th>
                    </tr>
                    <tr>
                        <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;ZONA&nbsp;</th>
                        <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;AREA DE SERVICIO&nbsp;</th>
                        <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;PRESION PSI&nbsp;</th>
                        <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;PRESION MCA&nbsp;</th>
                        <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;NUMERO DE<br />CONEXIONES&nbsp;</th>
                        <th style={{border:'1px solid black',textAlign:'center'}}>&nbsp;PRODUCTO<br /> (PONDERADO)&nbsp;</th>
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
                        var productoPronderado = 0;
                        
                        promedioPresiones.forEach(promedio => {
                            if(zona.codigoZona === promedio.codigoZona){
                                promedioConexionesZona = promedioConexionesZona + promedio.conexionesActivas;
                                promedioTotalConexiones = promedioTotalConexiones + promedio.conexionesActivas;
                                productoPronderado = productoPronderado + promedio.producto; 
                            }
                        });

                        var presionMCA = productoPronderado / promedioConexionesZona;
                        presionMCA = parseFloat(presionMCA||0);

                        var presionPSI = presionMCA / variablePSI;
                        presionPSI = parseFloat(presionPSI||0);

                        sumaPresionMCA = sumaPresionMCA + presionMCA;
                        sumaPresionPSI = sumaPresionPSI + presionPSI;

                        promedioProductoPonderado = promedioProductoPonderado + productoPronderado;
                        cantidadZonas = cantidadZonas + 1;
                        return(
                            <tbody key={zona.codigoZona}>
                                <tr>
                                    <td style={{border:'1px solid black',textAlign:'center'}}>
                                    { '\u0020' + numeroArabigoEnRomano(zona.sector) + (parseInt(zona.subSector) === 0 ? '':" \u2014 " + numeroArabigoEnRomano(zona.subSector)) + (zona.microSector === '-' ? '':" \u2014 "+zona.microSector)}
                                    </td>
                                    <td style={{border: '1px solid black'}}> {zona.denominacionZona} </td>
                                    <td style={{border: '1px solid black', textAlign:'center'}}> { (presionPSI||0).toFixed(2) } </td>
                                    <td style={{border: '1px solid black', textAlign:'center'}}> { (presionMCA||0).toFixed(2) } </td>  
                                    <td style={{border: '1px solid black', textAlign:'center'}}> { promedioConexionesZona } </td>  
                                    <td style={{border: '1px solid black', textAlign:'center'}}> { productoPronderado.toFixed(2) } </td>                                      
                                </tr>
                            </tbody>
                        )
                    })
                }
                {
                    mostrarPromedios(promedioProductoPonderado,promedioTotalConexiones, sumaPresionPSI, sumaPresionMCA, cantidadZonas)
                }
            </table>
            </div>
        </div>
    )} else { return null}
    
}
export default TablaReporteResumenPresion
