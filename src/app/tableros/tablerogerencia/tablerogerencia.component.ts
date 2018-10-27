// Typing for Ammap
/// <reference path="../../shared/typings/ammaps/ammaps.d.ts" />

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

  Municipios:any[];
  ngOnInit() {
    this.http.get(this.globales.ruta + 'php/gerencia/movimentos_fechas.php').subscribe((data: any) => {
      this.Municipios = data;
    });

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    var hoy = yyyy+'-'+mm+'-'+dd;
    (document.getElementById("datefield") as HTMLInputElement).setAttribute("max",hoy);
  }

 
  Historial(value){
    
    let datos = new FormData();
    datos.append("fecha", value);

    this.http.post(this.globales.ruta + 'php/gerencia/movimentos_fechas.php', datos).subscribe((data: any) => {
      this.Municipios = data;
    });
  }


}
