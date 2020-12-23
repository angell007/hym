import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralService } from '../../shared/services/general/general.service';
import { SwalService } from '../../shared/services/swal/swal.service';
import { ValidacionService } from '../../shared/services/validaciones/validacion.service';
import { ToastService } from '../../shared/services/toasty/toast.service';
import { TrasladoModel } from '../../Modelos/TrasladoModel';
import { MonedaService } from '../../shared/services/monedas/moneda.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { TrasladoService } from '../../shared/services/traslados/traslado.service';
import { TerceroService } from '../../shared/services/tercero/tercero.service';
import { CuentabancariaService } from '../../shared/services/cuentasbancarias/cuentabancaria.service';
import { ConsolidadosService } from '../../customservices/consolidados.service';

@Component({
  selector: 'app-modaltraslado',
  templateUrl: './modaltraslado.component.html',
  styleUrls: ['./modaltraslado.component.scss', '../../../style.scss']
})
export class ModaltrasladoComponent implements OnInit, OnDestroy {

  @Input() AbrirModal: Observable<any> = new Observable();
  @Output() ActualizarTabla: EventEmitter<any> = new EventEmitter();

  @ViewChild('ModalTraslado') ModalTraslado: any;

  public TiposDocumento: Array<any> = [];
  public Monedas: Array<any> = [];
  public openSubscription: any;
  public Editar: boolean = false;
  public MensajeGuardar: string = 'Se dispone a guardar este traslado';
  public TipoOrigen: string = '';
  public TipoDestino: string = '';
  public Origen: any = '';
  public Destino: any = '';
  public Funcionario: any = JSON.parse(localStorage.getItem('User'));
  public flag: boolean;
  public Mymoneda: string;

  public TrasladoModel: TrasladoModel = new TrasladoModel();

  constructor(private _generalService: GeneralService,
    private _swalService: SwalService,
    private _validacionService: ValidacionService,
    private _toastService: ToastService,
    private _trasladoService: TrasladoService,
    private _monedaService: MonedaService,
    private _terceroService: TerceroService,
    private _consolidadoService: ConsolidadosService,

    private _cuentaBancariaService: CuentabancariaService) {
    this.GetMonedas();
  }

  ngOnInit() {
    this.openSubscription = this.AbrirModal.subscribe((data: string) => {

      if (data != "0") {
        this.Editar = true;
        this.MensajeGuardar = 'Se dispone a actualizar este traslado';
        let p = { id_Traslado: data };

        this._trasladoService.getTraslado(p).subscribe((d: any) => {
          if (d.codigo == 'success') {
            this.TrasladoModel = d.query_data;
            this.ModalTraslado.show();
          } else {

            this._swalService.ShowMessage(d);
          }

        });
      } else {
        this.MensajeGuardar = 'Se dispone a guardar este traslado';
        // console.log('Se dispone');
        this.Editar = false;
        this.ModalTraslado.show();
      }
    });
  }

  ngOnDestroy() {
    if (this.openSubscription != undefined) {
      this.openSubscription.unsubscribe();
    }

    this.CerrarModal();
  }

  GetMonedas() {
    this._monedaService.getMonedas().subscribe((data: any) => {
      if (data != null) {
        this.Monedas = data;
      } else {

        this.Monedas = [];
        let toastObj = { textos: [data.titulo, data.mensaje], tipo: data.codigo, duracion: 4000 };
        this._toastService.ShowToast(toastObj);
      }
    });
  }

  ConsultaOrigen(match: string) {

    if (this.TrasladoModel.Origen == 'Cliente') {
      return this._terceroService.getTercerosPorTipo('Cliente', match);
    } else if (this.TrasladoModel.Origen == 'Proveedor') {
      return this._terceroService.getTercerosPorTipo('Proveedor', match);
    } else if (this.TrasladoModel.Origen == 'Cuenta Bancaria') {
      return this._cuentaBancariaService.getFiltrarCuentasBancarias(match);
    }
  }

  ConsultaDestino(match: string) {

    if (this.TrasladoModel.Destino == 'Cliente') {
      return this._terceroService.getTercerosPorTipo('Cliente', match);
    } else if (this.TrasladoModel.Destino == 'Proveedor') {
      return this._terceroService.getTercerosPorTipo('Proveedor', match);
    } else if (this.TrasladoModel.Destino == 'Cuenta Bancaria') {
      return this._cuentaBancariaService.getFiltrarCuentasBancarias(match);
    } else if (this.TrasladoModel.Destino == 'Cajero') {
      return this._cuentaBancariaService.getFiltrarCajero(match);
    }
  }

