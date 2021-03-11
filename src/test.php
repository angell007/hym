<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
header('Content-Type: application/json');


include_once('../../class/class.querybasedatos.php');
require_once('../../class/class.configuracion.php');
include_once('../../class/class.http_response.php');

$httpResponse = new HttpResponse();
$queryObj = new QueryBaseDatos();

$cuentas = (isset($_REQUEST['cuentas']) ? $_REQUEST['cuentas'] : '');
$id_funcionario = (isset($_REQUEST['id_funcionario']) ? $_REQUEST['id_funcionario'] : '');
$id_apertura = (isset($_REQUEST['id_apertura']) ? $_REQUEST['id_apertura'] : '');
$id_oficina = (isset($_REQUEST['id_oficina']) ? $_REQUEST['id_oficina'] : '');
$id_caja = (isset($_REQUEST['id_caja']) ? $_REQUEST['id_caja'] : '');

$cuentas = (array) json_decode($cuentas, true);
$fecha = date('Y-m-d');
$hora = date('H:i:s');

$id_cuentas = GetConcatIdCuentas($cuentas);
GuardarCierreConsultor($id_apertura);
GuardarCuentasCierreConsultor($id_apertura);
UpdateMovimientosBancarios($id_cuentas);
LiberarCuentasBancarias($id_cuentas);

$httpResponse->SetRespuesta(0, 'Cierre Exitoso', 'Se realizado el cierre de las cuentas exitosamente!');
$response = $httpResponse->GetRespuesta();

echo json_encode($response);


function GuardarCierreConsultor($id_apertura)
{
    global $fecha, $hora, $queryObj;

    $query = "
            UPDATE Diario_Consultor SET Fecha_Cierre = '$fecha', Hora_Cierre = '$hora'
            WHERE
                Id_Diario_Consultor = $id_apertura";

    $queryObj->SetQuery($query);
    $queryObj->QueryUpdate();
}

function GuardarCuentasCierreConsultor($idApertura)
{
    global $cuentas, $queryObj;

    foreach ($cuentas as $cta) {
        $query = "
            UPDATE Diario_Cuenta SET Monto_Cierre = " . number_format($cta['Monto_Cierre'], 2, ".", "") . "
            WHERE
                Id_Diario_Consultor = $idApertura AND Id_Cuenta_Bancaria = $cta[Id_Cuenta_Bancaria]";

        $queryObj->SetQuery($query);
        $queryObj->QueryUpdate();
    }
}

function UpdateMovimientosBancarios($idCuentas)
{
    global $queryObj;

    $query = '
            UPDATE Movimiento_Cuenta_Bancaria 
            SET Movimiento_Cerrado = "Si" 
            WHERE 
                Id_Cuenta_Bancaria IN (' . $idCuentas . ') 
                AND Tipo = "Egreso" 
                AND DATE(Fecha_Creacion) = "' . date("Y-m-d") . '" 
                AND Id_Tipo_Movimiento_Bancario = 6
                AND Movimiento_Cerrado = "No"';

    $queryObj->SetQuery($query);
    $queryObj->QueryUpdate();
}

function GetConcatIdCuentas($cuentas)
{
    $id_concat = '';

    foreach ($cuentas as $cta) {
        $id_concat .= $cta['Id_Cuenta_Bancaria'] . ",";
    }

    return trim($id_concat, ",");
}

function LiberarCuentasBancarias($idCuentas)
{
    global $queryObj;

    $query_liberar = 'UPDATE Cuenta_Bancaria SET Funcionario_Seleccion = NULL, Estado_Apertura = "Cerrada" WHERE Id_Cuenta_Bancaria IN (' . $idCuentas . ')';
    $queryObj->SetQuery($query_liberar);
    $queryObj->QueryUpdate();
}
