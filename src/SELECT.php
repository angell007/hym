<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
header('Content-Type: application/json');

require_once('../../config/start.inc.php');
include_once('../../class/class.lista.php');
include_once('../../class/class.complex.php');
require_once('../../class/class.configuracion.php');

$configuracion = new Configuracion();
    $id_oficina = ( isset( $_REQUEST['id_oficina'] ) ? $_REQUEST['id_oficina'] : 0 );
$datos = ( isset( $_REQUEST['datos'] ) ? $_REQUEST['datos'] : '' );

$datos = (array) json_decode($datos);

$datos['Tasa_Cambio'] = str_replace(",", ".", $datos['Tasa_Cambio']);
$datos['Cantidad_Transferida'] = str_replace(",", ".", $datos['Cantidad_Transferida']);
$datos['Cantidad_Recibida'] = str_replace(",", ".", $datos['Cantidad_Recibida']);



if($datos["Forma_Pago"] == "Efectivo"){

    $cod = $configuracion->Consecutivo('Transferencia');
    $oItem = new complex("Transferencia","Id_Transferencia" );
    $oItem->Observacion_Transferencia = $datos["Observacion_Transferencia"];
    $oItem->Moneda_Origen = $datos["Moneda_Origen"];
    $oItem->Moneda_Destino =  $datos["Moneda_Destino"]; 
    $oItem->Cantidad_Recibida = $datos["Cantidad_Recibida"];
    $oItem->Cantidad_Transferida = $datos["Cantidad_Transferida"];
    $oItem->Cantidad_Recibida_Bolsa_Bolivares = $datos['Cantidad_Transferida_Con_Bolivares'];
    $oItem->Forma_Pago = "Efectivo";
    $oItem->Tipo_Transferencia = "Cliente";
    $oItem->Codigo = $cod;
    $oItem->Identificacion_Funcionario = $datos["Identificacion_Funcionario"];
    $oItem->Id_Oficina = $id_oficina;
    //$oItem->Id_Tercero_Destino = $datos['Id_Tercero_Destino'];
    $oItem->Documento_Origen = $datos['Documento_Origen'];
    $oItem->Tasa_Cambio = $datos['Tasa_Cambio'];
    $oItem->Id_Caja = $datos['Id_Caja'];
    $oItem->Tipo_Origen = 'Remitente';
    $oItem->Tipo_Destino = 'Tercero';
    $oItem->save();
    $idtransferencia = $oItem->getId();
    unset($oItem);
   
    $oItem = new complex("Movimiento_Tercero","Id_Movimiento_Tercero" );
    $oItem->Id_Tercero=$datos["Id_Tercero_Destino"];
    $oItem->Tipo="Ingreso";
    $oItem->Fecha = date("Y-m-d");
    $oItem->Detalle = $datos["Observacion_Transferencia"];
    $oItem->Valor = $datos["Cantidad_Transferida"];    
    $oItem->Id_Moneda_Valor = $datos["Moneda_Destino"]; 
    $oItem->Id_Funcionario = $datos["Identificacion_Funcionario"];
    // $oItem->Moneda_Origen = $datos["Moneda_Origen"];
    // $oItem->Moneda_Destino = $datos["Moneda_Destino"]; 
    // $oItem->Cantidad_Transferida= $datos["Cantidad_Transferida"];
    // $oItem->Cantidad_Recibida = $datos["Cantidad_Recibida"];
    // $oItem->Id_Tipo_Movimiento = '1';
    $oItem->Id_Tipo_Movimiento = '7';
    $oItem->Valor_Tipo_Movimiento = $idtransferencia;
	$oItem->Transferencia="Si";
	
	var_dump(json_decode($oItem));
	
    $oItem->save();
    unset($oItem);
    
    $cod = $configuracion->Consecutivo('Recibo');
    $oItem = new complex("Recibo","Id_Recibo" );
    $oItem->Codigo = $cod;
    $oItem->Identificacion_Funcionario = $datos["Identificacion_Funcionario"];
    $oItem->Id_Transferencia = $idtransferencia;
    $oItem->Tasa_Cambio = $datos['Tasa_Cambio'];
    $oItem->save();
    unset($oItem);
}

if($datos["Forma_Pago"] == "Credito"){
    $oItem = new complex("Movimiento_Tercero","Id_Movimiento_Tercero" );
    $oItem->Id_Tercero=$datos["Id_Tercero"];
    $oItem->Tipo="Egreso";
    $oItem->Fecha = date("Y-m-d");
    $oItem->Detalle = $datos["Observacion_Transferencia"];
    $oItem->Valor = $datos["Cantidad_Transferida"];
    $oItem->Id_Moneda_Valor = $datos["Moneda_Destino"];         
    $oItem->Id_Oficina = $id_oficina;
    $oItem->Id_Funcionario = $datos["Identificacion_Funcionario"];
    //$oItem->Transferencia="Si";
    // $oItem->Moneda_Origen = $datos["Moneda_Origen"];
    // $oItem->Moneda_Destino = $datos["Moneda_Destino"]; 
    // $oItem->Cantidad_Transferida= $datos["Cantidad_Transferida"];
    // $oItem->Cantidad_Recibida = $datos["Cantidad_Recibida"];
    $oItem->Id_Tipo_Movimiento = '7';
    $oItem->Valor_Tipo_Movimiento = $idtransferencia;
    $oItem->save();
    unset($oItem);
    
    $oItem1 = new complex("Movimiento_Tercero","Id_Movimiento_Tercero" );
    $oItem1->Id_Tercero=$datos["Id_Tercero_Destino"];
    $oItem1->Tipo="Ingreso";
    $oItem1->Fecha = date("Y-m-d");
    $oItem1->Detalle = $datos["Observacion_Transferencia"];
    $oItem1->Valor = $datos["Cantidad_Transferida"];
    $oItem1->Id_Funcionario = $datos["Identificacion_Funcionario"];
    //$oItem1->Transferencia="Si";
    //$oItem1->Moneda_Origen = $datos["Moneda_Origen"];
    //$oItem1->Moneda_Destino = $datos["Moneda_Destino"]; 
    $oItem1->Id_Moneda_Valor = $datos["Moneda_Destino"]; 
    $oItem1->Id_Tipo_Movimiento = '7';
    $oItem1->Valor_Tipo_Movimiento = $idtransferencia;
    //$oItem1->Cantidad_Transferida= $datos["Cantidad_Transferida"];
    //$oItem1->Cantidad_Recibida = $datos["Cantidad_Recibida"];
    $oItem1->save();
    unset($oItem1);
}


