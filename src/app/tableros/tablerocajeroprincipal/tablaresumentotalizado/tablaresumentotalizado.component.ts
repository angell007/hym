import { Component, OnInit, ViewChild, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';
import { MonedaService } from '../../../shared/services/monedas/moneda.service';
import { SwalService } from '../../../shared/services/swal/swal.service';

@Component({
  selector: 'app-tablaresumentotalizado',
  templateUrl: './tablaresumentotalizado.component.html',
  styleUrls: ['./tablaresumentotalizado.component.scss']
})
export class TablaresumentotalizadoComponent implements OnInit, OnChanges {

  @Input() ParentIndex:string = '';
  @Input() Municipio:any = {};
  @Input() Oficinas:any = [];
  @Input() Id_Cajero:string = '';

  @Output() ActualizarTotalDepartamento:EventEmitter<any> = new EventEmitter();

  @ViewChild('alertSwal') alertSwal:any;
  
  public Monedas:any = [];
  public MostrarTotales:Array<any> = [];
  public Hrefs:any = [];
  public TabsId:any = [];
  public AriaLabels:any = [];
  public idColapsable:string = '';
  public refColapsable:string = '';
  public TotalesMunicipio:Array<any> = [];
  public QtyResult:number = 0;
  public TotalMunicipio:number = 0;

  constructor(public globales:Globales, private client:HttpClient, private _monedaService:MonedaService, private _swalService:SwalService) {
    //this.AsignarMonedas();
   }

  ngOnChanges(changes:SimpleChanges){  
    //this.ExtraerTotales();
    this.AsignarMonedas();
  }

  ngOnInit() {
    //this.ExtraerTotales();    
    this.AsignarMonedas();
  }

  ExtraerTotales(){
    let totales_monedas = this.Municipio.Total_Monedas;  
    this.MostrarTotales = [];
    this.Monedas.forEach(m => {      
      let n = m.Nombre;
      let t = parseFloat(totales_monedas[n].Ingresos) - parseFloat(totales_monedas[n].Egresos);
      let totalObj = { Codigo:m.Codigo, Total:t};
      this.MostrarTotales.push(totalObj);
    });
    
  }

  SetReferencias(){
    if (this.QtyResult == 0) {
      this.Hrefs = [];
    }else{

      this.TotalesMunicipio.forEach((element, i) => {
        let referencia = '#tab-'+element.Nombre+'-'+i;
        this.Hrefs.push(referencia);      
      });
    }    
  }

  SetTabsId(){
    if (this.QtyResult == 0) {
      this.TabsId = [];
      this.AriaLabels = [];

    }else{

      this.TotalesMunicipio.forEach((element, i) => {
        let id = 'tab-'+element.Nombre+'-'+i;
        let lab = id+'-label-'+i;
        this.TabsId.push(id);
        this.AriaLabels.push(lab);      
      });
    }    
  }

  SetColapsable(){

    if (this.QtyResult == 0) {
      this.idColapsable = '';
      this.refColapsable = '';

    }else{

      this.TotalesMunicipio.forEach((element, i) => {
        let id = 'tab-'+element.Nombre+'-'+i;
        let lab = id+'-label-'+i;
        this.TabsId.push(id);
        this.AriaLabels.push(lab);      
      });
    } 
    this.idColapsable = 'colapsable'+this.ParentIndex;
    this.refColapsable = '#colapsable'+this.ParentIndex;
    
  }

  AsignarMonedas(){
    //this.Monedas = this.globales.Monedas;
    this._monedaService.getMonedas().subscribe((d:any) => {
      if (d.codigo == 'success') {
        this.Monedas = d.query_data; 
        this.ExtraerTotales();
        //console.log(this.Monedas);
      }else{
        this.Monedas = [];
        this._swalService.ShowMessage(d);
      }
      
    });
  }

  ShowSwal(tipo:string, titulo:string, msg:string){
    this.alertSwal.type = tipo;
    this.alertSwal.title = titulo;
    this.alertSwal.text = msg;
    this.alertSwal.show();
  }

}
