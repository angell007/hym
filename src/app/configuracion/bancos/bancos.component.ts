import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
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

  public boolNombre:boolean = false;
  public boolId:boolean = false;
  public boolPais:boolean = false;

  rowsFilter = [];
  tempFilter = [];

  @ViewChild('ModalBanco') ModalBanco:any;
  @ViewChild('ModalVerBanco') ModalVerBanco:any;
  @ViewChild('ModalEditarBanco') ModalEditarBanco:any;
  @ViewChild('FormBanco') FormBanco:any;
  @ViewChild('errorSwal') errorSwal:any;
  @ViewChild('saveSwal') saveSwal:any;
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
      this.OcultarFormularios();
    }
  }

  OcultarFormularios()
  {
    this.InicializarBool();
    this.OcultarFormulario(this.ModalBanco);
    this.OcultarFormulario(this.ModalVerBanco);
    this.OcultarFormulario(this.ModalEditarBanco);
  }

  InicializarBool()
  {
    this.boolNombre = false;
    this.boolId = false;
    this.boolPais = false;
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

  VerBanco(id, modal){
    this.http.get(this.globales.ruta+'php/bancos/detalle_banco.php',{
      params:{id:id}
    }).subscribe((data:any)=>{
      this.Identificacion = id;
      this.Nombre = data.Nombre;
      this.Pais = data.Pais;
      this.Identificador = data.Identificador;
      this.Detalle = data.Detalle;
      modal.show();
    });
  }

  EliminarBanco(id){
    let datos = new FormData();
    datos.append("modulo", 'Banco');
    datos.append("id", id); 
    this.http.post(this.globales.ruta + 'php/genericos/anular_generico.php', datos ).subscribe((data: any) => {
      this.deleteSwal.show();
      this.ActualizarVista();
    });
  }

  EditarBanco(id){
    this.InicializarBool();
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

  Cerrar(modal){
    this.OcultarFormulario(modal)
  }
}
