import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MonedaService } from '../../../shared/services/monedas/moneda.service';
import { ToastService } from '../../../shared/services/toasty/toast.service';
import { SwalService } from '../../../shared/services/swal/swal.service';
import { MovimientoterceroService } from '../../../shared/services/movimientostercero/movimientotercero.service';
import { CustomcurrencyPipe } from '../../../common/Pipes/customcurrency.pipe';
import { TerceroService } from '../../../shared/services/tercero/tercero.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-tablatotalesmonedatercero',
  templateUrl: './tablatotalesmonedatercero.component.html',
  styleUrls: ['./tablatotalesmonedatercero.component.scss', '../../../../style.scss']
})
export class TablatotalesmonedaterceroComponent implements OnInit, OnChanges {

  @Input() Id_Moneda:string;
  @Input() Id_Tercero:string;

  public MovimientosTercero:Array<any> = [];
  public Movimientos:Array<any> = [];
  public MostrarTotales:boolean = false;
  public Balance:string = "0";
  public TotalesMonedas:Array<any> = [];
  public totalObj:any = {Total:"0"};
  public AbrirModalAgregar:Subject<any> = new Subject<any>();
 
  constructor(private _monedaService:MonedaService,
              private _toastService:ToastService,
              private _swalService:SwalService,
              private _movimientoService:MovimientoterceroService,
              private _customCurrency:CustomcurrencyPipe,
              private _terceroService:TerceroService) 
  {
    
  }

  ngOnInit() {
    this.GetMovimientos();
  }

  ngOnChanges(changes:SimpleChanges): void {
    if (changes.Id_Moneda.previousValue != undefined) {
      this.GetMovimientos();
    }
  }

  GetTotalesMonedas(){
    this._terceroService.getTotalesMonedasTercero(this.Id_Tercero).subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.TotalesMonedas = data.query_data;
      }else{
        this.TotalesMonedas = [];
        let toastObj = {textos:[data.titulo, data.mensaje], tipo:data.codigo, duracion:4000};
        this._toastService.ShowToast(toastObj);
      }

      this.ActualizarBalance();
    });
  }

  GetMovimientos(){
    if (this.Id_Moneda != '' && this.Id_Moneda != undefined) {
      this._movimientoService.getMovimientosTercero(this.Id_Tercero, this.Id_Moneda).subscribe((data:any) => {
        if (data.codigo == 'success') {
          this.MovimientosTercero = data.query_data;
          this.Movimientos = data.query_data.movimientos;
          this.MostrarTotales = true;
        }else{
          this.MovimientosTercero = [];
          this.Movimientos = [];
          this.MostrarTotales = false;
          let toastObj = {textos:[data.titulo, data.mensaje], tipo:data.codigo, duracion:4000};
          this._toastService.ShowToast(toastObj);
        }  
        
        this.GetTotalesMonedas();
      });  
    }    
  }

  ActualizarBalance(){
    if (this.TotalesMonedas.length > 0) {     
      this.totalObj = this.TotalesMonedas.find(x => x.Id_Moneda == this.Id_Moneda);        
      this.Balance = this._customCurrency.transform(this.totalObj.Total, this.totalObj.Codigo);
    }else{
      this.Balance = '0';
    }
  }

  AbrirModal(idMovimiento:string){
    let obj = {id_movimiento:idMovimiento, id_moneda:this.Id_Moneda, id_tercero:this.Id_Tercero};
    this.AbrirModalAgregar.next(obj);
  }

  AnularMovimientoTercero(idMovimiento:string){
    let datos = new FormData();
    datos.append("id_movimiento", idMovimiento);
    this._movimientoService.anularMovimientoTercero(datos).subscribe((data:any) => {
      if (data.codigo == 'success') { 
        this.GetMovimientos();
        let toastObj = {textos:[data.titulo, data.mensaje], tipo:data.codigo, duracion:4000};
        this._toastService.ShowToast(toastObj);
      }else{
        this._swalService.ShowMessage(data); 
      }
    });
  }

}
