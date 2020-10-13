<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
header('Content-Type: application/json');

require_once('../../config/start.inc.php');
include_once('../../class/class.querybasedatos.php');
include_once('../../class/class.departamento.php');
include_once('../../class/class.oficina.php');
include_once('../../class/class.caja.php');
include_once('../../class/class.cajero.php');
include_once('../../class/class.utility.php');
include_once('../../class/class.moneda.php');
include_once('../../class/class.http_response.php');

$queryObj = new QueryBaseDatos();
$departamento = new Departamento($queryObj);
$oficina = new Oficina($queryObj);
$caja = new Caja($queryObj);
$cajero = new Cajero($queryObj);
$util = new Utility();
$moneda = new Moneda($queryObj);
$http_response = new HttpResponse();
$resultado = [];

//VALORES QUE LLEGAN DESDE LA VISTA PARA REALIZAR LAS CONSULTAS
$fechas = (isset($_REQUEST['fechas']) && $_REQUEST['fechas'] != '') ? $_REQUEST['fechas'] : '';
// $fechas_rango = $util->SepararFechas($fechas);

//SE BUSCAN LOS DEPARTAMENTOS CON OFICINAS
$departamentos_con_oficinas = $departamento->GetDepartamentoConOficinas();

//SE OBTIENEN LAS MONEDAS DEL SISTEMA
$monedas = GetMonedas();

//OBTENER ID DE LA MONEDA DESEADA, SIEMPRE Y CUANDO EXISTA EN EL SISTEMA
$id_moneda_pesos = $moneda->GetIdMonedaXNombre("pesos");

//SE REALIZA UN RECORRIDO DE LOS DEPARTAMENTOS OBTENIDOS, POR CADA DEPARTAMENTO SE BUSCAN LAS OFICINAS EN DICHOS DEPARTAMENTOS, SE HACE UN RECORRIDO DE LAS OFICINAS CONSULTADAS, SI EXISTEN, POR CADA OFICINA SE CONSULTAN LOS CAJEROS QUE HAN OPERADO EN DICHAS OFICINAS, SI EXISTEN, SE HACE UN RECORRIDO DE LOS CAJEROS CONSULTADOS PARA OBTENER LOS TOTALES DE CADA CAJERO Y HACER LA SUMA EN RETROSPECTIVA PARA ASIGNAR LOS VALORES CORRESPONDIENTES A LOS NIVELES SUPERIORES DE OFICINA Y DEPARTAMENTO AL QUE PERTENECE CADA CAJERO.
if (count($departamentos_con_oficinas) > 0) {

    foreach ($departamentos_con_oficinas as $key => $d) {

        $dep = array('Nombre' => $d['Nombre'], 'Totales' => [], 'Oficinas' => []);
        array_push($resultado, $dep);

        //OBTENER OFICINAS DEL DEPARTAMENTO DEL CICLO ACTIVO
        $oficinas_departamento = $oficina->GetOficinasDepartamento($d['Id_Departamento']);
        // var_dump($oficinas_departamento);

        if (count($oficinas_departamento) > 0) {

            foreach ($oficinas_departamento as $k => $o) {

                $of = array('Nombre' => $o['Nombre'], 'Totales' => [], 'Cajeros' => []);
                array_push($resultado[$key]['Oficinas'], $of);

                //OBTENER CAJEROS DE LAS OFICINA DEL CICLO ACTIVO
                $cajeros_oficina = $cajero->GetCajerosOficina($o['Id_Oficina'], $fechas, $fechas);

                if (count($cajeros_oficina) > 0) {

                    foreach ($cajeros_oficina as $ind => $c) {

                        //OBTENER LOS INGRESOS Y EGRESOS DEL CAJERO DEL CICLO ACTIVO
                        $total_cajero = GetIngresosEgresosFuncionario($c['Id_Funcionario'], $fechas, $fechas, $o['Id_Oficina']);

                        $caj = array('Nombre' => $c['Nombre_Cajero'], 'Totales' => $total_cajero);

                        //LLENAR POSICIONES RESPECTIVAS DEL ARRAY DE RESULTADOS, PARA EL DEPARTAMENTO Y LA OFICINA EN CURSO
                        foreach ($total_cajero as $i => $moneda) {
                            $resultado[$key]['Oficinas'][$k]['Totales'][$i]['Moneda'] = $moneda['Moneda'];
                            $resultado[$key]['Oficinas'][$k]['Totales'][$i]['Codigo'] = $moneda['Codigo'];
                            $resultado[$key]['Oficinas'][$k]['Totales'][$i]['Total'] += $moneda['Total'];
                            $resultado[$key]['Totales'][$i]['Moneda'] = $moneda['Moneda'];
                            $resultado[$key]['Totales'][$i]['Codigo'] = $moneda['Codigo'];
                            $resultado[$key]['Totales'][$i]['Total'] += $moneda['Total'];
                        }

                        array_push($resultado[$key]['Oficinas'][$k]['Cajeros'], $caj);
                    }
                } else {
                    //LLENAR POSICIONES RESPECTIVAS DEL ARRAY DE RESULTADOS, PARA EL DEPARTAMENTO Y LA OFICINA EN CURSO
                    foreach ($monedas as $i => $m) {
                        $resultado[$key]['Oficinas'][$k]['Totales'][$i]['Moneda'] = $m['Nombre'];
                        $resultado[$key]['Oficinas'][$k]['Totales'][$i]['Codigo'] = $m['Codigo'];
                        $resultado[$key]['Oficinas'][$k]['Totales'][$i]['Total'] += 0;
                        $resultado[$key]['Totales'][$i]['Moneda'] = $m['Nombre'];
                        $resultado[$key]['Totales'][$i]['Codigo'] = $m['Codigo'];
                        $resultado[$key]['Totales'][$i]['Total'] += 0;
                    }
                }
            }
        }
    }

    $http_response->SetRespuesta(0, 'Consulta Exitosa', 'Se encontraron datos de consulta!');
    $http_response->SetDatosRespuesta($resultado);
    $result = $http_response->GetRespuesta();
} else {
    $http_response->SetRespuesta(2, 'Sin datos', 'No encontraron datos para las fechas escogidas!');
    $http_response->SetDatosRespuesta($resultado);
    $result = $http_response->GetRespuesta();
}

