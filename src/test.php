<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
header('Content-Type: application/json');

require_once('../../config/start.inc.php');
include_once('../../class/class.lista.php');
include_once('../../class/class.complex.php');
include_once('../../class/class.consulta.php');

date_default_timezone_set('America/Los_Angeles');

$id = (isset($_REQUEST['id']) ? $_REQUEST['id'] : '');
$fecha_actual = isset($_REQUEST['fecha']) && $_REQUEST['fecha'] != ''  ? $_REQUEST['fecha'] : date('Y-m-d');
$modulos = ['Cambios', 'Transferencias', 'Giros', 'Traslados', 'Corresponsal', 'Servicios', 'Egresos'];


$query = 'SELECT
			    Id_Moneda,
                Nombre,
			    Codigo
		FROM Moneda';

$oCon = new consulta();
$oCon->setQuery($query);
$oCon->setTipo('Multiple');
$resultado['monedas'] = $oCon->getData();
unset($oCon);

AgregarColoresMoneda();

function is_not_null($value)
{
    return $value['Nombre'] == 'Pesos' || $value['Nombre'] == 'Viejitos' || $value['Nombre'] == 'Bolivares Soberanos';
}

function have_valor($value)
{
    return $value;
}

$in_condition = FormarCadenaIdMonedas($resultado['monedas']);
$valores = array();

foreach ($modulos as $value) {

    $valores[$value] = array();

    switch ($value) {
        
        case 'Cambios':
            ConsultarIngresosEgresosCambios($value, $id, $fecha_actual);
            break;

        case 'Transferencias':

            ConsultarIngresosEgresosTransferencias($value, $id, $fecha_actual);
            break;

        case 'Giros':

            ConsultarIngresosEgresosGiros($value, $id, $fecha_actual);
            break;

        case 'Traslados':

            ConsultarIngresosEgresosTraslados($value, $id, $fecha_actual);
            break;

        case 'Corresponsal':

            ConsultarIngresosEgresosCorresponsal($value, $id, $fecha_actual);
            break;

        case 'Servicios':

            ConsultarIngresosEgresosServicios($value, $id, $fecha_actual);
            break;
        case 'Egresos':

            ConsultarEgresos($value, $id, $fecha_actual);
            break;

        default:

            break;
    }
}


function FormarCadenaIdMonedas($arrayMonedas)
{
    $cadena = '';
    $i = 0;

    foreach ($arrayMonedas as $value) {

        if (($i + 1) == count($arrayMonedas)) {
            $cadena .= $value['Id_Moneda'];
            return $cadena;
        }

        $cadena .= $value['Id_Moneda'] . ", ";
        $i++;
    }

    return $cadena;
}

function ArmarValores($resultado)
{
    $max_cel_colspan = 0;
    $valores_tabla = array();

    if (count($resultado['monedas']) > 0) {
        foreach ($resultado['monedas'] as $value) {
            $ing = 'Ingresos';
            $eg = 'Egresos';
            array_push($valores_tabla, $ing, $eg);
            $max_cel_colspan += 2;
        }
    }

    $valores = array();

    if (count($modulos) > 0) {
        foreach ($modulos as $value) {

            array_filter($resultado['monedas']);
        }
    }
}

