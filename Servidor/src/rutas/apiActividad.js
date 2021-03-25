/**
 * @class Actividad(Router)
 * @file apiActividad.js
 * @author {carrillog.luis[at]gmail[dot]com,jorge.muvez[at]gmail[dot]com }
 * @date 2019
 * @copyright Luis.Carrillo.Gutiérrez__Jorge.Muñiz.Velasquez__World.Connect.Perú
 */

/*
DROP TABLE IF EXISTS actividad; 
DELIMITER $$
CREATE TABLE IF NOT EXISTS actividad (
codigoActividad INTEGER UNSIGNED NULL UNIQUE AUTO_INCREMENT,
codigoUsuario INTEGER UNSIGNED NOT NULL,
codigoDireccion INTEGER UNSIGNED NOT NULL, -- ALTA - MEDIA - BAJA ??? 
fechaCreacion CHAR(10) NOT NULL, -- Fecha inicial
fechaFinal CHAR(10) NOT NULL, -- Fecha limite 
mesPeriodo CHAR(2) NOT NULL, -- El mes que se hace las actividades
agnoPeriodo CHAR(4) NOT NULL, -- EL agno que se hace las actividades
tipoActividad TINYINT(1) NOT NULL, -- Actividad continuidad (0) /presión (1)
estadoActividad TINYINT(1) NOT NULL DEFAULT 1, -- 1 Inscrito  -- 2 Incompleto -- 3 Finalizado
habilitado BINARY(1) NOT NULL DEFAULT 1, -- fechaFinalLabor CHAR(10) NOT NULL, -- de la verdadera medicion
PRIMARY KEY (codigoDireccion, mesPeriodo, agnoPeriodo, tipoActividad)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
$$
DELIMITER ;

-- NUM TABLA = 10;
-- NUM PROCE = 7;
*/

'use strict';
const gestorRutaActividad = require('express').Router();// INICIAR ENRUTADOR DE EXPRESS SERVER
const proveedorDeDatos = require('../conexiondb.js'); /* Conectar al POOL de CONEXIONES de la Base de Datos */


/**
 * @description Gestionar Ruta para Agregar nueva ACTIVIDAD  (POST) "/api/actividad"
 * @since 0.0.1 
 * @param {object} solicitud Parámetros adjuntos a la petición Web de la ruta gestionada
 * @param {object} respuesta Gestor del despliegue de datos o errores
 * @returns {JSON} Datos de la base de datos o errores producidos por obtener estos
 */
gestorRutaActividad.post('/', async (solicitud, respuesta) => {
    /*
    DROP PROCEDURE IF EXISTS agregarActividad; -- agregarActividadMedicion
    DELIMITER $$
    CREATE PROCEDURE IF NOT EXISTS agregarActividad (

    IN `@usuario` INTEGER UNSIGNED,
    IN `@direccion` INTEGER UNSIGNED,
    IN `@creacion` CHAR(10), -- 'fecha de asignacion del trabajo' 
    IN `@final` CHAR(10),
    IN `@mes` CHAR(2), -- Mes de Periodo
    IN `@agno` CHAR(4), -- Año de Periodo
    IN `@actividad` TINYINT(1),
    IN `@quien` CHAR(32) CHARACTER SET utf8

    ) BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION ROLLBACK;
    START TRANSACTION;

    INSERT INTO actividad(codigoUsuario,codigoDireccion,fechaCreacion,fechaFinal,mesPeriodo,agnoPeriodo,tipoActividad) 
    VALUES (`@usuario`,`@direccion`,`@creacion`,`@final`,`@mes`,`@agno`,`@actividad`);
    SET @tmp = LAST_INSERT_ID();
    INSERT INTO bitacora VALUES (`@quien`, 10, @tmp, 0, CURRENT_TIMESTAMP);

    COMMIT;
    END;
    $$
    DELIMITER ;
    */

    try {
        const { codigoUsuario,codigoDireccion,fechaCreacion,fechaFinal,
                mesPeriodo,agnoPeriodo,tipoActividad,quien } = solicitud.body;
        if (quien.length !== 32) {
            respuesta.json({ "error" : 'parámetro(s) INADECUADO(s)' }); 
        } else { await proveedorDeDatos.query("CALL agregarActividad(?,?,?,?,?,?,?,?)", // Consulta a procedimiento almacenado
        [   codigoUsuario,codigoDireccion,fechaCreacion,fechaFinal,mesPeriodo,agnoPeriodo,tipoActividad,quien ]
        , (error, resultado) => {
            if (error)
            respuesta.json({ error : (error.sqlMessage + " - " + error.sql) }); // Enviar error en JSON
            else
            respuesta.send(resultado); // Enviar resultado de consulta en JSON
        })
        proveedorDeDatos.release();
     } //Liberar la conexión usada del POOL de conexiones
    }catch(error){ respuesta.json({ error : error.code }) }  // Enviar error en JSON
});

/**
 * @description Gestionar Ruta para Asignar a un Operador un bloque (grupo) de Actividades (PUT) "/api/actividad/asignar/bloque"
 * @since 0.0.1 
 * @param {object} solicitud Parámetros adjuntos a la petición Web de la ruta gestionada
 * @param {object} respuesta Gestor del despliegue de datos o errores
 * @returns {JSON} Datos de la base de datos o errores producidos por obtener estos
 */
