SELECT IF(sum(Valor_Origen) > 0, sum(Valor_Origen), 0) AS Ingreso_Total,
    t2.Nombre as Moneda,
    t2.Codigo as Codigo,
    t2.Id_Moneda as Moneda_Id,
    "color" AS Color
FROM Cambio t1
    inner join Moneda t2 on t1.Moneda_Origen = t2.Id_Moneda
where t1.Moneda_Origen = 1
    AND Identificacion_Funcionario = 1524854
    AND t1.Estado <> "Anulado"
group by t2.Id_Moneda

Union All

SELECT sum(Valor_Destino) AS Egreso_Total,
    t2.Nombre as Moneda,
    t2.Codigo as Codigo,
    t2.Id_Moneda as Moneda_Id,
    "color" AS Color
FROM Cambio t1
    inner join Moneda t2 on t1.Moneda_Destino = t2.Id_Moneda
where t1.Moneda_Destino = 1
    AND Identificacion_Funcionario = 1524854
    AND t1.Estado <> "Anulado"
group by t2.Id_Moneda ;