<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
header('Content-Type: application/json');

error_reporting(E_ALL ^ E_NOTICE);

require_once('../../config/start.inc.php');
require_once('../../class/class.configuracion.php');
include_once('../../class/class.consulta.php');
include_once("../../class/class.log_sistema.php");

$configuracion = new Configuracion();
$queryObj = new QueryBaseDatos();
$datos = (isset($_REQUEST['datos']) ? $_REQUEST['datos'] : '');
$envios = (isset($_REQUEST['destinatarios']) ? $_REQUEST['destinatarios'] : '');
$id_oficina = (isset($_REQUEST['id_oficina']) ? $_REQUEST['id_oficina'] : 0);
$bolsa_restante = (isset($_REQUEST['bolsa_restante']) ? $_REQUEST['bolsa_restante'] : '');

$datos = (array) json_decode($datos, true);
$envios = (array) json_decode($envios, true);

$log_sistema = new LogSistema($datos['Identificacion_Funcionario']);

$datos['Tasa_Cambio'] = str_replace(",", ".", $datos['Tasa_Cambio']);
$datos['Cantidad_Transferida'] = str_replace(",", ".", $datos['Cantidad_Transferida']);
$datos['Cantidad_Recibida'] = str_replace(",", ".", $datos['Cantidad_Recibida']);
$total_transferencia_con_bolsa_bolivares = $datos['Cantidad_Transferida_Con_Bolivares'];
$cod = $configuracion->Consecutivo('Transferencia');
$datos["Codigo"] = $cod;

$oItem = new complex("Transferencia", "Id_Transferencia");

foreach ($datos as $index => $value) {
	$oItem->$index = $value;
}

$oItem->Id_Oficina = $id_oficina;

$oItem->Cantidad_Recibida_Bolsa_Bolivares = $datos['Cantidad_Transferida_Con_Bolivares'];

if ($datos['Forma_Pago'] == 'Credito') {

	if (intval($bolsa_restante) > 0) {
		$oItem->Cantidad_Recibida_Bolsa_Bolivares = $datos['Cantidad_Transferida_Con_Bolivares'];
		$oItem->Cantidad_Recibida = 0;
		$oItem->Cantidad_Transferida = 0;
	} elseif (intval($datos['Bolsa_Bolivares']) != 0 && intval($bolsa_restante) == 0) {
		$oItem->Cantidad_Recibida_Bolsa_Bolivares = $datos['Bolsa_Bolivares'];
		$oItem->Cantidad_Recibida = $datos['Cantidad_Recibida'] == '' ? '0' : $datos['Cantidad_Recibida'];
		$oItem->Cantidad_Transferida = $datos['Cantidad_Transferida'] == '' ? '0' : $datos['Cantidad_Transferida'];
	}
}

$oItem->Tipo_Origen = $datos["Forma_Pago"] == "Credito" ? 'Tercero' : 'Remitente';
$oItem->Tipo_Destino = 'Destinatario';

$oItem->save();
$idTransferencia = $oItem->getId();
unset($oItem);

GuardarLogSistema($datos['Forma_Pago'], $datos['Tipo_Transferencia'], $idTransferencia);

//Recibo
$cod =  $configuracion->Consecutivo('Recibo');
$datos["Codigo"] = $cod;

$oItem = new complex("Recibo", "Id_Recibo");
foreach ($datos as $index => $value) {
	$oItem->Id_Transferencia = $idTransferencia;
	$oItem->$index = $value;
}

$oItem->save();
$idRecibo = $oItem->getId();
unset($oItem);

//si tengo destinatarios
$i = -1;
foreach ($envios as $envio) {
	$i++;
	$envio['Id_Moneda'] = $datos['Moneda_Destino'];
	$oItem = new complex("Transferencia_Destinatario", "Id_Transferencia_Destinatario");
	foreach ($envio as $index => $value) {
		$oItem->Id_Transferencia = $idTransferencia;
		$oItem->Id_Recibo = $idRecibo;
		$oItem->$index = $value;
	}
	$oItem->save();
	unset($oItem);
}

