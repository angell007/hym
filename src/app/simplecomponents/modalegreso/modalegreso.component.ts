import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { EgresoModel } from '../../Modelos/EgresoModel';
import { GeneralService } from '../../shared/services/general/general.service';
import { SwalService } from '../../shared/services/swal/swal.service';
import { ValidacionService } from '../../shared/services/validaciones/validacion.service';
import { ToastService } from '../../shared/services/toasty/toast.service';
import { EgresoService } from '../../shared/services/egresos/egreso.service';
import { GrupoterceroService } from '../../shared/services/grupotercero.service';
import { MonedaService } from '../../shared/services/monedas/moneda.service';
import { TerceroService } from '../../shared/services/tercero/tercero.service';
import { Funcionario } from '../../shared/funcionario/funcionario.model';

@Component({
  selector: 'app-modalegreso',
  templateUrl: './modalegreso.component.html',
  styleUrls: ['./modalegreso.component.scss', '../../../style.scss']
})
export class ModalegresoComponent implements OnInit {

  @Input() AbrirModal: Observable<any> = new Observable();
  @Output() ActualizarTabla: EventEmitter<any> = new EventEmitter();

  @ViewChild('ModalEgreso') ModalEgreso: any;

  public Monedas: Array<any> = [];
  public Grupos: Array<any> = [];
  public Terceros: Array<any> = [];
  public openSubscription: any;
  public Editar: boolean = false;
  public MensajeGuardar: string = 'Se dispone a guardar este egreso';
  public Funcionario: any = JSON.parse(localStorage.getItem('User'));

  public EgresoModel: EgresoModel = new EgresoModel();

  constructor(private _generalService: GeneralService,
    private _swalService: SwalService,
    private _validacionService: ValidacionService,
    private _toastService: ToastService,
    private _EgresoService: EgresoService,
    private _grupoService: GrupoterceroService,
    private _monedaService: MonedaService,
    private _terceroService: TerceroService) {
    this.GetGrupos();
    this.GetMonedas();
  }

  ngOnInit() {
    this.openSubscription = this.AbrirModal.subscribe((data: string) => {

      if (data != "0") {
        this.Editar = true;
        this.MensajeGuardar = 'Se dispone a actualizar este egreso';
        let p = { id_egreso: data };

        this._EgresoService.getEgreso(p).subscribe((d: any) => {
          if (d.codigo == 'success') {
            this.EgresoModel = d.query_data;
            this.ModalEgreso.show();
          } else {

            this._swalService.ShowMessage(d);
          }

        });
      } else {
        this.MensajeGuardar = 'Se dispone a guardar este egreso';
        this.Editar = false;
        this.ModalEgreso.show();
      }
    });
  }

  ngOnDestroy() {
    if (this.openSubscription != undefined) {
      this.openSubscription.unsubscribe();
    }

    this.CerrarModal();
  }

  GetTercerosGrupo() {
    if (this.EgresoModel.Id_Grupo == '') {
      this.Terceros = [];
      this.EgresoModel.Id_Tercero = '';
    } else {

      this._terceroService.getTercerosGrupo(this.EgresoModel.Id_Grupo).subscribe((data: any) => {
        if (data.codigo == 'success') {
          this.Terceros = data.query_data;
        } else {

          this.Terceros = [];
          this.EgresoModel.Id_Tercero = '';
          let toastObj = { textos: [data.titulo, data.mensaje], tipo: data.codigo, duracion: 4000 };
          this._toastService.ShowToast(toastObj);
        }
      });
    }
  }

  GetMonedas() {
    this._monedaService.getMonedas().subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.Monedas = data.query_data;
      } else {

        this.Monedas = [];
        let toastObj = { textos: [data.titulo, data.mensaje], tipo: data.codigo, duracion: 4000 };
        this._toastService.ShowToast(toastObj);
      }
    });
  }

  GetGrupos() {
    this._grupoService.getGrupos().subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.Grupos = data.query_data;
      } else {

        this.Grupos = [];
        let toastObj = { textos: [data.titulo, data.mensaje], tipo: data.codigo, duracion: 4000 };
        this._toastService.ShowToast(toastObj);
      }
    });
  }

  GuardarEgreso() {

    if (!this.ValidateBeforeSubmit()) {
      return;
    }

    this.EgresoModel.Fecha = this._generalService.FechaActual;
    this.EgresoModel.Identificacion_Funcionario = this.Funcionario.Identificacion_Funcionario;
    this.EgresoModel = this._generalService.limpiarString(this.EgresoModel);
    // console.log(this.EgresoModel);

    let info = this._generalService.normalize(JSON.stringify(this.EgresoModel));
    let datos = new FormData();
    datos.append("modelo", info);
    console.log(datos.getAll("Id_Tercero"));

    if (this.Editar) {
      this._EgresoService.editEgreso(datos)
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
            let toastObj = { textos: [data.titulo, data.mensaje], tipo: data.codigo, duracion: 4000 };
            this._toastService.ShowToast(toastObj);
          } else {
            this._swalService.ShowMessage(data);
          }
        });
    } else {
      this._EgresoService.saveEgreso(datos)
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

    if (!this._validacionService.validateNumber(this.EgresoModel.Id_Grupo, 'Grupo')) {
      return false;
    } else if (!this._validacionService.validateNumber(this.EgresoModel.Id_Tercero, 'Tercero')) {
      return false;
    } else if (!this._validacionService.validateNumber(this.EgresoModel.Id_Moneda, 'Moneda')) {
      return false;
    } else if (!this._validacionService.validateNumber(this.EgresoModel.Valor, 'Valor')) {
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
    this.ModalEgreso.hide();
  }

  LimpiarModelo() {
    this.EgresoModel = new EgresoModel();
  }


}
