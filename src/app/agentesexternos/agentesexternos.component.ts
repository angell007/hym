// Typing for Ammap
/// <reference path="../shared/typings/ammaps/ammaps.d.ts" />

import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {DatatableComponent} from '@swimlane/ngx-datatable';
import { HttpClient } from '@angular/common/http';
import { ThemeConstants } from '../shared/config/theme-constant';
import 'ammap3';
import 'ammap3/ammap/maps/js/usaLow';

import 'assets/js/jquery.sparkline/jquery.sparkline.js';
import * as $ from 'jquery';

@Component({
  selector: 'app-agentesexternos',
  templateUrl: './agentesexternos.component.html',
  styleUrls: ['./agentesexternos.component.css']
})
export class AgentesexternosComponent implements OnInit {
  
  readonly ruta = 'https://hym.corvuslab.co/'; 
  public fecha = new Date(); 

  agentes = [];

  @ViewChild(DatatableComponent) table: DatatableComponent;
  constructor(private http : HttpClient,private colorConfig:ThemeConstants) {  
  }
  themeColors = this.colorConfig.get().colors;
  //Line Chart Config
  public lineChartLabels: Array<any> = ['Ene', 'Feb', 'March', 'Abr', 'May', 'Jun', 'Jul'];
  public lineChartData: Array<any> = [
    { data: [65, 59, 80, 81, 56, 55, 40, 37, 54, 76, 63, 62], label: 'Transferencias Montadas' },
    { data: [28, 48, 40, 19, 86, 27, 90, 43, 65, 76, 87, 85], label: 'Transferencias Exitosas' }
  ];
  public lineChartOptions: any = {
    scales: {
      yAxes: [
        {
          id: 'y-axis-1',
          type: 'linear',
          display: true,
          position: 'left'
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
  ngOnInit() {
    this.http.get(this.ruta+'php/agentesexternos/lista.php').subscribe((data:any)=>{
      this.agentes= data;
    });
  }

}