function ConsultarIngresosEgresosCambios($modulo, $id, $fecha_actual)
{
    global $valores, $resultado;

    $i = 0;
    $color = '#ffffff';
    foreach ($resultado['monedas'] as $val) {
        $color = $i % 2 == 0 ? '#87cefa' : "#ffffff";

        $query_ingreso = '
				SELECT 
					IF(sum(Valor_Origen) > 0, sum(Valor_Origen), 0) AS Ingreso_Total,
				    t2.Nombre as Moneda,
				    t2.Codigo as Codigo,
				    t2.Id_Moneda as Moneda_Id,
				    "' . $color . '" AS Color
				FROM `Cambio` t1
				inner join Moneda t2 on t1.Moneda_Origen = t2.Id_Moneda
				where
					t1.Moneda_Origen = ' . $val['Id_Moneda'] . '
					AND DATE(t1.Fecha) = "' . $fecha_actual . '" 
					AND Identificacion_Funcionario = ' . $id . '
					AND t1.Estado <> "Anulado"
				group by t2.Id_Moneda';

        $oCon = new consulta();
        $oCon->setQuery($query_ingreso);
        $r1 = $oCon->getData();

        unset($oCon);

        if ($r1 === false) {
            $arr = ['Ingreso_Total' => '0', "Moneda" => $val['Nombre'], 'Moneda_Id' => $val['Id_Moneda'], 'Codigo' => $val['Codigo'], 'Color' => $color];
            array_push($valores[$modulo], $arr);
        } else {
            array_push($valores[$modulo], $r1);
        }

        $query_egreso = '
				SELECT 
					sum(Valor_Destino) AS Egreso_Total,
				    t2.Nombre as Moneda,
				    t2.Codigo as Codigo,
				    t2.Id_Moneda as Moneda_Id,
				    "' . $color . '" AS Color
				FROM `Cambio` t1
				inner join Moneda t2 on t1.Moneda_Destino = t2.Id_Moneda
				where
					t1.Moneda_Destino = ' . $val['Id_Moneda'] . '
					AND Identificacion_Funcionario = ' . $id . '
					AND DATE(t1.Fecha) = "' . $fecha_actual . '" 
					AND t1.Estado <> "Anulado"
				group by t2.Id_Moneda';

        $oCon = new consulta();
        $oCon->setQuery($query_egreso);
        $r2 = $oCon->getData();
        unset($oCon);

        if ($r2 === false) {
            $arr1 = ['Egreso_Total' => '0', "Moneda" => $val['Nombre'], 'Moneda_Id' => $val['Id_Moneda'], 'Codigo' => $val['Codigo'], 'Color' => $color];

            array_push($valores[$modulo], $arr1);
        } else {
            array_push($valores[$modulo], $r2);
        }

        $i++;
    }
}

function ConsultarIngresosEgresosTransferencias($modulo, $id, $fecha_actual)
{

    global $valores, $resultado;

    $i = 0;
    $color = 'ffffff';
    foreach ($resultado['monedas'] as $val) {
        $color = $i % 2 == 0 ? '#87cefa' : "#ffffff";

        $query_ingreso = '
				SELECT 
					sum(t1.Cantidad_Recibida) as Ingreso_Total,
				    t2.Nombre as Moneda,
				    t2.Codigo as Codigo,
				    t2.Id_Moneda as Moneda_Id,
				    "' . $color . '" AS Color
				FROM `Transferencia` t1
				inner join Moneda t2 on t1.Moneda_Origen = t2.Id_Moneda
				where
					t1.Moneda_Origen = ' . $val["Id_Moneda"] . '
					AND DATE(t1.Fecha) = "' . $fecha_actual . '" 
					AND Identificacion_Funcionario = ' . $id . ' 
					AND (t1.Estado = "Activa" OR  t1.Estado = "Pagada")
					AND t1.Forma_Pago = "Efectivo"
				group by t2.Id_Moneda';

        $oCon = new consulta();
        $oCon->setQuery($query_ingreso);
        $r1 = $oCon->getData();

        unset($oCon);

        if ($r1 === false) {
            $arr = ['Ingreso_Total' => '0', "Moneda" => $val['Nombre'], 'Moneda_Id' => $val['Id_Moneda'], 'Codigo' => $val['Codigo'], 'Color' => $color];

            array_push($valores[$modulo], $arr);
        } else {
            array_push($valores[$modulo], $r1);
        }

        $query_egreso = '
				SELECT 
				    0 as Egreso_Total,
				    t2.Nombre as Moneda,
				    t2.Codigo as Codigo,
				    t2.Id_Moneda as Moneda_Id,
				    "' . $color . '" AS Color
				FROM `Transferencia` t1
				inner join Moneda t2 on t1.Moneda_Destino = t2.Id_Moneda
				where
					t1.Moneda_Destino = ' . $val["Id_Moneda"] . '
					AND DATE(t1.Fecha) = "' . $fecha_actual . '" 
					AND Identificacion_Funcionario = ' . $id . ' 
					AND (t1.Estado = "Activa" OR  t1.Estado = "Pagada")
					AND t1.Forma_Pago = "Efectivo"
				group by t2.Id_Moneda';

        $oCon = new consulta();
        $oCon->setQuery($query_egreso);
        $r2 = $oCon->getData();
        unset($oCon);


        if ($r2 === false) {
            $arr1 = ['Egreso_Total' => '0', "Moneda" => $val['Nombre'], 'Moneda_Id' => $val['Id_Moneda'], 'Codigo' => $val['Codigo'], 'Color' => $i % 2 == 0 ? '#87cefa' : "#ffffff"];

            array_push($valores[$modulo], $arr1);
        } else {
            array_push($valores[$modulo], $r2);
        }
        $i++;
    }
}

