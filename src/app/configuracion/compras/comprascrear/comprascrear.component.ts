import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Globales } from '../../../shared/globales/globales';
import { Router, ActivatedRoute } from '@angular/router';
import { TerceroService } from '../../../shared/services/tercero/tercero.service';
import { ProveedorService } from '../../../shared/services/proveedor/proveedor.service';
import { CambioService } from '../../../shared/services/cambio.service';
import { CompraService } from '../../../shared/services/compra/compra.service';

@Component({
  selector: 'app-comprascrear',
  templateUrl: './comprascrear.component.html',
  styleUrls: ['./comprascrear.component.scss']
})
export class ComprascrearComponent implements OnInit {

  ComprasPendientes = [];
  ListarCompra = [];

  @ViewChild('mensajeSwal') mensajeSwal: any;
  @ViewChild('alertSwal') alertSwal: any;

  public Funcionario:any = JSON.parse(localStorage['User']);

  public Monedas:Array<any> = [];
  public Proveedores:Array<any> = [];
  public ListaComprasSeleccionadas:any = [];

  public CodigoMoneda:string = '';

  public CompraModel:any = {
    Id_Compra: '',
    Codigo: '',
    Id_Tercero: '',
    Valor_Compra: 0,
    Tasa: '',
    Valor_Peso: 0,
    Detalle: '',
    Id_Moneda_Compra: '',
    Id_Funcionario: this.Funcionario.Identificacion_Funcionario
  };

  constructor(private http: HttpClient, 
              private globales: Globales, 
              private router: Router, 
              private terceroService:ProveedorService,
              private cambioService:CambioService,
              private compraService:CompraService,
              private activeRoute:ActivatedRoute) {     
  }

  ngOnInit() {
    setTimeout(() => {      
      this.AsignarMonedas();
      this.GetProveedores();
    }, 2000);

    /*this.http.get(this.globales.ruta + 'php/compras/compras_no_verificadas.php').subscribe((data: any) => {
      this.ComprasPendientes = data;
    });*/
    /*this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Tercero' } }).subscribe((data: any) => {
      this.Proveedores = data;
    });*/
  }

  ngAfterViewInit() {
    //    (document.getElementById("GenerarCompra") as HTMLInputElement).disabled = true;
  }

  AsignarMonedas(){
    this.globales.Monedas.forEach(moneda => {
      if (moneda.Nombre != 'Pesos') {
        this.Monedas.push(moneda);     
      }
    });
  }

  GetProveedores(){
    this.terceroService.getP().subscribe((data:any) => {
      this.Proveedores = data.terceros;
    });
  }  

  SetCodigoMoneda(){
    if (this.CompraModel.Id_Moneda_Compra != '') {
      
      let monedaObj = this.Monedas.find(m => m.Id_Moneda == this.CompraModel.Id_Moneda_Compra);
      this.CodigoMoneda = monedaObj.Codigo;
    }else{

      this.CodigoMoneda = '';
    }
  }

  ActualizarValoresCompra(valores:Array<any>){
    this.CompraModel.Valor_Compra = 0;

    if (valores.length > 0) {

      this.ListaComprasSeleccionadas = valores;
      
      valores.forEach(compra => {
        this.CalcularValorCompra(parseFloat(compra.Valor));
      });

      if (this.CompraModel.Tasa != '') {
        this.CalcularCambio();
      }
    }else{

      this.CompraModel.Valor_Peso = 0;
      this.ListaComprasSeleccionadas = [];
    }
  }

  CalcularValorCompra(valor:number){
    let suma = parseFloat(this.CompraModel.Valor_Compra) + valor;
    this.CompraModel.Valor_Compra = suma.toFixed(2);
  }

  CalcularCambio(){
    let tasa = this.CompraModel.Tasa;

    console.log(tasa);

    if (tasa == '' || tasa === undefined || tasa === null) {
      this.ShowSwal('warning', 'Alerta', 'Debe colocar una tasa de cambio para la conversión!');
      this.CompraModel.Valor_Peso = 0;

    }else{

      if (this.CompraModel.Valor_Compra != 0) {

        let cambio = this.cambioService.CambioMonedaXPeso(this.CompraModel.Valor_Compra, parseFloat(tasa));
        this.CompraModel.Valor_Peso = cambio;
      }else{

        this.ShowSwal('warning', 'Alerta', 'Debe escoger compras para poder realizar el cálculo!');
      }      
    }
  }