echo json_encode($result);

//OTENER INGRESOS Y EGRESOS DE UN CAJERO POR OFICINA
function GetIngresosEgresosFuncionario($idFuncionario, $fechaIni, $fechaFin, $idOficina)
{
    global $queryObj, $monedas;

    $total_general = array();
    $total = 0;

    $ingresos_egresos_cambio = ConsultarIngresosEgresosCambios2($idFuncionario, $fechaIni, $fechaFin, $idOficina);
    $ingresos_egresos_transferencia = ConsultarIngresosEgresosTransferencias2($idFuncionario, $fechaIni, $fechaFin, $idOficina);
    $ingresos_egresos_giro = ConsultarIngresosEgresosGiros2($idFuncionario, $fechaIni, $fechaFin, $idOficina);
    $ingresos_egresos_traslado = ConsultarIngresosEgresosTraslados2($idFuncionario, $fechaIni, $fechaFin, $idOficina);
    $ingresos_egresos_corresponsal = ConsultarIngresosEgresosCorresponsal2($idFuncionario, $fechaIni, $fechaFin, $idOficina);
    $ingresos_egresos_servicios = ConsultarIngresosEgresosServicios2($idFuncionario, $fechaIni, $fechaFin, $idOficina);


    $i = 0;
    foreach ($ingresos_egresos_cambio as $moneda => $valores) {
        $total_general[$i]['Moneda'] = $moneda;
        $total_general[$i]['Codigo'] = $valores['Codigo'];

        $total_general[$i]['Total'] = $valores['Total'] + $ingresos_egresos_transferencia[$moneda]['Total'] + $ingresos_egresos_giro[$moneda]['Total'] + $ingresos_egresos_traslado[$moneda]['Total'] + $ingresos_egresos_corresponsal[$moneda]['Total'] + $ingresos_egresos_servicios[$moneda]['Total'];

        $total += $total_general[$moneda]['Total'];
        $i++;
    }

    return $total_general;
}

//OBTENER TODAS LAS MONEDAS DEL SISTEMA
function GetMonedas()
{

    $query = "
			SELECT
				Id_Moneda,
				Nombre,
				Codigo
                FROM Moneda WHERE NOT Estado= 'Inactiva'";

    $oCon = new consulta();
    $oCon->setQuery($query);
    $oCon->setTipo('Multiple');
    $monedas = $oCon->getData();
    unset($oCon);

    return $monedas;
}

