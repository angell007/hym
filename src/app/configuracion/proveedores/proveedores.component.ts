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

  public proveedores : any[];
  public Departamentos : any[];
  public Municipios : any[];

  //variables de formulario
  public Identificacion : any[];
  public Nombre : any[];
  public Direccion : any[];
  public Telefono : any[];
  public Celular : any[];
  public Correo : any[];
  public Detalle : any[];
  public Confiable : any[];
  public Regimen : any[];
  public IdDepartamento : any[];
  public Departamento : any[];
  public IdMunicipio : any[];
  public Municipio : any[];
  public RazonSocial : any[];

  @ViewChild('ModalProveedor') ModalProveedor:any;
  @ViewChild('ModalVerProveedor') ModalVerProveedor:any;
  @ViewChild('ModalEditarProveedor') ModalEditarProveedor:any;
  @ViewChild('FormProveedor') FormProveedor:any;
  @ViewChild('deleteSwal') deleteSwal:any;
  
  constructor(private http : HttpClient, private globales : Globales) { } 

  ngOnInit() {
    this.ActualizarProveedores();
    this.http.get(this.globales.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Departamento'}}).subscribe((data:any)=>{
      this.Departamentos= data;
    });
  }

  @HostListener('document:keyup', ['$event']) handleKeyUp(event) {
    if (event.keyCode === 27) {     
      this.FormProveedor.reset();
      this.OcultarFormulario(this.ModalProveedor);
      this.OcultarFormulario(this.ModalVerProveedor);
      this.OcultarFormulario(this.ModalEditarProveedor);
    }
  }

  ActualizarProveedores(){
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
    this.http.post(this.globales.ruta+'php/genericos/guardar_generico.php',datos).subscribe((data:any)=>{
      formulario.reset();
      this.ActualizarProveedores();
    });
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
    let datos=new FormData();
    datos.append("modulo", 'Proveedor');
    datos.append ("id",id);
    this.http.post(this.globales.ruta+ 'php/genericos/eliminar_generico.php', datos ).subscribe((data:any)=>{
      this.ActualizarProveedores();
      this.deleteSwal.show();
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
