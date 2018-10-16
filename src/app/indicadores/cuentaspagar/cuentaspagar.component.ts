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
  selector: 'app-cuentaspagar',
  templateUrl: './cuentaspagar.component.html',
  styleUrls: ['./cuentaspagar.component.scss']
})
export class CuentaspagarComponent implements OnInit {

  ListaBalance = [];

  constructor(private http : HttpClient, private colorConfig: ThemeConstants, private globales: Globales) { }
  
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
          beginAtZero:true
        },
        {
          id: 'y-axis-2',
          type: 'linear',
          display: false
        }
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
  ngAfterViewInit(){
    this.http.get(this.globales.ruta + 'php/terceros/cuentas_pago.php').subscribe((data: any) => {
      data.forEach(element => {
        element.tercero.forEach(element1 => {
          if (element1.Valor != "" && element1.Tipo != "") {
            this.ListaBalance.push(element);
            this.lineChartLabels.push(element.Nombre);
            this.datos.push(element1.Valor);
            //this.lineChartData.push( { data: [element1.Valor] });
          }
        });
      });

      this.lineChartData= [
        { data: this.datos, label: 'Cuentas por cobrar BsS.' }
      ];

    });
    
    

  }

  ngOnInit() {
 
  }

}