//NUEVO
//OBTENER TOTALES DE INGRESOS Y EGRESOS DE LOS CAJEROS POR OFICINA CONSULTADA
function ConsultarIngresosEgresosCambios2($idFuncionario, $fechaIni, $fechaFin, $idOficina)
{
    global $monedas;

    $ingresos_egresos_cambio = array();

    foreach ($monedas as $val) {

        $query_ingreso = "
				SELECT 
					IFNULL(SUM(T1.Valor_Origen), 0) AS Ingreso_Total,				    
				    T2.Nombre as Moneda,
				    T2.Codigo as Codigo,
				    T2.Id_Moneda as Moneda_Id,
				    'Cambio' AS Modulo
				FROM Cambio T1
				INNER JOIN Moneda T2 on T1.Moneda_Origen = T2.Id_Moneda
				where
					T1.Identificacion_Funcionario = $idFuncionario
					AND DATE(T1.Fecha) BETWEEN '$fechaIni' AND '$fechaFin'
					AND T1.Estado <> 'Anulado'
					AND T1.Id_Oficina = $idOficina
					AND T2.Id_Moneda = $val[Id_Moneda]";

        // var_dump($query_ingreso);
        // exit;

        $oCon = new consulta();
        $oCon->setQuery($query_ingreso);
        $r1 = $oCon->getData();

        unset($oCon);

        if ($r1 === false) {
            $ingresos_egresos_cambio[$val['Nombre']]['Ingresos'] += floatval(0);
        } else {
            $ingresos_egresos_cambio[$val['Nombre']]['Ingresos'] += floatval($r1['Ingreso_Total']);
        }

        $query_egreso = "
				SELECT 
					IFNULL(SUM(T1.Valor_Destino), 0) AS Egreso_Total,				    
				    T2.Nombre as Moneda,
				    T2.Codigo as Codigo,
				    T2.Id_Moneda as Moneda_Id,
				    'Cambio' AS Modulo
				FROM Cambio T1
				INNER JOIN Moneda T2 on T1.Moneda_Destino = T2.Id_Moneda
				where
					T1.Identificacion_Funcionario = $idFuncionario
					AND DATE(T1.Fecha) BETWEEN '$fechaIni' AND '$fechaFin'
					AND T1.Estado <> 'Anulado'
					AND T1.Id_Oficina = $idOficina
					AND T2.Id_Moneda = $val[Id_Moneda]";

        $oCon = new consulta();
        $oCon->setQuery($query_egreso);
        $r2 = $oCon->getData();
        unset($oCon);

        if ($r2 === false) {
            $ingresos_egresos_cambio[$val['Nombre']]['Egresos'] += floatval(0);
        } else {
            $ingresos_egresos_cambio[$val['Nombre']]['Egresos'] += floatval($r2['Egreso_Total']);
        }

        $ingresos_egresos_cambio[$val['Nombre']]['Codigo'] = $val['Codigo'];

        $ingresos_egresos_cambio[$val['Nombre']]['Total'] = $ingresos_egresos_cambio[$val['Nombre']]['Ingresos'] - $ingresos_egresos_cambio[$val['Nombre']]['Egresos'];
    }

    return $ingresos_egresos_cambio;
}

