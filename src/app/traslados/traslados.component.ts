import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-traslados',
  templateUrl: './traslados.component.html',
  styleUrls: ['./traslados.component.css']
})
export class TrasladosComponent implements OnInit {

  readonly ruta = 'https://hym.corvuslab.co/'; 
  public fecha = new Date(); 
  traslados = [];
  
  constructor(private http : HttpClient) { }

  ngOnInit() {
    this.http.get(this.ruta+'php/traslados/lista.php').subscribe((data:any)=>{
      this.traslados= data;
    });
  }

}
