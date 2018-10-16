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
      data.forEach(element => {
        if (element.tercero[0].Valor != "0") {
          this.ListaBalance.push(element);
          this.lineChartLabels.push(element.Nombre);
          this.datos.push(element.tercero[0].Valor);
          this.datos1.push(element.tercero[1].Valor);
          chartData.push({
            Proveedor: element.Nombre,
            Egresos: element.tercero[0].Valor,
            Ingresos: element.tercero[1].Valor
          })
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
