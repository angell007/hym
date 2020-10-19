import { Component, OnInit, Input, OnDestroy, EventEmitter, Output, ViewChild } from '@angular/core';
import { CorresponsalDiarioModel } from '../../../Modelos/CorresponsalDiarioModel';
import { CorresponsalDiarioShortModel } from '../../../Modelos/CorresponsalDiarioShortModel';
import { GeneralService } from '../../../shared/services/general/general.service';
import { SwalService } from '../../../shared/services/swal/swal.service';
import { ValidacionService } from '../../../shared/services/validaciones/validacion.service';
import { ToastService } from '../../../shared/services/toasty/toast.service';
import { CorresponsalbancarioService } from '../../../shared/services/corresponsalesbancarios/corresponsalbancario.service';
import { Observable } from 'rxjs';
import { AccionTableroCajero } from '../../../shared/Enums/AccionTableroCajero';
import { MonedaService } from '../../../shared/services/monedas/moneda.service';

@Component({
  selector: 'app-corresponsalesbancarioscajero',
  templateUrl: './corresponsalesbancarioscajero.component.html',
  styleUrls: ['./corresponsalesbancarioscajero.component.scss', '../../../../style.scss']
})
export class CorresponsalesbancarioscajeroComponent implements OnInit, OnDestroy {
  @ViewChild('alertSwal') alertSwal: any;
  @Input() ManageView: Observable<any> = new Observable();
  @Output() ActualizarRegistrosCorresponsal: EventEmitter<any> = new EventEmitter();
  @Output() RegresarTablaRegistros: EventEmitter<any> = new EventEmitter();

  public CorresponsalModel: CorresponsalDiarioShortModel = new CorresponsalDiarioShortModel();
  public CorresponsalesBancarios: Array<any> = [];
  private _viewManagementSubscription: any;
  public monedaPeso: Array<any> = [];

  //MOSTRAR ALERTAS DESDE LA INSTANCIA DEL SWEET ALERT GLOBAL
  ShowSwal({ tipo, titulo, msg }: { tipo: string; titulo: string; msg: string; }) {
    this.alertSwal.type = tipo;
    this.alertSwal.title = titulo;
    this.alertSwal.text = msg;
    this.alertSwal.show();
  }

  constructor(private _generalService: GeneralService,
    private _swalService: SwalService,
    private swalService: SwalService,
    private _monedaService: MonedaService,
    private _validacionService: ValidacionService,
    private _toastService: ToastService,
    private _corresponsalService: CorresponsalbancarioService) {
    this.settearMoneda()
    this.GetCorresponsalesBancarios();
  }

  ngOnInit() {
    this.settearMoneda()
    this._viewManagementSubscription = this.ManageView.subscribe((data: AccionTableroCajero) => {
      if (data == AccionTableroCajero.Cerrar) {
        // console.log(data);
        this.LimpiarModeloCorresponsal();
      }
    });
  }

  ngOnDestroy(): void {
    if (this._viewManagementSubscription != null) {
      this._viewManagementSubscription.unsubscribe();
    }
  }

  GetCorresponsalesBancarios() {
    this._corresponsalService.getCorresponsales().subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.CorresponsalesBancarios = data.query_data;
      } else {

        this.CorresponsalesBancarios = [];
        let toastObj = { textos: [data.titulo, data.mensaje], tipo: data.codigo, duracion: 4000 };
        this._toastService.ShowToast(toastObj);
      }
    });
  }

  public CalcularTotalCorresponsal() {
    let consignaciones = this.CorresponsalModel.Consignacion != '' ? parseFloat(this.CorresponsalModel.Consignacion) : 0;
    let retiro = this.CorresponsalModel.Retiro != '' ? parseFloat(this.CorresponsalModel.Retiro) : 0;

    // if (consignaciones == 0 || retiro == 0) {
    //   this.CorresponsalModel.Total_Corresponsal = '0';
    // } else {
    this.CorresponsalModel.Total_Corresponsal = (consignaciones - retiro).toString();
    // }
  }

  async settearMoneda() {
    await this.GetMonedas().then((monedas) => {
      this.monedaPeso = monedas.filter((moneda: any) => {
        return moneda.Nombre == 'Pesos'
      })
    })
    this.monedaPeso = await Object.assign({}, this.monedaPeso[0])
  }

  public GuardarCorresponsalDiario() {
    this.CorresponsalModel.Identificacion_Funcionario = this._generalService.SessionDataModel.funcionarioData.Identificacion_Funcionario;
    this.CorresponsalModel.Id_Caja = this._generalService.SessionDataModel.idCaja;
    this.CorresponsalModel.Id_Oficina = this._generalService.SessionDataModel.idOficina;
    this.CorresponsalModel.Fecha = this._generalService.FechaActual;
    this.CorresponsalModel.Hora = this._generalService.HoraActual;



    // Custom pesos  
    this.GetMonedas().then((monedas) => {
      this.monedaPeso = monedas.filter((moneda: any) => {
        return moneda.Nombre == 'Pesos'
      })

      this.CorresponsalModel.Id_Moneda = this.monedaPeso[0]['Id_Moneda'];
      let info = this._generalService.normalize(JSON.stringify(this.CorresponsalModel));

      let datos = new FormData();
      datos.append("modulo", 'Corresponsal_Diario');
      datos.append("modelo", info);

      this._corresponsalService.saveCorresponsalDiario(datos).subscribe(data => {
        if (data.codigo == 'success') {
          this.LimpiarModeloCorresponsal();
          this.ActualizarRegistrosCorresponsal.emit(null);
          this.RegresarTablaRegistros.emit();
          this.swalService.ShowMessage(['success', 'Registro Exitoso', 'Operacion sealizada exitosamente!']);

        } else {
          this._swalService.ShowMessage(data);
        }
      });

    }).catch((err) => {
      // console.log(err);
    });


  }


  // Custom pesos 
  async GetMonedas() {
    return await this._monedaService.getMonedas().pipe().toPromise().then((data: any) => {
      if (data.codigo == 'success') {
        return data.query_data;
      } else {
        return [];
      }
    });
  }

  private ValidateBeforeSubmit() {
  }

  private LimpiarModeloCorresponsal() {
    this.CorresponsalModel = new CorresponsalDiarioShortModel();
  }

  public VolverTablaRegistros() {
    this.ActualizarRegistrosCorresponsal.emit();
    this.RegresarTablaRegistros.emit();
    this.LimpiarModeloCorresponsal();
  }

}
