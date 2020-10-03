<?php
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
	header('Content-Type: application/json');

	// require_once($_SERVER['DOCUMENT_ROOT'].'/config/start.inc.php');
	// include_once($_SERVER['DOCUMENT_ROOT'].'/class/class.complex.php');
	// include_once($_SERVER['DOCUMENT_ROOT'].'/class/class.consulta.php');
	include_once('../../class/class.querybasedatos.php');
	include_once('../../class/class.http_response.php');

	$modelo = (isset($_REQUEST['modelo']) && $_REQUEST['modelo'] != '') ? $_REQUEST['modelo'] : '';
	$contacto_emergencia = (isset($_REQUEST['contacto_emergencia']) && $_REQUEST['contacto_emergencia'] != '') ? $_REQUEST['contacto_emergencia'] : '';
	$permisos = (isset($_REQUEST['permisos']) && $_REQUEST['permisos'] != '') ? $_REQUEST['permisos'] : '';
	$cuentas_asociadas = (isset($_REQUEST['cuentas_asociadas']) && $_REQUEST['cuentas_asociadas'] != '') ? $_REQUEST['cuentas_asociadas'] : '';
    $Oficinas_Asociadas = (isset($_REQUEST['Oficinas_Asociadas']) && $_REQUEST['Oficinas_Asociadas'] != '') ? $_REQUEST['Oficinas_Asociadas'] : '';


	$modelo = json_decode($modelo, true);
	$contacto_emergencia = json_decode($contacto_emergencia, true);
	$permisos = (array)json_decode($permisos, true);
	$cuentas_asociadas = (array)json_decode($cuentas_asociadas, true);
    $Oficinas_Asociadas = (array)json_decode($Oficinas_Asociadas, true);

	unset($contacto_emergencia['Identificacion_Funcionario_Contacto_Emergencia']);

	$response = array();
	$http_response = new HttpResponse();

	// var_dump($modelo);
	// var_dump($contacto_emergencia);
	// var_dump($permisos);
	// var_dump($cuentas_asociadas);
	// exit;

	//ASIGNAR DATOS Y GUARDAR FUNCIONARIO
	$oItem = new complex("Funcionario","Identificacion_Funcionario");
	foreach($modelo as $index=>$value) {
		if ($value=='') {
			$value='0';
		}
        $oItem->$index=$value;
    }

    $oItem->save();
    unset($oItem);

    //ASIGNAR DATOS Y GUARDAR CONTACTO EMERGENCIA
    $oItem = new complex("Funcionario_Contacto_Emergencia","Identificacion_Funcionario_Contacto_Emergencia");
	foreach($contacto_emergencia as $index=>$value) {
        $oItem->$index=$value;
    }

    $oItem->save();
    unset($oItem);

    //ASIGNAR DATOS Y GUARDAR PERMISOS FUNCIONARIO
    foreach ($permisos as $permiso) {

		//unset($permiso['Id_Perfil_Funcionario']);		

    	$oItem = new complex("Perfil_Funcionario","Id_Perfil_Funcionario");

	    $oItem->Id_Perfil=$modelo["Id_Perfil"];
	    $oItem->Identificacion_Funcionario=$modelo['Identificacion_Funcionario'];
	    $oItem->Titulo_Modulo=$permiso["Titulo_Modulo"];
	    $oItem->Modulo = $permiso["Modulo"];
	    if($permiso["Ver"] != ""){
	         $oItem->Ver = $permiso["Ver"]; 
	    }else{
	        $oItem->Ver = "0";
	    }
	    if($permiso["Crear"] != ""){
	     $oItem->Crear = $permiso["Crear"];   
	    }else{
	        $oItem->Crear = "0";
	    }
	     if($permiso["Editar"] != ""){
	     $oItem->Editar = $permiso["Editar"];   
	    }else{
	        $oItem->Editar = "0";
	    }
	     if($permiso["Eliminar"] != ""){
	     $oItem->Eliminar = $permiso["Eliminar"];   
	    }else{
	        $oItem->Eliminar = "0";
	    }
	    $oItem->save();
	    unset($oItem);
    }


    //ASIGNAR DATOS Y GUARDAR CUENTAS ASOCIADAS
    if (count($cuentas_asociadas) > 0) {
	
		foreach ($cuentas_asociadas as $cta) {

			//unset($cta['Id_Funcionario_Cuenta_Bancaria']);
			
		 	$oItem = new complex("Funcionario_Cuenta_Bancaria","Id_Funcionario_Cuenta_Bancaria");
		    $oItem->Id_Funcionario=$modelo['Identificacion_Funcionario'];
		    $oItem->Id_Cuenta_Bancaria=$cta;
		    $oItem->EnUso='Si';
		    $oItem->save();
		    unset($oItem);

		    $oItem = new complex("Cuenta_Bancaria","Id_Cuenta_Bancaria", $cta);
		    $oItem->Asignada='Si';
		    $oItem->save();
		    unset($oItem);
		}
    }
    
    if (count($Oficinas_Asociadas) > 0) {
        foreach ($Oficinas_Asociadas as $oficina) {
            $oItem = new complex("Cajero_Principal_Oficina", "Id");
            $oItem->Cajero_Principal_Id = $modelo['Identificacion_Funcionario'];
            $oItem->Oficina_Id = $oficina;
            $oItem->save();
            unset($oItem);
        }
    }

	$http_response->SetRespuesta(0, 'Registro Exitoso', 'Se ha guardado el funcionario exitosamente!');
	$response = $http_response->GetRespuesta();

	unset($queryObj);
	unset($http_response);

	echo json_encode($response);