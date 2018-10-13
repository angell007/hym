import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Globales } from '../../../shared/globales/globales';
import { Router } from '@angular/router';

@Component({
  selector: 'app-comprascrear',
  templateUrl: './comprascrear.component.html',
  styleUrls: ['./comprascrear.component.scss']
})
export class ComprascrearComponent implements OnInit {

  ComprasPendientes = [];
  ListarCompra = [];
  Proveedores = [];

  constructor(private http: HttpClient, private globales: Globales, private router: Router) { }

  ngOnInit() {
    this.http.get(this.globales.ruta + 'php/compras/compras_no_verificadas.php').subscribe((data: any) => {
      this.ComprasPendientes = data;
    });
    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Tercero' } }).subscribe((data: any) => {
      this.Proveedores = data;
    });
  }

  ngAfterViewInit(){
    (document.getElementById("GenerarCompra") as HTMLInputElement).disabled = true;
  }

  TotalCompra: any;
  cambiarEstado(pos) {
    var posItem = this.ComprasPendientes.findIndex(x => x.Id_Compra_Cuenta === pos);
    this.ListarCompra.push(this.ComprasPendientes[posItem]);
    this.ComprasPendientes.splice(posItem, 1);

    var suma = 0;
    this.ListarCompra.forEach((element) => {
      suma += Number(element.Valor);
    });

    this.TotalCompra = suma;
    var tasa = (document.getElementById("Tasa") as HTMLInputElement).value;
    if (tasa == "") {
      tasa = "0";
    }
    this.tasa = this.TotalCompra * Number(tasa);
    this.validarGuardar(this.tasa);
  }

  rectificar(pos) {
    var posItem = this.ListarCompra.findIndex(x => x.Id_Compra_Cuenta === pos);
    this.ComprasPendientes.push(this.ListarCompra[posItem]);
    this.ListarCompra.splice(posItem, 1);

    var suma = 0;
    this.ListarCompra.forEach((element) => {
      suma += Number(element.Valor);
    });

    this.TotalCompra = suma;
    var tasa = (document.getElementById("Tasa") as HTMLInputElement).value;
    if (tasa == "") {
      tasa = "0";
    }
    this.tasa = this.TotalCompra * Number(tasa);
    this.validarGuardar(this.tasa);
  }

  validarGuardar(valor){
    if(valor > 0 ){
      (document.getElementById("GenerarCompra") as HTMLInputElement).disabled = false;
    }else{
      (document.getElementById("GenerarCompra") as HTMLInputElement).disabled = true;
    }
  }

  tasa: any;
  calcularValorMoneda(value) {

    if (value == "" || value == undefined) {
      this.tasa = 0.0;
    } else {
      this.tasa = (parseFloat(this.TotalCompra) * parseFloat(value));
    }
  }

  GuardarCompra(formulario: NgForm) {

    let info = JSON.stringify(formulario.value);
    let cuentas = JSON.stringify(this.ListarCompra);

    let datos = new FormData();
    datos.append("datos", info);
    datos.append("compras_proveedor", cuentas);
    datos.append("Nombre_Proveedor", this.nombre);
    this.http.post(this.globales.ruta + 'php/compras/guardar_compra.php', datos)
      .subscribe((data: any) => {
        formulario.reset();
        /*this.saveSwal.show();
        this.ActualizarVista();*/
        this.router.navigate(['/compras']);
      });
  }

  nombre: any;
  nombreProveedor(valor) {
    if (valor != "") {
      var proveedor = this.Proveedores.findIndex(x => x.Id_Tercero === valor);
      this.nombre = this.Proveedores[proveedor].Nombre;
    } else {
      this.nombre = "";
    }
  }

}
