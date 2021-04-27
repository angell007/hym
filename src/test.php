SELECT T.Id_Transferencia, PT.Cajero,
T.Fecha,
SUBSTRING(R.Codigo, 3) as Codigo,
CONCAT(F.Nombres, " " , F.Apellidos) as NombreCajero,
CONCAT(FP.Nombres, " " , FP.Apellidos) as RealizadaPor,
TR.Nombre AS Nombre_Remitente,
DC.Numero_Cuenta AS Cuenta_Destino,
D.Nombre as Destinatario,
SUM(PT.Valor) as Valor_Real,
TD.Estado
FROM Transferencia T
INNER JOIN Transferencia_Destinatario TD ON T.Id_Transferencia = TD.Id_Transferencia
INNER JOIN Pago_Transfenecia PT ON TD.Id_Transferencia_Destinatario = PT.Id_Transferencia_Destino
INNER JOIN Recibo R ON T.Id_Transferencia = R.Id_Transferencia
INNER JOIN Funcionario F ON F.Identificacion_Funcionario = T.Identificacion_Funcionario
INNER JOIN Funcionario FP ON FP.Identificacion_Funcionario = PT.Cajero
INNER JOIN Destinatario D ON TD.Numero_Documento_Destino = D.Id_Destinatario
INNER JOIN Destinatario_Cuenta DC ON TD.Id_Destinatario_Cuenta = DC.Id_Destinatario_Cuenta
INNER JOIN Transferencia_Remitente TR ON TR.Id_Transferencia_Remitente = T.Documento_Origen
WHERE PT.Devuelta = "No"
' . $condicionA . '
AND TD.Estado = "Pagada" ' . $devolucion . '
GROUP BY T.Id_Transferencia, FP.Identificacion_Funcionario



SELECT DISTINCT MT.Id_Movimiento_Tercero, MT.Fecha, TMT.Nombre as Movimiento,
CONCAT_WS(" ", F.Nombres, F.Apellidos) as Cajero,
MT.Detalle,
case when MT.Tipo = "Ingreso" then MT.Valor else 0 end as IngresoCOP,
case when MT.Tipo = "Egreso" then MT.Valor else 0 end as EgresoCOP,
0 as IngresoBsS, 0 as EgresoBsS,
0 as IngresoUSD, 0 as EgresoUSD
FROM Movimiento_Tercero MT
INNER JOIN Tipo_Movimiento_Tercero TMT on MT.Id_Tipo_Movimiento = TMT.Id_Tipo_Movimiento_Tercero
INNER JOIN Funcionario F on F.Identificacion_Funcionario = MT.Id_Funcionario
INNER JOIN Compra CO on CO.Id_Tercero = MT.Id_Tercero
WHERE MT.Id_Tercero = 12350
and MT.Id_Moneda_Valor = 2
union
SELECT DISTINCT MT.Id_Movimiento_Tercero, MT.Fecha, TMT.Nombre as Movimiento,
CONCAT_WS(" ", F.Nombres, F.Apellidos) as Cajero,
MT.Detalle,
0 as IngresoCOP, 0 as EgresoCOP,
case when MT.Tipo = "Ingreso" then MT.Valor else 0 end as IngresoBsS,
case when MT.Tipo = "Egreso" then MT.Valor else 0 end as EgresoBsS,
0 as IngresoUSD, 0 as EgresoUSD
FROM Movimiento_Tercero MT
INNER JOIN Tipo_Movimiento_Tercero TMT on MT.Id_Tipo_Movimiento = TMT.Id_Tipo_Movimiento_Tercero
INNER JOIN Funcionario F on F.Identificacion_Funcionario = MT.Id_Funcionario
INNER JOIN Compra CO on CO.Id_Tercero = MT.Id_Tercero and MT.Id_Compra = CO.Id_Compra
WHERE MT.Id_Tercero = 12350
and MT.Id_Moneda_Valor = 1
union
SELECT DISTINCT MT.Id_Movimiento_Tercero, MT.Fecha, TMT.Nombre as Movimiento,
CONCAT_WS(" ", F.Nombres, F.Apellidos) as Cajero,
MT.Detalle,
0 as IngresoCOP, 0 as EgresoCOP,
0 as IngresoBsS , 0 as EgresoBsS,
case when MT.Tipo = "Ingreso" then MT.Valor else 0 end as IngresoUSD,
case when MT.Tipo = "Egreso" then MT.Valor else 0 end as EgresoUSD
FROM Movimiento_Tercero MT
INNER JOIN Tipo_Movimiento_Tercero TMT on MT.Id_Tipo_Movimiento = TMT.Id_Tipo_Movimiento_Tercero
INNER JOIN Funcionario F on F.Identificacion_Funcionario = MT.Id_Funcionario
INNER JOIN Compra CO on CO.Id_Tercero = MT.Id_Tercero and MT.Id_Compra = CO.Id_Compra
WHERE MT.Id_Tercero = 12350
and MT.Id_Moneda_Valor = 12

