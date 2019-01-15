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

  public Egresos : any = []=[];  
  public Grupos : any = [];
  public Terceros : any = [];
  public Monedas : any = [];

  //variables de formulario
  public Identificacion : any = [];
  public IdentificacionFuncionario : any = [];
  public IdGrupo : any = [];
  public IdTercero = "";
  public Moneda : any = [];
  public Valor : any = [];
  public Grupo : any = [];
  public Tercero : any = [];
  public Detalle : any = [];

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

  conteoEgresosGrafica = [];

  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();

  @ViewChild('deleteSwal') deleteSwal:any;
  @ViewChild('errorSwal') errorSwal:any;
  @ViewChild('confirmacionSwal') confirmacionSwal:any;
  @ViewChild('FormEgreso') FormEgreso:any;
  @ViewChild('ModalEgreso') ModalEgreso:any;
  @ViewChild('FormEditarEgreso') FormEditarEgreso:any;
  @ViewChild('ModalEditarEgreso') ModalEditarEgreso:any; 
  @ViewChild('ModalEgresoEditar') ModalEgresoEditar:any; 
  EgresoEditar:any = {};
  IdEgreso: any;
  
  constructor(private http : HttpClient, private colorConfig: ThemeConstants, private globales: Globales) { }

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
    this.http.get(this.globales.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Grupo'}}).subscribe((data:any)=>{
      this.Grupos= data;
    });
    this.http.get(this.globales.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Moneda'}}).subscribe((data:any)=>{
      this.Monedas= data;
    });
    this.IdentificacionFuncionario = JSON.parse(localStorage['User']).Identificacion_Funcionario;   
  }


  ActualizarVista()
  {
    this.http.get(this.globales.ruta+'php/egresos/lista_egresos.php').subscribe((data:any)=>{
      this.Egresos= data;
    });
 
    //Terceros
    this.http.get(this.globales.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Tercero'}}).subscribe((data:any)=>{
      this.Terceros= data;
    });

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

  GuardarEgreso(formulario: NgForm, modal){
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    datos.append("modulo",'Egreso');
    datos.append("datos",info);
    this.http.post(this.globales.ruta+'/php/egresos/egresos_guardar.php',datos)
    .subscribe((data:any)=>{
      modal.hide();
      this.ActualizarVista();
      formulario.reset();
    });
  }

  EditarEgreso(id){
    //IdEgreso
    this.http.get(this.globales.ruta +'php/genericos/detalle.php',{
      params:{modulo:'Egreso', id:id}
    }).subscribe((data:any)=>{
      this.IdEgreso = id;
      this.EgresoEditar = data;
      this.ModalEgresoEditar.show();    
    });
  }

  AnularEgreso(id,estado){
    let datos = new FormData();
    datos.append("modulo",'Egreso');
    datos.append("id",id);
    datos.append("estado",estado);
    this.http.post(this.globales.ruta+'/php/genericos/anular_generico.php',datos)
    .subscribe((data:any)=>{
      this.ActualizarVista();      
    });
  }

  ListaTerceros(event:any){
    console.log(event);
    
  }
}