function ConsultarIngresosEgresosGiros($modulo, $id, $fecha_actual)
{

    global $valores, $resultado;

    $i = 0;
    $color = 'ffffff';
    foreach ($resultado['monedas'] as $val) {
        $color = $i % 2 == 0 ? '#87cefa' : "#ffffff";

        $query_ingreso = '
				SELECT 
					(IFNULL((SELECT SUM(Valor_Total)), 0)) AS Ingreso_Total,
				    t2.Nombre as Moneda,
				    t2.Codigo as Codigo,
				    t2.Id_Moneda as Moneda_Id,
				    "' . $color . '" AS Color
				FROM `Giro` t1
				inner join Moneda t2 on t1.Id_Moneda = t2.Id_Moneda
				where
					t1.Id_Moneda = ' . $val["Id_Moneda"] . '
					AND DATE(t1.Fecha) = "' . $fecha_actual . '" 
					AND t1.Identificacion_Funcionario = ' . $id . '
					AND t1.Estado != "Anulado"
				group by t2.Id_Moneda';

        $oCon = new consulta();
        $oCon->setQuery($query_ingreso);
        $r1 = $oCon->getData();

        unset($oCon);

        if ($r1 === false) {
            $arr = ['Ingreso_Total' => '0', "Moneda" => $val['Nombre'], 'Moneda_Id' => $val['Id_Moneda'], 'Codigo' => $val['Codigo'], 'Color' => $color];

            array_push($valores[$modulo], $arr);
        } else {
            array_push($valores[$modulo], $r1);
        }

        $query_egreso = '
				SELECT 
					(IFNULL((SELECT SUM(Valor_Entrega)), 0)) AS Egreso_Total,
				    t2.Nombre as Moneda,
				    t2.Codigo as Codigo,
				    t2.Id_Moneda as Moneda_Id,
				    "' . $color . '" AS Color,
				    "Giros" as Modulo
				FROM `Giro` t1
				inner join Moneda t2 on t1.Id_Moneda = t2.Id_Moneda
				where
					t1.Id_Moneda = ' . $val["Id_Moneda"] . '
					AND DATE(t1.Fecha) = "' . $fecha_actual . '" 
					AND Funcionario_Pago = ' . $id . '
					AND t1.Estado = "Pagado"
				group by t2.Id_Moneda';

        $oCon = new consulta();
        $oCon->setQuery($query_egreso);
        $r2 = $oCon->getData();
        unset($oCon);

        if ($r2 === false) {
            $arr1 = ['Egreso_Total' => '0', "Moneda" => $val['Nombre'], 'Moneda_Id' => $val['Id_Moneda'], 'Codigo' => $val['Codigo'], 'Color' => $color];

            array_push($valores[$modulo], $arr1);
        } else {
            array_push($valores[$modulo], $r2);
        }
        $i++;
    }
}

function ConsultarIngresosEgresosTraslados($modulo, $id, $fecha_actual)
{

    global $valores, $resultado;

    $i = 0;
    $color = 'ffffff';
    foreach ($resultado['monedas'] as $val) {
        $color = $i % 2 == 0 ? '#87cefa' : "#ffffff";

        $query_ingreso = '
				SELECT 
					(IFNULL((select sum(Valor)), 0)) as Ingreso_Total,
				    t2.Nombre as Moneda,
				    t2.Codigo as Codigo,
				    t2.Id_Moneda as Moneda_Id,
				    "' . $color . '" AS Color
				FROM `Traslado_Caja` t1
				inner join Moneda t2 on t1.Id_Moneda = t2.Id_Moneda
				where
					t1.Id_Moneda = ' . $val["Id_Moneda"] . '
					AND DATE(t1.Fecha_Traslado) = "' . $fecha_actual . '" 
					AND t1.Estado = "Aprobado"
					AND t1.Funcionario_Destino = ' . $id . ' 
				group by t1.Id_Moneda';

        $oCon = new consulta();
        $oCon->setQuery($query_ingreso);
        $r1 = $oCon->getData();

        unset($oCon);

        if ($r1 === false) {
            $arr = ['Ingreso_Total' => '0', "Moneda" => $val['Nombre'], 'Moneda_Id' => $val['Id_Moneda'], 'Codigo' => $val['Codigo'], 'Color' => $color];

            array_push($valores[$modulo], $arr);
        } else {
            array_push($valores[$modulo], $r1);
        }

        $query_egreso = '
				SELECT 
		            (IFNULL((select sum(Valor)), 0)) as Egreso_Total,
				    t2.Nombre as Moneda,
				    t2.Codigo as Codigo,
				    t2.Id_Moneda as Moneda_Id,
				    "' . $color . '" AS Color
				FROM `Traslado_Caja` t1
				inner join Moneda t2 on t1.Id_Moneda = t2.Id_Moneda
				where
					t1.Id_Moneda = ' . $val["Id_Moneda"] . '
					AND DATE(t1.Fecha_Traslado) = "' . $fecha_actual . '" 
					AND t1.Estado = "Aprobado"
					AND t1.Id_Cajero_Origen = ' . $id . ' 
				group by t1.Id_Moneda';

        $oCon = new consulta();
        $oCon->setQuery($query_egreso);
        $r2 = $oCon->getData();
        unset($oCon);

        if ($r2 === false) {
            $arr1 = ['Egreso_Total' => '0', "Moneda" => $val['Nombre'], 'Moneda_Id' => $val['Id_Moneda'], 'Codigo' => $val['Codigo'], 'Color' => $color];

            array_push($valores[$modulo], $arr1);
        } else {
            array_push($valores[$modulo], $r2);
        }

        $i++;
    }
}

