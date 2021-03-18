import { HttpClient } from '@angular/common/http';
import { Component, OnInit,ViewChild } from '@angular/core';
import { Globales } from '../shared/globales/globales';

@Component({
  selector: 'app-pago-agentes-externos',
  templateUrl: './pago-agentes-externos.component.html',
  styleUrls: ['./pago-agentes-externos.component.scss']
})
export class PagoAgentesExternosComponent implements OnInit {
  Cargando = false;
  pagos:any = [];
  @ViewChild('confirmSwal') confirmSwal: any;
  
  public limit = 5;
  public currentPage = 1;
  public numReg = 0;


  constructor(public globales:Globales , public http:HttpClient) { }

  ngOnInit() {
    this.GetRegistroPagos();
  }

  GetRegistroPagos() {

    let params = {
      limit: this.limit.toString(),
      currentPage: this.currentPage.toString(),
    };
    this.Cargando = true;
    this.http
      .get(
        this.globales.ruta +
          'php/agentesexternos/get_registro_pagos_agente_externo.php',
        { params }
      )
      .subscribe((d: any) => {
        this.pagos = d.data;
        this.numReg = d.numReg;
        this.Cargando = false;
      });
  }

  CambiarEstado(pago,estado){
  
    let form = new FormData();
    form.append('Id_Pago_Cupo_Agente_Externo',pago.Id_Pago_Cupo_Agente_Externo);
    form.append('Valor',pago.Valor);
    form.append('Id_Agente_Externo',pago.Id_Agente_Externo);
    form.append('Estado',estado);

    this.http
    .post (
      this.globales.ruta +
        'php/agentesexternos/aprobar_pago_agente_externo.php',
  form
    )
    .subscribe((d: any) => {
       
      this.confirmSwal.title = d.title;
      this.confirmSwal.text = d.text;
      this.confirmSwal.type = d.type;
      this.confirmSwal.show();
      this.GetRegistroPagos();
    });
  }

}
