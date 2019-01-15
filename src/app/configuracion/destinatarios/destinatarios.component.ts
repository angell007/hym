import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Globales } from '../../shared/globales/globales';
import { Subject } from 'rxjs/Subject';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-destinatarios',
  templateUrl: './destinatarios.component.html',
  styleUrls: ['./destinatarios.component.scss']
})
export class DestinatariosComponent implements OnInit {

  public destinatarios: any = [] = [];
  public Paises: any = [];
  public Bancos: any = [];

  //variables de formulario
  public Identificacion: any = [];
  public Nombre: any = [];
  public Cuentas: any = [];
  public IdBanco: any = [];
  public Banco: any = [];
  public IdPais: any = [];
  public Pais: any = [];
  public Detalle: any = [];
  public disabled: boolean = true;
  public Lista_Cuentas = [];
  public Detalle_Destinatario: any = [] = [];
  public Lista_Destinatarios = [{
    Id_Pais: '2',
    Id_Banco: '',
    Bancos: [],
    Id_Tipo_Cuenta: '',
    Numero_Cuenta: '',
    Otra_Cuenta: '',
    Observacion: ''
  }];

  public boolNombre: boolean = false;
  public boolId: boolean = false;
  public cuentas: any = [] = [];
  public datos: any = [] = [];
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
  frameRiff = false;
  urlCne: string;
  urlRiff: string;

