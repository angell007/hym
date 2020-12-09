import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { GeneralService } from '../../shared/services/general/general.service';
import { Observable } from 'rxjs';
import { ISubscription } from 'rxjs/Subscription';
import { DevolucionTransferenciaModel } from '../../Modelos/DevolucionTransferenciaModel';
import { TransferenciaService } from '../../shared/services/transferencia/transferencia.service';
import { SwalService } from '../../shared/services/swal/swal.service';
import { ToastService } from '../../shared/services/toasty/toast.service';
import { ActualizarService } from '../../customservices/actualizar.service';

@Component({
  selector: 'app-modaldevoluciontransferencia',
  templateUrl: './modaldevoluciontransferencia.component.html',
  styleUrls: ['./modaldevoluciontransferencia.component.scss', '../../../style.scss']
})
export class ModaldevoluciontransferenciaComponent implements OnInit {

  @Output() RecargarPagos:EventEmitter<any> = new EventEmitter();
  @Input() AbrirModal:Observable<any> = new Observable();
  private openSubscription:ISubscription;
  
  // private Id_Apertura_Consultor:string = localStorage.getItem('Apertura_Consultor');
  private Id_Apertura_Consultor:string = '';

  @ViewChild('ModalDevolucionTransferencia') ModalDevolucionTransferencia:any;

  public MotivosDevolucion:Array<any> = [];
  public CodigoMoneda:string = '';
  public DevolucionModel:DevolucionTransferenciaModel = new DevolucionTransferenciaModel();

  constructor(private _generalService:GeneralService,
              private _transferenciaService:TransferenciaService,
              private _swalService:SwalService,
              private _toastService:ToastService,
              private _actualizar: ActualizarService) 
  { 
  }

  ngOnInit() {
    this.openSubscription = this.AbrirModal.subscribe((data:any) => {
      // console.log(data);
      this.CodigoMoneda = data.codigo_moneda;
      this._setDatosModelo(data.transferencia);
      this.Id_Apertura_Consultor = data.id_apertura;
      this.ModalDevolucionTransferencia.show();

      setTimeout(() => {
        this.GetMotivosDevolucion();
      }, 300);
    });
  }

  public GetMotivosDevolucion(){
    this._generalService.GetMotivosDevolucion().subscribe((response:any) => {
      // console.log(response);
      if (response.codigo == 'success') {
        this.MotivosDevolucion = response.query_data;
      }else{
        this.MotivosDevolucion = [];
      }
    });
  }

  private _setDatosModelo(transferenciaModel:any){
    this.DevolucionModel.Id_Pago_Transferencia = transferenciaModel.Id_Pago_Transfenecia;
    this.DevolucionModel.Id_Transferencia_Destinatario = transferenciaModel.Id_Transferencia_Destino;
    this.DevolucionModel.Valor = transferenciaModel.Valor_Pagado;
    // console.log(this.DevolucionModel);    
  }

  RealizarDevolucion() {    
    this.DevolucionModel.Id_Funcionario = this._generalService.Funcionario.Identificacion_Funcionario;
    // console.log(this.DevolucionModel);

    let info = this._generalService.normalize(JSON.stringify(this.DevolucionModel));
    let datos = new FormData();
    datos.append("modelo", info);
    datos.append("id_apertura", this.Id_Apertura_Consultor);
    this._transferenciaService.DevolverTransferencia(datos).subscribe((response:any) => {
      // console.log(response);
      if (response.codigo == 'success') {

        this._swalService.ShowMessage(['success', 'Exito', 'Operacion realizada correctamente']);
        
        // let toastObj = {textos:[response.titulo, response.mensaje], tipo:response.codigo, duracion:4000};
        // this._toastService.ShowToast(toastObj);
        this.CerrarModal();
        this._actualizar.cardListing.next()
        this.RecargarPagos.emit();
      }else{
        this._swalService.ShowMessage(['warning', response.titulo, response.mensaje]);
        // let toastObj = {textos:[response.titulo, response.mensaje], tipo:response.codigo, duracion:4000};
        // this._toastService.ShowToast(toastObj);
      }
    });
  }

  private _limpiarModelo(){
    this.DevolucionModel = new DevolucionTransferenciaModel();
  }

  public CerrarModal(){
    this.ModalDevolucionTransferencia.hide();
    this._limpiarModelo();
  }
  

}
