import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Globales } from '../../shared/globales/globales';

@Component({
  selector: 'app-bancos',
  templateUrl: './bancos.component.html',
  styleUrls: ['./bancos.component.css']
})
export class BancosComponent implements OnInit {
  public bancos : any[];
  public Paises : any[];

  //variables de formulario
  public Identificacion : any[];
  public Nombre : any[];
  public Pais : any[];
  public Identificador : any[];
  public Detalle : any[];

  @ViewChild('ModalBanco') ModalBanco:any;
  @ViewChild('ModalEditarBanco') ModalEditarBanco:any;
  @ViewChild('FormBanco') FormBanco:any;
  @ViewChild('deleteSwal') deleteSwal:any;
   
  constructor(private http : HttpClient, private globales : Globales) { }

  ngOnInit() {
    this.ActualizarVista();
    this.http.get(this.globales.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Pais'}}).subscribe((data:any)=>{
      this.Paises= data;
    });
  }

  @HostListener('document:keyup', ['$event']) handleKeyUp(event) {
    if (event.keyCode === 27) {     
      this.FormBanco.reset();
      this.OcultarFormulario(this.ModalBanco);
      this.OcultarFormulario(this.ModalEditarBanco);
    }
  }

  ActualizarVista()
  {
    this.http.get(this.globales.ruta+'php/bancos/lista_bancos.php').subscribe((data:any)=>{
      this.bancos= data;        
    });
  }

  GuardarBanco(formulario: NgForm, modal){
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    datos.append("modulo",'Banco');
    datos.append("datos",info);
    this.OcultarFormulario(modal);
    this.http.post(this.globales.ruta+'php/genericos/guardar_generico.php',datos).subscribe((data:any)=>{
      formulario.reset();
      this.ActualizarVista();
    });
  }

  EliminarBanco(id){
    let datos=new FormData();
    datos.append("modulo", 'Banco');
    datos.append ("id",id);
    this.http.post(this.globales.ruta + 'php/genericos/eliminar_generico.php', datos ).subscribe((data:any)=>{
      this.ActualizarVista();
      this.deleteSwal.show();
    })    
  }

  EditarBanco(id){
    this.http.get(this.globales.ruta +'php/genericos/detalle.php',{
      params:{modulo:'Banco', id:id}
    }).subscribe((data:any)=>{
      this.Identificacion = id;
      this.Nombre = data.Nombre;
      this.Pais = data.Id_Pais;
      this.Identificador = data.Identificador;
      this.Detalle = data.Detalle;
      this.ModalEditarBanco.show();
    });
  }

  OcultarFormulario(modal)
  {
    this.Identificacion = null;
    this.Nombre = null;
    this.Pais = null;
    this.Identificador = null;
    this.Detalle = null;
    modal.hide();
  }

}