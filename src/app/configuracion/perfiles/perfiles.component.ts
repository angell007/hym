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
  public asd : any[];

  public boolNombre:boolean = false;

  @ViewChild('ModalPerfil') ModalPerfil:any;
  @ViewChild('ModalVerPerfil') ModalVerPerfil:any;
  @ViewChild('ModalEditarPerfil') ModalEditarPerfil:any;
  @ViewChild('FormPerfil') FormPerfil:any;
  @ViewChild('saveSwal') saveSwal:any;
  @ViewChild('deleteSwal') deleteSwal:any;

  constructor(private http : HttpClient, private globales : Globales) { }

  ngOnInit() {
    this.ActualizarVista();
  }

  @HostListener('document:keyup', ['$event']) handleKeyUp(event) {
    if (event.keyCode === 27) {     
      this.OcultarFormularios();
    }
  }

  OcultarFormularios()
  {
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
    this.http.post(this.globales.ruta+'php/genericos/guardar_generico.php',datos).subscribe((data:any)=>{
      formulario.reset();
      this.perfiles= data;
      this.InicializarBool();
    });
    this.saveSwal.show();
  }


  VerPerfil(id, modal){
    this.http.get(this.globales.ruta+'php/perfiles/detalle_perfil.php',{
      params:{id:id}
    }).subscribe((data:any)=>{
      this.Identificacion = id;
      this.Nombre = data.Nombre;
      this.Detalle = data.Detalle;
      modal.show();
    });
  }

  EditarPerfil(id){
    this.http.get(this.globales.ruta+'php/genericos/detalle.php',{
      params:{modulo:'Perfil', id:id}
    }).subscribe((data:any)=>{
      this.Identificacion = id;
      this.Nombre = data.Nombre;
      this.Detalle = data.Detalle;
      this.ModalEditarPerfil.show();
    });
  }

  

  EliminarPerfil(id){
    let datos=new FormData();
    datos.append("modulo", 'Perfil');
    datos.append ("id",id);
    this.http.post(this.globales.ruta + 'php/genericos/eliminar_generico.php', datos ).subscribe((data:any)=>{
      this.perfiles=data; 
      this.deleteSwal.show();
    })     
  }

  OcultarFormulario(modal)
  {
    this.Identificacion = null;
    this.Nombre = null;
    this.Detalle = null;
    modal.hide();
  }

  Cerrar(modal){
    this.OcultarFormulario(modal)
  }
}
