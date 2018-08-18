import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Globales } from '../../shared/globales/globales';

@Component({
  selector: 'app-destinatarios',
  templateUrl: './destinatarios.component.html',
  styleUrls: ['./destinatarios.component.css']
})
export class DestinatariosComponent implements OnInit {

  public destinatarios : any[];
  public Paises : any[];
  public Bancos : any[];

  //variables de formulario
  public Identificacion : any[];
  public Nombre : any[];
  public Cuentas : any[];
  public IdBanco : any[];
  public Banco : any[];
  public IdPais : any[];
  public Pais : any[];
  public Detalle : any[];

  public boolNombre:boolean = false;
  public boolId:boolean = false;

  @ViewChild('ModalVerDestinatario') ModalVerDestinatario:any;
  @ViewChild('ModalEditarDestinatario') ModalEditarDestinatario:any;
  @ViewChild('ModalDestinatario') ModalDestinatario:any;
  @ViewChild('FormDestinatario') FormDestinatario:any;
  @ViewChild('errorSwal') errorSwal:any;
  @ViewChild('saveSwal') saveSwal:any;
  @ViewChild('deleteSwal') deleteSwal:any;

  constructor(private http : HttpClient, private globales: Globales) { } 

  ngOnInit() {
    this.ActualizarVista();
    this.http.get(this.globales.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Pais'}}).subscribe((data:any)=>{
      this.Paises= data;
    });
    this.http.get(this.globales.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Banco'}}).subscribe((data:any)=>{
      this.Bancos= data;
    });
  }

  @HostListener('document:keyup', ['$event']) handleKeyUp(event) {
    if (event.keyCode === 27) {     
      this.OcultarFormularios();
    }
  }

  ActualizarVista()
  {
    this.http.get(this.globales.ruta+'php/destinatarios/lista_destinatarios.php').subscribe((data:any)=>{
      this.destinatarios= data;
    });
  }

  OcultarFormularios()
  {
    this.InicializarBool();
    this.OcultarFormulario(this.ModalDestinatario);
    this.OcultarFormulario(this.ModalVerDestinatario);
    this.OcultarFormulario(this.ModalEditarDestinatario);
  }

  InicializarBool()
  {
    this.boolNombre = false;
    this.boolId = false;
  }

  /**
   *guarda los datos ingresados en el formulario en la tabla que se indica como segundo parametro en 
   *datos.append("modulo", 'nombre de la tabla')
   *
   * @param {NgForm} formulario
   * @memberof DestinatariosComponent
   */
  GuardarDestinatario(formulario: NgForm, modal:any){
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    console.log(info);
    this.OcultarFormulario(modal);
    datos.append("modulo",'Destinatario');
    datos.append("datos",info);
    this.http.post(this.globales.ruta+'php/genericos/guardar_generico.php',datos)
    .catch(error => { 
      console.error('An error occurred:', error.error);
      this.errorSwal.show();
      return this.handleError(error);
    })
    .subscribe((data:any)=>{      
      this.destinatarios= data;
      formulario.reset();
      this.InicializarBool();
      this.saveSwal.show();
    });
    
  }

  handleError(error: Response) {
    return Observable.throw(error);
  }

  VerDestinatario(id, modal){
    this.http.get(this.globales.ruta+'php/destinatarios/detalle_destinatario.php',{
      params:{id:id}
    }).subscribe((data:any)=>{
      this.Identificacion = id;
      this.Nombre = data.Nombre;
      this.Cuentas = data.Cuentas;
      this.Banco = data.Banco; 
      this.Pais = data.Pais;
      this.Detalle = data.Detalle;
      modal.show();
    });
  }



  EditarDestinatario(id){
    this.InicializarBool();
    console.log(id);  
    this.http.get(this.globales.ruta+'php/genericos/detalle.php',{
      params:{modulo:'Destinatario', id:id}
    }).subscribe((data:any)=>{
      console.log(data);      
      this.Identificacion = id;
      this.Nombre = data.Nombre;
      this.Cuentas = data.Cuentas;
      this.IdBanco = data.Id_Banco; 
      this.IdPais = data.Id_Pais;
      this.Detalle = data.Detalle;
      this.ModalEditarDestinatario.show();
    });
  }

  EliminarDestinatario(id){
    let datos = new FormData();
    datos.append("modulo", 'Destinatario');
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
    this.Cuentas = null;
    this.IdBanco = null; 
    this.IdPais = null;
    this.Detalle = null;
    modal.hide();
  }

  Cerrar(modal){
    this.OcultarFormulario(modal)
  }

}