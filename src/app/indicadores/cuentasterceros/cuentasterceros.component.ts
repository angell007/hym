import '../../../assets/charts/amchart/amcharts.js';
import '../../../assets/charts/amchart/gauge.js';
import '../../../assets/charts/amchart/pie.js';
import '../../../assets/charts/amchart/serial.js';
import '../../../assets/charts/amchart/light.js';
import '../../../assets/charts/amchart/ammap.js';
import '../../../assets/charts/amchart/worldLow.js';
import '../../../assets/charts/amchart/continentsLow.js';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild, HostListener, TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { Globales } from '../../shared/globales/globales';


@Component({
  selector: 'app-cuentasterceros',
  templateUrl: './cuentasterceros.component.html',
  styleUrls: ['./cuentasterceros.component.scss']
})
export class CuentastercerosComponent implements OnInit {
  Tercero = [];
  ListaTercero = [];
  fechasGraficas = []

  constructor(private http: HttpClient, private globales: Globales) { }

  ngOnInit() {
    this.http.get(this.globales.ruta + '/php/clientes/grafica_clientes.php').subscribe((data: any) => {
      this.ListaTercero = data;
    });

    this.http.get(this.globales.ruta + '/php/clientes/grafica_clientes.php').subscribe((data: any) => {
    });
  }
}
