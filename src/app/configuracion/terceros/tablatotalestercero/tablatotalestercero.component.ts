import { Component, OnInit, Input } from '@angular/core';
import { MonedaService } from '../../../shared/services/monedas/moneda.service';
import { ToastService } from '../../../shared/services/toasty/toast.service';
import { SwalService } from '../../../shared/services/swal/swal.service';

@Component({
  selector: 'app-tablatotalestercero',
  templateUrl: './tablatotalestercero.component.html',
  styleUrls: ['./tablatotalestercero.component.scss']
})
export class TablatotalesterceroComponent implements OnInit {

<<<<<<< HEAD
  @Input() Id_Tercero: string = '';

  public Monedas: Array<any> = [];
  public MostrarTablas: boolean = false;
  public MonedaSeleccionada: string = '';

  constructor(private _monedaService: MonedaService,
    private _toastService: ToastService,
    private _swalService: SwalService) {
    this.GetMonedas();
  }

  ngOnInit() {}

  GetMonedas() {
    this._monedaService.getMonedas().subscribe((data: any) => {      
      
      
      if (data != null) {
        this.Monedas = data;
        this.MonedaSeleccionada = this.Monedas[0].Id_Moneda;
        this.MostrarTablas = true;
      } else {
=======
  @Input() Id_Tercero:string = '';
  
  public Monedas:Array<any> = [];
  public MostrarTablas:boolean = false;
  public MonedaSeleccionada:string = '';

  constructor(private _monedaService:MonedaService,
              private _toastService:ToastService,
              private _swalService:SwalService) 
  {
    this.GetMonedas();
  }

  ngOnInit() {    
  }

  GetMonedas(){
    this._monedaService.getMonedas().subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.Monedas = data.query_data;
        this.MonedaSeleccionada = this.Monedas[0].Id_Moneda;
        this.MostrarTablas = true;
      }else{
>>>>>>> de4f37a2ab29e5d58678930a3c1a3dffabe1b05b
        this.Monedas = [];
        this.MonedaSeleccionada = '';
        this.MostrarTablas = false;

      }
    });
  }

<<<<<<< HEAD
  CambiarValoresTabla(idMoneda: string) {
    this.MonedaSeleccionada = idMoneda;
  }

  Test(value) {}
=======
  CambiarValoresTabla(idMoneda:string){
    this.MonedaSeleccionada = idMoneda;
  }

  Test(value){
    //this._swalService.ShowMessage(['success', 'Funciono', value]);
  }
>>>>>>> de4f37a2ab29e5d58678930a3c1a3dffabe1b05b

}
