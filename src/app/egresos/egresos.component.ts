import 'rxjs/add/observable/throw';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ThemeConstants } from '../shared/config/theme-constant';
import { NgForm } from '../../../node_modules/@angular/forms';
import { Globales } from '../shared/globales/globales';
import { Subject } from '../../../node_modules/rxjs/Subject';

@Component({
  selector: 'app-egresos',
  templateUrl: './egresos.component.html',
  styleUrls: ['./egresos.component.scss']
})
export class EgresosComponent implements OnInit {

  public Egresos : any[]=[];  
  public Grupos : any[];
  public Terceros : any[];
  public Monedas : any[];

  //variables de formulario
  public Identificacion : any[];
  public IdentificacionFuncionario : any[];
  public IdGrupo : any[];
  public IdTercero = "";
  public Moneda : any[];
  public Valor : any[];
  public Grupo : any[];
  public Tercero : any[];
  public Detalle : any[];

  public tEnero: Number;
  public tFebrero: Number;
  public tMarzo: Number;
  public tAbril: Number;
  public tMayo: Number;
  public tJunio: Number;
  public tJulio: Number;
  public tAgosto: Number;
  public tSeptiembre: Number;
  public tOctubre: Number;
  public tNoviembre: Number;
  public tDiciembre: Number;
  public teEnero: Number;
  public teFebrero: Number;
  public teMarzo: Number;
  public teAbril: Number;
  public teMayo: Number;
  public teJunio: Number;
  public teJulio: Number;
  public teAgosto: Number;
  public teSeptiembre: Number;
  public teOctubre: Number;
  public teNoviembre: Number;
  public teDiciembre: Number;

  public boolGrupo:boolean = false;
  public boolTercero:boolean = false;
  public boolMoneda:boolean = false;
  public boolValor:boolean = false;
  public user : any;

  //Valores por defecto
  grupoDefault: string = "";
  monedaDefault: string = "";
  terceroDefault: string = "";

  conteoEgresosGrafica = [];

  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();

  readonly ruta = 'https://hym.corvuslab.co/';
  @ViewChild('deleteSwal') deleteSwal:any;
  @ViewChild('errorSwal') errorSwal:any;
  @ViewChild('confirmacionSwal') confirmacionSwal:any;
  @ViewChild('FormEgreso') FormEgreso:any;
  @ViewChild('ModalEgreso') ModalEgreso:any;
  @ViewChild('FormEditarEgreso') FormEditarEgreso:any;
  @ViewChild('ModalEditarEgreso') ModalEditarEgreso:any; 

  constructor(private http : HttpClient, private colorConfig: ThemeConstants, private globales: Globales) {
   /* this.fetchFilterData((data) => {
      this.tempFilter = [...data];
      this.rowsFilter = data;
    });*/
   }

  themeColors = this.colorConfig.get().colors;
  //Line Chart Config
  public lineChartLabels: Array<any> = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  public lineChartData: Array<any> = [
    { data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Egresos Montados' },
  ];;
  public lineChartOptions: any = {
    scales: {
      yAxes: [
        {
          id: 'y-axis-1',
          type: 'linear',
          display: true,
          beginAtZero:true
        },
        {
          id: 'y-axis-2',
          type: 'linear',
          display: false
        }
      ]
    }
  };
  public lineChartLegend: boolean = false;
  public lineChartType: string = 'line';
  public lineChartColors: Array<any> = [
    {
      backgroundColor: this.themeColors.infoInverse,
      borderColor: this.themeColors.info
    },
    {
      backgroundColor: this.themeColors.successInverse,
      borderColor: this.themeColors.success
    }
  ];

  ngOnInit() {
    this.ActualizarVista();
    this.user = JSON.parse(localStorage.User);
    this.http.get(this.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Grupo'}}).subscribe((data:any)=>{
      this.Grupos= data;
    });
    this.http.get(this.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Moneda'}}).subscribe((data:any)=>{
      this.Monedas= data;
    });
    this.IdentificacionFuncionario = JSON.parse(localStorage['User']).Identificacion_Funcionario;

