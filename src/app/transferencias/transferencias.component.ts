import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-transferencias',
  templateUrl: './transferencias.component.html',
  styleUrls: ['./transferencias.component.css']
})
export class TransferenciasComponent implements OnInit {

  readonly ruta = 'https://hym.corvuslab.co/'; 
  public fecha = new Date(); 

  transferencias = [];
  constructor(private http : HttpClient) { }

  ngOnInit() {
    this.http.get(this.ruta+'php/transferencias/lista.php').subscribe((data:any)=>{
      this.transferencias= data;
    });
  }

}