function ConsultarIngresosEgresosTransferencias2($idFuncionario, $fechaIni, $fechaFin, $idOficina)
{
    global $monedas;

    $ingresos_egresos_transferencia = array();

    foreach ($monedas as $val) {

        $query_ingreso = "
				SELECT 
					IFNULL(SUM(T1.Cantidad_Recibida), 0) AS Ingreso_Total,				    
				    T2.Nombre as Moneda,
				    T2.Codigo as Codigo,
				    T2.Id_Moneda as Moneda_Id,
				    'Transferencia' AS Modulo
				FROM Transferencia T1
				INNER JOIN Moneda T2 on T1.Moneda_Origen = T2.Id_Moneda
				where
					T1.Identificacion_Funcionario = $idFuncionario
					AND DATE(T1.Fecha) BETWEEN '$fechaIni' AND '$fechaFin'
					AND T1.Estado <> 'Anulada'
					AND T1.Forma_Pago = 'Efectivo'
					AND T1.Id_Oficina = $idOficina
					AND T2.Id_Moneda = $val[Id_Moneda]";

        $oCon = new consulta();
        $oCon->setQuery($query_ingreso);
        $r1 = $oCon->getData();

        unset($oCon);

        if ($r1 === false) {
            $ingresos_egresos_transferencia[$val['Nombre']]['Ingresos'] += floatval(0);
        } else {
            $ingresos_egresos_transferencia[$val['Nombre']]['Ingresos'] += floatval($r1['Ingreso_Total']);
        }

        $query_egreso = "
				SELECT 
					0 AS Egreso_Total,			    
				    T2.Nombre as Moneda,
				    T2.Codigo as Codigo,
				    T2.Id_Moneda as Moneda_Id,
				    'Transferencia' AS Modulo
				FROM Transferencia T1
				INNER JOIN Moneda T2 on T1.Moneda_Destino = T2.Id_Moneda
				where
					T1.Identificacion_Funcionario = $idFuncionario
					AND DATE(T1.Fecha) BETWEEN '$fechaIni' AND '$fechaFin'
					AND T1.Estado <> 'Anulada'
					AND T1.Forma_Pago = 'Efectivo'
					AND T1.Id_Oficina = $idOficina
					AND T2.Id_Moneda = $val[Id_Moneda]";

        $oCon = new consulta();
        $oCon->setQuery($query_egreso);
        $r2 = $oCon->getData();
        unset($oCon);

        if ($r2 === false) {
            $ingresos_egresos_transferencia[$val['Nombre']]['Egresos'] += floatval(0);
        } else {
            $ingresos_egresos_transferencia[$val['Nombre']]['Egresos'] += floatval($r2['Egreso_Total']);
        }

        $ingresos_egresos_transferencia[$val['Nombre']]['Codigo'] = $val['Codigo'];
        $ingresos_egresos_transferencia[$val['Nombre']]['Total'] = $ingresos_egresos_transferencia[$val['Nombre']]['Ingresos'] - $ingresos_egresos_transferencia[$val['Nombre']]['Egresos'];
    }

    return $ingresos_egresos_transferencia;
}

function ConsultarIngresosEgresosGiros2($idFuncionario, $fechaIni, $fechaFin, $idOficina)
{
    global $monedas;

    $ingresos_egresos_giros = array();

    foreach ($monedas as $val) {

        $query_ingreso = "
				SELECT 
					IFNULL(SUM(T1.Valor_Total), 0) AS Ingreso_Total,		    
				    T2.Nombre as Moneda,
				    T2.Codigo as Codigo,
				    T2.Id_Moneda as Moneda_Id,
				    'Giro' AS Modulo
				FROM Giro T1
				INNER JOIN Moneda T2 on T1.Id_Moneda = T2.Id_Moneda
				where
					T1.Identificacion_Funcionario = $idFuncionario
					AND DATE(T1.Fecha) BETWEEN '$fechaIni' AND '$fechaFin'
					AND T1.Estado <> 'Anulado'
					AND T1.Id_Oficina = $idOficina
					AND T2.Id_Moneda = $val[Id_Moneda]";

        $oCon = new consulta();
        $oCon->setQuery($query_ingreso);
        $r1 = $oCon->getData();

        unset($oCon);

        if ($r1 === false) {
            $ingresos_egresos_giros[$val['Nombre']]['Ingresos'] += floatval(0);
        } else {
            $ingresos_egresos_giros[$val['Nombre']]['Ingresos'] += floatval($r1['Ingreso_Total']);
        }

        $query_egreso = "
				SELECT 
					IFNULL(SUM(Valor_Entrega), 0) AS Egreso_Total,		    
				    T2.Nombre as Moneda,
				    T2.Codigo as Codigo,
				    T2.Id_Moneda as Moneda_Id,
				    'Giro' AS Modulo
				FROM Giro T1
				INNER JOIN Moneda T2 on T1.Id_Moneda = T2.Id_Moneda
				where
					T1.Funcionario_Pago = $idFuncionario
					AND DATE(T1.Fecha) BETWEEN '$fechaIni' AND '$fechaFin'
					AND T1.Estado = 'Pagado'
					AND T1.Id_Oficina = $idOficina
					AND T2.Id_Moneda = $val[Id_Moneda]";

        $oCon = new consulta();
        $oCon->setQuery($query_egreso);
        $r2 = $oCon->getData();
        unset($oCon);

        if ($r2 === false) {
            $ingresos_egresos_giros[$val['Nombre']]['Egresos'] += floatval(0);
        } else {
            $ingresos_egresos_giros[$val['Nombre']]['Egresos'] += floatval($r2['Egreso_Total']);
        }

        $ingresos_egresos_giros[$val['Nombre']]['Codigo'] = $val['Codigo'];
        $ingresos_egresos_giros[$val['Nombre']]['Total'] = $ingresos_egresos_giros[$val['Nombre']]['Ingresos'] - $ingresos_egresos_giros[$val['Nombre']]['Egresos'];
    }

    return $ingresos_egresos_giros;
}

