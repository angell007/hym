import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Globales } from '../../shared/globales/globales';

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
  /*
  public TraslVer : any[];
  public CajasVer : any[];
  public GirosVer : any[];
  public CorrVer : any[];
  public ServVer : any[];
  public ConfVer : any[];
  public IndiVer : any[];
  public ReporVer : any[];
  public TransfEditar : any[];
  public TraslEditar : any[];
  public CajasEditar : any[];
  public GirosEditar : any[];
  public CorrEditar : any[];
  public ServEditar : any[];
  public ConfEditar : any[];
  public IndiEditar : any[];
  public ReporEditar : any[];
  public TransfEliminar : any[];
  public TraslEliminar : any[];
  public CajasEliminar : any[];
  public GirosEliminar : any[];
  public CorrEliminar : any[];
  public ServEliminar : any[];
  public ConfEliminar : any[];
  public IndiEliminar : any[];
  public ReporEliminar : any[];
*/

  public boolNombre:boolean = false;
  public boolTransfVer:boolean = false;
  public isFocused:boolean = false;
  
  @ViewChild('ModalPerfil') ModalPerfil:any;
  @ViewChild('ModalVerPerfil') ModalVerPerfil:any;
  @ViewChild('ModalEditarPerfil') ModalEditarPerfil:any;
  @ViewChild('FormPerfil') FormPerfil:any;
  @ViewChild('errorSwal') errorSwal:any;
  @ViewChild('saveSwal') saveSwal:any;
  @ViewChild('deleteSwal') deleteSwal:any;

  constructor(private http : HttpClient, private globales : Globales) { }

  ngOnInit() {
    this.ActualizarVista();
  }

  @HostListener('document:keyup', ['$event']) handleKeyUp(event) {
    if (event.keyCode === 27) {     
      this.OcultarFormularios();
    }
  }

  OcultarFormularios()
  {
    this.InicializarBool();
    this.OcultarFormulario(this.ModalPerfil);
    this.OcultarFormulario(this.ModalVerPerfil);
    this.OcultarFormulario(this.ModalEditarPerfil);
  }

  ActualizarVista(){
    this.http.get(this.globales.ruta+'php/perfiles/lista_perfiles.php').subscribe((data:any)=>{
      this.perfiles= data;
    });
  }

  InicializarBool()
  {
    this.boolNombre = false;
    this.boolTransfVer = false;
  }

  GuardarPerfil(formulario: NgForm, modal){
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    console.log(info);    
    datos.append("modulo",'Perfil');
    datos.append("datos",info);
    this.OcultarFormulario(modal);
    //console.log(datos);
    this.http.post(this.globales.ruta+'php/genericos/guardar_generico.php',datos)
    .catch(error => { 
      console.error('An error occurred:', error.error);
      this.errorSwal.show();
      return this.handleError(error);
    })
    .subscribe((data:any)=>{
      this.ActualizarVista();
      formulario.reset();
      this.InicializarBool();
      this.saveSwal.show();
    });
    
  }

  handleError(error: Response) {
    return Observable.throw(error);
  }

  VerPerfil(id, modal){
    this.http.get(this.globales.ruta+'php/perfiles/detalle_perfil.php',{
      params:{id:id}
    }).subscribe((data:any)=>{
      this.Identificacion = id;
      this.Nombre = data.Nombre;
      this.Detalle = data.Detalle;
      this.TransfVer = data.TransfVer;
      /*
      this.TraslVer = data.TraslVer;
      this.CajasVer = data.CajasVer;
      this.GirosVer = data.GirosVer;
      this.CorrVer = data.CorrVer;
      this.ServVer = data.ServVer;
      this.ConfVer = data.ConfVer;
      this.IndiVer = data.IndiVer;
      this.ReporVer = data.ReporVer;
      this.TransfEditar = data.TransfEditar;
      this.TraslEditar = data.TraslEditar;
      this.CajasEditar = data.CajasEditar;
      this.GirosEditar = data.GirosEditar;
      this.CorrEditar = data.CorrEditar;
      this.ServEditar = data.ServEditar;
      this.ConfEditar = data.ConfEditar;
      this.IndiEditar = data.IndiEditar;
      this.ReporEditar = data.ReporEditar;
      this.TransfEliminar = data.TransfEliminar;
      this.TraslEliminar = data.TraslEliminar;
      this.CajasEliminar = data.CajasEliminar;
      this.GirosEliminar = data.GirosEliminar;
      this.CorrEliminar = data.CorrEliminar;
      this.ServEliminar = data.ServEliminar;
      this.ConfEliminar = data.ConfEliminar;
      this.IndiEliminar = data.IndiEliminar;
      this.ReporEliminar = data.ReporEliminar;
      */
      modal.show();
    });
  }

  EditarPerfil(id){
    this.InicializarBool();
    this.http.get(this.globales.ruta+'php/genericos/detalle.php',{
      params:{modulo:'Perfil', id:id}
    }).subscribe((data:any)=>{
      this.Identificacion = id;
      this.Nombre = data.Nombre;
      this.Detalle = data.Detalle;
      this.TransfVer = data.TransfVer;
      /*
      this.TraslVer = data.TraslVer;
      this.CajasVer = data.CajasVer;
      this.GirosVer = data.GirosVer;
      this.CorrVer = data.CorrVer;
      this.ServVer = data.ServVer;
      this.ConfVer = data.ConfVer;
      this.IndiVer = data.IndiVer;
      this.ReporVer = data.ReporVer;
      this.TransfEditar = data.TransfEditar;
      this.TraslEditar = data.TraslEditar;
      this.CajasEditar = data.CajasEditar;
      this.GirosEditar = data.GirosEditar;
      this.CorrEditar = data.CorrEditar;
      this.ServEditar = data.ServEditar;
      this.ConfEditar = data.ConfEditar;
      this.IndiEditar = data.IndiEditar;
      this.ReporEditar = data.ReporEditar;
      this.TransfEliminar = data.TransfEliminar;
      this.TraslEliminar = data.TraslEliminar;
      this.CajasEliminar = data.CajasEliminar;
      this.GirosEliminar = data.GirosEliminar;
      this.CorrEliminar = data.CorrEliminar;
      this.ServEliminar = data.ServEliminar;
      this.ConfEliminar = data.ConfEliminar;
      this.IndiEliminar = data.IndiEliminar;
      this.ReporEliminar = data.ReporEliminar;
*/
      this.ModalEditarPerfil.show();
    });
  }

  

  EliminarPerfil(id){
    let datos = new FormData();
    datos.append("modulo", 'Perfil');
    datos.append("id", id); 
    this.http.post(this.globales.ruta + 'php/genericos/anular_generico.php', datos ).subscribe((data: any) => {
      this.deleteSwal.show();
      this.ActualizarVista();
    });
  }

  OcultarFormulario(modal)
  {
    this.Identificacion = null;
    this.Nombre = null;
    this.Detalle = null;
    this.TransfVer = null;
    /*
    this.TraslVer = null;
    this.CajasVer = null;
    this.GirosVer = null;
    this.CorrVer = null;
    this.ServVer = null;
    this.ConfVer = null;
    this.IndiVer = null;
    this.ReporVer = null;
    this.TransfEditar = null;
    this.TraslEditar = null;
    this.CajasEditar = null;
    this.GirosEditar = null;
    this.CorrEditar = null;
    this.ServEditar = null;
    this.ConfEditar = null;
    this.IndiEditar = null;
    this.ReporEditar = null;
    this.TransfEliminar = null;
    this.TraslEliminar = null;
    this.CajasEliminar = null;
    this.GirosEliminar = null;
    this.CorrEliminar = null;
    this.ServEliminar = null;
    this.ConfEliminar = null;
    this.IndiEliminar = null;
    this.ReporEliminar = null;
*/
    modal.hide();
  }

  Cerrar(modal){
    this.OcultarFormulario(modal)
  }
}
