import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-terceros',
  templateUrl: './terceros.component.html',
  styleUrls: ['./terceros.component.css']
})
export class TercerosComponent implements OnInit {
  public terceros : any[];
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
  public TerceroDesde : any[];
  public Destacado : any[];
  public Credito : any[];
  public Cupo : any[];
  public IdGrupo : any[];
  public Detalle : any[];
  public IdDocumento : any[];
  public Barrio : any[];

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
    this.http.get(this.ruta+'php/terceros/lista_terceros.php').subscribe((data:any)=>{
      this.terceros= data;
    });
  }

  Municipios_Departamento(Departamento){
    this.http.get(this.ruta+'php/genericos/municipios_departamento.php',{ params: { id: Departamento}}).subscribe((data:any)=>{
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
    this.http.post(this.ruta+'php/genericos/guardar_generico.php',datos).subscribe((data:any)=>{
      formulario.reset();
      this.ActualizarVista();
    });
  }

  EditarTercero(id, modal){
    this.http.get(this.ruta+'php/genericos/detalle.php',{
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
    let datos=new FormData();
    datos.append("modulo", 'Tercero');
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
    this.TerceroDesde = null;
    this.Destacado = null;
    this.Credito = null;
    this.Cupo = null;
    this.IdGrupo = null;
    this.Detalle = null;
    modal.hide();
  }

  AutoSleccionarMunicipio(Departamento, Municipio){
    this.http.get(this.ruta+'php/genericos/municipios_departamento.php',{ params: { id: Departamento}}).subscribe((data:any)=>{
      this.Municipios= data;
      this.IdMunicipio = Municipio;
    });
  }

}
