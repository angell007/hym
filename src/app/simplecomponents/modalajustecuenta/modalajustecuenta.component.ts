import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { AjusteCuentaModel } from '../../Modelos/AjusteCuentaModel';
import { GeneralService } from '../../shared/services/general/general.service';
import { SwalService } from '../../shared/services/swal/swal.service';
import { ToastService } from '../../shared/services/toasty/toast.service';
import { CuentabancariaService } from '../../shared/services/cuentasbancarias/cuentabancaria.service';

@Component({
  selector: 'app-modalajustecuenta',
  templateUrl: './modalajustecuenta.component.html',
  styleUrls: ['./modalajustecuenta.component.scss', '../../../style.scss']
})
export class ModalajustecuentaComponent implements OnInit {

  @Input() AbrirModal:Observable<any> = new Observable();
  @Output() ActualizarTabla:EventEmitter<any> = new EventEmitter();
  
  @ViewChild('ModalAjusteCuenta') ModalAjusteCuenta:any;

  public openSubscription:any;
  public AjusteCuentaModel:AjusteCuentaModel = new AjusteCuentaModel();
  public CodigoMoneda:string = '';
  public TiposAjuste:Array<any> = [];
  public Id_Apertura_Cuadre:string = '';

  constructor(private _generalService: GeneralService,
              private _swalService:SwalService,
              private _toastService:ToastService,
              private _cuentaBancariaService:CuentabancariaService) 
  {
    this._getTiposAjuste();
  }

  ngOnInit() {
    this.openSubscription = this.AbrirModal.subscribe((data:any) => {
      console.log(data);
      
      this.AjusteCuentaModel.Id_Cuenta_Bancaria = data.id_cuenta;
      this.CodigoMoneda=data.codigo_moneda;
      this.Id_Apertura_Cuadre = data.id_apertura == '' ? localStorage.getItem('Apertura_Consultor') : data.id_apertura;
      console.log(this.Id_Apertura_Cuadre);
      this.ModalAjusteCuenta.show();
    });
  }
  
  ngOnDestroy(){    
    if (this.openSubscription != undefined) {
      this.openSubscription.unsubscribe();
    }
  }

  private _getTiposAjuste(){
    this._generalService.GetTiposAjuste().subscribe((response:any) => {
      console.log(response);
      if (response.codigo == 'success') { 
        this.TiposAjuste = response.query_data;
      }else{
        this.TiposAjuste = [];

        this._swalService.ShowMessage(['info', response.titulo, response.mensaje]);

        // let toastObj = {textos:[response.titulo, response.mensaje], tipo:response.codigo, duracion:4000};
        // this._toastService.ShowToast(toastObj);
      }
      
    });
  }

  GuardarAjusteCuenta(){

    if (!this.ValidateBeforeSubmit()) {
      return;
    }else{
      this.AjusteCuentaModel.Id_Apertura = this.Id_Apertura_Cuadre == '' ? localStorage.getItem('Apertura_Consultor') : this.Id_Apertura_Cuadre;
      console.log(this.AjusteCuentaModel);
      
      let info = this._generalService.normalize(JSON.stringify(this.AjusteCuentaModel));
      let datos = new FormData();
      datos.append("modelo",info);
      
      this._cuentaBancariaService.GuardarAjusteCuenta(datos)
      .catch(error => { 
        //console.log('An error occurred:', error);
        this._swalService.ShowMessage(['error', 'Error', 'Ha ocurrido un error']);
        return this.handleError(error);
      })
      .subscribe((data:any)=>{
        if (data.codigo == 'success') { 
          this.ActualizarTabla.emit();       
          this.CerrarModal();
          this._swalService.ShowMessage(['success', 'Exito', 'Operacion realizada correctamente']);
          // let toastObj = {textos:[data.titulo, data.mensaje], tipo:data.codigo, duracion:4000};
          // this._toastService.ShowToast(toastObj);
        }else{
          this._swalService.ShowMessage(data);
        }
      }); 
    } 
  }

  ValidateBeforeSubmit():boolean{
    
    if (this.AjusteCuentaModel.Tipo == '') {
      this._swalService.ShowMessage(['warning','Alerta','Debe escojer el concepto del ajuste!']);
      return false;
    }else if (this.AjusteCuentaModel.Id_Tipo_Ajuste_Cuenta == '') {
      this._swalService.ShowMessage(['warning','Alerta','Debe escojer el tipo de ajuste!']);
      return false;
    }else if (this.AjusteCuentaModel.Valor == null || this.AjusteCuentaModel.Valor == 0) {
      this._swalService.ShowMessage(['warning','Alerta','Debe colocar el valor del ajuste!']);
      return false;
    }else if (this.AjusteCuentaModel.Detalle == '') {
      this._swalService.ShowMessage(['warning','Alerta','Debe colocar la descripcion del ajuste!']);
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
    this.ModalAjusteCuenta.hide();
  }

  LimpiarModelo(){
    this.AjusteCuentaModel = new AjusteCuentaModel();
  }

  InputSoloNumerosYDecimal(e:KeyboardEvent){    
    return this._generalService.KeyboardOnlyNumbersAndDecimal(e);
  }

}
