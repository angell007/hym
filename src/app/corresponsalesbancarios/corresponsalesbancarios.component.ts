import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-corresponsalesbancarios',
  templateUrl: './corresponsalesbancarios.component.html',
  styleUrls: ['./corresponsalesbancarios.component.css']
})
export class CorresponsalesbancariosComponent implements OnInit {

  readonly ruta = 'https://hym.corvuslab.co/'; 
  public fecha = new Date(); 
  public corresponsales = [];
  constructor(private http : HttpClient) { }

  ngOnInit() {
    this.http.get(this.ruta+'php/corresponsalesbancarios/lista.php').subscribe((data:any)=>{
      this.corresponsales= data;
    });
  }

}