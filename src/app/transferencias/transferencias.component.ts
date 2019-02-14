import '../../assets/charts/amchart/amcharts.js';
import '../../assets/charts/amchart/gauge.js';
import '../../assets/charts/amchart/pie.js';
import '../../assets/charts/amchart/serial.js';
import '../../assets/charts/amchart/light.js';
import '../../assets/charts/amchart/ammap.js';
import '../../assets/charts/amchart/worldLow.js';
import '../../assets/charts/amchart/continentsLow.js';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TouchSequence } from '../../../node_modules/@types/selenium-webdriver';
import { Globales } from '../shared/globales/globales';
import { Subject } from 'rxjs';
import { NgForm } from '@angular/forms';
import { TransferenciaService } from '../shared/services/transferencia/transferencia.service';

@Component({
  selector: 'app-transferencias',
  templateUrl: './transferencias.component.html',
  styleUrls: ['./transferencias.component.css']
})
export class TransferenciasComponent implements OnInit {

  @ViewChild('ModalVerTransferencia') ModalVerTransferencia:any;

  public fecha = new Date();
  public transferencias = [];
  public DetalleTransferencia = {
    Fecha:'',
    Recibo:'',
    Tipo:'',
    Codigo_Moneda_Origen:'',
    Codigo_Moneda_Destino:'',
    Valor_Origen:'',
    Valor_Destino:'',
    Estado:''
  };

  public DatosPago:any = {};
  public DatosDevolucion:any = {};
  public Destinatarios:Array<any> = [];

  public ShowDatosPago:boolean = false;
  public ShowDestinatarios:boolean = false;
  public ShowDatosDevolucion:boolean = false;

  constructor(private http: HttpClient, private globales: Globales, private tService:TransferenciaService) {
    this.GetTransferencias();
   }

  ngOnInit() {

  }

  GetTransferencias(){
    this.tService.getAllTransferencias().subscribe((data:any)=> {
      this.transferencias = data;
    });
  }

  GetDetalleTransferencia(id){
    this.tService.getDetalleTransferencia(id).subscribe((data:any)=> {
      console.log(data);
      
      if (data.transferencia != '') {
        this.DetalleTransferencia = data.transferencia;

        this.Destinatarios = data.transferencia.Destinatarios;
        this.DatosPago = data.transferencia.DatosPago;
        this.DatosDevolucion = data.transferencia.DatosDevolucion;

        this.ModalVerTransferencia.show();
      }else{


      }
      
    });
  }
}
