import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cajas-abiertas',
  templateUrl: './cajas-abiertas.component.html',
  styleUrls: ['./cajas-abiertas.component.scss']
})
export class CajasAbiertasComponent implements OnInit {

  public Fecha_inicio: any = '';
  public Fecha_fin: any = '';
  public FechaActual: string = '';

  constructor() { }

  ngOnInit() {

    this.InicializarFecha();

  }

  InicializarFecha() {
    let d = new Date();
    this.FechaActual = d.toISOString().split("T")[0];
    this.Fecha_inicio = d.toISOString().split("T")[0];
    this.Fecha_fin = d.toISOString().split("T")[0];
  }


}
