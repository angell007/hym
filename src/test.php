<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
header('Content-Type: application/json');

include_once('../../class/class.querybasedatos.php');
include_once('../../class/class.paginacion.php');


$page = (isset($_REQUEST['pag']) ? $_REQUEST['pag'] : 1);
// Current pagination page number
// $page = (isset($_GET['page']) && is_numeric($_GET['page']) ) ? $_GET['page'] : 1;

$limit = (isset($_REQUEST['tam']) ? $_REQUEST['tam'] : 10);
// Dynamic limit
// $limit = isset($_SESSION['records-limit']) ? $_SESSION['records-limit'] : 5;

$condicion = SetCondiciones($_REQUEST);


// Get total records
$sql = 'SELECT 
COUNT(Id_Egreso) AS Total
FROM  Egreso E
INNER JOIN Funcionario F ON E.Identificacion_Funcionario = F.Identificacion_Funcionario
INNER JOIN Tercero T ON E.Id_Tercero = T.Id_Tercero
INNER JOIN Moneda M ON E.Id_Moneda = M.Id_Moneda
INNER JOIN Grupo_Tercero_Nuevo GTN ON E.Id_Grupo = GTN.Id_Grupo_Tercero' . $condicion;
$queryObj = new QueryBaseDatos($query);
$allRecrods = $queryObj->Consultar('Simple');


// Calculate total pages
$totoalPages = ceil($allRecrods / $limit);

// Offset
$paginationStart = ($page - 1) * $limit;

// Limit query

$query = '
		SELECT 
			E.*,
            CONCAT_WS(" ", F.Nombres, F.Apellidos) AS Nombre_Funcionario,
            M.Nombre AS Nombre_Moneda,
            T.Nombre AS Nombre_Tercero,
            GTN.Nombre_Grupo,
            M.Codigo AS Codigo_Moneda
			FROM Egreso E
			INNER JOIN Funcionario F ON E.Identificacion_Funcionario = F.Identificacion_Funcionario
			INNER JOIN Tercero T ON E.Id_Tercero = T.Id_Tercero
			INNER JOIN Moneda M ON E.Id_Moneda = M.Id_Moneda
			INNER JOIN Grupo_Tercero_Nuevo GTN ON E.Id_Grupo = GTN.Id_Grupo_Tercero'
	. $condicion
	. ' ORDER BY Fecha DESC LIMIT ' . $paginationStart;

// $paginationObj = new PaginacionData($pageSize, $query_paginacion, $pagina);

$queryObj = new QueryBaseDatos($query);

//Ejecuta la consulta de la instancia queryobj y retorna el resultado de la misma segun los parametros
$result = $queryObj->Consultar('Simple');

echo json_encode($result);

echo json_encode($egresos);


function SetCondiciones($req)
{

	$condicion = '';

	if (isset($req['codigo']) && $req['codigo'] != "") {
		if ($condicion != "") {
			$condicion .= " AND E.Codigo LIKE '%" . $req['codigo'] . "%'";
		} else {
			$condicion .=  " WHERE E.Codigo LIKE '%" . $req['codigo'] . "%'";
		}
	}

	if (isset($req['funcionario']) && $req['funcionario'] != "") {
		if ($condicion != "") {
			$condicion .= " AND CONCAT_WS(' ', F.Nombres, F.Apellidos) LIKE '%" . $req['funcionario'] . "%'";
		} else {
			$condicion .=  " WHERE CONCAT_WS(' ', F.Nombres, F.Apellidos) LIKE '%" . $req['funcionario'] . "%'";
		}
	}

	if (isset($req['grupo']) && $req['grupo'] != "") {
		if ($condicion != "") {
			$condicion .= " AND E.Id_Grupo = " . $req['grupo'];
		} else {
			$condicion .=  " WHERE E.Id_Grupo = " . $req['grupo'];
		}
	}

	if (isset($req['tercero']) && $req['tercero']) {
		if ($condicion != "") {
			$condicion .= " AND T.Nombre LIKE '%" . $req['tercero'] . "%'";
		} else {
			$condicion .= " WHERE T.Nombre LIKE '%" . $req['tercero'] . "%'";
		}
	}

	if (isset($req['moneda']) && $req['moneda']) {
		if ($condicion != "") {
			$condicion .= " AND E.Id_Moneda = " . $req['moneda'];
		} else {
			$condicion .= " WHERE E.Id_Moneda = " . $req['moneda'];
		}
	}

	if (isset($req['valor']) && $req['valor']) {
		if ($condicion != "") {
			$condicion .= " AND E.Valor = " . $req['valor'];
		} else {
			$condicion .= " WHERE E.Valor = " . $req['valor'];
		}
	}

	return $condicion;
}
