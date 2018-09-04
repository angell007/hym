import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { html } from 'd3';
import { Globales } from '../../shared/globales/globales';
import { Subject } from 'rxjs';
import { log } from 'util';

@Component({
  selector: 'app-monedas',
  templateUrl: './monedas.component.html',
  styleUrls: ['./monedas.component.scss'],
})
export class MonedasComponent implements OnInit {

  public Monedas: any[];

  @ViewChild('errorSwal') errorSwal: any;
  @ViewChild('deleteSwal') deleteSwal: any;
  @ViewChild('saveSwal') saveSwal: any;
  @ViewChild('ModalVerMoneda') ModalVerMoneda: any;
  @ViewChild('ModalEditarMoneda') ModalEditarMoneda: any;
  @ViewChild('ModalMoneda') ModalMoneda: any;
  @ViewChild('FormMoneda') FormMoneda: any;

  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  Campos = [];
  public Bandera = "";
  public cabecera = true;
  Moneda = [];
  MonedaValor = [];
  Identificacion: any;
  Mensaje=[];
  Error: boolean = false;
  Boton: boolean = false;

  constructor(private http: HttpClient, private globales: Globales) { }

  ngOnInit() {
    this.ActualizarVista();    
  }


  ActualizarVista() {
    this.http.get(this.globales.ruta+'/php/configuracion/lista_moneda_campo.php').subscribe((data:any)=>{
      this.Campos= data;
    });
    this.http.get(this.globales.ruta + 'php/monedas/lista_monedas.php').subscribe((data: any) => {
      this.Monedas = data;
      this.dtTrigger.next();
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

  agregarValor(pos,valor){
    this.Campos[pos].Valor = valor;
     
    let precioVentaEfectivoMax = this.Campos[0].Valor;
    let precioVentaEfectivoMin = this.Campos[1].Valor;
    let precioVentaMaxCta = this.Campos[2].Valor;
    let precioVentaMinCta = this.Campos[3].Valor;
    let precioCompraMax = this.Campos[5].Valor;
    let precioCompraMin = this.Campos[6].Valor;
    // pregunto si el precio es mayor que 0 en venta
    if(precioVentaEfectivoMax > 0 && precioVentaEfectivoMin  ){
      // pregunto su el precio de compra es mayor que 0
      if(precioCompraMax > 0 && precioCompraMin > 0 ){
        //pregunto si el precio de compra está dentro del rango del precio de venta
        this.Mensaje = [];

        if( (parseFloat(precioVentaEfectivoMax) > parseFloat(precioCompraMax)) && (parseFloat(precioVentaEfectivoMin) > parseFloat(precioCompraMin)) ){
          this.Error = false;
          this.Boton = true;
        }else{
          if((precioVentaEfectivoMax > precioCompraMax) === false){
            this.Mensaje.push("El precio de compra maxima es superior al precio de venta efectivo maximo ");
            this.Error = true;
            this.Boton = false;
          }else{}
          
          if((precioVentaEfectivoMin < precioCompraMin) === false){
            this.Mensaje.push("El precio de compra minima es superior al precio de venta efectivo minimo");
            this.Error = true;
            this.Boton = false;
          }          
        }

        if((parseFloat(precioVentaMaxCta) > parseFloat(precioCompraMax)) && (parseFloat(precioVentaMinCta) > parseFloat(precioCompraMin)) ){
          this.Error = false;
          this.Boton = true;
        }else{
          if((precioVentaMaxCta > precioCompraMax) === false){
            this.Mensaje.push("El precio de compra maxima es superior al precio de venta cuenta maximo ");
            this.Error = true;
            this.Boton = false;
          }else{
            this.Mensaje.push("El precio de compra maxima es superior al precio de venta cuenta maximo ");
            this.Error = true;
            this.Boton = false;
          }
        }

        
       
      }
      
    }

  }

  GuardarMoneda(formulario: NgForm, modal) {
    let info = JSON.stringify(formulario.value);
    let valor = JSON.stringify(this.Campos);
    let datos = new FormData();
    datos.append("datos", info);
    datos.append("valor", valor);
    this.http.post(this.globales.ruta + 'php/configuracion/guardar_moneda_valor.php', datos)
      .subscribe((data: any) => {
        this.ActualizarVista();
        this.saveSwal.show();
        modal.hide();
      });
  }

  EliminarMoneda(id) {
    let datos = new FormData();
    datos.append("modulo", 'Moneda');
    datos.append("id", id);
    this.http.post(this.globales.ruta + 'php/genericos/eliminar_generico.php', datos).subscribe((data: any) => {
      this.ActualizarVista();
      this.deleteSwal.show();
    });
  }

  EditarMoneda(id, modal) {
    this.http.get(this.globales.ruta + 'php/configuracion/detalle_moneda_valor.php', {
      params: {id: id }
    }).subscribe((data: any) => {
      console.log(data);
      this.Identificacion = id;
      this.Moneda = data.Moneda;
      this.Campos = data.MonedaValor;
      modal.show();
    });
  }

  titulo(valor) {
    if (valor != this.Bandera) {
      this.Bandera = valor;
      this.cabecera = true;
      return true;
    } else {
      this.cabecera = false;
      return false;
    }
  }

  

}