import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-serviciosexternos',
  templateUrl: './serviciosexternos.component.html',
  styleUrls: ['./serviciosexternos.component.css']
})
export class ServiciosexternosComponent implements OnInit {

  readonly ruta = 'https://hym.corvuslab.co/'; 
  public fecha = new Date(); 
  public serviciosexternos = [];
  constructor(private http : HttpClient) { }

  ngOnInit() {
    this.http.get(this.ruta+'php/serviciosexternos/lista.php').subscribe((data:any)=>{
      this.serviciosexternos= data;
    });
  }

}