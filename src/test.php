<?php
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
	header('Content-Type: application/json');

	require_once($_SERVER['DOCUMENT_ROOT'].'/config/start.inc.php');
	include_once($_SERVER['DOCUMENT_ROOT'].'/class/class.complex.php');
	include_once($_SERVER['DOCUMENT_ROOT'].'/class/class.consulta.php');
	require_once('../../class/class.configuracion.php');
	include_once('../../class/class.http_response.php');

	$modelo = (isset($_REQUEST['modelo']) && $_REQUEST['modelo'] != '') ? $_REQUEST['modelo'] : '';
	$modelo = json_decode($modelo, true);
	$fecha = date('Y-m-d H:i:s');

	$response = array();
	$http_response = new HttpResponse();

	unset($modelo['Id_Egreso']);
	$modelo['Fecha'] = $fecha;

	$configuracion = new Configuracion();
	$cod = $configuracion->Consecutivo('Egreso');

	$oItem = new complex("Egreso","Id_Egreso");

	foreach($modelo as $index=>$value) {
        $oItem->$index=$value;
    }

    $oItem->Codigo = $cod;

    $oItem->save();
    $id_egreso = $oItem->getId();

    RealizarMovimientoEgreso($oItem, $id_egreso);

	$http_response->SetRespuesta(0, 'Registro Exitoso', 'Se ha guardado el egreso exitosamente!');
	$response = $http_response->GetRespuesta();

    unset($oItem);
    unset($http_response);

	echo json_encode($response);

?>