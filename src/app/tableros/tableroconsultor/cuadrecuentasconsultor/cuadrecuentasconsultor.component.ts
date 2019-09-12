import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CuentabancariaService } from '../../../shared/services/cuentasbancarias/cuentabancaria.service';

@Component({
  selector: 'app-cuadrecuentasconsultor',
  templateUrl: './cuadrecuentasconsultor.component.html',
  styleUrls: ['./cuadrecuentasconsultor.component.scss']
})
export class CuadrecuentasconsultorComponent implements OnInit {

  public CuentasDescuadre:Array<any> = JSON.parse(localStorage.getItem('CuentasDescuadradas'));
  private _idCuentaActual:string = '';
  public MovimientosCuentaBancaria:Array<any> = [];
  public Movimientos:Array<any> = [];
  public Balance:string = "0";

  constructor(public Router:Router,
              private _cuentaBancariaService:CuentabancariaService) 
  { 
    console.log(this.CuentasDescuadre);    
  }

  ngOnInit() {
    this._checkCuentasDescuadradas();
  }

  private _checkCuentasDescuadradas(){
    if (this.CuentasDescuadre.length == 0) {
      this.Router.navigate(['/tablero']);
    }else{
      this._idCuentaActual = this.CuentasDescuadre[0];
      this._getInformacionCuentaDescuadre();
    }
  }

  private _getInformacionCuentaDescuadre(){
    this._cuentaBancariaService.GetMovimientoCuentaBancariaUltimaSesion(this._idCuentaActual).subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.MovimientosCuentaBancaria = data.query_data;
        this.Movimientos = data.query_data.movimientos;
      }else{
        this.MovimientosCuentaBancaria = [];
        this.Movimientos = [];
      }
    });
  }

}
