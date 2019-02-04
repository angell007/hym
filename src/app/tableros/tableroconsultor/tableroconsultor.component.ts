import '../../../assets/charts/amchart/amcharts.js';
import '../../../assets/charts/amchart/gauge.js';
import '../../../assets/charts/amchart/pie.js';
import '../../../assets/charts/amchart/serial.js';
import '../../../assets/charts/amchart/light.js';
import '../../../assets/charts/amchart/ammap.js';
import '../../../assets/charts/amchart/worldLow.js';
import '../../../assets/charts/amchart/continentsLow.js';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TouchSequence } from '../../../../node_modules/@types/selenium-webdriver';
import { Globales } from '../../shared/globales/globales';
import { Subject } from 'rxjs';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-tableroconsultor',
  templateUrl: './tableroconsultor.component.html',
  styleUrls: ['./tableroconsultor.component.scss']
})
export class TableroconsultorComponent implements OnInit {
  public fecha = new Date();
  transferencias = [];
  transferencias2 = ['a','b','c','d','e','f'];
  conteoTransferencias:any = {};
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();

  @ViewChild('ModalVerDestinatario') ModalVerDestinatario: any;
  @ViewChild('ModalEditarDestinatario') ModalEditarDestinatario: any;
  @ViewChild('ModalDestinatario') ModalDestinatario: any;
  @ViewChild('FormDestinatario') FormDestinatario: any;
  @ViewChild('errorSwal') errorSwal: any;
  @ViewChild('saveSwal') saveSwal: any;
  @ViewChild('deleteSwal') deleteSwal: any;
  @ViewChild('bloqueoSwal') bloqueoSwal: any;
  @ViewChild('mensajeSwal') mensajeSwal: any;
  @ViewChild('ModalDevolucionTransferencia') ModalDevolucionTransferencia: any;
  @ViewChild('ModalCrearTransferenciaBanesco') ModalCrearTransferenciaBanesco: any;
  @ViewChild('ModalCrearTransferenciaOtroBanco') ModalCrearTransferenciaOtroBanco: any;
  @ViewChild('desbloqueoSwal') desbloqueoSwal: any;
  @ViewChild('ModalVerRecibo') ModalVerRecibo: any;
  @ViewChild('ModalVerCompra') ModalVerCompra: any;
  @ViewChild('ModalSaldoInicialBanco') ModalSaldoInicialBanco: any;

  
  Identificacion: any;
  CuentaDestino: any;
  Recibe: any;
  CedulaDestino: any;
  Monto: any;
  BancosEmpresa = [];
  idTransferencia: any;
  transferenciasRealizadas = [];
  valorDevolverTransferencia: any;
  PagoTransferencia: any;
  Recibo: any;
  Cajero: any;
  EncabezadoRecibo = [];
  DestinatarioRecibo = [];
  DevolucionesRecibo = [];
  filaRecibo = false;
  compras = [];
  ListaBancos = [];

  public cargarTabla:boolean = false;

  constructor(private http: HttpClient, private globales: Globales) { }

  ngOnInit() {
    this.ActualizarVista();

    this.http.get(this.globales.ruta + 'php/transferencias/lista.php').subscribe((data: any) => {

      data.pendientes.forEach(element => {
        if (element.Valor_Transferencia_Bolivar !== 0) {
          this.transferencias.push(element);
        }
      });
      
      this.transferenciasRealizadas = data.realizadas;
      setTimeout(() => {
        this.cargarTabla = true;  
      }, 500);
      

    });

    //hym.corvuslab.co/php/consultor/lista_bancos.php

    this.http.get(this.globales.ruta + 'php/consultor/lista_bancos.php').subscribe((data: any) => {
      this.ListaBancos = data;
    });

    this.http.get(this.globales.ruta + 'php/consultor/verificar_banco_consultor.php', { params: { id: JSON.parse(localStorage['User']).Identificacion_Funcionario } }).subscribe((data: any) => {
      if (data.length == 0) {
        this.ModalSaldoInicialBanco.show();
      }else{
        localStorage.setItem('Banco',data[0].Id_Cuenta_Bancaria);
      }
    });

    //this.graficas();

  }