if ($datos["Forma_Pago"] == "Credito" && $datos["Tipo_Transferencia"] == "Transferencia") {
	//NUEVA VALIDACION
	if ($datos['Bolsa_Bolivares'] != '0') {
		if ($total_transferencia_con_bolsa_bolivares > $datos['Bolsa_Bolivares']) {

			$oItem = new complex("Movimiento_Tercero", "Id_Movimiento_Tercero");
			$oItem->Fecha = $hoy;
			$oItem->Tipo = "Egreso";
			$oItem->Valor = $datos["Bolsa_Bolivares"];
			$oItem->Detalle = $datos["Observacion_Transferencia"];
			$oItem->Id_Moneda_Valor = $datos["Moneda_Destino"];
			$oItem->Id_Tipo_Movimiento = '1';
			$oItem->Valor_Tipo_Movimiento = $idTransferencia;
			$oItem->Id_Tercero = $datos["Documento_Origen"];
			$oItem->Estado = 'Activo';
			$oItem->save();
			unset($oItem);
			DescontarBolsa($datos["Documento_Origen"], $datos['Bolsa_Bolivares']);

			$oItem = new complex("Movimiento_Tercero", "Id_Movimiento_Tercero");
			$oItem->Fecha = $hoy;
			$oItem->Tipo = "Egreso";
			$oItem->Valor = $datos["Cantidad_Recibida"];
			$oItem->Detalle = $datos["Observacion_Transferencia"];
			$oItem->Id_Moneda_Valor = $datos["Moneda_Origen"];
			$oItem->Id_Tipo_Movimiento = '1';
			$oItem->Valor_Tipo_Movimiento = $idTransferencia;
			$oItem->Id_Tercero = $datos["Documento_Origen"];
			$oItem->Estado = 'Activo';
			$oItem->save();
			unset($oItem);

			DescontarCupo($datos["Documento_Origen"], $datos['Cantidad_Recibida']);
		} elseif ($total_transferencia_con_bolsa_bolivares < $datos['Bolsa_Bolivares']) {
			$oItem = new complex("Movimiento_Tercero", "Id_Movimiento_Tercero");
			$oItem->Fecha = $hoy;
			$oItem->Tipo = "Egreso";
			$oItem->Valor = $datos["Cantidad_Transferida_Con_Bolivares"];
			$oItem->Detalle = $datos["Observacion_Transferencia"];
			$oItem->Id_Moneda_Valor = $datos["Moneda_Destino"];
			$oItem->Id_Tipo_Movimiento = '1';
			$oItem->Valor_Tipo_Movimiento = $idTransferencia;
			$oItem->Id_Tercero = $datos["Documento_Origen"];
			$oItem->Estado = 'Activo';
			$oItem->save();
			unset($oItem);
			DescontarBolsa($datos["Documento_Origen"], $datos['Cantidad_Transferida_Con_Bolivares']);
		} elseif ($total_transferencia_con_bolsa_bolivares == $datos['Bolsa_Bolivares']) {
			$oItem = new complex("Movimiento_Tercero", "Id_Movimiento_Tercero");
			$oItem->Fecha = $hoy;
			$oItem->Tipo = "Egreso";
			$oItem->Valor = $datos["Bolsa_Bolivares"];
			$oItem->Detalle = $datos["Observacion_Transferencia"];
			$oItem->Id_Moneda_Valor = $datos["Moneda_Destino"];
			$oItem->Id_Tipo_Movimiento = '1';
			$oItem->Valor_Tipo_Movimiento = $idTransferencia;
			$oItem->Id_Tercero = $datos["Documento_Origen"];
			$oItem->Estado = 'Activo';
			$oItem->save();
			unset($oItem);
			DescontarBolsa($datos["Documento_Origen"], $datos['Bolsa_Bolivares']);
		}
	} else {

		$oItem = new complex("Movimiento_Tercero", "Id_Movimiento_Tercero");
		$oItem->Fecha = $hoy;
		$oItem->Tipo = "Egreso";
		$oItem->Valor = $datos["Cantidad_Recibida"];
		$oItem->Detalle = $datos["Observacion_Transferencia"];
		$oItem->Id_Moneda_Valor = $datos["Moneda_Origen"];
		$oItem->Id_Tercero = $datos["Documento_Origen"];
		$oItem->Id_Tipo_Movimiento = '1';
		$oItem->Valor_Tipo_Movimiento = $idTransferencia;
		$oItem->Estado = 'Activo';
		$oItem->save();
		unset($oItem);

		DescontarCupo($datos["Documento_Origen"], $datos['Cantidad_Recibida']);
	}
}

