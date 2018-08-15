import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TouchSequence } from '../../../node_modules/@types/selenium-webdriver';
import { Globales } from '../shared/globales/globales';

@Component({
  selector: 'app-transferencias',
  templateUrl: './transferencias.component.html',
  styleUrls: ['./transferencias.component.css']
})
export class TransferenciasComponent implements OnInit {

  readonly ruta = 'https://hym.corvuslab.co/'; 
  public fecha = new Date(); 

  transferencias = [];
  conteoTransferencias = [];
  
  @ViewChild('ModalVerDestinatario') ModalVerDestinatario:any;
  @ViewChild('ModalEditarDestinatario') ModalEditarDestinatario:any;
  @ViewChild('ModalDestinatario') ModalDestinatario:any;
  @ViewChild('FormDestinatario') FormDestinatario:any;
  @ViewChild('errorSwal') errorSwal:any;
  @ViewChild('saveSwal') saveSwal:any;
  @ViewChild('deleteSwal') deleteSwal:any;

  constructor(private http : HttpClient, private globales: Globales) { }

  ngOnInit() {
    this.http.get(this.ruta+'php/transferencias/lista.php').subscribe((data:any)=>{
      this.transferencias= data;
    });

    this.http.get(this.ruta+'php/transferencias/conteo.php').subscribe((data:any)=>{
      this.conteoTransferencias= data[0];     
    });
  }

  ActualizarVista()
  {
    this.http.get(this.ruta+'php/transferencias/lista.php').subscribe((data:any)=>{
      this.transferencias= data;
    });

    this.http.get(this.ruta+'php/transferencias/conteo.php').subscribe((data:any)=>{
      this.conteoTransferencias= data[0];     
    });
  }

  VerDestinatario(id, modal){
    this.http.get(this.globales.ruta+'php/transferencias/detalle.php',{
      params:{id:id}
    }).subscribe((data:any)=>{
      /*ARREGLAR
      this.Identificacion = id;
      this.Nombre = data.Nombre;
      this.Cuentas = data.Cuentas;
      this.Banco = data.Banco; 
      this.Pais = data.Pais;
      this.Detalle = data.Detalle;*/
      modal.show();
    });
  }

  EliminarTransferencia(id){
    let datos = new FormData();
    datos.append("modulo", 'Transferencia');
    datos.append("id", id); 
    this.http.post(this.globales.ruta + 'php/transferencias/anular.php', datos ).subscribe((data: any) => {
      this.deleteSwal.show();
      this.ActualizarVista();
    });
  }

}