  Pendientes = true;
  Realizadas = false;
  ComprasPendientes = false;

  mostrarPendientes() {
    this.Pendientes = true;
    this.Realizadas = false;
    this.ComprasPendientes = false;
  }

  mostrarRealizadas() {
    this.Pendientes = false;
    this.Realizadas = true;
    this.ComprasPendientes = false;
  }

  MostrarComprasPendientes() {
    this.ComprasPendientes = true;
    this.Pendientes = false;
    this.Realizadas = false;

  }

  cuentasBancarias = [];
  BancosVenezolanos = [];
  ActualizarVista() {

    this.http.get(this.globales.ruta + 'php/compras/compra_cuenta.php').subscribe((data: any) => {
      this.cuentasBancarias = data;
    });

    this.http.get(this.globales.ruta + 'php/transferencias/conteo.php').subscribe((data: any) => {
      this.conteoTransferencias = data;
    });

    this.http.get(this.globales.ruta + '/php/transferencias/listar_bancos_empresariales.php')
      .subscribe((data: any) => {
        this.BancosEmpresa = data;
      });


    this.http.get(this.globales.ruta + 'php/bancos/lista_bancos_venezolanos.php')
      .subscribe((data: any) => {
        this.BancosVenezolanos = data;
      });


      this.graficas();
  }

  refrescarVistaPrincipalConsultor() {
    this.transferencias = [];
    this.transferenciasRealizadas = [];
    this.http.get(this.globales.ruta + 'php/transferencias/lista.php').subscribe((data: any) => {

      data.pendientes.forEach(element => {
        if (element.Valor_Transferencia_Bolivar !== 0) {
          this.transferencias.push(element);
        }
      });
      this.transferenciasRealizadas = data.realizadas;
    });

    this.ActualizarVista();
  }


  DevolucionTransferencia(id, modal, valorDevolver, idPagoTransferencia) {
    this.Identificacion = id;
    modal.show();
    this.valorDevolverTransferencia = valorDevolver;
    this.PagoTransferencia = idPagoTransferencia;
  }

  ReactivarTransferencia(id, modal) {
    this.http.get(this.globales.ruta + '/php/genericos/detalle.php', {
      params: { id: id, modulo: "Transferencia" }
    }).subscribe((data: any) => {
      this.Identificacion = data.Id_Transferencia;
      modal.show();
    });
  }

  RealizarReactivacion(formulario: NgForm, modal) {
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    datos.append("modulo", 'Transferencia');
    datos.append("datos", info);
    this.http.post(this.globales.ruta + 'php/transferencias/reactivar_transferencia.php', datos).subscribe((data: any) => {
      formulario.reset();
      this.mensajeSwal.title = "Transferencia Activada"
      this.mensajeSwal.text = "Se ha activado la transferencia"
      this.mensajeSwal.type = "success"
      this.mensajeSwal.show();
      this.ActualizarVista();
      modal.hide();
    });
  }

  RealizarDevolucion(formulario: NgForm, modal) {
    formulario.value.Id_Cuenta_Bancaria = JSON.parse(localStorage['Banco']);
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    datos.append("modulo", 'Transferencia');
    datos.append("datos", info);
    this.http.post(this.globales.ruta + 'php/transferencias/devolucion_transferencia.php', datos).subscribe((data: any) => {
      formulario.reset();
      this.mensajeSwal.title = "Transferencia devuelta"
      this.mensajeSwal.text = "Se ha devuelto la transferencia"
      this.mensajeSwal.type = "success"
      this.mensajeSwal.show();
      this.refrescarVistaPrincipalConsultor();
      modal.hide();
    });
  }

  BloquearTransferencia(id, estado) {
    let datos = new FormData();
    datos.append("modulo", 'Transferencia_Destinatario');
    datos.append("id", id);
    datos.append("estado", estado);
    datos.append("funcionario", JSON.parse(localStorage['User']).Nombres + " " + JSON.parse(localStorage['User']).Apellidos);
    this.http.post(this.globales.ruta + 'php/transferencias/bloquear_transferencia.php', datos).subscribe((data: any) => {
      //this.bloqueoSwal.show();
      this.refrescarVistaPrincipalConsultor();
    });
  }


