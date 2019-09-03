import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import {NgForm} from '@angular/forms';
import  {Globales } from '../shared/globales/globales';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-creardestinatario-modal',
  templateUrl: './creardestinatario.component.html',
  styleUrls: ['./creardestinatario.component.scss']
})
export class CreardestinatarioComponent implements OnInit {

  @ViewChild('alertSwal') alertSwal:any;
  @ViewChild('ModalDestinatario') ModalDestinatario:any;

  @Input() id_destinatario:number = 0;

  @Output() ReturnDestinatario = new EventEmitter();
  @Output() ControlVisibility:EventEmitter<boolean> = new EventEmitter();

  ShowHideModal(): void {
    this.ControlVisibility.emit(false);
  }

  //MODELO DESTINATARIO
  public DestinatarioModel:any = {
    Id_Destinario:'',
    Nombre:'',
    Estado: 'Activo',
    Tipo_Documento: '',
    Id_Pais: '' 
  };

  public Lista_Cuentas_Destinatario = [{
    Id_Pais: '',
    Id_Banco: '',
    Bancos: [],
    Id_Tipo_Cuenta: '',
    Numero_Cuenta: ''
  }];

  public Paises:any = [];
  public TiposDocumentoExtranjero:any = [];
  public TiposDocumentoNacionales:any = [];
  public TiposDocumentoFiltrados:any = [];
  public TiposCuenta:any = [];
  public SePuedeAgregarMasCuentas = false;

  constructor(public globales:Globales, private cliente:HttpClient) { }

  ngOnInit() {
    this.AsignarPaises();
    this.AsignarDocumentosExtranjeros();
    this.AsignarDocumentosNacionales();
    this.AsignarTiposCuenta();

    console.log(this.id_destinatario);
    
  }

  AsignarPaises(){
    this.Paises = [];
    this.Paises = this.globales.Paises;
  }

  AsignarDocumentosExtranjeros(){
    this.TiposDocumentoExtranjero = [];
    this.TiposDocumentoExtranjero = this.globales.TipoDocumentoExtranjero;
  }

  AsignarDocumentosNacionales(){
    this.TiposDocumentoNacionales = [];
    this.TiposDocumentoNacionales = this.globales.TipoDocumentoNacionales;
  }

  AsignarTiposCuenta(){
    this.TiposCuenta = [];
    this.TiposCuenta = this.globales.TiposCuenta;
  }

  ValidarCedula(identificacion){
    this.cliente.get(this.globales.ruta+'/php/destinatarios/validar_identificacion.php', {params:{id:identificacion}}).subscribe((data:any)=>{
      if(data == 1){
        this.ShowSwal('warning', 'Alerta', 'El número de identificación que intenta registrar ya se encuentra registrada en la base de datos!');
        this.DestinatarioModel.Id_Destinatario = ''; 
      }
    });
  }

  FiltrarDatosNacionalidad(idPais){

    this.DestinatarioModel.Id_Destinatario = '';
    this.TiposDocumentoFiltrados = [];
    this.DestinatarioModel.Nombre = '';
    
    if (this.TiposDocumentoExtranjero.length > 0) {
      this.TiposDocumentoExtranjero.forEach(documentObj  => {
        if (documentObj.Id_Pais == idPais) {
          this.TiposDocumentoFiltrados.push(documentObj);  
        }        
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

  AgregarOtraCuenta(){
    let longitudCuentas = this.Lista_Cuentas_Destinatario.length;    

    if (this.SePuedeAgregarMasCuentas && this.Lista_Cuentas_Destinatario[(longitudCuentas - 1)].Id_Tipo_Cuenta != '') {
      
      let nuevaCuenta = {
        Id_Pais: '',
        Id_Banco: '',
        Bancos: [],
        Id_Tipo_Cuenta: '',
        Numero_Cuenta: ''
      };
      this.Lista_Cuentas_Destinatario.push(nuevaCuenta);
      this.SePuedeAgregarMasCuentas = false;
    }else{
      this.ShowSwal('warning','Faltan Datos','Faltan datos en la(s) cuenta(s) actuales, revise por favor!');
    }
  }

  Bancos_Pais(Pais, i) {
    this.cliente.get(this.globales.ruta + 'php/genericos/bancos_pais.php', { params: { id: Pais } }).subscribe((data: any) => {
      
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

  ShowSwal(tipo:string, titulo:string, msg:string, confirmCallback = null, cancelCallback = null){
    this.alertSwal.type = tipo;
    this.alertSwal.title = titulo;
    this.alertSwal.text = msg;
    this.alertSwal.show();
  }

  LongitudCarateres(i) {
    return parseInt(i.length);
  }

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
    }];
    
    this.TiposDocumentoFiltrados = [];
    this.SePuedeAgregarMasCuentas = false;
  }

  //#region VALIDACIONES

  validarBanco(i, valor) {
    setTimeout(() => {
      
      let ctaObject = this.Lista_Cuentas_Destinatario[i];
      let countryObject = this.Paises.find(x => x.Id_Pais == ctaObject.Id_Pais);
      
      if (!this.globales.IsObjEmpty(ctaObject) && !this.globales.IsObjEmpty(countryObject)) {        

        if (countryObject.Nombre == 'Venezuela') {
          
          if (countryObject.Cantidad_Digitos_Cuenta != 0) {
            
            let longitud = this.LongitudCarateres(valor);
            if (longitud != parseInt(countryObject.Cantidad_Digitos_Cuenta)) {
              this.ShowSwal("warning", "Alerta", "Digite la cantidad correcta de dígitos de la cuenta");
              this.SePuedeAgregarMasCuentas = false;
              return;
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
              this.SePuedeAgregarMasCuentas = true;
            }
          });
        }
      }
    }, 700);
  }

  RevalidarValores(nroCuenta, index){
    if(nroCuenta == ''){
      if(!this.globales.IsObjEmpty(this.Lista_Cuentas_Destinatario[index])){
        this.Lista_Cuentas_Destinatario[index].Id_Banco = '';
        this.Lista_Cuentas_Destinatario[index].Id_Tipo_Cuenta = '';
      }
    }
  }

  //#endregion

}
