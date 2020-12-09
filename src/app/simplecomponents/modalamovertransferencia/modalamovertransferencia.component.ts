import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralService } from '../../shared/services/general/general.service';
import { SwalService } from '../../shared/services/swal/swal.service';
import { ToastService } from '../../shared/services/toasty/toast.service';
import { CuentabancariaService } from '../../shared/services/cuentasbancarias/cuentabancaria.service';
import { MoverTransferenciaModel } from '../../Modelos/MoverTransferenciaModel';

@Component({
  selector: 'app-modalamovertransferencia',
  templateUrl: './modalamovertransferencia.component.html',
  styleUrls: ['./modalamovertransferencia.component.scss', '../../../style.scss']
})
export class ModalamovertransferenciaComponent implements OnInit {

  @Input() AbrirModal: Observable<any> = new Observable();
  @Output() ActualizarDatos: EventEmitter<any> = new EventEmitter();

  @ViewChild('ModalMoverTransferencia') ModalMoverTransferencia: any;

  public openSubscription: any;

  public MoverTransferenciaModel: MoverTransferenciaModel = new MoverTransferenciaModel();
  public Codigo_Moneda: string = '';
  public Cuenta_Origen: string = 'Cuenta Origen';
  public Cuentas_Apertura: Array<any> = [];

  constructor(private _generalService: GeneralService,
    private _swalService: SwalService,
    private _toastService: ToastService,
    private _cuentaBancariaService: CuentabancariaService) {
  }

  ngOnInit() {
    this.openSubscription = this.AbrirModal.subscribe((data: any) => {
      // console.log(data);

      this.MoverTransferenciaModel.Id_Cuenta_Origen = data.id_cuenta_origen;
      this.MoverTransferenciaModel.Id_Pago_Transferencia = data.id_pago_transferencia;
      this.MoverTransferenciaModel.Id_Transferencia_Destinatario = data.id_transferencia_destinatario;
      this.MoverTransferenciaModel.Numero_Transferencia = data.numero_transferencia;
      this.MoverTransferenciaModel.Recibo = data.recibo;
      this.MoverTransferenciaModel.Valor = data.valor;
      this.Codigo_Moneda = data.codigo_moneda;
      this.Cuentas_Apertura = data.cuentas_ultima_apertura;
      // this.MoverTransferenciaModel.Id_Consultor_Apertura = data.id_apertura;      
      this.ModalMoverTransferencia.show();
      setTimeout(() => {
        this._getCuentaOrigen();
      }, 200);
    });
  }

  ngOnDestroy() {
    if (this.openSubscription != undefined) {
      this.openSubscription.unsubscribe();
    }
  }

  RealizarMovimientoTransferencia() {

    if (!this.ValidateBeforeSubmit()) {
      return;
    } else {

    }

    // console.log(this.MoverTransferenciaModel);

    let info = this._generalService.normalize(JSON.stringify(this.MoverTransferenciaModel));
    let datos = new FormData();
    datos.append("modelo", info);

    this._cuentaBancariaService.RealizarMovimientoTransferencia(datos)
      .catch(error => {
        //console.log('An error occurred:', error);
        this._swalService.ShowMessage(['error', 'Error', 'Ha ocurrido un error']);
        return this.handleError(error);
      })
      .subscribe((data: any) => {
        if (data.codigo == 'success') {
          this.ActualizarDatos.emit();
          this.CerrarModal();

          this._swalService.ShowMessage(['success', data.titulo, data.mensaje]);

          // let toastObj = {textos:[data.titulo, data.mensaje], tipo:data.codigo, duracion:4000};
          // this._toastService.ShowToast(toastObj);
        } else {
          this._swalService.ShowMessage(data);
        }
      });
  }

  ValidateBeforeSubmit(): boolean {
    if (this.MoverTransferenciaModel.Id_Cuenta_Destino == '') {
      this._swalService.ShowMessage(['warning', 'Alerta', 'Debe escoger la cuenta destino para realizar el movimiento!']);
      return false;
    } else if (this.MoverTransferenciaModel.Id_Cuenta_Destino == this.MoverTransferenciaModel.Id_Cuenta_Origen) {
      this._swalService.ShowMessage(['warning', 'Alerta', 'La cuenta destino no puede ser la misma que la cuenta de origen!']);
      return false;
    } else {
      return true;
    }
  }

  handleError(error: Response) {
    return Observable.throw(error);
  }

  CerrarModal() {
    this.LimpiarModelo();
    this.ModalMoverTransferencia.hide();
  }

  LimpiarModelo() {
    this.MoverTransferenciaModel = new MoverTransferenciaModel();
  }

  InputSoloNumerosYDecimal(e: KeyboardEvent) {
    return this._generalService.KeyboardOnlyNumbersAndDecimal(e);
  }

  private _getCuentaOrigen() {
    let ind = this.Cuentas_Apertura.findIndex(x => x.Id_Cuenta_Bancaria == this.MoverTransferenciaModel.Id_Cuenta_Origen);
    if (ind > -1) {
      this.Cuenta_Origen = this.Cuentas_Apertura[ind].Codigo_Moneda + " - " + this.Cuentas_Apertura[ind].Nombre_Titular;
      // this.Cuentas_Apertura.splice(ind, 1);
    }
  }


}
