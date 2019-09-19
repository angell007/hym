import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CuentabancariaService } from '../../../shared/services/cuentasbancarias/cuentabancaria.service';
import { GeneralService } from '../../../shared/services/general/general.service';
import { SwalService } from '../../../shared/services/swal/swal.service';
import { ToastService } from '../../../shared/services/toasty/toast.service';

@Component({
  selector: 'app-detallemovimientoscuenta',
  templateUrl: './detallemovimientoscuenta.component.html',
  styleUrls: ['./detallemovimientoscuenta.component.scss']
})
export class DetallemovimientoscuentaComponent implements OnInit {

  public CuentasDescuadre:Array<any> = localStorage.getItem('CuentasDescuadradas') ? JSON.parse(localStorage.getItem('CuentasDescuadradas')) : [];
  private _idCuentaActual:string = '';
  public MovimientosCuentaBancaria:Array<any> = [];
  public Movimientos:Array<any> = [];
  public DiferencialMonedas:Array<any> = [];
  public CuentasBancariasSeleccionadas:Array<any> = JSON.parse(localStorage.getItem('Cuentas_Seleccionadas'));
  public CuentasBancariasSeleccionadasId:Array<any> = [];
  public CuentasBancariasUltimaApertura:Array<any> = [];
  public Balance:number = 0;
  public Apertura:number = 0;
  public MontoAperturaConsultor:number = 0;
  public Cierre:number = 0;
  public Diferencia:number = 0;
  public Id_Ultima_Apertura:string = '0';
  public Codigo_Moneda:string = "";
  private _montoCierreCuentaActual:number = 0;
  public TituloBoton:string = 'Siguiente Cuenta';
  public CuentaBancariaModel:any = {
    Id_Cuenta_Bancaria: '',
    Nombre_Titular: '',
    Numero_Cuenta: '',
    Apodo: ''
  };

  constructor(public Router:Router,
              private _cuentaBancariaService:CuentabancariaService,
              private _generalService:GeneralService,
              private _swalService:SwalService,
              private _toastService:ToastService) 
  { 
    console.log(this.CuentasDescuadre);    
  }

  ngOnInit() {
    this.GetMovimientosCuenta();
    this.MontoAperturaConsultor = this._getMontoAperturaCuenta();
  }

  public GetMovimientosCuenta(){
    let p = {id_cuenta:this._idCuentaActual, id_funcionario:this._generalService.Funcionario.Identificacion_Funcionario};
    this._cuentaBancariaService.GetMovimientoCuentaBancariaUltimaSesion(p).subscribe((data:any) => {
      console.log(data);
      
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
      }else{
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
  
  private _getInformacionCuentaBancariaActual(){
    this._cuentaBancariaService.GetCuentaBancariaDetalle(this._idCuentaActual).subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.CuentaBancariaModel = data.query_data;
      }else{
        this._limpiarModelo();
      }
    });
  }

  private _getTopesMoneda(idMoneda:string){
    console.log(idMoneda);
    let moneda = this.DiferencialMonedas.find(x => x.Id_Moneda == idMoneda);
    console.log(moneda);
    
    let topes = {minimo:parseFloat(moneda.Monto_Minimo_Diferencia_Transferencia), maximo:parseFloat(moneda.Monto_Maximo_Diferencia_Transferencia)};
    
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
  private _validarDiferencia(valor_apertura:string, valor_cierre:number, idMoneda:string):boolean{
    let valor_a = parseFloat(valor_apertura);
    let valor_c = valor_cierre;
    let diferencia = Math.abs(valor_a - valor_c);
    
    let topes = this._getTopesMoneda(idMoneda);

    if (diferencia < -topes.maximo || diferencia > topes.maximo) {
      
      // let toastObj = {textos:['Alerta', 'La cuenta tiene una diferencia fuera de los limites permitidos, no podra aperturas cuentas hasta que no se corrijan los valores de la misma!'], tipo:'warning', duracion:8000};
      // this._toastService.ShowToast(toastObj);
      return false;
    }else{
      return true;
    }
  }

  private _setTituloBoton(){
    if (this.CuentasDescuadre.length > 0) {
      this.TituloBoton = 'Cuadrar Cuenta';
    }else{
      this.TituloBoton = 'Realizar Transferencias';
    }
  }

  public IrATransferenciasNuevas(){
    this.Router.navigate(['/tablero']);  
  }

  private _actualizarMontoCierre(){
    let data = new FormData();
    data.append('id_apertura', this.Id_Ultima_Apertura);
    data.append('monto_cierre', this.Balance.toString());
    data.append('id_cuenta', this._idCuentaActual);
    this._cuentaBancariaService.ActualizarMontoCierreCuenta(data).subscribe((response:any) => {
      let toastObj = {textos:[response.titulo, response.mensaje], tipo:response.codigo, duracion:4000};
      this._toastService.ShowToast(toastObj); 
    });
  }

  private _limpiarModelo(){
    this.CuentaBancariaModel = {
      Id_Cuenta_Bancaria: '',
      Nombre_Titular: '',
      Numero_Cuenta: '',
      Apodo: ''
    };
  }

  public GuardarAperturaCuentas(){
    let data = new FormData();
    data.append('cuentas', this._generalService.normalize(JSON.stringify(this.CuentasBancariasSeleccionadasId)));
    data.append('modelo_cuentas', this._generalService.normalize(JSON.stringify(this.CuentasBancariasSeleccionadas)));
    data.append('id_funcionario', this._generalService.Funcionario.Identificacion_Funcionario);
    data.append('id_oficina', this._generalService.SessionDataModel.idOficina);
    data.append('id_caja', this._generalService.SessionDataModel.idCaja);
    data.append('modulo', 'Tablero Consultor');

    this._cuentaBancariaService.AperturaCuentaBancaria(data).subscribe((d:any) => {
      console.log(d);
      if (d.codigo == 'success') {
        this._swalService.ShowMessage(d);
        localStorage.setItem("Apertura_Consultor", d.id_apertura);
        //let p = {cuentas:this.CuentasBancariasSeleccionadas, id_apertura:d.id_apertura};
        //this.EnviarCuentasSeleccionadas.emit(p);
        this._limpiarModelo();
        this._limpiarListas();
        setTimeout(() => {            
          this.IrATransferenciasNuevas();
        }, 300);
      }else{
        this._swalService.ShowMessage(d);
      }
      
    });  
  }
  
  public ComprobarCuadre():boolean{
    let monto_apertura_cuenta_actual = this.CuentasBancariasSeleccionadas.find(x => x.Id_Cuenta_Bancaria == this._idCuentaActual).Monto_Apertura;
    let moneda_cuenta = this.CuentasBancariasSeleccionadas.find(x => x.Id_Cuenta_Bancaria == this._idCuentaActual).Id_Moneda;    
    console.log("monto apertura de al cuenta actual:",monto_apertura_cuenta_actual);
    console.log("moneda de la cuenta:",moneda_cuenta);
    console.log(this._montoCierreCuentaActual);
    console.log(monto_apertura_cuenta_actual);
    
    return this._validarDiferencia(monto_apertura_cuenta_actual, this._montoCierreCuentaActual, moneda_cuenta);
  }

  private _limpiarListas(){
    this.CuentasDescuadre = [];
    this.CuentasBancariasSeleccionadas = [];
    this.CuentasBancariasSeleccionadasId = [];
  }

  private _getMontoAperturaCuenta(){
    let cuenta = this.CuentasBancariasSeleccionadas.find(x => x.Id_Cuenta_Bancaria == this._idCuentaActual);
    return cuenta.Monto_Apertura;
  }

}
