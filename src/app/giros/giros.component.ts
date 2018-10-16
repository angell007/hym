import '../../assets/charts/amchart/amcharts.js';
import '../../assets/charts/amchart/gauge.js';
import '../../assets/charts/amchart/pie.js';
import '../../assets/charts/amchart/serial.js';
import '../../assets/charts/amchart/light.js';
import '../../assets/charts/amchart/ammap.js';
import '../../assets/charts/amchart/worldLow.js';
import '../../assets/charts/amchart/continentsLow.js';
import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Globales } from '../shared/globales/globales';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-giros',
  templateUrl: './giros.component.html',
  styleUrls: ['./giros.component.css']
})
export class GirosComponent implements OnInit {

  public fecha = new Date();
  public giros = [];

  public Identificacion: any[];

  public Giro: any[];

  public Datos : any[] = [];
  public Origen : any[] = [];
  public Nombre_Remitente : any[] = [];
  public Documento_Remitente : any[] = [];
  public Telefono_Remitente : any[] = [];
  public Nombre_Destinatario : any[] = [];
  public Documento_Destinatario : any[] = [];
  public Telefono_Destinatario : any[] = [];
  public Valor_Recibido : any[] = [];
  public Valor_Entrega : any[] = [];
  public Comision : any[] = [];
  public Detalle : any[] = [];
  public Estado : any[] = [];
  public IdentificacionFuncionario: any[];
  DatosRemitenteEditarGiro=[];
  DatosDestinatario = [];
  DatosDestinatarioEditarGiro = [];
  Departamento_Remitente: any;
  Departamento_Destinatario: any;
  Municipios_Remitente = [];
  Municipios_Destinatario = [];
  Remitente = [];
  Destinatario= [];
  ValorEnviar: any;
  idGiro: any;
  public Costo: number;
  public ValorTotal: number;
  public ValorEntrega: number;

  @ViewChild('deleteSwal') deleteSwal:any;
  @ViewChild('errorSwal') errorSwal:any;
  @ViewChild('saveSwal') saveSwal:any;
  @ViewChild('ModalGiroEditar') ModalGiroEditar: any;  
  @ViewChild('confirmacionSwal') confirmacionSwal: any;
  @ViewChild('ModalDevolucionGiro') ModalDevolucionGiro: any;
  
  /*public Origen : any[];
  public Remitente : any[];
  public Destinatario : any[];
  public Monto : any[];
  public Estado : any[];*/

  conteoGiros = [];

  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();

  GiroComision = [];
  Departamentos = [];
  IdOficina: number;
  IdCaja: number;
  IdentificacionGiro: any;
  
  constructor(private http: HttpClient, private globales: Globales) { }