if ($datos["Forma_Pago"] == "Consignacion" && $datos["Tipo_Transferencia"] == "Transferencia") {
	//Movimiento_Cuenta_Bancaria    
	$oItem = new complex("Movimiento_Cuenta_Bancaria", "Id_Movimiento_Cuenta_Bancaria");
	foreach ($datos as $index => $value) {
		//$oItem->Id_Transferencia=$idTransferencia;
		$oItem->Fecha = $hoy;
		$oItem->Tipo = "Ingreso";
		$oItem->$index = $value;
		$oItem->Valor = $datos["Cantidad_Recibida"];
		$oItem->Detalle = $datos["Observacion_Transferencia"];
		$oItem->Id_Tipo_Movimiento_Bancario = "1";
		$oItem->Valor_Tipo_Movimiento_Bancario = $idTransferencia;
		$oItem->Transferencia = "Si";
	}

	$oItem->save();
	unset($oItem);
}



echo json_encode(['message' => 'Guardado con exito', 'Code' => 200]);



function DescontarCupo($idTercero, $valorDescontar)
{
	$oItem = new complex("Tercero", "Id_Tercero", $idTercero);
	$oItem->Cupo_Disponible = $oItem->Cupo_Disponible - $valorDescontar;
	$oItem->save();
	unset($oItem);
}

function ReponerCupo($idTercero, $valorReponer)
{
	$oItem = new complex("Tercero", "Id_Tercero", $idTercero);
	$oItem->Cupo_Disponible = $oItem->Cupo_Disponible + $valorReponer;
	$oItem->save();
	unset($oItem);
}

function DescontarBolsa($idTercero, $bolivares)
{
	global $queryObj;

	$query_update = "UPDATE Bolsa_Bolivares_Tercero SET Bolsa_Bolivares = Bolsa_Bolivares - $bolivares WHERE Id_Tercero = $idTercero";
	$queryObj->SetQuery($query_update);
	$nombre_moneda = $queryObj->QueryUpdate();
}

function GetCupoTercero($idTercero)
{
	global $queryObj;

	$query = "SELECT Cupo, Cupo_Disponible FROM Tercero WHERE Id_Tercero = $idTercero";
	$queryObj->SetQuery($query);
	$cupo_tercero = $queryObj->ExecuteQuery('simple');
	return $cupo_tercero;
}

function GetMontoPesosBolsaBolivares($idTercero, $bolivares, $bolsa_bolivares)
{
	global $queryObj;

	$cupo_tercero = GetCupoTercero($idTercero);
	$cupo_usado = intval($cupo_tercero['Cupo']) - intval($cupo_tercero['Cupo_Disponible']);
	$equivalente_pesos_bolsa_bolivares = round(($cupo_usado * $bolivares) / $bolsa_bolivares);
	return $equivalente_pesos_bolsa_bolivares;
}

function GuardarLogSistema($formaPago, $tipo, $idRegistro)
{
	global $log_sistema;

	$detalle_log = 'Nuevo recibo transferencia de tipo: ' . $tipo . ', forma de pago: ' . $formaPago . '!';
	$log_sistema->GuardarActividadLog('Recibo Transferencia', $detalle_log, $idRegistro);
}