  BloquearTransferenciaDestinatario(id, estado) {
    let datos = new FormData();
    datos.append("modulo", 'Transferencia_Destinatario');
    datos.append("id", id);
    datos.append("estado", estado);
    datos.append("funcionario", JSON.parse(localStorage['User']).Identificacion_Funcionario);
    this.http.post(this.globales.ruta + 'php/transferencias/bloquear_transferencia.php', datos).subscribe((data: any) => {
      /*this.bloqueoSwal.show();
      this.ActualizarVista();*/
    });
  }

  Bloqueado(estado, funcionario, tipo) {

    if (funcionario === JSON.parse(localStorage['User']).Identificacion_Funcionario) {
      switch (estado) {
        case "Si": { return false }
        case "No": { return true }
      }

    } else {
      return true
    }

  }

  Devuelto(estado) {
    switch (estado) {
      case "Devuelta": { return false }
      default: { return true }
    }

  }

  MarcarTransferencia(id) {
    let datos = new FormData();
    datos.append("modulo", 'Transferencia');
    datos.append("id", id);
    datos.append("funcionario", JSON.parse(localStorage['User']).Identificacion_Funcionario);
    this.http.post(this.globales.ruta + 'php/transferencias/transferencia_marcada.php', datos).subscribe((data: any) => {
      this.mensajeSwal.title = "Transferencia Realizada"
      this.mensajeSwal.text = "Se ha marcado la transferencia como realizada"
      this.mensajeSwal.type = "success"
      this.mensajeSwal.show();
      this.ActualizarVista();
    });
  }

  NombreBancoEmpresa = "";
  RealizarTransferencia(id, numeroCuenta, valor, cajero, codigo) {
    //this.BloquearTransferencia(id, "No");

    this.http.get(this.globales.ruta + 'php/genericos/detalle_cuenta_bancaria.php', {
      params: { id: id, cuentaBancaria: numeroCuenta }
    }).subscribe((data: any) => {

      this.idTransferencia = id;
      this.CuentaDestino = data.cuenta
      this.Recibe = data.NombreDestinatario
      this.CedulaDestino = data.Cedula
      this.Monto = valor;
      this.Cajero = cajero
      this.Recibo = codigo

      // buscar id Cuenta =  JSON.parse(localStorage['Banco']);
     
      console.log(this.BancosVenezolanos);
      console.log(JSON.parse(localStorage['Banco']));
      var index = this.BancosVenezolanos.findIndex(x=>x.Id_Cuenta_Bancaria === localStorage['Banco'] );
      console.log(index);
      if(index > -1 ){
        this.NombreBancoEmpresa = this.BancosEmpresa[index].Nombre_Titular;
      }

      if (numeroCuenta.substring(0, 4) == "0134") {
        this.ModalCrearTransferenciaBanesco.show();
      } else {
        this.ModalCrearTransferenciaOtroBanco.show();
      }

      this.refrescarVistaPrincipalConsultor();

    });
  }

  verificarBloqueo(id, numeroCuenta, valorActual, cajero, codigo) {
    this.http.get(this.globales.ruta + 'php/transferencias/bloqueo_transferencia_destinatario.php', {
      params: { id: id }
    }).subscribe((data: any) => {
      switch (data[0].Bloqueo) {//this.mensajeSwal.text="Esta transferencia fue bloqueda por "+data[0].Bloqueo_Funcionario ;
        case "Si": { this.mensajeSwal.title = "Estado transferencia"; this.mensajeSwal.text = "Esta transferencia fue bloqueda por " + data[0].nombreFuncionario; this.mensajeSwal.type = "error"; this.mensajeSwal.show(); break; }
        case "No": { this.BloquearTransferenciaDestinatario(id, "No"); this.RealizarTransferencia(id, numeroCuenta, valorActual, cajero, codigo); break; }
        default: { this.BloquearTransferenciaDestinatario(id, "No"); this.RealizarTransferencia(id, numeroCuenta, valorActual, cajero, codigo); break; }
      }
    });
  }

