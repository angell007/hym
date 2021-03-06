import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CuentabancariaService } from '../../../shared/services/cuentasbancarias/cuentabancaria.service';
import { GeneralService } from '../../../shared/services/general/general.service';
import { SwalService } from '../../../shared/services/swal/swal.service';
import { ToastService } from '../../../shared/services/toasty/toast.service';
import { WebnavigationService } from '../../../shared/services/navegacionweb/webnavigation.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-detallemovimientoscuenta',
  templateUrl: './detallemovimientoscuenta.component.html',
  styleUrls: ['./detallemovimientoscuenta.component.scss', '../../../../style.scss']
})
export class DetallemovimientoscuentaComponent implements OnInit {

  public AbrirModalAjuste:Subject<any> = new Subject();
  public AbrirModalCompra:Subject<any> = new Subject();

  private _idCuentaActual:string = '';
  public MovimientosCuentaBancaria:Array<any> = [];
  public Movimientos:Array<any> = [];
  public Balance:number = 0;
  public Apertura:number = 0;
  public Codigo_Moneda:string = "";
  public CuentaBancariaModel:any = {
    Id_Cuenta_Bancaria: '',
    Nombre_Titular: '',
    Numero_Cuenta: '',
    Apodo: ''
  };

  public Accion:string = '';
  public Id_Apertura:string = localStorage.getItem('Apertura_Consultor');

  constructor(private _router:Router,
              private _activeRoute:ActivatedRoute,
              private _cuentaBancariaService:CuentabancariaService,
              private _generalService:GeneralService,
              private _swalService:SwalService,
              private _toastService:ToastService,
              private _webNavigacionService:WebnavigationService) 
  { 
    this._idCuentaActual =  this._activeRoute.snapshot.params["id_cuenta"];
    this.Accion = this._activeRoute.snapshot.params['accion'];
  }

  ngOnInit() {
    this.GetMovimientosCuenta();
    this._getInformacionCuentaBancariaActual();
  }

  public GetMovimientosCuenta(){
    let p = {id_cuenta:this._idCuentaActual, id_funcionario:this._generalService.Funcionario.Identificacion_Funcionario};
    this._cuentaBancariaService.GetMovimientoCuentaBancariaUltimaSesion(p).subscribe((data:any) => {
      
      if (data.codigo == 'success') {
        this.MovimientosCuentaBancaria = data.query_data;
        this.Movimientos = data.query_data.movimientos;
        this.Balance = parseInt(data.query_data.balance);
        this.Codigo_Moneda = data.codigo_moneda;
        this.Apertura = parseInt(data.query_data.monto_apertura);
      }else{
        this.MovimientosCuentaBancaria = [];
        this.Movimientos = [];
        this.Balance = 0;
        this.Apertura = 0;
        this.Codigo_Moneda = data.codigo_moneda;     
        let toastObj = {textos:[data.titulo, data.mensaje], tipo:data.codigo, duracion:6000};
        this._toastService.ShowToast(toastObj);
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

  public VolverAlCierre(){
    // if (this.Accion == 'Ajustar') {
      
    // }
    // this._router.navigate(['/cierrecuentasconsultor', this._generalService.Funcionario.Identificacion_Funcionario]);
    this._webNavigacionService.GoBackBrowser();
  }

  private _limpiarModelo(){
    this.CuentaBancariaModel = {
      Id_Cuenta_Bancaria: '',
      Nombre_Titular: '',
      Numero_Cuenta: '',
      Apodo: ''
    };
  }

  public Ajustar(){
    let p = {id_cuenta:this._idCuentaActual, codigo_moneda:this.Codigo_Moneda, id_apertura:''};
    this.AbrirModalAjuste.next(p);
  }
  
  public CompraCuenta(){
    let p = {id_cuenta:this._idCuentaActual, id_funcionario:this._generalService.Funcionario.Identificacion_Funcionario,id_apertura:this.Id_Apertura};
    this.AbrirModalCompra.next(p);
  }

}
