import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
<<<<<<< HEAD
import {NgForm} from '@angular/forms';
import  {Globales } from '../shared/globales/globales';
=======
import { NgForm } from '@angular/forms';
import { Globales } from '../shared/globales/globales';
>>>>>>> de4f37a2ab29e5d58678930a3c1a3dffabe1b05b
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-creardestinatario-modal',
  templateUrl: './creardestinatario.component.html',
  styleUrls: ['./creardestinatario.component.scss']
})
export class CreardestinatarioComponent implements OnInit {

<<<<<<< HEAD
  @ViewChild('alertSwal') alertSwal:any;
  @ViewChild('ModalDestinatario') ModalDestinatario:any;

  @Input() id_destinatario:number = 0;

  @Output() ReturnDestinatario = new EventEmitter();
  @Output() ControlVisibility:EventEmitter<boolean> = new EventEmitter();
=======
  @ViewChild('alertSwal') alertSwal: any;
  @ViewChild('ModalDestinatario') ModalDestinatario: any;

  @Input() id_destinatario: number = 0;

  @Output() ReturnDestinatario = new EventEmitter();
  @Output() ControlVisibility: EventEmitter<boolean> = new EventEmitter();
>>>>>>> de4f37a2ab29e5d58678930a3c1a3dffabe1b05b

  ShowHideModal(): void {
    this.ControlVisibility.emit(false);
  }

