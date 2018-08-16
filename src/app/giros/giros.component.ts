import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-giros',
  templateUrl: './giros.component.html',
  styleUrls: ['./giros.component.css']
})
export class GirosComponent implements OnInit {

  readonly ruta = 'https://hym.corvuslab.co/'; 
  public fecha = new Date(); 
  public giros = [];

  conteoGiros = [];

  constructor(private http : HttpClient) { }

  ngOnInit() {
    this.http.get(this.ruta+'php/giros/lista.php').subscribe((data:any)=>{
      this.giros= data;
    });

    this.http.get(this.ruta+'php/giros/conteo.php').subscribe((data:any)=>{
      this.conteoGiros= data[0];     
    });
  }

}
