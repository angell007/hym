import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../shared/globales/globales';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.scss']
})
export class ComprasComponent implements OnInit {

  public fecha = new Date(); 
  public compras = [];
  constructor(private http : HttpClient, private globales : Globales) { }

  ngOnInit() {
    this.http.get(this.globales.ruta+'php/compras/lista.php').subscribe((data:any)=>{
      this.compras = data;
    });
  }

}