  Marcado(estado) {
    switch (estado) {
      case "Pendiente": {
        return true;
      }
      case "Devuelta": {
        return false;
      }
      case "Realizada": {
        return false;
      }

    }
  }

  CrearTransferencia(formulario: NgForm, modal) {
    formulario.value.Id_Cuenta_Bancaria =  JSON.parse(localStorage['Banco']);
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    datos.append("datos", info);
    this.http.post(this.globales.ruta + 'php/transferencias/guardar_transferencia_consultor.php', datos).subscribe((data: any) => {
      formulario.reset();
      this.mensajeSwal.title = "Transferencia realizada"
      this.mensajeSwal.text = "Se ha guardado correctamente la información"
      this.mensajeSwal.type = "success"
      this.mensajeSwal.show();
      this.refrescarVistaPrincipalConsultor();
      modal.hide();
    });
  }


  CancelarBloqueo(id, modal, formulario) {
    this.BloquearTransferenciaDestinatario(id, "Si");
    this.refrescarVistaPrincipalConsultor();
    formulario.reset();
    modal.hide();
  }

  verRecibo(valor) {
    this.http.get(this.globales.ruta + 'php/transferencias/ver_recibo.php', {
      params: { id: valor }
    }).subscribe((data: any) => {
      this.EncabezadoRecibo = data.encabezado;
      this.DestinatarioRecibo = data.destinatario;
      this.DevolucionesRecibo = data.devoluciones;

      if (this.DevolucionesRecibo.length > 0) {
        this.filaRecibo = true;
      } else {
        this.filaRecibo = false;
      }

      this.ModalVerRecibo.show();
    });
  }

  detalleCompra:any = {};
  Pagos = [{
    Ingreso: "",
    Transferencia: ""
  }]
  Abonos = [{
    Abono: ""
  }]

  HabilitarCobroBanesco = false;
  idCompra: any;
  idCuenta: any;
  idCompraCuenta: any;
  auditarCompra(idCompra, idCuenta, idCompraCuenta) {
    var posCuenta = this.cuentasBancarias.findIndex(x => x.Id_Cuenta_Bancaria === idCuenta);

    if (this.cuentasBancarias[posCuenta].Numero_Cuenta.substring(0, 4) == "0134") {
      this.HabilitarCobroBanesco = true;
    } else {
      this.HabilitarCobroBanesco = false;
    }

    this.idCompra = idCompra;
    this.idCuenta = idCuenta;
    this.idCompraCuenta = idCompraCuenta;

    var posCompra = this.cuentasBancarias[posCuenta].Compra.findIndex(x => x.Id_Compra == idCompra);
    this.detalleCompra = this.cuentasBancarias[posCuenta].Compra[posCompra];
    this.ModalVerCompra.show();

  }

  GuardarMovimientoCompra(formulario: NgForm, modal) {
    //console.log(this.Pagos);
    //console.log(this.Abonos);

    this.Pagos.forEach((element, index) => {
      if (element.Ingreso == "" || element.Transferencia == "") {
        this.Pagos.splice(index, 1);
      }
    });

    this.Abonos.forEach((element, index) => {
      if (element.Abono == "") {
        this.Abonos.splice(index, 1);
      }
    });

    let info = JSON.stringify(formulario.value);
    let pagos = JSON.stringify(this.Pagos);
    let abonos = JSON.stringify(this.Abonos);
    let datos = new FormData();
    datos.append("datos", info);
    datos.append("pagos", pagos);
    datos.append("abonos", abonos);
    this.http.post(this.globales.ruta + 'php/compras/guardar_movimiento_compra.php', datos).subscribe((data: any) => {
      formulario.reset();
      this.mensajeSwal.title = "Compra Actualizada"
      this.mensajeSwal.text = "Se ha Actualizado correctamente la compra"
      this.mensajeSwal.type = "success"
      this.mensajeSwal.show();
      modal.hide();
    });
    //modal.hide():
  }

