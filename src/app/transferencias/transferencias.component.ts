import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TouchSequence } from '../../../node_modules/@types/selenium-webdriver';
import { Globales } from '../shared/globales/globales';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-transferencias',
  templateUrl: './transferencias.component.html',
  styleUrls: ['./transferencias.component.css']
})
export class TransferenciasComponent implements OnInit {

  public fecha = new Date(); 
  transferencias = [];
  conteoTransferencias = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  
  @ViewChild('ModalVerDestinatario') ModalVerDestinatario:any;
  @ViewChild('ModalEditarDestinatario') ModalEditarDestinatario:any;
  @ViewChild('ModalDestinatario') ModalDestinatario:any;
  @ViewChild('FormDestinatario') FormDestinatario:any;
  @ViewChild('errorSwal') errorSwal:any;
  @ViewChild('saveSwal') saveSwal:any;
  @ViewChild('deleteSwal') deleteSwal:any;
  @ViewChild('bloqueoSwal') bloqueoSwal:any;  

  constructor(private http : HttpClient, private globales: Globales) { }

  ngOnInit() {
    this.http.get(this.globales.ruta+'php/transferencias/lista.php').subscribe((data:any)=>{
      this.transferencias= data;
      this.dtTrigger.next();
    });

    this.http.get(this.globales.ruta+'php/transferencias/conteo.php').subscribe((data:any)=>{
      this.conteoTransferencias= data[0];     
    });

    
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      dom: 'Bfrtip',
      responsive: true,
      /* below is the relevant part, e.g. translated to spanish */
      language: {
        processing: "Procesando...",
        search: "Buscar:",
        lengthMenu: "Mostrar _MENU_ &eacute;l&eacute;ments",
        info: "Mostrando desde _START_ al _END_ de _TOTAL_ elementos",
        infoEmpty: "Mostrando ningún elemento.",
        infoFiltered: "(filtrado _MAX_ elementos total)",
        infoPostFix: "",
        loadingRecords: "Cargando registros...",
        zeroRecords: "No se encontraron registros",
        emptyTable: "No hay datos disponibles en la tabla",
        paginate: {
          first: "<<",
          previous: "<",
          next: ">",
          last: ">>"
        },
        aria: {
          sortAscending: ": Activar para ordenar la tabla en orden ascendente",
          sortDescending: ": Activar para ordenar la tabla en orden descendente"
        }
      }
    };
  }

  ActualizarVista()
  {
    this.http.get(this.globales.ruta+'php/transferencias/lista.php').subscribe((data:any)=>{
      this.transferencias= data;
    });

    this.http.get(this.globales.ruta+'php/transferencias/conteo.php').subscribe((data:any)=>{
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

  BloquearCuenta(id, estado){
    let datos = new FormData();
    datos.append("modulo", 'Transferencia');
    datos.append("id", id);
    datos.append("estado", estado);
    datos.append("funcionario", JSON.parse(localStorage['User']).Identificacion_Funcionario);
    this.http.post(this.globales.ruta + 'php/transferencias/bloquear_transferencia.php', datos ).subscribe((data: any) => {
      this.bloqueoSwal.show();
      this.ActualizarVista();
    });
  }

  Bloqueado(estado){
    switch(estado){
      case "Si":{ return false}
      case "No":{ return true}
    }
  }

  Desbloqueado(estado){
    switch(estado){
      case "Si":{ return true}
      case "No":{ return false}
    }
  }

}
