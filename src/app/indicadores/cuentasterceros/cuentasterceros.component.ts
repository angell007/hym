import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../shared/globales/globales';
import { Subject } from 'rxjs';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-cuentasterceros',
  templateUrl: './cuentasterceros.component.html',
  styleUrls: ['./cuentasterceros.component.scss']
})
export class CuentastercerosComponent implements OnInit {
  Tercero = [];
 
  constructor(private http: HttpClient, private globales: Globales) { }

  ngOnInit() {
    this.http.get(this.globales.ruta + 'php/movimientos/movimiento_tercero.php').subscribe((data: any) => {
     this.Tercero = data;    
    });
  }

}
