import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { MonedaModel } from '../../Modelos/MonedaModel';
import { GeneralService } from '../../shared/services/general/general.service';
import { SwalService } from '../../shared/services/swal/swal.service';
import { ValidacionService } from '../../shared/services/validaciones/validacion.service';
import { MonedaService } from '../../shared/services/monedas/moneda.service';
import { ToastService } from '../../shared/services/toasty/toast.service';

@Component({
  selector: 'app-modalmoneda',
  templateUrl: './modalmoneda.component.html',
  styleUrls: ['./modalmoneda.component.scss', '../../../style.scss']
})
export class ModalmonedaComponent implements OnInit {

  @Input() AbrirModal:Observable<any> = new Observable();
  @Output() ActualizarTabla:EventEmitter<any> = new EventEmitter();
  
  @ViewChild('ModalMoneda') ModalMoneda:any;

  public BancosPais:Array<any> = [];
  public Paises:any = [];
  public Monedas:any = [];
  public TiposCuenta:any = [];

  public openSubscription:any;
  private Editar:boolean = false;
  public MensajeGuardar:string = 'Se dispone a guardar esta moneda';

  public MonedaModel:MonedaModel = new MonedaModel();

  constructor(private _generalService: GeneralService,
              private _swalService:SwalService,
              private _validacionService:ValidacionService,
              private _monedaService:MonedaService,
              private _toastService:ToastService) 
  {
    this.GetPaises();
  }

  ngOnInit() {
    this.openSubscription = this.AbrirModal.subscribe((data:string) => {
      
      if (data != "0") {
        this.Editar = true;
        this.MensajeGuardar = 'Se dispone a actualizar esta moneda';
        let p = {id_moneda:data};
        
        this._monedaService.getMoneda(p).subscribe((d:any) => {
          if (d.codigo == 'success') {
            this.MonedaModel = d.query_data;
            this.ModalMoneda.show();  
          }else{
            
            this._swalService.ShowMessage(d);
          }
          
        });
      }else{
        this.MensajeGuardar = 'Se dispone a guardar esta moneda';
        this.Editar = false;
        this.ModalMoneda.show();
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
      this.Paises = this._generalService.getPaises();  
    }, 1000);
  }

  GuardarMoneda(){

    if (!this.ValidateBeforeSubmit()) {
      return;
    }

    this.MonedaModel.ValoresMoneda = this._generalService.FillEmptyValues(this.MonedaModel.ValoresMoneda, "0");
    //console.log(this.MonedaModel);
    
    this.MonedaModel = this._generalService.limpiarString(this.MonedaModel);
    
    let info = this._generalService.normalize(JSON.stringify(this.MonedaModel));
    let datos = new FormData();
    datos.append("modelo",info);

    if (this.Editar) {
      this._monedaService.editMoneda(datos)
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
      this._monedaService.saveMoneda(datos)
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
    
    if (!this._validacionService.validateString(this.MonedaModel.Nombre, 'Nombre Moneda')) {
      return false;
    }else if (!this._validacionService.validateNumber(this.MonedaModel.Id_Pais, 'Pais')) {
      return false;
    }else if (!this._validacionService.validateString(this.MonedaModel.Codigo, 'Codigo')) {
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
    this.ModalMoneda.hide();
  }

  LimpiarModelo(){
    this.MonedaModel = new MonedaModel();
  }

  InputSoloNumerosYDecimal(e:KeyboardEvent){    
    return this._generalService.KeyboardOnlyNumbersAndDecimal(e);
  }

  test(){
    
    if (!this.MonedaModel.ValoresMoneda.Min_Venta_Efectivo) {
      this.MonedaModel.ValoresMoneda.Min_Venta_Efectivo = "0";
    }
  }

}
