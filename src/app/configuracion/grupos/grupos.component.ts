import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Globales } from '../../shared/globales/globales';

@Component({
  selector: 'app-grupos',
  templateUrl: './grupos.component.html',
  styleUrls: ['./grupos.component.css']
})
export class GruposComponent implements OnInit {

  public grupos : any[];

  //variables de formulario
  public Identificacion : any[];
  public Nombre : any[];
  public Detalle : any[];
  public Padre : any[];

  public boolNombre:boolean = false;
  public boolPadre:boolean = false;

  @ViewChild('ModalGrupo') ModalGrupo:any;
  @ViewChild('ModalVerGrupo') ModalVerGrupo:any;
  @ViewChild('ModalEditarGrupo') ModalEditarGrupo:any;
  @ViewChild('FormGrupo') FormGrupo:any;
  @ViewChild('saveSwal') saveSwal:any;
  @ViewChild('deleteSwal') deleteSwal:any;

  constructor(private http : HttpClient,private globales : Globales) { }

  ngOnInit() {
    this.ActualizarVista();
  }

  @HostListener('document:keyup', ['$event']) handleKeyUp(event) {
    if (event.keyCode === 27) {     
      this.FormGrupo.reset();
      this.OcultarFormulario(this.ModalGrupo);
      this.OcultarFormulario(this.ModalVerGrupo);
      this.OcultarFormulario(this.ModalEditarGrupo);
    }
  }

  InicializarBool()
  {
    this.boolNombre = false;
    this.boolPadre = false;
  }

  ActualizarVista(){
    this.http.get(this.globales.ruta+'php/grupos/lista_grupos.php').subscribe((data:any)=>{
      this.grupos= data;          
    });
  }

  GuardarGrupo(formulario: NgForm, modal){
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();        
    datos.append("modulo",'Grupo');
    datos.append("datos",info);
    this.OcultarFormulario(modal);
    this.http.post(this.globales.ruta+'php/genericos/guardar_generico.php',datos).subscribe((data:any)=>{
      formulario.reset();
      this.ActualizarVista();
      this.InicializarBool();
    });
    this.saveSwal.show();
  }

  VerGrupo(id, modal){
    this.http.get(this.globales.ruta+'php/genericos/detalle.php',{
      params:{modulo:'Grupo', id:id}
    }).subscribe((data:any)=>{
      this.Identificacion = id;
      this.Nombre = data.Nombre;
      this.Detalle = data.Detalle;
      this.Padre = data.Padre;
      modal.show();
    });
  }

  EditarGrupo(id, modal){
    this.http.get(this.globales.ruta+'php/genericos/detalle.php',{
      params:{modulo:'Grupo', id:id}
    }).subscribe((data:any)=>{      
      this.Identificacion = id;
      this.Nombre = data.Nombre;
      this.Detalle = data.Detalle;
      this.Padre = data.Padre;
      modal.show();
    });
  }

  EliminarGrupo(id){
    let datos=new FormData();
    datos.append("modulo", 'Grupo');
    datos.append ("id",id);
    this.http.post(this.globales.ruta + 'php/genericos/eliminar_generico.php', datos ).subscribe((data:any)=>{
      this.ActualizarVista();
      this.deleteSwal.show();
    });    
  }

  OcultarFormulario(modal)
  {
    this.Identificacion = null;
    this.Nombre = null;
    this.Detalle = null;
    this.Padre = null;
    modal.hide();
  }

  Cerrar(modal){
    this.OcultarFormulario(modal)
  }
  
}
