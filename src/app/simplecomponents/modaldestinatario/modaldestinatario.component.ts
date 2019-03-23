import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { DestinatarioModel } from '../../Modelos/DestinatarioModel';
import { GeneralService } from '../../shared/services/general/general.service';
import { SwalService } from '../../shared/services/swal/swal.service';
import { ValidacionService } from '../../shared/services/validaciones/validacion.service';
import { DestinatarioService } from '../../shared/services/destinatarios/destinatario.service';
import { TipodocumentoService } from '../../shared/services/tiposdocumento/tipodocumento.service';
import { BancoService } from '../../shared/services/bancos/banco.service';
import { Position } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-modaldestinatario',
  templateUrl: './modaldestinatario.component.html',
  styleUrls: ['./modaldestinatario.component.scss', '../../../style.scss']
})
export class ModaldestinatarioComponent implements OnInit {

  @Input() AbrirModal:Observable<any> = new Observable();
  @Output() ActualizarTabla:EventEmitter<any> = new EventEmitter();
  @Output() ActualizarCuentasDestinatario:EventEmitter<any> = new EventEmitter();
  @Output() IncluirDestinatarioEnTransferencia:EventEmitter<any> = new EventEmitter();
  
  @ViewChild('ModalDestinatario') ModalDestinatario:any;

  public 
  public BancosPais:Array<any> = [];
  public Paises:any = [];
  public Monedas:any = [];
  public TiposDocumento:any = [];
  public TiposCuenta:any = [];
  public BancosCuentas:Array<any> = [
    {
      cuenta_index:"0",
      Bancos:[]
    }
  ];
  public Lista_Cuentas_Destinatario:any = [{
    Id_Pais: '',
    Id_Banco: '',
    Id_Tipo_Cuenta: '',
    Numero_Cuenta: '',
    Bancos:[],
    EsVenezolana: false
  }];

  public openSubscription:any;
  public Editar:boolean = false;
  public SePuedeAgregarMasCuentas:boolean = false;
  public TipoEdicion:string = 'Normal';

  public DestinatarioModel:DestinatarioModel = new DestinatarioModel();

  constructor(private generalService: GeneralService,
              private swalService:SwalService,
              private validacionService:ValidacionService,
              private destinatarioService:DestinatarioService,
              private tipoDocumentoService:TipodocumentoService,
              private bancoService:BancoService) 
  { 
    this.GetPaises();
    this.GetTiposCuenta();
  }

  ngOnInit() {
    this.openSubscription = this.AbrirModal.subscribe((data:any) => {
      console.log(data);
      
      if (data.id_destinatario != "0" && data.accion == 'editar') {
        this.Editar = true;
        this.TipoEdicion = data.accion;
        let p = {id_destinatario:data.id_destinatario};

        this.destinatarioService.getDestinatario(p).subscribe((d:any) => {
          if (d.codigo == 'success') {
            this.DestinatarioModel = d.query_data.destinatario;
            this.Lista_Cuentas_Destinatario = d.query_data.cuentas;
            this.GetBancosCuentas();
            this.ModalDestinatario.show();  
          }else{
            
            this.swalService.ShowMessage(d);
          }          
        });
      }else if (data.id_destinatario != "0" && data.accion == 'editar cuentas') {
        this.Editar = true;
        this.TipoEdicion = data.accion;
        let p = {id_destinatario:data.id_destinatario};
        
        this.destinatarioService.getDestinatario(p).subscribe((d:any) => {
          if (d.codigo == 'success') {
            this.DestinatarioModel = d.query_data.destinatario;
            this.Lista_Cuentas_Destinatario = d.query_data.cuentas;
            this.GetBancosCuentas();
            this.ModalDestinatario.show();  
          }else{
            
            this.swalService.ShowMessage(d);
          }          
        });
      }else if (data.id_destinatario != "0" && data.accion == 'crear'){
        this.DestinatarioModel.Id_Destinatario = data.id_destinatario;
        this.Editar = false;
        this.ModalDestinatario.show();
      }else if (data.id_destinatario == "0" && data.accion == 'crear'){
        this.Editar = false;
        this.ModalDestinatario.show();
      }
    });
  }
  