function ConsultarIngresosEgresosCorresponsal($modulo, $id, $fecha_actual)
{

    global $valores, $resultado;

    $i = 0;
    $color = 'ffffff';
    foreach ($resultado['monedas'] as $val) {
        $color = $i % 2 == 0 ? '#87cefa' : "#ffffff";

        if (strtolower($val['Nombre']) == 'pesos') {
            $query_ingreso = '
					SELECT 
						IFNULL(sum(t1.Consignacion), 0) as Ingreso_Total,
					    "' . $val['Nombre'] . '" as Moneda,
					    "' . $val['Codigo'] . '" as Codigo,
					    "' . $val['Id_Moneda'] . '" as Moneda_Id,
					    "Corresponsal Bancario" as Modulo,
				    	"' . $color . '" AS Color
					FROM `Corresponsal_Diario_Nuevo` t1
					where
						t1.Fecha = "' . $fecha_actual . '" 
						AND t1.Identificacion_Funcionario = ' . $id . ' 
					group by t1.Identificacion_Funcionario';

            $oCon = new consulta();
            $oCon->setQuery($query_ingreso);
            $r1 = $oCon->getData();


            unset($oCon);

            if ($r1 === false) {
                $arr = ['Ingreso_Total' => '0', "Moneda" => $val['Nombre'], 'Moneda_Id' => $val['Id_Moneda'], 'Codigo' => $val['Codigo'], 'Color' => $color];

                array_push($valores[$modulo], $arr);
            } else {
                array_push($valores[$modulo], $r1);
            }

            $query_egreso = '
					SELECT 
						IFNULL(sum(t1.Retiro), 0) as Egreso_Total,
					    "' . $val['Nombre'] . '" as Moneda,
					    "' . $val['Codigo'] . '" as Codigo,
					    "' . $val['Id_Moneda'] . '" as Moneda_Id,
					    "Corresponsal Bancario" as Modulo,
				    	"' . $color . '" AS Color
					FROM `Corresponsal_Diario_Nuevo` t1
					where
						t1.Fecha = "' . $fecha_actual . '" 
						AND t1.Identificacion_Funcionario = ' . $id . ' 
					group by t1.Identificacion_Funcionario';

            $oCon = new consulta();
            $oCon->setQuery($query_egreso);
            $r2 = $oCon->getData();
            unset($oCon);

            if ($r2 === false) {
                $arr1 = ['Egreso_Total' => '0', "Moneda" => $val['Nombre'], 'Moneda_Id' => $val['Id_Moneda'], 'Codigo' => $val['Codigo'], 'Color' => $color];

                array_push($valores[$modulo], $arr1);
            } else {
                array_push($valores[$modulo], $r2);
            }
        } else {

            $arr = ['Ingreso_Total' => '0', "Moneda" => $val['Nombre'], 'Moneda_Id' => $val['Id_Moneda'], 'Codigo' => $val['Codigo'], 'Color' => $color];
            $arr1 = ['Egreso_Total' => '0', "Moneda" => $val['Nombre'], 'Moneda_Id' => $val['Id_Moneda'], 'Codigo' => $val['Codigo'], 'Color' => $color];
            array_push($valores[$modulo], $arr);
            array_push($valores[$modulo], $arr1);
        }

        $i++;
    }
}