<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
header('Content-Type: application/json');

include_once('../../class/class.querybasedatos.php');
include_once('../../class/class.paginacion.php');
#exit;
$pagina = (isset($_REQUEST['pag']) ? $_REQUEST['pag'] : '');
$pageSize = (isset($_REQUEST['tam']) ? $_REQUEST['tam'] : '');
$id_funcionario = (isset($_REQUEST['id_funcionario']) ? $_REQUEST['id_funcionario'] : '');
$paginacion = (isset($_REQUEST['paginacion']) && $_REQUEST['paginacion'] != 'false' ? $_REQUEST['paginacion'] : false);


$condicion = ' WHERE (T.Estado = "Activa" OR T.Estado = "Pagada") ';
$condicion = SetCondiciones($condicion);
$condicionA = '';

$having = SetHaving($_REQUEST);


$havingRealiza = "";

if (isset($_REQUEST['realiza']) && strtolower($_REQUEST['realiza'])) {
    $havingRealiza = '   (NombreFuncionarioOpera  LIKE "%' . $_REQUEST['realiza'] . '%" OR Funcionario_Bloqueo LIKE "%' . $_REQUEST['realiza'] . '%" ) ';
}

$devolucion = '';
if (isset($_REQUEST['estado']) && strtolower($_REQUEST['estado']) == 'devuelta') {
    $devolucion = ' Having Devolucion != 0  ';
}
if (isset($_REQUEST['estado']) && strtolower($_REQUEST['estado']) == 'pendiente') {
    $devolucion = ' Having Devolucion = 0   ';
}

if ($devolucion && $havingRealiza) {
    $devolucion .= ' AND  ' . $havingRealiza . ' ';
} else if ($havingRealiza) {
    $devolucion = ' HAVING  ' . $havingRealiza . ' ';
}
if (strtolower($req['estado']) == 'todos' && $havingRealiza) {
    $devolucion = ' HAVING  ' . $havingRealiza . ' ';
}

