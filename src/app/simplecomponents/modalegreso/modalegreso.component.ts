//modalegreso
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
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../shared/globales/globales';
import { debounceTime, distinctUntilChanged, map, switchMap, delay } from 'rxjs/operators';

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
  public booleancuentas: boolean;
  public potencial: any = [];
  public cupo: any;
  public verCupo: boolean = false;
  public titular: string;

  public EgresoModel: EgresoModel = new EgresoModel();

  ShowSwal(tipo: string, titulo: string, msg: string, confirmCallback = null, cancelCallback = null) {
    this.alertSwal.type = tipo;
    this.alertSwal.title = titulo;
    this.alertSwal.text = msg;
    this.alertSwal.show();
  }
  @ViewChild('alertSwal') alertSwal: any;
  @ViewChild('selectCustomClient') selectCustomClient: any;
  @ViewChild('selectCustomFormaPago') selectCustomFormaPago: any;

  constructor(
    private http: HttpClient,
    private _generalService: GeneralService,
    private _swalService: SwalService,
    private _validacionService: ValidacionService,
    private _EgresoService: EgresoService,
    private _monedaService: MonedaService,
    private _normalizeService: NormailizerService,
    private _consolidadoService: ConsolidadosService,
    public globales: Globales,

  ) {
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

  search_destino3 = (text$: Observable<string>) => text$.pipe(distinctUntilChanged(),
    switchMap(term => term.length < 2 ? [] : this.http.get(this.globales.rutaNueva + 'terceros-filter',
      { params: { id_destinatario: term, tipo: this.selectCustomClient.nativeElement.value } })
      .map((response) => {

        if (this.selectCustomClient.nativeElement.value == 'Cuentas') {
          this.titular == response['Nombre_Titular']
        }
        return response;
      }).do((data) => {
        return data
      })));

  formatterModel = (x: { Nombre: string }) => x.Nombre;


  GetMonedas() {
    this._monedaService.getMonedas().subscribe((data: any) => {
      this.Monedas = data;
      let monedaDefault: any[] = this.Monedas.filter((x: any) => {
        return x.Nombre == 'Pesos'
      })
      this.EgresoModel.Id_Moneda = monedaDefault[0]['Id_Moneda'];
    });
  }

  ngOnDestroy() {
    if (this.openSubscription != undefined) {
      this.openSubscription.unsubscribe();
    }

    this.CerrarModal();
  }

  GuardarEgreso() {

    if( !this.EgresoModel['Id_Tercero'] ||  typeof this.EgresoModel['Id_Tercero'] == undefined ){
      this._swalService.ShowMessage(['error', 'Error', 'El cliente digitado no se ha encontrado en el sistema.']);
      return 
    }
    
    this.EgresoModel['formaPago'] = this.selectCustomFormaPago.nativeElement.value;
    if (!this.ValidateBeforeSubmit()) {
      return;
    }


    this._consolidadoService.TotalRestaIngresosEgresos.forEach(element => {
      if (this.EgresoModel.Id_Moneda == element.id) {
        if (parseFloat(element.saldo) < parseFloat(this.EgresoModel.Valor)) {
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

    //****************************************************************************************************** */

    if (this.Editar) {
      this._EgresoService.editEgreso(datos)
        .catch(error => {
          // console.log('An error occurred:', error);
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

            this.EgresoModel.Id_Tercero = '';

            this.CerrarModal();

            this.ShowSwal('success', 'Éxito', 'Operacion realizada correctamente!');
          } else {
            this.ShowSwal('warning', 'Alerta', 'Ha ocurrido un error!');
          }
        });
    }
  }

  ValidateBeforeSubmit(): boolean {

    if (!this._validacionService.validateNumber(this.EgresoModel.Id_Moneda, 'Moneda')) {
      return false;
    } else if (!this._validacionService.validateNumber(this.EgresoModel.Valor, 'Valor')) {
      return false;
    } else {
      return true;
    }
  }

  getData() {
    this.EgresoModel.Id_Tercero = this.potencial['Id_Tercero'];
    // this.verCupo = false;
    // if (this.selectCustomFormaPago.nativeElement.value == 'credito') {
    //   this.cupo = this.potencial['Cupo'];
    //   this.verCupo = true;
    // }
  }

  calcularEgreso() {
    // if (this.selectCustomFormaPago.nativeElement.value == 'credito') {
    // if (this.potencial['Cupo'] < this.EgresoModel.Valor) {
    //   this.ShowSwal('warning', 'Alerta', 'Operacion No puede ser realizada!');
    //   this.EgresoModel.Valor = '';
    // };
    // }
  }

  limpiarImputCliente() {
    this.EgresoModel.Id_Tercero = '';
    this.cupo = ''
    this.verCupo = false
    this.booleancuentas = false;
    if (this.selectCustomClient.nativeElement.value == 'Cuentas') {
      this.booleancuentas = true;

    }
  }
  handleError(error: Response) {
    return Observable.throw(error);
  }
  CerrarModal() {
    // this.selectCustomFormaPago.nativeElement.value = 'efectivo'
    this.selectCustomClient.nativeElement.value = 'Cliente'
    this.limpiarImputCliente()
    this.LimpiarModelo();
    this.potencial = ''
    this.ModalEgreso.hide();
  }

  limpiarCampos() {
    // if (this.selectCustomFormaPago.nativeElement.value == 'efectivo') {
    this.verCupo = false
    // } else {
    // 
    // }
  }

  LimpiarModelo() {
    this.EgresoModel = new EgresoModel();
  }
}
