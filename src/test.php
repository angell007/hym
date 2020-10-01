<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
header('Content-Type: application/json');
require_once('../../config/start.inc.php');
include_once('../../class/class.lista.php');
include_once('../../class/class.complex.php');
include_once('../../class/class.consulta.php');
include_once('../../class/class.querybasedatos.php');
include_once('../../class/class.paginacion.php');
include_once('../../class/class.http_response.php');


$id_funcionario = (isset($_REQUEST['funcionario']) && $_REQUEST['funcionario'] != '') ? $_REQUEST['funcionario'] : '';
$condicion = SetCondiciones($_REQUEST);
$pagina = (isset($_REQUEST['pag']) ? $_REQUEST['pag'] :  '');
$pageSize = (isset($_REQUEST['tam']) ? $_REQUEST['tam'] : 1000);


$httpResponse = new HttpResponse();
$response = array();

$query_paginacion = "SELECT COUNT(TC.Codigo) As Total FROM Traslado_Caja TC 
INNER JOIN Moneda M 
ON M.Id_Moneda = TC.Id_Moneda
INNER JOIN Funcionario F 
ON TC.Funcionario_Destino = F.Identificacion_Funcionario
WHERE Cast(Current_Date As Date)
$condicion
AND  TC.Funcionario_Destino = $id_funcionario 
ORDER BY TC.Fecha_Traslado DESC";

$query = "SELECT TC.Id_Traslado_Caja, TC.Codigo, TC.Fecha_Traslado, TC.Valor , CONCAT_WS(' ',F.Nombres,F.Apellidos) AS Cajero_Destino, M.Nombre as Moneda, TC.Aprobado, TC.Estado, M.Codigo AS Codigo_Moneda,
(SELECT CONCAT_WS(' ',Nombres,Apellidos) FROM Funcionario WHERE Identificacion_Funcionario = TC.Id_Cajero_Origen) AS Cajero_Origen
FROM Traslado_Caja TC   INNER JOIN Moneda M 
ON M.Id_Moneda = TC.Id_Moneda
INNER JOIN Funcionario F 
ON TC.Id_Cajero_Origen = F.Identificacion_Funcionario
WHERE Cast(Current_Date As Date)
$condicion
ORDER BY TC.Fecha_Traslado DESC";

$paginationObj = new PaginacionData($pageSize, $query_paginacion, $pagina);
$queryObj = new QueryBaseDatos($query);
$response = $queryObj->Consultar('Multiple', true, $paginationObj);

function SetCondiciones($req)
{

    $condicion = '';

    if (isset($req['codigo']) && $req['codigo'] != "") {
        $condicion =  "AND TC.Codigo LIKE '%" . $req['codigo'] . "%'";
    }

    if (isset($req['destinatario'])) {
        $destinatario =  $req["destinatario"];
        $condicion .=  "AND (F.Nombres LIKE '%$destinatario%' OR F.Apellidos LIKE  '%$destinatario%')";
    }

    if (isset($req['moneda'])) {
        $moneda =  $req["moneda"];
        $condicion .=  "AND M.Nombre LIKE '%$moneda%'";
    }
    if (isset($req['estado'])) {
        $estado =  $req["estado"];
        $condicion .=  "AND TC.Estado LIKE '%$estado%'";
    }

    return $condicion;
}

echo json_encode($response);