import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Globales } from '../../shared/globales/globales';

@Component({
  selector: 'app-terceros',
  templateUrl: './terceros.component.html',
  styleUrls: ['./terceros.component.css']
})
export class TercerosComponent implements OnInit {
  public terceros : any[];
  public Departamentos : any[];
  public Municipios : any[];
  public Grupos : any[];
  public Documentos : any[];

  //variables de formulario
  public Identificacion : any[];
  public Nombre : any[];
  public Direccion : any[];
  public IdDepartamento : any[];
  public Departamento : any[];
  public IdMunicipio : any[];
  public Municipio : any[];
  public Telefono : any[];
  public Celular : any[];
  public Correo : any[];
  public TerceroDesde : any[];
  public Destacado : any[];
  public Credito : any[];
  public Cupo : any[];
  public IdGrupo : any[];
  public Grupo : any[];
  public Detalle : any[];
  public IdDocumento : any[];
  public Documento : any[];
  public Barrio : any[];

  public boolNombre:boolean = false;
  public boolIdTercero:boolean = false;
  public boolDireccion:boolean = false;
  public boolBarrio:boolean = false;
  public boolTelefono:boolean = false;
  public boolCelular:boolean = false;
  public boolCorreo:boolean = false;
  public boolTerceroDesde:boolean = false;
  public boolDepartamento:boolean = false;
  public boolMunicipio:boolean = false;

  @ViewChild('ModalTercero') ModalTercero:any;
  @ViewChild('ModalVerTercero') ModalVerTercero:any;
  @ViewChild('ModalEditarTercero') ModalEditarTercero:any;
  @ViewChild('FormTercero') FormTercero:any;
  @ViewChild('errorSwal') errorSwal:any;
  @ViewChild('saveSwal') saveSwal:any;
  @ViewChild('deleteSwal') deleteSwal:any;
  
  constructor(private http : HttpClient, private globales: Globales) { }

  ngOnInit() {
    this.ActualizarVista();
    this.http.get(this.globales.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Departamento'}}).subscribe((data:any)=>{
      this.Departamentos= data;
    });
    this.http.get(this.globales.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Grupo'}}).subscribe((data:any)=>{
      this.Grupos = data;
    });
    this.http.get(this.globales.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Tipo_Documento'}}).subscribe((data:any)=>{
      this.Documentos = data;
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
    this.OcultarFormulario(this.ModalTercero);
    this.OcultarFormulario(this.ModalVerTercero);
    this.OcultarFormulario(this.ModalEditarTercero);
  }

  InicializarBool()
  {
    this.boolNombre = false;
    this.boolIdTercero = false;
    this.boolDireccion = false;
    this.boolBarrio = false;
    this.boolTelefono = false;
    this.boolCelular = false;
    this.boolCorreo = false;
    this.boolTerceroDesde = false;
    this.boolDepartamento = false;
    this.boolMunicipio = false;
   }

  ActualizarVista(){
    this.http.get(this.globales.ruta+'php/terceros/lista_terceros.php').subscribe((data:any)=>{
      this.terceros= data;
    });
  }

  Municipios_Departamento(Departamento){
    this.http.get(this.globales.ruta+'php/genericos/municipios_departamento.php',{ params: { id: Departamento}}).subscribe((data:any)=>{
      this.Municipios= data;
    });
  }

  GuardarTercero(formulario: NgForm, modal){
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    console.log(info);
    datos.append("modulo",'Tercero');
    datos.append("datos",info);
    this.OcultarFormulario(modal);
    this.http.post(this.globales.ruta+'php/genericos/guardar_generico.php',datos)
    .catch(error => { 
      console.error('An error occurred:', error.error);
      this.errorSwal.show();
      return this.handleError(error);
    })
    .subscribe((data:any)=>{
      formulario.reset();
      this.ActualizarVista();
      this.InicializarBool();
      this.saveSwal.show();
    });
    
  }

  handleError(error: Response) {
    return Observable.throw(error);
  }

  VerTercero(id, modal){
    this.http.get(this.globales.ruta+'php/terceros/detalle_tercero.php',{
      params:{id:id}
    }).subscribe((data:any)=>{
      this.Identificacion = id;
      this.Nombre = data.Nombre;
      this.Direccion = data.Direccion;
      this.Departamento = data.Departamento;
      this.Municipio = data.Municipio;
      this.Telefono = data.Telefono;
      this.Celular = data.Celular;
      this.Correo = data.Correo;
      this.TerceroDesde = data.Tercero_Desde;
      this.Destacado = data.Destacado;
      this.Credito = data.Credito;
      this.Cupo = data.Cupo;
      this.Grupo = data.Grupo;
      this.Detalle = data.Detalle;
      this.Barrio = data.Barrio;
      modal.show();
    });
  }

  EditarTercero(id, modal){
    this.InicializarBool();
    this.http.get(this.globales.ruta+'php/genericos/detalle.php',{
      params:{modulo:'Tercero', id:id}
    }).subscribe((data:any)=>{   
      console.log(data);         
      this.Identificacion = id;
      this.Nombre = data.Nombre;
      this.Direccion = data.Direccion;
      this.IdDepartamento = data.Id_Departamento;
      this.AutoSleccionarMunicipio(data.Id_Departamento, data.Id_Municipio);
      this.Telefono = data.Telefono;
      this.Celular = data.Celular;
      this.Correo = data.Correo;
      this.TerceroDesde = data.Tercero_Desde;
      this.Destacado = data.Destacado;
      this.Credito = data.Credito;
      this.Cupo = data.Cupo;
      this.IdGrupo = data.Id_Grupo;
      this.Detalle = data.Detalle;
      this.IdDocumento = data.Id_Documento;
      this.Barrio = data.Barrio;
      modal.show();
    });
  }

  EliminarTercero(id){
    let datos = new FormData();
    datos.append("modulo", 'Tercero');
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
    this.Direccion = null;
    this.IdDepartamento = null;
    this.IdMunicipio = null;
    this.Telefono = null;
    this.Celular = null;
    this.Correo = null;
    this.TerceroDesde = null;
    this.Destacado = null;
    this.Credito = null;
    this.Cupo = null;
    this.IdGrupo = null;
    this.IdDocumento = null;
    this.Detalle = null;
    this.Barrio = null;
    modal.hide();
  }

  AutoSleccionarMunicipio(Departamento, Municipio){
    this.http.get(this.globales.ruta+'php/genericos/municipios_departamento.php',{ params: { id: Departamento}}).subscribe((data:any)=>{
      this.Municipios= data;
      this.IdMunicipio = Municipio;
    });
  }

  Cerrar(modal){
    this.OcultarFormulario(modal)
  }

}
