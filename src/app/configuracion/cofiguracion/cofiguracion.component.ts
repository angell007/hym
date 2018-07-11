import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cofiguracion',
  templateUrl: './cofiguracion.component.html',
  styleUrls: ['./cofiguracion.component.css']
})
export class CofiguracionComponent implements OnInit {

  public configuracion : any[];

  readonly ruta = 'https://hym.corvuslab.co/'; 
  constructor(private http : HttpClient) { }

  ngOnInit() {
    this.http.get(this.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Configuracion'}}).subscribe((data:any)=>{
      this.configuracion= data;
      console.log(this.configuracion);
      
    });
  }

}
