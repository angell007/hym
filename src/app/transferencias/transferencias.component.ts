import '../../assets/charts/amchart/amcharts.js';
import '../../assets/charts/amchart/gauge.js';
import '../../assets/charts/amchart/pie.js';
import '../../assets/charts/amchart/serial.js';
import '../../assets/charts/amchart/light.js';
import '../../assets/charts/amchart/ammap.js';
import '../../assets/charts/amchart/worldLow.js';
import '../../assets/charts/amchart/continentsLow.js';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TouchSequence } from '../../../node_modules/@types/selenium-webdriver';
import { Globales } from '../shared/globales/globales';
import { Subject } from 'rxjs';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-transferencias',
  templateUrl: './transferencias.component.html',
  styleUrls: ['./transferencias.component.css']
})
export class TransferenciasComponent implements OnInit {
  public fecha = new Date();
  transferencias = [];
  conteoTransferencias = [];
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

    });

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
  ActualizarVista() {

    /*this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Compra' } }).subscribe((data: any) => {
      this.compras = data;
    });*/

    this.http.get(this.globales.ruta + 'php/compras/compra_cuenta.php').subscribe((data: any) => {
      this.cuentasBancarias = data;
    });

    this.http.get(this.globales.ruta + 'php/transferencias/conteo.php').subscribe((data: any) => {
      this.conteoTransferencias = data[0];
    });

    this.http.get(this.globales.ruta + '/php/transferencias/listar_bancos_empresariales.php')
      .subscribe((data: any) => {
        this.BancosEmpresa = data;
      });
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

  Bloqueado(estado, funcionario,tipo) {

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

  detalleCompra = [];
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

  tipoTransferencia(value,estado, funcionario){
    switch(value){
      case "Transferencia":{
        return true;
      }
      case "Cliente":{
        return false;
      }
    }
  }
}
