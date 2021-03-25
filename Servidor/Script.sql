-- PROCEDURES
DELIMITER ;;
USE `medi_seda`;;

DROP PROCEDURE IF EXISTS agregarNuevaDireccion;;
CREATE PROCEDURE IF NOT EXISTS agregarNuevaDireccion (
    IN `@zona` INTEGER UNSIGNED, 
    IN `@urbano` INTEGER UNSIGNED,
    IN `@denominacion` VARCHAR(80) CHARACTER SET utf8,
    IN `@altitud` TINYINT(1) UNSIGNED,
    IN `@inscripcion` VARCHAR(12) CHARACTER SET utf8,
    IN `@continuidad` INTEGER UNSIGNED,
    IN `@presion` INTEGER UNSIGNED,
    IN `@hred` INTEGER UNSIGNED,
    IN `@quien` CHAR(32) CHARACTER SET utf8
) BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION ROLLBACK;
    START TRANSACTION;
    
    SET @ultimoCodigo=0,@orden=0;
    SELECT MAX(codigoDireccion) INTO @ultimoCodigo from direccion;
    SELECT COALESCE(MAX(ordenBloque),0)+1 INTO @orden from direccion 
    WHERE direccion.codigoUrbano LIKE `@urbano`;

    INSERT INTO direccion(codigoDireccion,referenciaDireccion,codigoZona,codigoUrbano,ordenBloque,denominacionLote,tipoAltitud,codigoInscripcion,medirContinuidad,medirPresion,hRed) 
    VALUES (@ultimoCodigo+1,@ultimoCodigo+1,`@zona`,`@urbano`,@orden,`@denominacion`, `@altitud`, `@inscripcion`,`@continuidad`,`@presion`,`@hred`);
    INSERT INTO bitacora VALUES (`@quien`, 7, @ultimoCodigo+1, 0, CURRENT_TIMESTAMP);

    COMMIT;
END;;