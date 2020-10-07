<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
header('Content-Type: application/json');

include_once('../../class/class.querybasedatos.php');
include_once('../../class/class.paginacion.php');

$pagina = (isset($_REQUEST['pag']) ? $_REQUEST['pag'] : '');
$pageSize = (isset($_REQUEST['tam']) ? $_REQUEST['tam'] : '');
$id_funcionario = (isset($_REQUEST['id_funcionario']) ? $_REQUEST['id_funcionario'] : '');
$condicion = 'WHERE (T.Estado = "Activa" OR T.Estado = "Pagada") AND TD.Estado_Consultor = "Cerrada" ';
$condicion = SetCondiciones($condicion);
$having = SetHaving($_REQUEST);

$query_pendiente = 'SELECT 
	      T.Id_Transferencia,
        T.Fecha,
        T.Cantidad_Transferida,
        T.Tasa_Cambio,
	      TD.Id_Transferencia_Destinatario,
        TD.Estado,
        TD.Valor_Transferencia,
        TD.Numero_Documento_Destino,
	      SUBSTRING(R.Codigo, 3) as Codigo,
	      CONCAT(F.Nombres, " " , F.Apellidos) as NombreCajero,
	      DC.Numero_Cuenta AS Cuenta_Destino,
	      D.Nombre AS Destinatario,
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
	    INNER JOIN Funcionario F ON F.Identificacion_Funcionario = T.Identificacion_Funcionario
	    INNER JOIN Transferencia_Destinatario TD ON T.Id_Transferencia = TD.Id_Transferencia
        INNER JOIN Pago_Transfenecia PT ON TD.Id_Transferencia_Destinatario = PT.Id_Transferencia_Destino AND Devuelta = "No"
	    INNER JOIN Destinatario_Cuenta DC ON TD.Id_Destinatario_Cuenta = DC.Id_Destinatario_Cuenta
	    INNER JOIN Destinatario D ON TD.Numero_Documento_Destino = D.Id_Destinatario
	    ' . $condicion . '
        AND TD.Estado = "Pendiente"
        ';

$query_pagadas = '
        SELECT
        T.Id_Transferencia,
        T.Fecha,
        T.Cantidad_Transferida,
        T.Tasa_Cambio,
        TD.Id_Transferencia_Destinatario,
        TD.Estado,
        TD.Valor_Transferencia,
        TD.Numero_Documento_Destino,
        SUBSTRING(R.Codigo, 3) as Codigo,
        CONCAT(F.Nombres, " " , F.Apellidos) as NombreCajero,
        DC.Numero_Cuenta AS Cuenta_Destino,
        D.Nombre AS Destinatario,
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
        INNER JOIN Funcionario F ON F.Identificacion_Funcionario = T.Identificacion_Funcionario
        INNER JOIN Transferencia_Destinatario TD ON T.Id_Transferencia = TD.Id_Transferencia
        LEFT JOIN Pago_Transfenecia PT ON TD.Id_Transferencia_Destinatario = PT.Id_Transferencia_Destino AND Devuelta = "No"
        INNER JOIN Destinatario_Cuenta DC ON TD.Id_Destinatario_Cuenta = DC.Id_Destinatario_Cuenta
        INNER JOIN Destinatario D ON TD.Numero_Documento_Destino = D.Id_Destinatario
        ' . $condicion . '
        AND PT.Cajero = ' . $id_funcionario . ' AND TD.Estado = "Pagada"';

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


$query_pagadas_parciales = '
        SELECT 
          T.Id_Transferencia,
          TD.Id_Transferencia_Destinatario,
          T.Fecha,
          SUBSTRING(R.Codigo, 3) as Codigo,
          CONCAT(F.Nombres, " " , F.Apellidos) as NombreCajero,
          T.Cantidad_Transferida,
          TD.Valor_Transferencia,
          TD.Numero_Documento_Destino,
          DC.Numero_Cuenta AS Cuenta_Destino,
          D.Nombre AS Destinatario,
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
        ' . $condicion . '
        AND PT.Cajero = ' . $id_funcionario . ' AND TD.Estado = "Pendiente"';

// $query_union = $query_pendiente . ' UNION (' . $query_pagadas . ')  ORDER BY Fecha DESC';
$query_union = $query_pendiente . ' UNION (' . $query_pagadas . ')  UNION (' . $query_devueltas . ') ORDER BY Fecha DESC';

$query_union = "
        SELECT 
            r.*
          FROM ($query_union) r
          ORDER BY r.Orden_Consulta DESC";

$query_paginacion = "
        SELECT 
            COUNT(*) AS Total
          FROM ($query_union) r";

$paginationObj = new PaginacionData($pageSize, $query_paginacion, $pagina);

//Se crea la instancia que contiene la consulta a realizar
$queryObj = new QueryBaseDatos($query_union);

//Ejecuta la consulta de la instancia queryobj y retorna el resultado de la misma segun los parametros
$result = $queryObj->Consultar('Multiple', true, $paginationObj);

echo json_encode($result);

function SetCondiciones($condicion)
{
    $req = $_REQUEST;

    // $condicion = ' WHERE PT.Cajero ='.$req['id_funcionario'];

    if (isset($req['fecha']) && $req['fecha'] != "") {
        if ($condicion != "") {
            $condicion .= " AND DATE(T.Fecha) = '" . $req['fecha'] . "'";
        } else {
            $condicion .=  " WHERE DATE(T.Fecha) = '" . $req['fecha'] . "'";
        }
    }

    if (isset($req['codigo']) && $req['codigo'] != '') {
        if ($condicion != "") {
            $condicion .= " AND R.Codigo LIKE '%" . $req['codigo'] . "%'";
        } else {
            $condicion .= " WHERE R.Codigo LIKE '%" . $req['codigo'] . "%'";
        }
    }

    if (isset($req['cajero']) && $req['cajero']) {
        if ($condicion != "") {
            $condicion .= " AND CONCAT_WS(' ', F.Nombres, F.Apellidos) LIKE '%" . $req['cajero'] . "%'";
        } else {
            $condicion .= " WHERE CONCAT_WS(' ', F.Nombres, F.Apellidos) LIKE '%" . $req['cajero'] . "%'";
        }
    }

    if (isset($req['valor']) && $req['valor']) {
        if ($condicion != "") {
            $condicion .= " AND TD.Valor_Transferencia = " . $req['valor'];
        } else {
            $condicion .= " WHERE TD.Valor_Transferencia = " . $req['valor'];
        }
    }

    if (isset($req['cedula']) && $req['cedula']) {
        if ($condicion != "") {
            $condicion .= " AND TD.Numero_Documento_Destino = " . $req['cedula'];
        } else {
            $condicion .= " WHERE TD.Numero_Documento_Destino = " . $req['cedula'];
        }
    }

    if (isset($req['cta_destino']) && $req['cta_destino']) {
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
            if (strtolower($req['estado']) == 'devuelta') {
                $condicion .= " AND  PT.Devuelta = 'Si'";
            } else {
                $condicion .= " AND TD.Estado = '" . $req['estado'] . "'";
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
