import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralService } from '../../shared/services/general/general.service';
import { SwalService } from '../../shared/services/swal/swal.service';
import { ValidacionService } from '../../shared/services/validaciones/validacion.service';
import { MonedaService } from '../../shared/services/monedas/moneda.service';
import { ToastService } from '../../shared/services/toasty/toast.service';
import { MovimientoTerceroModel } from '../../Modelos/MovimientoTerceroModel';
import { MovimientoterceroService } from '../../shared/services/movimientostercero/movimientotercero.service';

@Component({
  selector: 'app-modalajustetercero',
  templateUrl: './modalajustetercero.component.html',
  styleUrls: ['./modalajustetercero.component.scss', '../../../style.scss']
})
export class ModalajusteterceroComponent implements OnInit {

  @Input() AbrirModal:Observable<any> = new Observable();
  @Input() MonedaPrecargada:boolean = false;
  @Output() ActualizarTabla:EventEmitter<any> = new EventEmitter();
  
  @ViewChild('ModalAjusteTercero') ModalAjusteTercero:any;

  public BancosPais:Array<any> = [];
  public Monedas:any = [];

  public openSubscription:any;
  public Editar:boolean = false;
  public MensajeGuardar:string = 'Se dispone a guardar este movimiento';

  public MovimientoTerceroModel:MovimientoTerceroModel = new MovimientoTerceroModel();

  constructor(private _generalService: GeneralService,
              private _swalService:SwalService,
              private _validacionService:ValidacionService,
              private _monedaService:MonedaService,
              private _toastService:ToastService,
              private _movimientoTerceroService:MovimientoterceroService) 
  {
    this.GetMonedas();
  }

  ngOnInit() {
    this.openSubscription = this.AbrirModal.subscribe((data:any) => {
      
      this.MovimientoTerceroModel.Id_Moneda_Valor = data.id_moneda;
      this.MovimientoTerceroModel.Id_Tercero = data.id_tercero;      
      
      if (data.id_movimiento != "0") {
        this.Editar = true;
        this.MensajeGuardar = 'Se dispone a actualizar este movimiento';
        
        this._movimientoTerceroService.getMovimientoTercero(data.id_movimiento).subscribe((d:any) => {
          if (d.codigo == 'success') {
            this.MovimientoTerceroModel = d.query_data;
            this.ModalAjusteTercero.show();  
          }else{
            
            this._swalService.ShowMessage(d);
          }
          
        });
      }else{
        this.MensajeGuardar = 'Se dispone a guardar este movimiento';
        this.Editar = false;
        this.ModalAjusteTercero.show();
      }
    });
  }
  
  ngOnDestroy(){    
    if (this.openSubscription != undefined) {
      this.openSubscription.unsubscribe();
    }

    this.CerrarModal();
  }

  GetMonedas(){
    this._monedaService.getMonedas().subscribe((d:any) => {
      if (d.codigo == 'success') {
        this.Monedas = d.query_data; 
      }else{
        this.Monedas = [];
        this._swalService.ShowMessage(d);
      }
      
    });
  }

  GuardarAjusteTercero(){

    if (!this.ValidateBeforeSubmit()) {
      return;
    }
    
    this.MovimientoTerceroModel.Id_Tipo_Movimiento = '3';
    this.MovimientoTerceroModel.Valor_Tipo_Movimiento = '0';
    this.MovimientoTerceroModel.Fecha = this._generalService.FechaActual;
    this.MovimientoTerceroModel = this._generalService.limpiarString(this.MovimientoTerceroModel);
    console.log(this.MovimientoTerceroModel);
    
    let info = this._generalService.normalize(JSON.stringify(this.MovimientoTerceroModel));
    let datos = new FormData();
    datos.append("modelo",info);

    if (this.Editar) {
      this._movimientoTerceroService.editMovimientoTercero(datos)
      .catch(error => { 
        //console.log('An error occurred:', error);
        this._swalService.ShowMessage(['error', 'Error', 'Ha ocurrido un error']);
        return this.handleError(error);
      })
      .subscribe((data:any)=>{
        if (data.codigo == 'success') { 
          this.ActualizarTabla.emit();       
          this.CerrarModal();
          this.Editar = false;
          let toastObj = {textos:[data.titulo, data.mensaje], tipo:data.codigo, duracion:4000};
          this._toastService.ShowToast(toastObj);
        }else{
          this._swalService.ShowMessage(data);
        }
      });
    }else{
      this._movimientoTerceroService.saveMovimientoTercero(datos)
      .catch(error => { 
        //console.log('An error occurred:', error);
        this._swalService.ShowMessage(['error', 'Error', 'Ha ocurrido un error']);
        return this.handleError(error);
      })
      .subscribe((data:any)=>{
        if (data.codigo == 'success') { 
          this.ActualizarTabla.emit();       
          this.CerrarModal();
          let toastObj = {textos:[data.titulo, data.mensaje], tipo:data.codigo, duracion:4000};
          this._toastService.ShowToast(toastObj);
        }else{
          this._swalService.ShowMessage(data);
        }
      });
    }    
  }

  ValidateBeforeSubmit():boolean{
    
    if (!this._validacionService.validateString(this.MovimientoTerceroModel.Tipo, 'Tipo Movimiento')) {
      return false;
    }else if (!this._validacionService.validateString(this.MovimientoTerceroModel.Id_Moneda_Valor, 'Moneda')) {
      return false;
    }else if (!this._validacionService.validateNumber(this.MovimientoTerceroModel.Valor, 'Valor Movimiento')) {
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
    this.ModalAjusteTercero.hide();
  }

  LimpiarModelo(){
    this.MovimientoTerceroModel = new MovimientoTerceroModel();
  }

  InputSoloNumerosYDecimal(e:KeyboardEvent){    
    return this._generalService.KeyboardOnlyNumbersAndDecimal(e);
  }


}
