import { Component, OnInit, ViewChild, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../shared/globales/globales';

@Component({
  selector: 'app-tablatotalesmonedas',
  templateUrl: './tablatotalesmonedas.component.html',
  styleUrls: ['./tablatotalesmonedas.component.scss']
})
export class TablatotalesmonedasComponent implements OnInit, OnChanges {

  @Input() MostrarTotales:Array<any> = [];

  public TColspan:number = 1;
  public Renderizar:boolean = false;

  constructor(public globales:Globales, private client:HttpClient) { }

  ngOnChanges(changes:SimpleChanges){
    this.MostrarTotales = [];    
    this.MostrarTotales = changes.MostrarTotales.currentValue;
    console.log(this.MostrarTotales);
    
  }

  ngOnInit() {
    this.TColspan = this.MostrarTotales.length;    
  }

}
