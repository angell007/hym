<?php

namespace App\Http\Controllers;

use App\Traits\CierreCajaTraits;

use Illuminate\Support\Facades\DB;

class CalculosController extends Controller
{

    use CierreCajaTraits;

    public $monedas = [];

    function calcularCajeroTotales()
    {

        $this->monedas = $this->getMonedas();

        $FullDatafuncionario = $this->getFullDatafuncionario(1234567891);
        $FullMontos = $this->getFullMontos($FullDatafuncionario);
        $amountTotalByOficina = $this->amountTotalByOficina($FullMontos);

        return response()->json([$FullMontos]);
    }


    function amountTotalByOficina($montosByOficina)
    {

        $montos = [];

        foreach ($montosByOficina as $index => $oficina) {


            foreach ($oficina as $funcionario) {

                foreach ($oficina['Data'] as $temporalData) {
                    foreach ($temporalData['data'] as $data) {

                        $montos[$funcionario['Oficina']] = 0;

                        foreach ($data['Movimientos'] as $movimiento) {

                            $montos[][$temporalData['Nombre']][$funcionario['Funcionario']] +=
                                ($movimiento['Ingreso_Total'] - $movimiento['Egreso_Total']);
                        }
                    }
                }
            }
        }


        $amountTotal = [];
        foreach ($montos as $i => $oficinas) {

            $temporal = [];
            $temporal['Oficina'] = $i;
            $amountTotal[$i] = [];

            foreach ($oficinas as $k => $monedas) {
                $temporal['moneda'] = $k;
                $temporal['valor'] = 0;
                foreach ($monedas  as $subtotal) {
                    $temporal['valor'] += $subtotal;
                }
                array_push($amountTotal[$i], ['Moneda' => $temporal['moneda'], 'Valor' =>  $temporal['valor'], 'Oficina' =>  $temporal['Oficina']]);
            }
        }

        return array_values($amountTotal);
    }

    function getFullMontos($dataFuncionario)
    {

        $montosByFuncionario = [];
        $temp = [];

        foreach ($dataFuncionario['oficinas'] as $index => $oficinas) {

            $this->idOficina = $oficinas['Id_Oficina'];
            $temp[$oficinas['Oficina']] = [];

            foreach ($oficinas['funcionarios'] as  $i => $funcionario) {

                $this->id = $funcionario->Identificacion_Funcionario;

                $temp[$oficinas['Oficina']][] =

                    [
                        'Funcionario_identificacion' => $funcionario->Identificacion_Funcionario,
                        'Funcionario_Nombre' => $funcionario->Nombres,
                        'Funcionario_Apellido' => $funcionario->Apellidos,
                        'data' => $this->getInfo(),
                        'Id_Oficina' => $oficinas['Id_Oficina'],
                        'Oficina' => $oficinas['Oficina']
                    ];
            }

            array_push($montosByFuncionario, ['Oficina' => $oficinas['Oficina'], 'Data' => $temp[$oficinas['Oficina']]]);
        }

        return $montosByFuncionario;
    }


    function getFullDatafuncionario($id)
    {

        $dataFuncionario = [];

        foreach ($this->getOficinasFuncionario($id) as $index => $oficinaDependiente) {

            $dataFuncionario['oficinas'][$index]  =
                [
                    'funcionarios' => $this->getFuncionarios($oficinaDependiente->Id_Oficina),
                    'Oficina' => $oficinaDependiente->Nombre,
                    'Id_Oficina' => $oficinaDependiente->Id_Oficina
                ];
        }

        return $dataFuncionario;
    }

    function getOficinasFuncionario($currentFuncionario)
    {

        return        DB::select('SELECT of.Id_Oficina, of.Nombre From Cajero_Oficina as cof 
                       INNER JOIN Oficina as of ON of.Id_Oficina = cof.Id_Oficina
                       WHERE Id_Cajero = ' . $currentFuncionario);
    }

    function getFuncionarios($oficina)
    {

        return        DB::select('SELECT fun.Identificacion_Funcionario, fun.Nombres, fun.Apellidos From Cajero_Oficina as cof 
                    INNER JOIN Funcionario as fun ON fun.Identificacion_Funcionario = cof.Id_Cajero
                    INNER JOIN Oficina as of ON of.Id_Oficina = cof.Id_Oficina
                    WHERE of.Id_Oficina =  ' . $oficina . '
                    AND (fun.Id_Perfil = 3 or fun.Id_Perfil = 2 or fun.Id_Perfil = 6)');
    }
}