  constructor(private http: HttpClient, private globales: Globales, public sanitizer: DomSanitizer) { }

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
    });
  
  }

  Bancos_Pais(Pais, i) {
    this.http.get(this.globales.ruta + 'php/genericos/bancos_pais.php', { params: { id: Pais } }).subscribe((data: any) => {
      this.Lista_Destinatarios[i].Bancos = data;
    });
  }



  OcultarFormularios() {
    this.InicializarBool();
    this.OcultarFormulario(this.ModalDestinatario);
    this.OcultarFormulario(this.ModalVerDestinatario);
    this.OcultarFormulario(this.ModalEditarDestinatario);
  }

  /*
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
      } 
    });
  }*/

  codigoBanco(seleccion, posicion, texto) {

    //console.log(seleccion + " , " + posicion + " , " + texto);
    var pais = ((document.getElementById("Id_Pais" + posicion) as HTMLInputElement).value);
    //console.log("pais = " + 2);

    if (pais == "2") {
      switch (texto) {
        case "check": {
          var buscarBanco = this.Bancos.findIndex(x => x.Id_Banco === seleccion)
          this.Lista_Destinatarios[posicion].Numero_Cuenta = this.Bancos[buscarBanco].Identificador;
          break;
        }
        case "input": {
          //console.log("soy input");

          var cadena = seleccion.substring(0, 4);
          var buscarBanco = this.Bancos.findIndex(x => x.Identificador === cadena)
          if (buscarBanco > -1) {
            this.Lista_Destinatarios[posicion].Id_Banco = this.Bancos[buscarBanco].Id_Banco;
          } else {
            this.Lista_Destinatarios[posicion].Id_Banco = '';
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

  /**
   *guarda los datos ingresados en el formulario en la tabla que se indica como segundo parametro en 
   *datos.append("modulo", 'nombre de la tabla')
   *
   * @param {NgForm} formulario
   * @memberof DestinatariosComponent
   */
  GuardarDestinatario(formulario: NgForm, modal: any) {
    
    this.Lista_Destinatarios.forEach((element,index) => {
      if(element.Numero_Cuenta == ""){
        this.Lista_Destinatarios.splice(index,1);
      }
    });
    
    let info = JSON.stringify(formulario.value);
    let destinatario = JSON.stringify(this.Lista_Destinatarios);
    let datos = new FormData();
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
        this.Lista_Destinatarios = []
        this.Lista_Destinatarios.push({
          Id_Pais: '2',
          Id_Banco: '',
          Bancos: [],
          Id_Tipo_Cuenta: '',
          Numero_Cuenta: '',
          Otra_Cuenta: '',
          Observacion: ''
        });
        modal.hide();
        formulario.reset();
        this.ActualizarVista();
        this.saveSwal.show();
      });
  }

  EstadoDestinatario(value, estado){
    let datos = new FormData();
    var titulo;
    var texto;
    datos.append("modulo", "Destinatario");
    datos.append("id", value);
    switch(estado){
      case "Activo":{
        datos.append("estado", "Activo");
        titulo = "Destinatario Eliminado";
        texto ="Se ha eliminado correctamente el destinatario seleccionado";
        break;
      }
      case "Inactivo":{
        datos.append("estado", "Inactivo");
        titulo = "Destinatario Eliminado";
        texto ="Se ha eliminado correctamente el destinatario seleccionado";
        break;
      }
    }
    
    this.http.post(this.globales.ruta + 'php/genericos/anular_generico.php', datos).subscribe((data: any) => {
      this.confirmacionSwal.title = titulo;
      this.confirmacionSwal.text = texto;
      this.confirmacionSwal.type = "success";
      this.confirmacionSwal.show();    
      //this.destinatarios= data;
      this.ActualizarVista();  
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

  posiciontemporal: any;
  EditarDestinatario(id, pos) {
    this.http.get(this.globales.ruta + 'php/destinatarios/editar_destinatario.php', {
      params: { id: id }
    }).subscribe((data: any) => {
      ////console.log(data.destinatario);
      this.Detalle_Destinatario = data.destinatario;
      this.Lista_Destinatarios = data.DestinatarioCuenta;

      for (var i = 0; i < this.Lista_Destinatarios.length; i++) {
        this.Bancos_Pais(this.Lista_Destinatarios[i].Id_Pais, i);
      }

      this.Identificacion = id;
      //this.AgregarFila();
      this.Bancos_Pais(2, 1);
      this.ModalEditarDestinatario.show();
      this.posiciontemporal = pos;
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


  EliminarFila(i) {

    this.Lista_Cuentas.splice(i, 1);
  }

  Cerrar(modal) {
    this.OcultarFormulario(modal)
  }

  habilitarboton() {
    this.disabled = false;
  }

  verificarChequeo(pos, check) {
    var checkeo = (document.getElementById("checkeo_" + pos) as HTMLInputElement).checked;

    switch (check) {
      case true: {
        ((document.getElementById("Observacion_Destinatario" + pos) as HTMLInputElement).disabled) = false;
        ((document.getElementById("Otra_Cuenta_Destinatario" + pos) as HTMLInputElement).disabled) = false;
        break;
      }
      case false: {
        ((document.getElementById("Observacion_Destinatario" + pos) as HTMLInputElement).disabled) = true;
        ((document.getElementById("Otra_Cuenta_Destinatario" + pos) as HTMLInputElement).disabled) = true;
        break;
      }
    }

  }

  AgregarFila(i, valor) {

    var idpais = ((document.getElementById("Id_Banco" + i) as HTMLInputElement).value)

    if (valor != "" && idpais != "") {
      var pos = parseInt(i) + 1;
      if (this.Lista_Destinatarios[pos] == undefined) {
        this.Lista_Destinatarios.push({
          Id_Pais: '2',
          Id_Banco: '',
          Bancos: [],
          Id_Tipo_Cuenta: '',
          Numero_Cuenta: '',
          Otra_Cuenta: '',
          Observacion: ''
        });

        this.Bancos_Pais(2, pos);
      }
    }

  }

  BuscarCNE(valor) {

    var cedula = this.Id_Destinatario;
    if (cedula == undefined) {
      cedula = (document.getElementById("idDestinatario") as HTMLInputElement).value;
    }

    switch (valor) {
      case "V": {
        //this.frame = true;
        this.urlCne = "http://www4.cne.gob.ve/web/registro_electoral/ce.php?nacionalidad=V&cedula=" + cedula;
        window.open("http://www4.cne.gob.ve/web/registro_electoral/ce.php?nacionalidad=V&cedula=" + cedula, '_blank');
        break;
      }
      case "E": {
        //this.frame = true;
        this.urlCne = "http://www4.cne.gob.ve/web/registro_electoral/ce.php?nacionalidad=E&cedula=" + cedula;
        window.open("http://www4.cne.gob.ve/web/registro_electoral/ce.php?nacionalidad=E&cedula=" + cedula, '_blank');
        break;
      }
      default: {
        this.frame = false;
      }
      /*if (window.frames['myframe'] && !userSet){
         this.setAttribute('data-userset', 'true');
         frames['myframe'].location.href='http://test.com/hello?uname='+getUserName();
     }*/
    }


  }

  buscarRiff() {
    this.urlRiff = "http://contribuyente.seniat.gob.ve/BuscaRif/BuscaRif.jsp";
    //this.frameRiff = !this.frameRiff;
    window.open("http://contribuyente.seniat.gob.ve/BuscaRif/BuscaRif.jsp", '_blank');
  }

  botonDestinatario = false;
  validarBanco(i, valor) {
    var idpais = ((document.getElementById("Id_Pais" + i) as HTMLInputElement).value)

    if (parseInt(idpais) == 2) {
      var longitud = this.LongitudCarateres(valor);
      if (longitud != 20) {
        this.botonDestinatario = false;
        this.confirmacionSwal.title = "Banco no valido";
        this.confirmacionSwal.text = "Digite correctamente el número del banco";
        this.confirmacionSwal.type = "error"
        this.confirmacionSwal.show();
      }

      var indice = this.DestinatarioCuenta.findIndex(x => x.Numero_Cuenta === valor);
      if (indice > -1) {
        this.confirmacionSwal.title = "Cuenta Repetida";
        this.confirmacionSwal.text = "Esta cuenta fue creada anteriormente y le pertenece a " + this.DestinatarioCuenta[indice].Nombre;
        this.confirmacionSwal.type = "error"
        this.confirmacionSwal.show();
        ((document.getElementById("BotonGuardarDestinatario") as HTMLInputElement).disabled) = true;
      } else {
        ((document.getElementById("BotonGuardarDestinatario") as HTMLInputElement).disabled) = false;
      }
    }
  }
  DestinatarioCuenta =[];
  bancosDestinatarios() {
    this.http.get(this.globales.ruta + '/php/destinatarios/cuenta_bancaria_destinatario.php').subscribe((data: any) => {
      this.DestinatarioCuenta = data;
    });
  }

  LongitudCarateres(i) {
    return parseInt(i.length);
  }

}
