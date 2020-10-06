import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { AgenteExternoModel } from '../../Modelos/AgenteExternoModel';
import { GeneralService } from '../../shared/services/general/general.service';
import { SwalService } from '../../shared/services/swal/swal.service';
import { ValidacionService } from '../../shared/services/validaciones/validacion.service';
import { ToastService } from '../../shared/services/toasty/toast.service';
import { AgenteexternoService } from '../../shared/services/agentesexternos/agenteexterno.service';

@Component({
  selector: 'app-modalagenteexterno',
  templateUrl: './modalagenteexterno.component.html',
  styleUrls: ['./modalagenteexterno.component.scss', '../../../style.scss']
})
export class ModalagenteexternoComponent implements OnInit {

  @Input() AbrirModal: Observable<any> = new Observable();
  @Output() ActualizarTabla: EventEmitter<any> = new EventEmitter();

  @ViewChild('ModalAgenteExterno') ModalAgenteExterno: any;

  public openSubscription: any;
  public Editar: boolean = false;
  public MensajeGuardar: string = 'Se dispone a guardar este agente externo';

  public AgenteExternoModel: AgenteExternoModel = new AgenteExternoModel();

  public VerPassword: boolean = false;
  public PasswordType: string = 'password';

  constructor(private _generalService: GeneralService,
    private _swalService: SwalService,
    private _validacionService: ValidacionService,
    private _toastService: ToastService,
    private _AgenteExternoService: AgenteexternoService) {
  }

  ngOnInit() {
    this.openSubscription = this.AbrirModal.subscribe((data: string) => {

      if (data != "0") {
        this.Editar = true;
        this.MensajeGuardar = 'Se dispone a actualizar este agente externo';
        let p = { id_agente_externo: data };

        this._AgenteExternoService.getAgenteExterno(p).subscribe((d: any) => {
          if (d.codigo == 'success') {
            this.AgenteExternoModel = d.query_data;
            this.ModalAgenteExterno.show();
          } else {

            this._swalService.ShowMessage(d);
          }

        });
      } else {
        this.MensajeGuardar = 'Se dispone a guardar este agente externo';
        this.Editar = false;
        this.ModalAgenteExterno.show();
      }
    });
  }

  ngOnDestroy() {
    if (this.openSubscription != undefined) {
      this.openSubscription.unsubscribe();
    }

    this.CerrarModal();
  }

  VerificarIdentificacion() {
    if (this.AgenteExternoModel.Documento != '') {
      this._AgenteExternoService.verificarIdentificacionAgenteExterno(this.AgenteExternoModel.Documento).subscribe((data: any) => {
        if (data != '0') {
          let toastObj = { textos: [data.titulo, data.mensaje], tipo: data.codigo, duracion: 4000 };
          this._toastService.ShowToast(toastObj);
          this.AgenteExternoModel.Documento = '';
        }
      });
    }
  }

  GuardarAgenteExterno() {

    if (!this.ValidateBeforeSubmit()) {
      return;
    }

    // console.log(this.AgenteExternoModel);


    this.AgenteExternoModel = this._generalService.limpiarString(this.AgenteExternoModel);

    let info = this._generalService.normalize(JSON.stringify(this.AgenteExternoModel));
    let datos = new FormData();
    datos.append("modelo", info);

    if (this.Editar) {
      this._AgenteExternoService.editAgenteExterno(datos)
        .catch(error => {
          this._swalService.ShowMessage(['error', 'Error', 'Ha ocurrido un error']);
          return this.handleError(error);
        })
        .subscribe((data: any) => {
          if (data.codigo == 'success') {
            this.ActualizarTabla.emit();
            this.CerrarModal();
            this.Editar = false;
            let toastObj = { textos: [data.titulo, data.mensaje], tipo: data.codigo, duracion: 4000 };
            this._toastService.ShowToast(toastObj);
          } else {
            this._swalService.ShowMessage(data);
          }
        });
    } else {
      this._AgenteExternoService.saveAgenteExterno(datos)
        .catch(error => {
          //console.log('An error occurred:', error);
          this._swalService.ShowMessage(['error', 'Error', 'Ha ocurrido un error']);
          return this.handleError(error);
        })
        .subscribe((data: any) => {
          if (data.codigo == 'success') {
            this.ActualizarTabla.emit();
            this.CerrarModal();
            let toastObj = { textos: [data.titulo, data.mensaje], tipo: data.codigo, duracion: 4000 };
            this._toastService.ShowToast(toastObj);
          } else {
            this._swalService.ShowMessage(data);
          }
        });
    }
  }

  ValidateBeforeSubmit(): boolean {

    if (!this._validacionService.validateString(this.AgenteExternoModel.Nombre, 'Nombre')) {
      return false;
    } else if (!this._validacionService.validateString(this.AgenteExternoModel.Documento, 'Documento')) {
      return false;
    } else if (!this._validacionService.validateNumber(this.AgenteExternoModel.Cupo, 'Cupo')) {
      return false;
    } else if (!this._validacionService.validateString(this.AgenteExternoModel.Username, 'Nombre de usuario')) {
      return false;
    } else if (!this._validacionService.validateString(this.AgenteExternoModel.Password, 'Contrasena')) {
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
    this.ModalAgenteExterno.hide();
  }

  LimpiarModelo() {
    this.AgenteExternoModel = new AgenteExternoModel();
  }

  SoloNumerosYDecimal(e: KeyboardEvent) {
    return this._generalService.KeyboardOnlyNumbersAndDecimal(e);
  }

  CambiarInputType() {
    this.VerPassword = !this.VerPassword;

    if (this.VerPassword) {
      this.PasswordType = 'text';
    } else {
      this.PasswordType = 'password';
    }
  }

}
