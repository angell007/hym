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
import { NormailizerService } from '../../normailizer.service';
import { providers } from 'ng2-toasty';
import { ConsolidadosService } from '../../customservices/consolidados.service';

@Component({
  selector: 'app-modalegreso',
  templateUrl: './modalegreso.component.html',
  styleUrls: ['./modalegreso.component.scss', '../../../style.scss'],
  providers: [NormailizerService]
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
  public coinDefault: string;
  public flag: boolean;

  public EgresoModel: EgresoModel = new EgresoModel();

  ShowSwal(tipo: string, titulo: string, msg: string, confirmCallback = null, cancelCallback = null) {
    this.alertSwal.type = tipo;
    this.alertSwal.title = titulo;
    this.alertSwal.text = msg;
    this.alertSwal.show();
  }
  @ViewChild('alertSwal') alertSwal: any;

  constructor(private _generalService: GeneralService,
    private _swalService: SwalService,
    private _validacionService: ValidacionService,
    private _toastService: ToastService,
    private _EgresoService: EgresoService,
    private _grupoService: GrupoterceroService,
    private _monedaService: MonedaService,
    private _terceroService: TerceroService,
    private _normalizeService: NormailizerService,
    private _consolidadoService: ConsolidadosService

  ) {
    this.GetGrupos();

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

            this.ShowSwal('warning', 'Alerta', 'ingresando a egresos');
          }

        });
      } else {
        this.MensajeGuardar = 'Se dispone a guardar este egreso';
        this.Editar = false;
        this.GetMonedas();
        this.ModalEgreso.show();
      }
    });

  }

  GetMonedas() {
    this._monedaService.getMonedas().subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.Monedas = data.query_data;
        let monedaDefault: any[] = this.Monedas.filter((x: any) => {
          return x.Nombre == 'Pesos'
        })

        this.EgresoModel.Id_Moneda = monedaDefault[0]['Id_Moneda'];

      } else {

        this.Monedas = [];
        this.ShowSwal('warning', 'Alerta', 'No se encontraron registros!');

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
          this.ShowSwal('warning', 'Alerta', 'No se encontraron registros!');
          // this.ShowSwal('warning', 'Warning', 'Debe recalcular el monto a entregar!');
          // let toastObj = { textos: [data.titulo, data.mensaje], tipo: data.codigo, duracion: 4000 };
          // this._toastService.ShowToast(toastObj);
        }
      });
    }
  }



  GetGrupos() {
    this._grupoService.getGrupos().subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.Grupos = data.query_data;
      } else {

        this.Grupos = [];
        this.ShowSwal('warning', 'Alerta', 'No se encontraron registros!');

        // let toastObj = { textos: [data.titulo, data.mensaje], tipo: data.codigo, duracion: 4000 };
        // this._toastService.ShowToast(toastObj);
      }
    });
  }

  GuardarEgreso() {

    if (!this.ValidateBeforeSubmit()) {
      return;
    }


    this._consolidadoService.TotalRestaIngresosEgresos.forEach(element => {
      if (this.EgresoModel.Id_Moneda == element[3]) {
        if (parseFloat(element[1]) < parseFloat(this.EgresoModel.Valor)) {
          this.flag = true;
        }
      }
    });


    if (this.flag) {
      this.flag = false;
      this.ShowSwal('warning', 'alerta', 'No cuentas con suficiente Saldo !');
      return false
    }

    this.EgresoModel.Fecha = this._generalService.FechaActual;
    this.EgresoModel.Identificacion_Funcionario = this.Funcionario.Identificacion_Funcionario;
    this.EgresoModel = this._generalService.limpiarString(this.EgresoModel);

    let info = this._normalizeService.normalize(JSON.stringify(this.EgresoModel));

    let datos = new FormData();
    datos.append("modelo", info);
    console.log(datos.getAll("Id_Tercero"));

    if (this.Editar) {
      this._EgresoService.editEgreso(datos)
        .catch(error => {
          console.log('An error occurred:', error);
          this._swalService.ShowMessage(['error', 'Error', 'Ha ocurrido un error']);
          return this.handleError(error);
        })
        .subscribe((data: any) => {
          if (data.codigo == 'success') {
            this.ActualizarTabla.emit();
            this.CerrarModal();
            this.Editar = false;
            this.ShowSwal('success', 'Éxito', 'Operacion realizada correctamente!');
          } else {
            this.ShowSwal('warning', 'Alerta', data);
          }
        });
    } else {
      this._EgresoService.saveEgreso(datos)
        .catch(error => {
          this.ShowSwal('warning', 'Alerta', 'Ha ocurrido un error!');
          return this.handleError(error);
        })
        .subscribe((data: any) => {
          if (data.codigo == 'success') {
            this.ActualizarTabla.emit();
            this.CerrarModal();
            this.ShowSwal('success', 'Éxito', 'Operacion realizada correctamente!');
          } else {
            this.ShowSwal('warning', 'Alerta', data);
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
