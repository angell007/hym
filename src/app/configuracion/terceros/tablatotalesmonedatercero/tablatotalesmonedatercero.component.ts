import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MonedaService } from '../../../shared/services/monedas/moneda.service';
import { ToastService } from '../../../shared/services/toasty/toast.service';
import { SwalService } from '../../../shared/services/swal/swal.service';
import { MovimientoterceroService } from '../../../shared/services/movimientostercero/movimientotercero.service';

@Component({
  selector: 'app-tablatotalesmonedatercero',
  templateUrl: './tablatotalesmonedatercero.component.html',
  styleUrls: ['./tablatotalesmonedatercero.component.scss']
})
export class TablatotalesmonedaterceroComponent implements OnInit, OnChanges {

  @Input() Id_Moneda:string;
  @Input() Id_Tercero:string;

  public MovimientosTercero:Array<any> = [];
 
  constructor(private _monedaService:MonedaService,
              private _toastService:ToastService,
              private _swalService:SwalService,
              private _movimientoService:MovimientoterceroService) 
  {
    this._swalService.ShowMessage(['success', 'Exito!', this.Id_Moneda]);
    // console.log(this.Id_Moneda);
    // this.GetMovimientos();
    
  }

  ngOnInit() {
    console.log(this.Id_Moneda);
    this.GetMovimientos();
  }

  ngOnChanges(changes:SimpleChanges): void {
    if (changes.Id_Moneda.previousValue != undefined) {
      this._swalService.ShowMessage(['success', 'Exito!', this.Id_Moneda]);
      console.log(this.Id_Moneda);
      this.GetMovimientos();
    }
  }

  GetMovimientos(){
    if (this.Id_Moneda != '' && this.Id_Moneda != undefined) {
      this._movimientoService.getMovimientosTercero(this.Id_Tercero).subscribe((data:any) => {
        if (data.lista.length > 0) {
          console.log("monedas");
          
          this.MovimientosTercero = data.lista;  
          console.log(data);
          
        }else{
          this.MovimientosTercero = [];
        }      
      });  
    }    
  }

}
