<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
header('Content-Type: application/json');

include_once('../../class/class.querybasedatos.php');
include_once('../../class/class.http_response.php');

$modelo = (isset($_REQUEST['modelo']) ? $_REQUEST['modelo'] : '');
$modelo = (array) json_decode($modelo, true);
$valores_moneda = $modelo['ValoresMoneda'];

$httpResponse = new HttpResponse();
$response = array();

unset($modelo['ValoresMoneda']);

if (ExisteNombreMoneda($modelo['Nombre'], $modelo['Id_Moneda'])) {

    $httpResponse->setRespuesta(2, 'Alerta', 'Ya existe una moneda registrada con este nombre ' . $modelo['Nombre'] . '!');
    $response = $httpResponse->getRespuesta();
} else {

    ActualizarMoneda($modelo);
    ActualizarValoresMoneda($valores_moneda, $modelo['Id_Moneda']);

    $httpResponse->setRespuesta(0, 'Actualizacion Exitosa', 'Se actualizo la moneda de manera exitosa!');
    $response = $httpResponse->getRespuesta();
}

echo json_encode($response);

function ExisteNombreMoneda($nombre, $idMoneda)
{
    $queryObj = new QueryBaseDatos();

    $query = '
			SELECT
				Nombre
			FROM Moneda
			WHERE
				Nombre = "' . $nombre . '" AND Id_Moneda <> ' . $idMoneda;

    $queryObj->SetQuery($query);
    $result = $queryObj->ExecuteQuery('simple');
    unset($queryObj);

    return $result != false;
}

function ActualizarValoresMoneda($valores, $idMoneda)
{
    $oItem = new complex('Valor_Moneda', "Id_Valor_Moneda", $valores['Id_Valor_Moneda']);

    foreach ($valores as $index => $value) {
        if ($value == '') {
            $value = '0';
        }

        if (gettype($value) == "double") {
            $oItem->$index = number_format($value, 2, ".", "");
        } else {
            $oItem->$index = $value;
        }
    }

    $oItem->save();
    unset($oItem);
}

function ActualizarMoneda($moneda)
{
    $oItem = new complex('Moneda', "Id_Moneda", $moneda['Id_Moneda']);

    // foreach( $moneda as $index=>$value) {
    //     $oItem->$index=$value;
    // }
    // $oItem->save();
    // unset($oItem);

    $oItem->Codigo = $moneda['Codigo'];
    $oItem->Nombre = $moneda['Nombre'];
    $oItem->Id_Pais = $moneda['Id_Pais'];
    $oItem->MDefault = $moneda['Default'];
    $oItem->Monto_Maximo_Diferencia_Transferencia = number_format($moneda['Monto_Maximo_Diferencia_Transferencia'], 2, ".", "");

    $oItem->save();
    unset($oItem);
}