gestorRutaActividad.put('/generar/bloque', async(solicitud,respuesta) => {
    /*
    DROP PROCEDURE IF EXISTS generarBloqueActividad;
    DELIMITER $$
    CREATE PROCEDURE IF NOT EXISTS generarBloqueActividad (
    IN `@usuario` CHAR(3),
    IN `@urbano` CHAR(2),
    IN `@mes` CHAR(2),
    IN `@agno` CHAR(4),
    IN `@paginaImpresion` INT(10),
    IN `@ordenImpresion` INT(10),
    IN `@final` CHAR(10),
    IN `@quien` CHAR(32) CHARACTER SET utf8
    ) BEGIN
    
	    INSERT INTO actividad(codigoUsuario,codigoDireccion,fechaCreacion,fechaFinal,mesPeriodo,agnoPeriodo,tipoActividad)
		(SELECT `@usuario`,D.codigoDireccion,SUBSTRING(NOW(),1,10),`@final`,`@mes`,`@agno`,0
		FROM direccion D
		WHERE D.codigoUrbano LIKE BINARY `@urbano` AND D.codigoDireccion = D.referenciaDireccion)
        ON DUPLICATE KEY UPDATE codigoUsuario = `@usuario`, fechaFinal = ADDDATE(`@final`, INTERVAL 0 DAY);

        INSERT INTO actividad(codigoUsuario,codigoDireccion,fechaCreacion,fechaFinal,mesPeriodo,agnoPeriodo,tipoActividad)
		(SELECT `@usuario`,D.codigoDireccion,SUBSTRING(NOW(),1,10),`@final`,`@mes`,`@agno`,1
		FROM direccion D
		WHERE D.codigoUrbano LIKE BINARY `@urbano` AND D.codigoDireccion = D.referenciaDireccion)
        ON DUPLICATE KEY UPDATE codigoUsuario = `@usuario`, fechaFinal = ADDDATE(`@final`, INTERVAL 0 DAY);

        IF NOT EXISTS (SELECT paginaImpresion FROM impresion WHERE paginaImpresion=`@paginaImpresion` AND codigoUrbano=`@urbano` AND mesPeriodo=`@mes` AND agnoPeriodo = `@agno` )
        THEN INSERT INTO impresion (paginaImpresion,codigoUrbano,ordenImpresion,mesPeriodo,agnoPeriodo)
            VALUES (`@paginaImpresion`,`@urbano`,`@ordenImpresion`,`@mes`,`@agno`);
        END IF;

		INSERT INTO bitacora VALUES (`@quien`, 10, `@usuario`, 2, CURRENT_TIMESTAMP);

    END;
    $$
    DELIMITER ;
    */
    try {
        const { codigoUsuario,codigoUrbano,mesPeriodo,agnoPeriodo,paginaImpresion,ordenImpresion,fechaFinal,quien } = solicitud.body;
        if (quien.length !== 32) {
            respuesta.json({ "error" : 'parámetro(s) INADECUADO(s)' });
        }else {
        await proveedorDeDatos.query("CALL generarBloqueActividad(?,?,?,?,?,?,?,?)", // Consulta a procedimiento almacenado
                [codigoUsuario,codigoUrbano,mesPeriodo,agnoPeriodo,parseInt(paginaImpresion),parseInt(ordenImpresion),fechaFinal,quien]
        ,(error,resultado) => {
            if(error)
            respuesta.json({ error : (error.sqlMessage + " - " + error.sql) }); // Enviar error en JSON
            else
            respuesta.send(resultado); // Enviar resultado de consulta en JSON
        });}
        proveedorDeDatos.release(); //Liberar la conexión usada del POOL de conexiones
    }catch(error){respuesta.json({error:"ERROR CONLSUTA"})}  // Enviar error en JSON
});

/**
 * @description Gestionar Ruta para Listar Actividades por Bloque (POST) "/api/actividad/bloque"
 * @since 0.0.1 
 * @param {object} solicitud Parámetros adjuntos a la petición Web de la ruta gestionada
 * @param {object} respuesta Gestor del despliegue de datos o errores
 * @returns {JSON} Datos de la base de datos o errores producidos por obtener estos
 */
