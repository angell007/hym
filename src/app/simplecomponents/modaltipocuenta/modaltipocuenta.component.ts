import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { TipoCuentaModel } from '../../Modelos/TipoCuentaModel';
import { SwalService } from '../../shared/services/swal/swal.service';
import { TipocuentaService } from '../../shared/services/tiposcuenta/tipocuenta.service';
import { ToastService } from '../../shared/services/toasty/toast.service';
import { GeneralService } from '../../shared/services/general/general.service';
import { ValidacionService } from '../../shared/services/validaciones/validacion.service';

@Component({
  selector: 'app-modaltipocuenta',
  templateUrl: './modaltipocuenta.component.html',
  styleUrls: ['./modaltipocuenta.component.scss', '../../../style.scss']
})
export class ModaltipocuentaComponent implements OnInit, OnDestroy {

  @Input() AbrirModalEvent: Observable<any>;

  @Output() ActualizarTabla: EventEmitter<any> = new EventEmitter();

  @ViewChild('ModalTipoCuenta') ModalTipoCuenta: any;

  private suscripcion: any;
  public Paises: Array<any> = [];
  private Editar: boolean = false;
  public MensajeGuardar: string = 'Se dispone a guardar este tipo de cuenta';

  public TipoCuentaModel: TipoCuentaModel = new TipoCuentaModel();

  constructor(private _swalService: SwalService,
    private _tipoCuentaService: TipocuentaService,
    private _toastService: ToastService,
    private _generalService: GeneralService,
    private _validacionService: ValidacionService) {
  }

  ngOnInit() {
    this.suscripcion = this.AbrirModalEvent.subscribe((data: string) => {

      if (data != "0") {
        this.MensajeGuardar = 'Se dispone a actualizar este tipo de cuenta';
        this.Editar = true;
        let p = { id_tipo_cuenta: data };
        this._tipoCuentaService.getTipoCuenta(p).subscribe((d: any) => {
          if (d.codigo == 'success') {
            this.TipoCuentaModel = d.query_data;
            this.ModalTipoCuenta.show();
          } else {

            this._swalService.ShowMessage(data);
          }

        });
      } else {
        this.MensajeGuardar = 'Se dispone a guardar este  tipo de cuenta';
        this.Editar = false;
        this.ModalTipoCuenta.show();
      }
    });
  }

  ngOnDestroy() {
    this.suscripcion.unsubscribe();
    this.CerrarModal();
  }

  GuardarTipoCuenta() {
    if (!this.ValidateBeforeSubmit()) {
      return;
    }

    let modelo = this._generalService.normalize(JSON.stringify(this.TipoCuentaModel));
    let datos = new FormData();
    datos.append("modelo", modelo);

    if (this.Editar) {
      this._tipoCuentaService.editTipoCuenta(datos)
        .catch(error => {
          this._swalService.ShowMessage(['error', 'Error', 'Ha ocurrido un error']);
          return this.handleError(error);
        })
        .subscribe((data: any) => {
          if (data.codigo == 'success') {
            this.ActualizarTabla.emit();
            // let toastObj = {textos:[data.titulo, data.mensaje], tipo:data.codigo, duracion:4000};
            // this._toastService.ShowToast(toastObj);
            this._swalService.ShowMessage(['success', 'Exito', 'Operacion realizada correctamente']);
            this.CerrarModal();
          } else {
            this._swalService.ShowMessage(data);
          }
        });
    } else {
      this._tipoCuentaService.saveTipoCuenta(datos)
        .catch(error => {
          this._swalService.ShowMessage(['error', 'Error', 'Ha ocurrido un error']);
          return this.handleError(error);
        })
        .subscribe((data: any) => {
          if (data.codigo == 'success') {
            this.ActualizarTabla.emit();
            // let toastObj = {textos:[data.titulo, data.mensaje], tipo:data.codigo, duracion:4000};
            // this._toastService.ShowToast(toastObj);
            this._swalService.ShowMessage(['success', 'Exito', 'Operacion realizada correctamente']);

            this.CerrarModal();
          } else {
            this._swalService.ShowMessage(data);
          }
        });
    }
  }

  ValidateBeforeSubmit() {
    if (!this._validacionService.validateString(this.TipoCuentaModel.Nombre, 'Nombre tipo cuenta')) {
      return false;
    }

    return true;
  }


  CerrarModal() {
    this.TipoCuentaModel = new TipoCuentaModel();
    this.ModalTipoCuenta.hide();
  };

  handleError(error: Response) {
    return Observable.throw(error);
  }


}
