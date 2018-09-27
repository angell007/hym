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

  Identificacion: any;
  CuentaDestino: any;
  Recibe: any;
  CedulaDestino: any;
  Monto: any;
  BancosEmpresa = [];
  idTransferencia: any;
  transferenciasRealizadas =[];
  valorDevolverTransferencia: any;

  constructor(private http: HttpClient, private globales: Globales) { }

  ngOnInit() {
    this.ActualizarVista();
  }
  

  ActualizarVista() {
    this.http.get(this.globales.ruta + 'php/transferencias/lista.php').subscribe((data: any) => {
      this.transferencias = data.pendientes;
      this.transferenciasRealizadas = data.realizadas;
      this.dtTrigger.next();
    });

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      dom: 'Bfrtip',
      responsive: true,
      /* below is the relevant part, e.g. translated to spanish */
      language: {
        processing: "Procesando...",
        search: "Buscar:",
        lengthMenu: "Mostrar _MENU_ &eacute;l&eacute;ments",
        info: "Mostrando desde _START_ al _END_ de _TOTAL_ elementos",
        infoEmpty: "Mostrando ningún elemento.",
        infoFiltered: "(filtrado _MAX_ elementos total)",
        infoPostFix: "",
        loadingRecords: "Cargando registros...",
        zeroRecords: "No se encontraron registros",
        emptyTable: "No hay datos disponibles en la tabla",
        paginate: {
          first: "<<",
          previous: "<",
          next: ">",
          last: ">>"
        },
        aria: {
          sortAscending: ": Activar para ordenar la tabla en orden ascendente",
          sortDescending: ": Activar para ordenar la tabla en orden descendente"
        }
      }
    };

    this.http.get(this.globales.ruta + 'php/transferencias/conteo.php').subscribe((data: any) => {
      this.conteoTransferencias = data[0];
    });


    this.http.get(this.globales.ruta + '/php/transferencias/listar_bancos_empresariales.php')
    .subscribe((data: any) => {
      this.BancosEmpresa = data;
    });

    this.http.get(this.globales.ruta + 'php/transferencias/grafico_transferencia.php').subscribe((data: any) => {
      var chart = AmCharts.makeChart("chartdiv", {
        "type": "serial",
        "theme": "light",
        "dataProvider": data,
        "gridAboveGraphs": true,
        "startDuration": 1,
        "graphs": [{
          "balloonText": "[[Funcionario]]: <b>[[Conteo]]</b>",
          "fillAlphas": 0.8,
          "lineAlpha": 0.2,
          "type": "column",
          "valueField": "Conteo"
        }],
        "chartCursor": {
          "categoryBalloonEnabled": false,
          "cursorAlpha": 0,
          "zoomable": false
        },
        "categoryField": "Funcionario",
        "categoryAxis": {
          "gridPosition": "start",
          "gridAlpha": 0,
          "tickPosition": "start",
          "tickLength": 20
        },
        "export": {
          "enabled": true
        }

      });
    });


  }


  DevolucionTransferencia(id, modal, valorDevolver) {
    this.http.get(this.globales.ruta + '/php/genericos/detalle.php', {
      params: { id: id, modulo: "Transferencia" }
    }).subscribe((data: any) => {
      this.Identificacion = data.Id_Transferencia;
      modal.show();
      this.valorDevolverTransferencia = valorDevolver;
    });
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
      this.ActualizarVista();
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
      this.ActualizarVista();
    });
  }

  alertaDesbloqueo(usuario){
    this.desbloqueoSwal.title = "Desbloqueo"
    this.desbloqueoSwal.text ='Está transferencia fue bloqueada por '+usuario+' ¿ Está seguro que desea desbloquearla ?' , 
    this.desbloqueoSwal.type='warning', 
    this.desbloqueoSwal.showCancelButton= true, 
    this.desbloqueoSwal.confirmButtonText= 'Si, Desbloquear', 
    this.desbloqueoSwal.cancelButtonText='No, Dejame Comprobar!'
    this.desbloqueoSwal.show();
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

  Bloqueado(estado) {
    switch (estado) {
      case "Si": { return false }
      case "No": { return true }
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

  RealizarTransferencia(id,numeroCuenta) {
    //this.BloquearTransferencia(id, "No");
   
    this.http.get(this.globales.ruta + 'php/genericos/detalle_cuenta_bancaria.php', {
      params: { id: id , cuentaBancaria : numeroCuenta }
    }).subscribe((data: any) => {
      
      this.idTransferencia = id;
      this.CuentaDestino = data.cuenta
      this.Recibe = data.NombreDestinatario
      this.CedulaDestino = data.Cedula
      this.Monto = data.ValorTransferencia;

      if (numeroCuenta.substring(0, 4) == "0134") {
        this.ModalCrearTransferenciaBanesco.show();
      } else {
        this.ModalCrearTransferenciaOtroBanco.show();
      }
    });
  }

  verificarBloqueo(id, numeroCuenta){
    this.http.get(this.globales.ruta + 'php/transferencias/bloqueo_transferencia_destinatario.php', {
      params: { id: id }
    }).subscribe((data: any) => {
      switch(data[0].Bloqueo){//this.mensajeSwal.text="Esta transferencia fue bloqueda por "+data[0].Bloqueo_Funcionario ;
        case "Si": { this.mensajeSwal.title="Estado transferencia"; this.mensajeSwal.text="Esta transferencia fue bloqueda por "+data[0].Bloqueo_Funcionario; this.mensajeSwal.type="error"; this.mensajeSwal.show(); break;  }
        case "No": { this.BloquearTransferenciaDestinatario(id,"No"); this.RealizarTransferencia(id,numeroCuenta); break; }
        default: { this.BloquearTransferenciaDestinatario(id,"No"); this.RealizarTransferencia(id,numeroCuenta); break; }
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

  CrearTransferencia(formulario: NgForm, modal){
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    datos.append("datos", info);
    this.http.post(this.globales.ruta + 'php/transferencias/guardar_transferencia_consultor.php', datos).subscribe((data: any) => {
      formulario.reset();
      this.mensajeSwal.title = "Transferencia realizada"
      this.mensajeSwal.text = "Se ha guardado correctamente la información"
      this.mensajeSwal.type = "success"
      this.mensajeSwal.show();
      this.ActualizarVista();
      modal.hide();
    });
  }

  /*
  CancelarBloqueo(id,modal){
    this.BloquearTransferenciaDestinatario(id,"Si");
    modal.hide();
  }*/
}
