import React from 'react';
const CuadroMensaje = ({ tipoCuadro,children,cerrarMensaje }) => {
    return(
    <div className={`cuadro_mensaje ${tipoCuadro}`} style={{/*display:"grid",gridTemplateColumns:"90% 10%"*/}}>
        <div style={{marginTop:"auto"}}>{children}</div>
        {/*cerrarMensaje ? <div className="boton_cerrar" onClick={()=>cerrarMensaje}>&times;</div> : null*/}
    </div>
    );
}
export default CuadroMensaje;