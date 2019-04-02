import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Globales } from '../../shared/globales/globales';
import { Router } from '@angular/router';

@Component({
  selector: 'app-balancegeneral',
  templateUrl: './balancegeneral.component.html',
  styleUrls: ['./balancegeneral.component.scss']
})
export class BalancegeneralComponent implements OnInit {

  constructor(private http: HttpClient, private globales: Globales, private router: Router) { }

  ListaBalance = [];
  ngOnInit() {
    this.http.get(this.globales.ruta + 'php/Indicadores/balancegeneral/lista_balance_nuevo.php').subscribe((data: any) => {
      this.ListaBalance = data;
    });
  }

}