  agregarfilaIngresos(pos) {
    var cuenta = this.Pagos[pos].Transferencia;
    var valor = this.Pagos[pos].Ingreso;

    if (parseInt(valor) > 0 && cuenta != "") {
      var i = pos + 1;
      if (this.Pagos[i] == undefined) {
        this.Pagos.push(
          {
            Ingreso: "",
            Transferencia: ""
          });

      }
    }
  }

  agregarfilaAbonos(pos) {
    var valor = this.Abonos[pos].Abono;
    if (parseInt(valor) > 0) {
      var i = pos + 1;
      if (this.Abonos[i] == undefined) {
        this.Abonos.push(
          {
            Abono: ""
          });

      }
    }
  }

  tipoTransferencia(value, estado, funcionario) {
    switch (value) {
      case "Transferencia": {
        return true;
      }
      case "Cliente": {
        return false;
      }
    }
  }

  RealizarReporte(formulario: NgForm, modal) {
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    datos.append("datos", info);
    this.http.post(this.globales.ruta + 'php/compras/guardar_movimiento_cuenta_compra.php', datos).subscribe((data: any) => {
      formulario.reset();
      this.mensajeSwal.title = "Reporte Creado"
      this.mensajeSwal.text = "Se ha creado el reporte para este banco"
      this.mensajeSwal.type = "success"
      this.mensajeSwal.show();
      modal.hide();
    });
  }

  GuardarMontoInicial(formulario: NgForm, modal) {
      formulario.value.Id_Funcionario = JSON.parse(localStorage['User']).Identificacion_Funcionario;
      let info = JSON.stringify(formulario.value);
      let datos = new FormData();
      datos.append("datos", info);
      this.http.post(this.globales.ruta + 'php/consultor/guardar_monto_inicial.php', datos).subscribe((data: any) => {
        if (data != "") {
          formulario.reset();
          this.mensajeSwal.title = "Apertura"
          this.mensajeSwal.text = "Se ha realizado la apertura con esta cuenta"
          this.mensajeSwal.type = "success"
          this.mensajeSwal.show();
          modal.hide();
        } else {
          this.mensajeSwal.title = "Apertura";
          this.mensajeSwal.text = "El banco seleccionado se le asigno a otro consultor";
          this.mensajeSwal.type = "warning";
          this.mensajeSwal.show();
        }

      });

  }

  graficas(){
    this.http.get(this.globales.ruta + 'php/transferencias/conteo.php').subscribe((data: any) => {
      var chart = AmCharts.makeChart( "chartdiv", {
        "type": "serial",
        "theme": "light",
        "dataProvider": [ {
          "country": "Realizadas",
          "visits": data.TransferenciasRealizadas
        }, {
          "country": "Devueltas",
          "visits": data.TransferenciasDevueltas
        }, {
          "country": "Revisadas",
          "visits": data.TotalTransferencias
        } ],
        "valueAxes": [ {
          "gridColor": "#FFFFFF",
          "gridAlpha": 0.2,
          "dashLength": 0
        } ],
        "gridAboveGraphs": true,
        "startDuration": 1,
        "graphs": [ {
          "balloonText": "[[category]]: <b>[[value]]</b>",
          "fillAlphas": 0.8,
          "lineAlpha": 0.2,
          "type": "column",
          "valueField": "visits"
        } ],
        "chartCursor": {
          "categoryBalloonEnabled": false,
          "cursorAlpha": 0,
          "zoomable": false
        },
        "categoryField": "country",
        "categoryAxis": {
          "gridPosition": "start",
          "gridAlpha": 0,
          "tickPosition": "start",
          "tickLength": 20
        },
        "export": {
          "enabled": true
        }
      
      } );
    });

  }

  SaldoInicialBanco = 0;
  VerificarSaldo(value){
    var index = this.ListaBancos.findIndex(x=>x.Id_Cuenta_Bancaria === value);
    if(index > -1 ){
      this.SaldoInicialBanco= this.ListaBancos[index].Valor;
      //GuardarInicio
    }
  }


}
