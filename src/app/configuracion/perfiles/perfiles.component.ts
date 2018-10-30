import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild, HostListener, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Globales } from '../../shared/globales/globales';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-perfiles',
  templateUrl: './perfiles.component.html',
  styleUrls: ['./perfiles.component.css']
})
export class PerfilesComponent implements OnInit {
  public perfiles : any[];

  //variables de formulario
  public Identificacion : any[];
  public Nombre : any[];
  public Detalle : any[];
  public TransfVer : any[];
  public TransfEditar : any[];
  public TransfEliminar : any[];
  public TraslVer : any[];
  public TraslEditar : any[];
  public TraslEliminar : any[];
  public CajasVer : any[];
  public CajasEditar : any[];
  public CajasEliminar : any[];
  public GirosVer : any[];
  public GirosEditar : any[];
  public GirosEliminar : any[];
  public CorrVer : any[];
  public CorrEditar : any[];
  public CorrEliminar : any[];
  public ServVer : any[];
  public ServEditar : any[];
  public ServEliminar : any[];
  public ConfVer : any[];
  public ConfEditar : any[];
  public ConfEliminar : any[];
  public IndiVer : any[];
  public IndiEditar : any[];
  public IndiEliminar : any[];
  public ReporVer : any[];
  public ReporEditar : any[];
  public ReporEliminar : any[];

 

 
  public boolNombre:boolean = false;
  //public boolTransfVer:boolean = false;
  public isFocused:boolean = false;
  
  @ViewChild('nombre') nombreVal:any;
  @ViewChild('detalles') detallesVal:any;

  @ViewChild('ModalPerfil') ModalPerfil:any;
  @ViewChild('ModalVerPerfil') ModalVerPerfil:any;
  @ViewChild('ModalEditarPerfil') ModalEditarPerfil:any;
  @ViewChild('FormPerfil') FormPerfil:any;
  @ViewChild('errorSwal') errorSwal:any;
  @ViewChild('saveSwal') saveSwal:any;
  @ViewChild('deleteSwal') deleteSwal:any;

  @ViewChild('confirmacionSwal') confirmacionSwal: any;

  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();

  constructor(private http : HttpClient, private globales : Globales) { }

  ngOnInit() {
    this.ActualizarVista();
  }

   ActualizarVista(){

    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', {
      params: { modulo: 'Perfil' }
    }).subscribe((data: any) => {
      this.perfiles= data;
    });

  }  

  GuardarPerfil(formulario: NgForm, modal){
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    datos.append("modulo",'Perfil');
    datos.append("datos",info);
    //console.log(datos);
    this.http.post(this.globales.ruta+'php/genericos/guardar_generico.php',datos)
    .subscribe((data:any)=>{
     formulario.reset();
      this.perfiles= data;
      this.saveSwal.show();
    });
  }

  VerPerfil(id, modal){
    this.http.get(this.globales.ruta+'php/perfiles/detalle_perfil.php',{
      params:{id:id}
    }).subscribe((data:any)=>{
      this.Identificacion = id;
      this.Nombre = data.Nombre;
      this.Detalle = data.Detalle;

      modal.show();
    });
  }

  EditarPerfil(id){
    this.http.get(this.globales.ruta+'php/genericos/detalle.php',{
      params:{modulo:'Perfil', id:id}
    }).subscribe((data:any)=>{
      this.Identificacion = id;
      this.Nombre = data.Nombre;
      this.Detalle = data.Detalle;

     
      this.ModalEditarPerfil.show();
    });
  }

  EliminarPerfil(id){
    let datos = new FormData();
    datos.append("modulo", 'Perfil');
    datos.append("id", id); 
    this.http.post(this.globales.ruta + 'php/genericos/eliminar_generico.php', datos ).subscribe((data: any) => {
      this.deleteSwal.show();
      this.ActualizarVista();
    });
  }


  EstadoPerfil(value, estado){
    let datos = new FormData();
    var titulo;
    var texto;
    datos.append("modulo", "Perfil");
    datos.append("id", value);
    switch(estado){
      case "Activo":{
        datos.append("estado", "Activo");
        titulo = "Perfil Inactivado";
        texto ="Se ha inactivado correctamente el perfil seleccionado";
        break;
      }
      case "Inactivo":{
        datos.append("estado", "Inactivo");
        titulo = "Perfil Activado";
        texto ="Se ha Activado correctamente el perfil seleccionado";
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
}
