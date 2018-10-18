import '../../../assets/charts/amchart/amcharts.js';
import '../../../assets/charts/amchart/gauge.js';
import '../../../assets/charts/amchart/pie.js';
import '../../../assets/charts/amchart/serial.js';
import '../../../assets/charts/amchart/light.js';
import '../../../assets/charts/amchart/ammap.js';
import '../../../assets/charts/amchart/worldLow.js';
import '../../../assets/charts/amchart/continentsLow.js';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/throw';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ThemeConstants } from '../../shared/config/theme-constant';
import { NgForm } from '../../../../node_modules/@angular/forms';
import { Globales } from '../../shared/globales/globales';
import { Subject } from '../../../../node_modules/rxjs/Subject';

@Component({
  selector: 'app-flujoefectivo',
  templateUrl: './flujoefectivo.component.html',
  styleUrls: ['./flujoefectivo.component.scss']
})
export class FlujoefectivoComponent implements OnInit {

  constructor(private http: HttpClient, private colorConfig: ThemeConstants, private globales: Globales) { }

  ListaBalance = [];

  themeColors = this.colorConfig.get().colors;
  //Line Chart Config
  public lineChartLabels: Array<any> = [''];
  public lineChartData: Array<any> = [
    { data: [0], label: 'Valor Debe' },
  ];;
  public lineChartOptions: any = {
    scales: {
      yAxes: [
        {
          id: 'y-axis-1',
          type: 'linear',
          display: true,
          beginAtZero: true
        }/*,
        {
          id: 'y-axis-2',
          type: 'linear',
          display: false
        }*/
      ]
    }
  };
  public lineChartLegend: boolean = false;
  public lineChartType: string = 'line';
  public lineChartColors: Array<any> = [
    {
      backgroundColor: this.themeColors.infoInverse,
      borderColor: this.themeColors.info
    },
    {
      backgroundColor: this.themeColors.successInverse,
      borderColor: this.themeColors.success
    }
  ];

  datos = [0];
  datos1 = [0];
  ngOnInit() {

    var chartData = [];
    this.http.get(this.globales.ruta + 'php/terceros/flujo_efectivo.php').subscribe((data: any) => {
      var datos =[];
      data.forEach((element,index) => {
       
        if(element.tercero.length > 0){
          //console.log(element);
          this.ListaBalance.push(element);

          var item1 = 0;
          var item2 = 0;
          var item3 = 0;
          var item4 = 0;
          
          if(element.tercero[0] != undefined){
            item1 = element.tercero[0].Valor;
          }
          if(element.tercero[1] != undefined){
            item2 = element.tercero[1].Valor;
          }
          if(element.tercero[2] != undefined){
            item3 = element.tercero[2].Valor;
          }
          if(element.tercero[3] != undefined){
            item4 = element.tercero[3].Valor;
          }

          element.tercero.forEach(element1 => {
  
              chartData.push({
                Proveedor: element.Nombre,
                Egresos: element1.Valor,
                Ingresos: 0
              })           
              
              if(element1.Tipo == "Ingreso" && element1.Moneda_Origen == "Pesos" ){
                var index = datos.findIndex(x=> x.Proveedor === element.Nombre);
  
                if(index == -1){
                  datos.push({
                    Proveedor: element.Nombre,
                    Egresos:  0,
                    Ingresos: element1.Valor
                  });
                }else{
                  datos[index].Ingresos = element1.Valor
                }              
                
              }
              if(element1.Tipo == "Ingreso" && element1.Moneda_Origen == "Bolivares" ){
                var index = datos.findIndex(x=> x.Proveedor === element.Nombre);
  
                if(index == -1){
                  datos.push({
                    Proveedor: element.Nombre,
                    Egresos:  0,
                    Ingresos: element1.Valor
                  });
                }else{
                  datos[index].Ingresos = element1.Valor
                }  
              } 

              console.log(datos);
              
            
          });
        }        
      });

      var chart = AmCharts.makeChart("chartdiv", {
        "type": "serial",
        "theme": "light",
        "legend": {
          "useGraphSettings": true
        },
        "dataProvider": chartData,
        "synchronizeGrid": true,
        "valueAxes": [{
          "id": "v1",
          "axisColor": "#cc0000",
          "axisThickness": 2,
          "axisAlpha": 1,
          "position": "left"
        }, {
          "id": "v2",
          "axisColor": "#009900",
          "axisThickness": 2,
          "axisAlpha": 1,
          "position": "right"
        }],
        "graphs": [{
          "valueAxis": "v1",
          "lineColor": "#cc0000",
          "bullet": "round",
          "bulletBorderThickness": 1,
          "hideBulletsCount": 30,
          "title": "Egresos",
          "valueField": "Ingresos",
          "fillAlphas": 0
        }, {
          "valueAxis": "v2",
          "lineColor": "#009900",
          "bullet": "square",
          "bulletBorderThickness": 1,
          "hideBulletsCount": 30,
          "title": "Ingresos",
          "valueField": "Egresos",
          "fillAlphas": 0
        }],
        "chartCursor": {
          "cursorPosition": "mouse"
        },
        "categoryField": "Proveedor",        
        "export": {
          "enabled": true,
          "position": "bottom-right"
        }
      });
    });




  }

}