function ConsultarIngresosEgresosTraslados2($idFuncionario, $fechaIni, $fechaFin, $idOficina)
{
    global $monedas;

    $ingresos_egresos_traslados = array();

    foreach ($monedas as $val) {

        $query_ingreso = "
				SELECT 
					IFNULL(SUM(T1.Valor), 0) AS Ingreso_Total,	    
				    T2.Nombre as Moneda,
				    T2.Codigo as Codigo,
				    T2.Id_Moneda as Moneda_Id,
				    'Traslado_Caja' AS Modulo
				FROM Traslado_Caja T1
				INNER JOIN Moneda T2 on T1.Id_Moneda = T2.Id_Moneda
				where
					T1.Funcionario_Destino = $idFuncionario
					AND DATE(T1.Fecha_Traslado) BETWEEN '$fechaIni' AND '$fechaFin'
					AND T1.Estado <> 'Anulado'
					AND T2.Id_Moneda = $val[Id_Moneda]";

        $oCon = new consulta();
        $oCon->setQuery($query_ingreso);
        $r1 = $oCon->getData();

        unset($oCon);

        if ($r1 === false) {
            $ingresos_egresos_traslados[$val['Nombre']]['Ingresos'] += floatval(0);
        } else {
            $ingresos_egresos_traslados[$val['Nombre']]['Ingresos'] += floatval($r1['Ingreso_Total']);
        }

        $query_egreso = "
				SELECT 
					IFNULL(SUM(T1.Valor), 0) AS Egreso_Total,   
				    T2.Nombre as Moneda,
				    T2.Codigo as Codigo,
				    T2.Id_Moneda as Moneda_Id,
				    'Traslado_Caja' AS Modulo
				FROM Traslado_Caja T1
				INNER JOIN Moneda T2 on T1.Id_Moneda = T2.Id_Moneda
				where
					T1.Id_Cajero_Origen = $idFuncionario
					AND DATE(T1.Fecha_Traslado) BETWEEN '$fechaIni' AND '$fechaFin'
					ANd T1.Estado <> 'Anulado'
					AND T1.Id_Oficina = $idOficina
					AND T2.Id_Moneda = $val[Id_Moneda]";

        $oCon = new consulta();
        $oCon->setQuery($query_egreso);
        $r2 = $oCon->getData();
        unset($oCon);

        if ($r2 === false) {
            $ingresos_egresos_traslados[$val['Nombre']]['Egresos'] += floatval(0);
        } else {
            $ingresos_egresos_traslados[$val['Nombre']]['Egresos'] += floatval($r2['Egreso_Total']);
        }

        $ingresos_egresos_traslados[$val['Nombre']]['Codigo'] = $val['Codigo'];
        $ingresos_egresos_traslados[$val['Nombre']]['Total'] = $ingresos_egresos_traslados[$val['Nombre']]['Ingresos'] - $ingresos_egresos_traslados[$val['Nombre']]['Egresos'];
    }

    return $ingresos_egresos_traslados;
}

