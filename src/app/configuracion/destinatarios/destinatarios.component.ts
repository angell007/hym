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

  public destinatarios : any[]=[];
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
  public Lista_Cuentas = [];
  public Detalle_Destinatario : any[] = [];
  public Lista_Destinatarios:any=[{
    Id_Pais:'',
    Id_Banco: '',
    Id_Tipo_Cuenta:'',
    Numero_Cuenta: ''
  }]

  public boolNombre:boolean = false;
  public boolId:boolean = false;
  public cuentas: any[] = [];

  //Valores por defecto
  paisDefault: string = "";
  bancoDefault: string = "";
  cuentasDefault: string = "";

  @ViewChild('ModalVerDestinatario') ModalVerDestinatario:any;
  @ViewChild('ModalEditarDestinatario') ModalEditarDestinatario:any;
  @ViewChild('ModalDestinatario') ModalDestinatario:any;
  @ViewChild('FormDestinatario') FormDestinatario:any;
  @ViewChild('errorSwal') errorSwal:any;
  @ViewChild('saveSwal') saveSwal:any;
  @ViewChild('deleteSwal') deleteSwal:any;
  @ViewChild('duplicateSwal') duplicateSwal:any;

  constructor(private http : HttpClient, private globales: Globales) { } 

  ngOnInit() {
    this.http.get(this.globales.ruta+'php/destinatarios/lista_destinatarios.php').subscribe((data:any)=>{
      this.destinatarios= data;
      console.log(this.destinatarios);
    });
    this.http.get(this.globales.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Pais'}}).subscribe((data:any)=>{
      this.Paises= data;
    });
    this.http.get(this.globales.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Banco'}}).subscribe((data:any)=>{
      this.Bancos= data;
    });
    this.http.get(this.globales.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Tipo_Cuenta'}}).subscribe((data:any)=>{
      this.Cuentas= data;
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

  Bancos_Pais(Pais){
    this.http.get(this.globales.ruta+'php/genericos/bancos_pais.php',{ params: { id: Pais}}).subscribe((data:any)=>{
      this.Bancos = data;
    });
  }

  AutoSleccionarMunicipio(Pais, Banco){
    this.http.get(this.globales.ruta+'php/genericos/bancos_pais.php',{ params: { id: Pais}}).subscribe((data:any)=>{
      this.Bancos = data;
      this.Banco = Banco;
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
    //console.log(formulario.value);
    console.log(this.Lista_Destinatarios);
    let info = JSON.stringify(formulario.value);
    let destinatario = JSON.stringify(this.Lista_Destinatarios);
    let datos = new FormData();
    this.OcultarFormulario(modal);
    //datos.append("modulo",'Destinatario');
    datos.append("datos",info);
    datos.append("destinatario",destinatario);
    this.http.post(this.globales.ruta + 'php/destinatarios/guardar_destinatario.php',datos).subscribe((data:any)=>{
      this.Lista_Destinatarios = [{
        Id_Pais:'',
        Id_Banco: '',
        Id_Tipo_Cuenta:'',
        Numero_Cuenta: ''
      }];
      localStorage.removeItem("Lista_Inicial");
      formulario.reset();
      this.ActualizarVista();
     });

    
    
  }

  handleError(error: Response) {
    return Observable.throw(error);
  }

  VerDestinatario(id, modal){
    this.http.get(this.globales.ruta+'php/destinatarios/detalle_destinatario.php',{
      params:{id:id}
    }).subscribe((data:any)=>{
      this.Detalle_Destinatario = data;
      this.cuentas = data.Cuentas;
      this.Identificacion = id;
      modal.show();
    });
   
  }
  
  EditarDestinatario(id){
    this.InicializarBool(); 
    this.http.get(this.globales.ruta+'php/destinatarios/detalle_destinatario.php',{
      params:{modulo:'Destinatario', id:id}
    }).subscribe((data:any)=>{
      console.log(data);      
      this.Detalle_Destinatario = data;
      this.cuentas = data.Cuentas;
      this.Identificacion = id;
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


  AgregarFila() { 
    
  this.Lista_Destinatarios.push({
  Pais:'',
  Banco: '',
  Cuenta:'',
  Numero_Cuenta: ''
})
  }
  EliminarFila(i){ 
    
    this.Lista_Cuentas.splice(i,1);
  }

  Cerrar(modal){
    this.OcultarFormulario(modal)
  }

}
