SELECT T.Fecha,
    MT.*,
    IFNULL(TMT.Nombre, "Sin Tipo") AS Movimiento,
    (
        SELECT Codigo
        FROM Moneda
        WHERE Id_Moneda = 1
    ) AS Codigo_Moneda,
    IF(
        MT.Id_Tipo_Movimiento = 1
        OR MT.Id_Tipo_Movimiento = 7,
        T.Nombre,
        " "
    ) AS Cajero,
    IF(
        MT.Id_Tipo_Movimiento = 1
        OR MT.Id_Tipo_Movimiento = 7,
        T.Movimiento_Alt,
        " "
    ) AS Movimiento_Alt
FROM Movimiento_Tercero MT
    LEFT JOIN Tipo_Movimiento_Tercero TMT ON MT.Id_Tipo_Movimiento = TMT.Id_Tipo_Movimiento_Tercero
    LEFT JOIN (
        SELECT CONCAT_WS(" ", Nombres, Apellidos) AS Nombre,
            T.Id_Transferencia,
            CONCAT(
                Forma_Pago,
                "/",
                Tipo_Transferencia
            ) AS Movimiento_Alt,
            T.Fecha
        FROM Transferencia T
            INNER JOIN Funcionario T2 ON T.Identificacion_Funcionario = T2.Identificacion_Funcionario
    ) T ON T.Id_Transferencia = MT.Valor_Tipo_Movimiento
WHERE MT.Id_Tercero = 12363
    AND MT.Id_Moneda_Valor = 1
    AND DATE (T.Fecha) = '2020-12-04'
ORDER BY Fecha_Creacion ASC