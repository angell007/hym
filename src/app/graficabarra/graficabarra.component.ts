import { Component, OnInit } from '@angular/core';
import { Globales } from '../shared/globales/globales';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-graficabarra',
  templateUrl: './graficabarra.component.html',
  styleUrls: ['./graficabarra.component.scss']
})
export class GraficabarraComponent implements OnInit {

  constructor(public globales:Globales, private http:HttpClient) { }

  ngOnInit() {
    this.graficas();
  }

  graficas(){
    this.http.get(this.globales.ruta + 'php/transferencias/conteo.php').subscribe((data: any) => {
      var chart = AmCharts.makeChart( "chartdiv", {
        "type": "serial",
        "theme": "light",
        "dataProvider": [ {
          "country": "Realizadas",
          "visits": data.TransferenciasRealizadas
        }, {
          "country": "Devueltas",
          "visits": data.TransferenciasDevueltas
        }, {
          "country": "Revisadas",
          "visits": data.TotalTransferencias
        } ],
        "valueAxes": [ {
          "gridColor": "#FFFFFF",
          "gridAlpha": 0.2,
          "dashLength": 0
        } ],
        "gridAboveGraphs": true,
        "startDuration": 1,
        "graphs": [ {
          "balloonText": "[[category]]: <b>[[value]]</b>",
          "fillAlphas": 0.8,
          "lineAlpha": 0.2,
          "type": "column",
          "valueField": "visits"
        } ],
        "chartCursor": {
          "categoryBalloonEnabled": false,
          "cursorAlpha": 0,
          "zoomable": false
        },
        "categoryField": "country",
        "categoryAxis": {
          "gridPosition": "start",
          "gridAlpha": 0,
          "tickPosition": "start",
          "tickLength": 20
        },
        "export": {
          "enabled": true
        }
      
      } );
    });

  }

}
