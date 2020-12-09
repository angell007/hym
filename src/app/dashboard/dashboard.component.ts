// Typing for Ammap
/// <reference path="../shared/typings/ammaps/ammaps.d.ts" />

import { Component, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { ThemeConstants } from '../shared/config/theme-constant';

import '../../assets/charts/amchart/amcharts.js';
import '../../assets/charts/amchart/gauge.js';
import '../../assets/charts/amchart/pie.js';
import '../../assets/charts/amchart/serial.js';
import '../../assets/charts/amchart/light.js';
import '../../assets/charts/amchart/ammap.js';
import '../../assets/charts/amchart/worldLow.js';
import '../../assets/charts/amchart/continentsLow.js';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../shared/globales/globales';
declare const AmCharts: any;


@Component({
  templateUrl: 'dashboard.html'
})

export class DashboardComponent {

  public oficinas: any = [];

  constructor(private http: HttpClient, private globales: Globales) {

  }

  ngInit() {

  }

  ngAfterViewInit() {

    this.http.get(this.globales.ruta + '/php/dashboard/graficas_dashboard.php').subscribe((data: any) => {

      var chartData = [];


      setTimeout(() => {
        var chart = AmCharts.makeChart("chartdiv", {
          "type": "pie",
          "theme": "light",
          "dataProvider": data,
          "valueField": "litres",
          "titleField": "country",
          "balloon": {
            "fixedPosition": true
          },
          "export": {
            "enabled": true
          }
        });
      }, 75);
    });

    this.http.get(this.globales.ruta + '/php/dashboard/graficas_barras.php').subscribe((data: any) => {

      /*
      var chartData = [ {
        "country": "USA",
        "visits": 4025,
        "color": "#FF0F00"
      }, {
        "country": "China",
        "visits": 1882,
        "color": "#FF6600"
      }, {
        "country": "Japan",
        "visits": 1809,
        "color": "#FF9E01"
      }, {
        "country": "Germany",
        "visits": 1322,
        "color": "#FCD202"
      }, {
        "country": "UK",
        "visits": 1122,
        "color": "#F8FF01"
      }, {
        "country": "France",
        "visits": 1114,
        "color": "#B0DE09"
      }, {
        "country": "India",
        "visits": 984,
        "color": "#04D215"
      }, {
        "country": "Spain",
        "visits": 711,
        "color": "#0D8ECF"
      }, {
        "country": "Netherlands",
        "visits": 665,
        "color": "#0D52D1"
      }, {
        "country": "Russia",
        "visits": 580,
        "color": "#2A0CD0"
      }, {
        "country": "South Korea",
        "visits": 443,
        "color": "#8A0CCF"
      }, {
        "country": "Canada",
        "visits": 441,
        "color": "#CD0D74"
      }, {
        "country": "Brazil",
        "visits": 395,
        "color": "#754DEB"
      }, {
        "country": "Italy",
        "visits": 386,
        "color": "#DDDDDD"
      }, {
        "country": "Australia",
        "visits": 384,
        "color": "#999999"
      }, {
        "country": "Taiwan",
        "visits": 338,
        "color": "#333333"
      }, {
        "country": "Poland",
        "visits": 328,
        "color": "#000000"
      } ];
      */
      
      var chart = AmCharts.makeChart( "chartdiv1", {
        "theme": "light",
        "type": "serial",
        "dataProvider": data,
        "categoryField": "country",
        "depth3D": 20,
        "angle": 30,
      
        "categoryAxis": {
          "labelRotation": 90,
          "gridPosition": "start"
        },
      
        "valueAxes": [ {
          "title": "Recaudado"
        } ],
      
        "graphs": [ {
          "valueField": "visits",
          "colorField": "color",
          "type": "column",
          "lineAlpha": 0.1,
          "fillAlphas": 1
        } ],
      
        "chartCursor": {
          "cursorAlpha": 0,
          "zoomable": false,
          "categoryBalloonEnabled": false
        },
      
        "export": {
          "enabled": true
        }
      } );

    });

  }



}