function ConsultarIngresosEgresosCorresponsal2($idFuncionario, $fechaIni, $fechaFin, $idOficina)
{
    global $monedas, $id_moneda_pesos;

    $ingresos_egresos_corresponsal = array();

    foreach ($monedas as $val) {

        if ($val['Id_Moneda'] == $id_moneda_pesos) {
            $query_ingreso = "
					SELECT 
						IFNULL(SUM(T1.Consignacion), 0) AS Ingreso_Total,   
					    T2.Nombre as Moneda,
					    T2.Codigo as Codigo,
					    T2.Id_Moneda as Moneda_Id,
					    'Corresponsal' AS Modulo
					FROM Corresponsal_Diario_Nuevo T1
					INNER JOIN Moneda T2 on T2.Id_Moneda = $id_moneda_pesos
					where
						T1.Identificacion_Funcionario = $idFuncionario
						AND DATE(T1.Fecha) BETWEEN '$fechaIni' AND '$fechaFin'
						AND T1.Id_Oficina = $idOficina";

            $oCon = new consulta();
            $oCon->setQuery($query_ingreso);
            $r1 = $oCon->getData();

            unset($oCon);

            if ($r1 === false) {
                $ingresos_egresos_corresponsal[$val['Nombre']]['Ingresos'] += floatval(0);
            } else {
                $ingresos_egresos_corresponsal[$val['Nombre']]['Ingresos'] += floatval($r1['Ingreso_Total']);
            }

            $query_egreso = "
					SELECT 
						IFNULL(SUM(T1.Retiro), 0) AS Egreso_Total,   
					    T2.Nombre as Moneda,
					    T2.Codigo as Codigo,
					    T2.Id_Moneda as Moneda_Id,
					    'Corresponsal' AS Modulo
					FROM Corresponsal_Diario_Nuevo T1
					INNER JOIN Moneda T2 on T2.Id_Moneda = $id_moneda_pesos
					where
						T1.Identificacion_Funcionario = $idFuncionario
						AND DATE(T1.Fecha) BETWEEN '$fechaIni' AND '$fechaFin'
						AND T1.Id_Oficina = $idOficina";

            $oCon = new consulta();
            $oCon->setQuery($query_egreso);
            $r2 = $oCon->getData();
            unset($oCon);

            if ($r2 === false) {
                $ingresos_egresos_corresponsal[$val['Nombre']]['Egresos'] += floatval(0);
            } else {
                $ingresos_egresos_corresponsal[$val['Nombre']]['Egresos'] += floatval($r2['Egreso_Total']);
            }
        } else {
            $ingresos_egresos_corresponsal[$val['Nombre']]['Ingresos'] += floatval(0);
            $ingresos_egresos_corresponsal[$val['Nombre']]['Egresos'] += floatval(0);
        }

        $ingresos_egresos_corresponsal[$val['Nombre']]['Codigo'] = $val['Codigo'];
        $ingresos_egresos_corresponsal[$val['Nombre']]['Total'] = $ingresos_egresos_corresponsal[$val['Nombre']]['Ingresos'] - $ingresos_egresos_corresponsal[$val['Nombre']]['Egresos'];
    }

    return $ingresos_egresos_corresponsal;
}

function ConsultarIngresosEgresosServicios2($idFuncionario, $fechaIni, $fechaFin, $idOficina)
{
    global $monedas;

    $ingresos_egresos_servicio = array();

    foreach ($monedas as $val) {

        $query_ingreso = "
				SELECT 
					IFNULL(SUM(T1.Valor + T1.Comision), 0) AS Ingreso_Total,
				    T2.Nombre as Moneda,
				    T2.Codigo as Codigo,
				    T2.Id_Moneda as Moneda_Id,
				    'Servicio' AS Modulo
				FROM Servicio T1
				INNER JOIN Moneda T2 on T1.Id_Moneda = T2.Id_Moneda
				where
					T1.Identificacion_Funcionario = $idFuncionario
					AND DATE(T1.Fecha) BETWEEN '$fechaIni' AND '$fechaFin'
					AND T1.Id_Oficina = $idOficina
					AND T2.Id_Moneda = $val[Id_Moneda]";

        $oCon = new consulta();
        $oCon->setQuery($query_ingreso);
        $r1 = $oCon->getData();

        unset($oCon);

        if ($r1 === false) {
            $ingresos_egresos_servicio[$val['Nombre']]['Ingresos'] += floatval(0);
        } else {
            $ingresos_egresos_servicio[$val['Nombre']]['Ingresos'] += floatval($r1['Ingreso_Total']);
        }

        $query_egreso = "
				SELECT 
					0 AS Egreso_Total,
				    T2.Nombre as Moneda,
				    T2.Codigo as Codigo,
				    T2.Id_Moneda as Moneda_Id,
				    'Servicio' AS Modulo
				FROM Servicio T1
				INNER JOIN Moneda T2 on T1.Id_Moneda = T2.Id_Moneda
				WHERE
					 T2.Id_Moneda = $val[Id_Moneda]";

        $oCon = new consulta();
        $oCon->setQuery($query_egreso);
        $r2 = $oCon->getData();
        unset($oCon);

        if ($r2 === false) {
            $ingresos_egresos_servicio[$val['Nombre']]['Egresos'] += floatval(0);
        } else {
            $ingresos_egresos_servicio[$val['Nombre']]['Egresos'] += floatval($r2['Egreso_Total']);
        }

        $ingresos_egresos_servicio[$val['Nombre']]['Codigo'] = $val['Codigo'];
        $ingresos_egresos_servicio[$val['Nombre']]['Total'] = $ingresos_egresos_servicio[$val['Nombre']]['Ingresos'] - $ingresos_egresos_servicio[$val['Nombre']]['Egresos'];
    }

    return $ingresos_egresos_servicio;
}