  ngOnDestroy(){    
    if (this.openSubscription != undefined) {
      this.openSubscription.unsubscribe();
    }

    this.CerrarModal();
  }

  GetPaises(){
    setTimeout(() => {
      this.Paises = this.generalService.getPaises();  
    }, 1000);
  }

  GetTiposCuenta(){
    setTimeout(() => {
      this.TiposCuenta = this.generalService.getTiposCuenta();  
    }, 1000);
  }

  GetBancosCuentas(){
    if (this.Lista_Cuentas_Destinatario.length > 0) {
      this.Lista_Cuentas_Destinatario.forEach((cta,i) => {
        this.GetBancosPais(i);      
        this.CheckCuentasVenezolanas(i);
      });
    }
    
  }

  GuardarDestinatario(){
    this.DestinatarioModel.Cuentas = this.Lista_Cuentas_Destinatario;
    console.log(this.DestinatarioModel);
    
  }

  CerrarModal(){
    this.LimpiarModelo();
    this.ModalDestinatario.hide();
  }

  LimpiarModelo(){
    this.DestinatarioModel = new DestinatarioModel();
  }

  FiltrarDatosNacionalidad(){
    console.log(this.DestinatarioModel.Id_Pais);
    
    if (this.DestinatarioModel.Id_Pais == '') {
      this.TiposDocumento = [];
    }else{

      let p = {id_pais:this.DestinatarioModel.Id_Pais};
      this.tipoDocumentoService.getTiposDocumentoPais(p).subscribe((data:any) => {
        if (data.codigo == 'success') {
          this.TiposDocumento = data.query_data;
          this.DestinatarioModel.Tipo_Documento = '';

        }else{

          this.TiposDocumento = [];
          this.DestinatarioModel.Tipo_Documento = '';
          this.swalService.ShowMessage(data);
        }
      });
    }
  }

  ValidarCedula(){
    if (this.DestinatarioModel.Id_Destinatario != '') {
      // let parameters = {id:this.DestinatarioModel.Id_Destinatario};
      // this.validacionService.ValidateIdentificacion(parameters).subscribe((data:any)=>{
      //   if(data == 1){
      //     this.swalService.ShowMessage(['warning', 'Alerta', 'El número de identificación que intenta registrar ya se encuentra en la base de datos!']);
      //     this.DestinatarioModel.Id_Destinatario = ''; 
      //   }
      // });

      let id = this.DestinatarioModel.Id_Destinatario;
      this.generalService.checkIdentificacion(id).subscribe((data:any) => {
        if (data.codigo != 'success') {
          this.DestinatarioModel.Id_Destinatario = '';
          this.swalService.ShowMessage(data);
        }
      });
    }    
  }

  BuscarCNE() {

    var cedula = this.DestinatarioModel.Id_Destinatario;
    if (cedula == undefined || cedula == '') {
      this.swalService.ShowMessage(['warning','Alerta','Debe colocar un número de identificación para proseguir!']);
      this.DestinatarioModel.Tipo_Documento = '';
      return;
    }

    var tipo_doc = this.DestinatarioModel.Tipo_Documento;
    if (tipo_doc == '') {
      return;
    }

    let countryObject = this.Paises.find(x => x.Id_Pais == this.DestinatarioModel.Id_Pais);

    if (!this.generalService.IsObjEmpty(countryObject)) {
      if (countryObject.Nombre == 'Venezuela') {
        
        switch (tipo_doc) {
          case "V": {
            let urlCne = "http://www4.cne.gob.ve/web/registro_electoral/ce.php?nacionalidad=V&cedula=" + cedula;
            window.open(urlCne, '_blank');
            break;
          }
          case "E": {
            let urlCne = "http://www4.cne.gob.ve/web/registro_electoral/ce.php?nacionalidad=E&cedula=" + cedula;
            window.open(urlCne, '_blank');
            break;
          }
          default: {
          }
        }
      }
    }
  }

