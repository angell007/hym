import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CuentabancariaService } from '../../../shared/services/cuentasbancarias/cuentabancaria.service';
import { GeneralService } from '../../../shared/services/general/general.service';
import { SwalService } from '../../../shared/services/swal/swal.service';
import { MonedaService } from '../../../shared/services/monedas/moneda.service';
import { ToastService } from '../../../shared/services/toasty/toast.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';

@Component({
  selector: 'app-cuadrecuentasconsultor',
  templateUrl: './cuadrecuentasconsultor.component.html',
  styleUrls: ['./cuadrecuentasconsultor.component.scss', '../../../../style.scss']
})
export class CuadrecuentasconsultorComponent implements OnInit {

  public AbrirModalDevolucion: Subject<any> = new Subject();
  public AbrirModalCompra: Subject<any> = new Subject();
  public AbrirModalMoverTransferencia: Subject<any> = new Subject();
  public AbrirModalDetalle: Subject<any> = new Subject();
  public AbrirModalAjuste: Subject<any> = new Subject();

  public CuentasDescuadre: Array<any> = localStorage.getItem('CuentasDescuadradas') ? JSON.parse(localStorage.getItem('CuentasDescuadradas')) : [];
  private _idCuentaActual: string = '';
  public MovimientosCuentaBancaria: Array<any> = [];
  public Movimientos: Array<any> = [];
  public DiferencialMonedas: Array<any> = [];
  public CuentasBancariasSeleccionadas: Array<any> = JSON.parse(localStorage.getItem('Cuentas_Seleccionadas'));
  public CuentasBancariasSeleccionadasId: Array<any> = [];
  public CuentasBancariasUltimaApertura: Array<any> = [];
  public Balance: number = 0;
  public Apertura: number = 0;
  public MontoAperturaConsultor: number = 0;
  public Cierre: number = 0;
  public Diferencia: number = 0;
  public Id_Ultima_Apertura: string = '0';
  public Codigo_Moneda: string = "";
  private _montoCierreCuentaActual: number = 0;
  public TituloBoton: string = 'Siguiente Cuenta';
  public CuentaBancariaModel: any = {
    Id_Cuenta_Bancaria: '',
    Nombre_Titular: '',
    Numero_Cuenta: '',
    Apodo: ''
  };

  constructor(public Router: Router,
    private http: HttpClient,
    public globales: Globales,
    private _cuentaBancariaService: CuentabancariaService,
    private _generalService: GeneralService,
    private _swalService: SwalService,
    private _monedaService: MonedaService,
    private _toastService: ToastService) {
    // console.log(this.CuentasDescuadre);
  }

  ngOnInit() {
    this._getDiferencialMonedas();
    this._checkCuentasDescuadradas();
    this._fillArrayIdsSelectedAccounts();
    this.MontoAperturaConsultor = this._getMontoAperturaCuenta();
  }

  private _checkCuentasDescuadradas(guardarApertura: boolean = false) {
    if (this.CuentasDescuadre.length == 0) {
      if (guardarApertura) {
        this.GuardarAperturaCuentas();
      }
      this.Router.navigate(['/tablero']);
    } else {
      this._idCuentaActual = this.CuentasDescuadre[0];
      // console.log(this._idCuentaActual);

      this.GetMovimientosCuentaDescuadre();
      this._getInformacionCuentaBancariaActual();
    }
  }

  public GetMovimientosCuentaDescuadre() {
    let p = { id_cuenta: this._idCuentaActual, id_funcionario: this._generalService.Funcionario.Identificacion_Funcionario };
    this._cuentaBancariaService.GetMovimientoCuentaBancariaUltimaSesion(p).subscribe((data: any) => {

      if (data.codigo == 'success') {
        this.MovimientosCuentaBancaria = data.query_data;
        this.Movimientos = data.query_data.movimientos;
        this.Balance = parseInt(data.query_data.balance);
        this.Apertura = parseInt(data.query_data.monto_apertura);
        this.Cierre = parseInt(data.query_data.monto_cierre);
        this.Codigo_Moneda = data.query_data.codigo_moneda;
        this.Diferencia = this.MontoAperturaConsultor - this.Balance;
        this.CuentasBancariasUltimaApertura = data.cuentas_ultima_apertura;
        this._montoCierreCuentaActual = parseInt(data.query_data.balance);
        this.Id_Ultima_Apertura = data.id_ultima_apertura_cuenta;
      } else {
        this.MovimientosCuentaBancaria = [];
        this.Movimientos = [];
        this.Balance = 0;
        this.Apertura = 0;
        this.Cierre = 0;
        this.Codigo_Moneda = '';
        this.Diferencia = 0;
        this.CuentasBancariasUltimaApertura = [];
        this._montoCierreCuentaActual = 0;
        this.Id_Ultima_Apertura = '';
      }
    });
  }

