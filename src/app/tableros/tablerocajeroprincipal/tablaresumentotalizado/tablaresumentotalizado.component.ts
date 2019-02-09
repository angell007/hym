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
  @Input() Departamento:string = '';
  @Input() Id_Cajero:string = '';

  @ViewChild('alertSwal') alertSwal:any;
  
  public Monedas:any = ['Peso', 'Bolivar Soberano', 'Dolar', 'Euro'];
  public MonedasCollapse:any = ['peso', 'bolivar', 'dolar', 'euro'];
  public Hrefs:any = [];
  public TabsId:any = [];
  public AriaLabels:any = [];
  public idColapsable:string = '';
  public refColapsable:string = '';
  public TotalesMunicipio:Array<any> = [];
  public QtyResult:number = 0;

  constructor(public globales:Globales, private client:HttpClient) { }

  ngOnChanges(changes:SimpleChanges){

    if (changes.Departamento.previousValue != undefined || changes.Id_Cajero.previousValue != undefined) {
      this.BuscarMunicipioConTotales();
    }    
  }

  ngOnInit() {
    this.BuscarMunicipioConTotales();
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

  BuscarMunicipioConTotales(){
    if (this.Departamento == '') {
      return;
    }

    let p = {id_departamento: this.Departamento, id_funcionario:this.Id_Cajero};
    this.client.get(this.globales.ruta+'php/cajas/totales_cajas.php', {params:p}).subscribe((data:any) => {    
      if (data.codigo == 'warning') {
        
        this.QtyResult = 0;  

      }else if (data.codigo == 'success'){

        this.QtyResult = data.municipios.length;
      }

      this.SetReferencias();
      this.SetTabsId();
      this.SetColapsable();
    });
  }

  ShowSwal(tipo:string, titulo:string, msg:string){
    this.alertSwal.type = tipo;
    this.alertSwal.title = titulo;
    this.alertSwal.text = msg;
    this.alertSwal.show();
  }

}
