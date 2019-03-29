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
    
  }

  ngOnInit() {
    this.GetMovimientos();
  }

  ngOnChanges(changes:SimpleChanges): void {
    if (changes.Id_Moneda.previousValue != undefined) {
      this.GetMovimientos();
    }
  }

  GetMovimientos(){
    if (this.Id_Moneda != '' && this.Id_Moneda != undefined) {
      this._movimientoService.getMovimientosTercero(this.Id_Tercero, this.Id_Moneda).subscribe((data:any) => {
        if (data.codigo == 'success') {
          this.MovimientosTercero = data.query_data;            
        }else{
          this.MovimientosTercero = [];
          let toastObj = {textos:[data.titulo, data.mensaje], tipo:data.codigo, duracion:4000};
          this._toastService.ShowToast(toastObj);
        }      
      });  
    }    
  }

}