gestorRutaActividad.post('/bloque', async (solicitud, respuesta) => {
/*
DROP PROCEDURE IF EXISTS listarActividadBloque;
DELIMITER $$
CREATE PROCEDURE IF NOT EXISTS listarActividadBloque (
IN `@urbano` CHAR(2),
IN `@mes` CHAR(2),
IN `@agno` CHAR(4)
) BEGIN

SET @mesAnterior = CAST(`@mes` AS INTEGER)-1;
SET @agnoAnterior = `@agno`;

IF `@mes`= '01' THEN 
    SET @mesAnterior = 12;
    SET @agnoAnterior = CAST(`@agno` AS INTEGER)-1;
END IF;

SELECT D.codigoDireccion, Z.codigoZona, B.codigoUrbano, U.codigoUsuario, 
Z.sector,Z.subSector,Z.microSector,
B.denominacionBloque,
D.tipoAltitud,D.denominacionLote,D.ordenBloque,D.codigoInscripcion,
U.nombres, U.apellidosPaterno, U.apellidosMaterno,

AP.codigoActividad as codigoActividadPresion, AC.codigoActividad as codigoActividadContinuidad,
AP.fechaCreacion,AP.fechaFinal,AP.estadoActividad as estadoActividadPresion, AC.estadoActividad as estadoActividadContinuidad, CAST(AP.habilitado AS INTEGER) as habilitado,
IFNULL(MP.codigoPresion,'Sin datos') as codigoPresion, IFNULL(MC.codigoContinuidad,'Sin datos') as codigoContinuidad,
MC.r1HoraDe,MC.r1HoraA,MC.r2HoraDe,MC.r2HoraA,
MCa.r1HoraDe as r1HoraDeAnterior,MCa.r1HoraA as r1HoraAAnterior,
MCa.r2HoraDe as r2HoraDeAnterior,MCa.r2HoraA as r2HoraAAnterior,
MP.lecturaArriba,MP.lecturaAbajo,
MPa.lecturaArriba as lecturaArribaAnterior,MPa.lecturaAbajo as lecturaAbajoAnterior,

(SELECT COUNT(*) FROM observacion O WHERE O.codigoActividad = AP.codigoActividad) as observacion

FROM direccion D
INNER JOIN zona Z ON Z.codigoZona = D.codigoZona
INNER JOIN bloqueUrbano B ON B.codigoUrbano = D.codigoUrbano

LEFT JOIN actividad AP ON AP.codigoDireccion = D.codigoDireccion AND AP.tipoActividad = 1
AND CONVERT (AP.mesPeriodo, INTEGER) LIKE CONVERT(`@mes`, INTEGER) AND CONVERT (AP.agnoPeriodo, INTEGER) LIKE CONVERT ( `@agno`, INTEGER)
LEFT JOIN medicionPresion MP ON MP.codigoActividad = AP.codigoActividad

LEFT JOIN actividad APa ON APa.codigoDireccion = D.codigoDireccion AND APa.tipoActividad = 1
AND CONVERT (APa.mesPeriodo, INTEGER) LIKE CONVERT(@mesAnterior, INTEGER) AND CONVERT (APa.agnoPeriodo, INTEGER) LIKE CONVERT (@agnoAnterior, INTEGER)
LEFT JOIN medicionPresion MPa ON MPa.codigoActividad = APa.codigoActividad

LEFT JOIN actividad AC ON AC.codigoDireccion = D.codigoDireccion AND AC.tipoActividad = 0
AND CONVERT (AC.mesPeriodo, INTEGER) LIKE CONVERT(`@mes`, INTEGER) AND CONVERT (AC.agnoPeriodo, INTEGER) LIKE CONVERT ( `@agno`, INTEGER)
LEFT JOIN medicionContinuidad MC ON MC.codigoActividad = AC.codigoActividad

LEFT JOIN actividad ACa ON ACa.codigoDireccion = D.codigoDireccion AND ACa.tipoActividad = 0
AND CONVERT (ACa.mesPeriodo, INTEGER) LIKE CONVERT(@mesAnterior, INTEGER) AND CONVERT (ACa.agnoPeriodo, INTEGER) LIKE CONVERT (@agnoAnterior, INTEGER)
LEFT JOIN medicionContinuidad MCa ON MCa.codigoActividad = ACa.codigoActividad

LEFT JOIN usuario U ON U.codigoUsuario = AP.codigoUsuario
WHERE D.codigoDireccion=D.referenciaDireccion AND D.codigoUrbano LIKE BINARY `@urbano` ORDER BY D.ordenBloque;
END;
$$
DELIMITER ;
*/
    try {
        const{ codigoUrbano,mesPeriodo,agnoPeriodo } = solicitud.body;
        await proveedorDeDatos.query("CALL listarActividadBloque(?,?,?)", // Consulta a procedimiento almacenado
        [ codigoUrbano,mesPeriodo,agnoPeriodo ] 
        , (error, resultado) => {
            if (error)
            respuesta.json({ error : (error.sqlMessage + " - " + error.sql) }); // Enviar error en JSON
            else
            respuesta.json(resultado[0] ); // Enviar resultado de consulta en JSON
        });
        proveedorDeDatos.release(); //Liberar la conexión usada del POOL de conexiones
    }catch(error){ respuesta.json({ error : error.code }) }  // Enviar error en JSON
});

/**
 * @description Gestionar Ruta para Listar Actividades para Impresion (POST) "/api/actividad/impresion"
 * @since 0.0.1 
 * @param {object} solicitud Parámetros adjuntos a la petición Web de la ruta gestionada
 * @param {object} respuesta Gestor del despliegue de datos o errores
 * @returns {JSON} Datos de la base de datos o errores producidos por obtener estos
 */
gestorRutaActividad.post('/impresion', async (solicitud, respuesta) => {
    /*
    DROP PROCEDURE IF EXISTS listarActividadImpresion;
    DELIMITER $$
    CREATE PROCEDURE IF NOT EXISTS listarActividadImpresion (
    IN `@urbano` CHAR(3),
    IN `@mes` CHAR(2),
    IN `@agno` CHAR(4)
    ) BEGIN

    SELECT D.denominacionLote,D.codigoInscripcion,D.tipoAltitud,D.ordenBloque,
    IFNULL(U.codigoUsuario,0) AS codigoUsuario,CONCAT(IFNULL(U.nombres,"")," ",IFNULL(U.apellidosPaterno,"")," ",IFNULL(U.apellidosMaterno,"")) as nombreCompleto,
    MC.r1HoraDe, MC.r1HoraA, MC.r2HoraDe, MC.r2HoraA, MP.lecturaArriba, MP.lecturaAbajo
    FROM direccion D
    INNER JOIN impresion I ON I.codigoUrbano = D.codigoUrbano AND I.codigoUrbano LIKE `@urbano` 
    LEFT JOIN actividad AP ON AP.codigoDireccion = D.codigoDireccion AND AP.tipoActividad = 1 AND AP.mesPeriodo LIKE `@mes` AND AP.agnoPeriodo LIKE `@agno`
	LEFT JOIN medicionPresion MP ON MP.codigoActividad = AP.codigoActividad
    LEFT JOIN actividad AC ON AC.codigoDireccion = D.codigoDireccion AND AC.tipoActividad = 0 AND AC.mesPeriodo LIKE `@mes` AND AC.agnoPeriodo LIKE `@agno`
	LEFT JOIN medicionContinuidad MC ON MC.codigoActividad = AC.codigoActividad
    LEFT JOIN usuario U ON U.codigoUsuario = AP.codigoUsuario
    WHERE D.codigoDireccion = D.referenciaDireccion 
    ORDER BY I.ordenImpresion,D.ordenBloque;
    END;
    
    $$
    DELIMITER ;
    */
    try {
        const{ codigoUrbano,mesPeriodo,agnoPeriodo } = solicitud.body;
        await proveedorDeDatos.query("CALL listarActividadImpresion(?,?,?)", // Consulta a procedimiento almacenado
        [ codigoUrbano,mesPeriodo,agnoPeriodo ] 
        , (error, resultado) => {
            if (error)
            respuesta.json({ error : (error.sqlMessage + " - " + error.sql) }); // Enviar error en JSON
            else
            respuesta.json(resultado[0] ); // Enviar resultado de consulta en JSON
        });
        proveedorDeDatos.release(); //Liberar la conexión usada del POOL de conexiones
    }catch(error){ respuesta.json({ error : error.code }) }  // Enviar error en JSON
});

