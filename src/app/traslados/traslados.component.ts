import '../../assets/charts/amchart/amcharts.js';
import '../../assets/charts/amchart/gauge.js';
import '../../assets/charts/amchart/pie.js';
import '../../assets/charts/amchart/serial.js';
import '../../assets/charts/amchart/light.js';
import '../../assets/charts/amchart/ammap.js';
import '../../assets/charts/amchart/worldLow.js';
import '../../assets/charts/amchart/continentsLow.js';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild, HostListener, TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { Globales } from '../shared/globales/globales';

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
  @ViewChild("confirmacionSwal") confirmacionSwal: any;
  @ViewChild("ModalEditarTraslado") ModalEditarTraslado: any;

  proveedorOrigen = false;
  ClienteOrigen = false;
  cuentaBancariaOrigen = false;
  cajaOrigen = false;

  proveedorDestino = false;
  cuentaBancariaDestino = false;
  ClienteDestino = false;
  cajaDestino = false;

  CuentaBancariaDestino = [];
  ClientesDestino = [];
  ProveedoresDestino = [];
  CajaRecaudoDestino = [];

  CajaRecaudo = [];
  CuentaBancariaOrigen = [];
  Proveedores = [];
  Clientes = [];

  conteoTraslados = [];
  traslados = [];
  Identificacion: any;
  codigo_Formato: string;
  verTraslado = [];
  edicionTraslado = [];
  movimiento = [];

  constructor(private http: HttpClient, private globales: Globales) {

  }

  ngOnInit() {
    this.ActualizarVista();
    this.user = JSON.parse(localStorage.User);
    this.IdentificacionFuncionario = JSON.parse(localStorage['User']).Identificacion_Funcionario;
  }

  ActualizarVista() {
    this.consultas();

    this.http.get(this.globales.ruta + 'php/traslados/lista.php').subscribe((data: any) => {
      this.traslados = data;
      
    });
  }

  consultas() {
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
      
      var chart = AmCharts.makeChart("chartdiv1", {
        "type": "pie",
        "theme": "light",
        "dataProvider": data,
        "titleField": "Nombre",
        "valueField": "Conteo",
        "labelRadius": 5,
        "radius": "42%",
        "innerRadius": "60%",
        "labelText": "",
        "export": {
          "enabled": true
        },
        "legend": {
          "position": "bottom",
          "marginRight": 0,
          "autoMargins": false
        }
      });

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

  Origen(valor) {

    this.CajaRecaudo = [];
    this.CuentaBancariaOrigen = [];
    this.Proveedores = [];
    this.Clientes = [];
    this.consultas();

    switch (valor) {
      case "Cliente": {
        this.proveedorOrigen = false;
        this.ClienteOrigen = true;
        this.cuentaBancariaOrigen = false;
        this.cajaOrigen = false;
        break;
      }
      case "Proveedor": {
        this.proveedorOrigen = true;
        this.ClienteOrigen = false;
        this.cuentaBancariaOrigen = false;
        this.cajaOrigen = false;
        break;
      }
      case "Cuenta Bancaria": {
        this.proveedorOrigen = false;
        this.ClienteOrigen = false;
        this.cuentaBancariaOrigen = true;
        this.cajaOrigen = false;
        break;
      }
      case "Caja Recaudo": {
        this.proveedorOrigen = false;
        this.ClienteOrigen = false;
        this.cuentaBancariaOrigen = false;
        this.cajaOrigen = true;
        break;
      }
      default: {
        this.proveedorOrigen = false;
        this.ClienteOrigen = false;
        this.cuentaBancariaOrigen = false;
        this.cajaOrigen = false;
        break;
      }
    }

  }

  Destino(valor) {

    this.CuentaBancariaDestino = [];
    this.ClientesDestino = [];
    this.ProveedoresDestino = [];
    this.CajaRecaudoDestino = [];
    this.consultas();

    switch (valor) {
      case "Cliente": {
        this.proveedorDestino = false;
        this.ClienteDestino = true;
        this.cuentaBancariaDestino = false;
        this.cajaDestino = false;
        break;
      }
      case "Proveedor": {
        this.proveedorDestino = true;
        this.ClienteDestino = false;
        this.cuentaBancariaDestino = false;
        this.cajaDestino = false;
        break;
      }
      case "Cuenta Bancaria": {
        this.proveedorDestino = false;
        this.ClienteDestino = false;
        this.cuentaBancariaDestino = true;
        this.cajaDestino = false;
        break;
      }
      case "Caja Recaudo": {
        this.proveedorDestino = false;
        this.ClienteDestino = false;
        this.cuentaBancariaDestino = false;
        this.cajaDestino = true;
        break;
      }
      default: {
        this.proveedorDestino = false;
        this.ClienteDestino = false;
        this.cuentaBancariaDestino = false;
        this.cajaDestino = false;
        break;
      }
    }
  }

  cuentaBancariaDestinatario(pos) {
    this.http.get(this.globales.ruta + 'php/bancos/lista_cuentas_bancarias.php').subscribe((data: any) => {
      this.CuentaBancariaDestino = data;
      this.CuentaBancariaDestino.splice((pos - 1), 1);
    });
  }

  proveedorDestinatario(pos) {
    //console.log(pos)
    this.http.get(this.globales.ruta + 'php/terceros/lista_personas.php').subscribe((data: any) => {
      this.ProveedoresDestino = data.proveedor;
      var index = this.ProveedoresDestino.findIndex(x => x.Id_Tercero === pos);
      this.ProveedoresDestino.splice(index, 1);
    });
  }

  CajaRecaudoDestinatario(pos) {
    this.http.get(this.globales.ruta + 'php/terceros/lista_personas.php').subscribe((data: any) => {
      this.CajaRecaudoDestino = data.cajaRecaudo;
      this.CajaRecaudoDestino.splice((pos - 1), 1);
    });
  }

  ClienteDestinatario(pos) {
    //console.log(pos);
    this.http.get(this.globales.ruta + 'php/terceros/lista_personas.php').subscribe((data: any) => {
      this.ClientesDestino = data.cliente;
      var index = this.ClientesDestino.findIndex(x => x.Id_Tercero === pos);
      this.ClientesDestino.splice(index, 1);
    });
  }

  GuardarTraslado(formulario: NgForm, modal) {
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    datos.append("modulo", 'Traslado');
    datos.append("datos", info);
    datos.append("Identificacion_Funcionario", JSON.parse(localStorage['User']).Identificacion_Funcionario);
    this.http.post(this.globales.ruta + '/php/traslados/guardar_traslado.php', datos)
      .subscribe((data: any) => {
        formulario.reset();
        this.ActualizarVista();
        this.saveSwal.show();
        modal.hide();
      });
  }

  EstadoTraslado(value, estado) {
    let datos = new FormData();
    var titulo;
    var texto;
    datos.append("modulo", "Traslado");
    datos.append("id", value);
    switch (estado) {
      case "Activo": {
        datos.append("estado", "Activo");
        titulo = "Traslado Inactivado";
        texto = "Se ha inactivado correctamente el traslado seleccionado";
        break;
      }
      case "Inactivo": {
        datos.append("estado", "Inactivo");
        titulo = "Traslado Activado";
        texto = "Se ha Activado correctamente el traslado seleccionado";
        break;
      }
    }

    this.http.post(this.globales.ruta + 'php/genericos/anular_generico.php', datos).subscribe((data: any) => {
      this.confirmacionSwal.title = titulo;
      this.confirmacionSwal.text = texto;
      this.confirmacionSwal.type = "success";
      this.confirmacionSwal.show();
      this.ActualizarVista();
    });
  }

  VerTraslado(id, modal) {
    this.http.get(this.globales.ruta + 'php/traslados/traslado_ver.php', {
      params: { id: id }
    }).subscribe((data: any) => {
      this.Identificacion = id;
      this.codigo_Formato = ("0000" + this.Identificacion).slice(-4);
      this.verTraslado = data;
      modal.show();
    });
  }

  EditarTraslado(id, modal) {
    this.http.get(this.globales.ruta + 'php/genericos/detalle.php', {
      params: { modulo: 'Traslado', id: id }
    }).subscribe((data: any) => {
      //console.log(data);
      this.Identificacion = id;
      this.edicionTraslado = data;
      this.Origen(data.Origen);
      this.Destino(data.Destino);
      modal.show();
    });
  }

}
