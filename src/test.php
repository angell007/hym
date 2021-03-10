<?php

namespace App\Http\Controllers;

use App\Models\Recaudo;
use App\Models\RecaudoDestinatario;
use App\Models\Tercero;
use App\Models\MovimientoTercero;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\DB;


class RecaudoController extends Controller
{
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {

        $collect = collect([]);
        try {

            $infoModel = request()->get('modelo');
            $transferido = $infoModel['Cantidad_Transferida'];
            $desc = ($infoModel['Observacion_Transferencia'] != '' && $infoModel['Observacion_Transferencia'] != null)  ? $infoModel['Observacion_Transferencia'] : 'Sin observaciones';


            // return response()->json([$infoModel , request()->get('lista')]);

            $destinatarios = [];

            foreach (request()->get('lista') as $cliente) {

                $destinatario =  Tercero::firstWhere('Id_Tercero', $cliente['Numero_Documento_Destino']);

                if ($destinatario == null) {
                    return response()->json(['message' => 'Uno de los destinaraios no se encuentra en el sistema', 'status' => 400]);
                }

                array_push($destinatarios, $destinatario);
            }

            $recaudoData = Recaudo::create([
                'Codigo' => 0,
                'Remitente' =>  $infoModel['Documento_Origen'],
                'Recibido' => $infoModel['Cantidad_Transferida'],
                'Transferido' => 0,
                'Funcionario' => $infoModel['Identificacion_Funcionario'],
                'Comision' => 0,
                'Detalle' => $desc,
                'Estado' => 'Activo'
            ]);

            $recaudoData->codigo = 'RC- ' . $recaudoData->id;
            $recaudoData->save();

            foreach ($destinatarios as $i => $destinatario) {


                $transferido =  $transferido - (float)request()->get('lista')[$i]['Valor_Transferencia'];

                MovimientoTercero::create([
                    'Fecha' => Carbon::now()->format('Y-m-d'),
                    'Valor' =>  (int)request()->get('lista')[$i]['Valor_Transferencia'],
                    'Id_Moneda_Valor' => 2,
                    'Tipo' => 'Ingreso',
                    'Id_Tercero' => $destinatario->Id_Tercero,
                    'Detalle' => $desc,
                    'Id_Tipo_Movimiento' => 8,
                    'Estado' => 'Activo',
                ]);


                MovimientoTercero::create([
                    'Fecha' => Carbon::now()->format('Y-m-d'),
                    'Valor' =>  (int)(request()->get('lista')[$i]['Valor_Transferencia'] * $destinatario->Porcentaje_Recauda) / 100,
                    'Id_Moneda_Valor' => 2,
                    'Tipo' => 'Egreso',
                    'Id_Tercero' => $destinatario->Id_Tercero,
                    'Detalle' => $desc,
                    'Id_Tipo_Movimiento' => 8,
                    'Estado' => 'Activo',
                ]);


                $recaudado =  MovimientoTercero::create([
                    'Fecha' => Carbon::now()->format('Y-m-d'),
                    'Valor' =>  (int)(request()->get('lista')[$i]['Valor_Transferencia'] * $destinatario->Porcentaje_Recauda) / 100,
                    'Id_Moneda_Valor' => 2,
                    'Tipo' => 'Ingreso',
                    'Id_Tercero' => 888888888,
                    'Detalle' => $desc,
                    'Id_Tipo_Movimiento' => 8,
                    'Estado' => 'Activo',
                ]);


                $recaudado =  RecaudoDestinatario::create([
                    'Destinatario_Id' => $destinatario->Id_Tercero,
                    'Recaudo_id' => $recaudoData->id,
                    'Transferido' => (int)request()->get('lista')[$i]['Valor_Transferencia'] - (int)(request()->get('lista')[$i]['Valor_Transferencia'] * $destinatario->Porcentaje_Recauda) / 100,
                    'Comision' => $destinatario->Porcentaje_Recauda,
                    'Original' => (int)request()->get('lista')[$i]['Valor_Transferencia'],
                ]);
            }

            return response()->json(['codigo' => 'success']);
        } catch (\Exception $th) {
            return response()->json(['status' => 400, 'Message' => $th->getMessage()]);
        }
    }