$query_pendiente = 'SELECT  "1" AS SEC,
                TD.Funcionario_Opera,
                CONCAT_WS(" ", FF.Nombres, FF.Apellidos) as NombreFuncionarioOpera, 
                
                TR.Nombre AS Nombre_Remitente,
                T.Id_Transferencia,
                T.Alertada,
                T.Fecha,
                T.Cantidad_Transferida,
                T.Tasa_Cambio,
                TD.Id_Transferencia_Destinatario,
                TD.Estado,
                TD.Valor_Transferencia,
                TD.Numero_Documento_Destino,

                TD.Bloqueada,
                TD.Seleccionada,
                TD.Estado_Consultor,
                SUBSTRING(R.Codigo, 3) as Codigo,
                 T.Agente_Externo,
                CONCAT(F.Nombres, " " , F.Apellidos) as NombreCajero,

                DC.Numero_Cuenta AS Cuenta_Destino,
                D.Nombre AS Destinatario,
                D.Id_Destinatario As Doc_Destinatario,
                D.Tipo_Documento As Type_Documento,
                (SELECT Codigo FROM Moneda WHERE Id_Moneda = TD.Id_Moneda) AS Codigo_Moneda,
                IFNULL((SELECT 
                SUM(Valor)

	              FROM Pago_Transfenecia
	              WHERE Id_Transferencia_Destino = TD.Id_Transferencia_Destinatario AND Devuelta = "No"), "0") AS Pago_Parcial,
	      (CAST(TD.Valor_Transferencia AS DECIMAL(20,2)) - IFNULL((SELECT 
	                SUM(Valor)
	              FROM Pago_Transfenecia
	              WHERE Id_Transferencia_Destino = TD.Id_Transferencia_Destinatario AND Devuelta = "No"), 0)) AS Valor_Real,
                IFNULL((SELECT CONCAT_WS(" ", Nombres, Apellidos) FROM Funcionario WHERE Identificacion_Funcionario = PT.Cajero), "Disponible") AS Funcionario_Bloqueo,
        
        (CASE
          WHEN TD.Estado = "Pagada" THEN 1
          WHEN TD.Estado = "Pendiente" THEN 2
         END) AS Orden_Consulta,
        IFNULL((SELECT 
                  Id_Pago_Transfenecia 
                FROM Pago_Transfenecia 
                WHERE Id_Transferencia_Destino = TD.Id_Transferencia_Destinatario AND Devuelta = "Si" LIMIT 1), "0") AS Devolucion
	    FROM Transferencia T  
	    INNER JOIN Recibo R ON T.Id_Transferencia = R.Id_Transferencia
	    INNER JOIN Funcionario F ON F.Identificacion_Funcionario = T.Identificacion_Funcionario AND T.Agente_Externo = "No"
	    INNER JOIN Transferencia_Destinatario TD ON T.Id_Transferencia = TD.Id_Transferencia
        left join Funcionario FF on TD.Funcionario_Opera = FF.Identificacion_Funcionario
        LEFT JOIN Pago_Transfenecia PT ON TD.Id_Transferencia_Destinatario = PT.Id_Transferencia_Destino AND Devuelta = "No"
	    INNER JOIN Destinatario_Cuenta DC ON TD.Id_Destinatario_Cuenta = DC.Id_Destinatario_Cuenta
	    INNER JOIN Destinatario D ON TD.Numero_Documento_Destino = D.Id_Destinatario
	    INNER JOIN Transferencia_Remitente TR  ON TR.Id_Transferencia_Remitente = T.Documento_Origen
	 
	        ' . $condicion . '
        AND TD.Estado = "Pendiente"  AND T.Agente_Externo = "No" ' . $devolucion . '    
        Group By Id_Transferencia_Destinatario
        
        
        UNION ALL (
        
        
        
        SELECT  "1" AS SEC,
                TD.Funcionario_Opera,
                CONCAT_WS(" ", FF.Nombres, FF.Apellidos) as NombreFuncionarioOpera, 
                
                TR.Nombre AS Nombre_Remitente,
                T.Id_Transferencia,
                T.Alertada,
                T.Fecha,
                T.Cantidad_Transferida,
                T.Tasa_Cambio,
                TD.Id_Transferencia_Destinatario,
                TD.Estado,
                TD.Valor_Transferencia,
                TD.Numero_Documento_Destino,

                TD.Bloqueada,
                TD.Seleccionada,
                TD.Estado_Consultor,
                SUBSTRING(R.Codigo, 3) as Codigo,
                
                  T.Agente_Externo,
                F.Nombre  as NombreCajero,

                DC.Numero_Cuenta AS Cuenta_Destino,
                D.Nombre AS Destinatario,
                D.Id_Destinatario As Doc_Destinatario,
                D.Tipo_Documento As Type_Documento,
                (SELECT Codigo FROM Moneda WHERE Id_Moneda = T.Moneda_Destino) AS Codigo_Moneda,
                IFNULL((SELECT 
                SUM(Valor)

	              FROM Pago_Transfenecia
	              WHERE Id_Transferencia_Destino = TD.Id_Transferencia_Destinatario AND Devuelta = "No"), "0") AS Pago_Parcial,
	      (CAST(TD.Valor_Transferencia AS DECIMAL(20,2)) - IFNULL((SELECT 
	                SUM(Valor)
	              FROM Pago_Transfenecia
	              WHERE Id_Transferencia_Destino = TD.Id_Transferencia_Destinatario AND Devuelta = "No"), 0)) AS Valor_Real,
                IFNULL((SELECT CONCAT_WS(" ", Nombres, Apellidos) FROM Funcionario WHERE Identificacion_Funcionario = PT.Cajero), "Disponible") AS Funcionario_Bloqueo,
        
        (CASE
          WHEN TD.Estado = "Pagada" THEN 1
          WHEN TD.Estado = "Pendiente" THEN 2
         END) AS Orden_Consulta,
        IFNULL((SELECT 
                  Id_Pago_Transfenecia 
                FROM Pago_Transfenecia 
                WHERE Id_Transferencia_Destino = TD.Id_Transferencia_Destinatario AND Devuelta = "Si" LIMIT 1), "0") AS Devolucion
	    FROM Transferencia T  
	    INNER JOIN Recibo R ON T.Id_Transferencia = R.Id_Transferencia
	    INNER JOIN Agente_Externo F ON F.Id_Agente_Externo = T.Identificacion_Funcionario AND T.Agente_Externo = "Si"
	    INNER JOIN Transferencia_Destinatario TD ON T.Id_Transferencia = TD.Id_Transferencia
        left join Funcionario FF on TD.Funcionario_Opera = FF.Identificacion_Funcionario
        LEFT JOIN Pago_Transfenecia PT ON TD.Id_Transferencia_Destinatario = PT.Id_Transferencia_Destino AND Devuelta = "No"
	    INNER JOIN Destinatario_Cuenta_Externo DC ON TD.Id_Destinatario_Cuenta = DC.Id_Destinatario_Cuenta
	    INNER JOIN Destinatario_Externo D ON TD.Numero_Documento_Destino = D.Id_Destinatario
	    INNER JOIN Transferencia_Remitente_Externo TR  ON TR.Id_Transferencia_Remitente = T.Documento_Origen
	 
	        ' . $condicionA . '
        AND TD.Estado = "Pendiente" AND T.Agente_Externo = "Si" ' . $devolucion . '    
        Group By Id_Transferencia_Destinatario
        
        
        
        
        )
        
        ';

