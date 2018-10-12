import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Globales } from '../../shared/globales/globales';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.scss']
})
export class ComprasComponent implements OnInit {

  public fecha = new Date();
  public compras = [];
  public Proveedores = [];
  public Funcionarios = [];

  //variables que hacen referencia a los campos del formulario editar   

  public Identificacion: any;
  public Proveedor: any[];
  public Valor: any[];
  public TasaCambio: any[];
  public Funcionario: any[];

  public boolProveedor: boolean = false;
  public boolValor: boolean = false;
  public boolTasaCambio: boolean = false;
  public boolFuncionario: boolean = false;

  //Valores por defecto
  proveedorDefault: string = "";
  funcionarioDefault: string = "";

  rowsFilter = [];
  tempFilter = [];

  @ViewChild('ModalCompra') ModalCompra: any;
  @ViewChild('ModalVerCompra') ModalVerCompra: any;
  @ViewChild('ModalEditarCompra') ModalEditarCompra: any;
  @ViewChild('FormCompra') FormCompra: any;
  @ViewChild('errorSwal') errorSwal: any;
  @ViewChild('deleteSwal') deleteSwal: any;
  @ViewChild('saveSwal') saveSwal: any;
  Pais = [];
  Monedas = [];

  constructor(private http: HttpClient, private globales: Globales) { }

  ngOnInit() {
    this.ActualizarVista();
  }

  ngAfterViewInit() {
    (document.getElementById("BotonCompraCrear") as HTMLInputElement).disabled = true;
  }


