import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-informaciongiros',
  templateUrl: './informaciongiros.component.html',
  styleUrls: ['./informaciongiros.component.scss']
})
export class InformaciongirosComponent implements OnInit {


  public GirosRemitentes : any[];
  public GirosDestinatarios : any[];


  readonly ruta = 'https://hym.corvuslab.co/'; 

  constructor(private http : HttpClient) { }

  ngOnInit() {
    //this.ActualizarVista();
    this.http.get(this.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Giro_Remitente'}}).subscribe((data:any)=>{
      this.GirosRemitentes= data;
    });

    this.http.get(this.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Giro_Destinatario'}}).subscribe((data:any)=>{
      this.GirosDestinatarios= data;
    });
  }

}
