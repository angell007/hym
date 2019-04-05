import { Component, OnInit, Input, SimpleChanges, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { ToastService } from '../../../shared/services/toasty/toast.service';
import { SwalService } from '../../../shared/services/swal/swal.service';
import { CustomcurrencyPipe } from '../../../common/Pipes/customcurrency.pipe';
import { CorresponsalbancarioService } from '../../../shared/services/corresponsalesbancarios/corresponsalbancario.service';

@Component({
  selector: 'app-tablamovimientoscorresponsal',
  templateUrl: './tablamovimientoscorresponsal.component.html',
  styleUrls: ['./tablamovimientoscorresponsal.component.scss', '../../../../style.scss']
})
export class TablamovimientoscorresponsalComponent implements OnInit {

  @Input() Id_Corresponsal_Bancario:string;

  public TotalMovmimientos:Array<any> = [];
  public Movimientos:Array<any> = [];
  public MostrarTotales:boolean = false;
  public Balance:string = "0";
  public BalanceNumero:number = 0;
  public TotalesMonedas:Array<any> = [];
  public totalObj:any = {Total:"0"};
  public AbrirModalAgregar:Subject<any> = new Subject<any>();
 
  constructor(private _toastService:ToastService,
              private _swalService:SwalService,
              private _customCurrency:CustomcurrencyPipe,
              private _corresponsalBancarioService:CorresponsalbancarioService) 
  {
    
  }

  ngOnInit() {
    this.GetMovimientosCorresponsal();
  }

  ngOnChanges(changes:SimpleChanges): void {
    if (changes.Id_Corresponsal_Bancario.previousValue != undefined) {      
      this.GetMovimientosCorresponsal();
    }
  }

  // GetTotalesMonedas(){
  //   this._terceroService.getTotalesMonedasTercero(this.Id_Tercero).subscribe((data:any) => {
  //     if (data.codigo == 'success') {
  //       this.TotalesMonedas = data.query_data;
  //     }else{
  //       this.TotalesMonedas = [];
  //       let toastObj = {textos:[data.titulo, data.mensaje], tipo:data.codigo, duracion:4000};
  //       this._toastService.ShowToast(toastObj);
  //     }

  //     this.ActualizarBalance();
  //   });
  // }

  GetMovimientosCorresponsal(){
    
    if (this.Id_Corresponsal_Bancario != '' && this.Id_Corresponsal_Bancario != undefined) {
      this._corresponsalBancarioService.getMovimientosCorresponsal(this.Id_Corresponsal_Bancario).subscribe((data:any) => {
        if (data.codigo == 'success') {
          this.TotalMovmimientos = data.query_data;
          this.Movimientos = data.query_data.movimientos;
          this.MostrarTotales = true;
        }else{
          this.TotalMovmimientos = [];
          this.Movimientos = [];
          this.MostrarTotales = false;
          let toastObj = {textos:[data.titulo, data.mensaje], tipo:data.codigo, duracion:4000};
          this._toastService.ShowToast(toastObj);
        }  
        
       this.ActualizarBalance();
      });  
    }    
  }

  ActualizarBalance(){
    if (this.Movimientos.length > 0) {       
      this.Balance = this._customCurrency.transform(this.Movimientos[0].totales.balance);
      this.BalanceNumero = this.Movimientos[0].totales.balance;
    }else{
      this.Balance = '$ 0';
      this.BalanceNumero = 0;
    }
  }

  AbrirModal(idCorresponsal:string){
    this.AbrirModalAgregar.next(idCorresponsal);
  }
}