function ConsultarIngresosEgresosServicios($modulo, $id, $fecha_actual)
{

    global $valores, $resultado;

    $i = 0;
    $color = 'ffffff';
    foreach ($resultado['monedas'] as $val) {
        $color = $i % 2 == 0 ? '#87cefa' : "#ffffff";

        if (strtolower($val['Nombre']) == 'pesos') {
            $query_ingreso = '
					SELECT 
						sum(t1.Valor + t1.Comision) as Ingreso_Total,
					    t2.Nombre as Moneda,
					    t2.Codigo as Codigo,
					    t2.Id_Moneda as Moneda_Id,
				    	"' . $color . '" AS Color
					FROM `Servicio` t1
					inner join Moneda t2 on t1.Id_Moneda = t2.Id_Moneda
					where
						t1.Id_Moneda = ' . $val["Id_Moneda"] . '
						AND DATE(t1.Fecha) = "' . $fecha_actual . '" 
                        AND t1.Identificacion_Funcionario = ' . $id . ' 
                        AND t1.Estado = "Activo"
					group by t2.Id_Moneda';

            $oCon = new consulta();
            $oCon->setQuery($query_ingreso);
            $r1 = $oCon->getData();

            unset($oCon);

            if ($r1 === false) {
                $arr = ['Ingreso_Total' => '0', "Moneda" => $val['Nombre'], 'Moneda_Id' => $val['Id_Moneda'], 'Codigo' => $val['Codigo'], 'Color' => $color];

                array_push($valores[$modulo], $arr);
            } else {
                array_push($valores[$modulo], $r1);
            }
        } else {

            $arr = ['Ingreso_Total' => '0', "Moneda" => $val['Nombre'], 'Moneda_Id' => $val['Id_Moneda'], 'Codigo' => $val['Codigo'], 'Color' => $color];
            array_push($valores[$modulo], $arr);
        }

        $arr1 = ['Egreso_Total' => '0', "Moneda" => $val['Nombre'], 'Moneda_Id' => $val['Id_Moneda'], 'Codigo' => $val['Codigo'], 'Color' => $color];
        array_push($valores[$modulo], $arr1);

        $i++;
    }
}
function ConsultarEgresos($modulo, $id, $fecha_actual)
{

    global $valores, $resultado;

    $i = 0;
    $color = 'ffffff';
    foreach ($resultado['monedas'] as $val) {
        $color = $i % 2 == 0 ? '#87cefa' : "#ffffff";

        $query_ingreso = '
					SELECT 
						sum(t1.Valor) as Egreso_Total,
					    t2.Nombre as Moneda,
					    t2.Codigo as Codigo,
					    t2.Id_Moneda as Moneda_Id,
				    	"' . $color . '" AS Color
					FROM `Egreso` t1
					inner join Moneda t2 on t1.Id_Moneda = t2.Id_Moneda
					where
						t1.Id_Moneda = ' . $val["Id_Moneda"] . '
						AND DATE(t1.Fecha) = "' . $fecha_actual . '" 
						AND t1.Identificacion_Funcionario = ' . $id . ' 
					group by t2.Id_Moneda';

        $oCon = new consulta();
        $oCon->setQuery($query_ingreso);
        $r1 = $oCon->getData();

        unset($oCon);


        if (empty($r1)) {
            $arr2 = ['Ingreso_Total' => '0', "Moneda" => $val['Nombre'], 'Moneda_Id' => $val['Id_Moneda'], 'Codigo' => $val['Codigo'], 'Color' => $color];
            array_push($valores[$modulo],  $arr2);
            $arr = ['Egreso_Total' => '0', "Moneda" => $val['Nombre'], 'Moneda_Id' => $val['Id_Moneda'], 'Codigo' => $val['Codigo'], 'Color' => $color];
            array_push($valores[$modulo],  $arr);
        } else {
            $arr2 = ['Ingreso_Total' => '0', "Moneda" => $val['Nombre'], 'Moneda_Id' => $val['Id_Moneda'], 'Codigo' => $val['Codigo'], 'Color' => $color];
            array_push($valores[$modulo],  $arr2);
            array_push($valores[$modulo], $r1);
        }

        $i++;
    }
}

$resultado['monedas'] =  array_values(array_filter($resultado['monedas'], 'is_not_null'));
$resultado['totales_ingresos_egresos'] =  $valores;
// $resultado['totales_ingresos_egresos'] =  array_values(array_filter($resultado['totales_ingresos_egresos'], 'have_valor'));
$resultado['totales_ingresos_egresos'] =  array_filter($resultado['totales_ingresos_egresos'], 'have_valor');

echo json_encode($resultado);

function AgregarColoresMoneda()
{
    global $resultado;

    $i = 0;
    $color = '#ffffff';
    foreach ($resultado['monedas'] as $key => $m) {
        $color = $i % 2 == 0 ? '#f0f8ff' : "#ffffff";
        $resultado['monedas'][$i]['Color'] = $color;
        $i++;
    }
}
