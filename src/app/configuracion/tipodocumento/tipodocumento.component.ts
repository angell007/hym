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

  @HostListener('document:keyup', ['$event']) handleKeyUp(event) {
    if (event.keyCode === 27) {
      this.OcultarFormularios();
    }
  }

  OcultarFormularios() {
    this.InicializarBool();
    this.OcultarFormulario(this.ModalDocumento);
    this.OcultarFormulario(this.ModalVerDocumento);
    this.OcultarFormulario(this.ModalEditarDocumento);
  }

  InicializarBool() {
    this.boolNombre = false;
    this.boolCodigo = false;
  }

  ActualizarVista() {
    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Tipo_Documento' } }).subscribe((data: any) => {
      this.tiposDocumentos = data;
      this.dtTrigger.next();
    });

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      dom: 'Bfrtip',
      responsive: true,
      /* below is the relevant part, e.g. translated to spanish */
      language: {
        processing: "Procesando...",
        search: "Buscar:",
        lengthMenu: "Mostrar _MENU_ &eacute;l&eacute;ments",
        info: "Mostrando desde _START_ al _END_ de _TOTAL_ elementos",
        infoEmpty: "Mostrando ningún elemento.",
        infoFiltered: "(filtrado _MAX_ elementos total)",
        infoPostFix: "",
        loadingRecords: "Cargando registros...",
        zeroRecords: "No se encontraron registros",
        emptyTable: "No hay datos disponibles en la tabla",
        paginate: {
          first: "<<",
          previous: "<",
          next: ">",
          last: ">>"
        },
        aria: {
          sortAscending: ": Activar para ordenar la tabla en orden ascendente",
          sortDescending: ": Activar para ordenar la tabla en orden descendente"
        }
      }
    };

    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Tipo_Documento_Extranjero' } }).subscribe((data: any) => {
      this.tiposDocumentosExtranjero = data;
      this.dtTrigger1.next();
    });

    this.dtOptions1 = {
      pagingType: 'full_numbers',
      pageLength: 10,
      dom: 'Bfrtip',
      responsive: true,
      /* below is the relevant part, e.g. translated to spanish */
      language: {
        processing: "Procesando...",
        search: "Buscar:",
        lengthMenu: "Mostrar _MENU_ &eacute;l&eacute;ments",
        info: "Mostrando desde _START_ al _END_ de _TOTAL_ elementos",
        infoEmpty: "Mostrando ningún elemento.",
        infoFiltered: "(filtrado _MAX_ elementos total)",
        infoPostFix: "",
        loadingRecords: "Cargando registros...",
        zeroRecords: "No se encontraron registros",
        emptyTable: "No hay datos disponibles en la tabla",
        paginate: {
          first: "<<",
          previous: "<",
          next: ">",
          last: ">>"
        },
        aria: {
          sortAscending: ": Activar para ordenar la tabla en orden ascendente",
          sortDescending: ": Activar para ordenar la tabla en orden descendente"
        }
      }
    };
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
        this.InicializarBool();
        this.saveSwal.show();
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
        this.InicializarBool();
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
    this.InicializarBool();
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
