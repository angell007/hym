import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TerceroService } from '../../../shared/services/tercero/tercero.service';
import { GeneralService } from '../../../shared/services/general/general.service';
import { SwalService } from '../../../shared/services/swal/swal.service';
import { ToastService } from '../../../shared/services/toasty/toast.service';
import { TerceroVerModel } from '../../../Modelos/VerModels/TerceroVerModel';
import { TerceroModel } from '../../../Modelos/TerceroModel';

@Component({
  selector: 'app-tablavertercero',
  templateUrl: './tablavertercero.component.html',
  styleUrls: ['./tablavertercero.component.scss', '../../../../style.scss']
})
export class TablaverterceroComponent implements OnInit, OnChanges {

  @Input() Id_Tercero:string = '';

  public TerceroModel:TerceroVerModel = new TerceroVerModel();

  constructor(private _terceroService:TerceroService,
              private _generalService:GeneralService,
              private _swalService:SwalService,
              private _toastService:ToastService)
  { 
    // this.GetTercero();
    // console.log(this.Id_Tercero);
  }

  ngOnInit() {
    this.GetTercero();
    
  }

  ngOnChanges(changes:SimpleChanges): void {
    
    if (changes.Id_Tercero.currentValue != undefined) {
      this.GetTercero();
    }
  }

  GetTercero(){
    if (this.Id_Tercero != '') {
      this._terceroService.getTerceroVer(this.Id_Tercero).subscribe((data:any) => {
        if (data.codigo == 'success') {
          this.TerceroModel = data.query_data;
          
        }else{
  
          this._swalService.ShowMessage(data);
          this.TerceroModel = new TerceroVerModel();
        }
      });
    }
  }

}