    function GetCodigoMoneda($id_moneda)
    {
        $codigo = Moneda::find($id_moneda, ['Nombre']);
        return $codigo->Nombre;
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Egreso  $egreso
     * @return \Illuminate\Http\Response
     */
    public function destroy(Egreso $egreso)
    {
        //
    }

    public function filtrarTerceros()
    {
        return response()->json('data');
    }

    public function getRecaudos()
    {

        $recaudos = Recaudo::whereHas('remitente', function ($q) {
            $q->when(request()->get('remitente') != 'undefined' && request()->get('remitente') != '',  function ($query) {
                $query->where('Nombre', 'Like',  '%' . request()->get('remitente') . '%');
            });
        })->with(['remitente' => function ($q) {
            $q->when(request()->get('remitente') != 'undefined' && request()->get('remitente') != '',  function ($query) {
                $query->where('Nombre', '%' . request()->get('remitente') . '%');
            });
        }])->when(request()->get('documento') != 'undefined' && request()->get('documento') != '',  function ($q) {
            $q->where('remitente', '%' . request()->get('documento') . '%');
        })
            ->where('Funcionario', request()->get('id_funcionario'))
            ->get();


        return response()->json(['query_data' => $recaudos, 'codigo' => 'success']);
    }



    public function getrecaudoDestinatarios()
    {

        $destinatarios =   DB::Select(
            'SELECT RD.*, Te.* FROM Recaudo 
        INNER JOIN Recaudo_Destinatario RD ON Recaudo.id = RD.Recaudo_Id 
        INNER JOIN Tercero Te ON RD.Destinatario_Id = Te.Id_Tercero 
        WHERE Recaudo.id = ' . request()->get('id')
        );

        return response()->json(compact('destinatarios'));
    }

    public function deleteRecaudo()
    {

        try {

            $recaudo = Recaudo::find(request()->get('id'));

            $destinatarios =   DB::Select(
                'SELECT RD.*, Te.* FROM Recaudo 
        INNER JOIN Recaudo_Destinatario RD ON Recaudo.id = RD.Recaudo_Id 
        INNER JOIN Tercero Te ON RD.Destinatario_Id = Te.Id_Tercero 
        WHERE Recaudo.id = ' . request()->get('id')
            );


            $remitente = DB::Select(
                'SELECT T.* FROM Recaudo 
        INNER JOIN Tercero T ON Recaudo.Remitente = T.Id_Tercero WHERE Recaudo.id = ' . request()->get('id')
            );

            foreach ($destinatarios as $destinatario) {

                MovimientoTercero::create([
                    'Fecha' => Carbon::now()->format('Y-m-d'),
                    'Valor' => $destinatario->Transferido,
                    'Id_Moneda_Valor' => 2,
                    'Tipo' => 'Egreso',
                    'Id_Tercero' => $destinatario->Id_Tercero,
                    'Detalle' => 'Recaudo anulado',
                    'Id_Tipo_Movimiento' => 8,
                    'Estado' => 'Activo',
                ]);


                MovimientoTercero::create([
                    'Fecha' => Carbon::now()->format('Y-m-d'),
                    'Valor' => $destinatario->Transferido - ($destinatario->Comision * $destinatario->Transferido) / 100,
                    'Id_Moneda_Valor' => 2,
                    'Tipo' => 'Ingreso',
                    'Id_Tercero' => 888888888,
                    'Detalle' => 'Recaudo anulado',
                    'Id_Tipo_Movimiento' => 8,
                    'Estado' => 'Activo',
                ]);
            }

            $recaudo->Detalle = 'Recaudo anulado';
            $recaudo->Estado = 'Anulado';
            $recaudo->save();

            return response()->json($recaudo, 200);
        } catch (\Exception $th) {
            return response()->json(['status' => 400, 'Message' => $th->getMessage()]);
        }
    }
}