  ValidateCompraBeforeSubmit():boolean{
    if (this.CompraModel.Id_Moneda == '') {
      this.ShowSwal('warning', 'Alerta', 'Debe escoger la moneda para guardar los datos!');
      return false;
    }

    if (this.CompraModel.Id_Tercero == '') {
      this.ShowSwal('warning', 'Alerta', 'Debe escoger el tercero para guardar los datos!');
      return false;
    }

    if (this.CompraModel.Valor_Compra == 0) {
      this.ShowSwal('warning', 'Alerta', 'Ha ocurrido un imprevisto con el valor de la compra, verifique los datos antes de guardar!');
      return false;
    }

    if (this.CompraModel.Tasa == '') {
      this.ShowSwal('warning', 'Alerta', 'Debe colocar una tasa de cambio para guardar los datos!');
      return false;
    }else if(this.CompraModel.Tasa != ''){
      if (parseFloat(this.CompraModel.Tasa) < 0) {
        this.ShowSwal('warning', 'Alerta', 'La tasa de cambio no puede ser negativa, corrija el valor de la tasa!');
        return false; 
      }
    }

    if (this.CompraModel.Valor_Peso == 0) {
      this.ShowSwal('warning', 'Alerta', 'Ha ocurrido un imprevisto con el valor en pesos, verifique los datos antes de guardar!');
      return false;
    }

    if (this.ListaComprasSeleccionadas.length == 0) {
      this.ShowSwal('warning', 'Alerta', 'No hay compras seleccionadas para guardar los datos, verifique por favor!');
      return false;
    }

    return true;
  }

  GuardarCompra(){
    if (this.ValidateCompraBeforeSubmit()) {
      this.CompraModel.Tasa = this.CompraModel.Tasa.toString();
      console.log(this.CompraModel);
      
      let data = new FormData();
      let info = JSON.stringify(this.CompraModel);
      let compras = JSON.stringify(this.ListaComprasSeleccionadas);

      data.append("modelo", info);
      data.append("compras", compras);
      this.compraService.guardarCompra(data).subscribe((data:any) => {

        this.ShowSwal('success', 'Regisro Exitoso', 'Compra generada de manera exitosa!');
        this.LimpiarCompraModel();

        setTimeout(() => {
          this.router.navigate(['/compras']);
        }, 1000);
      });
    }
  }

  LimpiarCompraModel(clearCoin:boolean = false){
    this.CompraModel = {
      Id_Compra: '',
      Codigo: '',
      Id_Tercero: '',
      Valor_Compra: 0,
      Tasa: '',
      Valor_Peso: 0,
      Detalle: '',
      Id_Moneda_Compra: clearCoin ? '' : this.CompraModel.Id_Moneda_Compra,
      Id_Funcionario: this.Funcionario.Identificacion_Funcionario
    };

    this.ListaComprasSeleccionadas = [];
  }

  MostrarMensajeTabla(msgObj:any){
    this.ShowSwal(msgObj.type, msgObj.title, msgObj.msg);
  }

  ShowSwal(tipo:string, titulo:string, msg:string){
    this.alertSwal.type = tipo;
    this.alertSwal.title = titulo;
    this.alertSwal.text = msg;

    this.alertSwal.show();
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

  validarGuardar(valor) {
    /*if(valor > 0 ){
      (document.getElementById("GenerarCompra") as HTMLInputElement).disabled = false;
    }else{
      (document.getElementById("GenerarCompra") as HTMLInputElement).disabled = true;
    }*/
  }

  tasa: any;
  calcularValorMoneda(value) {

    if (value == "" || value == undefined) {
      this.tasa = 0.0;
    } else {
      this.tasa = (parseFloat(this.TotalCompra) * parseFloat(value));
    }
  }

  /*GuardarCompra(formulario: NgForm) {

    if (this.TotalCompra == 0 || this.TotalCompra == undefined || this.nombre == "" || this.nombre == null) {
      this.mensajeSwal.title = "Error al guardar";
      this.mensajeSwal.text = "Hay valores que no han sido digitados, rellene todos los campos e incluya las compras necesarias para poder continuar";
      this.mensajeSwal.type = "error";
      this.mensajeSwal.show();
    } else {
      let info = JSON.stringify(formulario.value);
      let cuentas = JSON.stringify(this.ListarCompra);

      let datos = new FormData();
      datos.append("datos", info);
      datos.append("compras_proveedor", cuentas);
      datos.append("Nombre_Proveedor", this.nombre);
      this.http.post(this.globales.ruta + 'php/compras/guardar_compra.php', datos)
        .subscribe((data: any) => {
          formulario.reset();
          this.mensajeSwal.title = "Compra generada";
          this.mensajeSwal.text = "Se ha generado la compra correctamente";
          this.mensajeSwal.type = "success";
          this.mensajeSwal.show();
          this.router.navigate(['/compras']);
        });
    }
  }*/

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
