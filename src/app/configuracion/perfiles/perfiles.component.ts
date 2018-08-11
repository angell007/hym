import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild, HostListener, Input } from '@angular/core';
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

  //public transfVerCh : any[];
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

  //Variables checkboxes
  public transfVerVal: boolean;
  public transfVerVal2: boolean;
  public transfVerMod: number;
  public transfEditarVal: boolean;
  public transfEditarVal2: boolean;
  public transfEditarMod: number;
  public transfEliminarVal: boolean;
  public transfEliminarVal2: boolean;
  public transfEliminarMod: number;
  public traslVerVal: boolean;
  public traslVerVal2: boolean;
  public traslVerMod: number;
  public traslEditarVal: boolean;
  public traslEditarVal2: boolean;
  public traslEditarMod: number;
  public traslEliminarVal: boolean;
  public traslEliminarVal2: boolean;
  public traslEliminarMod: number;
  public cajasVerVal: boolean;
  public cajasVerVal2: boolean;
  public cajasVerMod: number;
  public cajasEditarVal: boolean;
  public cajasEditarVal2: boolean;
  public cajasEditarMod: number;
  public cajasEliminarVal: boolean;
  public cajasEliminarVal2: boolean;
  public cajasEliminarMod: number;
  public girosVerVal: boolean;
  public girosVerVal2: boolean;
  public girosVerMod: number;
  public girosEditarVal: boolean;
  public girosEditarVal2: boolean;
  public girosEditarMod: number;
  public girosEliminarVal: boolean;
  public girosEliminarVal2: boolean;
  public girosEliminarMod: number;
  public corrVerVal: boolean;
  public corrVerVal2: boolean;
  public corrVerMod: number;
  public corrEditarVal: boolean;
  public corrEditarVal2: boolean;
  public corrEditarMod: number;
  public corrEliminarVal: boolean;
  public corrEliminarVal2: boolean;
  public corrEliminarMod: number;
  public servVerVal: boolean;
  public servVerVal2: boolean;
  public servVerMod: number;
  public servEditarVal: boolean;
  public servEditarVal2: boolean;
  public servEditarMod: number;
  public servEliminarVal: boolean;
  public servEliminarVal2: boolean;
  public servEliminarMod: number;
  public confVerVal: boolean;
  public confVerVal2: boolean;
  public confVerMod: number;
  public confEditarVal: boolean;
  public confEditarVal2: boolean;
  public confEditarMod: number;
  public confEliminarVal: boolean;
  public confEliminarVal2: boolean;
  public confEliminarMod: number;
  public indiVerVal: boolean;
  public indiVerVal2: boolean;
  public indiVerMod: number;
  public indiEditarVal: boolean;
  public indiEditarVal2: boolean;
  public indiEditarMod: number;
  public indiEliminarVal: boolean;
  public indiEliminarVal2: boolean;
  public indiEliminarMod: number;
  public reporVerVal: boolean;
  public reporVerVal2: boolean;
  public reporVerMod: number;
  public reporEditarVal: boolean;
  public reporEditarVal2: boolean;
  public reporEditarMod: number;
  public reporEliminarVal: boolean;
  public reporEliminarVal2: boolean;
  public reporEliminarMod: number;

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

  constructor(private http : HttpClient, private globales : Globales) { }

  ngOnInit() {
    this.ActualizarVista();
    this.transfVerMod = 0;
    this.transfEditarMod = 0;
    this.transfEliminarMod = 0;
    this.traslVerMod = 0;
    this.traslEditarMod = 0;
    this.traslEliminarMod = 0;
    this.cajasVerMod = 0;
    this.cajasEditarMod = 0;
    this.cajasEliminarMod = 0;
    this.girosVerMod = 0;
    this.girosEditarMod = 0;
    this.girosEliminarMod = 0;
    this.corrVerMod = 0;
    this.corrEditarMod = 0;
    this.corrEliminarMod = 0;
    this.servVerMod = 0;
    this.servEditarMod = 0;
    this.servEliminarMod = 0;
    this.confVerMod = 0;
    this.confEditarMod = 0;
    this.confEliminarMod = 0;
    this.indiVerMod = 0;
    this.indiEditarMod = 0;
    this.indiEliminarMod = 0;
    this.reporVerMod = 0;
    this.reporEditarMod = 0;
    this.reporEliminarMod = 0;
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
      //formulario.reset();
      this.customReset(); //Necesario para corregir ciertos bugs con los checkboxes
      //this.transfVerMod = 0;
      //this.transfEditarMod = 0;
      this.perfiles= data;
      this.InicializarBool();
      this.saveSwal.show();
    });
  }

  customReset()
  {
    this.nombreVal.reset();
    this.detallesVal.reset();
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

      if (data.TransfVer == 0) this.transfVerVal2 = false;
      if (data.TransfVer == 1) this.transfVerVal2 = true;
      if (data.TransfEditar == 0) this.transfEditarVal2 = false;
      if (data.TransfEditar == 1) this.transfEditarVal2 = true;
      if (data.TransfEliminar == 0) this.transfEliminarVal2 = false;
      if (data.TransfEliminar == 1) this.transfEliminarVal2 = true;
      if (data.TraslVer == 0) this.traslVerVal2 = false;
      if (data.TraslVer == 1) this.traslVerVal2 = true;
      if (data.TraslEditar == 0) this.traslEditarVal2 = false;
      if (data.TraslEditar == 1) this.traslEditarVal2 = true;
      if (data.TraslEliminar == 0) this.traslEliminarVal2 = false;
      if (data.TraslEliminar == 1) this.traslEliminarVal2 = true;
      if (data.CajasVer == 0) this.cajasVerVal2 = false;
      if (data.CajasVer == 1) this.cajasVerVal2 = true;
      if (data.CajasEditar == 0) this.cajasEditarVal2 = false;
      if (data.CajasEditar == 1) this.cajasEditarVal2 = true;
      if (data.CajasEliminar == 0) this.cajasEliminarVal2 = false;
      if (data.CajasEliminar == 1) this.cajasEliminarVal2 = true;
      if (data.GirosVer == 0) this.girosVerVal2 = false;
      if (data.GirosVer == 1) this.girosVerVal2 = true;
      if (data.GirosEditar == 0) this.girosEditarVal2 = false;
      if (data.GirosEditar == 1) this.girosEditarVal2 = true;
      if (data.GirosEliminar == 0) this.girosEliminarVal2 = false;
      if (data.GirosEliminar == 1) this.girosEliminarVal2 = true;
      if (data.CorrVer == 0) this.corrVerVal2 = false;
      if (data.CorrVer == 1) this.corrVerVal2 = true;
      if (data.CorrEditar == 0) this.corrEditarVal2 = false;
      if (data.CorrEditar == 1) this.corrEditarVal2 = true;
      if (data.CorrEliminar == 0) this.corrEliminarVal2 = false;
      if (data.CorrEliminar == 1) this.corrEliminarVal2 = true;
      if (data.ServVer == 0) this.servVerVal2 = false;
      if (data.ServVer == 1) this.servVerVal2 = true;
      if (data.ServEditar == 0) this.servEditarVal2 = false;
      if (data.ServEditar == 1) this.servEditarVal2 = true;
      if (data.ServEliminar == 0) this.servEliminarVal2 = false;
      if (data.ServEliminar == 1) this.servEliminarVal2 = true;
      if (data.ConfVer == 0) this.confVerVal2 = false;
      if (data.ConfVer == 1) this.confVerVal2 = true;
      if (data.ConfEditar == 0) this.confEditarVal2 = false;
      if (data.ConfEditar == 1) this.confEditarVal2 = true;
      if (data.ConfEliminar == 0) this.confEliminarVal2 = false;
      if (data.ConfEliminar == 1) this.confEliminarVal2 = true;
      if (data.IndiVer == 0) this.indiVerVal2 = false;
      if (data.IndiVer == 1) this.indiVerVal2 = true;
      if (data.IndiEditar == 0) this.indiEditarVal2 = false;
      if (data.IndiEditar == 1) this.indiEditarVal2 = true;
      if (data.IndiEliminar == 0) this.indiEliminarVal2 = false;
      if (data.IndiEliminar == 1) this.indiEliminarVal2 = true;
      if (data.ReporVer == 0) this.reporVerVal2 = false;
      if (data.ReporVer == 1) this.reporVerVal2 = true;
      if (data.ReporEditar == 0) this.reporEditarVal2 = false;
      if (data.ReporEditar == 1) this.reporEditarVal2 = true;
      if (data.ReporEliminar == 0) this.reporEliminarVal2 = false;
      if (data.ReporEliminar == 1) this.reporEliminarVal2 = true;

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
      this.TransfEditar = data.TransfEditar;
      this.TransfEliminar = data.TransfEliminar;
      this.TraslVer = data.TraslVer;
      this.TraslEditar = data.TraslEditar;
      this.TraslEliminar = data.TraslEliminar;
      this.CajasVer = data.CajasVer;
      this.CajasEditar = data.CajasEditar;
      this.CajasEliminar = data.CajasEliminar;
      this.GirosVer = data.GirosVer;
      this.GirosEditar = data.GirosEditar;
      this.GirosEliminar = data.GirosEliminar;
      this.CorrVer = data.CorrVer;
      this.CorrEditar = data.CorrEditar;
      this.CorrEliminar = data.CorrEliminar;
      this.ServVer = data.ServVer;
      this.ServEditar = data.ServEditar;
      this.ServEliminar = data.ServEliminar;
      this.ConfVer = data.ConfVer;
      this.ConfEditar = data.ConfEditar;
      this.ConfEliminar = data.ConfEliminar;
      this.IndiVer = data.IndiVer;
      this.IndiEditar = data.IndiEditar;
      this.IndiEliminar = data.IndiEliminar;
      this.ReporVer = data.ReporVer;
      this.ReporEditar = data.ReporEditar;
      this.ReporEliminar = data.ReporEliminar;
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
    this.TransfEditar = null;
    this.TransfEliminar = null;
    this.TraslVer = null;
    this.TraslEditar = null;
    this.TraslEliminar = null;
    this.CajasVer = null;
    this.CajasEditar = null;
    this.CajasEliminar = null;
    this.GirosVer = null;
    this.GirosEditar = null;
    this.GirosEliminar = null;
    this.CorrVer = null;
    this.CorrEditar = null;
    this.CorrEliminar = null;
    this.ServVer = null;
    this.ServEditar = null;
    this.ServEliminar = null;
    this.ConfVer = null;
    this.ConfEditar = null;
    this.ConfEliminar = null;
    this.IndiVer = null;
    this.IndiEditar = null;
    this.IndiEliminar = null;
    this.ReporVer = null;
    this.ReporEditar = null;
    this.ReporEliminar = null;
    modal.hide();
  }

  Cerrar(modal){
    this.OcultarFormulario(modal)
  }
}