  ngOnInit() {
    this.IdentificacionFuncionario = JSON.parse(localStorage['User']).Identificacion_Funcionario;
    this.IdOficina = 5;
    this.IdCaja = 4;
    this.http.get(this.globales.ruta + 'php/giros/lista.php').subscribe((data: any) => {
      this.giros = data;
    });

    this.http.get(this.globales.ruta + 'php/giros/conteo.php').subscribe((data: any) => {
      this.conteoGiros = data[0];
    });
    this.ActualizarVista();

    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Giro_Comision' } }).subscribe((data: any) => {
      this.GiroComision = data;
    });

    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Departamento' } }).subscribe((data: any) => {
      this.Departamentos = data;
    });

  }

  VerGiro(id, modal) {
    this.http.get(this.globales.ruta + 'php/giros/detalle.php', {
      params: { modulo: 'Giro', id: id }
    }).subscribe((data: any) => {
      this.Giro = data;
      this.Identificacion = id;

      //this.Datos=data;
      this.Origen=data.Origen;
      this.Nombre_Remitente=data.Nombre_Remitente;
      this.Documento_Remitente=data.Documento_Remitente;
      this.Telefono_Remitente=data.Telefono_Remitente;
      this.Nombre_Destinatario=data.Nombre_Destinatario;
      this.Documento_Destinatario=data.Documento_Destinatario;
      this.Telefono_Destinatario=data.Telefono_Destinatario;
      this.Valor_Recibido=data.Valor_Recibido;
      this.Valor_Entrega=data.Valor_Entrega;
      this.Comision=data.Comision;
      this.Detalle=data.Detalle;
      this.Estado=data.Estado;
      this.Identificacion = id;

      modal.show();
    });
  }


  EditarGiro(id){
    
    this.http.get(this.globales.ruta + '/php/pos/detalle_giro.php', { params: { modulo: 'Giro', id: id } }).subscribe((data: any) => {
      this.idGiro = id;
      this.Giro = data.giro;
      this.Remitente = data.remitente;
      this.Destinatario = data.destinatario;
      this.ModalGiroEditar.show();
      this.ValorEnviar = data.giro.ValorEnviar;
      this.valorComision(data.giro.Valor_Total);
      this.Municipios_Departamento(data.remitente.Id_Departamento, 'Remitente');
      this.Municipios_Departamento(data.destinatario.Id_Departamento, 'Destinatario');
      this.Departamento_Remitente = this.Departamentos[data.remitente.Id_Departamento].Nombre;
      this.Departamento_Destinatario = this.Departamentos[data.destinatario.Id_Departamento].Nombre;
      this.DatosRemitenteEditarGiro = data.remitente.DatosRemitenteEditarGiro;
      this.DatosDestinatarioEditarGiro = data.destinatario.DatosDestinatarioEditarGiro;
    });
  }

  Municipios_Departamento(Departamento, tipo) {
    this.http.get(this.globales.ruta + 'php/genericos/municipios_departamento.php', { params: { id: Departamento } }).subscribe((data: any) => {
      switch (tipo) {
        case "Remitente": {
          this.Municipios_Remitente = data;
          this.Departamento_Remitente = this.Departamentos[(Departamento) - 1].Nombre;
          break;
        }
        case "Destinatario": {
          this.Municipios_Destinatario = data;
          this.Departamento_Destinatario = this.Departamentos[(Departamento) - 1].Nombre;
          break;
        }

      }
    });
  }

  valorComision(value) {
    this.ValorEnviar = value;
    this.GiroComision.forEach(element => {
      if ((parseFloat(element.Valor_Minimo) < parseFloat(value)) && (parseFloat(value) < parseFloat(element.Valor_Maximo))) {
        this.Costo = element.Comision;
      }

      var checkeado = ((document.getElementById("libre") as HTMLInputElement).checked);
      switch (checkeado) {
        case true: {
          this.ValorTotal = parseFloat(value);
          this.ValorEntrega = parseFloat(value) + parseFloat(element.Comision);
          break;
        }
        case false: {
          this.ValorTotal = parseFloat(value) - element.Comision;
          this.ValorEntrega = parseFloat(value);
          break;
        }
      }
    });
  }

  ActualizarVista()
  {
    this.http.get(this.globales.ruta+'php/giros/lista.php').subscribe((data:any)=>{
      this.giros= data;      
    });

    this.http.get(this.globales.ruta+'/php/giros/fecha_giro.php').subscribe((data:any)=>{
      var chart = AmCharts.makeChart("chartdiv", {
        "theme": "light",
        "type": "serial",
        "dataProvider": data,
        "categoryField": "Mes",
        "depth3D": 20,
        "angle": 30,

        "categoryAxis": {
          "labelRotation": 90,
          "gridPosition": "start"
        },

        "valueAxes": [{
          "title": "Realizado"
        }],

        "graphs": [{
          "valueField": "Conteo",
          "colorField": "color",
          "type": "column",
          "lineAlpha": 0.1,
          "fillAlphas": 1
        }],

        "chartCursor": {
          "cursorAlpha": 0,
          "zoomable": false,
          "categoryBalloonEnabled": false
        },

        "export": {
          "enabled": true
        }
      });

    });   

  }
  
  AnularGiro(id){
    let datos = new FormData();
    datos.append("modulo", 'Giro');
    datos.append("id", id);
    this.http.post(this.globales.ruta + 'php/giros/anular_giro.php', datos).subscribe((data: any) => {
      this.confirmacionSwal.title = "Amulado con Exito";
      this.confirmacionSwal.text = "Se ha anulado correctamente el giro"
      this.confirmacionSwal.type = "success"
      this.confirmacionSwal.show();
      this.ActualizarVista();
    });
  }

  anulado(estado){
    switch(estado){
      case "Anulada" :{ return false}
      default: {return true}
    }
  }

  RealizarEdicionGiro(formulario: NgForm , modal) {
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    datos.append("datos", info);
    this.http.post(this.globales.ruta + 'php/pos/guardar_giro.php', datos).subscribe((data: any) => {
      modal.hide();
      this.confirmacionSwal.title = "Guardado con exito";
      this.confirmacionSwal.text = "Se ha guardado correctamente el giro"
      this.confirmacionSwal.type = "success"
      this.confirmacionSwal.show();      
      this.ActualizarVista();
    });
  }

  RealizarGiro(id){
    let datos = new FormData();
    datos.append("id", id);
    datos.append("Funcionario", JSON.parse(localStorage['User']).Identificacion_Funcionario);
    datos.append("Caja", "4");
    datos.append("Oficina", "5");
    datos.append("Estado", "Realizada");
    this.http.post(this.globales.ruta + 'php/giros/estado_giro.php', datos).subscribe((data: any) => {    

    });
  }

  DevolverGiro(id){
    this.IdentificacionGiro =id;
    this.ModalDevolucionGiro.show();
  }

  RealizarDevolucionGiro(formulario: NgForm){
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    datos.append("datos", info);
    datos.append("Funcionario", JSON.parse(localStorage['User']).Identificacion_Funcionario);
    datos.append("Caja", "4");
    datos.append("Oficina", "5");
    datos.append("Estado", "Devuelta");
    this.http.post(this.globales.ruta + 'php/giros/estado_giro.php', datos).subscribe((data: any) => {    
    });
  }

}