/**
 * @description Gestionar Ruta para Listar Actividades para Paginado (POST) "/api/actividad/paginado"
 * @since 0.0.1 
 * @param {object} solicitud Parámetros adjuntos a la petición Web de la ruta gestionada
 * @param {object} respuesta Gestor del despliegue de datos o errores
 * @returns {JSON} Datos de la base de datos o errores producidos por obtener estos
 */
gestorRutaActividad.post('/paginado', async (solicitud, respuesta) => {
    /*DROP PROCEDURE IF EXISTS listarActividadPaginado;
DELIMITER $$
CREATE PROCEDURE IF NOT EXISTS listarActividadPaginado (
IN `@zona` CHAR(2),
IN `@urbano` CHAR(2),
IN `@altitud` CHAR(1), 
IN `@mes` CHAR(2),
IN `@agno` CHAR(4),
IN `@actividad` CHAR(1), -- Tipo de actividad
IN `@inicio` INTEGER UNSIGNED,
IN `@resultados` INTEGER UNSIGNED
) BEGIN

SET @sector = "-", @subSector = "-", @microSector ="-";
SELECT sector, subSector, microSector INTO @sector,@subSector,@microSector FROM zona where codigoZona = `@zona`;

IF @sector = "-" THEN SET @sector = "%"; END IF;
IF @subSector = "-" THEN SET @subSector = "%"; END IF;
IF @microSector = "-" THEN SET @microSector = "%"; END IF;

SELECT D.codigoDireccion, Z.codigoZona, B.codigoUrbano, A.codigoActividad, U.codigoUsuario, 
Z.sector,Z.subSector,Z.microSector,
B.denominacionBloque,
D.tipoAltitud,D.denominacionLote,
A.mesPeriodo,A.agnoPeriodo,A.fechaCreacion,A.fechaFinal,A.tipoActividad,A.estadoActividad, CAST(A.habilitado AS INTEGER) as habilitado,
U.nombres, U.apellidosPaterno, U.apellidosMaterno,
(SELECT COUNT(*) FROM observacion O WHERE O.codigoActividad = A.codigoActividad) as observacion

FROM direccion D
INNER JOIN zona Z ON Z.codigoZona = D.codigoZona
INNER JOIN bloqueUrbano B ON B.codigoUrbano = D.codigoUrbano
LEFT JOIN actividad A ON A.codigoDireccion = D.codigoDireccion AND A.tipoActividad LIKE BINARY `@actividad` 
AND CONVERT (A.mesPeriodo, INTEGER) LIKE CONVERT(`@mes`, INTEGER) AND CONVERT (A.agnoPeriodo, INTEGER) LIKE CONVERT ( `@agno`, INTEGER)
LEFT JOIN usuario U ON U.codigoUsuario = A.codigoUsuario

WHERE D.codigoUrbano LIKE BINARY `@urbano` AND D.tipoAltitud LIKE BINARY `@altitud` AND D.codigoZona IN 
(SELECT DISTINCT codigoZona FROM zona WHERE HEX(UNHEX(habilitado)) = "01" 
AND sector LIKE BINARY @sector AND subSector LIKE BINARY @subSector AND microSector LIKE BINARY @microSector)
LIMIT `@inicio`,`@resultados`;
END;
$$
DELIMITER ;
    */
    try {
        const{ codigoZona,codigoUrbano,tipoAltitud,mesPeriodo,agnoPeriodo,tipoActividad,inicio,resultados } = solicitud.body;
        await proveedorDeDatos.query("CALL listarActividadPaginado(?,?,?,?,?,?,?,?)", // Consulta a procedimiento almacenado
        [ codigoZona,codigoUrbano,tipoAltitud,mesPeriodo,agnoPeriodo,tipoActividad,parseInt(inicio), parseInt(resultados) ] 
        , (error, resultado) => {
            if (error)
            respuesta.json({ error : (error.sqlMessage + " - " + error.sql) }); // Enviar error en JSON
            else
            respuesta.json(resultado[0] ); // Enviar resultado de consulta en JSON
        });
        proveedorDeDatos.release(); //Liberar la conexión usada del POOL de conexiones
    }catch(error){ respuesta.json({ error : error.code }) }  // Enviar error en JSON
});

/**
 * @description Gestionar ruta para Buscar Actividades por Usuario para Paginado (POST) "/api/actividad/usuario/paginado"
 * @since 0.0.1 
 * @param {object} solicitud Parámetros adjuntos a la petición Web de la ruta gestionada
 * @param {object} respuesta Gestor del despliegue de datos o errores
 * @returns {JSON} Datos de la base de datos o errores producidos por obtener estos
 */
