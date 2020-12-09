import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Globales } from '../../shared/globales/globales';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-cuentasbancarias',
  templateUrl: './cuentasbancarias.component.html',
  styleUrls: ['./cuentasbancarias.component.css']
})
export class CuentasbancariasComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
