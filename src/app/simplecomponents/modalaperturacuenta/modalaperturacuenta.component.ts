import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { CuentabancariaService } from '../../shared/services/cuentasbancarias/cuentabancaria.service';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { ISubscription } from 'rxjs/Subscription';
import { GeneralService } from '../../shared/services/general/general.service';
import { SwalService } from '../../shared/services/swal/swal.service';
import { MonedaService } from '../../shared/services/monedas/moneda.service';
import { ToastService } from '../../shared/services/toasty/toast.service';
import { from } from 'rxjs/observable/from';
import { l } from '@angular/core/src/render3';

@Component({
  selector: 'app-modalaperturacuenta',
  templateUrl: './modalaperturacuenta.component.html',
  styleUrls: ['./modalaperturacuenta.component.scss', '../../../style.scss']
})
export class ModalaperturacuentaComponent implements OnInit {

  @Input() AbrirModal:Observable<any> = new Observable();
  @Output() EnviarCuentasSeleccionadas:EventEmitter<any> = new EventEmitter();
  public openSubscription:any;
  
  @ViewChild('ModalAperturaCuenta') ModalAperturaCuenta:any;

  public CuentasBancarias:Array<any> = [];
  public CuentasBancariasSeleccionadas:Array<any> = [];
  public CuentasBancariasSeleccionadasId:Array<string> = [];
  public DiferencialMonedas:Array<any> = [];
  public Cargando:boolean = false;
  public MostrarBotonAjusteCuentas:boolean = false;
  private _mostrarBotonRevision:BehaviorSubject<any> = new BehaviorSubject(this.CuentasBancarias);
  private _updatedListSubscription:any;

  constructor(private _cuentaBancariaService:CuentabancariaService,
              public generalService:GeneralService,
              private _swalService:SwalService,
              private _monedaService:MonedaService,
              private _toastService:ToastService) { }

  ngOnInit() {
    this._getDiferencialMonedas();
    this._updatedListSubscription = this._mostrarBotonRevision.subscribe(list => {
      // console.log("suscripcion cuando cambia la lista");
      // console.log(list);
      for (let index = 0; index < list.length; index++) {
        let cuenta = list[index];
        if (cuenta.Seleccionada == '1') {
          if (cuenta.Correccion_Cuenta == '1') {
            this.MostrarBotonAjusteCuentas = true;
            break;
          }
        }else{
          if(index == (list.length - 1)){
            this.MostrarBotonAjusteCuentas = false;
            break;
          }
        }        
      }
    });
    this.openSubscription = this.AbrirModal.subscribe((data:any) => {
      this.GetCuentasBancariasApertura();
      this.ModalAperturaCuenta.show();
    });
  }

  public GetCuentasBancariasApertura(){
    this._cuentaBancariaService.GetCuentasBancariasApertura().subscribe((data:any) => {
      // console.log(data);
      
      if (data.codigo == 'success') {
        this.CuentasBancarias = data.query_data;
      }else{
        this.CuentasBancarias = [];
      }
    });
  }

  private _getDiferencialMonedas(){
    this._monedaService.GetMaximaDiferenciaMonedas().subscribe((data:any) => {
      // console.log(data);
      
      if (data.codigo == 'success') {
        this.DiferencialMonedas = data.query_data;
      }else{
        this.DiferencialMonedas = [];
      }
    });
  }

  public SeleccionarCuenta(seleccionada:string, cuenta:any){
    
    if (seleccionada == '0') {
      let ind = this.CuentasBancarias.findIndex(x => x.Id_Cuenta_Bancaria == cuenta.Id_Cuenta_Bancaria);    
      if (ind > -1) {
        this.CuentasBancariasSeleccionadas.push(cuenta);
        this.CuentasBancariasSeleccionadasId.push(cuenta.Id_Cuenta_Bancaria);
        this.CuentasBancarias[ind].Seleccionada = '1';
        this.CuentasBancarias[ind].Habilitar_Monto = '1';       
      }
    }else{
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
        this.CuentasBancarias[ind].Monto_Apertura = '0';
      }
    }
  }

  public GuardarAperturaCuentas(){
    if (this.MostrarBotonAjusteCuentas) {
      this._swalService.ShowMessage(['warning','Alerta','Hay cuentas que tienen diferencias con respecto a la ultima apertura, presione en el boton "Ajustar Cuentas" para información más detallada!']);
    }else{
      let data = new FormData();
      data.append('cuentas', this.generalService.normalize(JSON.stringify(this.CuentasBancariasSeleccionadasId)));
      data.append('modelo_cuentas', this.generalService.normalize(JSON.stringify(this.CuentasBancariasSeleccionadas)));
      data.append('id_funcionario', this.generalService.Funcionario.Identificacion_Funcionario);
      data.append('modulo', 'Tablero Consultor');

      this._cuentaBancariaService.AperturaCuentaBancaria(data).subscribe((d:any) => {
        // console.log(d);
        if (d.codigo == 'success') {
          this._swalService.ShowMessage(d);
          let p = {cuentas:this.CuentasBancariasSeleccionadas, id_apertura:d.id_apertura};
          this.EnviarCuentasSeleccionadas.emit(p);
          this.ModalAperturaCuenta.hide();
          this._limpiarListas();
        }else{
          this._swalService.ShowMessage(d);
        }
        
      });
    }    
  }

  private _limpiarListas(){
    this.CuentasBancarias = [];
    this.CuentasBancariasSeleccionadas = [];
    this.CuentasBancariasSeleccionadasId = [];
  }

  public CerrarModal(){
    // console.log("cerrando modal");
    
  }

  public Validardiferencia(posCuenta:number, valor:string, idMoneda:string){
    if (valor != '') {
      let valor_apertura = parseFloat(valor);
      let valor_ultimo_cierre = parseFloat(this.CuentasBancarias[posCuenta].Monto_Ultimo_Cierre);
      let diferencia = Math.abs(valor_apertura - valor_ultimo_cierre);
      
      let topes = this._getTopesMoneda(idMoneda);

      if (diferencia < topes.minimo || diferencia > topes.maximo) {
        
        let toastObj = {textos:['Alerta', 'La cuenta tiene una diferencia fuera de los limites permitidos, no podra aperturas cuentas hasta que no se corrijan los valores de la misma!'], tipo:'warning', duracion:8000};
        this._toastService.ShowToast(toastObj);
        this.CuentasBancarias[posCuenta].Correccion_Cuenta = '1';
      }else{
        this.CuentasBancarias[posCuenta].Correccion_Cuenta = '0';
      }

      setTimeout(() => {
        this._mostrarBotonRevision.next(this.CuentasBancarias);
      }, 500);
    }else{
      this.CuentasBancarias[posCuenta].Correccion_Cuenta = '0';
      
      setTimeout(() => {
        this._mostrarBotonRevision.next(this.CuentasBancarias);
      }, 500);
    }
    
    
  }

  private _getTopesMoneda(idMoneda:string){
    let moneda = this.DiferencialMonedas.find(x => x.Id_Moneda == idMoneda);
    let topes = {minimo:parseFloat(moneda.Monto_Minimo_Diferencia_Transferencia), maximo:parseFloat(moneda.Monto_Maximo_Diferencia_Transferencia)};
    
    return topes;
  }

  public CargarMovimientosAperturaAnterior(){
    // console.log("abriendo movimientos anteriores!");
    
  }

}
