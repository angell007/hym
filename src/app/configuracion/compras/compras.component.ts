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

  public Identificacion: any[];
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

  CuentaBancaria = [];
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
    }

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

  GuardarCompra(formulario: NgForm, modal: any) {

    this.Lista_Destinatarios_Compra.forEach((element, index) => {
      if (element.Valor == 0) {
        this.Lista_Destinatarios_Compra.splice(index, 1);
      }
    });

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
        this.Lista_Destinatarios_Compra = [
          {
            Id_Cuenta_Bancaria: "",
            Valor: 0
          }
        ]
        this.EdicionCompra=[];
        this.ActualizarVista();
      });
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

  EdicionCompra=[];
  EditarCompra(id, modal) {
    this.http.get(this.globales.ruta + 'php/compras/detalle_compra.php', {
      params: { modulo: 'Compra', id: id }
    }).subscribe((data: any) => {
      this.Identificacion = id;
      this.EdicionCompra = data.Compras[0];
      this.verificarTipoCompra(data.Compras[0].Tipo_Compra)
      this.Lista_Destinatarios_Compra =data.CuentaCompra;     
      modal.show();
    });
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
}