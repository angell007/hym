import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import * as $ from 'jquery';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  public clientes : any[];
  public Departamentos : any[];
  public Municipios : any[];

  //variables de formulario
  public Identificacion : any[];
  public Nombre : any[];
  public Direccion : any[];
  public IdDepartamento : any[];
  public IdMunicipio : any[];
  public Telefono : any[];
  public Celular : any[];
  public Correo : any[];
  public ClienteDesde : any[];
  public Destacado : any[];
  public Credito : any[];
  public Cupo : any[];
  public TipoCliente : any[];
  public Detalle : any[];

  public ModalCliente : any = $('#ModalCliente');
  @ViewChild('deleteSwal') deleteSwal:any;
  readonly ruta = 'http://hym.corvuslab.co/'; 
  constructor(private http : HttpClient) { } 
 
  ngOnInit() {
    this.ActualizarVista();
    this.http.get(this.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Departamento'}}).subscribe((data:any)=>{
      this.Departamentos= data;
    });
  }

  ActualizarVista(){
    this.http.get(this.ruta+'php/clientes/lista_clientes.php').subscribe((data:any)=>{
      this.clientes= data;
    });
  }

  Municipios_Departamento(Departamento){
    this.http.get(this.ruta+'php/genericos/municipios_departamento.php',{ params: { id: Departamento}}).subscribe((data:any)=>{
      this.Municipios= data;
    });
  }

  GuardarCliente(formulario: NgForm, modal){
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();    
    datos.append("modulo",'Cliente');
    datos.append("datos",info);
    this.OcultarFormulario(modal);
    this.http.post(this.ruta+'php/genericos/guardar_generico.php',datos).subscribe((data:any)=>{
      formulario.reset();
      this.ActualizarVista();
    });    
  }

  EditarCliente(id, modal){
    this.http.get(this.ruta+'php/genericos/detalle.php',{
      params:{modulo:'Cliente', id:id}
    }).subscribe((data:any)=>{      
      this.Identificacion = data.Id_Cliente;
      this.Nombre = data.Nombre;
      this.Direccion = data.Direccion;
      this.IdDepartamento = data.Id_Departamento;
      this.AutoSleccionarMunicipio(data.Id_Departamento, data.Id_Municipio);
      this.Telefono = data.Telefono;
      this.Celular = data.Celular;
      this.Correo = data.Correo;
      this.ClienteDesde = data.Cliente_Desde;
      this.Destacado = data.Destacado;
      this.Credito = data.Credito;
      this.Cupo = data.Cupo;
      this.TipoCliente = data.Tipo;
      this.Detalle = data.Detalle;
      modal.show();
    });
  }

  EliminarCliente(id){
    let datos=new FormData();
    datos.append("modulo", 'Cliente');
    datos.append ("id",id);
    this.http.post(this.ruta + 'php/genericos/eliminar_generico.php', datos ).subscribe((data:any)=>{
      this.ActualizarVista();
      this.deleteSwal.show();
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
    this.ClienteDesde = null;
    this.Destacado = null;
    this.Credito = null;
    this.Cupo = null;
    this.TipoCliente = null;
    this.Detalle = null;
    modal.hide();
  }

  /**
   *carga los municipios correspondietes al departamento que se asigno al formulario en la consulta de la función
   *Editar() y luego asigna el municipio correspondiente obtenido en la consulta de la función Editar.
   *
   * @param {*} Departamento departamento del que se obtendran los municipios
   * @param {*} Municipio municipio que se asignara una vez se cargue la lista de municipios
   * @memberof OficinasComponent
   */
  AutoSleccionarMunicipio(Departamento, Municipio){
    this.http.get(this.ruta+'php/genericos/municipios_departamento.php',{ params: { id: Departamento}}).subscribe((data:any)=>{
      this.Municipios= data;
      this.IdMunicipio = Municipio;
    });
  }

}
