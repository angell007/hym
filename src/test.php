$query_devueltas = "SELECT
    T.Id_Transferencia,
    T.Fecha,
    T.Cantidad_Transferida,
    T.Tasa_Cambio,
    TD.Id_Transferencia_Destinatario,
    TD.Estado,
    TD.Valor_Transferencia,
    TD.Numero_Documento_Destino,
    SUBSTRING(R.Codigo, 3) as Codigo,
    CONCAT(F.Nombres, \" \" , F.Apellidos) as NombreCajero,
    DC.Numero_Cuenta AS Cuenta_Destino,
    D.Nombre AS Destinatario,
  (SELECT Codigo FROM Moneda WHERE Id_Moneda = TD.Id_Moneda) AS Codigo_Moneda,
    IFNULL((SELECT 
              SUM(Valor)
            FROM Pago_Transfenecia
            WHERE Id_Transferencia_Destino = TD.Id_Transferencia_Destinatario AND Devuelta = \"No\"), \"0\") AS Pago_Parcial,
    (CAST(TD.Valor_Transferencia AS DECIMAL(20,2)) - IFNULL((SELECT 
              SUM(Valor)
            FROM Pago_Transfenecia
            WHERE Id_Transferencia_Destino = TD.Id_Transferencia_Destinatario AND Devuelta = \"No\"), 0)) AS Valor_Real,
  IFNULL((SELECT CONCAT_WS(\" \", Nombres, Apellidos) FROM Funcionario WHERE Identificacion_Funcionario = PT.Cajero), \"Disponible\") AS Funcionario_Bloqueo,
  (CASE
    WHEN TD.Estado = \"Pagada\" THEN 1
    WHEN TD.Estado = \"Pendiente\" THEN 2
   END) AS Orden_Consulta,
  IFNULL((SELECT 
            Id_Pago_Transfenecia 
          FROM Pago_Transfenecia 
          WHERE Id_Transferencia_Destino = TD.Id_Transferencia_Destinatario AND Devuelta = \"Si\" LIMIT 1), \"0\") AS Devolucion
  FROM Transferencia T  
  INNER JOIN Recibo R ON T.Id_Transferencia = R.Id_Transferencia
  INNER JOIN Funcionario F ON F.Identificacion_Funcionario = T.Identificacion_Funcionario
  INNER JOIN Transferencia_Destinatario TD ON T.Id_Transferencia = TD.Id_Transferencia
INNER JOIN Pago_Transfenecia PT ON TD.Id_Transferencia_Destinatario = PT.Id_Transferencia_Destino 
  INNER JOIN Destinatario_Cuenta DC ON TD.Id_Destinatario_Cuenta = DC.Id_Destinatario_Cuenta
  INNER JOIN Destinatario D ON TD.Numero_Documento_Destino = D.Id_Destinatario $condicion";