  AgregarOtraCuenta(){
    let longitudCuentas = this.Lista_Cuentas_Destinatario.length;
    console.log(this.Lista_Cuentas_Destinatario);
    console.log(this.SePuedeAgregarMasCuentas);

    if (this.SePuedeAgregarMasCuentas && this.Lista_Cuentas_Destinatario[(longitudCuentas - 1)].Id_Tipo_Cuenta != '') {
      
      let nuevaCuenta = {
        Id_Pais: '',
        Id_Banco: '',
        Id_Tipo_Cuenta: '',
        Numero_Cuenta: '',
        Bancos:[],
        EsVenezolana: false
      };      
      this.Lista_Cuentas_Destinatario.push(nuevaCuenta);

      //let newLength = this.Lista_Cuentas_Destinatario.length;
      //let bancosCuentaObj = {cuenta_index:(newLength - 1).toString(), Bancos:[]};
      //this.BancosCuentas.push(bancosCuentaObj);
      
      this.SePuedeAgregarMasCuentas = false;
    }else{

      this.swalService.ShowMessage(['warning', 'Faltan Datos', 'Faltan datos en la(s) cuenta(s) actuales, revise por favor!']);
    }
  }

  GetBancosPais(cuentaIndex:string){ 
    console.log(cuentaIndex);
    console.log(this.BancosCuentas);
    let index_bancos_cuenta = this.BancosCuentas.findIndex(x => x.cuenta_index == cuentaIndex);
    let id_pais = this.Lista_Cuentas_Destinatario[cuentaIndex].Id_Pais;

    if (id_pais == '') {
      this.Lista_Cuentas_Destinatario[cuentaIndex].Bancos = [];
      this.Lista_Cuentas_Destinatario[cuentaIndex].Id_Banco = '';
    }else{

      let p = {id_pais:id_pais};
      this.bancoService.getListaBancosByPais(p).subscribe((data:any) => {
        if (data.codigo == 'success') {
          this.Lista_Cuentas_Destinatario[cuentaIndex].Bancos = data.query_data;
          
          this.CheckCuentasVenezolanas();
        }else{
          this.Lista_Cuentas_Destinatario[cuentaIndex].Bancos = [];
          this.swalService.ShowMessage(data);
        }
      });
    }
  }

