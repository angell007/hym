import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { CuentabancariaService } from '../../../shared/services/cuentasbancarias/cuentabancaria.service';
import { GeneralService } from '../../../shared/services/general/general.service';
import { SwalService } from '../../../shared/services/swal/swal.service';
import { MonedaService } from '../../../shared/services/monedas/moneda.service';
import { ToastService } from '../../../shared/services/toasty/toast.service';
import { ISubscription } from 'rxjs/Subscription';
import { TimerObservable } from "rxjs/observable/TimerObservable";
import { Router } from '@angular/router';

@Component({
  selector: 'app-aperturacuentasconsultor',
  templateUrl: './aperturacuentasconsultor.component.html',
  styleUrls: ['./aperturacuentasconsultor.component.scss', '../../../../style.scss']
})
export class AperturacuentasconsultorComponent implements OnInit, OnDestroy {

  @Output() MostrarTablero: EventEmitter<any> = new EventEmitter();

  private CuentasActualizadas: ISubscription;
  private Observable_Auditoria: ISubscription;

  public CuentasBancarias: Array<any> = [];
  public CuentasBancariasSeleccionadas: Array<any> = [];
  public CuentasBancariasSeleccionadasId: Array<string> = [];
  public DiferencialMonedas: Array<any> = [];
  public CuentasDescuadradas: Array<any> = [];
  public Cargando: boolean = false;
  public sgt: boolean = true;
  public MostrarBotonAjusteCuentas: boolean = false;
  private _mostrarBotonRevision: Subject<any> = new Subject();
  private _updatedListSubscription: any;
  private volver: string = localStorage.getItem('Volver_Apertura');

  constructor(private _cuentaBancariaService: CuentabancariaService,
    public generalService: GeneralService,
    private _swalService: SwalService,
    private _monedaService: MonedaService,
    private _toastService: ToastService,
    public router: Router) {
    // console.log(this.volver);

    // this.GetCuentasBancariasApertura();
    if (this.volver == 'No') {
      this.router.navigate(['/cuadrecuentas']);
    } else {
      localStorage.setItem('CuentasDescuadradas', "[]");
      localStorage.setItem("Cuentas_Seleccionadas", "[]");
    }
  }

  ngOnInit() {
    //Inicializa observables para actualizar cuentas cada segundo
    this.CuentasActualizadas = TimerObservable.create(0, 15000)
      .subscribe(() => {
        this.GetCuentasBancariasAperturaObservable();
      });

    //OBTIENE LOS VALORES MAXIMOS Y MINIMOS POR MONEDA, PERMITIDOS PARA LA COMPARACION DE MONTOS DE CADA CUENTA ANTES DE LA APERTURA
    this._getDiferencialMonedas();

    //SETEA LAS CUENTAS SELECCIONADAS DESDE LA CONSULTA DE CUENTAS DISPONIBLES
    setTimeout(() => {
      this._setCuentasSeleccionadas();
    }, 700);
    // this._updatedListSubscription = this._mostrarBotonRevision.subscribe(list => {
    //   for (let index = 0; index < list.length; index++) {
    //     let cuenta = list[index];
    //     if (cuenta.Seleccionada == '1') {
    //       if (cuenta.Correccion_Cuenta == '1') {
    //         this.MostrarBotonAjusteCuentas = true;
    //         break;
    //       }
    //     }else{
    //       if(index == (list.length - 1)){
    //         this.MostrarBotonAjusteCuentas = false;
    //         break;
    //       }
    //     }        
    //   }
    // });

    //SETEA LAS CUENTAS SELECCIONADAS DESDE LA CONSULTA DE CUENTAS DISPONIBLES
    // setTimeout(() => {      
    //   this._setCuentasSeleccionadasInicial();
    // }, 1000);
  }

  ngOnDestroy(): void {
    this.CuentasActualizadas.unsubscribe();
  }