  //MODELO DESTINATARIO
<<<<<<< HEAD
  public DestinatarioModel:any = {
    Id_Destinario:'',
    Nombre:'',
    Estado: 'Activo',
    Tipo_Documento: '',
    Id_Pais: '' 
=======
  public DestinatarioModel: any = {
    Id_Destinario: '',
    Nombre: '',
    Estado: 'Activo',
    Tipo_Documento: '',
    Id_Pais: ''
>>>>>>> de4f37a2ab29e5d58678930a3c1a3dffabe1b05b
  };

  public Lista_Cuentas_Destinatario = [{
    Id_Pais: '',
    Id_Banco: '',
    Bancos: [],
    Id_Tipo_Cuenta: '',
    Numero_Cuenta: ''
  }];

<<<<<<< HEAD
  public Paises:any = [];
  public TiposDocumentoExtranjero:any = [];
  public TiposDocumentoNacionales:any = [];
  public TiposDocumentoFiltrados:any = [];
  public TiposCuenta:any = [];
  public SePuedeAgregarMasCuentas = false;

  constructor(public globales:Globales, private cliente:HttpClient) { }
=======
  public Paises: any = [];
  public TiposDocumentoExtranjero: any = [];
  public TiposDocumentoNacionales: any = [];
  public TiposDocumentoFiltrados: any = [];
  public TiposCuenta: any = [];
  public SePuedeAgregarMasCuentas = false;

  constructor(public globales: Globales, private cliente: HttpClient) { }
>>>>>>> de4f37a2ab29e5d58678930a3c1a3dffabe1b05b

  ngOnInit() {
    this.AsignarPaises();
    this.AsignarDocumentosExtranjeros();
    this.AsignarDocumentosNacionales();
    this.AsignarTiposCuenta();

    // console.log(this.id_destinatario);
<<<<<<< HEAD
    
  }

  AsignarPaises(){
    this.Paises = [];
    this.Paises = this.globales.Paises;
  }

  AsignarDocumentosExtranjeros(){
=======

  }

  async AsignarPaises() {
    this.Paises = [];
    this.Paises = await this.globales.Paises;
  }

  AsignarDocumentosExtranjeros() {
>>>>>>> de4f37a2ab29e5d58678930a3c1a3dffabe1b05b
    this.TiposDocumentoExtranjero = [];
    this.TiposDocumentoExtranjero = this.globales.TipoDocumentoExtranjero;
  }

<<<<<<< HEAD
  AsignarDocumentosNacionales(){
=======
  AsignarDocumentosNacionales() {
>>>>>>> de4f37a2ab29e5d58678930a3c1a3dffabe1b05b
    this.TiposDocumentoNacionales = [];
    this.TiposDocumentoNacionales = this.globales.TipoDocumentoNacionales;
  }

<<<<<<< HEAD
  AsignarTiposCuenta(){
=======
  AsignarTiposCuenta() {
>>>>>>> de4f37a2ab29e5d58678930a3c1a3dffabe1b05b
    this.TiposCuenta = [];
    this.TiposCuenta = this.globales.TiposCuenta;
  }

<<<<<<< HEAD
  ValidarCedula(identificacion){
    this.cliente.get(this.globales.ruta+'/php/destinatarios/validar_identificacion.php', {params:{id:identificacion}}).subscribe((data:any)=>{
      if(data == 1){
        this.ShowSwal('warning', 'Alerta', 'El número de identificación que intenta registrar ya se encuentra registrada en la base de datos!');
        this.DestinatarioModel.Id_Destinatario = ''; 
=======
  ValidarCedula(identificacion) {
    this.cliente.get(this.globales.ruta + '/php/destinatarios/validar_identificacion.php', { params: { id: identificacion } }).subscribe((data: any) => {
      if (data == 1) {
        this.ShowSwal('warning', 'Alerta', 'El número de identificación que intenta registrar ya se encuentra registrada en la base de datos!');
        this.DestinatarioModel.Id_Destinatario = '';
>>>>>>> de4f37a2ab29e5d58678930a3c1a3dffabe1b05b
      }
    });
  }

<<<<<<< HEAD
  FiltrarDatosNacionalidad(idPais){
=======
  FiltrarDatosNacionalidad(idPais) {
>>>>>>> de4f37a2ab29e5d58678930a3c1a3dffabe1b05b

    this.DestinatarioModel.Id_Destinatario = '';
    this.TiposDocumentoFiltrados = [];
    this.DestinatarioModel.Nombre = '';
<<<<<<< HEAD
    
    if (this.TiposDocumentoExtranjero.length > 0) {
      this.TiposDocumentoExtranjero.forEach(documentObj  => {
        if (documentObj.Id_Pais == idPais) {
          this.TiposDocumentoFiltrados.push(documentObj);  
        }        
=======

    if (this.TiposDocumentoExtranjero.length > 0) {
      this.TiposDocumentoExtranjero.forEach(documentObj => {
        if (documentObj.Id_Pais == idPais) {
          this.TiposDocumentoFiltrados.push(documentObj);
        }
>>>>>>> de4f37a2ab29e5d58678930a3c1a3dffabe1b05b
      });
    }
  }

  buscarRiff() {
    let urlRiff = "http://contribuyente.seniat.gob.ve/BuscaRif/BuscaRif.jsp";
    window.open(urlRiff, '_blank');
  }

  BuscarCNE(valor) {

    var cedula = this.DestinatarioModel.Id_Destinatario;
    if (cedula == undefined || cedula == '') {
      this.ShowSwal('warning', 'Alerta', 'Debe colocar un número de identificación para proseguir!');
      this.DestinatarioModel.Tipo_Documento = '';
      return;
    }
  }

<<<<<<< HEAD
  AgregarOtraCuenta(){
    let longitudCuentas = this.Lista_Cuentas_Destinatario.length;    

    if (this.SePuedeAgregarMasCuentas && this.Lista_Cuentas_Destinatario[(longitudCuentas - 1)].Id_Tipo_Cuenta != '') {
      
=======
  AgregarOtraCuenta() {
    let longitudCuentas = this.Lista_Cuentas_Destinatario.length;

    if (this.SePuedeAgregarMasCuentas && this.Lista_Cuentas_Destinatario[(longitudCuentas - 1)].Id_Tipo_Cuenta != '') {

>>>>>>> de4f37a2ab29e5d58678930a3c1a3dffabe1b05b
      let nuevaCuenta = {
        Id_Pais: '',
        Id_Banco: '',
        Bancos: [],
        Id_Tipo_Cuenta: '',
        Numero_Cuenta: ''
      };
      this.Lista_Cuentas_Destinatario.push(nuevaCuenta);
      this.SePuedeAgregarMasCuentas = false;
<<<<<<< HEAD
    }else{
      this.ShowSwal('warning','Faltan Datos','Faltan datos en la(s) cuenta(s) actuales, revise por favor!');
=======
    } else {
      this.ShowSwal('warning', 'Faltan Datos', 'Faltan datos en la(s) cuenta(s) actuales, revise por favor!');
>>>>>>> de4f37a2ab29e5d58678930a3c1a3dffabe1b05b
    }
  }

  Bancos_Pais(Pais, i) {
    this.cliente.get(this.globales.ruta + 'php/genericos/bancos_pais.php', { params: { id: Pais } }).subscribe((data: any) => {
<<<<<<< HEAD
      
=======

>>>>>>> de4f37a2ab29e5d58678930a3c1a3dffabe1b05b
      this.Lista_Cuentas_Destinatario[i].Numero_Cuenta = '';
      this.Lista_Cuentas_Destinatario[i].Id_Banco = '';
      this.Lista_Cuentas_Destinatario[i].Id_Tipo_Cuenta = '';

<<<<<<< HEAD
      if(data != ''){
        this.Lista_Cuentas_Destinatario[i].Bancos = data;
      }else{
        this.Lista_Cuentas_Destinatario[i].Bancos = [];
      }
      
=======
      if (data != '') {
        this.Lista_Cuentas_Destinatario[i].Bancos = data;
      } else {
        this.Lista_Cuentas_Destinatario[i].Bancos = [];
      }

>>>>>>> de4f37a2ab29e5d58678930a3c1a3dffabe1b05b
    });
  }

  CodigoBanco(seleccion, posicion, texto) {

    let country = this.Lista_Cuentas_Destinatario[posicion].Id_Pais;

    if (country == "2") {
      //HACER CONSULTA PARA TRAER LOS BANCO POR PAIS
      switch (texto) {
        case "check": {
          var buscarBanco = this.Lista_Cuentas_Destinatario[posicion].Bancos.findIndex(x => x.Id_Banco === seleccion);
          this.Lista_Cuentas_Destinatario[posicion].Numero_Cuenta = this.Lista_Cuentas_Destinatario[posicion].Bancos[buscarBanco].Identificador;
          break;
        }
        case "input": {

          var cadena = seleccion.substring(0, 4);
<<<<<<< HEAD
          
=======

>>>>>>> de4f37a2ab29e5d58678930a3c1a3dffabe1b05b
          var buscarBanco = this.Lista_Cuentas_Destinatario[posicion].Bancos.findIndex(x => x.Identificador === cadena);
          if (buscarBanco > -1) {
            this.Lista_Cuentas_Destinatario[posicion].Id_Banco = this.Lista_Cuentas_Destinatario[posicion].Bancos[buscarBanco].Id_Banco;
          } else {
            this.Lista_Cuentas_Destinatario[posicion].Id_Banco = '';
          }
          break;
        }
      }
    }
  }

<<<<<<< HEAD
  ShowSwal(tipo:string, titulo:string, msg:string, confirmCallback = null, cancelCallback = null){
=======
  ShowSwal(tipo: string, titulo: string, msg: string, confirmCallback = null, cancelCallback = null) {
>>>>>>> de4f37a2ab29e5d58678930a3c1a3dffabe1b05b
    this.alertSwal.type = tipo;
    this.alertSwal.title = titulo;
    this.alertSwal.text = msg;
    this.alertSwal.show();
  }

  LongitudCarateres(i) {
    return parseInt(i.length);
  }

<<<<<<< HEAD
  SetIdentificadorCuenta(idBanco, i){
    //comprobar de que pais es el banco
    //buscar el identificador del banco si posee

    let cuentaDestinatario = this.Lista_Cuentas_Destinatario[i].Numero_Cuenta;    

    if (cuentaDestinatario == '') {

      this.cliente.get(this.globales.ruta+'/php/bancos/buscar_identificador.php', {params:{id_banco:idBanco}}).subscribe((data:any)=>{
        this.Lista_Cuentas_Destinatario[i].Numero_Cuenta = data;
      });     
    }    
  }

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
    
=======
  SetIdentificadorCuenta(idBanco, i) {
    //comprobar de que pais es el banco
    //buscar el identificador del banco si posee

    let cuentaDestinatario = this.Lista_Cuentas_Destinatario[i].Numero_Cuenta;

    if (cuentaDestinatario == '') {

      this.cliente.get(this.globales.ruta + '/php/bancos/buscar_identificador.php', { params: { id_banco: idBanco } }).subscribe((data: any) => {
        this.Lista_Cuentas_Destinatario[i].Numero_Cuenta = data;
      });
    }
  }

  GuardarDestinatario(formulario: NgForm, modal: any) {

    this.Lista_Cuentas_Destinatario.forEach((element, index) => {
      element.Bancos = [];
      if (element.Numero_Cuenta == "") {
        this.Lista_Cuentas_Destinatario.splice(index, 1);
      }
    });

    let info = JSON.stringify(formulario.value);
    let destinatario = JSON.stringify(this.Lista_Cuentas_Destinatario);
    let datos = new FormData();

>>>>>>> de4f37a2ab29e5d58678930a3c1a3dffabe1b05b
    //datos.append("modulo",'Destinatario');
    datos.append("datos", info);
    datos.append("destinatario", destinatario);
    this.cliente.post(this.globales.ruta + 'php/destinatarios/guardar_destinatario.php', datos)
      .catch(error => {
        console.error('An error occurred:', error.error);
        this.ShowSwal('error', 'Error', 'Ha ocurrido algo inesperado al guardar el destinatario!');
        return this.handleError(error);
      })
      .subscribe((data: any) => {
        this.LimpiarModelos();
        modal.hide();
        this.ShowSwal('success', 'Exito', 'Destinatario guardado exitosamente!');
      });
  }

  handleError(error: Response) {
    return Observable.throw(error);
  }

<<<<<<< HEAD
  LimpiarModelos(){
=======
  LimpiarModelos() {
>>>>>>> de4f37a2ab29e5d58678930a3c1a3dffabe1b05b
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
    }];
<<<<<<< HEAD
    
=======

>>>>>>> de4f37a2ab29e5d58678930a3c1a3dffabe1b05b
    this.TiposDocumentoFiltrados = [];
    this.SePuedeAgregarMasCuentas = false;
  }

  //#region VALIDACIONES

  validarBanco(i, valor) {
    setTimeout(() => {
<<<<<<< HEAD
      
      let ctaObject = this.Lista_Cuentas_Destinatario[i];
      let countryObject = this.Paises.find(x => x.Id_Pais == ctaObject.Id_Pais);
      
      if (!this.globales.IsObjEmpty(ctaObject) && !this.globales.IsObjEmpty(countryObject)) {        

        if (countryObject.Nombre == 'Venezuela') {
          
          if (countryObject.Cantidad_Digitos_Cuenta != 0) {
            
=======

      let ctaObject = this.Lista_Cuentas_Destinatario[i];
      let countryObject = this.Paises.find(x => x.Id_Pais == ctaObject.Id_Pais);

      if (!this.globales.IsObjEmpty(ctaObject) && !this.globales.IsObjEmpty(countryObject)) {

        if (countryObject.Nombre == 'Venezuela') {

          if (countryObject.Cantidad_Digitos_Cuenta != 0) {

>>>>>>> de4f37a2ab29e5d58678930a3c1a3dffabe1b05b
            let longitud = this.LongitudCarateres(valor);
            if (longitud != parseInt(countryObject.Cantidad_Digitos_Cuenta)) {
              this.ShowSwal("warning", "Alerta", "Digite la cantidad correcta de dígitos de la cuenta");
              this.SePuedeAgregarMasCuentas = false;
              return;
<<<<<<< HEAD
            }              
          }

          this.cliente.get(this.globales.ruta+'php/bancos/validar_cuenta_bancaria.php', {params: {cta_bancaria:valor} } ).subscribe((data:any)=>{
            if(data == 1){
              this.ShowSwal("warning", "Alerta", "La cuenta que intenta registrar ya se encuentra registrada en la base de datos!");
              this.SePuedeAgregarMasCuentas = false;
              this.Lista_Cuentas_Destinatario[i].Numero_Cuenta = '';
            }else{
              this.SePuedeAgregarMasCuentas = true;
            }
          });
        }else{

          this.cliente.get(this.globales.ruta+'php/bancos/validar_cuenta_bancaria.php', {params: {cta_bancaria:valor} } ).subscribe((data:any)=>{
            if(data == 1){
              this.ShowSwal("warning", "Alerta", "La cuenta que intenta registrar ya se encuentra registrada en la base de datos!");
              this.SePuedeAgregarMasCuentas = false;
              this.Lista_Cuentas_Destinatario[i].Numero_Cuenta = '';
            }else{
=======
            }
          }

          this.cliente.get(this.globales.ruta + 'php/bancos/validar_cuenta_bancaria.php', { params: { cta_bancaria: valor } }).subscribe((data: any) => {
            if (data == 1) {
              this.ShowSwal("warning", "Alerta", "La cuenta que intenta registrar ya se encuentra registrada en la base de datos!");
              this.SePuedeAgregarMasCuentas = false;
              this.Lista_Cuentas_Destinatario[i].Numero_Cuenta = '';
            } else {
              this.SePuedeAgregarMasCuentas = true;
            }
          });
        } else {

          this.cliente.get(this.globales.ruta + 'php/bancos/validar_cuenta_bancaria.php', { params: { cta_bancaria: valor } }).subscribe((data: any) => {
            if (data == 1) {
              this.ShowSwal("warning", "Alerta", "La cuenta que intenta registrar ya se encuentra registrada en la base de datos!");
              this.SePuedeAgregarMasCuentas = false;
              this.Lista_Cuentas_Destinatario[i].Numero_Cuenta = '';
            } else {
>>>>>>> de4f37a2ab29e5d58678930a3c1a3dffabe1b05b
              this.SePuedeAgregarMasCuentas = true;
            }
          });
        }
      }
    }, 700);
  }

<<<<<<< HEAD
  RevalidarValores(nroCuenta, index){
    if(nroCuenta == ''){
      if(!this.globales.IsObjEmpty(this.Lista_Cuentas_Destinatario[index])){
=======
  RevalidarValores(nroCuenta, index) {
    if (nroCuenta == '') {
      if (!this.globales.IsObjEmpty(this.Lista_Cuentas_Destinatario[index])) {
>>>>>>> de4f37a2ab29e5d58678930a3c1a3dffabe1b05b
        this.Lista_Cuentas_Destinatario[index].Id_Banco = '';
        this.Lista_Cuentas_Destinatario[index].Id_Tipo_Cuenta = '';
      }
    }
  }

  //#endregion

}
