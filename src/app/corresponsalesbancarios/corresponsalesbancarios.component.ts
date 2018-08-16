import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-corresponsalesbancarios',
  templateUrl: './corresponsalesbancarios.component.html',
  styleUrls: ['./corresponsalesbancarios.component.css']
})
export class CorresponsalesbancariosComponent implements OnInit {
  
  public corresponsales : any[];
  public Departamentos : any[];
  public Municipios : any[];

  //variables que hacen referencia a los campos del formulario editar   

  public Identificacion : any[];
  public Nombre : any[];
  public Cupo : any[];
  public Departamento : any[];
  public Municipio : any[];

  public boolCorresponsal:boolean = false;
  public boolCupo:boolean = false;
  public boolDepartamento:boolean = false;
  public boolMunicipio:boolean = false;

  //Valores por defecto
  departamentoDefault: string = "";
  municipioDefault: string = "";

  @ViewChild('ModalCorresponsal') ModalCorresponsal:any;
  @ViewChild('ModalEditarCorresponsal') ModalEditarCorresponsal:any;
  @ViewChild('FormCorresponsal') FormCorresponsal:any;
  @ViewChild('deleteSwal') deleteSwal:any;
  @ViewChild('errorSwal') errorSwal:any;
  @ViewChild('saveSwal') saveSwal:any;

  readonly ruta = 'https://hym.corvuslab.co/'; 

  constructor(private http : HttpClient) { }

  ngOnInit() {
    this.ActualizarVista();  
    this.http.get(this.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Departamento'}}).subscribe((data:any)=>{
      this.Departamentos= data;
    });
  }

  @HostListener('document:keyup', ['$event']) handleKeyUp(event) {
    if (event.keyCode === 27) {     
      this.FormCorresponsal.reset();
      this.OcultarFormulario(this.ModalCorresponsal);
      this.OcultarFormulario(this.ModalEditarCorresponsal);
    }
  }

  OcultarFormularios()
  {
    this.InicializarBool();
    /*this.OcultarFormulario(this.ModalE);
    this.OcultarFormulario(this.ModalEditarTraslado);*/
  }

  InicializarBool()
  {
    this.boolCorresponsal = false;
    this.boolCupo = false;
    this.boolDepartamento = false;
    this.boolMunicipio = false;
  }

  ActualizarVista()
  {
    this.http.get(this.ruta+'php/corresponsalesbancarios/lista_corresponsales.php').subscribe((data:any)=>{
      this.corresponsales = data;
    });
  }

  Municipios_Departamento(Departamento){
    this.http.get(this.ruta+'php/genericos/municipios_departamento.php',{ params: { id: Departamento}}).subscribe((data:any)=>{
      this.Municipios= data;
    });
  }

  GuardarCorresponsal(formulario: NgForm, modal:any){
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();

    datos.append("modulo",'Corresponsal_Bancario');
    datos.append("datos",info);

    this.OcultarFormulario(modal);
    this.http.post(this.ruta+'php/genericos/guardar_generico.php',datos).subscribe((data:any)=>{      
    this.ActualizarVista();
    formulario.reset();
    this.InicializarBool();
    this.municipioDefault = "";
    this.departamentoDefault = "";
    this.saveSwal.show();
    });   
  }




EditarCorresponsal(id, modal){
  this.http.get(this.ruta+'php/genericos/detalle.php',{
    params:{modulo:'Corresponsal_Bancario', id:id}
  }).subscribe((data:any)=>{

console.log(id);
    this.Identificacion = id;
    this.Nombre = data.Nombre;
    this.Departamento = data.Id_Departamento;
    this.Cupo = data.Cupo;
    this.AutoSleccionarMunicipio(data.Id_Departamento, data.Id_Municipio);
    modal.show();
  });
}



EliminarCorresponsal(id){
  console.log(id);  
  let datos=new FormData();
  datos.append("modulo", 'Corresponsal_Bancario');
  datos.append ("id",id);
  this.http.post(this.ruta + 'php/genericos/eliminar_generico.php', datos ).subscribe((data:any)=>{
    this.ActualizarVista();
    this.deleteSwal.show();
  })
}



AutoSleccionarMunicipio(Departamento, Municipio){
  this.http.get(this.ruta+'php/genericos/municipios_departamento.php',{ params: { id: Departamento}}).subscribe((data:any)=>{
    this.Municipios= data;
    this.Municipio = Municipio;
  });
}



OcultarFormulario(modal){
  this.Identificacion = null;
  this.Nombre = null;
  this.Cupo = null;
  this.Departamento = null;
  this.Municipio = null;
  modal.hide();
}






}