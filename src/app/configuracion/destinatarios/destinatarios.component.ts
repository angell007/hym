import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Globales } from '../../shared/globales/globales';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-destinatarios',
  templateUrl: './destinatarios.component.html',
  styleUrls: ['./destinatarios.component.scss']
})
export class DestinatariosComponent implements OnInit {

  public destinatarios: any[] = [];
  public Paises: any[];
  public Bancos: any[];

  //variables de formulario
  public Identificacion: any[];
  public Nombre: any[];
  public Cuentas: any[];
  public IdBanco: any[];
  public Banco: any[];
  public IdPais: any[];
  public Pais: any[];
  public Detalle: any[];
  public disabled: boolean = true;
  public Lista_Cuentas = [];
  public Detalle_Destinatario: any[] = [];
  public Lista_Destinatarios: any = [{
    Id_Pais: 2,
    Id_Banco: '',
    Bancos: [],
    Id_Tipo_Cuenta: '',
    Numero_Cuenta: ''
  }]

  public boolNombre: boolean = false;
  public boolId: boolean = false;
  public cuentas: any[] = [];
  public datos: any[] = [];
  public Id_Destinatario: any;

  //Valores por defecto
  paisDefault: string = "";
  bancoDefault: string = "";
  cuentasDefault: string = "";

  @ViewChild('ModalVerDestinatario') ModalVerDestinatario: any;
  @ViewChild('ModalEditarDestinatario') ModalEditarDestinatario: any;
  @ViewChild('ModalDestinatario') ModalDestinatario: any;
  @ViewChild('FormDestinatario') FormDestinatario: any;
  @ViewChild('errorSwal') errorSwal: any;
  @ViewChild('saveSwal') saveSwal: any;
  @ViewChild('deleteSwal') deleteSwal: any;
  @ViewChild('duplicateSwal') duplicateSwal: any;
  @ViewChild('confirmacionSwal') confirmacionSwal: any;

  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();

  public frame = false;
  TipoDocumentoExtranjero = [];
  url: string;

  constructor(private http: HttpClient, private globales: Globales) { }

  ngOnInit() {
    this.ActualizarVista();
  }

  @HostListener('document:keyup', ['$event']) handleKeyUp(event) {
    if (event.keyCode === 27) {
      this.OcultarFormularios();
    }
  }

