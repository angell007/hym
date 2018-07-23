import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.scss']
})
export class ComprasComponent implements OnInit {

  readonly ruta = 'https://hym.corvuslab.co/'; 
  public fecha = new Date(); 
  public compras = [];
  constructor(private http : HttpClient) { }

  ngOnInit() {
    this.http.get(this.ruta+'php/compras/lista.php').subscribe((data:any)=>{
      this.compras = data;
    });
  }

}