  search_origen = (text$: Observable<string>) =>
    text$
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap(term => term.length < 3 ? [] :
          this.ConsultaOrigen(term)
            .map(response => response)
            .do(data => {
              console.log(data);
              return data;
            })
        )
      );
  formatter_origen = (x: { Nombre: string }) => x.Nombre;


  search_destino = (text$: Observable<string>) =>
    text$
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap(term => term.length < 3 ? [] :
          this.ConsultaDestino(term)
            .map(response => response)
            .do(data => data)
        )
      );
  formatter_destino = (x: { Nombre: string }) => x.Nombre;

  GuardarTraslado() {
    this._consolidadoService.TotalRestaIngresosEgresos.forEach(element => {
      if (this.TrasladoModel.Moneda == element.id) {
        if (parseFloat(element.saldo) < parseFloat(this.TrasladoModel.Valor)) {
          this.flag = true;
        }
      }
    });

    if (this.flag) {
      this.flag = false;
      this._swalService.ShowMessage(['warning', 'alerta', 'No cuentas con suficiente Saldo !']);
      return false
    }


    if (!this.ValidateBeforeSubmit()) {
      return;
    } else {
      this.TrasladoModel.Identificacion_Funcionario = this.Funcionario.Identificacion_Funcionario;
      this.TrasladoModel.Fecha = this._generalService.FechaActual;
      this.TrasladoModel.Id_Caja = this._generalService.SessionDataModel.idCaja;
      this.TrasladoModel = this._generalService.limpiarString(this.TrasladoModel);
      // console.log(this.TrasladoModel);
      let info = this._generalService.normalize(JSON.stringify(this.TrasladoModel));
      let datos = new FormData();
      datos.append("modelo", info);

      if (this.Editar) {
        this._trasladoService.editTraslado(datos)
          .catch(error => {
            //console.log('An error occurred:', error);
            this._swalService.ShowMessage(['error', 'Error', 'Ha ocurrido un error']);
            return this.handleError(error);
          })
          .subscribe((data: any) => {

            // console.log(data);

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
        this._trasladoService.saveTraslado(datos)

          .catch(error => {
            // console.log('An error occurred:', error);
            // this._swalService.ShowMessage(['error', 'Error', 'Ha ocurrido un error']);
            return this.handleError(error);
          })
          .subscribe((data: any) => {
            if (data.codigo == 'success') {
              this.ActualizarTabla.emit();
              this.CerrarModal();
              this._swalService.ShowMessage(['success', 'Exito', 'Operacion realizada correctamente']);

              // let toastObj = {textos:[data.titulo, data.mensaje], tipo:data.codigo, duracion:4000};
              // this._toastService.ShowToast(toastObj);
            } else {
              this._swalService.ShowMessage(data);
            }
          });
      }
    }
  }

  public settearMoneda() {

    // console.log(this.TrasladoModel.Moneda);
    this._consolidadoService.TotalRestaIngresosEgresos.forEach(element => {
      if (this.TrasladoModel.Moneda == element[3]) {
        this.Mymoneda = element[2]
      }
    });

  }

  ValidateBeforeSubmit(): boolean {
    // console.log('validando');
    // console.log(this.TrasladoModel);
    if (!this._validacionService.validateString(this.TrasladoModel.Origen, 'Tipo Origen')) {
      return false;
      // } else if (!this._validacionService.validateString(this.TrasladoModel.Destino, 'Tipo Destino')) {
      //   return false;
      // } else if (!this._validacionService.validateNumber(this.TrasladoModel.Id_Origen, 'Origen')) {
      //   return false;
      // } else if (!this._validacionService.validateNumber(this.TrasladoModel.Id_Destino, 'Destino')) {
      //   return false;
      // } else if (!this._validacionService.validateNumber(this.TrasladoModel.Moneda, 'Moneda')) {
      //   return false;
      // } else if (!this._validacionService.validateString(this.TrasladoModel.Valor, 'Valorx')) {
      //   return false;
      // } else if (!this._validacionService.validateString(this.TrasladoModel.Detalle, 'Detalle')) {
      // console.log(this.TrasladoModel);

      // return false;
    } else {
      // console.log('validado');
      return true;
    }
  }

  handleError(error: Response) {
    return Observable.throw(error);
  }

  CerrarModal() {
    this.LimpiarModelo();
    this.ModalTraslado.hide();
  }

  LimpiarModelo() {
    this.TrasladoModel = new TrasladoModel();
    this.Origen = '';
    this.Destino = '';
  }

  CompletarOrigen(value) {

    if (typeof (value) == 'object') {
      this.TrasladoModel.Id_Origen = this.TrasladoModel.Origen == 'Cuenta Bancaria' ? value.Id_Cuenta_Bancaria : value.Id_Tercero;
    } else {
      this.TrasladoModel.Id_Origen = '';
    }

  }

  CompletarDestino(value) {

    if (typeof (value) == 'object') {

      switch (this.TrasladoModel.Destino) {
        case 'Cuenta Bancaria':
          this.TrasladoModel.Id_Destino = value.Id_Cuenta_Bancaria
          break;

        case 'Cajero':
          this.TrasladoModel.Id_Destino = value.Identificacion_Funcionario

          break;

        default:
          this.TrasladoModel.Id_Destino = value.Id_Tercero
          break;
      }

    } else {
      this.TrasladoModel.Id_Destino = '';
    }
  }

  CambiarTipo(tipo: string) {
    if (tipo == 'origen') {
      this.TipoOrigen = this.TrasladoModel.Origen;
    } else if (tipo == 'destino') {
      this.TipoDestino = this.TrasladoModel.Destino;
    }
  }


}
