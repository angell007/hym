import { Component, OnInit, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';

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

  @ViewChild('alertSwal') alertSwal:any;
  
  public Monedas:any = [];
  public Hrefs:any = [];
  public TabsId:any = [];
  public AriaLabels:any = [];
  public idColapsable:string = '';
  public refColapsable:string = '';
  public TotalesMunicipio:Array<any> = [];
  public QtyResult:number = 0;
  public TotalMunicipio:number = 0;

  constructor(public globales:Globales, private client:HttpClient) {
    this.AsignarMonedas();
   }

  ngOnChanges(changes:SimpleChanges){  
  }

  ngOnInit() {
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
    console.log(this.refColapsable);
    
  }

  AsignarMonedas(){
    this.Monedas = this.globales.Monedas;
  }

  ShowSwal(tipo:string, titulo:string, msg:string){
    this.alertSwal.type = tipo;
    this.alertSwal.title = titulo;
    this.alertSwal.text = msg;
    this.alertSwal.show();
  }

}
