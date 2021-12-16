<!DOCTYPE html>
<html>

<head>
    <title>Recibo</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="description" content="" />
    <meta name="author" content="francesc ricart" />
</head>

<body>
    <div>
        <div style="width:100% !important;max-width: 5cm !important;text-align:center;">

            <p style="margin: 0;font-family: \'Open Sans Condensed\', sans-serif;font-size: 11px;text-transform: uppercase;">
                {{$company->Nombre_Empresa}}
            </p>

            <p style="margin: 0;font-family: \'Open Sans Condensed\', sans-serif;font-size: 11px;">NIT:
                {{$company->NIT}}
            </p>

            <p style="margin: 0;font-family: \'Open Sans Condensed\', sans-serif;font-size: 11px; color: #333;">
                {{$egreso->Lema}}
            </p>

            <p style="margin: 0;font-family: \'Open Sans Condensed\', sans-serif;font-size: 10px; font-weight:bold ">
                    Elaborado por : {{$egreso->full_name}}</p>

        </div>

        <div style="width:100% !important;max-width: 5cm !important;">

            <br>
            <br>

            <span style="margin: 0;font-family: \'Open Sans Condensed\', sans-serif;font-size: 12px;float: left;">Recibo Nº:
            </span>
            <span style="margin: 0;font-family: \'Open Sans Condensed\', sans-serif;font-size: 12px;float: right;">{{$egreso->Codigo}}</span><br>

            <span style="margin: 0;font-family: \'Open Sans Condensed\', sans-serif;font-size: 12px;float: left;">Fecha: </span>
            <span style="margin: 0;font-family: \'Open Sans Condensed\', sans-serif;font-size: 12px;float: right;">
                {{\Carbon\Carbon::parse($egreso->Fecha)->format('Y-m-d')}}
            </span><br>
            <span style="margin: 0;font-family: \'Open Sans Condensed\', sans-serif;font-size: 12px;float: left;">Oficina:
            </span>
            <span style="margin: 0;font-family: \'Open Sans Condensed\', sans-serif;font-size: 12px;float: right;">{{$egreso->NombreOficina}}</span><br>

            <span style="margin: 0;font-family: \'Open Sans Condensed\', sans-serif;font-size: 12px;float: left;">Telefono
                Oficina: </span>
            <span style="margin: 0;font-family: \'Open Sans Condensed\', sans-serif;font-size: 12px;float: right;">{{$egreso->TelefonoOficina}}</span><br>

            <span style="margin: 0;font-family: \'Open Sans Condensed\', sans-serif;font-size: 12px;float: left;">Entregado a:
            </span>
            <br>
            <span style="margin: 0;font-family: \'Open Sans Condensed\', sans-serif;font-size: 12px;float: right;">{{$egreso->Nombre}}</span>
            <br>
            <!-- <span style="margin: 0;font-family: \'Open Sans Condensed\', sans-serif;font-size: 12px;float: left;">Telefono:
            </span>
            <span style="margin: 0;font-family: \'Open Sans Condensed\', sans-serif;font-size: 12px;float: right;">{{$egreso->TelefonoCliente}}</span>
            <br> -->

            <span style="margin: 0;font-family: \'Open Sans Condensed\', sans-serif;font-size: 12px;float: left;">Forma de pago:</span>
            <span style="margin: 0;font-family: \'Open Sans Condensed\', sans-serif;font-size: 12px;float: right;">Efectivo</span>


            <br>
            <span style="margin: 0;font-family: \'Open Sans Condensed\', sans-serif;font-size: 12px;float: left;">Concepto:</span>
            <span style="margin: 0;font-family: \'Open Sans Condensed\', sans-serif;font-size: 12px;float: right;">{{$egreso->Detalle}}</span>

            <br>
            <br>

            <p style="margin: 0;font-family: \'Open Sans Condensed\', sans-serif;font-size: 12px; font-weight: bold">
                Egreso
               </p>
            <br>


            <span style="margin: 0;font-family: \'Open Sans Condensed\', sans-serif;font-size: 12px;float: left;">Valor
               Egresado</span>
            <span style="margin: 0;font-family: \'Open Sans Condensed\', sans-serif;font-size: 12px;float: right;"> $ {{$egreso->MdCodigo .  ' ' .  number_format($egreso->Valor_Destino, 0, ',', '.') }}</span><br>

        </div>

        <br>
        <br>

        <p style="width:100% !important;max-width: 5cm !important;text-align:center;font-size: 12px;float: left;">
            <strong><small>{{$egreso->Footer}}</small></strong>
        </p>

    </div>

</body>

</html>