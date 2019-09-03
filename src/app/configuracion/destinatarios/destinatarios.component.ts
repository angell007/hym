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
  public Lista_Cuentas_Destinatario = [{
    Id_Pais: '',
    Id_Banco: '',
    Bancos: [],
    Id_Tipo_Cuenta: '',
    Numero_Cuenta: '',
    Otra_Cuenta: '',
    Observacion: ''
  }];
  public DestinatarioCuenta =[];

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
  public TipoDocumentoExtranjero:any = [];
  url: string;
  frameRiff = false;
  urlCne: string;
  urlRiff: string;

  //NUEVA VARIABLES
  public SePuedeAgregarMasCuentas = false;
  public TipoDocumentoFiltrados:any = [];
  public DestinatarioModel:any = {
    Id_Destinatario: '',
    Nombre: '',
    Detalle: '',
    Estado: 'Activo',
    Tipo_Documento: '',
    Id_Pais: ''
  };

  constructor(private http: HttpClient, private globales: Globales, public sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.ActualizarVista();
    setTimeout(() => {
      
      this.AsignarPaises();
      this.AsignarTipoDoumentoExtranjero();
    }, 800);
  }

  @HostListener('document:keyup', ['$event']) handleKeyUp(event) {
    if (event.keyCode === 27) {
      this.OcultarFormularios();
    }
  }

  ActualizarVista() {
    /*this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Pais' } }).subscribe((data: any) => {
      this.Paises = data;
      //this.Bancos_Pais(2, 0);
    });*/
    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Banco' } }).subscribe((data: any) => {
      this.Bancos = data;
    });

    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Tipo_Cuenta' } }).subscribe((data: any) => {
      this.Cuentas = data;
    });

    /*this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Tipo_Documento_Extranjero' } }).subscribe((data: any) => {
      this.TipoDocumentoExtranjero = data;
    });*/

    this.http.get(this.globales.ruta + 'php/destinatarios/lista_destinatarios.php').subscribe((data: any) => {
      this.destinatarios = data;
    });
  
  }

  Bancos_Pais(Pais, i) {
    this.http.get(this.globales.ruta + 'php/genericos/bancos_pais.php', { params: { id: Pais } }).subscribe((data: any) => {
      
      this.Lista_Cuentas_Destinatario[i].Numero_Cuenta = '';
      this.Lista_Cuentas_Destinatario[i].Id_Banco = '';
      this.Lista_Cuentas_Destinatario[i].Id_Tipo_Cuenta = '';

      if(data != ''){
        this.Lista_Cuentas_Destinatario[i].Bancos = data;
      }else{
        this.Lista_Cuentas_Destinatario[i].Bancos = [];
      }
      
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
    let country = this.Lista_Cuentas_Destinatario[posicion].Id_Pais;

    if (country == "2") {
      switch (texto) {
        case "check": {
          var buscarBanco = this.Bancos.findIndex(x => x.Id_Banco === seleccion)
          this.Lista_Cuentas_Destinatario[posicion].Numero_Cuenta = this.Bancos[buscarBanco].Identificador;
          break;
        }
        case "input": {

          var cadena = seleccion.substring(0, 4);
          
          var buscarBanco = this.Bancos.findIndex(x => x.Identificador === cadena)
          if (buscarBanco > -1) {
            this.Lista_Cuentas_Destinatario[posicion].Id_Banco = this.Bancos[buscarBanco].Id_Banco;
          } else {
            this.Lista_Cuentas_Destinatario[posicion].Id_Banco = '';
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
    
    this.Lista_Cuentas_Destinatario.forEach((element,index) => {
      element.Bancos = [];
      if(element.Numero_Cuenta == ""){
        this.Lista_Cuentas_Destinatario.splice(index,1);
      }
    });
    
    let info = JSON.stringify(formulario.value);
    let destinatario = JSON.stringify(this.Lista_Cuentas_Destinatario);
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
        /*this.Lista_Cuentas_Destinatario = []
        this.Lista_Cuentas_Destinatario.push({
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
        this.ActualizarVista();*/
        this.LimpiarModelos();
        modal.hide();
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
      this.Lista_Cuentas_Destinatario = data.DestinatarioCuenta;

      for (var i = 0; i < this.Lista_Cuentas_Destinatario.length; i++) {
        this.Bancos_Pais(this.Lista_Cuentas_Destinatario[i].Id_Pais, i);
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
      if (this.Lista_Cuentas_Destinatario[pos] == undefined) {
        this.Lista_Cuentas_Destinatario.push({
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

    var cedula = this.DestinatarioModel.Id_Destinatario;
    if (cedula == undefined || cedula == '') {
      this.confirmacionSwal.title = "Alerta";
      this.confirmacionSwal.text = "Debe colocar un número de identificación para proseguir";
      this.confirmacionSwal.type = "warning";
      this.confirmacionSwal.show();
      this.DestinatarioModel.Tipo_Documento = '';
      return;
      //cedula = (document.getElementById("idDestinatario") as HTMLInputElement).value;
    }

    let countryObject = this.Paises.find(x => x.Id_Pais == this.DestinatarioModel.Id_Pais);

    if (!this.globales.IsObjEmpty(countryObject)) {
      if (countryObject.Nombre == 'Venezuela') {
        
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
    }
  }

  buscarRiff() {
    this.urlRiff = "http://contribuyente.seniat.gob.ve/BuscaRif/BuscaRif.jsp";
    //this.frameRiff = !this.frameRiff;
    window.open("http://contribuyente.seniat.gob.ve/BuscaRif/BuscaRif.jsp", '_blank');
  }

  botonDestinatario = false;
  validarBanco(i, valor) {
    setTimeout(() => {
      
      //var idpais = ((document.getElementById("Id_Pais" + i) as HTMLInputElement).value);
      let ctaObject = this.Lista_Cuentas_Destinatario[i];
      let countryObject = this.Paises.find(x => x.Id_Pais == ctaObject.Id_Pais);
      
      if (!this.globales.IsObjEmpty(ctaObject) && !this.globales.IsObjEmpty(countryObject)) {        

        if (countryObject.Nombre == 'Venezuela') {
          
          if (countryObject.Cantidad_Digitos_Cuenta != 0) {
            
            let longitud = this.LongitudCarateres(valor);
            if (longitud != parseInt(countryObject.Cantidad_Digitos_Cuenta)) {
              this.botonDestinatario = false;
              this.confirmacionSwal.title = "Alerta";
              this.confirmacionSwal.text = "Digite la cantidad correcta de dígitos de la cuenta";
              this.confirmacionSwal.type = "warning";
              this.confirmacionSwal.show();
              this.SePuedeAgregarMasCuentas = false;
              return;
            }              
          }

          this.http.get(this.globales.ruta+'php/bancos/validar_cuenta_bancaria.php', {params: {cta_bancaria:valor} } ).subscribe((data)=>{
            if(data == 1){
              this.botonDestinatario = false;
              this.confirmacionSwal.title = "Alerta";
              this.confirmacionSwal.text = "La cuenta que intenta registrar ya se encuentra registrada en la base de datos!";
              this.confirmacionSwal.type = "warning";
              this.confirmacionSwal.show();
              this.SePuedeAgregarMasCuentas = false;
              this.Lista_Cuentas_Destinatario[i].Numero_Cuenta = '';
            }else{
              this.botonDestinatario = false;
              this.SePuedeAgregarMasCuentas = true;
            }
          });
        }else{

          this.http.get(this.globales.ruta+'php/bancos/validar_cuenta_bancaria.php', {params: {cta_bancaria:valor} } ).subscribe((data)=>{
            if(data == 1){
              this.botonDestinatario = false;
              this.confirmacionSwal.title = "Alerta";
              this.confirmacionSwal.text = "La cuenta que intenta registrar ya se encuentra registrada en la base de datos!";
              this.confirmacionSwal.type = "warning";
              this.confirmacionSwal.show();
              this.SePuedeAgregarMasCuentas = false;
              this.Lista_Cuentas_Destinatario[i].Numero_Cuenta = '';
            }else{
              this.botonDestinatario = false;
              this.SePuedeAgregarMasCuentas = true;
            }
          });
        }
      }
    }, 700);
    

    /*if (parseInt(idpais) == 2) {
      var longitud = this.LongitudCarateres(valor);
      if (longitud != 20) {
        this.botonDestinatario = false;
        this.confirmacionSwal.title = "Banco no valido";
        this.confirmacionSwal.text = "Digite correctamente el número del banco";
        this.confirmacionSwal.type = "error";
        this.confirmacionSwal.show();
      }

      var indice = this.DestinatarioCuenta.findIndex(x => x.Numero_Cuenta === valor);
      if (indice > -1) {
        this.confirmacionSwal.title = "Cuenta Repetida";
        this.confirmacionSwal.text = "Esta cuenta fue creada anteriormente y le pertenece a " + this.DestinatarioCuenta[indice].Nombre;
        this.confirmacionSwal.type = "error";
        this.confirmacionSwal.show();
        ((document.getElementById("BotonGuardarDestinatario") as HTMLInputElement).disabled) = true;
      } else {
        ((document.getElementById("BotonGuardarDestinatario") as HTMLInputElement).disabled) = false;
      }
    }*/
  }
  //DestinatarioCuenta =[];
  bancosDestinatarios() {
    this.http.get(this.globales.ruta + '/php/destinatarios/cuenta_bancaria_destinatario.php').subscribe((data: any) => {
      this.DestinatarioCuenta = data;
    });
  }

  LongitudCarateres(i) {
    return parseInt(i.length);
  }

  //METODOS NUEVOS
  SetIdentificadorCuenta(idBanco, i){
    //comprobar de que pais es el banco
    //buscar el identificador del banco si posee

    let cuentaDestinatario = this.Lista_Cuentas_Destinatario[i].Numero_Cuenta;    

    if (cuentaDestinatario == '') {

      this.http.get(this.globales.ruta+'/php/bancos/buscar_identificador.php', {params:{id_banco:idBanco}}).subscribe((data:string)=>{
        this.Lista_Cuentas_Destinatario[i].Numero_Cuenta = data;
      });     
    }    
  }

  AgregarOtraCuenta(){
    let longitudCuentas = this.Lista_Cuentas_Destinatario.length;
    console.log(longitudCuentas);
    console.log(this.SePuedeAgregarMasCuentas);
    console.log(this.Lista_Cuentas_Destinatario[(longitudCuentas - 1)]);
    

    if (this.SePuedeAgregarMasCuentas && this.Lista_Cuentas_Destinatario[(longitudCuentas - 1)].Id_Tipo_Cuenta != '') {
      
      let nuevaCuenta = {
        Id_Pais: '',
        Id_Banco: '',
        Bancos: [],
        Id_Tipo_Cuenta: '',
        Numero_Cuenta: '',
        Otra_Cuenta: '',
        Observacion: ''
      };
      this.Lista_Cuentas_Destinatario.push(nuevaCuenta);
      this.SePuedeAgregarMasCuentas = false;
    }else{
      this.botonDestinatario = false;
      this.confirmacionSwal.title = "Faltan Datos";
      this.confirmacionSwal.text = "Faltan datos en la(s) cuenta(s) actuales, revise por favor!";
      this.confirmacionSwal.type = "warning";
      this.confirmacionSwal.show();
    }
  }

  AsignarTipoDoumentoExtranjero(){
    this.TipoDocumentoExtranjero = this.globales.TipoDocumentoExtranjero;    
  }

  AsignarPaises(){
    this.Paises = this.globales.Paises;
  }

  FiltrarDatosNacionalidad(idPais){

    this.DestinatarioModel.Id_Destinatario = '';
    this.TipoDocumentoFiltrados = [];
    this.DestinatarioModel.Nombre = '';
    
    if (this.TipoDocumentoExtranjero.length > 0) {
      this.TipoDocumentoExtranjero.forEach(documentObj  => {
        if (documentObj.Id_Pais == idPais) {
          this.TipoDocumentoFiltrados.push(documentObj);  
        }        
      });
    }
  }

  RevalidarValores(nroCuenta, index){
    if(nroCuenta == ''){
      if(!this.globales.IsObjEmpty(this.Lista_Cuentas_Destinatario[index])){
        this.Lista_Cuentas_Destinatario[index].Id_Banco = '';
        this.Lista_Cuentas_Destinatario[index].Id_Tipo_Cuenta = '';
      }
    }
  }

  ValidarCedula(identificacion){
    this.http.get(this.globales.ruta+'/php/destinatarios/validar_identificacion.php', {params:{id:identificacion}}).subscribe((data:any)=>{
      if(data == 1){
        this.confirmacionSwal.title = "Alerta";
        this.confirmacionSwal.text = "El número de identificación que intenta registrar ya se encuentra registrada en la base de datos!";
        this.confirmacionSwal.type = "warning";
        this.confirmacionSwal.show();
        this.DestinatarioModel.Id_Destinatario = ''; 
      }
    });
  }

  LimpiarModelos(){
    this.DestinatarioModel = {
      Id_Destinatario: '',
      Nombre: '',
      Detalle: '',
      Estado: 'Activo',
      Tipo_Documento: '',
      Id_Pais: ''
    };

    this.Lista_Cuentas_Destinatario = [{
      Id_Pais: '',
      Id_Banco: '',
      Bancos: [],
      Id_Tipo_Cuenta: '',
      Numero_Cuenta: '',
      Otra_Cuenta: '',
      Observacion: ''
    }];
    
    this.TipoDocumentoFiltrados = [];
    this.SePuedeAgregarMasCuentas = false;
  }
}