gestorRutaActividad.post('/usuario', async (solicitud, respuesta) => {
    /*
DROP PROCEDURE IF EXISTS listarActividadesPorUsuario;
DELIMITER $$
CREATE PROCEDURE IF NOT EXISTS listarActividadesPorUsuario (
IN `@usuario` INTEGER UNSIGNED,
IN `@urbano` CHAR(2),
IN `@mes` CHAR(2),
IN `@agno` CHAR(4)
)BEGIN

SELECT 
D.codigoDireccion,D.denominacionLote,D.tipoAltitud,D.ordenBloque,D.codigoUrbano,D.codigoInscripcion,
IFNULL(AP.codigoActividad,'Sin datos') AS codigoActividadPresion,IFNULL(AC.codigoActividad,'Sin datos') AS codigoActividadContinuidad,
AP.fechaCreacion,AP.fechaFinal,
AP.estadoActividad AS estadoPresion,
AC.estadoActividad AS estadoContinuidad,
U.codigoUrbano,U.denominacionBloque,
(SELECT COUNT(O.codigoActividad) FROM observacion O WHERE O.codigoActividad = AP.codigoActividad) as observacion

FROM direccion D 
INNER JOIN actividad AP ON AP.tipoActividad = 1 AND AP.codigoDireccion = D.codigoDireccion AND AP.codigoUsuario=`@usuario` AND 
HEX(UNHEX(AP.habilitado))='01' AND AP.mesPeriodo LIKE BINARY `@mes` AND AP.agnoPeriodo LIKE BINARY `@agno`

INNER JOIN actividad AC ON AC.tipoActividad = 0 AND AC.codigoDireccion = D.codigoDireccion AND AC.codigoUsuario=`@usuario` AND 
HEX(UNHEX(AC.habilitado))='01' AND AC.mesPeriodo LIKE BINARY `@mes` AND AC.agnoPeriodo LIKE BINARY `@agno`

INNER JOIN bloqueUrbano U ON D.codigoUrbano = U.codigoUrbano 
WHERE D.codigoUrbano LIKE BINARY `@urbano` AND D.codigoDireccion = D.referenciaDireccion

ORDER BY D.codigoUrbano,D.ordenBloque;

END;
$$
DELIMITER ;
    */
    try {
        const { codigoUsuario,codigoUrbano,mesPeriodo,agnoPeriodo } = solicitud.body;
        await proveedorDeDatos.query("CALL listarActividadesPorUsuario(?,?,?,?)", // Consulta a procedimiento almacenado
        [ codigoUsuario,codigoUrbano,mesPeriodo,agnoPeriodo ] 
        , (error, resultado) => {
            if (error)
            respuesta.json({ error : (error.sqlMessage + " - " + error.sql) }); // Enviar error en JSON
            else
            respuesta.json(resultado[0] ); // Enviar resultado de consulta en JSON
        });
        proveedorDeDatos.release(); //Liberar la conexión usada del POOL de conexiones
    }catch(error){ respuesta.json({ error : error.code }) }  // Enviar error en JSON
});

/**
 * @description Gestionar Ruta para Buscar una Actividad determinada (POST) "/api/actividad/buscar"
 * @since 0.0.1 
 * @param {object} solicitud Parámetros adjuntos a la petición Web de la ruta gestionada
 * @param {object} respuesta Gestor del despliegue de datos o errores
 * @returns {JSON} Datos de la base de datos o errores producidos por obtener estos
 */
gestorRutaActividad.post('/buscar', async (solicitud, respuesta) => {
    /*
    DROP PROCEDURE IF EXISTS buscarActividad;
DELIMITER $$
CREATE PROCEDURE IF NOT EXISTS buscarActividad (
IN `@direccion` CHAR(4),
IN `@mes` CHAR(2),
IN `@agno` CHAR(4)
) BEGIN

SELECT D.codigoDireccion, Z.codigoZona, B.codigoUrbano, U.codigoUsuario, 
Z.sector,Z.subSector,Z.microSector,
B.denominacionBloque,
D.tipoAltitud,D.denominacionLote,D.ordenBloque,D.codigoInscripcion,
U.nombres, U.apellidosPaterno, U.apellidosMaterno,

AP.codigoActividad as codigoActividadPresion, AC.codigoActividad as codigoActividadContinuidad,
AP.fechaCreacion,AP.fechaFinal,AP.estadoActividad, CAST(AP.habilitado AS INTEGER) as habilitado,
IFNULL(MP.codigoPresion,'Sin datos') as codigoPresion, IFNULL(MC.codigoContinuidad,'Sin datos') as codigoContinuidad,
MC.r1HoraDe,MC.r1HoraA,MC.r2HoraDe,MC.r2HoraA,MP.lecturaArriba,MP.lecturaAbajo,
(SELECT COUNT(*) FROM observacion O WHERE O.codigoActividad = AP.codigoActividad) as observacion

FROM direccion D
INNER JOIN zona Z ON Z.codigoZona = D.codigoZona
INNER JOIN bloqueUrbano B ON B.codigoUrbano = D.codigoUrbano

LEFT JOIN actividad AP ON AP.codigoDireccion = D.codigoDireccion AND AP.tipoActividad = 1
AND CONVERT (AP.mesPeriodo, INTEGER) LIKE CONVERT(`@mes`, INTEGER) AND CONVERT (AP.agnoPeriodo, INTEGER) LIKE CONVERT ( `@agno`, INTEGER)
LEFT JOIN medicionPresion MP ON MP.codigoActividad = AP.codigoActividad

LEFT JOIN actividad AC ON AC.codigoDireccion = D.codigoDireccion AND AC.tipoActividad = 0
AND CONVERT (AC.mesPeriodo, INTEGER) LIKE CONVERT(`@mes`, INTEGER) AND CONVERT (AC.agnoPeriodo, INTEGER) LIKE CONVERT ( `@agno`, INTEGER)
LEFT JOIN medicionContinuidad MC ON MC.codigoActividad = AC.codigoActividad

LEFT JOIN usuario U ON U.codigoUsuario = AP.codigoUsuario
WHERE D.codigoDireccion=D.referenciaDireccion AND D.codigoDireccion LIKE BINARY `@direccion` ORDER BY D.ordenBloque;
END;
$$
DELIMITER ;
    */
    try {
        const{ codigoDireccion,mesPeriodo,agnoPeriodo } = solicitud.body;
        await proveedorDeDatos.query("CALL buscarActividad(?,?,?)", // Consulta a procedimiento almacenado
        [ codigoDireccion,mesPeriodo,agnoPeriodo ] 
        , (error, resultado) => {
            if (error)
            respuesta.json({ error : (error.sqlMessage + " - " + error.sql) }); // Enviar error en JSON
            else
            respuesta.json(resultado[0][0] ); // Enviar resultado de consulta en JSON
        });
        proveedorDeDatos.release(); //Liberar la conexión usada del POOL de conexiones
    }catch(error){ respuesta.json({ error : error.code }) }  // Enviar error en JSON
});