// echo $query_pendiente;exit;

$query_pagadas = 'SELECT
    "2" AS SEC,
                       TD.Funcionario_Opera,
                CONCAT_WS(" ", FF.Nombres, FF.Apellidos) as NombreFuncionarioOpera,
	TR.Nombre AS Nombre_Remitente,
        T.Id_Transferencia,
        T.Fecha,
        T.Codigo as  xxx ,
        T.Cantidad_Transferida,
        Alertada AS "No",
        T.Tasa_Cambio,
        TD.Id_Transferencia_Destinatario,
        TD.Estado,
        TD.Valor_Transferencia,
        TD.Numero_Documento_Destino,
        
        TD.Bloqueada,
        TD.Seleccionada,
        TD.Estado_Consultor,
        T.Agente_Externo,
        SUBSTRING(R.Codigo, 3) as Codigo,
        CONCAT(F.Nombres, " " , F.Apellidos) as NombreCajero,
        
        DC.Numero_Cuenta AS Cuenta_Destino,
        D.Nombre AS Destinatario,
        D.Id_Destinatario As Doc_Destinatario,
        D.Tipo_Documento As Type_Documento,
        (SELECT Codigo FROM Moneda WHERE Id_Moneda = TD.Id_Moneda) AS Codigo_Moneda,
        IFNULL((SELECT 
                  SUM(Valor)
                FROM Pago_Transfenecia
                WHERE Id_Transferencia_Destino = TD.Id_Transferencia_Destinatario AND Devuelta = "No"), "0") AS Pago_Parcial,
        (CAST(TD.Valor_Transferencia AS DECIMAL(20,2)) - IFNULL((SELECT 
                  SUM(Valor)
                FROM Pago_Transfenecia
                WHERE Id_Transferencia_Destino = TD.Id_Transferencia_Destinatario AND Devuelta = "No"), 0)) AS Valor_Real,
        IFNULL((SELECT CONCAT_WS(" ", Nombres, Apellidos) FROM Funcionario WHERE Identificacion_Funcionario = PT.Cajero), "Disponible") AS Funcionario_Bloqueo,
        (CASE
          WHEN TD.Estado = "Pagada" THEN 1
          WHEN TD.Estado = "Pendiente" THEN 2
         END) AS Orden_Consulta,
        IFNULL((SELECT 
                  Id_Pago_Transfenecia 
                FROM Pago_Transfenecia 
                WHERE Id_Transferencia_Destino = TD.Id_Transferencia_Destinatario AND Devuelta = "Si" LIMIT 1), "0") AS Devolucion
        FROM Transferencia T  
        INNER JOIN Recibo R ON T.Id_Transferencia = R.Id_Transferencia
        INNER JOIN Funcionario F ON F.Identificacion_Funcionario = T.Identificacion_Funcionario AND T.Agente_Externo = "No"
        INNER JOIN Transferencia_Destinatario TD ON T.Id_Transferencia = TD.Id_Transferencia
        LEFT  JOIN Funcionario FF on TD.Funcionario_Opera = FF.Identificacion_Funcionario
        LEFT  JOIN Pago_Transfenecia PT ON TD.Id_Transferencia_Destinatario = PT.Id_Transferencia_Destino AND Devuelta = "No"
        INNER JOIN Destinatario_Cuenta DC ON TD.Id_Destinatario_Cuenta = DC.Id_Destinatario_Cuenta
        INNER JOIN Destinatario D ON TD.Numero_Documento_Destino = D.Id_Destinatario
        INNER JOIN Transferencia_Remitente TR  ON TR.Id_Transferencia_Remitente = T.Documento_Origen
        ' . $condicion . '
        AND TD.Estado = "Pagada"  AND T.Agente_Externo = "No" ' . $devolucion . '
        UNION ALL(
        
        SELECT
    "2" AS SEC,
                       TD.Funcionario_Opera,
                CONCAT_WS(" ", FF.Nombres, FF.Apellidos) as NombreFuncionarioOpera,
	TR.Nombre AS Nombre_Remitente,
        T.Id_Transferencia,
        T.Fecha,
        T.Codigo as  xxx ,
        T.Cantidad_Transferida,
        Alertada AS "No",
        T.Tasa_Cambio,
        TD.Id_Transferencia_Destinatario,
        TD.Estado,
        TD.Valor_Transferencia,
        TD.Numero_Documento_Destino,
        
        TD.Bloqueada,
        TD.Seleccionada,
        TD.Estado_Consultor,
        T.Agente_Externo,
        SUBSTRING(R.Codigo, 3) as Codigo,
         F.Nombre  as NombreCajero,
        
        DC.Numero_Cuenta AS Cuenta_Destino,
        D.Nombre AS Destinatario,
        D.Id_Destinatario As Doc_Destinatario,
        D.Tipo_Documento As Type_Documento,
        (SELECT Codigo FROM Moneda WHERE Id_Moneda = TD.Id_Moneda) AS Codigo_Moneda,
        IFNULL((SELECT 
                  SUM(Valor)
                FROM Pago_Transfenecia
                WHERE Id_Transferencia_Destino = TD.Id_Transferencia_Destinatario AND Devuelta = "No"), "0") AS Pago_Parcial,
        (CAST(TD.Valor_Transferencia AS DECIMAL(20,2)) - IFNULL((SELECT 
                  SUM(Valor)
                FROM Pago_Transfenecia
                WHERE Id_Transferencia_Destino = TD.Id_Transferencia_Destinatario AND Devuelta = "No"), 0)) AS Valor_Real,
        IFNULL((SELECT CONCAT_WS(" ", Nombres, Apellidos) FROM Funcionario WHERE Identificacion_Funcionario = PT.Cajero), "Disponible") AS Funcionario_Bloqueo,
        (CASE
          WHEN TD.Estado = "Pagada" THEN 1
          WHEN TD.Estado = "Pendiente" THEN 2
         END) AS Orden_Consulta,
        IFNULL((SELECT 
                  Id_Pago_Transfenecia 
                FROM Pago_Transfenecia 
                WHERE Id_Transferencia_Destino = TD.Id_Transferencia_Destinatario AND Devuelta = "Si" LIMIT 1), "0") AS Devolucion
        FROM Transferencia T  
        INNER JOIN Recibo R ON T.Id_Transferencia = R.Id_Transferencia
        INNER JOIN Agente_Externo F ON F.Id_Agente_Externo = T.Identificacion_Funcionario AND T.Agente_Externo = "Si"
        INNER JOIN Transferencia_Destinatario TD ON T.Id_Transferencia = TD.Id_Transferencia
        LEFT  JOIN Funcionario FF on TD.Funcionario_Opera = FF.Identificacion_Funcionario
        LEFT  JOIN Pago_Transfenecia PT ON TD.Id_Transferencia_Destinatario = PT.Id_Transferencia_Destino AND Devuelta = "No"
        INNER JOIN Destinatario_Cuenta_Externo DC ON TD.Id_Destinatario_Cuenta = DC.Id_Destinatario_Cuenta
        INNER JOIN Destinatario_Externo D ON TD.Numero_Documento_Destino = D.Id_Destinatario
        INNER JOIN Transferencia_Remitente_Externo TR  ON TR.Id_Transferencia_Remitente = T.Documento_Origen
        ' . $condicionA . '
        AND TD.Estado = "Pagada"   AND T.Agente_Externo = "Si" ' . $devolucion . '
        )
        ';
