import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { html } from 'd3';
import { Globales } from '../../shared/globales/globales';
import { Subject } from 'rxjs';
import { log } from 'util';

@Component({
  selector: 'app-monedas',
  templateUrl: './monedas.component.html',
  styleUrls: ['./monedas.component.scss'],
})
export class MonedasComponent implements OnInit {

  constructor() { }

  ngOnInit() {  
  } 

}