<?php

namespace App\Http\Controllers;

use App\Models\Cambio;
use App\Models\CorresponsalDiario;
use App\Models\Diario;
use App\Models\DiarioMonedaCierre;
use App\Models\Giro;
use App\Models\Moneda;
use App\Models\Servicio;
use App\Models\Transferencia;
use App\Models\TrasladoCaja;
use App\Models\Egreso;
use App\Models\Otrotraslado;


use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class FlujoEfectivoController extends Controller
{
    public $id = '';
    public $result = [];

    public $fecha_inicio;
    public $fecha_fin;


    //Oficinas del sistema

    function getFuncionarios($oficina)
    {

        $inicio =  $this->fecha_inicio->format('Y-m-d');
        $fin = $this->fecha_fin->format('Y-m-d');

        return DB::select(
            "SELECT fun.Identificacion_Funcionario FROM Diario as dia
                                                        INNER JOIN Funcionario as fun ON fun.Identificacion_Funcionario = dia.Id_Funcionario
                                                        INNER JOIN Oficina as of On of.Id_Oficina = dia.Oficina_Apertura
                                                        WHERE of.Id_Oficina = $oficina
                                                        AND  dia.Fecha >= '$inicio'
                                                        AND  dia.Fecha <= '$fin'
                                                       
                                                        "
        );
    }

    function getOficinasFuncionario()
    {

        return DB::select('SELECT Id_Oficina From Oficina');
    }


    function getFullDatafuncionario()
    {
        $this->fecha_fin = Carbon::now();
        $this->fecha_inicio = Carbon::now();

        if (request()->has('Fecha_fin')) {

            $this->fecha_fin = Carbon::parse(request()->get('Fecha_fin'));
        }

        if (request()->has('Fecha_inicio')) {

            $this->fecha_inicio = Carbon::parse(request()->get('Fecha_inicio'));
        }

        $dataFuncionario = [];

        foreach ($this->getOficinasFuncionario() as $index => $oficinaDependiente) {

            array_push($dataFuncionario, $this->getFuncionarios($oficinaDependiente->Id_Oficina));
        }

        return $dataFuncionario;
    }


    public function  getInfo()
    {

        $funcionarios = [];

        foreach ($this->getOficinasFuncionario() as $ofi) {
            $data = $this->getFullDatafuncionario($ofi);
            foreach ($data as $ofi) {
                if (count($ofi) > 0) {
                    foreach ($ofi as $fun) {
                        array_push($funcionarios, $fun->Identificacion_Funcionario);
                    }
                }
            }
        }


        // $funcionarios = [9999999, 1524854];

        $funcionarios = [1524854, 9999999];
        $modulos = ['Transferencias', 'Cambios'];

        $cambiosI = 0;
        $cambiosE = 0;

        $this->id = request()->get("id");
        $Monedas = $this->getMonedas();
        $resultado = collect();


        foreach ($Monedas as $moneda) {

            $data["Nombre"] = $moneda->Nombre;
            $data["Codigo"] = $moneda->Codigo;
            $data["Id"] = $moneda->Id_Moneda;

            $cambios = [];
            $transferencias = [];
            $giros = [];
            $traslados = [];
            $corresponsal = [];
            $servicios = [];
            $egresos = [];
            $otros = [];


            foreach ($funcionarios as $funcionario) {

                $this->id =  $funcionario;
                $cambios[] = $this->ConsultarIngresosEgresosCambios($moneda->Id_Moneda);
            }
            foreach ($funcionarios as $funcionario) {

                $this->id =  $funcionario;
                $transferencias[] = $this->ConsultarIngresosEgresosTransferencias($moneda->Id_Moneda);
            }
            foreach ($funcionarios as $funcionario) {

                $this->id =  $funcionario;
                $giros[] = $this->ConsultarIngresosEgresosGiros($moneda->Id_Moneda);
            }
            foreach ($funcionarios as $funcionario) {

                $this->id =  $funcionario;
                $traslados[] = $this->ConsultarIngresosEgresosTraslados($moneda->Id_Moneda);
            }
            foreach ($funcionarios as $funcionario) {

                $this->id =  $funcionario;
                $corresponsal[] = $this->ConsultarIngresosEgresosCorresponsal($moneda->Id_Moneda);
            }
            foreach ($funcionarios as $funcionario) {
                $this->id =  $funcionario;
                $servicios[] = $this->ConsultarIngresosEgresosServicios($moneda->Id_Moneda);
            }
            foreach ($funcionarios as $funcionario) {
                $this->id =  $funcionario;
                $egresos[] = $this->ConsultarEgresos($moneda->Id_Moneda);
            }
            foreach ($funcionarios as $funcionario) {
                $this->id =  $funcionario;
                $otros[] = $this->ConsultarIngresosOtrosTraslados($moneda->Id_Moneda);
            }



            $data['mov'] = [];

            array_push($data['mov'],  ['Nombre' => 'Cambio', 'Total' =>  collect($cambios)->sum('Ingreso_Total') - collect($cambios)->sum('Egreso_Total')]);
            array_push($data['mov'],  ['Nombre' => 'Transferencia', 'Total' => collect($transferencias)->sum('Ingreso_Total') - collect($transferencias)->sum('Egreso_Total')]);
            array_push($data['mov'],  ['Nombre' => 'Giros', 'Total' => collect($giros)->sum('Ingreso_Total') - collect($giros)->sum('Egreso_Total')]);
            array_push($data['mov'],  ['Nombre' => 'Traslados', 'Total' => collect($traslados)->sum('Ingreso_Total') - collect($traslados)->sum('Egreso_Total')]);
            array_push($data['mov'],  ['Nombre' => 'Corresponsal', 'Total' => collect($corresponsal)->sum('Ingreso_Total') - collect($corresponsal)->sum('Egreso_Total')]);
            array_push($data['mov'],  ['Nombre' => 'Servicios', 'Total' => collect($servicios)->sum('Ingreso_Total') - collect($servicios)->sum('Egreso_Total')]);
            array_push($data['mov'],  ['Nombre' => 'Egresos', 'Total' => collect($egresos)->sum('Ingreso_Total') - collect($egresos)->sum('Egreso_Total')]);
            array_push($data['mov'],  ['Nombre' => 'Otros', 'Total' => collect($otros)->sum('Ingreso_Total') - collect($otros)->sum('Egreso_Total')]);


            $resultado->push($data);
        }

        return response()->json($resultado);
    }

    public function ConsultarIngresosEgresosCambios($Id_Moneda)
    {


        $cambios = Cambio::where(function ($q) use ($Id_Moneda) {
            $q->where('Moneda_Destino',  $Id_Moneda)
                ->orWhere('Moneda_Origen',  $Id_Moneda);
        })
            ->whereDate("Fecha", $this->getFecha())
            ->where('Identificacion_Funcionario', $this->id)
            ->select(
                DB::raw("
                IFnull(SUM(
                Case
                WHEN Tipo = 'Compra' AND Moneda_Origen = $Id_Moneda AND Estado <> 'Anulado' AND Valor_Origen  IS NOT NULL  THEN 
                Valor_Origen
                Else 0
                END
                )
                +
                SUM(
                Case
                WHEN Tipo = 'Venta' AND fomapago_id <> 3 
                AND Moneda_Origen = $Id_Moneda AND Estado <> 'Anulado' AND Valor_Origen IS NOT NULL  THEN 
                Valor_Origen -  IfNull((SELECT SUM(dv.valor_entregado) From Devolucion_Cambios dv WHERE dv.cambio_id = Id_Cambio), 0) 
                Else 0
                END
                ), 0) As Ingreso_Total
                "),
                DB::raw("
                IFnull(SUM( Case
                WHEN Tipo = 'Compra' AND fomapago_id <> 3 AND Moneda_Destino = $Id_Moneda AND Estado <> 'Anulado' AND Valor_Destino IS NOT NULL  THEN 
                Valor_Destino
                Else 0
                END
                )
                +
                SUM(
                Case
                WHEN Tipo = 'Venta'  AND Moneda_Destino = $Id_Moneda AND Estado <> 'Anulado' AND Valor_Destino IS NOT NULL   THEN 
                Valor_Destino - IfNull((SELECT SUM(dv.valor_recibido) From Devolucion_Cambios dv WHERE dv.cambio_id = Id_Cambio), 0) 
                Else 0
                END
                ), 0)  As Egreso_Total
                "),
                DB::raw("'Cambios' as Nombre")
            )->first();


        return (!$cambios) ? ['Ingreso_Total' => '0', 'Nombre' => 'Cambios', 'Egreso_Total' => '0'] : $cambios;
    }



    public function ConsultarIngresosEgresosTransferencias($Id_Moneda)
    {

        $transferencias =   Transferencia::where('Moneda_Origen', $Id_Moneda)
            ->whereDate("Fecha", $this->getFecha())
            ->where('Identificacion_Funcionario', $this->id)
            ->whereIn('Estado',  ['Activa', 'Pagada'])
            ->select(
                DB::raw("Sum(IF(Forma_Pago <> 'Credito' AND Forma_Pago <> 'Consignacion',Cantidad_Recibida, 0 )) AS Ingreso_Total, 'Transferencias' as Nombre"),
                DB::raw('0 AS Egreso_Total')
            )
            ->groupByRaw('Moneda_Origen')
            ->first();


        return (!$transferencias) ? ['Ingreso_Total' => '0', 'Nombre' => 'Transferencias', 'Egreso_Total' => '0'] : $transferencias;
    }


    public function ConsultarIngresosEgresosGiros($Id_Moneda)
    {

        $giros =   Giro::where('Id_Moneda', $Id_Moneda)
            ->whereDate('Fecha', $this->getFecha())
            ->select(
                DB::raw("IfNull(Sum(CASE WHEN Estado <> 'Anulado' AND Identificacion_Funcionario = $this->id THEN Valor_Total Else 0 END), 0) AS Ingreso_Total"),
                DB::raw("IfNull(Sum(CASE WHEN Estado = 'Pagado' AND Funcionario_Pago = $this->id THEN Valor_Entrega Else 0 END), 0) AS Egreso_Total"),
                DB::raw("'Giros' as Nombre")
            )->first();

        return (!$giros) ? ['Ingreso_Total' => '0', 'Nombre' => 'Giros', 'Egreso_Total' => '0'] :  $giros;
    }

    public function ConsultarIngresosEgresosTraslados($Id_Moneda)
    {


        $Ingreso_Total = TrasladoCaja::where('Id_Moneda', $Id_Moneda)
            ->whereDate('Fecha_Traslado', Carbon::now()->format('Y-m-d'))->where('Funcionario_Destino', $this->id)
            ->select(DB::raw('IF(sum(Valor) > 0, sum(Valor), 0) As Ingreso_Total'))
            ->groupByRaw('Id_Moneda')
            ->where('Estado', 'Aprobado')
            ->first();


        $Egreso_Total = TrasladoCaja::where('Id_Moneda', $Id_Moneda)
            ->whereDate('Fecha_Traslado', Carbon::now()->format('Y-m-d'))->where('Id_Cajero_Origen', $this->id)
            ->select(DB::raw('IF(sum(Valor) > 0, sum(Valor), 0) As Egreso_Total'))
            ->groupByRaw('Id_Moneda')
            ->where('Estado', 'Aprobado')
            ->first();


        return  [
            'Ingreso_Total' => ($Ingreso_Total == null) ? 0 : $Ingreso_Total['Ingreso_Total'],
            'Egreso_Total'  => ($Egreso_Total == null) ? 0 : $Egreso_Total['Egreso_Total'],
            'Nombre' => 'Traslados'
        ];
    }

    public function ConsultarIngresosEgresosCorresponsal($Id_Moneda)
    {

        $corresponsales =   CorresponsalDiario::where('Id_Moneda', $Id_Moneda)

            ->whereDate('Fecha', $this->getFecha())
            ->where('Identificacion_Funcionario', $this->id)
            ->select(
                DB::raw('IF(sum(Consignacion) > 0, sum(Consignacion), 0) AS Ingreso_Total,  "Corresponsal" as Nombre'),
                DB::raw('IF(sum(Retiro) > 0, sum(Retiro), 0) AS Egreso_Total')
            )
            ->groupByRaw('Id_Moneda')
            ->first();

        return (!$corresponsales) ?  ['Ingreso_Total' => '0', 'Nombre' => 'Corresponsal', 'Egreso_Total' => '0'] : $corresponsales;
    }

    public function ConsultarIngresosEgresosServicios($Id_Moneda)
    {

        $Ingreso_Total =   Servicio::where('Id_Moneda', $Id_Moneda)

            ->whereDate('Fecha', $this->getFecha())
            ->where('Identificacion_Funcionario', $this->id)
            ->where('Estado', '!=', 'Anulado')
            ->select(
                DB::raw('IF(sum(Valor + Comision) > 0, sum(Valor + Comision), 0) AS Ingreso_Total')

            )
            ->groupByRaw('Id_Moneda')
            ->first();

        $Egreso_Total =   Servicio::where('Id_Moneda', $Id_Moneda)

            ->whereDate('Fecha_Pago', $this->getFecha())
            ->where('Id_Funcionario_Destino', $this->id)
            ->where('Estado', 'Pagado')
            ->select(
                DB::raw('IF(sum(Valor + Comision) > 0, sum(Valor + Comision), 0) AS Egreso_Total')

            )
            ->groupByRaw('Id_Moneda')
            ->first();


        return  [
            'Ingreso_Total' => ($Ingreso_Total == null) ? 0 : $Ingreso_Total['Ingreso_Total'],
            'Egreso_Total'  => ($Egreso_Total == null) ? 0 : $Egreso_Total['Egreso_Total'],
            'Nombre' => 'Servicios'
        ];
    }

    public function ConsultarEgresos($Id_Moneda)
    {
        $egresos =   Egreso::where('Id_Moneda', $Id_Moneda)

            ->whereDate('Fecha', $this->getFecha())
            ->where('Identificacion_Funcionario', $this->id)
            ->where('Estado', '<>', 'Anulado')
            ->select(

                DB::raw('0 AS Ingreso_Total'),
                DB::raw('SUM(Valor) AS Egreso_Total, "Egresos" as Nombre ')
            )
            ->groupByRaw('Id_Moneda')
            ->first();

        return (!$egresos) ? ['Ingreso_Total' => '0', 'Nombre' => 'Egresos', 'Egreso_Total' => '0'] :  $egresos;
    }


    public function ConsultarIngresosOtrosTraslados($Id_Moneda)
    {
        $otrosTraslados =   Otrotraslado::where('Id_Moneda', $Id_Moneda)
            ->where('Id_Cajero', $this->id)
            ->whereDate('Fecha', $this->getFecha())
            ->select(

                DB::raw('0 AS Egreso_Total'),
                DB::raw('SUM(Valor) AS Ingreso_Total, "OtrosTraslados" as Nombre ')
            )
            ->groupByRaw('Id_Moneda')
            ->first();

        return (!$otrosTraslados) ? ['Ingreso_Total' => '0', 'Nombre' => 'OtrosTraslados', 'Egreso_Total' => '0'] :  $otrosTraslados;
    }


    public function getMonedas()
    {
        return Moneda::where('Estado', 'Activa')->get();
    }

    public function getFecha()
    {
        return Carbon::now()->format('Y-m-d');
    }
}