    this.http.get(this.globales.ruta + 'php/egresos/conteo_grafica.php').subscribe((data: any) => {
      this.conteoEgresosGrafica = data[0];

      for (var key in this.conteoEgresosGrafica) {
        if (key == "TotalEgresosEnero") {
          this.tEnero = this.conteoEgresosGrafica[key];
        }
        if (key == "TotalEgresosFebrero") {
          this.tFebrero = this.conteoEgresosGrafica[key];
        }
        if (key == "TotalEgresosMarzo") {
          this.tMarzo = this.conteoEgresosGrafica[key];
        }
        if (key == "TotalEgresosAbril") {
          this.tAbril = this.conteoEgresosGrafica[key];
        }
        if (key == "TotalEgresosMayo") {
          this.tMayo = this.conteoEgresosGrafica[key];
        }
        if (key == "TotalEgresosJunio") {
          this.tJunio = this.conteoEgresosGrafica[key];
        }
        if (key == "TotalEgresosJulio") {
          this.tJulio = this.conteoEgresosGrafica[key];
        }
        if (key == "TotalEgresosAgosto") {
          this.tAgosto = this.conteoEgresosGrafica[key];
        }
        if (key == "TotalEgresosSeptiembre") {
          this.tSeptiembre = this.conteoEgresosGrafica[key];
        }
        if (key == "TotalEgresosOctubre") {
          this.tOctubre = this.conteoEgresosGrafica[key];
        }
        if (key == "TotalEgresosNoviembre") {
          this.tNoviembre = this.conteoEgresosGrafica[key];
        }
        if (key == "TotalEgresosDiciembre") {
          this.tDiciembre = this.conteoEgresosGrafica[key];
        }
      }

      this.lineChartData = [
        { data: [this.tEnero, this.tFebrero, this.tMarzo, this.tAbril, this.tMayo, this.tJunio, this.tJulio, this.tAgosto, this.tSeptiembre, this.tOctubre, this.tNoviembre, this.tDiciembre], label: 'Egresos Montados' }
      ];
    });
  }

  /*fetchFilterData(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', this.ruta+'php/egresos/lista_egresos.php');

    req.onload = () => {
      cb(JSON.parse(req.response));
    };

    req.send();
  } */

  OcultarFormularios()
  {
    this.InicializarBool();
    /*this.OcultarFormulario(this.ModalE);
    this.OcultarFormulario(this.ModalEditarTraslado);*/
  }

  InicializarBool()
  {
    this.boolGrupo = false;
    this.boolTercero = false;
    this.boolMoneda = false;
    this.boolValor = false;
  }

  ActualizarVista()
  {
    this.http.get(this.ruta+'php/egresos/lista_egresos.php').subscribe((data:any)=>{
      this.Egresos= data;
      this.dtTrigger.next();
    });
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      dom: 'Bfrtip',
      responsive: true,
      language: {
        processing: "Procesando...",
        search: "Buscar:",
        lengthMenu: "Mostrar MENU &eacute;l&eacute;ments",
        info: "Mostrando desde START al END de TOTAL elementos",
        infoEmpty: "Mostrando ningún elemento.",
        infoFiltered: "(filtrado MAX elementos total)",
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
  }

  ListaTerceros(grupo)
  {
    this.http.get(this.ruta+'php/egresos/lista_terceros.php',{ params: { id: grupo}}).subscribe((data:any)=>{
      this.Terceros= data;
    });
    this.terceroDefault = "";
    this.IdTercero = "";
  }

  ListaTercerosNoGrupo()
  {  
    this.http.get(this.globales.ruta+'php/terceros/lista_terceros.php').subscribe((data:any)=>{
      this.Terceros= data;        
    });
  }

  GuardarEgreso(formulario:NgForm, modal){

    formulario.value.Identificacion_Funcionario = JSON.parse(localStorage['User']).Identificacion_Funcionario; 
        
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    datos.append("modulo",'Egreso');
    datos.append("datos",info);
    this.http.post(this.ruta+'php/egresos/egresos_guardar.php',datos).subscribe((data:any)=>{      
      this.ActualizarVista();
      this.InicializarBool();
      this.grupoDefault = "";
      this.monedaDefault = "";
      this.terceroDefault = "";
      this.confirmacionSwal.title=data.titulo;
      this.confirmacionSwal.text= data.mensaje;
      this.confirmacionSwal.type= data.tipo;
      this.confirmacionSwal.show();
      this.FormEgreso.reset();
      this.ModalEgreso.hide();
    });
  }

  ActulizarEgreso(formulario:NgForm, modal){

    formulario.value.Identificacion_Funcionario = JSON.parse(localStorage['User']).Identificacion_Funcionario; 
        
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    datos.append("modulo",'Egreso');
    datos.append("datos",info);
    this.http.post(this.ruta+'php/egresos/egresos_editar.php',datos).subscribe((data:any)=>{      
      this.ActualizarVista();
      this.InicializarBool();
      this.grupoDefault = "";
      this.monedaDefault = "";
      this.terceroDefault = "";
      this.confirmacionSwal.title=data.titulo;
      this.confirmacionSwal.text= data.mensaje;
      this.confirmacionSwal.type= data.tipo;
      this.confirmacionSwal.show();
      this.FormEditarEgreso.reset();
      this.ModalEditarEgreso.hide();
    });
  }

  /*EliminarEgreso(id){
    let datos=new FormData();
    datos.append("modulo", 'Egreso');
    datos.append ("id",id);
    this.http.post(this.ruta + 'php/genericos/eliminar_generico.php', datos ).subscribe((data:any)=>{
      this.ActualizarVista();
      this.deleteSwal.show();
    });    
  }*/

  EliminarEgreso(id){
    let datos = new FormData();
    datos.append("modulo", 'Egreso');
    datos.append("id", id); 
    this.http.post(this.globales.ruta + 'php/egresos/egresos_anular.php', datos ).subscribe((data: any) => {
      this.deleteSwal.show();
      this.ActualizarVista();
    });
  }

  VerEgreso(id, modal){
    this.ListaTercerosNoGrupo();
    this.http.get(this.ruta+'php/egresos/egresos_ver.php',{
      params:{modulo:'Egreso', id:id}
    }).subscribe((data:any)=>{
      this.Identificacion = id;
      this.Grupos.forEach(element => {
        if (element.Id_Grupo == data.Id_Grupo) this.Grupo = element.Nombre;
      });

      this.Terceros.forEach(element => {
        if (element.Id_Tercero == data.Id_Tercero) this.Tercero = element.Nombre;
      });
      this.Moneda = data.Moneda;
      this.Valor = data.Valor;
      this.Detalle = data.Detalle;
      modal.show();
    });
  }

  EditarEgreso(id, modal){
    this.InicializarBool();
    this.http.get(this.ruta+'php/genericos/detalle.php',{
      params:{modulo:'Egreso', id:id}
    }).subscribe((data:any)=>{
      this.Identificacion = id;
      this.IdGrupo = data.Id_Grupo;
      this.AutoSleccionarTercero(this.IdGrupo, data.Id_Tercero);
      this.Moneda = data.Moneda;
      this.Valor = data.Valor;
      this.Detalle = data.Detalle;
      modal.show();
    });
  }

  AutoSleccionarTercero(grupo, tercero){
    this.http.get(this.ruta+'php/egresos/lista_terceros.php',{ params: { id: grupo}}).subscribe((data:any)=>{
      this.Terceros= data;     
      this.IdTercero = tercero;
    });
  }

  /*OcultarFormulario(modal){
    this.Identificacion = null;
    this.IdGrupo = null;
    this.IdTercero = null;
    this.Moneda = null;
    this.Valor = null;
    this.Detalle = null;
    modal.hide();
  }*/



}