//echo $query_pagadas;exit;
$query_devueltas = "SELECT
	TR.Nombre AS Nombre_Remitente,
	
    T.Id_Transferencia,
    T.Fecha,
    T.Cantidad_Transferida,
    T.Tasa_Cambio,
    TD.Id_Transferencia_Destinatario,
    TD.Estado,
    TD.Valor_Transferencia,
    TD.Numero_Documento_Destino,
    TD.Bloqueada,
    TD.Seleccionada,
    TD.Estado_Consultor,
    SUBSTRING(R.Codigo, 3) as Codigo,
    CONCAT(F.Nombres, \" \" , F.Apellidos) as NombreCajero,
    DC.Numero_Cuenta AS Cuenta_Destino,
    D.Nombre AS Destinatario,
    D.Id_Destinatario As Doc_Destinatario,
    D.Tipo_Documento As Type_Documento,
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
  LEFT JOIN Pago_Transfenecia PT ON TD.Id_Transferencia_Destinatario = PT.Id_Transferencia_Destino 
  INNER JOIN Destinatario_Cuenta DC ON TD.Id_Destinatario_Cuenta = DC.Id_Destinatario_Cuenta
  INNER JOIN Destinatario D ON TD.Numero_Documento_Destino = D.Id_Destinatario 
  INNER JOIN Transferencia_Remitente TR  ON TR.Id_Transferencia_Remitente = T.Documento_Origen
  $condicion";

$query_pagadas_parciales = '
        SELECT 
        	TR.Nombre AS Nombre_Remitente,
          T.Id_Transferencia,
          TD.Id_Transferencia_Destinatario,
          T.Fecha,
          SUBSTRING(R.Codigo, 3) as Codigo,
          CONCAT(F.Nombres, " " , F.Apellidos) as NombreCajero,
          T.Cantidad_Transferida,
          TD.Valor_Transferencia,
          TD.Numero_Documento_Destino,
          TD.Bloqueada,
          TD.Seleccionada,
          TD.Estado_Consultor,
          DC.Numero_Cuenta AS Cuenta_Destino,
          D.Nombre AS Destinatario,
          D.Id_Destinatario As Doc_Destinatario,
          D.Tipo_Documento As Type_Documento,
          "Pagada" AS Estado,
          (SELECT Codigo FROM Moneda WHERE Id_Moneda = TD.Id_Moneda) AS Codigo_Moneda,
          IFNULL((SELECT 
                    SUM(Valor)
                  FROM Pago_Transfenecia
                  WHERE Id_Transferencia_Destino = TD.Id_Transferencia_Destinatario AND Devuelta = "No"), "0") AS Pago_Parcial,
          T.Tasa_Cambio,
          (CAST(TD.Valor_Transferencia AS DECIMAL(20,2)) - IFNULL((SELECT 
                    SUM(Valor)
                  FROM Pago_Transfenecia
                  WHERE Id_Transferencia_Destino = TD.Id_Transferencia_Destinatario AND Devuelta = "No"), 0)) AS Valor_Real,
          IFNULL((SELECT CONCAT_WS(" ", Nombres, Apellidos) FROM Funcionario WHERE Identificacion_Funcionario = PT.Cajero), "Disponible") AS Funcionario_Bloqueo,
          1 AS Orden_Consulta,
           IFNULL((SELECT Id_Pago_Transfenecia FROM Pago_Transfenecia WHERE Id_Transferencia_Destino = TD.Id_Transferencia_Destinatario AND Devuelta = "Si" LIMIT 1), "0") AS Devolucion
        FROM Transferencia T  
        INNER JOIN Recibo R ON T.Id_Transferencia = R.Id_Transferencia
        INNER JOIN Funcionario F ON F.Identificacion_Funcionario = T.Identificacion_Funcionario
        INNER JOIN Transferencia_Destinatario TD ON T.Id_Transferencia = TD.Id_Transferencia
        LEFT JOIN Pago_Transfenecia PT ON TD.Id_Transferencia_Destinatario = PT.Id_Transferencia_Destino AND Devuelta = "No"
        INNER JOIN Destinatario_Cuenta DC ON TD.Id_Destinatario_Cuenta = DC.Id_Destinatario_Cuenta
        INNER JOIN Destinatario D ON TD.Numero_Documento_Destino = D.Id_Destinatario
          INNER JOIN Transferencia_Remitente TR  ON TR.Id_Transferencia_Remitente = T.Documento_Origen
        ' . $condicion . '
        AND PT.Cajero = ' . $id_funcionario . ' AND TD.Estado = "Pendiente"';

$orderby = '';
if (isset($_REQUEST['estado']) && $_REQUEST['estado'] == 'Pagada') {
    $query_union =  $query_pagadas . ' ';
    $orderby = ' ORDER BY  r.Orden_Consulta DESC , r.Fecha DESC ';
} else {
    $query_union = $query_pendiente . ' ';
    $orderby =  'ORDER BY r.Alertada DESC, r.Orden_Consulta DESC , r.Fecha DESC';
}

$query_union = "
        SELECT 
            r.*
          FROM ($query_union) r
            $orderby
         ";

if ($paginacion == 'true') {

    $query_paginacion = "
            SELECT 
                COUNT(*) AS Total
              FROM ($query_union) r";

    $paginationObj = new PaginacionData($pageSize, $query_paginacion, $pagina);
    $queryObj = new QueryBaseDatos($query_union);
    $result = $queryObj->Consultar('Multiple', true, $paginationObj);
} else {
    $queryObj = new QueryBaseDatos($query_union);
    $result = $queryObj->Consultar('Multiple');
}

echo json_encode($result);

function SetCondiciones($condicion)
{
    global $condicionA;
    $req = $_REQUEST;

    // $condicion = ' WHERE PT.Cajero ='.$req['id_funcionario'];

    if (isset($req['fecha']) && $req['fecha'] != "") {

        $fecha = explode(" - ", $req['fecha']);
        if ($condicion != "") {
            $condicion .= " AND DATE(T.Fecha) BETWEEN '$fecha[0] '  AND  '$fecha[1]' ";
        } else {
            $condicion .= " WHERE DATE(T.Fecha) BETWEEN '$fecha[0] '  AND  '$fecha[1]' ";
        }
    }

    if (isset($req['codigo']) && $req['codigo'] != '') {
        if ($condicion != "") {
            $condicion .= " AND R.Codigo LIKE '%" . $req['codigo'] . "%'";
        } else {
            $condicion .= " WHERE R.Codigo LIKE '%" . $req['codigo'] . "%'";
        }
    }

    if (isset($req['cliente']) && $req['cliente'] != '') {
        if ($condicion != "") {
            $condicion .= " AND TR.Nombre LIKE '%" . $req['cliente'] . "%'";
        } else {
            $condicion .= " WHERE TR.Nombre LIKE '%" . $req['cliente'] . "%'";
        }
    }
    if (isset($req['cajero']) && $req['cajero']  != '') {
        if ($condicion != "") {
            $condicion .= " AND CONCAT_WS(' ', F.Nombres, F.Apellidos) LIKE '%" . $req['cajero'] . "%'";
        } else {
            $condicion .= " WHERE CONCAT_WS(' ', F.Nombres, F.Apellidos) LIKE '%" . $req['cajero'] . "%'";
        }
    }

    if (isset($req['valor']) && $req['valor']  != '') {
        if ($condicion != "") {
            $condicion .= " AND TD.Valor_Transferencia = " . $req['valor'];
        } else {
            $condicion .= " WHERE TD.Valor_Transferencia = " . $req['valor'];
        }
    }

    if (isset($req['cedula']) && $req['cedula']  != '') {
        if ($condicion != "") {
            $condicion .= " AND TD.Numero_Documento_Destino = " . $req['cedula'];
        } else {
            $condicion .= " WHERE TD.Numero_Documento_Destino = " . $req['cedula'];
        }
    }

    if (isset($req['cta_destino']) && $req['cta_destino'] != '') {
        if ($condicion != "") {
            $condicion .= " AND DC.Numero_Cuenta LIKE '%" . $req['cta_destino'] . "%'";
        } else {
            $condicion .= " WHERE DC.Numero_Cuenta LIKE '%" . $req['cta_destino'] . "%'";
        }
    }

    if (isset($req['nombre_destinatario']) && $req['nombre_destinatario']) {
        if ($condicion != "") {
            $condicion .= " AND D.Nombre LIKE '%" . $req['nombre_destinatario'] . "%'";
        } else {
            $condicion .= " WHERE D.Nombre LIKE '%" . $req['nombre_destinatario'] . "%'";
        }
    }

    if (isset($req['estado']) && $req['estado']) {

        if ($condicion != "") {
            if (strtolower($req['estado']) == 'alertada') {
                $condicion .= ' AND T.Alertada = "Si"';
            } else if (strtolower($req['estado']) == 'devuelta') {
            } else if (strtolower($req['estado']) != 'todos') {
                $condicion .= " AND TD.Estado = '" . $req['estado'] . "'";
            }
        }
    }




    ///AGENTES EXTER

    // $condicion = ' WHERE PT.Cajero ='.$req['id_funcionario'];

    if (isset($req['fecha']) && $req['fecha'] != "") {

        $fecha = explode(" - ", $req['fecha']);
        if ($condicionA != "") {
            $condicionA .= " AND DATE(T.Fecha) BETWEEN '$fecha[0] '  AND  '$fecha[1]' ";
        } else {
            $condicionA .= " WHERE DATE(T.Fecha) BETWEEN '$fecha[0] '  AND  '$fecha[1]' ";
        }
    }

    if (isset($req['codigo']) && $req['codigo'] != '') {
        if ($condicionA != "") {
            $condicionA .= " AND R.Codigo LIKE '%" . $req['codigo'] . "%'";
        } else {
            $condicionA .= " WHERE R.Codigo LIKE '%" . $req['codigo'] . "%'";
        }
    }

    if (isset($req['cliente']) && $req['cliente'] != '') {
        if ($condicionA != "") {
            $condicionA .= " AND TR.Nombre LIKE '%" . $req['cliente'] . "%'";
        } else {
            $condicionA .= " WHERE TR.Nombre LIKE '%" . $req['cliente'] . "%'";
        }
    }
    if (isset($req['cajero']) && $req['cajero']  != '') {
        if ($condicionA != "") {
            $condicionA .= " AND CONCAT_WS(' ', F.Nombres, F.Apellidos) LIKE '%" . $req['cajero'] . "%'";
        } else {
            $condicionA .= " WHERE CONCAT_WS(' ', F.Nombres, F.Apellidos) LIKE '%" . $req['cajero'] . "%'";
        }
    }

    if (isset($req['valor']) && $req['valor']  != '') {
        if ($condicionA != "") {
            $condicionA .= " AND TD.Valor_Transferencia = " . $req['valor'];
        } else {
            $condicionA .= " WHERE TD.Valor_Transferencia = " . $req['valor'];
        }
    }

    if (isset($req['cedula']) && $req['cedula']  != '') {
        if ($condicionA != "") {
            $condicionA .= " AND TD.Numero_Documento_Destino = " . $req['cedula'];
        } else {
            $condicionA .= " WHERE TD.Numero_Documento_Destino = " . $req['cedula'];
        }
    }

    if (isset($req['cta_destino']) && $req['cta_destino'] != '') {
        if ($condicionA != "") {
            $condicionA .= " AND DC.Numero_Cuenta LIKE '%" . $req['cta_destino'] . "%'";
        } else {
            $condicionA .= " WHERE DC.Numero_Cuenta LIKE '%" . $req['cta_destino'] . "%'";
        }
    }

    if (isset($req['nombre_destinatario']) && $req['nombre_destinatario']) {
        if ($condicionA != "") {
            $condicionA .= " AND D.Nombre LIKE '%" . $req['nombre_destinatario'] . "%'";
        } else {
            $condicionA .= " WHERE D.Nombre LIKE '%" . $req['nombre_destinatario'] . "%'";
        }
    }

    if (isset($req['estado']) && $req['estado']) {

        if ($condicionA != "") {
            if (strtolower($req['estado']) == 'alertada') {
                $condicionA .= ' AND T.Alertada = "Si"';
            } else if (strtolower($req['estado']) == 'devuelta') {
            } else if (strtolower($req['estado']) != 'todos') {
                $condicionA .= " AND TD.Estado = '" . $req['estado'] . "'";
            }
        }
    }


    return $condicion;
}

function SetHaving()
{
    $req = $_REQUEST;
    $having = '';

    if (isset($req['pendiente']) && $req['pendiente']) {
        $having .= " HAVING Valor_Real = " . $req['pendiente'];
    }

    return $having;
}
