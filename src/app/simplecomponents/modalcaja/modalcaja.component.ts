import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { CajaModel } from '../../Modelos/CajaModel';
import { GeneralService } from '../../shared/services/general/general.service';
import { SwalService } from '../../shared/services/swal/swal.service';
import { ValidacionService } from '../../shared/services/validaciones/validacion.service';
import { ToastService } from '../../shared/services/toasty/toast.service';
import { CajaService } from '../../shared/services/caja/caja.service';
import { OficinaService } from '../../shared/services/oficinas/oficina.service';

@Component({
  selector: 'app-modalcaja',
  templateUrl: './modalcaja.component.html',
  styleUrls: ['./modalcaja.component.scss', '../../../style.scss']
})
export class ModalcajaComponent implements OnInit {

  @Input() AbrirModal: Observable<any> = new Observable();
  @Output() ActualizarTabla: EventEmitter<any> = new EventEmitter();

  @ViewChild('ModalCaja') ModalCaja: any;

  public Oficinas: Array<any> = [];
  public openSubscription: any;
  public Editar: boolean = false;
  public MensajeGuardar: string = 'Se dispone a guardar esta caja';

  public CajaModel: CajaModel = new CajaModel();

  constructor(private _generalService: GeneralService,
    private _swalService: SwalService,
    private _validacionService: ValidacionService,
    private _toastService: ToastService,
    private _cajaService: CajaService,
    private _oficinaService: OficinaService) {
    this.GetOficinas();
  }

  ngOnInit() {
    this.openSubscription = this.AbrirModal.subscribe((data: string) => {

      if (data != "0") {
        this.Editar = true;
        this.MensajeGuardar = 'Se dispone a actualizar esta caja';
        let p = { id_caja: data };

        this._cajaService.getCaja(p).subscribe((d: any) => {
          if (d.codigo == 'success') {
            this.CajaModel = d.query_data;
            this.ModalCaja.show();
          } else {

            this._swalService.ShowMessage(d);
          }

        });
      } else {
        this.MensajeGuardar = 'Se dispone a guardar esta caja';
        this.Editar = false;
        this.ModalCaja.show();
      }
    });
  }

  ngOnDestroy() {
    if (this.openSubscription != undefined) {
      this.openSubscription.unsubscribe();
    }

    this.CerrarModal();
  }

  GetOficinas() {
    this._oficinaService.getOficinas().subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.Oficinas = data.query_data;
      } else {

        this.Oficinas = [];
        let toastObj = { textos: [data.titulo, data.mensaje], tipo: data.codigo, duracion: 4000 };
        this._toastService.ShowToast(toastObj);
      }
    });
  }

  GuardarCaja() {

    if (!this.ValidateBeforeSubmit()) {
      return;
    }

    //console.log(this.CajaModel);

    this.CajaModel = this._generalService.limpiarString(this.CajaModel);
    let aux = this.CajaModel.MAC;
    this.CajaModel.MAC = aux.match(/.{1,2}/g).map(x => x + ':').join('').slice(0, 17)

    let info = this._generalService.normalize(JSON.stringify(this.CajaModel));

    let datos = new FormData();
    datos.append("modelo", info);

    if (this.Editar) {
      this._cajaService.editCaja(datos)
        .catch(error => {
          //console.log('An error occurred:', error);
          this._swalService.ShowMessage(['error', 'Error', 'Ha ocurrido un error']);
          return this.handleError(error);
        })
        .subscribe((data: any) => {
          if (data.codigo == 'success') {
            this.ActualizarTabla.emit();
            this.CerrarModal();
            this.Editar = false;
            this._swalService.ShowMessage(['success', 'Exito', 'Operacion realizada correctamente']);

            // let toastObj = { textos: [data.titulo, data.mensaje], tipo: data.codigo, duracion: 4000 };
            // this._toastService.ShowToast(toastObj);
          } else {
            this._swalService.ShowMessage(data);
          }
        });
    } else {
      this._cajaService.saveCaja(datos)
        .catch(error => {
          //console.log('An error occurred:', error);
          this._swalService.ShowMessage(['error', 'Error', 'Ha ocurrido un error']);
          return this.handleError(error);
        })
        .subscribe((data: any) => {
          if (data.codigo == 'success') {
            this.ActualizarTabla.emit();
            this.CerrarModal();
            // let toastObj = { textos: [data.titulo, data.mensaje], tipo: data.codigo, duracion: 4000 };
            // this._toastService.ShowToast(toastObj);
            this._swalService.ShowMessage(['success', 'Exito', 'Operacion realizada correctamente']);

          } else {
            this._swalService.ShowMessage(data);
          }
        });
    }
  }

  ValidateBeforeSubmit(): boolean {

    if (!this._validacionService.validateString(this.CajaModel.Nombre, 'Nombre caja')) {
      return false;
    } else if (!this._validacionService.validateString(this.CajaModel.Id_Oficina, 'Pais')) {
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
    this.ModalCaja.hide();
  }

  LimpiarModelo() {
    this.CajaModel = new CajaModel();
  }


}
