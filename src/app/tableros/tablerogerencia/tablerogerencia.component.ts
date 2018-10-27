
import { Component, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { ThemeConstants } from '../../shared/config/theme-constant';

import '../../../assets/charts/amchart/amcharts.js';
import '../../../assets/charts/amchart/gauge.js';
import '../../../assets/charts/amchart/pie.js';
import '../../../assets/charts/amchart/serial.js';
import '../../../assets/charts/amchart/light.js';
import '../../../assets/charts/amchart/ammap.js';
import '../../../assets/charts/amchart/worldLow.js';
import '../../../assets/charts/amchart/continentsLow.js';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../shared/globales/globales';
import { NgForm } from '@angular/forms';
declare const AmCharts: any;

@Component({
  selector: 'app-tablerogerencia',
  templateUrl: './tablerogerencia.component.html',
  styleUrls: ['./tablerogerencia.component.scss']
})

export class TablerogerenciaComponent {

  constructor(private http: HttpClient, private globales: Globales) {

  }

  Municipios: any[];
  Oficina : any[];
  ngOnInit() {
    this.http.get(this.globales.ruta + 'php/gerencia/movimentos_fechas.php').subscribe((data: any) => {
      this.Municipios = data;
    });

    this.http.get(this.globales.ruta + '/php/genericos/lista_generales.php', {
      params: {  modulo: "Oficina" }
    }).subscribe((data: any) => {
      this.Oficina = data;
    });

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    var hoy = yyyy + '-' + mm + '-' + dd;
    (document.getElementById("datefield") as HTMLInputElement).setAttribute("max", hoy);

    
  }


  NombreOficina =[];
  Valores =[];
  Historial(value) {

    this.NombreOficina =[];
    this.Valores =[];

    let datos = new FormData();
    datos.append("fecha", value);

    this.http.post(this.globales.ruta + 'php/gerencia/movimentos_fechas.php', datos).subscribe((data: any) => {
      this.Municipios = data;
      data.forEach(element => {
       var index =  this.Oficina.findIndex(x=>x.Id_Oficina === element.Id_Oficina);
       this.NombreOficina.push(this.Oficina[index].Nombre);
       this.Valores.push(element.TotalPesos);
      });
      this.graficas();
    });          
  }

  graficas() {
  
    var chart = AmCharts.makeChart( "chartdiv", {
      "type": "serial",
      "theme": "light",
      "dataProvider": [ {
        "country": this.NombreOficina,
        "visits": this.Valores
      }],
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
    
    });
  }


}