  CuentaBancaria = [];
  ComprasPendientes =[];
  ActualizarVista() {
    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Compra' } }).subscribe((data: any) => {
      this.compras = data;
    });
    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Tercero' } }).subscribe((data: any) => {
      this.Proveedores = data;
    });
    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Funcionario' } }).subscribe((data: any) => {
      this.Funcionarios = data;
    });
    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Pais' } }).subscribe((data: any) => {
      this.Pais = data;
    });
    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Moneda' } }).subscribe((data: any) => {
      this.Monedas = data;
    });
    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Cuenta_Bancaria' } }).subscribe((data: any) => {
      this.CuentaBancaria = data;
    });

    this.http.get(this.globales.ruta + 'php/compras/compras_no_verificadas.php').subscribe((data: any) => {
      this.ComprasPendientes = data;
    });

  }

  Caso1 = false;
  Lista_Destinatarios_Compra = [
    {
      Id_Cuenta_Bancaria: "",
      Valor: 0

    }
  ]
  verificarTipoCompra(valor) {
    switch (valor) {
      case "Banco": {
        this.Caso1 = true;
        break;
      }
      case "Transferencia": {
        this.Caso1 = false;
        break;
      }
      case "Cliente": {
        this.Caso1 = false;
        break;
      }
      default: {
        this.Caso1 = false;
      }
    }

  }

  CrearCompra() {
    this.Lista_Destinatarios_Compra = [
      {
        Id_Cuenta_Bancaria: "",
        Valor: 0

      }]
    this.ModalCompra.show();
  }


  agregarfila(pos) {
    var cuenta = this.Lista_Destinatarios_Compra[pos].Id_Cuenta_Bancaria;
    var valor = this.Lista_Destinatarios_Compra[pos].Valor;

    if (valor > 0 && cuenta != "") {
      var i = pos + 1;
      if (this.Lista_Destinatarios_Compra[i] == undefined) {
        this.Lista_Destinatarios_Compra.push(
          {
            Id_Cuenta_Bancaria: "",
            Valor: 0

          });

      }
    }

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

  GuardarCompra(formulario: NgForm, modal: any) {

  /*
    let info = JSON.stringify(formulario.value);
    let cuentas = JSON.stringify(this.Lista_Destinatarios_Compra);

    let datos = new FormData();
    datos.append("datos", info);
    datos.append("cuentas_proveedor", cuentas);
    this.http.post(this.globales.ruta + 'php/compras/guardar_compra.php', datos)
      .catch(error => {
        console.error('An error occurred:', error.error);
        this.errorSwal.show();
        return this.handleError(error);
      })
      .subscribe((data: any) => {
        formulario.reset();
        this.saveSwal.show();
        modal.hide();
        this.ActualizarVista();
      });*/
  }

  handleError(error: Response) {
    return Observable.throw(error);
  }

  VerCompra(id, modal) {
    this.http.get(this.globales.ruta + 'php/compras/detalle_compra.php', {
      params: { id: id }
    }).subscribe((data: any) => {
      this.Identificacion = id;
      this.Proveedor = data.Proveedor;
      this.Valor = data.Valor;
      this.TasaCambio = data.Tasa_Cambio;
      this.Funcionario = data.Funcionario;
      modal.show();
    });
  }

  EdicionCompra = [];
  AprobarCompra = false;
  EditarCompra(id, modal) {
    this.http.get(this.globales.ruta + 'php/compras/detalle_compra.php', {
      params: { modulo: 'Compra', id: id }
    }).subscribe((data: any) => {
      this.Identificacion = id;
      this.EdicionCompra = data.Compras[0];
      this.verificarTipoCompra(data.Compras[0].Tipo_Compra)
      this.Lista_Destinatarios_Compra = data.CuentaCompra;
      var suma = 0;
      this.Lista_Destinatarios_Compra.forEach(element => {
        suma += element.Valor;
      });
      console.log(suma);

      var resultado = parseInt(data.Compras[0].Abono) - suma;
      console.log(resultado);
      if (resultado == 0) {
        this.AprobarCompra = true;
      } else {
        this.AprobarCompra = false;
      }


      modal.show();
    });
  }

  CambiarValores(i, value) {
    this.Lista_Destinatarios_Compra[i].Valor = value;
  }

  EliminarCompra(id) {
    let datos = new FormData();
    datos.append("modulo", 'Compra');
    datos.append("id", id);
    this.http.post(this.globales.ruta + 'php/genericos/anular_generico.php', datos).subscribe((data: any) => {
      this.deleteSwal.show();
      this.ActualizarVista();
    });
  }

  fetchFilterData(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', this.globales.ruta + 'php/compras/vista_compra.php');

    req.onload = () => {
      cb(JSON.parse(req.response));
    };

    req.send();
  }

  MarcarRealizada(formulario: NgForm, modal: any) {

    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    datos.append("datos", info);
    this.http.post(this.globales.ruta + 'php/compras/cambiar_estado.php', datos)
      .catch(error => {
        console.error('An error occurred:', error.error);
        this.errorSwal.show();
        return this.handleError(error);
      })
      .subscribe((data: any) => {
        formulario.reset();
        this.saveSwal.show();
        modal.hide();
        this.Lista_Destinatarios_Compra = [
          {
            Id_Cuenta_Bancaria: "",
            Valor: 0
          }
        ]
        this.EdicionCompra = [];
        this.Identificacion = "";
        this.ActualizarVista();
      });
  }

  totalCompra: any;

  ValidarValorCompra(value) {
    this.totalCompra = value;
    this.Lista_Destinatarios_Compra[0].Valor = value;

    var tasa = (document.getElementById("Tasa") as HTMLInputElement).value;

    if (tasa != "" || tasa != undefined) {
      this.tasa = (parseFloat(value) * parseFloat(tasa));
    }

  }

  validarAutoSuma(pos) {
    var suma = 0;
    this.Lista_Destinatarios_Compra.forEach(element => {
      suma += Number(element.Valor);
    });

    if (suma == parseInt(this.totalCompra)) {
      this.agregarfila(pos);      
    } 

  }


  tasa: any;
  calcularValorMoneda(value) {

    if (value == "" || value == undefined) {
      this.tasa = 0.0;
    } else {
      this.tasa = (parseFloat(this.totalCompra) * parseFloat(value));
    }
  }

  validarSelect(value) {
    
    var tercero = (document.getElementById("Lista_Id_Tercero") as HTMLInputElement).value;
    var pais = (document.getElementById("Lista_Id_Pais") as HTMLInputElement).value;
    var moneda = (document.getElementById("Lista_Id_Moneda") as HTMLInputElement).value;
    var tipo_compra = (document.getElementById("Lista_Tipo_Compra") as HTMLInputElement).value;

    if (tercero == "") {
      (document.getElementById("BotonCompraCrear") as HTMLInputElement).disabled = true;
    } 

    if (pais == "") {
      (document.getElementById("BotonCompraCrear") as HTMLInputElement).disabled = true;
    } 

    if (moneda == "") {
      (document.getElementById("BotonCompraCrear") as HTMLInputElement).disabled = true;
    } 

    if (tipo_compra == "") {
      (document.getElementById("BotonCompraCrear") as HTMLInputElement).disabled = true;
    } 

  }

  HabilitarGuardar(value){
    if(this.LongitudCarateres(value) > 5){
      (document.getElementById("BotonCompraCrear") as HTMLInputElement).disabled = false;
    }else{
      (document.getElementById("BotonCompraCrear") as HTMLInputElement).disabled = true;
    }
    
  }

  LongitudCarateres(i) {
    return parseInt(i.length);
  }

  TotalCompra:any;
  cambiarEstado(pos){
    var pendiente = (document.getElementById("pendiente"+pos) as HTMLInputElement).checked;
    this.ComprasPendientes[pos].Estado = pendiente;
    
    var suma = 0;
    this.ComprasPendientes.forEach(element => {
      if(element.Estado == true){
        suma += Number(element.Valor)
      }
    });

    this.TotalCompra = suma;
  }


}