  private _getInformacionCuentaBancariaActual() {
    this._cuentaBancariaService.GetCuentaBancariaDetalle(this._idCuentaActual).subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.CuentaBancariaModel = data.query_data;
      } else {
        this._limpiarModelo();
      }
    });
  }

  private _getDiferencialMonedas() {
    this._monedaService.GetMaximaDiferenciaMonedas().subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.DiferencialMonedas = data.query_data;
      } else {
        this.DiferencialMonedas = [];
      }
    });
  }

  private _getTopesMoneda(idMoneda: string) {
    let moneda = this.DiferencialMonedas.find(x => x.Id_Moneda == idMoneda);
    let topes = { minimo: parseFloat(moneda.Monto_Minimo_Diferencia_Transferencia), maximo: parseFloat(moneda.Monto_Maximo_Diferencia_Transferencia) };
    return topes;
  }

  /**
   * 
   * @param valor_apertura 
   * @param valor_cierre 
   * @param idMoneda 
   * 
   * COMPRUEBA SI LA DIFERENCIA ENTRE EL MONTO DE APERTURA DE LA CUENTA Y EL MONTO DE CIERRE ACTUALIZADO TIENE UNA DIFERENCIA FUERA DE LOS LIMITES ESTABLECIDOS EN EL SISTEMA
   * DEVUELVE FALSE SI LA DIFERENCIA ESTA FUERA DE LOS LIMITES, EN CASO CONTRARIO DEVUELVE TRUE
   */
  private _validarDiferencia(valor_apertura: string, valor_cierre: number, idMoneda: string): boolean {
    let valor_a = parseFloat(valor_apertura);
    let valor_c = valor_cierre;
    let diferencia = Math.abs(valor_a - valor_c);

    let topes = this._getTopesMoneda(idMoneda);

    if (diferencia < -topes.maximo || diferencia > topes.maximo) {
      this._swalService.ShowMessage(['warning', 'Alerta', 'La cuenta tiene una diferencia fuera de los limites permitidos, no podra aperturas cuentas hasta que no se corrijan los valores de la misma']);

      // let toastObj = {textos:['Alerta', 'La cuenta tiene una diferencia fuera de los limites permitidos, no podra aperturas cuentas hasta que no se corrijan los valores de la misma!'], tipo:'warning', duracion:8000};
      // this._toastService.ShowToast(toastObj);
      return false;
    } else {
      return true;
    }
  }

  private _setTituloBoton() {
    if (this.CuentasDescuadre.length > 0) {
      this.TituloBoton = 'Cuadrar Cuenta';
    } else {
      this.TituloBoton = 'Realizar Transferencias';
    }
  }

  public Siguiente() {
    if (!this.ComprobarCuadre()) {
      this._swalService.ShowMessage(['warning', 'Alerta', 'La cuenta tiene una diferencia fuera de los limites permitidos, no podra proseguir sin antes cuadrar la cuenta!!']);
    } else {
      this._actualizarMontoCierre();
      let ind_cuenta = this.CuentasDescuadre.findIndex(x => x == this._idCuentaActual);
      this.CuentasDescuadre.splice(ind_cuenta);
      this._checkCuentasDescuadradas(true);
    }
  }

  public IrATransferenciasNuevas() {
    this.Router.navigate(['/tablero']);
  }

  private _actualizarMontoCierre() {
    let data = new FormData();
    data.append('id_apertura', this.Id_Ultima_Apertura);
    data.append('monto_cierre', this.Balance.toString());
    data.append('id_cuenta', this._idCuentaActual);
    this._cuentaBancariaService.ActualizarMontoCierreCuenta(data).subscribe((response: any) => {
      this._swalService.ShowMessage(['success', 'Exito', 'Operacion realizada correctamente']);
    });
  }

  private _limpiarModelo() {
    this.CuentaBancariaModel = {
      Id_Cuenta_Bancaria: '',
      Nombre_Titular: '',
      Numero_Cuenta: '',
      Apodo: ''
    };
  }

  public GuardarAperturaCuentas() {
    let data = new FormData();
    data.append('cuentas', this._generalService.normalize(JSON.stringify(this.CuentasBancariasSeleccionadasId)));
    data.append('modelo_cuentas', this._generalService.normalize(JSON.stringify(this.CuentasBancariasSeleccionadas)));
    data.append('id_funcionario', this._generalService.Funcionario.Identificacion_Funcionario);
    data.append('id_oficina', this._generalService.SessionDataModel.idOficina);
    data.append('id_caja', this._generalService.SessionDataModel.idCaja);
    data.append('modulo', 'Tablero Consultor');

    this._cuentaBancariaService.AperturaCuentaBancaria(data).subscribe((d: any) => {
      if (d.codigo == 'success') {
        this._swalService.ShowMessage(d);
        localStorage.setItem("Apertura_Consultor", d.id_apertura);
        this._limpiarModelo();
        this._limpiarListas();
        setTimeout(() => {
          this.IrATransferenciasNuevas();
        }, 300);
      } else {
        this._swalService.ShowMessage(d);
      }

    });
  }

  public ComprobarCuadre(): boolean {
    let monto_apertura_cuenta_actual = this.CuentasBancariasSeleccionadas.find(x => x.Id_Cuenta_Bancaria == this._idCuentaActual).Monto_Apertura;
    let moneda_cuenta = this.CuentasBancariasSeleccionadas.find(x => x.Id_Cuenta_Bancaria == this._idCuentaActual).Id_Moneda;
    return this._validarDiferencia(monto_apertura_cuenta_actual, this._montoCierreCuentaActual, moneda_cuenta);
  }

  private _fillArrayIdsSelectedAccounts() {
    this.CuentasBancariasSeleccionadas.forEach(cta => {
      this.CuentasBancariasSeleccionadasId.push(cta.Id_Cuenta_Bancaria);
    });
  }

  private _limpiarListas() {
    this.CuentasDescuadre = [];
    this.CuentasBancariasSeleccionadas = [];
    this.CuentasBancariasSeleccionadasId = [];
  }

  private _getMontoCierre() {
    this._cuentaBancariaService.GetMontoCierreCuenta(this._idCuentaActual).subscribe((data: any) => {
      this._montoCierreCuentaActual = typeof (data) == 'string' ? parseFloat(data) : data;
    });
  }

  private _getMontoAperturaCuenta() {
    let cuenta = this.CuentasBancariasSeleccionadas.find(x => x.Id_Cuenta_Bancaria == this._idCuentaActual);
    return cuenta.Monto_Apertura;
  }

  public AbrirCompraCuenta() {
    let p = { id_cuenta: this._idCuentaActual, id_funcionario: this._generalService.Funcionario.Identificacion_Funcionario, id_apertura: this.Id_Ultima_Apertura };
    this.AbrirModalCompra.next(p);
  }

  public showAjuste(ajuste: any) {
    // console.log(ajuste);
    // let p = { id_cuenta_origen: this._idCuentaActual, id_pago_transferencia: ajuste.Id_Pago_Transfenecia, id_transferencia_destinatario: ajuste.Id_Transferencia_Destino, numero_transferencia: ajuste.Numero_Transferencia, recibo: ajuste.Recibo, valor: ajuste.Egreso, codigo_moneda: this.Codigo_Moneda, cuentas_ultima_apertura: this.CuentasBancariasUltimaApertura };
    this.AbrirModalDetalle.next(ajuste);
  }

  public deleteAjuste(ajuste: any) {
    // delete-movimiento
    this.http.post(this.globales.rutaNueva + 'delete-movimiento', { mov: ajuste }).subscribe((data) => {

      console.log('data', data);

      this._getDiferencialMonedas();
      this._checkCuentasDescuadradas();
      this._fillArrayIdsSelectedAccounts();
      this.MontoAperturaConsultor = this._getMontoAperturaCuenta();

    });
    // console.log(ajuste);
    // let p = { codigo_moneda: ajuste.Codigo_Moneda, transferencia: ajuste, id_apertura: this.Id_Ultima_Apertura };
    // this.AbrirModalDevolucion.next(p);
  }

  public Ajustar() {
    let p = { id_cuenta: this._idCuentaActual, codigo_moneda: this.Codigo_Moneda, id_apertura: this.Id_Ultima_Apertura };
    this.AbrirModalAjuste.next(p);
  }

}
