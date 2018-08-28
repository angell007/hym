import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Globales } from '../../shared/globales/globales';

@Component({
  selector: 'app-tipodocumentoextranjero',
  templateUrl: './tipodocumentoextranjero.component.html',
  styleUrls: ['./tipodocumentoextranjero.component.scss']
})
export class TipodocumentoextranjeroComponent implements OnInit {

  public tiposDocumentosExtranjero : any[];

  //variables de formulario
  public Identificacion : any[];
  public Nombre : any[];
  public Codigo : any[];

  public boolNombre:boolean = false;
  public boolCodigo:boolean = false;

  @ViewChild('ModalDocumento') ModalDocumento:any;
  @ViewChild('ModalVerDocumento') ModalVerDocumento:any;
  @ViewChild('ModalEditarDocumento') ModalEditarDocumento:any;
  @ViewChild('errorSwal') errorSwal:any;
  @ViewChild('saveSwal') saveSwal:any;
  @ViewChild('deleteSwal') deleteSwal:any;
  @ViewChild('FormDocumento') FormDocumento:any;
  Orden: any;

  constructor(private http : HttpClient, private globales: Globales) { }

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
    this.InicializarBool();
    this.OcultarFormulario(this.ModalDocumento);
    this.OcultarFormulario(this.ModalVerDocumento);
    this.OcultarFormulario(this.ModalEditarDocumento);
  }

  InicializarBool()
  {
    this.boolNombre = false;
    this.boolCodigo = false;
  }

  ActualizarVista(){
    this.http.get(this.globales.ruta+'php/tiposdocumentos/lista_tipos_documentos_extranjeros.php').subscribe((data:any)=>{
      this.tiposDocumentosExtranjero= data;          
    });
  }

  GuardarDocumentoExtranjero(formulario: NgForm, modal){
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();        
    datos.append("modulo",'Tipo_Documento_Extranjero');
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

  VerDocumento(id, modal){
    this.http.get(this.globales.ruta+'php/tiposdocumentos/detalle_tipo_documento_extranjero.php',{
      params:{id:id}
    }).subscribe((data:any)=>{
      this.Identificacion = id;
      this.Nombre = data.Nombre;
      this.Codigo = data.Codigo;
      modal.show();
    });
  }

  EditarDocumentoExtranjero(id, modal){
    this.InicializarBool();
    this.http.get(this.globales.ruta+'php/genericos/detalle.php',{
      params:{modulo:'Tipo_Documento_Extranjero', id:id}
    }).subscribe((data:any)=>{      
      this.Identificacion = id;
      this.Nombre = data.Nombre;
      this.Codigo = data.Codigo;
      this.Orden = data.Orden;
      modal.show();
    });
  }

  EliminarDocumento(id){
    let datos = new FormData();
    datos.append("modulo", 'Tipo_Documento_Extranjero');
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
    this.Codigo = null;
    modal.hide();
  }

  Cerrar(modal){
    this.OcultarFormulario(modal)
  }

}