  ActualizarVista() {
    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Pais' } }).subscribe((data: any) => {
      this.Paises = data;
      this.Bancos_Pais(2, 0);
    });
    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Banco' } }).subscribe((data: any) => {
      this.Bancos = data;
    });

    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Tipo_Cuenta' } }).subscribe((data: any) => {
      this.Cuentas = data;
    });

    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Tipo_Documento_Extranjero' } }).subscribe((data: any) => {
      this.TipoDocumentoExtranjero = data;
    });

    this.http.get(this.globales.ruta + 'php/destinatarios/lista_destinatarios.php').subscribe((data: any) => {
      this.destinatarios = data;
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
  }

  Bancos_Pais(Pais, i) {
    this.http.get(this.globales.ruta + 'php/genericos/bancos_pais.php', { params: { id: Pais } }).subscribe((data: any) => {
      this.Lista_Destinatarios[i].Bancos = data;
    });
  }

  agregarDinamico(i) {
    var pos = parseInt(i) + 1;
    if (this.Lista_Destinatarios[pos] == undefined) {
      this.AgregarFila();
      this.Bancos_Pais(2, pos);
    }
  }

  OcultarFormularios() {
    this.InicializarBool();
    this.OcultarFormulario(this.ModalDestinatario);
    this.OcultarFormulario(this.ModalVerDestinatario);
    this.OcultarFormulario(this.ModalEditarDestinatario);
  }

  BuscarIdentificacion(id) {
    this.http.get(this.globales.ruta + 'php/destinatarios/detalle_destinatario.php', {
      params: { id: id }
    }).subscribe((data: any) => {
      this.datos = data.Cuentas;
      if (this.datos.length > 0) {
        this.confirmacionSwal.title = "Error en la Identificacion";
        this.confirmacionSwal.text = "Esta identificacion ya se encuentra registrada, por favor verifique";
        this.confirmacionSwal.type = "error";
        this.confirmacionSwal.show();
        this.Id_Destinatario = "";
      } else {
        var tipoDoc = ((document.getElementById("Tipo_Documento") as HTMLInputElement).value);
        this.buscarCne(id,tipoDoc);
      }
    });

  }

  codigoBanco(seleccion, posicion, texto) {

    var pais = ((document.getElementById("Id_Pais" + posicion) as HTMLInputElement).value);

    if (pais == "2") {
      switch (texto) {
        case "check": {
          var buscarBanco = this.Bancos.findIndex(x => x.Id_Banco === seleccion)
          this.Lista_Destinatarios[posicion].Numero_Cuenta = this.Bancos[buscarBanco].Identificador;
          break;
        }
        case "input": {
          if(seleccion.length == 4){
            var buscarBanco = this.Bancos.findIndex(x => x.Identificador === seleccion)
            if(buscarBanco > -1){
              this.Lista_Destinatarios[posicion].Id_Banco = this.Bancos[buscarBanco].Id_Banco;
            }else{
              this.Lista_Destinatarios[posicion].Id_Banco = '';
            }
          }else{
            if(seleccion.length < 4 && seleccion.length > 0){
              this.Lista_Destinatarios[posicion].Id_Banco = '';
            }
          }
          break;
        }
      }
    }

  }

  InicializarBool() {
    this.boolNombre = false;
    this.boolId = false;
  }

  buscarCne(id, tipo) {
    
    this.url = "http://cne.gov.ve/web/registro_electoral/ce.php?nacionalidad=" + tipo + "&cedula=" + id;
    this.frame = true;
  }

  /**
   *guarda los datos ingresados en el formulario en la tabla que se indica como segundo parametro en 
   *datos.append("modulo", 'nombre de la tabla')
   *
   * @param {NgForm} formulario
   * @memberof DestinatariosComponent
   */
  GuardarDestinatario(formulario: NgForm, modal: any) {
    let info = JSON.stringify(formulario.value);
    let destinatario = JSON.stringify(this.Lista_Destinatarios);
    let datos = new FormData();
    this.OcultarFormulario(modal);
    //datos.append("modulo",'Destinatario');
    datos.append("datos", info);
    datos.append("destinatario", destinatario);
    this.http.post(this.globales.ruta + 'php/destinatarios/guardar_destinatario.php', datos)
      .catch(error => {
        console.error('An error occurred:', error.error);
        this.errorSwal.show();
        return this.handleError(error);
      })
      .subscribe((data: any) => {
        this.Lista_Destinatarios = [{
          Id_Pais: '',
          Id_Banco: '',
          Bancos: [],
          Id_Tipo_Cuenta: '',
          Numero_Cuenta: ''
        }];
        localStorage.removeItem("Lista_Inicial");
        formulario.reset();
        this.ActualizarVista();
        this.saveSwal.show();
      });
  }

  GuardarDestinatarioEditar(formulario: NgForm, modal: any) {
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    this.OcultarFormulario(modal);
    datos.append("modulo", 'Destinatario');
    datos.append("datos", info);
    this.http.post(this.globales.ruta + 'php/genericos/guardar_generico.php', datos)
      .catch(error => {
        console.error('An error occurred:', error.error);
        this.errorSwal.show();
        return this.handleError(error);
      })
      .subscribe((data: any) => {
        this.Lista_Destinatarios = [{
          Id_Pais: '',
          Id_Banco: '',
          Bancos: [],
          Id_Tipo_Cuenta: '',
          Numero_Cuenta: ''
        }];

        this.ActualizarVista();
        this.InicializarBool();
        this.saveSwal.show();
      });

  }

  handleError(error: Response) {
    return Observable.throw(error);
  }

  VerDestinatario(id, modal) {
    this.http.get(this.globales.ruta + 'php/destinatarios/detalle_destinatario.php', {
      params: { id: id }
    }).subscribe((data: any) => {
      this.Detalle_Destinatario = data;
      this.cuentas = data.Cuentas;
      this.Identificacion = id;
      modal.show();
    });

  }

  EditarDestinatario(id) {
    this.InicializarBool();
    this.http.get(this.globales.ruta + 'php/destinatarios/editar_destinatario.php', {
      params: { id: id }
    }).subscribe((data: any) => {
      console.log(data.destinatario);
      this.Detalle_Destinatario = data.destinatario;      
      this.Lista_Destinatarios = data.DestinatarioCuenta;

      for(var i = 0 ; i < this.Lista_Destinatarios.length ; i++){
        this.Bancos_Pais(this.Lista_Destinatarios[i].Id_Pais,i);
      }

      this.Identificacion = id;
      this.ModalEditarDestinatario.show();
    });
  }

  EliminarDestinatario(id) {
    let datos = new FormData();
    datos.append("modulo", 'Destinatario');
    datos.append("id", id);
    this.http.post(this.globales.ruta + 'php/genericos/anular_generico.php', datos).subscribe((data: any) => {
      this.deleteSwal.show();
      this.ActualizarVista();
    });
  }

  OcultarFormulario(modal) {
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
      Id_Pais: 2,
      Id_Banco: '',
      Bancos: [],
      Id_Tipo_Cuenta: '',
      Numero_Cuenta: ''
    })

  }


  EliminarFila(i) {

    this.Lista_Cuentas.splice(i, 1);
  }

  Cerrar(modal) {
    this.OcultarFormulario(modal)
  }

  habilitarboton() {
    this.disabled = false;
  }

}
