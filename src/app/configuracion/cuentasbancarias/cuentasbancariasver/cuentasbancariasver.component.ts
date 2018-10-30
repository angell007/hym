import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-cuentasbancariasver',
  templateUrl: './cuentasbancariasver.component.html',
  styleUrls: ['./cuentasbancariasver.component.scss']
})
export class CuentasbancariasverComponent implements OnInit {

  @ViewChild('confirmacionSwal') confirmacionSwal: any;
  @ViewChild('ModalVerRecibo') ModalVerRecibo: any;
  @ViewChild('ModalAjusteEditar') ModalAjusteEditar: any;
  @ViewChild('ModalAjuste') ModalAjuste: any;

  Movimientos = [];
  public id = this.route.snapshot.params["id"];
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  SaldoActual: any;
  DatosBanco = [];
  EncabezadoRecibo = [{

  }];
  DestinatarioRecibo = [];
  DevolucionesRecibo = [];
  filaRecibo = false;

  constructor(private route: ActivatedRoute, private http: HttpClient, private globales: Globales) { }

  ngOnInit() {    
    this.id = this.route.snapshot.params["id"];
    this.ActualizarVista();
    this.calcularSaldoActual();
    this.datosCuentaBancaria();   

  }

  datosCuentaBancaria() {
    this.http.get(this.globales.ruta + 'php/bancos/detalle_banco.php', {
      params: { id: this.id }
    }).subscribe((data: any) => {
      this.DatosBanco = data;
    });
  }

  ActualizarVista() {
    this.http.get(this.globales.ruta + 'php/movimientos/movimiento_cuenta_bancaria.php', {
      params: { id: this.id }
    }).subscribe((data: any) => {
      this.Movimientos = data.lista;
    });
  }
  
  retornarSimbolo(){
    if(this.DatosBanco[0].Moneda == "Pesos"){
      return "$.";
    }else{
      return "BsS."
    }
  }


  GuardarMovimiento(formulario: NgForm, modal) {
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    var newId = this.id;
    datos.append("modulo", 'Movimiento_Cuenta_Bancaria');
    datos.append("datos", info);
    datos.append("Id_Cuenta_Bancaria", this.id);
    this.http.post(this.globales.ruta + 'php/bancos/guardar_ajuste.php', datos)
      .subscribe((data: any) => {
       formulario.reset();
        (document.getElementById("Id_Cuenta_Bancaria") as HTMLInputElement).value=newId;
        modal.hide();
        this.ActualizarVista();
        this.confirmacionSwal.title = "Movimiento Realizado"
        this.confirmacionSwal.text = "Se ha guardado correctamente el movimiento"
        this.confirmacionSwal.type = "success";
        this.confirmacionSwal.show();
        this.calcularSaldoActual();
      });
  }

  calcularSaldoActual() {
    this.http.get(this.globales.ruta + 'php/movimientos/movimiento_cuenta_bancaria.php', {
      params: { id: this.id }
    }).subscribe((data: any) => {
      //if (data.total > 0) {
        this.SaldoActual = data.total;
      /*} else {
        this.SaldoActual = 0;
      }*/
    });
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

  borrarAjuste(id) {
    let datos = new FormData();
    datos.append("modulo", 'Movimiento_Cuenta_Bancaria');
    datos.append("id", id);
    this.http.post(this.globales.ruta + 'php/genericos/eliminar_generico.php', datos)
      .subscribe((data: any) => {
        this.ActualizarVista();
        this.confirmacionSwal.title = "Movimiento Eliminado"
        this.confirmacionSwal.text = "Se ha eliminado el ajuste"
        this.confirmacionSwal.type = "success";
        this.confirmacionSwal.show();
        this.calcularSaldoActual();
      });
  }

  idItem: any;
  ajusteBancario = [];
  editarAjuste(id, modal) {
    this.idItem = id;
    this.http.get(this.globales.ruta + 'php/genericos/detalle.php', {
      params: { id: id, modulo: "Movimiento_Cuenta_Bancaria" }
    }).subscribe((data: any) => {
      this.ajusteBancario = data;
    });
    modal.show();
  }

  abrirModal(){
    this.ModalAjuste.show();
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    var hoy = yyyy+'-'+mm+'-'+dd;
    (document.getElementById("datefield") as HTMLInputElement).setAttribute("max",hoy);
  }

}
