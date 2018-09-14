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

  @ViewChild('deleteSwal') deleteSwal:any;
  @ViewChild('errorSwal') errorSwal:any;
  @ViewChild('saveSwal') saveSwal:any;

  /*public Origen : any[];
  public Remitente : any[];
  public Destinatario : any[];
  public Monto : any[];
  public Estado : any[];*/

  conteoGiros = [];

  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  
  constructor(private http: HttpClient, private globales: Globales) { }

  ngOnInit() {
    this.http.get(this.globales.ruta + 'php/giros/lista.php').subscribe((data: any) => {
      this.giros = data;
    });

    this.http.get(this.globales.ruta + 'php/giros/conteo.php').subscribe((data: any) => {
      this.conteoGiros = data[0];
    });
    this.ActualizarVista();
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

      console.log(this.Giro);
      console.log(this.Identificacion);
      /*this.Grupos.forEach(element => {
        if (element.Id_Grupo == data.Id_Grupo) this.Grupo = element.Nombre;
      });

      this.Terceros.forEach(element => {
        if (element.Id_Tercero == data.Id_Tercero) this.Tercero = element.Nombre;
      });
      this.Moneda = data.Moneda;
      this.Valor = data.Valor;
      this.Detalle = data.Detalle;*/
      modal.show();
    });
  }

  InicializarBool()
  {
  }

  EditarGiro(id, modal) {
    this.InicializarBool();
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
      this.IdentificacionFuncionario = data.Identificacion_Funcionario;
      
      modal.show();
    });
  }

  ActualizarVista()
  {
    this.http.get(this.globales.ruta+'php/giros/lista.php').subscribe((data:any)=>{
      this.giros= data;
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

  EliminarGiro(id){
    let datos = new FormData();
    datos.append("modulo", 'Giro');
    datos.append("id", id); 
    this.http.post(this.globales.ruta + 'php/genericos/anular_generico.php', datos ).subscribe((data: any) => {
      this.deleteSwal.show();
      this.ActualizarVista();
    });
  }

  AnularGiro(id){
    let datos = new FormData();
    datos.append("modulo", 'Giro');
    datos.append("id", id);
    this.http.post(this.globales.ruta + 'php/giros/anular_giro.php', datos).subscribe((data: any) => {
    });
  }

  anulado(estado){
    switch(estado){
      case "Anulada" :{ return false}
      default: {return true}
    }
  }

}
