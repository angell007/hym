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

  //Variables checkboxes
  public transfVerVal: boolean;
  public transfVerVal2: boolean;
  public transfVerVal3: boolean;
  public transfVerMod: number;
  public transfVerMod3: number;
  public transfEditarVal: boolean;
  public transfEditarVal2: boolean;
  public transfEditarVal3: boolean;
  public transfEditarMod: number;
  public transfEditarMod3: number;
  public transfEliminarVal: boolean;
  public transfEliminarVal2: boolean;
  public transfEliminarVal3: boolean;
  public transfEliminarMod: number;
  public transfEliminarMod3: number;
  public traslVerVal: boolean;
  public traslVerVal2: boolean;
  public traslVerVal3: boolean;
  public traslVerMod: number;
  public traslVerMod3: number;
  public traslEditarVal: boolean;
  public traslEditarVal2: boolean;
  public traslEditarVal3: boolean;
  public traslEditarMod: number;
  public traslEditarMod3: number;
  public traslEliminarVal: boolean;
  public traslEliminarVal2: boolean;
  public traslEliminarVal3: boolean;
  public traslEliminarMod: number;
  public traslEliminarMod3: number;
  public cajasVerVal: boolean;
  public cajasVerVal2: boolean;
  public cajasVerVal3: boolean;
  public cajasVerMod: number;
  public cajasVerMod3: number;
  public cajasEditarVal: boolean;
  public cajasEditarVal2: boolean;
  public cajasEditarVal3: boolean;
  public cajasEditarMod: number;
  public cajasEditarMod3: number;
  public cajasEliminarVal: boolean;
  public cajasEliminarVal2: boolean;
  public cajasEliminarVal3: boolean;
  public cajasEliminarMod: number;
  public cajasEliminarMod3: number;
  public girosVerVal: boolean;
  public girosVerVal2: boolean;
  public girosVerVal3: boolean;
  public girosVerMod: number;
  public girosVerMod3: number;
  public girosEditarVal: boolean;
  public girosEditarVal2: boolean;
  public girosEditarVal3: boolean;
  public girosEditarMod: number;
  public girosEditarMod3: number;
  public girosEliminarVal: boolean;
  public girosEliminarVal2: boolean;
  public girosEliminarVal3: boolean;
  public girosEliminarMod: number;
  public girosEliminarMod3: number;
  public corrVerVal: boolean;
  public corrVerVal2: boolean;
  public corrVerVal3: boolean;
  public corrVerMod: number;
  public corrVerMod3: number;
  public corrEditarVal: boolean;
  public corrEditarVal2: boolean;
  public corrEditarVal3: boolean;
  public corrEditarMod: number;
  public corrEditarMod3: number;
  public corrEliminarVal: boolean;
  public corrEliminarVal2: boolean;
  public corrEliminarVal3: boolean;
  public corrEliminarMod: number;
  public corrEliminarMod3: number;
  public servVerVal: boolean;
  public servVerVal2: boolean;
  public servVerVal3: boolean;
  public servVerMod: number;
  public servVerMod3: number;
  public servEditarVal: boolean;
  public servEditarVal2: boolean;
  public servEditarVal3: boolean;
  public servEditarMod: number;
  public servEditarMod3: number;
  public servEliminarVal: boolean;
  public servEliminarVal2: boolean;
  public servEliminarVal3: boolean;
  public servEliminarMod: number;
  public servEliminarMod3: number;
  public confVerVal: boolean;
  public confVerVal2: boolean;
  public confVerVal3: boolean;
  public confVerMod: number;
  public confVerMod3: number;
  public confEditarVal: boolean;
  public confEditarVal2: boolean;
  public confEditarVal3: boolean;
  public confEditarMod: number;
  public confEditarMod3: number;
  public confEliminarVal: boolean;
  public confEliminarVal2: boolean;
  public confEliminarVal3: boolean;
  public confEliminarMod: number;
  public confEliminarMod3: number;
  public indiVerVal: boolean;
  public indiVerVal2: boolean;
  public indiVerVal3: boolean;
  public indiVerMod: number;
  public indiVerMod3: number;
  public indiEditarVal: boolean;
  public indiEditarVal2: boolean;
  public indiEditarVal3: boolean;
  public indiEditarMod: number;
  public indiEditarMod3: number;
  public indiEliminarVal: boolean;
  public indiEliminarVal2: boolean;
  public indiEliminarVal3: boolean;
  public indiEliminarMod: number;
  public indiEliminarMod3: number;
  public reporVerVal: boolean;
  public reporVerVal2: boolean;
  public reporVerVal3: boolean;
  public reporVerMod: number;
  public reporVerMod3: number;
  public reporEditarVal: boolean;
  public reporEditarVal2: boolean;
  public reporEditarVal3: boolean;
  public reporEditarMod: number;
  public reporEditarMod3: number;
  public reporEliminarVal: boolean;
  public reporEliminarVal2: boolean;
  public reporEliminarVal3: boolean;
  public reporEliminarMod: number;
  public reporEliminarMod3: number;

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

    this.transfVerMod = 0;
    this.transfVerMod3 = 0;
    this.transfEditarMod = 0;
    this.transfEditarMod3 = 0;
    this.transfEliminarMod = 0;
    this.transfEliminarMod3 = 0;
    this.traslVerMod = 0;
    this.traslVerMod3 = 0;
    this.traslEditarMod = 0;
    this.traslEditarMod3 = 0;
    this.traslEliminarMod = 0;
    this.traslEliminarMod3 = 0;
    this.cajasVerMod = 0;
    this.cajasVerMod3 = 0;
    this.cajasEditarMod = 0;
    this.cajasEditarMod3 = 0;
    this.cajasEliminarMod = 0;
    this.cajasEliminarMod3 = 0;
    this.girosVerMod = 0;
    this.girosVerMod3 = 0;
    this.girosEditarMod = 0;
    this.girosEditarMod3 = 0;
    this.girosEliminarMod = 0;
    this.girosEliminarMod3 = 0;
    this.corrVerMod = 0;
    this.corrVerMod3 = 0;
    this.corrEditarMod = 0;
    this.corrEditarMod3 = 0;
    this.corrEliminarMod = 0;
    this.corrEliminarMod3 = 0;
    this.servVerMod = 0;
    this.servVerMod3 = 0;
    this.servEditarMod = 0;
    this.servEditarMod3 = 0;
    this.servEliminarMod = 0;
    this.servEliminarMod3 = 0;
    this.confVerMod = 0;
    this.confVerMod3 = 0;
    this.confEditarMod = 0;
    this.confEditarMod3 = 0;
    this.confEliminarMod = 0;
    this.confEliminarMod3 = 0;
    this.indiVerMod = 0;
    this.indiVerMod3 = 0;
    this.indiEditarMod = 0;
    this.indiEditarMod3 = 0;
    this.indiEliminarMod = 0;
    this.indiEliminarMod3 = 0;
    this.reporVerMod = 0;
    this.reporVerMod3 = 0;
    this.reporEditarMod = 0;
    this.reporEditarMod3 = 0;
    this.reporEliminarMod = 0;
    this.reporEliminarMod3 = 0;
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
    this.transfVerVal = false;
    this.transfEditarVal = false;
    this.transfEliminarVal = false;
    this.traslVerVal = false;
    this.traslEditarVal = false;
    this.traslEliminarVal = false;
    this.cajasVerVal = false;
    this.cajasEditarVal = false;
    this.cajasEliminarVal = false;
    this.girosVerVal = false;
    this.girosEditarVal = false;
    this.girosEliminarVal = false;
    this.corrVerVal = false;
    this.corrEditarVal = false;
    this.corrEliminarVal = false;
    this.servVerVal = false;
    this.servEditarVal = false;
    this.servEliminarVal = false;
    this.confVerVal = false;
    this.confEditarVal = false;
    this.confEliminarVal = false;
    this.indiVerVal = false;
    this.indiEditarVal = false;
    this.indiEliminarVal = false;
    this.reporVerVal = false;
    this.reporEditarVal = false;
    this.reporEliminarVal = false;
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


      if (data.TransfVer == 0) this.transfVerVal3 = false;
      if (data.TransfVer == 1) this.transfVerVal3 = true;
      if (data.TransfEditar == 0) this.transfEditarVal3 = false;
      if (data.TransfEditar == 1) this.transfEditarVal3 = true;
      if (data.TransfEliminar == 0) this.transfEliminarVal3 = false;
      if (data.TransfEliminar == 1) this.transfEliminarVal3 = true;
      if (data.TraslVer == 0) this.traslVerVal3 = false;
      if (data.TraslVer == 1) this.traslVerVal3 = true;
      if (data.TraslEditar == 0) this.traslEditarVal3 = false;
      if (data.TraslEditar == 1) this.traslEditarVal3 = true;
      if (data.TraslEliminar == 0) this.traslEliminarVal3 = false;
      if (data.TraslEliminar == 1) this.traslEliminarVal3 = true;
      if (data.CajasVer == 0) this.cajasVerVal3 = false;
      if (data.CajasVer == 1) this.cajasVerVal3 = true;
      if (data.CajasEditar == 0) this.cajasEditarVal3 = false;
      if (data.CajasEditar == 1) this.cajasEditarVal3 = true;
      if (data.CajasEliminar == 0) this.cajasEliminarVal3 = false;
      if (data.CajasEliminar == 1) this.cajasEliminarVal3 = true;
      if (data.GirosVer == 0) this.girosVerVal3 = false;
      if (data.GirosVer == 1) this.girosVerVal3 = true;
      if (data.GirosEditar == 0) this.girosEditarVal3 = false;
      if (data.GirosEditar == 1) this.girosEditarVal3 = true;
      if (data.GirosEliminar == 0) this.girosEliminarVal3 = false;
      if (data.GirosEliminar == 1) this.girosEliminarVal3 = true;
      if (data.CorrVer == 0) this.corrVerVal3 = false;
      if (data.CorrVer == 1) this.corrVerVal3 = true;
      if (data.CorrEditar == 0) this.corrEditarVal3 = false;
      if (data.CorrEditar == 1) this.corrEditarVal3 = true;
      if (data.CorrEliminar == 0) this.corrEliminarVal3 = false;
      if (data.CorrEliminar == 1) this.corrEliminarVal3 = true;
      if (data.ServVer == 0) this.servVerVal3 = false;
      if (data.ServVer == 1) this.servVerVal3 = true;
      if (data.ServEditar == 0) this.servEditarVal3 = false;
      if (data.ServEditar == 1) this.servEditarVal3 = true;
      if (data.ServEliminar == 0) this.servEliminarVal3 = false;
      if (data.ServEliminar == 1) this.servEliminarVal3 = true;
      if (data.ConfVer == 0) this.confVerVal3 = false;
      if (data.ConfVer == 1) this.confVerVal3 = true;
      if (data.ConfEditar == 0) this.confEditarVal3 = false;
      if (data.ConfEditar == 1) this.confEditarVal3 = true;
      if (data.ConfEliminar == 0) this.confEliminarVal3 = false;
      if (data.ConfEliminar == 1) this.confEliminarVal3 = true;
      if (data.IndiVer == 0) this.indiVerVal3 = false;
      if (data.IndiVer == 1) this.indiVerVal3 = true;
      if (data.IndiEditar == 0) this.indiEditarVal3 = false;
      if (data.IndiEditar == 1) this.indiEditarVal3 = true;
      if (data.IndiEliminar == 0) this.indiEliminarVal3 = false;
      if (data.IndiEliminar == 1) this.indiEliminarVal3 = true;
      if (data.ReporVer == 0) this.reporVerVal3 = false;
      if (data.ReporVer == 1) this.reporVerVal3 = true;
      if (data.ReporEditar == 0) this.reporEditarVal3 = false;
      if (data.ReporEditar == 1) this.reporEditarVal3 = true;
      if (data.ReporEliminar == 0) this.reporEliminarVal3 = false;
      if (data.ReporEliminar == 1) this.reporEliminarVal3 = true;

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
