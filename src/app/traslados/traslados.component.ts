import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild, HostListener, TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Globales } from '../shared/globales/globales';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-traslados',
  templateUrl: './traslados.component.html',
  styleUrls: ['./traslados.component.css']
})
export class TrasladosComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  user: any;
  IdentificacionFuncionario: any;

  @ViewChild("ModalTraslado") ModalTraslado: any;
  @ViewChild("saveSwal") saveSwal: any;
  
  proveedorOrigen = false;
  ClienteOrigen = false;
  cuentaBancariaOrigen = false;
  cajaOrigen = false;

  proveedorDestino = false;
  cuentaBancariaDestino = false;
  ClienteDestino = false;
  cajaDestino = false;

  CuentaBancariaDestino=[];
  ClientesDestino = [];
  ProveedoresDestino=[];
  CajaRecaudoDestino=[];

  CajaRecaudo=[];
  CuentaBancariaOrigen=[];
  Proveedores = [];
  Clientes = [];

  conteoTraslados = [];
  traslados = [];


  constructor(private http: HttpClient, private globales: Globales) {

  }

  ngOnInit() {
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

    this.ActualizarVista();
    this.user = JSON.parse(localStorage.User);

  }

  ActualizarVista() {
    this.IdentificacionFuncionario = JSON.parse(localStorage['User']).Identificacion_Funcionario;
    
    //cuentas bancarias
    this.http.get(this.globales.ruta + 'php/bancos/lista_cuentas_bancarias.php').subscribe((data: any) => {
      this.CuentaBancariaOrigen = data;
      this.CuentaBancariaDestino = data;
    });
    this.http.get(this.globales.ruta + 'php/terceros/lista_personas.php').subscribe((data: any) => {
      this.Clientes = data.cliente;
      this.Proveedores = data.proveedor;
      this.CajaRecaudo = data.cajaRecaudo;
      this.ClientesDestino = data.cliente;
      this.ProveedoresDestino = data.proveedor;
      this.CajaRecaudoDestino = data.cajaRecaudo;
    });
    this.http.get(this.globales.ruta + 'php/traslados/conteo.php').subscribe((data: any) => {
      this.conteoTraslados = data[0];
    });

    this.http.get(this.globales.ruta + 'php/traslados/lista.php').subscribe((data: any) => {
      this.traslados = data;
      this.dtTrigger.next();
    });

  }

  consultas(){
    this.http.get(this.globales.ruta + 'php/bancos/lista_cuentas_bancarias.php').subscribe((data: any) => {
      this.CuentaBancariaOrigen = data;
      this.CuentaBancariaDestino = data;
    });
    this.http.get(this.globales.ruta + 'php/terceros/lista_personas.php').subscribe((data: any) => {
      this.Clientes = data.cliente;
      this.Proveedores = data.proveedor;
      this.CajaRecaudo = data.cajaRecaudo;
      this.ClientesDestino = data.cliente;
      this.ProveedoresDestino = data.proveedor;
      this.CajaRecaudoDestino = data.cajaRecaudo;
    });
    this.http.get(this.globales.ruta + 'php/traslados/conteo.php').subscribe((data: any) => {
      this.conteoTraslados = data[0];
    });
  }

  CasoTraslado(valor) {
    switch (valor) {
      case "1": {
        /*
          <option value="1">Entre proveedores</option>
        */
        this.proveedorOrigen = true;
        this.proveedorDestino = true;
        this.cuentaBancariaOrigen = false;
        this.cuentaBancariaDestino = false;
        this.ClienteOrigen = false;
        this.ClienteDestino = false;
        break;
      }
      case "2": {
        /*
          <option value="2">Proveedor a cuenta bancaria</option>
        */
        this.proveedorOrigen = true;
        this.cuentaBancariaOrigen = true;
        this.proveedorDestino = false;
        this.cuentaBancariaDestino = false;
        this.ClienteOrigen = false;
        this.ClienteDestino = false;
        break;
      }
      case "3": {
        /*
          <option value="3">Entre cuentas bancarias</option>
        */
        this.cuentaBancariaOrigen = true;
        this.cuentaBancariaDestino = true;
        this.proveedorOrigen = false;
        this.proveedorDestino = false;
        this.ClienteOrigen = false;
        this.ClienteDestino = false;
        break;
      }
      case "4": {
        /*
          <option value="4">Entre clientes</option>
        */
        this.ClienteOrigen = true;
        this.ClienteDestino = true;
        this.proveedorOrigen = false;
        this.proveedorDestino = false;
        this.cuentaBancariaOrigen = false;
        this.cuentaBancariaDestino = false;
        break;
      }
      case "5": {
        /*
          <option value="5">Cliente a proveedor</option>
        */
        this.ClienteOrigen = true;
        this.proveedorOrigen = true;
        this.proveedorDestino = false;
        this.cuentaBancariaOrigen = false;
        this.cuentaBancariaDestino = false;
        this.ClienteDestino = false;
        break;
      }
      case "6": {
        /*
          <option value="6">Cliente a cuenta bancaria</option>
        */
        this.ClienteOrigen = true;
        this.cuentaBancariaOrigen = true;
        this.proveedorOrigen = false;
        this.proveedorDestino = false;
        this.cuentaBancariaDestino = false;
        this.ClienteDestino = false;
        break;
      }
      default: {
        /*
          <option value="">Seleccione tipo de traslado</option>
        */
        this.proveedorOrigen = false;
        this.proveedorDestino = false;
        this.cuentaBancariaOrigen = false;
        this.cuentaBancariaDestino = false;
        this.ClienteOrigen = false;
        this.ClienteDestino = false;
        break;
      }
    }
  }

  Origen(valor){

    this.CajaRecaudo=[];
    this.CuentaBancariaOrigen=[];
    this.Proveedores = [];
    this.Clientes = [];
    this.consultas();

    switch(valor){
      case "Cliente":{
        this.proveedorOrigen = false;
        this.ClienteOrigen = true;
        this.cuentaBancariaOrigen = false;
        this.cajaOrigen = false;
        break;}
      case "Proveedor":{
        this.proveedorOrigen = true;
        this.ClienteOrigen = false;
        this.cuentaBancariaOrigen = false;
        this.cajaOrigen = false;
        break;}
      case "Cuenta Bancaria":{
        this.proveedorOrigen = false;
        this.ClienteOrigen = false;
        this.cuentaBancariaOrigen = true;
        this.cajaOrigen = false;
        break;}
      case "Caja Recaudo":{
        this.proveedorOrigen = false;
        this.ClienteOrigen = false;
        this.cuentaBancariaOrigen = false;
        this.cajaOrigen = true;
        break;}
      default:{
       this.proveedorOrigen = false;
       this.ClienteOrigen = false;
       this.cuentaBancariaOrigen = false;
       this.cajaOrigen = false;
        break;
      }
    }

  }

  Destino(valor){
    
    this.CuentaBancariaDestino=[];
    this.ClientesDestino = [];
    this.ProveedoresDestino=[];
    this.CajaRecaudoDestino=[];
    this.consultas();

    switch(valor){
      case "Cliente":{
        this.proveedorDestino = false;
        this.ClienteDestino = true;
        this.cuentaBancariaDestino = false;
        this.cajaDestino = false;
        break;}
      case "Proveedor":{
        this.proveedorDestino = true;
        this.ClienteDestino = false;
        this.cuentaBancariaDestino = false;
        this.cajaDestino = false;
        break;}
      case "Cuenta Bancaria":{
        this.proveedorDestino = false;
        this.ClienteDestino = false;
        this.cuentaBancariaDestino = true;
        this.cajaDestino = false;
        break;}
      case "Caja Recaudo":{
        this.proveedorDestino = false;
        this.ClienteDestino = false;
        this.cuentaBancariaDestino = false;
        this.cajaDestino = true;
        break;}
      default:{
       this.proveedorDestino = false;
       this.ClienteDestino = false;
       this.cuentaBancariaDestino = false;
       this.cajaDestino = false;
        break;
      }
    }
  }

  cuentaBancariaDestinatario(pos){
    this.http.get(this.globales.ruta + 'php/bancos/lista_cuentas_bancarias.php').subscribe((data: any) => {
      this.CuentaBancariaDestino = data;
      this.CuentaBancariaDestino.splice((pos-1),1);
    });    
  }

  proveedorDestinatario(pos){
    console.log(pos)
    this.http.get(this.globales.ruta + 'php/terceros/lista_personas.php').subscribe((data: any) => {
      this.ProveedoresDestino = data.proveedor;
      var index = this.ProveedoresDestino.findIndex(x => x.Id_Tercero === pos);
      this.ProveedoresDestino.splice(index,1);
    });
  }

  CajaRecaudoDestinatario(pos){
    this.http.get(this.globales.ruta + 'php/terceros/lista_personas.php').subscribe((data: any) => {
      this.CajaRecaudoDestino = data.cajaRecaudo;
      this.CajaRecaudoDestino.splice((pos-1),1);
    });
  }

  ClienteDestinatario(pos){
    console.log(pos);
    this.http.get(this.globales.ruta + 'php/terceros/lista_personas.php').subscribe((data: any) => {
      this.ClientesDestino = data.cliente;
      var index = this.ClientesDestino.findIndex(x => x.Id_Tercero === pos);      
      this.ClientesDestino.splice(index,1);
    });    
  }

  GuardarTraslado(formulario: NgForm, modal){
      let info = JSON.stringify(formulario.value);
      let datos = new FormData();
      datos.append("modulo",'Traslado');
      datos.append("datos",info);
      this.http.post(this.globales.ruta+'php/genericos/guardar_generico.php',datos)
      .subscribe((data:any)=>{
        formulario.reset();
        this.ActualizarVista();  
        this.saveSwal.show();
        modal.hide();
      });
  }

}
