
import { Component, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { ThemeConstants } from '../../shared/config/theme-constant';

import '../../../assets/charts/amchart/amcharts.js';
import '../../../assets/charts/amchart/gauge.js';
import '../../../assets/charts/amchart/pie.js';
import '../../../assets/charts/amchart/serial.js';
import '../../../assets/charts/amchart/light.js';
import '../../../assets/charts/amchart/ammap.js';
import '../../../assets/charts/amchart/worldLow.js';
import '../../../assets/charts/amchart/continentsLow.js';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../shared/globales/globales';
import { NgForm } from '@angular/forms';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
declare const AmCharts: any;

@Component({
  selector: 'app-tablerogerencia',
  templateUrl: './tablerogerencia.component.html',
  styleUrls: ['./tablerogerencia.component.scss']
})

export class TablerogerenciaComponent {

  constructor(private http: HttpClient, private globales: Globales) {}

  Municipios: any = [];
  Oficina: any = [];
  CajerosAbiertos: any = [];
  Funcionarios: any = [];
  botonVolver = false;
  fechaHoy = "";
  
  public entregadoPesos:any = '';
  public entregadoBolivar:any = '';
  public diferenciaPesos:any = '';
  public diferenciaBolivar:any = '';
  public fajosPesos:any = [];
  public fajosBolivares:any = [];

  @ViewChild('CierreCaja') CierreCaja: any;
  ngOnInit() {
    this.http.get(this.globales.ruta + 'php/gerencia/movimentos_fechas.php').subscribe((data: any) => {
      this.Municipios = data;
    });

    this.http.get(this.globales.ruta + '/php/genericos/lista_generales.php', {
      params: { modulo: "Oficina" }
    }).subscribe((data: any) => {
      this.Oficina = data;
    });

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    var hoy = yyyy + '-' + mm + '-' + dd;
    (document.getElementById("datefield") as HTMLInputElement).setAttribute("max", hoy);
    this.fechaHoy = hoy;

    this.http.get(this.globales.ruta + 'php/gerencia/cajeros_abiertos.php').subscribe((data: any) => {
      this.CajerosAbiertos = data;
    });

    this.http.get(this.globales.ruta + 'php/cierreCaja/cierre_caja_general.php').subscribe((data: any) => {

      var ingresos = data.Ingresos;
      var egresos = data.Egresos;
      this.totalIngresosPesos = data.TotalIngresosPesos;
      this.totalIngresosBolivares = data.TotalIngresosBolivares;
      this.TotalEgresosPesos = data.TotalEgresosPesos;
      this.TotalEgresosBolivares = data.TotalEgresosBolivares;

      if (data.SaldoInicial[0]) {
        this.SaldoInicialPesos = data.SaldoInicial[0].Monto_Inicio;
        this.SaldoInicialBolivares = data.SaldoInicial[0].Monto_Inicio_Bolivar;
        this.EntregadoIngresosPesos = Number(this.SaldoInicialPesos) + Number(this.totalIngresosPesos) - Number(this.TotalEgresosPesos);
        this.EntregadoIngresosBolivar = Number(this.SaldoInicialBolivares) + Number(this.totalIngresosBolivares) - Number(this.TotalEgresosBolivares);
      }

      ingresos.forEach(element => {
        if (element.modulo == "Cambios") { this.CambiosIngresos.push(element) }
        if (element.modulo == "Transferencia") { this.TransferenciaIngresos.push(element) }
        if (element.modulo == "Giro") { this.GiroIngresos.push(element) }
        if (element.modulo == "Traslado") { this.TrasladoIngresos.push(element) }
        if (element.modulo == "Corresponsal") { this.CorresponsalIngresos.push(element) }
        if (element.modulo == "Servicio") { this.ServicioIngresos.push(element) }
      });

      egresos.forEach(element => {
        if (element.modulo == "Cambios") { this.CambiosEgresos.push(element) }
        if (element.modulo == "Giro") { this.GiroEgresos.push(element) }
        if (element.modulo == "Traslado") { this.TrasladoEgresos.push(element) }
      });

      if (this.CambiosIngresos[0]) {
        var index = this.CambiosIngresos.findIndex(x => x.Moneda_Origen === "Bolivares");
        var index1 = this.CambiosIngresos.findIndex(x => x.Moneda_Origen === "Pesos");
        if (index1 > -1) {
          this.ingresoCambio = this.CambiosIngresos[index1].Ingreso
        }

        if (index > -1) {
          this.ingresoCambioBolivar = this.CambiosIngresos[index].Ingreso;
        }

      }
      if (this.TransferenciaIngresos[0]) { this.ingresoTransferencia = this.TransferenciaIngresos[0].Ingreso }
      if (this.GiroIngresos[0]) { this.ingresoGiro = this.GiroIngresos[0].Ingreso; this.GiroComision = this.GiroIngresos[0].Comision }
      if (this.TrasladoIngresos[0]) {
        var index = this.TrasladoIngresos.findIndex(x => x.Moneda_Origen === "Bolivares");
        var index1 = this.TrasladoIngresos.findIndex(x => x.Moneda_Origen === "Pesos");
        if (index1 > -1) {
          this.ingresoTraslado = this.TrasladoIngresos[index1].Ingreso
        }

        if (index > -1) {
          this.ingresoTrasladoBolivar = this.TrasladoIngresos[index].Ingreso;
        }
      }
      if (this.CorresponsalIngresos[0]) { this.ingresoCorresponsal = this.CorresponsalIngresos[0].Ingreso }
      if (this.ServicioIngresos[0]) { this.ingresoServicio = this.ServicioIngresos[0].Ingreso }

      if (this.CambiosEgresos[0]) {

        var index = this.CambiosEgresos.findIndex(x => x.Moneda_Destino === "Bolivares");
        var index1 = this.CambiosEgresos.findIndex(x => x.Moneda_Destino === "Pesos");
        if (index1 > -1) {
          this.egresoCambio = this.CambiosEgresos[index1].Egreso
        }

        if (index > -1) {
          this.egresoCambioBolivar = this.CambiosEgresos[index].Egreso;
        }
      }
      if (this.GiroEgresos[0]) {

        var index = this.GiroEgresos.findIndex(x => x.Moneda_Destino === "Bolivares");
        var index1 = this.GiroEgresos.findIndex(x => x.Moneda_Destino === "Pesos");
        if (index1 > -1) {
          this.egresoGiro = this.GiroEgresos[index1].Egreso
        }

        if (index > -1) {
          this.egresoGiroBolivar = this.GiroEgresos[index].Egreso;
        }
      }
      if (this.TrasladoEgresos[0]) {

        var index = this.TrasladoEgresos.findIndex(x => x.Moneda_Destino === "Bolivares");
        var index1 = this.TrasladoEgresos.findIndex(x => x.Moneda_Destino === "Pesos");
        if (index1 > -1) {
          this.egresoTraslado = this.TrasladoEgresos[index1].Egreso
        }

        if (index > -1) {
          this.egresoTrasladoBolivar = this.TrasladoEgresos[index].Egreso;
        }
      }

    });

    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Funcionario' } }).subscribe((data: any) => {
      this.Funcionarios = data;
    });

  }


  totalIngresosPesos = 0;
  totalIngresosBolivares = 0;
  TotalEgresosPesos = 0;
  TotalEgresosBolivares = 0;
  SaldoInicialPesos = 0;
  SaldoInicialBolivares = 0;
  EntregadoIngresosBolivar = 0;
  ingresoCambioBolivar = 0;
  egresoCambioBolivar = 0;
  egresoGiroBolivar = 0;
  egresoTrasladoBolivar = 0;
  ingresoTrasladoBolivar = 0;
  GiroComision: any = 0;

  CambiosIngresos: any = [];
  TransferenciaIngresos: any = [];
  GiroIngresos: any = [];
  TrasladoIngresos: any = [];
  CorresponsalIngresos: any = [];
  ServicioIngresos: any = [];
  CambiosEgresos: any = [];
  GiroEgresos: any = [];
  TrasladoEgresos: any = [];

  SumaIngresosPesos: number = 0;
  SumaIngresosBolivar: number = 0;
  SumaEgresosPesos: number = 0;
  SumaEgresosBolivar: number = 0;
  EntregadoIngresosPesos: number = 0;
  EntregadoIngresosBolivares: number = 0;
  EntregadoEgresosBolivares: number = 0;

  ingresoCambio: number = 0;
  ingresoTransferencia: number = 0;
  ingresoGiro: number = 0;
  ingresoTraslado: number = 0;
  ingresoCorresponsal: number = 0;
  ingresoServicio: number = 0;

  egresoCambio: number = 0;
  egresoGiro: number = 0;
  egresoTraslado: number = 0;
  funcionario: any = "";
  Titulo: any = "";

  MirarMovimientos(funcionario) {

    this.CambiosIngresos = [];
    this.TransferenciaIngresos = [];
    this.GiroIngresos = [];
    this.TrasladoIngresos = [];
    this.CorresponsalIngresos = [];
    this.ServicioIngresos = [];
    this.CambiosEgresos = [];
    this.GiroEgresos = [];
    this.TrasladoEgresos = [];
    this.totalIngresosPesos = 0;
    this.totalIngresosBolivares = 0;
    this.TotalEgresosPesos = 0;
    this.TotalEgresosBolivares = 0;
    this.SaldoInicialPesos = 0;
    this.SaldoInicialBolivares = 0;
    this.EntregadoIngresosBolivar = 0;
    this.ingresoCambioBolivar = 0;
    this.egresoCambioBolivar = 0;
    this.egresoGiroBolivar = 0;
    this.egresoTrasladoBolivar = 0;
    this.ingresoTrasladoBolivar = 0;
    this.GiroComision = 0;

    this.ingresoCambio = 0;
    this.ingresoCambioBolivar = 0;
    this.ingresoTransferencia = 0;
    this.ingresoTraslado=0;
    this.egresoTraslado = 0;
    this.totalIngresosPesos = 0;
    this.egresoCambio = 0;
    this.egresoCambioBolivar = 0;
    this.ingresoCorresponsal =0;
    this.EntregadoIngresosPesos=0;


    if (this.Fecha != "") {
      this.http.get(this.globales.ruta + 'php/cierreCaja/Cierre_Caja_V2.php', { params: { id: funcionario , fecha:this.Fecha } }).subscribe((data: any) => {

        var ingresos = data.Ingresos;
        var egresos = data.Egresos;
        this.totalIngresosPesos = data.TotalIngresosPesos;
        this.totalIngresosBolivares = data.TotalIngresosBolivares;
        this.TotalEgresosPesos = data.TotalEgresosPesos;
        this.TotalEgresosBolivares = data.TotalEgresosBolivares;

        if (data.SaldoInicial[0]) {
          this.SaldoInicialPesos = data.SaldoInicial[0].Monto_Inicio;
          this.SaldoInicialBolivares = data.SaldoInicial[0].Monto_Inicio_Bolivar;
          this.EntregadoIngresosPesos = Number(this.SaldoInicialPesos) + Number(this.totalIngresosPesos) - Number(this.TotalEgresosPesos);
          this.EntregadoIngresosBolivar = Number(this.SaldoInicialBolivares) + Number(this.totalIngresosBolivares) - Number(this.TotalEgresosBolivares);
        }

        ingresos.forEach(element => {
          if (element.modulo == "Cambios") { this.CambiosIngresos.push(element) }
          if (element.modulo == "Transferencia") { this.TransferenciaIngresos.push(element) }
          if (element.modulo == "Giro") { this.GiroIngresos.push(element) }
          if (element.modulo == "Traslado") { this.TrasladoIngresos.push(element) }
          if (element.modulo == "Corresponsal") { this.CorresponsalIngresos.push(element) }
          if (element.modulo == "Servicio") { this.ServicioIngresos.push(element) }
        });

        egresos.forEach(element => {
          if (element.modulo == "Cambios") { this.CambiosEgresos.push(element) }
          if (element.modulo == "Giro") { this.GiroEgresos.push(element) }
          if (element.modulo == "Traslado") { this.TrasladoEgresos.push(element) }
        });

        if (this.CambiosIngresos[0]) {
          var index = this.CambiosIngresos.findIndex(x => x.Moneda_Origen === "Bolivares");
          var index1 = this.CambiosIngresos.findIndex(x => x.Moneda_Origen === "Pesos");
          if (index1 > -1) {
            this.ingresoCambio = this.CambiosIngresos[index1].Ingreso
          }

          if (index > -1) {
            this.ingresoCambioBolivar = this.CambiosIngresos[index].Ingreso;
          }

        }
        if (this.TransferenciaIngresos[0]) { this.ingresoTransferencia = this.TransferenciaIngresos[0].Ingreso }
        if (this.GiroIngresos[0]) { this.ingresoGiro = this.GiroIngresos[0].Ingreso; this.GiroComision = this.GiroIngresos[0].Comision }
        if (this.TrasladoIngresos[0]) {
          var index = this.TrasladoIngresos.findIndex(x => x.Moneda_Origen === "Bolivares");
          var index1 = this.TrasladoIngresos.findIndex(x => x.Moneda_Origen === "Pesos");
          if (index1 > -1) {
            this.ingresoTraslado = this.TrasladoIngresos[index1].Ingreso
          }

          if (index > -1) {
            this.ingresoTrasladoBolivar = this.TrasladoIngresos[index].Ingreso;
          }
        }
        if (this.CorresponsalIngresos[0]) { this.ingresoCorresponsal = this.CorresponsalIngresos[0].Ingreso }
        if (this.ServicioIngresos[0]) { this.ingresoServicio = this.ServicioIngresos[0].Ingreso }

        if (this.CambiosEgresos[0]) {

          var index = this.CambiosEgresos.findIndex(x => x.Moneda_Destino === "Bolivares");
          var index1 = this.CambiosEgresos.findIndex(x => x.Moneda_Destino === "Pesos");
          if (index1 > -1) {
            this.egresoCambio = this.CambiosEgresos[index1].Egreso
          }

          if (index > -1) {
            this.egresoCambioBolivar = this.CambiosEgresos[index].Egreso;
          }
        }
        if (this.GiroEgresos[0]) {

          var index = this.GiroEgresos.findIndex(x => x.Moneda_Destino === "Bolivares");
          var index1 = this.GiroEgresos.findIndex(x => x.Moneda_Destino === "Pesos");
          if (index1 > -1) {
            this.egresoGiro = this.GiroEgresos[index1].Egreso
          }

          if (index > -1) {
            this.egresoGiroBolivar = this.GiroEgresos[index].Egreso;
          }
        }
        if (this.TrasladoEgresos[0]) {

          var index = this.TrasladoEgresos.findIndex(x => x.Moneda_Destino === "Bolivares");
          var index1 = this.TrasladoEgresos.findIndex(x => x.Moneda_Destino === "Pesos");
          if (index1 > -1) {
            this.egresoTraslado = this.TrasladoEgresos[index1].Egreso
          }

          if (index > -1) {
            this.egresoTrasladoBolivar = this.TrasladoEgresos[index].Egreso;
          }
        }

        var index2 = this.Funcionarios.findIndex(x=>x.Identificacion_Funcionario === funcionario);
        this.Titulo = " De " + this.Funcionarios[index2].Nombres + " " + this.Funcionarios[index2].Apellidos;
        this.botonVolver = true;

      });
    } else {
      this.http.get(this.globales.ruta + 'php/cierreCaja/Cierre_Caja_V2.php', { params: { id: funcionario } }).subscribe((data: any) => {

        var ingresos = data.Ingresos;
        var egresos = data.Egresos;
        this.totalIngresosPesos = data.TotalIngresosPesos;
        this.totalIngresosBolivares = data.TotalIngresosBolivares;
        this.TotalEgresosPesos = data.TotalEgresosPesos;
        this.TotalEgresosBolivares = data.TotalEgresosBolivares;

        if (data.SaldoInicial[0]) {
          this.SaldoInicialPesos = data.SaldoInicial[0].Monto_Inicio;
          this.SaldoInicialBolivares = data.SaldoInicial[0].Monto_Inicio_Bolivar;
          this.EntregadoIngresosPesos = Number(this.SaldoInicialPesos) + Number(this.totalIngresosPesos) - Number(this.TotalEgresosPesos);
          this.EntregadoIngresosBolivar = Number(this.SaldoInicialBolivares) + Number(this.totalIngresosBolivares) - Number(this.TotalEgresosBolivares);
        }

        ingresos.forEach(element => {
          if (element.modulo == "Cambios") { this.CambiosIngresos.push(element) }
          if (element.modulo == "Transferencia") { this.TransferenciaIngresos.push(element) }
          if (element.modulo == "Giro") { this.GiroIngresos.push(element) }
          if (element.modulo == "Traslado") { this.TrasladoIngresos.push(element) }
          if (element.modulo == "Corresponsal") { this.CorresponsalIngresos.push(element) }
          if (element.modulo == "Servicio") { this.ServicioIngresos.push(element) }
        });

        egresos.forEach(element => {
          if (element.modulo == "Cambios") { this.CambiosEgresos.push(element) }
          if (element.modulo == "Giro") { this.GiroEgresos.push(element) }
          if (element.modulo == "Traslado") { this.TrasladoEgresos.push(element) }
        });

        if (this.CambiosIngresos[0]) {
          var index = this.CambiosIngresos.findIndex(x => x.Moneda_Origen === "Bolivares");
          var index1 = this.CambiosIngresos.findIndex(x => x.Moneda_Origen === "Pesos");
          if (index1 > -1) {
            this.ingresoCambio = this.CambiosIngresos[index1].Ingreso
          }

          if (index > -1) {
            this.ingresoCambioBolivar = this.CambiosIngresos[index].Ingreso;
          }

        }
        if (this.TransferenciaIngresos[0]) { this.ingresoTransferencia = this.TransferenciaIngresos[0].Ingreso }
        if (this.GiroIngresos[0]) { this.ingresoGiro = this.GiroIngresos[0].Ingreso; this.GiroComision = this.GiroIngresos[0].Comision }
        if (this.TrasladoIngresos[0]) {
          var index = this.TrasladoIngresos.findIndex(x => x.Moneda_Origen === "Bolivares");
          var index1 = this.TrasladoIngresos.findIndex(x => x.Moneda_Origen === "Pesos");
          if (index1 > -1) {
            this.ingresoTraslado = this.TrasladoIngresos[index1].Ingreso
          }

          if (index > -1) {
            this.ingresoTrasladoBolivar = this.TrasladoIngresos[index].Ingreso;
          }
        }
        if (this.CorresponsalIngresos[0]) { this.ingresoCorresponsal = this.CorresponsalIngresos[0].Ingreso }
        if (this.ServicioIngresos[0]) { this.ingresoServicio = this.ServicioIngresos[0].Ingreso }

        if (this.CambiosEgresos[0]) {

          var index = this.CambiosEgresos.findIndex(x => x.Moneda_Destino === "Bolivares");
          var index1 = this.CambiosEgresos.findIndex(x => x.Moneda_Destino === "Pesos");
          if (index1 > -1) {
            this.egresoCambio = this.CambiosEgresos[index1].Egreso
          }

          if (index > -1) {
            this.egresoCambioBolivar = this.CambiosEgresos[index].Egreso;
          }
        }
        if (this.GiroEgresos[0]) {

          var index = this.GiroEgresos.findIndex(x => x.Moneda_Destino === "Bolivares");
          var index1 = this.GiroEgresos.findIndex(x => x.Moneda_Destino === "Pesos");
          if (index1 > -1) {
            this.egresoGiro = this.GiroEgresos[index1].Egreso
          }

          if (index > -1) {
            this.egresoGiroBolivar = this.GiroEgresos[index].Egreso;
          }
        }
        if (this.TrasladoEgresos[0]) {

          var index = this.TrasladoEgresos.findIndex(x => x.Moneda_Destino === "Bolivares");
          var index1 = this.TrasladoEgresos.findIndex(x => x.Moneda_Destino === "Pesos");
          if (index1 > -1) {
            this.egresoTraslado = this.TrasladoEgresos[index1].Egreso
          }

          if (index > -1) {
            this.egresoTrasladoBolivar = this.TrasladoEgresos[index].Egreso;
          }
        }

        
        var index2 = this.Funcionarios.findIndex(x=>x.Identificacion_Funcionario === funcionario);
        this.Titulo = " De " + this.Funcionarios[index2].Nombres + " " + this.Funcionarios[index2].Apellidos;
        this.botonVolver = true;
      });
    }

    //this.CierreCaja.show();

  }

  NombreOficina = [];
  Valores = [];
  Fecha = "";
  Historial(value) {
    this.Fecha = value;
    this.CambiosIngresos = [];
    this.TransferenciaIngresos = [];
    this.GiroIngresos = [];
    this.TrasladoIngresos = [];
    this.CorresponsalIngresos = [];
    this.ServicioIngresos = [];
    this.CambiosEgresos = [];
    this.GiroEgresos = [];
    this.TrasladoEgresos = [];
    this.totalIngresosPesos = 0;
    this.totalIngresosBolivares = 0;
    this.TotalEgresosPesos = 0;
    this.TotalEgresosBolivares = 0;
    this.SaldoInicialPesos = 0;
    this.SaldoInicialBolivares = 0;
    this.EntregadoIngresosBolivar = 0;
    this.ingresoCambioBolivar = 0;
    this.egresoCambioBolivar = 0;
    this.egresoGiroBolivar = 0;
    this.egresoTrasladoBolivar = 0;
    this.ingresoTrasladoBolivar = 0;
    this.GiroComision = 0;

    this.ingresoCambio = 0;
    this.ingresoCambioBolivar = 0;
    this.ingresoTransferencia = 0;
    this.ingresoTraslado=0;
    this.egresoTraslado = 0;
    this.totalIngresosPesos = 0;
    this.egresoCambio = 0;
    this.egresoCambioBolivar = 0;
    this.ingresoCorresponsal =0;
    this.EntregadoIngresosPesos=0;

    this.http.get(this.globales.ruta + 'php/cierreCaja/cierre_caja_general.php', { params: { fecha: value } }).subscribe((data: any) => {

      var ingresos = data.Ingresos;
      var egresos = data.Egresos;
      this.totalIngresosPesos = data.TotalIngresosPesos;
      this.totalIngresosBolivares = data.TotalIngresosBolivares;
      this.TotalEgresosPesos = data.TotalEgresosPesos;
      this.TotalEgresosBolivares = data.TotalEgresosBolivares;

      if (data.SaldoInicial[0]) {
        this.SaldoInicialPesos = data.SaldoInicial[0].Monto_Inicio;
        this.SaldoInicialBolivares = data.SaldoInicial[0].Monto_Inicio_Bolivar;
        this.EntregadoIngresosPesos = Number(this.SaldoInicialPesos) + Number(this.totalIngresosPesos) - Number(this.TotalEgresosPesos);
        this.EntregadoIngresosBolivar = Number(this.SaldoInicialBolivares) + Number(this.totalIngresosBolivares) - Number(this.TotalEgresosBolivares);
      }

      ingresos.forEach(element => {
        if (element.modulo == "Cambios") { this.CambiosIngresos.push(element) }
        if (element.modulo == "Transferencia") { this.TransferenciaIngresos.push(element) }
        if (element.modulo == "Giro") { this.GiroIngresos.push(element) }
        if (element.modulo == "Traslado") { this.TrasladoIngresos.push(element) }
        if (element.modulo == "Corresponsal") { this.CorresponsalIngresos.push(element) }
        if (element.modulo == "Servicio") { this.ServicioIngresos.push(element) }
      });

      egresos.forEach(element => {
        if (element.modulo == "Cambios") { this.CambiosEgresos.push(element) }
        if (element.modulo == "Giro") { this.GiroEgresos.push(element) }
        if (element.modulo == "Traslado") { this.TrasladoEgresos.push(element) }
      });

      if (this.CambiosIngresos[0]) {
        var index = this.CambiosIngresos.findIndex(x => x.Moneda_Origen === "Bolivares");
        var index1 = this.CambiosIngresos.findIndex(x => x.Moneda_Origen === "Pesos");
        if (index1 > -1) {
          this.ingresoCambio = this.CambiosIngresos[index1].Ingreso
        }

        if (index > -1) {
          this.ingresoCambioBolivar = this.CambiosIngresos[index].Ingreso;
        }

      }
      if (this.TransferenciaIngresos[0]) { this.ingresoTransferencia = this.TransferenciaIngresos[0].Ingreso }
      if (this.GiroIngresos[0]) { this.ingresoGiro = this.GiroIngresos[0].Ingreso; this.GiroComision = this.GiroIngresos[0].Comision }
      if (this.TrasladoIngresos[0]) {
        var index = this.TrasladoIngresos.findIndex(x => x.Moneda_Origen === "Bolivares");
        var index1 = this.TrasladoIngresos.findIndex(x => x.Moneda_Origen === "Pesos");
        if (index1 > -1) {
          this.ingresoTraslado = this.TrasladoIngresos[index1].Ingreso
        }

        if (index > -1) {
          this.ingresoTrasladoBolivar = this.TrasladoIngresos[index].Ingreso;
        }
      }
      if (this.CorresponsalIngresos[0]) { this.ingresoCorresponsal = this.CorresponsalIngresos[0].Ingreso }
      if (this.ServicioIngresos[0]) { this.ingresoServicio = this.ServicioIngresos[0].Ingreso }

      if (this.CambiosEgresos[0]) {

        var index = this.CambiosEgresos.findIndex(x => x.Moneda_Destino === "Bolivares");
        var index1 = this.CambiosEgresos.findIndex(x => x.Moneda_Destino === "Pesos");
        if (index1 > -1) {
          this.egresoCambio = this.CambiosEgresos[index1].Egreso
        }

        if (index > -1) {
          this.egresoCambioBolivar = this.CambiosEgresos[index].Egreso;
        }
      }
      if (this.GiroEgresos[0]) {

        var index = this.GiroEgresos.findIndex(x => x.Moneda_Destino === "Bolivares");
        var index1 = this.GiroEgresos.findIndex(x => x.Moneda_Destino === "Pesos");
        if (index1 > -1) {
          this.egresoGiro = this.GiroEgresos[index1].Egreso
        }

        if (index > -1) {
          this.egresoGiroBolivar = this.GiroEgresos[index].Egreso;
        }
      }
      if (this.TrasladoEgresos[0]) {

        var index = this.TrasladoEgresos.findIndex(x => x.Moneda_Destino === "Bolivares");
        var index1 = this.TrasladoEgresos.findIndex(x => x.Moneda_Destino === "Pesos");
        if (index1 > -1) {
          this.egresoTraslado = this.TrasladoEgresos[index1].Egreso
        }

        if (index > -1) {
          this.egresoTrasladoBolivar = this.TrasladoEgresos[index].Egreso;
        }
      }

    });
  }
  
  VolverTodos(){

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    var hoy = yyyy + '-' + mm + '-' + dd;
    (document.getElementById("datefield") as HTMLInputElement).setAttribute("max", hoy);
    this.fechaHoy = hoy;
    
    this.Titulo = " ";
    this.botonVolver = false;
    this.CambiosIngresos = [];
    this.TransferenciaIngresos = [];
    this.GiroIngresos = [];
    this.TrasladoIngresos = [];
    this.CorresponsalIngresos = [];
    this.ServicioIngresos = [];
    this.CambiosEgresos = [];
    this.GiroEgresos = [];
    this.TrasladoEgresos = [];
    this.totalIngresosPesos = 0;
    this.totalIngresosBolivares = 0;
    this.TotalEgresosPesos = 0;
    this.TotalEgresosBolivares = 0;
    this.SaldoInicialPesos = 0;
    this.SaldoInicialBolivares = 0;
    this.EntregadoIngresosBolivar = 0;
    this.ingresoCambioBolivar = 0;
    this.egresoCambioBolivar = 0;
    this.egresoGiroBolivar = 0;
    this.egresoTrasladoBolivar = 0;
    this.ingresoTrasladoBolivar = 0;
    this.GiroComision = 0;

    this.ingresoCambio = 0;
    this.ingresoCambioBolivar = 0;
    this.ingresoTransferencia = 0;
    this.ingresoTraslado=0;
    this.egresoTraslado = 0;
    this.totalIngresosPesos = 0;
    this.egresoCambio = 0;
    this.egresoCambioBolivar = 0;
    this.ingresoCorresponsal =0;
    this.EntregadoIngresosPesos=0;

    this.http.get(this.globales.ruta + 'php/cierreCaja/cierre_caja_general.php').subscribe((data: any) => {

      var ingresos = data.Ingresos;
      var egresos = data.Egresos;
      this.totalIngresosPesos = data.TotalIngresosPesos;
      this.totalIngresosBolivares = data.TotalIngresosBolivares;
      this.TotalEgresosPesos = data.TotalEgresosPesos;
      this.TotalEgresosBolivares = data.TotalEgresosBolivares;

      if (data.SaldoInicial[0]) {
        this.SaldoInicialPesos = data.SaldoInicial[0].Monto_Inicio;
        this.SaldoInicialBolivares = data.SaldoInicial[0].Monto_Inicio_Bolivar;
        this.EntregadoIngresosPesos = Number(this.SaldoInicialPesos) + Number(this.totalIngresosPesos) - Number(this.TotalEgresosPesos);
        this.EntregadoIngresosBolivar = Number(this.SaldoInicialBolivares) + Number(this.totalIngresosBolivares) - Number(this.TotalEgresosBolivares);
      }

      ingresos.forEach(element => {
        if (element.modulo == "Cambios") { this.CambiosIngresos.push(element) }
        if (element.modulo == "Transferencia") { this.TransferenciaIngresos.push(element) }
        if (element.modulo == "Giro") { this.GiroIngresos.push(element) }
        if (element.modulo == "Traslado") { this.TrasladoIngresos.push(element) }
        if (element.modulo == "Corresponsal") { this.CorresponsalIngresos.push(element) }
        if (element.modulo == "Servicio") { this.ServicioIngresos.push(element) }
      });

      egresos.forEach(element => {
        if (element.modulo == "Cambios") { this.CambiosEgresos.push(element) }
        if (element.modulo == "Giro") { this.GiroEgresos.push(element) }
        if (element.modulo == "Traslado") { this.TrasladoEgresos.push(element) }
      });

      if (this.CambiosIngresos[0]) {
        var index = this.CambiosIngresos.findIndex(x => x.Moneda_Origen === "Bolivares");
        var index1 = this.CambiosIngresos.findIndex(x => x.Moneda_Origen === "Pesos");
        if (index1 > -1) {
          this.ingresoCambio = this.CambiosIngresos[index1].Ingreso
        }

        if (index > -1) {
          this.ingresoCambioBolivar = this.CambiosIngresos[index].Ingreso;
        }

      }
      if (this.TransferenciaIngresos[0]) { this.ingresoTransferencia = this.TransferenciaIngresos[0].Ingreso }
      if (this.GiroIngresos[0]) { this.ingresoGiro = this.GiroIngresos[0].Ingreso; this.GiroComision = this.GiroIngresos[0].Comision }
      if (this.TrasladoIngresos[0]) {
        var index = this.TrasladoIngresos.findIndex(x => x.Moneda_Origen === "Bolivares");
        var index1 = this.TrasladoIngresos.findIndex(x => x.Moneda_Origen === "Pesos");
        if (index1 > -1) {
          this.ingresoTraslado = this.TrasladoIngresos[index1].Ingreso
        }

        if (index > -1) {
          this.ingresoTrasladoBolivar = this.TrasladoIngresos[index].Ingreso;
        }
      }
      if (this.CorresponsalIngresos[0]) { this.ingresoCorresponsal = this.CorresponsalIngresos[0].Ingreso }
      if (this.ServicioIngresos[0]) { this.ingresoServicio = this.ServicioIngresos[0].Ingreso }

      if (this.CambiosEgresos[0]) {

        var index = this.CambiosEgresos.findIndex(x => x.Moneda_Destino === "Bolivares");
        var index1 = this.CambiosEgresos.findIndex(x => x.Moneda_Destino === "Pesos");
        if (index1 > -1) {
          this.egresoCambio = this.CambiosEgresos[index1].Egreso
        }

        if (index > -1) {
          this.egresoCambioBolivar = this.CambiosEgresos[index].Egreso;
        }
      }
      if (this.GiroEgresos[0]) {

        var index = this.GiroEgresos.findIndex(x => x.Moneda_Destino === "Bolivares");
        var index1 = this.GiroEgresos.findIndex(x => x.Moneda_Destino === "Pesos");
        if (index1 > -1) {
          this.egresoGiro = this.GiroEgresos[index1].Egreso
        }

        if (index > -1) {
          this.egresoGiroBolivar = this.GiroEgresos[index].Egreso;
        }
      }
      if (this.TrasladoEgresos[0]) {

        var index = this.TrasladoEgresos.findIndex(x => x.Moneda_Destino === "Bolivares");
        var index1 = this.TrasladoEgresos.findIndex(x => x.Moneda_Destino === "Pesos");
        if (index1 > -1) {
          this.egresoTraslado = this.TrasladoEgresos[index1].Egreso
        }

        if (index > -1) {
          this.egresoTrasladoBolivar = this.TrasladoEgresos[index].Egreso;
        }
      }

    });
  }

  calcularFajoBilletes(cantidad:number,i:number,moneda:string){

  }

}