/**
 * @description Gestionar Ruta para Modificar una Actividad (PUT) "/api/actividad"
 * @since 0.0.1 
 * @param {object} solicitud Parámetros adjuntos a la petición Web de la ruta gestionada
 * @param {object} respuesta Gestor del despliegue de datos o errores
 * @returns {JSON} Datos de la base de datos o errores producidos por obtener estos
 */
gestorRutaActividad.put('/', async (solicitud, respuesta) => {
    /*
    DROP PROCEDURE IF EXISTS modificarActividad;
    DELIMITER $$
    CREATE PROCEDURE IF NOT EXISTS modificarActividad (
    IN `@actividad` INTEGER UNSIGNED,
    IN `@direccion` INTEGER UNSIGNED,
    IN `@usuario` INTEGER UNSIGNED,
    IN `@creacion` CHAR(10), -- 'fecha de asignacion del trabajo' 
    IN `@final` CHAR(10),
    IN `@habilitado` INTEGER UNSIGNED,
    IN `@quien` CHAR(32) CHARACTER SET utf8

    ) BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION ROLLBACK;
    START TRANSACTION;

    SET @estaHabilitado = 0;
    IF `@habilitado` = 1 THEN SET @estaHabilitado = HEX(1); 
    ELSE SET @estaHabilitado = HEX(0);  
    END IF;

    UPDATE actividad SET 
    codigoDireccion =`@direccion`,codigoUsuario =`@usuario`,fechaCreacion =`@creacion`, fechaFinal =`@final`,
    habilitado = @estaHabilitado --  estadoActividad = 2 - 1 Inscrito  -  2 Finalizado
    WHERE codigoActividad = `@actividad`;

    INSERT INTO bitacora VALUES (`@quien`, 10 , `@actividad`, 2, CURRENT_TIMESTAMP);

    COMMIT;
    END;
    $$
    DELIMITER ;
    */
    try {
        const { codigoActividad, codigoDireccion,codigoUsuario,fechaCreacion, fechaFinal, habilitado, quien } = solicitud.body;
        if (quien.length !== 32) {
            respuesta.json({ "error" : 'parámetro(s) INADECUADO(s)' }); 
        } else await proveedorDeDatos.query("CALL modificarActividad(?,?,?,?,?,?,?)", // Consulta a procedimiento almacenado
        [   codigoActividad,codigoDireccion,codigoUsuario,fechaCreacion,fechaFinal,habilitado,quien ]
        , (error, resultado) => {
            if (error)
            respuesta.json({ error : (error.sqlMessage + " - " + error.sql) }); // Enviar error en JSON
            else
            respuesta.send(resultado); // Enviar resultado de consulta en JSON
        });
        proveedorDeDatos.release(); //Liberar la conexión usada del POOL de conexiones
    }catch(error){ respuesta.json({ error : error.code }) }  // Enviar error en JSON
});

// Cambiar Habilitado de Actividad
/**
 * @description Gestionar Ruta para Cambiar el Estado de Habilitado de una Actividad (PUT) "/api/actividad/habilitado"
 * @since 0.0.1 
 * @param {object} solicitud Parámetros adjuntos a la petición Web de la ruta gestionada
 * @param {object} respuesta Gestor del despliegue de datos o errores
 * @returns {JSON} Datos de la base de datos o errores producidos por obtener estos
 */
gestorRutaActividad.put('/habilitado', async (solicitud, respuesta) => {
    /*
    DROP PROCEDURE IF EXISTS cambiarHabilitadoActividad;
    DELIMITER $$
    CREATE PROCEDURE IF NOT EXISTS cambiarHabilitadoActividad (
    IN `@actividad` INTEGER UNSIGNED,
    IN `@habilitado` INTEGER UNSIGNED,
    IN `@quien` CHAR(32) CHARACTER SET utf8

    ) BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION ROLLBACK;
    START TRANSACTION;

    SET @estaHabilitado = 0;
    IF `@habilitado` = 1 THEN SET @estaHabilitado = HEX(1); 
    ELSE SET @estaHabilitado = HEX(0);  
    END IF;

    UPDATE actividad SET habilitado = @estaHabilitado
    WHERE codigoActividad = `@actividad`;

    INSERT INTO bitacora VALUES (`@quien`, 10, `@actividad`, 2, CURRENT_TIMESTAMP);

    COMMIT;
    END;
    $$
    DELIMITER ;
    */
    try {
        const { codigoActividad,habilitado,quien } = solicitud.body;
        if (quien.length !== 32) {
            respuesta.json({ "error" : 'parámetro(s) INADECUADO(s)' });
        } else await proveedorDeDatos.query("CALL cambiarHabilitadoActividad(?,?,?)", [ codigoActividad,habilitado,quien ] // Consulta a procedimiento almacenado
        , (error, resultado) => {
            if (error)
            respuesta.json({ error : (error.sqlMessage + " - " + error.sql) }); // Enviar error en JSON
            else
            respuesta.send(resultado); // Enviar resultado de consulta en JSON
        });
        proveedorDeDatos.release(); //Liberar la conexión usada del POOL de conexiones
    }catch(error){ respuesta.json({ error : error.code }) }  // Enviar error en JSON
});

