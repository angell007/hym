import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Globales } from '../../shared/globales/globales';

@Component({
  selector: 'app-cajarecaudos',
  templateUrl: './cajarecaudos.component.html',
  styleUrls: ['./cajarecaudos.component.scss']
})
export class CajarecaudosComponent implements OnInit {

  public cajarecaudos : any[];
  public Departamentos : any[];
  public Municipios : any[];

  //variables que hacen referencia a los campos del formulario editar   

  public Identificacion : any[];
  public Nombre : any[];
  public Username : any[];
  public Password : any[];
  public Tipo : any[];
  public Departamento : any[];
  public Municipio : any[];

  public boolNombre:boolean = false;
  public boolUsername:boolean = false;
  public boolPassword:boolean = false;
  public boolTipo:boolean = false;
  public boolDepartamento:boolean = false;
  public boolMunicipio:boolean = false;


  @ViewChild('ModalCaja') ModalCaja:any;
  @ViewChild('ModalVerCaja') ModalVerCaja:any;
  @ViewChild('ModalEditarCaja') ModalEditarCaja:any;
  @ViewChild('FormCaja') FormCaja:any;
  @ViewChild('errorSwal') errorSwal:any;
  @ViewChild('saveSwal') saveSwal:any;
  @ViewChild('deleteSwal') deleteSwal:any;

  constructor(private http : HttpClient,private globales : Globales) { }

  ngOnInit() {
    this.ActualizarVista();
    this.http.get(this.globales.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Departamento'}}).subscribe((data:any)=>{
      this.Departamentos= data;
    });
  }

  @HostListener('document:keyup', ['$event']) handleKeyUp(event) {
    if (event.keyCode === 27) {     
      this.OcultarFormularios();
    }
  }

  OcultarFormularios()
  {
    this.InicializarBool();
    this.OcultarFormulario(this.ModalCaja);
    this.OcultarFormulario(this.ModalVerCaja);
    this.OcultarFormulario(this.ModalEditarCaja); 
  }

  InicializarBool()
  {
    this.boolNombre = false;
    this.boolUsername = false;
    this.boolPassword = false;
    this.boolTipo = false;
    this.boolDepartamento = false;
    this.boolMunicipio = false;
  }

  ActualizarVista()
  {
    this.http.get(this.globales.ruta+'php/cajarecaudos/lista.php').subscribe((data:any)=>{
      this.cajarecaudos= data;
    });
  }

  Municipios_Departamento(Departamento){
    this.http.get(this.globales.ruta+'php/genericos/municipios_departamento.php',{ params: { id: Departamento}}).subscribe((data:any)=>{
      this.Municipios= data;
    });
  }

  GuardarCaja(formulario: NgForm, modal:any){
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    datos.append("modulo",'Caja_Recaudos');
    datos.append("datos",info);
    this.OcultarFormulario(modal);
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

  VerCaja(id, modal){
    this.http.get(this.globales.ruta+'php/cajarecaudos/detalle_caja_recaudo.php',{
      params:{id:id}
    }).subscribe((data:any)=>{
      this.Identificacion = id;
      this.Nombre = data.Nombre;
      this.Username = data.Username;
      this.Password = data.Password;
      this.Tipo = data.Tipo;
      this.Departamento = data.Departamento;
      this.Municipio = data.Municipio;
      modal.show();
    });
  }

  EditarCaja(id, modal){
    this.InicializarBool();
    this.http.get(this.globales.ruta+'php/genericos/detalle.php',{
      params:{modulo:'Caja_Recaudos', id:id}
    }).subscribe((data:any)=>{
  console.log(id);
      this.Identificacion = id;
      this.Nombre = data.Nombre;
      this.Username = data.Username;
      this.Password = data.Password;
      this.Tipo = data.Tipo;
      this.Departamento = data.Id_Departamento;
      this.AutoSleccionarMunicipio(data.Id_Departamento, data.Id_Municipio);
      modal.show();
    });
  }

  EliminarCajaRecaudo(id){
    let datos = new FormData();
    datos.append("modulo", 'Caja_Recaudos');
    datos.append("id", id); 
    this.http.post(this.globales.ruta + 'php/genericos/anular_generico.php', datos ).subscribe((data: any) => {
      this.deleteSwal.show();
      this.ActualizarVista();
    });
  }
  
  AutoSleccionarMunicipio(Departamento, Municipio){
    this.http.get(this.globales.ruta+'php/genericos/municipios_departamento.php',{ params: { id: Departamento}}).subscribe((data:any)=>{
      this.Municipios= data;
      this.Municipio = Municipio;
    });
  }

  OcultarFormulario(modal){
    this.Identificacion = null;
    this.Nombre = null;
    this.Username = null;
    this.Password = null;
    this.Tipo = null;
    this.Departamento = null;
    this.Municipio = null;
    modal.hide();
  }

  Cerrar(modal){
    this.OcultarFormulario(modal)
  }
}