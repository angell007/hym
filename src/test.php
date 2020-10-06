<?php
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
    header('Content-Type: application/json');

    require_once('../../config/start.inc.php');
    include_once('../../class/class.lista.php');
    include_once('../../class/class.complex.php');
    include_once('../../class/class.consulta.php');
    require_once('../../class/class.configuracion.php');

    $datos = ( isset( $_REQUEST['modelo'] ) ? $_REQUEST['modelo'] : '' );
    $compras = ( isset( $_REQUEST['compras'] ) ? $_REQUEST['compras'] : '' );

    $datos = json_decode($datos,true);
    $compras = json_decode($compras,true);

    $fecha = date('Y-m-d');
    $hora = date('H:i:s');

    $datos['Fecha'] = $fecha;
    $datos['Hora'] = $hora;

  
        //creo la compra...
    $configuracion = new Configuracion();
    $cod = $configuracion->Consecutivo('Compra');
    $datos['Codigo']=$cod;
        
    $oItem = new complex("Compra","Id_Compra");
    $oItem->Codigo = $datos['Codigo'];
    $oItem->Id_Funcionario = $datos['Id_Funcionario'];
    $oItem->Id_Tercero = $datos['Id_Tercero'];
    $oItem->Valor_Compra = $datos['Valor_Compra'];
    $oItem->Tasa = $datos['Tasa'];
    $oItem->Valor_Peso = $datos['Valor_Peso'];
    $oItem->Fecha = $datos['Fecha'];
    $oItem->Hora = $datos['Hora'];
    $oItem->Detalle = $datos['Detalle'];
    $oItem->Id_Moneda_Compra = $datos['Id_Moneda_Compra'];
        
    $oItem->save();
    $idCompra = $oItem->getId();
    unset($oItem);
        
    //actualizo para relacionar la compra    
    foreach($compras as $compra){
        $oItem = new complex("Compra_Cuenta","Id_Compra_Cuenta",$compra['Id_Compra_Cuenta']);
        $oItem->Id_Compra = $idCompra;
        $oItem->save();
        unset($oItem);
    }

    //movimiento tercero    
    $oItem = new complex("Movimiento_Tercero","Id_Movimiento_Tercero");
    $oItem->Tipo = "Ingreso";
    $oItem->Valor = $datos["Valor_Compra"];
    $oItem->Id_Tercero = $datos["Id_Tercero"];
    $oItem->Detalle = 'Compra de '.GetCodigoMoneda($datos['Id_Moneda_Compra']).' '.$datos["Valor_Compra"].' por $'.$datos["Valor_Peso"].' a la tasa de '.$datos["Tasa"].' al Tercero '.GetNombreTercero($datos['Id_Tercero']);
    $oItem->Fecha = $fecha;
    $oItem->Id_Moneda_Valor = $datos['Id_Moneda_Compra'];
    $oItem->Id_Tipo_Movimiento = '2';
    $oItem->Valor_Tipo_Movimiento = $idCompra;
    $oItem->Estado = 'Activo';
    $oItem->save();
    unset($oItem);

        
    //}

    function GetCodigoMoneda($id_moneda){
        $bdObj = new complex('Moneda','Id_Moneda', $id_moneda);
        $codigo = $bdObj->Codigo;
        unset($bdObj);
        return $codigo;
    }

    function GetNombreTercero($id_tercero){
        $bdObj = new complex('Tercero','Id_Tercero', $id_tercero);
        $nombre = $bdObj->Nombre;
        unset($bdObj);
        return $nombre ;
    }