/**
 * @description Devuelve el Número de ACTIVIDADES registrados (incluyendo deshabilitados/por un PERÍODO determinado) gestionado con la ruta (GET) "/api/actividad/total"
 * @since 0.0.1 
 * @param {object} solicitud Parámetros adjuntos a la petición Web de la ruta gestionada
 * @param {object} respuesta Gestor del despliegue de datos o errores
 * @returns {JSON} Datos de la base de datos o errores producidos por obtener estos
 */
gestorRutaActividad.post('/total', async (solicitud, respuesta) => {
    /*
    DROP PROCEDURE IF EXISTS contarActividadesRegistradas;
    DELIMITER $$
    CREATE PROCEDURE IF NOT EXISTS contarActividadesRegistradas (
        IN `@mes` CHAR(2) CHARACTER SET utf8,
        IN `@agno` CHAR(4) CHARACTER SET utf8
    ) BEGIN 
    DECLARE EXIT HANDLER FOR SQLEXCEPTION ROLLBACK; 
    START TRANSACTION;
        SELECT count(*) AS total FROM actividad WHERE mesPeriodo=`@mes` AND agnoPeriodo=`@agno`; 
    COMMIT;
    END; 
    $$
    DELIMITER ;
    */
    try {
        const { mes, agno } = solicitud.body;
        await proveedorDeDatos.query( "CALL contarActividadesRegistradas(?, ?)",
        [ mes,agno ],    
        (error, resultado) => {
            if (error)
                respuesta.json({ "error" : error });
            else
                respuesta.json( resultado[0] );
        });
        proveedorDeDatos.release();
    } catch(errorExcepcion) { 
        respuesta.json({ "error" : errorExcepcion.code });
    }
});

/**
 * @description Verificar el Número de Procedimientos Almacenados para el módulo de Actividades (MEDICIONES) (GET) "/api/actividad/verificacion"
 * @since 0.0.1 
 * @param {object} solicitud Parámetros adjuntos a la petición Web de la ruta gestionada
 * @param {object} respuesta Gestor del despliegue de datos o errores
 * @returns {JSON} Datos de la base de datos o errores producidos por obtener estos
 */
gestorRutaActividad.get('/verificacion', async (solicitud, respuesta) => {
    /*
    DROP PROCEDURE IF EXISTS contarProcedimientosActividad;
    DELIMITER $$
    CREATE PROCEDURE IF NOT EXISTS contarProcedimientosActividad ( ) 
    BEGIN 
    DECLARE EXIT HANDLER FOR SQLEXCEPTION ROLLBACK; 
    START TRANSACTION;
        SELECT count(*) AS total
        FROM information_schema.routines
        WHERE specific_name='listarActividadesPorUsuario' OR
              specific_name='agregarActividad' OR
              specific_name='buscarActividad' OR
              specific_name='modificarActividad' OR
              specific_name='asignarOperadorBloque' OR 
              specific_name='cambiarHabilitadoActividad' OR
              specific_name='contarActividadesRegistradas'; 
    COMMIT;
    END; 
    $$
    DELIMITER ;
    */
    try { /* Nos debe dar [7] */
        await proveedorDeDatos.query( "CALL contarProcedimientosActividad()",
        (error, resultado) => {
            if (error)
                respuesta.json({ "error" : error });
            else
                respuesta.json( resultado[0] );
        });
        proveedorDeDatos.release();
    } catch(errorExcepcion) { 
        respuesta.json({ "error" : errorExcepcion.code });
    }
});

module.exports = gestorRutaActividad; //EXPORTAR FUNCIONES AL ROUTER

