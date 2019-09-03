import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Globales } from '../../shared/globales/globales';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent implements OnInit {

  public proveedores : any = [];
  public Departamentos : any = [];
  public Municipios : any = [];

  //variables de formulario
  public Identificacion : any = [];
  public Nombre : any = [];
  public Direccion : any = [];
  public Telefono : any = [];
  public Celular : any = [];
  public Correo : any = [];
  public Detalle : any = [];
  public Confiable : any = [];
  public Regimen : any = [];
  public IdDepartamento : any = [];
  public Departamento : any = [];
  public IdMunicipio : any = [];
  public Municipio : any = [];
  public RazonSocial : any = [];

  public boolIdentificacion:boolean = false;
  public boolNombre:boolean = false;
  public boolDireccion:boolean = false;
  public boolTelefono:boolean = false;
  public boolCelular:boolean = false;
  public boolCorreo:boolean = false;
  public boolConfiable:boolean = false;
  public boolRegimen:boolean = false;
  public boolDepartamento:boolean = false;
  public boolMunicipio:boolean = false;
  public boolRazonSocial:boolean = false;

  //Valores por defecto
  departamentoDefault: string = "";
  municipioDefault: string = "";
  confiabilidadDefault: string = "Confiable";
  regimenDefault: string = "Comun";

  @ViewChild('ModalProveedor') ModalProveedor:any;
  @ViewChild('ModalVerProveedor') ModalVerProveedor:any;
  @ViewChild('ModalEditarProveedor') ModalEditarProveedor:any;
  @ViewChild('FormProveedor') FormProveedor:any;
  @ViewChild('errorSwal') errorSwal:any;
  @ViewChild('saveSwal') saveSwal:any;
  @ViewChild('deleteSwal') deleteSwal:any;
  @ViewChild('duplicateSwal') duplicateSwal:any;

  constructor(private http : HttpClient, private globales : Globales) { } 

  ngOnInit() {
    this.ActualizarVista();
    this.http.get(this.globales.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Departamento'}}).subscribe((data:any)=>{
      this.Departamentos= data;
    });
  }

  @HostListener('document:keyup', ['$event']) handleKeyUp(event) {
    if (event.keyCode === 27) {     
      this.OcultarFormularios;
    }
  }

  OcultarFormularios()
  {
    this.InicializarBool();
    this.OcultarFormulario(this.ModalProveedor);
    this.OcultarFormulario(this.ModalVerProveedor);
    this.OcultarFormulario(this.ModalEditarProveedor);
  }

  InicializarBool()
  {
    this.boolIdentificacion = false;
    this.boolNombre = false;
    this.boolDireccion = false;
    this.boolTelefono = false;
    this.boolCelular = false;
    this.boolCorreo = false;
    this.boolCelular = false;
    this.boolConfiable = false;
    this.boolRegimen = false;
    this.boolDepartamento = false;
    this.boolMunicipio = false;
    this.boolRazonSocial = false;
  }

  ActualizarVista(){
    this.http.get(this.globales.ruta+'php/proveedores/lista_proveedores.php').subscribe((data:any)=>{
      this.proveedores= data;
    });
  }

  Municipios_Departamento(Departamento){
    this.http.get(this.globales.ruta+'php/genericos/municipios_departamento.php',{ params: { id: Departamento}}).subscribe((data:any)=>{
      this.Municipios= data;
    });
  }

  GuardarProveedor(formulario: NgForm, modal){
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    datos.append("modulo",'Proveedor');
    datos.append("datos",info);
    this.OcultarFormulario(modal);
    this.http.post(this.globales.ruta+'php/genericos/guardar_generico.php',datos)
    .catch(error => { 
      console.error('An error occurred:', error.error);
      this.errorSwal.show();

      var test = error.error.text;
      if (test.indexOf('Duplicate') >= 0) {
        this.duplicateSwal.show();
      }

      return this.handleError(error);
    })
    .subscribe((data:any)=>{
      formulario.reset();
      this.ActualizarVista();
      this.InicializarBool();
      this.departamentoDefault = "";
      this.municipioDefault = "";
      this.confiabilidadDefault = "";
      this.regimenDefault = "";
      this.saveSwal.show()
    });
    
  }

  handleError(error: Response) {
    return Observable.throw(error);
  }

  VerProveedor(id, modal){
    this.http.get(this.globales.ruta+'php/proveedores/detalle_proveedor.php',{
      params:{id:id}
    }).subscribe((data:any)=>{
      this.Identificacion = data.Id_Proveedor;
      this.Nombre = data.Nombre;
      this.Direccion = data.Direccion;
      this.Telefono = data.Telefono;
      this.Celular = data.Celular;
      this.Correo = data.Correo;
      this.Detalle = data.Detalle;
      this.Confiable = data.Confiable;
      this.Regimen = data.Regimen;
      this.Departamento = data.Departamento;
      this.Municipio = data.Municipio;
      this.RazonSocial = data.Razon_Social;
      modal.show();
    });
  }


  EliminarProveedor(id){
    let datos = new FormData();
    datos.append("modulo", 'Proveedor');
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
    this.Telefono = null;
    this.Celular = null;
    this.Correo = null;
    this.Detalle = null;
    this.Confiable = null;
    this.Regimen = null;
    this.IdDepartamento = null;
    this.IdMunicipio = null;
    this.RazonSocial = null;
    modal.hide();
  }

  EditarProveedor(id, modal){
    this.InicializarBool();
    this.http.get(this.globales.ruta+'php/genericos/detalle.php',{
      params:{modulo:'Proveedor', id:id}
    }).subscribe((data:any)=>{
      console.log(data);      
      this.Identificacion = data.Id_Proveedor;
      this.Nombre = data.Nombre;
      this.Direccion = data.Direccion;
      this.Telefono = data.Telefono;
      this.Celular = data.Celular;
      this.Correo = data.Correo;
      this.Detalle = data.Detalle;
      this.Confiable = data.Confiable;
      this.Regimen = data.Regimen;
      this.IdDepartamento = data.Id_Departamento;
      this.AutoSleccionarMunicipio(data.Id_Departamento, data.Id_Municipio);
      this.RazonSocial = data.Razon_Social;
      modal.show();
    });
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
