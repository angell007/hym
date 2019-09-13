import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CuentabancariaService } from '../../../shared/services/cuentasbancarias/cuentabancaria.service';
import { GeneralService } from '../../../shared/services/general/general.service';
import { SwalService } from '../../../shared/services/swal/swal.service';
import { MonedaService } from '../../../shared/services/monedas/moneda.service';
import { ToastService } from '../../../shared/services/toasty/toast.service';

@Component({
  selector: 'app-cuadrecuentasconsultor',
  templateUrl: './cuadrecuentasconsultor.component.html',
  styleUrls: ['./cuadrecuentasconsultor.component.scss', '../../../../style.scss']
})
export class CuadrecuentasconsultorComponent implements OnInit {

  public CuentasDescuadre:Array<any> = localStorage.getItem('CuentasDescuadradas') ? JSON.parse(localStorage.getItem('CuentasDescuadradas')) : [];
  private _idCuentaActual:string = '';
  public MovimientosCuentaBancaria:Array<any> = [];
  public Movimientos:Array<any> = [];
  public DiferencialMonedas:Array<any> = [];
  public CuentasBancariasSeleccionadas:Array<any> = JSON.parse(localStorage.getItem('Cuentas_Seleccionadas'));
  public CuentasBancariasSeleccionadasId:Array<any> = [];
  public Balance:string = "0";
  private _montoCerreCuentaActual:number = 0;
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
              private _monedaService:MonedaService,
              private _toastService:ToastService) 
  { 
    console.log(this.CuentasDescuadre);    
  }

  ngOnInit() {
    this._checkCuentasDescuadradas();
    this._fillArrayIdsSelectedAccounts();
  }

  private _checkCuentasDescuadradas(guardarApertura:boolean = false){
    if (this.CuentasDescuadre.length == 0) {
      if (guardarApertura) {
        this.GuardarAperturaCuentas();
      }
      this.Router.navigate(['/tablero']);
    }else{
      this._idCuentaActual = this.CuentasDescuadre[0];
      console.log(this._idCuentaActual);
      
      this._getMovimientosCuentaDescuadre();
      this._getInformacionCuentaBancariaActual();
    }
  }

  private _getMovimientosCuentaDescuadre(){
    this._cuentaBancariaService.GetMovimientoCuentaBancariaUltimaSesion(this._idCuentaActual).subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.MovimientosCuentaBancaria = data.query_data;
        this.Movimientos = data.query_data.movimientos;
        this.Balance = data.query_data.balance;
      }else{
        this.MovimientosCuentaBancaria = [];
        this.Movimientos = [];
        this.Balance = '0';
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

  private _getDiferencialMonedas(){
    this._monedaService.GetMaximaDiferenciaMonedas().subscribe((data:any) => {      
      if (data.codigo == 'success') {
        this.DiferencialMonedas = data.query_data;
      }else{
        this.DiferencialMonedas = [];
      }
    });
  }

  private _getTopesMoneda(idMoneda:string){
    let moneda = this.DiferencialMonedas.find(x => x.Id_Moneda == idMoneda);
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

    if (diferencia < topes.minimo || diferencia > topes.maximo) {
      
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

  public Siguiente(){
    console.log("Tiene pendiente "+(this.CuentasDescuadre.length-1)+" por cuadrar!");
    if(!this.ComprobarCuadre()){
      let toastObj = {textos:['Alerta', 'La cuenta tiene una diferencia fuera de los limites permitidos, no podra proseguir sin antes cuadrar la cuenta!'], tipo:'warning', duracion:8000};
      this._toastService.ShowToast(toastObj)
    }else{
      let ind_cuenta = this.CuentasDescuadre.findIndex(x => x == this._idCuentaActual);
      this.CuentasDescuadre.splice(ind_cuenta);
      this._checkCuentasDescuadradas(true);
    }    
  }

  public IrATransferenciasNuevas(){
    this.Router.navigate(['/tablero']);  
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
    
    return this._validarDiferencia(monto_apertura_cuenta_actual, this._montoCerreCuentaActual, moneda_cuenta);
  }

  private _fillArrayIdsSelectedAccounts(){
    this.CuentasBancariasSeleccionadas.forEach(cta => {
      this.CuentasBancariasSeleccionadasId.push(cta.Id_Cuenta_Bancaria);
    });
  }

  private _limpiarListas(){
    this.CuentasDescuadre = [];
    this.CuentasBancariasSeleccionadas = [];
    this.CuentasBancariasSeleccionadasId = [];
  }

  private _getMontoCierre(){
    this._cuentaBancariaService.GetMontoCierreCuenta(this._idCuentaActual).subscribe((data:any) => {
      console.log(data);
      this._montoCerreCuentaActual = typeof(data) == 'string' ? parseFloat(data) : data;
    });
  }

}