/*

INSERT INTO `actividad` (`codigoActividad`, `codigoUsuario`, `codigoDireccion`, `fechaCreacion`, `fechaFinal`, `mesPeriodo`, `agnoPeriodo`, `tipoActividad`, `estadoActividad`, `habilitado`) VALUES
(1,	4,	1,	'2020-02-29',	'2020-03-06',	'02',	'2020',	0,	2,	UNHEX('31')),
(16,	4,	1,	'2020-02-29',	'2020-03-06',	'02',	'2020',	1,	2,	UNHEX('31')),
(2,	4,	2,	'2020-02-29',	'2020-03-06',	'02',	'2020',	0,	2,	UNHEX('31')),
(17,	4,	2,	'2020-02-29',	'2020-02-06',	'02',	'2020',	1,	2,	UNHEX('31')),
(3,	4,	3,	'2020-02-29',	'2020-02-06',	'02',	'2020',	0,	1,	UNHEX('31')),
(18,	4,	3,	'2020-02-29',	'2020-02-06',	'02',	'2020',	1,	2,	UNHEX('31')),
(4,	4,	5,	'2020-02-29',	'2020-03-06',	'02',	'2020',	0,	1,	UNHEX('31')),
(19,	4,	5,	'2020-02-29',	'2020-03-06',	'02',	'2020',	1,	1,	UNHEX('31')),
(31,	4,	6,	'2020-02-29',	'2020-03-06',	'02',	'2020',	0,	1,	UNHEX('31')),
(38,	4,	6,	'2020-02-29',	'2020-03-06',	'02',	'2020',	1,	1,	UNHEX('31')),
(32,	4,	7,	'2020-02-29',	'2020-03-06',	'02',	'2020',	0,	1,	UNHEX('31')),
(39,	4,	7,	'2020-02-29',	'2020-03-06',	'02',	'2020',	1,	1,	UNHEX('31')),
(45,	4,	8,	'2020-02-29',	'2020-03-06',	'02',	'2020',	0,	1,	UNHEX('31')),
(52,	4,	8,	'2020-02-29',	'2020-03-06',	'02',	'2020',	1,	1,	UNHEX('31')),
(46,	4,	9,	'2020-02-29',	'2020-03-06',	'02',	'2020',	0,	1,	UNHEX('31')),
(53,	4,	9,	'2020-02-29',	'2020-03-06',	'02',	'2020',	1,	1,	UNHEX('31')),
(47,	4,	10,	'2020-02-29',	'2020-03-06',	'02',	'2020',	0,	1,	UNHEX('31')),
(54,	4,	10,	'2020-02-29',	'2020-03-06',	'02',	'2020',	1,	1,	UNHEX('31')),
(48,	4,	11,	'2020-02-29',	'2020-03-06',	'02',	'2020',	0,	1,	UNHEX('31')),
(55,	4,	11,	'2020-02-29',	'2020-03-06',	'02',	'2020',	1,	1,	UNHEX('31')),
(5,	4,	20,	'2020-02-29',	'2020-03-06',	'02',	'2020',	0,	2,	UNHEX('31')),
(20,	4,	20,	'2020-02-29',	'2020-03-06',	'02',	'2020',	1,	2,	UNHEX('31')),
(6,	4,	21,	'2020-02-29',	'2020-02-06',	'02',	'2020',	0,	1,	UNHEX('31')),
(21,	4,	21,	'2020-02-29',	'2020-02-06',	'02',	'2020',	1,	2,	UNHEX('31')),
(7,	4,	22,	'2020-02-29',	'2020-03-06',	'02',	'2020',	0,	1,	UNHEX('31')),
(22,	4,	22,	'2020-02-29',	'2020-02-06',	'02',	'2020',	1,	1,	UNHEX('31')),
(8,	4,	23,	'2020-02-29',	'2020-03-06',	'02',	'2020',	0,	1,	UNHEX('31')),
(23,	4,	23,	'2020-02-29',	'2020-03-06',	'02',	'2020',	1,	1,	UNHEX('31')),
(9,	4,	24,	'2020-02-29',	'2020-03-06',	'02',	'2020',	0,	1,	UNHEX('31')),
(24,	4,	24,	'2020-02-29',	'2020-03-06',	'02',	'2020',	1,	1,	UNHEX('31')),
(33,	4,	25,	'2020-02-29',	'2020-03-06',	'02',	'2020',	0,	1,	UNHEX('31')),
(40,	4,	25,	'2020-02-29',	'2020-03-06',	'02',	'2020',	1,	1,	UNHEX('31')),
(34,	4,	27,	'2020-02-29',	'2020-03-06',	'02',	'2020',	0,	1,	UNHEX('31')),
(41,	4,	27,	'2020-02-29',	'2020-03-06',	'02',	'2020',	1,	1,	UNHEX('31')),
(49,	4,	28,	'2020-02-29',	'2020-03-06',	'02',	'2020',	0,	1,	UNHEX('31')),
(56,	4,	28,	'2020-02-29',	'2020-03-06',	'02',	'2020',	1,	1,	UNHEX('31')),
(50,	4,	29,	'2020-02-29',	'2020-03-06',	'02',	'2020',	0,	1,	UNHEX('31')),
(57,	4,	29,	'2020-02-29',	'2020-03-06',	'02',	'2020',	1,	1,	UNHEX('31')),
(10,	4,	41,	'2020-02-29',	'2020-03-06',	'02',	'2020',	0,	1,	UNHEX('31')),
(25,	4,	41,	'2020-02-29',	'2020-03-06',	'02',	'2020',	1,	1,	UNHEX('31')),
(35,	4,	42,	'2020-02-29',	'2020-03-06',	'02',	'2020',	0,	1,	UNHEX('31')),
(42,	4,	42,	'2020-02-29',	'2020-03-06',	'02',	'2020',	1,	1,	UNHEX('31'));
INSERT INTO `medicionContinuidad` (`codigoContinuidad`, `codigoActividad`, `r1HoraDe`, `r1HoraA`, `r2horaDe`, `r2horaA`, `habilitado`) VALUES
(1,	5,	'10:26',	'08:27',	'08:27',	'10:27',	UNHEX('31')),
(2,	2,	'05:55',	'08:27',	'05:27',	'09:27',	UNHEX('31')),
(3,	1,	'06:25',	'05:20',	'05:20',	'05:20',	UNHEX('31'));
INSERT INTO `medicionPresion` (`codigoPresion`, `codigoActividad`, `lecturaArriba`, `lecturaAbajo`, `habilitado`) VALUES
(1,	20,	123.000,	123.000,	UNHEX('31')),
(2,	16,	145.000,	145.000,	UNHEX('31')),
(3,	21,	12.000,	12.000,	UNHEX('31')),
(4,	18,	12.000,	12.000,	UNHEX('31')),
(5,	17,	12.000,	12.000,	UNHEX('31'));

*/