import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild, HostListener, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Globales } from '../../shared/globales/globales';

@Component({
  selector: 'app-perfilcrear',
  templateUrl: './perfilcrear.component.html',
  styleUrls: ['./perfilcrear.component.scss']
})
export class PerfilcrearComponent implements OnInit {

  constructor(private http : HttpClient, private globales : Globales) { }

  ngOnInit() {
  }

}
