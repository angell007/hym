import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { CompraCuentaModel } from '../../Modelos/CompraCuentaModel';
import { GeneralService } from '../../shared/services/general/general.service';
import { SwalService } from '../../shared/services/swal/swal.service';
import { ToastService } from '../../shared/services/toasty/toast.service';
import { CuentabancariaService } from '../../shared/services/cuentasbancarias/cuentabancaria.service';

@Component({
  selector: 'app-modalabonocompracuenta',
  templateUrl: './modalabonocompracuenta.component.html',
  styleUrls: ['./modalabonocompracuenta.component.scss', '../../../style.scss']
})
export class ModalabonocompracuentaComponent implements OnInit {

  @Input() AbrirModal:Observable<any> = new Observable();
  @Output() ActualizarDatos:EventEmitter<any> = new EventEmitter();
  
  @ViewChild('ModalAbonoCompraCuenta') ModalAbonoCompraCuenta:any;

  public openSubscription:any;

  public CompraCuentaModel:CompraCuentaModel = new CompraCuentaModel();

  constructor(private _generalService: GeneralService,
              private _swalService:SwalService,
              private _toastService:ToastService,
              private _cuentaBancariaService:CuentabancariaService) 
  {
  }

  ngOnInit() {
    this.openSubscription = this.AbrirModal.subscribe((data:any) => {
      // console.log(data);
      
      this.CompraCuentaModel.Id_Cuenta_Bancaria = data.id_cuenta;
      this.CompraCuentaModel.Id_Funcionario = data.id_funcionario;
      this.CompraCuentaModel.Id_Consultor_Apertura = data.id_apertura;      
      this.ModalAbonoCompraCuenta.show();
    });
  }
  
  ngOnDestroy(){    
    if (this.openSubscription != undefined) {
      this.openSubscription.unsubscribe();
    }
  }

  GuardarCompraCuenta(){

    if (!this.ValidateBeforeSubmit()) {
      return;
    }else{

    }
    
    // console.log(this.CompraCuentaModel);
    
    let info = this._generalService.normalize(JSON.stringify(this.CompraCuentaModel));
    let datos = new FormData();
    datos.append("modelo",info);

    this._cuentaBancariaService.GuardaCompraCuenta(datos)
    .catch(error => { 
      //console.log('An error occurred:', error);
      this._swalService.ShowMessage(['error', 'Error', 'Ha ocurrido un error']);
      return this.handleError(error);
    })
    .subscribe((data:any)=>{
      if (data.codigo == 'success') { 
        this.ActualizarDatos.emit();       
        this.CerrarModal();

        this._swalService.ShowMessage(['success', data.titulo,  data.mensaje]);

        // let toastObj = {textos:[data.titulo, data.mensaje], tipo:data.codigo, duracion:4000};
        // this._toastService.ShowToast(toastObj);
      }else{
        this._swalService.ShowMessage(data);
      }
    });   
  }

  ValidateBeforeSubmit():boolean{
    if (this.CompraCuentaModel.Detalle == '') {
      this._swalService.ShowMessage(['warning', 'Alerta', 'Debe colocar un detalle para la compra!']);
      return false;
    }else if (this.CompraCuentaModel.Estado == '') {
      this._swalService.ShowMessage(['warning', 'Alerta', 'Debe seleccionar un estado para la compra!']);
      return false;
    }else if (this.CompraCuentaModel.Numero_Transaccion == '') {
      this._swalService.ShowMessage(['warning', 'Alerta', 'Debe colocar el numero de transaccion de la compra!']);
      return false;
    }else if (this.CompraCuentaModel.Valor == 0) {
      this._swalService.ShowMessage(['warning', 'Alerta', 'Debe colocar un valor para la compra!']);
      return false;
    }else{
      return true;
    }
  }

  handleError(error: Response) {
    return Observable.throw(error);
  }

  CerrarModal(){
    this.LimpiarModelo();
    this.ModalAbonoCompraCuenta.hide();
  }

  LimpiarModelo(){
    this.CompraCuentaModel = new CompraCuentaModel();
  }

  InputSoloNumerosYDecimal(e:KeyboardEvent){    
    return this._generalService.KeyboardOnlyNumbersAndDecimal(e);
  }

}