  public GetCuentasBancariasApertura() {
    this._cuentaBancariaService.GetCuentasBancariasApertura().subscribe((data: any) => {
      // console.log(data);

      if (data.codigo == 'success') {
        this.CuentasBancarias = data.query_data;
      } else {
        this.CuentasBancarias = [];
      }
    });
  }

  public GetCuentasBancariasAperturaObservable() {
    this._cuentaBancariaService.GetCuentasBancariasAperturaObservableDev(this.generalService.Funcionario.Identificacion_Funcionario).subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.CuentasBancarias = data.query_data;
        // console.log(data.query_data);
      } else {
        this.CuentasBancarias = [];
      }
    });
  }

  public ConsultarAperturaFuncionario() {
    this._cuentaBancariaService.GetAperturaFuncionario(this.generalService.Funcionario.Identificacion_Funcionario).subscribe((data: any) => {
      // console.log(data);

      if (data.apertura_activa) {
        //OBTENER LAS CUENTAS DE LA APERTURA ACTUAL
        localStorage.setItem("Apertura_Consultor", data.query_data.Id_Consultor_Apertura_Cuenta);
        this.router.navigate(['/tablero']);
      } else {
        localStorage.setItem("Apertura_Consultor", "");
      }
    });
  }

  private _getDiferencialMonedas() {
    this._monedaService.GetMaximaDiferenciaMonedas().subscribe((data: any) => {
      // console.log(data);

      if (data.codigo == 'success') {
        this.DiferencialMonedas = data.query_data;
      } else {
        this.DiferencialMonedas = [];
      }
    });
  }

  private _setCuentasSeleccionadasInicial() {
    // console.log(this.CuentasBancarias);

    if (this.CuentasBancarias.length > 0) {
      this.CuentasBancarias.forEach(cta => {
        if (cta.Seleccionada == "1") {
          this.CuentasBancariasSeleccionadas.push(cta);
        }
      });
    }
  }










  public SeleccionarCuenta(seleccionada: string, cuenta: any) {
    console.log(seleccionada, 'seleccionada');
    console.log(cuenta, 'cuenta');
    
    if (seleccionada == '0') {

      this._cuentaBancariaService.CheckEstadoAperturaCuenta(cuenta.Id_Cuenta_Bancaria).subscribe((data: any) => {
        if (data == '1') {
          let ind = this.CuentasBancarias.findIndex(x => x.Id_Cuenta_Bancaria == cuenta.Id_Cuenta_Bancaria);
          if (ind > -1) {
            this.CuentasBancariasSeleccionadas.push(cuenta);
            this.CuentasBancariasSeleccionadasId.push(cuenta.Id_Cuenta_Bancaria);
            this.CuentasBancarias[ind].Seleccionada = '1';
            this.CuentasBancarias[ind].Habilitar_Monto = '1';

            // if (parseFloat(this.CuentasBancarias[ind].Monto_Apertura) == parseFloat(this.CuentasBancarias[ind].Monto_Ultimo_Cierre)) {
            //   this.sgt = false;
            // }
          }

          this.SeleccionarCuentaBaseDeDatos(cuenta.Id_Cuenta_Bancaria);
        } else {
          let toastObj = { textos: ['Alerta', 'La cuenta ya ha sido tomada!'], tipo: 'warning', duracion: 5000 };
          this._toastService.ShowToast(toastObj);
        }
      });
    } else {
      let eliminar = this.CuentasBancariasSeleccionadas.findIndex(x => x.Id_Cuenta_Bancaria == cuenta.Id_Cuenta_Bancaria);
      if (eliminar > -1) {
        this.CuentasBancariasSeleccionadas.splice(eliminar, 1);
      }

      let eliminar2 = this.CuentasBancariasSeleccionadasId.findIndex(x => x == cuenta.Id_Cuenta_Bancaria);
      if (eliminar2 > -1) {
        this.CuentasBancariasSeleccionadasId.splice(eliminar, 1);
      }

      let ind = this.CuentasBancarias.findIndex(x => x.Id_Cuenta_Bancaria == cuenta.Id_Cuenta_Bancaria);
      if (ind > -1) {
        this.CuentasBancarias[ind].Seleccionada = '0';
        this.CuentasBancarias[ind].Habilitar_Monto = '0';
        this.CuentasBancarias[ind].Monto_Apertura = '0'
      }

      setTimeout(() => {
        this.DeseleccionarCuentaBaseDeDatos(cuenta.Id_Cuenta_Bancaria);
      }, 500);
    }

    this._setCuentasSeleccionadasStorage(800);
  }






























  public GuardarAperturaCuentas() {
    if (this.MostrarBotonAjusteCuentas) {
      this._swalService.ShowMessage(['warning', 'Alerta', 'Hay cuentas que tienen diferencias con respecto a la ultima apertura, presione en el boton "Ajustar Cuentas" para información más detallada!']);
    } else {
      let data = new FormData();
      data.append('cuentas', this.generalService.normalize(JSON.stringify(this.CuentasBancariasSeleccionadasId)));
      data.append('modelo_cuentas', this.generalService.normalize(JSON.stringify(this.CuentasBancariasSeleccionadas)));
      data.append('id_funcionario', this.generalService.Funcionario.Identificacion_Funcionario);
      data.append('id_oficina', this.generalService.SessionDataModel.idOficina);
      data.append('id_caja', this.generalService.SessionDataModel.idCaja);
      data.append('modulo', 'Tablero Consultor');

      this._cuentaBancariaService.AperturaCuentaBancaria(data).subscribe((d: any) => {
        // console.log(d);
        if (d.codigo == 'success') {
          this._swalService.ShowMessage(d);
          localStorage.setItem("Apertura_Consultor", d.id_apertura);
          //let p = {cuentas:this.CuentasBancariasSeleccionadas, id_apertura:d.id_apertura};
          //this.EnviarCuentasSeleccionadas.emit(p);
          this._limpiarListas();
          setTimeout(() => {
            this.MostrarTablero.emit();
          }, 300);
        } else {
          this._swalService.ShowMessage(d);
        }

      });
    }
  }

  private _limpiarListas() {
    this.CuentasBancarias = [];
    this.CuentasBancariasSeleccionadas = [];
    this.CuentasBancariasSeleccionadasId = [];
  }

  public CerrarModal() {
    // console.log("cerrando modal");

  }

  public Validardiferencia(posCuenta: number, valor: string, idMoneda: string) {
    valor = valor.replace(/\./g, '');
    // console.log([posCuenta, valor, idMoneda]);

    let id_cuenta = this.CuentasBancariasSeleccionadas[posCuenta].Id_Cuenta_Bancaria;
    let p = { id_cuenta: id_cuenta };
    this._cuentaBancariaService.VerificarCuentaSinApertura(p).subscribe((response: any) => {
      // console.log(response);
      if (response == '0') {
        this.CuentasBancariasSeleccionadas[posCuenta].Correccion_Cuenta = '0';
      } else {
        if (valor != '') {
          let valor_apertura = parseFloat(valor);
          // console.log(valor_apertura);
          let valor_ultimo_cierre = parseFloat(this.CuentasBancariasSeleccionadas[posCuenta].Monto_Ultimo_Cierre);
          let diferencia = Math.abs(valor_apertura - valor_ultimo_cierre);

          let topes = this._getTopesMoneda(idMoneda);

          // console.log(topes);

          if (diferencia < -topes.maximo || diferencia > topes.maximo) {
            this._swalService.ShowMessage(['warning', 'Alerta', 'La cuenta tiene una diferencia fuera de los límites permitidos, no podra aperturar cuentas hasta que no se corrijan los valores de la misma!']);
            this.CuentasBancariasSeleccionadas[posCuenta].Diferencia = diferencia;
            this.CuentasBancariasSeleccionadas[posCuenta].Correccion_Cuenta = '1';
            this._setCuentaDescuadre(id_cuenta);
          } else {
            this._deleteCuentaDescuadre(id_cuenta);
            this.CuentasBancariasSeleccionadas[posCuenta].Correccion_Cuenta = '0';
            this.CuentasBancariasSeleccionadas[posCuenta].Diferencia = diferencia;
          }
        } else {
          this._deleteCuentaDescuadre(id_cuenta);
          this.CuentasBancariasSeleccionadas[posCuenta].Correccion_Cuenta = '0';
          this.CuentasBancariasSeleccionadas[posCuenta].Diferencia = '0';
        }
      }
    });

    this._setCuentasSeleccionadasStorage(800);
  }

  private _getTopesMoneda(idMoneda: string) {
    let moneda = this.DiferencialMonedas.find(x => x.Id_Moneda == idMoneda);
    let topes = { minimo: parseFloat(moneda.Monto_Minimo_Diferencia_Transferencia), maximo: parseFloat(moneda.Monto_Maximo_Diferencia_Transferencia) };

    return topes;
  }

  public CargarMovimientosAperturaAnterior() {
    // console.log("abriendo movimientos anteriores!");

  }

  public SeleccionarCuentaBaseDeDatos(idCuenta: string) {
    let p = { id_cuenta: idCuenta, id_funcionario: this.generalService.Funcionario.Identificacion_Funcionario };
    this._cuentaBancariaService.SeleccionarCuenta(p).subscribe();
  }

  public DeseleccionarCuentaBaseDeDatos(idCuenta: string) {
    this._cuentaBancariaService.DeseleccionarCuenta(idCuenta).subscribe();
  }

  public SiguientePaso() {
    localStorage.setItem("Volver_Apertura", "No");
    // console.log(this.CuentasDescuadradas);
    if (this.CuentasDescuadradas.length > 0) {
      this.router.navigate(['/cuadrecuentas']);
      this.CuentasActualizadas.unsubscribe();
    } else {
      this.GuardarAperturaCuentas();
      // this.router.navigate(['/tablero']);
    }
  }

  private _setCuentaDescuadre(idCuenta: string) {
    let ind = this.CuentasDescuadradas.findIndex(x => x == idCuenta);
    if (ind == -1) {
      this.CuentasDescuadradas.push(idCuenta);
      localStorage.setItem('CuentasDescuadradas', JSON.stringify(this.CuentasDescuadradas));
    }
  }

  private _deleteCuentaDescuadre(idCuenta: string) {
    let ind = this.CuentasDescuadradas.findIndex(x => x == idCuenta);
    if (ind > -1) {
      this.CuentasDescuadradas.splice(ind);
      localStorage.setItem('CuentasDescuadradas', JSON.stringify(this.CuentasDescuadradas));
    }
  }

  private _setCuentasDescuadreLista() {
    if (this.CuentasBancariasSeleccionadas.length > 0) {
      this.CuentasBancariasSeleccionadas.forEach(cta => {
        if (cta.Seleccionada == '1') {
          this._setCuentaDescuadre(cta.Id_Cuenta_Bancaria);
        } else {
          this._deleteCuentaDescuadre(cta.Id_Cuenta_Bancaria);
        }
      });
    } else {
      localStorage.setItem('CuentasDescuadradas', "[]");
    }

  }

  private _setCuentasSeleccionadasStorage(time: number) {
    // console.log(this.CuentasBancariasSeleccionadas);

    setTimeout(() => {
      localStorage.setItem("Cuentas_Seleccionadas", JSON.stringify(this.CuentasBancariasSeleccionadas));
    }, time);
  }

  private _setCuentasSeleccionadas() {
    if (this.CuentasBancarias.length > 0) {
      this.CuentasBancarias.forEach(cta => {
        if (cta.Seleccionada == '1') {
          this.CuentasBancariasSeleccionadas.push(cta);
          this.CuentasBancariasSeleccionadasId.push(cta.Id_Cuenta_Bancaria);
        } else {
          this._deleteCuentaDescuadre(cta.Id_Cuenta_Bancaria);
        }
      });
    } else {
      this.CuentasBancariasSeleccionadas = [];
      this.CuentasBancariasSeleccionadasId = [];
    }

    this._setCuentasSeleccionadasStorage(800);
  }

}
