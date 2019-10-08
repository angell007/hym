import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { CuentabancariaService } from '../../../shared/services/cuentasbancarias/cuentabancaria.service';
import { GeneralService } from '../../../shared/services/general/general.service';
import { SwalService } from '../../../shared/services/swal/swal.service';
import { ToastService } from '../../../shared/services/toasty/toast.service';
import { WebnavigationService } from '../../../shared/services/navegacionweb/webnavigation.service';
import { TransferenciaService } from '../../../shared/services/transferencia/transferencia.service';

@Component({
  selector: 'app-detallemovimientoscuentagerente',
  templateUrl: './detallemovimientoscuentagerente.component.html',
  styleUrls: ['./detallemovimientoscuentagerente.component.scss', '../../../../style.scss']
})
export class DetallemovimientoscuentagerenteComponent implements OnInit {

  public AbrirModalAjuste:Subject<any> = new Subject();
  public AbrirModalCompra:Subject<any> = new Subject();
  public AbrirModalDetalleReciboTransferencia:Subject<any> = new Subject();

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

  public Mes_Consulta = '';
  public Id_Cuenta = '';
  public Meses:Array<any> = [];
  private _transferenciaVer:any;

  constructor(private _router:Router,
              private _activeRoute:ActivatedRoute,
              private _cuentaBancariaService:CuentabancariaService,
              private _transferenciaService:TransferenciaService,
              private _generalService:GeneralService,
              private _swalService:SwalService,
              private _toastService:ToastService,
              private _webNavigacionService:WebnavigationService) 
  { 
    this.Id_Cuenta =  this._activeRoute.snapshot.params["id_cuenta"];
    this.Mes_Consulta = this._generalService.MesActual;
    this.Meses = this._generalService.Meses2;
  }

  ngOnInit() {
    this.GetMovimientosCuenta();
    this._getInformacionCuentaBancariaActual();
  }

  public GetMovimientosCuenta(){
    let p = {id_cuenta:this.Id_Cuenta, mes:this.Mes_Consulta};
    this._cuentaBancariaService.GetMovimientosCuentaBancariaGerente(p).subscribe((data:any) => {
      console.log(data);
      
      
      if (data.codigo == 'success') {
        this.MovimientosCuentaBancaria = data.query_data;
        this.Movimientos = data.query_data.movimientos;
        this.Balance = parseInt(data.query_data.balance);
        this.Codigo_Moneda = data.codigo_moneda;
        this.Apertura = parseInt(data.query_data.monto_inicial);
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
    this._cuentaBancariaService.GetCuentaBancariaDetalle(this.Id_Cuenta).subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.CuentaBancariaModel = data.query_data;
      }else{
        this._limpiarModelo();
      }
    });
  }

  public VolverAlCierre(){
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

  AbrirDetalleRecibo(idTransferencia:any){
    let t = {Id_Transferencia:idTransferencia};
    this._getDetalleTrasnferencia(idTransferencia);
  }

  private _getDetalleTrasnferencia(idTransferencia:string){
    this._transferenciaService.GetReciboTransferenciaXId(idTransferencia).subscribe(data => {
      if (data.codigo == 'success') {
        this._transferenciaVer = data.query_data;
        this.AbrirModalDetalleReciboTransferencia.next(this._transferenciaVer);
      }else{
        this._transferenciaVer = [];
      }
    });
  }

}
