
    SELECT S.Fecha, \"Servicio Externo\" as Tipo, concat(\"Se realiza un servicio externo  a   \", SE.Nombre, \" con comision  \", S.Comision) as Detalle, (S.Valor + S.Comision) AS Ingreso, '' AS Egreso
    FROM Servicio S
    INNER JOIN Servicio_Externo SE ON S.Servicio_Externo = SE.Id_Servicio_Externo
    WHERE S.Estado != \"Anulado\"
    AND cast(Fecha AS DATE) = Cast('$fecha' AS Date)
    AND Identificacion_Funcionario =  \"$id_funcionario\"
    AND Id_Moneda = \"$moneda[Id_Moneda] \"
    AND Id_Moneda = \"$moneda[Id_Moneda] \"
   # ORDER BY Fecha DESC

UNION ALL

    SELECT S.Fecha_Pago AS Fecha, \"Servicio Externo\" as Tipo, concat(\"Se realiza un pago de servicio externo  a   \", SE.Nombre, \" con comision  \", S.Comision) as Detalle, '' AS Ingreso,(S.Valor + S.Comision) AS Egreso
    FROM Servicio S
    INNER JOIN Servicio_Externo SE ON S.Servicio_Externo = SE.Id_Servicio_Externo
    WHERE S.Estado = \"Pagado\"
    AND cast(Fecha_Pago AS DATE) = Cast('$fecha' AS Date)
    AND Id_Funcionario_Destino =  \"$id_funcionario\"
    AND Id_Moneda = \"$moneda[Id_Moneda] \"
    AND Id_Moneda = \"$moneda[Id_Moneda] \"
ORDER BY Fecha