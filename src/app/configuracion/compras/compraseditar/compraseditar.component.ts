import { Component, OnInit, ViewChild } from '@angular/core';
import { Globales } from '../../../shared/globales/globales';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { SwalComponent } from "@toverux/ngx-sweetalert2";
import { NgForm } from '../../../../../node_modules/@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-compraseditar',
  templateUrl: './compraseditar.component.html',
  styleUrls: ['./compraseditar.component.scss']
})
export class CompraseditarComponent implements OnInit {

  ComprasPendientes = [];
  ListarCompra = [];
  Proveedores = [];
  CompraEditar =[];

  public id = this.route.snapshot.params["id"];

  constructor(private http: HttpClient, private globales: Globales, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.http.get(this.globales.ruta + 'php/compras/compras_no_verificadas.php').subscribe((data: any) => {
      this.ComprasPendientes = data;
    });
    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Tercero' } }).subscribe((data: any) => {
      this.Proveedores = data;
    });

    this.http.get(this.globales.ruta + '/php/genericos/detalle.php', { params: { modulo: 'Compra' , id : this.id } }).subscribe((data: any) => {
      this.CompraEditar = data;
      this.TotalCompra = data.Valor_Compra;
      this.tasa = data.Valor_Peso;
      var proveedor = this.Proveedores.findIndex(x => x.Id_Tercero === data.Id_Tercero);
      this.nombre = this.Proveedores[proveedor].Nombre;
      
    });

    this.http.get(this.globales.ruta + 'php/compras/compras_realizadas_edicion.php', { params: { modulo: 'Compra' , id : this.id } }).subscribe((data: any) => {
      this.ListarCompra = data;
    });
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

  ListaCompraEliminada = [];
  rectificar(pos,i) {
    this.ListarCompra.forEach((element,index) => {
      if(element.editable == "editable" && index == i){
        this.ListarCompra[index].editable="editado";
        this.ListaCompraEliminada.push(element);
      }
    });   

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
    let egresos = JSON.stringify(this.ListaCompraEliminada);   

    let datos = new FormData();
    datos.append("datos", info);
    datos.append("compras_proveedor", cuentas);
    datos.append("Id_Compra", this.id);
    datos.append("Compras_Egresos", egresos);
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
