import { Component, OnInit } from '@angular/core';
import { MonedaService } from '../../shared/services/monedas/moneda.service';
import { ToastService } from '../../shared/services/toasty/toast.service';
import { OpcionPredeterminadaModel } from '../../Modelos/OpcionPredeterminadaModel';
import { ConfiguracionService } from '../../shared/services/configuraciones/configuracion.service';

@Component({
  selector: 'app-managedefaults',
  templateUrl: './managedefaults.component.html',
  styleUrls: ['./managedefaults.component.scss']
})
export class ManagedefaultsComponent implements OnInit {

  public Monedas:Array<any> = [];
  public ValoresPredeterminados:OpcionPredeterminadaModel = new OpcionPredeterminadaModel();

  constructor(private _monedaService:MonedaService,
              private _toastService:ToastService,
              private _configuracionService:ConfiguracionService) 
  { 
    this.GetMonedas();
  }

  ngOnInit() {
  }

  GetMonedas(){
    this._monedaService.getMonedas().subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.Monedas = data.query_data;
      }else{

        this.Monedas = [];
        let toastObj = {textos:[data.titulo, data.mensaje], tipo:data.codigo, duracion:4000};
        this._toastService.ShowToast(toastObj);
      }
    });
  }

  GuardarPredeterminados(){

  }

}