if($datos["Forma_Pago"] == "Consignacion"){
    $cod = $configuracion->Consecutivo('Transferencia');
    $oItem = new complex("Transferencia","Id_Transferencia" );
    $oItem->Observacion_Transferencia = $datos["Observacion_Transferencia"];
    $oItem->Moneda_Origen = $datos["Moneda_Origen"];
    $oItem->Moneda_Destino =  $datos["Moneda_Destino"]; 
    $oItem->Cantidad_Recibida = $datos["Cantidad_Recibida"];
    $oItem->Cantidad_Transferida = $datos["Cantidad_Transferida"];
    $oItem->Forma_Pago = "Consignacion";
    $oItem->Tipo_Transferencia = "Cliente";
    $oItem->Id_Oficina = $id_oficina;
    $oItem->Codigo = $cod;
    $oItem->Identificacion_Funcionario = $datos["Identificacion_Funcionario"];
    $oItem->Cantidad_Recibida_Bolsa_Bolivares = $datos['Cantidad_Transferida_Con_Bolivares'];
    $oItem->Id_Caja = $datos['Id_Caja'];
    $oItem->Documento_Origen = $datos['Documento_Origen'];
    $oItem->Id_Tercero_Destino = $datos['Id_Tercero_Destino'];
    $oItem->Id_Cuenta_Bancaria=$datos['Id_Cuenta_Bancaria'];
    $oItem->Tasa_Cambio = $datos["Tasa_Cambio"];
    $oItem->Tipo_Origen = 'Remitente';
    $oItem->Tipo_Destino = 'Tercero';
    $oItem->save();
    $idtransferencia = $oItem->getId();
    unset($oItem);
    
    //var_dump("paso 1");
    $oItem2 = new complex("Movimiento_Tercero","Id_Movimiento_Tercero");
    $oItem2->Id_Tercero=$datos["Id_Tercero_Destino"];
    $oItem2->Tipo="Ingreso";
    $oItem2->Fecha = date("Y-m-d");
    $oItem2->Detalle = $datos["Observacion_Transferencia"];
    $oItem2->Id_Funcionario = $datos["Identificacion_Funcionario"];
    $oItem2->Valor = $datos["Cantidad_Transferida"];
    // $oItem2->Moneda_Origen = $datos["Moneda_Origen"];
    $oItem2->Id_Moneda_Valor = $datos["Moneda_Destino"]; 
    // $oItem2->Moneda_Destino = $datos["Moneda_Destino"]; 
    // $oItem2->Cantidad_Transferida= $datos["Cantidad_Transferida"];
    // $oItem2->Cantidad_Recibida = $datos["Cantidad_Recibida"];
    //$oItem2->Transferencia="Si";
    $oItem2->Id_Tipo_Movimiento = '1';
    $oItem2->Valor_Tipo_Movimiento = $idtransferencia;
    $oItem2->save();
    unset($oItem2);
    
    
    
    //var_dump("paso 3");
    $cod = $configuracion->Consecutivo('Recibo');
    $oItem = new complex("Recibo","Id_Recibo" );
    $oItem->Codigo = $cod;
    $oItem->Identificacion_Funcionario = $datos["Identificacion_Funcionario"];
    $oItem->Id_Transferencia = $idtransferencia;
    $oItem->Tasa_Cambio = $datos["Tasa_Cambio"];
    $oItem->save();
    unset($oItem);
    
    //var_dump("paso 4");
    $oItem3 = new complex("Movimiento_Cuenta_Bancaria","Id_Movimiento_Cuenta_Bancaria");
    $oItem3->Id_Cuenta_Bancaria=$datos['Id_Cuenta_Bancaria'];
    $oItem3->Tipo="Ingreso";
    $oItem3->Fecha = date("Y-m-d");
    $oItem3->Detalle = $datos["Observacion_Transferencia"];
    $oItem3->Valor = $datos["Cantidad_Recibida"];
    $oItem3->Moneda_Origen = $datos["Moneda_Origen"];
    $oItem3->Moneda_Destino = $datos["Moneda_Destino"]; 
    $oItem3->Cantidad_Transferida= $datos["Cantidad_Transferida"];
    $oItem3->Cantidad_Recibida = $datos["Cantidad_Recibida"];
    $oItem3->Id_Tipo_Movimiento_Bancario = "1";
    $oItem3->Valor_Tipo_Movimiento_Bancario =$idtransferencia;
    $oItem3->save();
    unset($oItem3);
}

	echo json_encode('Exito');
