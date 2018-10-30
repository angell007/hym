import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Globales } from '../../shared/globales/globales';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-tipodocumento',
  templateUrl: './tipodocumento.component.html',
  styleUrls: ['./tipodocumento.component.css']
})
export class TipodocumentoComponent implements OnInit {

  public tiposDocumentos: any[];

  //variables de formulario
  public Identificacion: any[];
  public Nombre: any[];
  public Codigo: any[];

  public boolNombre: boolean = false;
  public boolCodigo: boolean = false;

  @ViewChild('ModalDocumento') ModalDocumento: any;
  @ViewChild('ModalVerDocumento') ModalVerDocumento: any;
  @ViewChild('ModalEditarDocumento') ModalEditarDocumento: any;
  @ViewChild('errorSwal') errorSwal: any;
  @ViewChild('saveSwal') saveSwal: any;
  @ViewChild('deleteSwal') deleteSwal: any;
  @ViewChild('FormDocumento') FormDocumento: any;
  Orden: any;
  tiposDocumentosExtranjero: any[];

  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();


  dtOptions1: DataTables.Settings = {};
  dtTrigger1 = new Subject();

  constructor(private http: HttpClient, private globales: Globales) { }

  ngOnInit() {
    this.ActualizarVista();
  }

  ActualizarVista() {
    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Tipo_Documento' } }).subscribe((data: any) => {
      this.tiposDocumentos = data;      
    });

   
    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Tipo_Documento_Extranjero' } }).subscribe((data: any) => {
      this.tiposDocumentosExtranjero = data;
    });   
  }

  GuardarDocumentoExtranjero(formulario: NgForm, modal) {
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    datos.append("modulo", 'Tipo_Documento_Extranjero');
    datos.append("datos", info);
    this.OcultarFormulario(modal);
    this.http.post(this.globales.ruta + 'php/genericos/guardar_generico.php', datos)
      .catch(error => {
        console.error('An error occurred:', error.error);
        this.errorSwal.show();
        return this.handleError(error);
      })
      .subscribe((data: any) => {
        formulario.reset();
        this.ActualizarVista();
        this.saveSwal.show();
      });

  }

  EditarDocumentoExtranjero(id, modal){
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

  GuardarDocumento(formulario: NgForm, modal) {
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    datos.append("modulo", 'Tipo_Documento');
    datos.append("datos", info);
    this.OcultarFormulario(modal);
    this.http.post(this.globales.ruta + 'php/genericos/guardar_generico.php', datos)
      .catch(error => {
        console.error('An error occurred:', error.error);
        this.errorSwal.show();
        return this.handleError(error);
      })
      .subscribe((data: any) => {
        formulario.reset();
        this.ActualizarVista();
        this.saveSwal.show();
      });

  }

  handleError(error: Response) {
    return Observable.throw(error);
  }

  VerDocumento(id, modal) {
    this.http.get(this.globales.ruta + 'php/tiposdocumentos/detalle_tipo_documento.php', {
      params: { id: id }
    }).subscribe((data: any) => {
      this.Identificacion = id;
      this.Nombre = data.Nombre;
      this.Codigo = data.Codigo;
      modal.show();
    });
  }

  EditarDocumento(id, modal) {
    this.http.get(this.globales.ruta + 'php/genericos/detalle.php', {
      params: { modulo: 'Tipo_Documento', id: id }
    }).subscribe((data: any) => {
      this.Identificacion = id;
      this.Nombre = data.Nombre;
      this.Codigo = data.Codigo;
      this.Orden = data.Orden;
      modal.show();
    });
  }

  EliminarDocumento(id, tipo) {

    switch (tipo) {
      case "Extranjero": {
        this.eliminardoc('Tipo_Documento_Extranjero', id);
        break;
      }
      default: {
        this.eliminardoc('Tipo_Documento', id);
        break;
      }
    }

  }

  OcultarFormulario(modal) {
    this.Identificacion = null;
    this.Nombre = null;
    this.Codigo = null;
    modal.hide();
  }

  Cerrar(modal) {
    this.OcultarFormulario(modal)
  }

  eliminardoc(modulo, id) {
    let datos = new FormData();
    datos.append("modulo", modulo);
    datos.append("id", id);
    this.http.post(this.globales.ruta + 'php/genericos/eliminar_generico.php', datos).subscribe((data: any) => {
      this.deleteSwal.show();
      this.ActualizarVista();
    });
  }

}