  codigoBanco(posicion, texto) {

    let country = this.Lista_Cuentas_Destinatario[posicion].Id_Pais;
    let nroCuenta = this.Lista_Cuentas_Destinatario[posicion].Numero_Cuenta;
    
    if (country == "2") {
      switch (texto) {
        case "check": {
          var buscarBanco = this.BancosCuentas[posicion].Bancos.findIndex(x => x.Id_Banco === nroCuenta);
          this.Lista_Cuentas_Destinatario[posicion].Numero_Cuenta = this.BancosCuentas[posicion].Bancos[buscarBanco].Identificador;
          break;
        }
        case "input": {

          var match = nroCuenta.substring(0, 4);          
          var buscarBanco = this.Lista_Cuentas_Destinatario[posicion].Bancos.findIndex(x => x.Identificador === match);
          
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

  //VALIDAR LA LONGITUD DEL NUMERO DE CUENTA INGRESADO
  validarBanco(i:string, nroCuenta:string) {

    if (nroCuenta != '') {
      setTimeout(() => {
      
        //var idpais = ((document.getElementById("Id_Pais" + i) as HTMLInputElement).value);
        let ctaObject = this.Lista_Cuentas_Destinatario[i];
        let countryObject = this.Paises.find(x => x.Id_Pais == ctaObject.Id_Pais);
        
        if (!this.generalService.IsObjEmpty(ctaObject) && !this.generalService.IsObjEmpty(countryObject)) {        
  
          if (countryObject.Nombre == 'Venezuela') {
            
            if (countryObject.Cantidad_Digitos_Cuenta != 0) {
              
              let longitud = nroCuenta.length;
              if (longitud != parseInt(countryObject.Cantidad_Digitos_Cuenta)) {
                this.swalService.ShowMessage(['warning', 'Alerta', 'Digite la cantidad correcta de dígitos de la cuenta('+countryObject.Cantidad_Digitos_Cuenta+')']);
                this.SePuedeAgregarMasCuentas = false;
                return;
              }              
            }
  
            let p = {cta_bancaria:nroCuenta};
            this.validacionService.ValidateCuentaBancaria(p).subscribe((data)=>{
              if(data == 1){
                this.swalService.ShowMessage(['warning', 'Alerta', 'La cuenta que intenta registrar ya se encuentra en la base de datos!']);
                this.SePuedeAgregarMasCuentas = false;
                this.Lista_Cuentas_Destinatario[i].Numero_Cuenta = '';
              }else{
                this.SePuedeAgregarMasCuentas = true;
              }
            });
          }else{
  
            let p = {cta_bancaria:nroCuenta};
            this.validacionService.ValidateCuentaBancaria(p).subscribe((data)=>{
              if(data == 1){
                this.swalService.ShowMessage(['warning', 'Alerta', 'La cuenta que intenta registrar ya se encuentra en la base de datos!']);
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
  }

  // RevalidarValores(nroCuenta, index){
  //   if(nroCuenta == ''){
  //     if(!this.globales.IsObjEmpty(this.Lista_Cuentas_Destinatario[index])){
  //       this.Lista_Cuentas_Destinatario[index].Id_Banco = '';
  //       this.Lista_Cuentas_Destinatario[index].Id_Tipo_Cuenta = '';
  //     }
  //   }
  // }

  CheckCuentasVenezolanas(ctaIndex:string = ''){
    let veObj = this.Paises.find(x => x.Nombre == 'Venezuela');
    if (!this.generalService.IsObjEmpty(veObj)) {
      if (ctaIndex != '') {
        if (this.Lista_Cuentas_Destinatario[ctaIndex].Id_Pais == veObj.Id_Pais) {
          this.Lista_Cuentas_Destinatario[ctaIndex].EsVenezolana = true;
        }else{
          this.Lista_Cuentas_Destinatario[ctaIndex].EsVenezolana = false;
        }
      }else{

        this.Lista_Cuentas_Destinatario.forEach((cta,i) => {
          if (cta.Id_Pais == veObj.Id_Pais) {
            this.Lista_Cuentas_Destinatario[i].EsVenezolana = true;
          }else{
            this.Lista_Cuentas_Destinatario[i].EsVenezolana = false;
          }
        });
      }            
    }else{
      this.Lista_Cuentas_Destinatario.forEach((cta,i) => {
        this.Lista_Cuentas_Destinatario[i].EsVenezolana = false;
      });
      //this.swalService.ShowMessage(['warning', 'Alerta', 'Hay una incosistencia en la busqueda del pais, contacte con el administrador del sistema!']);
    }
  }

  SetIdentificadorCuenta(idBanco, i){
    //comprobar de que pais es el banco
    //buscar el identificador del banco si posee

    let cuentaDestinatario = this.Lista_Cuentas_Destinatario[i].Numero_Cuenta;    

    if (cuentaDestinatario == '') {
      let p = {id_banco:idBanco};
      this.bancoService.getIdentificadorBanco(p).subscribe((data:string)=>{
        this.Lista_Cuentas_Destinatario[i].Numero_Cuenta = data;
      });     
    }    
  }

  EliminarCuentaDestinatario(posicion:string){

    if (this.Lista_Cuentas_Destinatario.length == 1) {
      this.swalService.ShowMessage(['warning', 'Alerta', 'Debe existir al menos una cuenta asociada al destinatario']);
      this.SePuedeAgregarMasCuentas = false;
      return;
    }
    
    this.BancosCuentas[posicion].splice(posicion, 1);
    this.Lista_Cuentas_Destinatario.splice(posicion, 1);

    this.SePuedeAgregarMasCuentas = true;
  }
}
