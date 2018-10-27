import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Globales } from '../../shared/globales/globales';
import { Router } from '@angular/router';

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

  constructor(private http: HttpClient, private globales: Globales, private router: Router) { }

  esconder = true;
  ngOnInit() {
    var perfil = JSON.parse(localStorage.Perfil);

    switch(perfil){
      case 5:{
        this.esconder = false;
      }
      default:{
        this.esconder = true;
        break;
      }
    }    
    this.ActualizarVista();
  }


  CuentaBancaria = [];
  ComprasPendientes =[];
  ActualizarVista() {
    this.http.get(this.globales.ruta + 'php/compras/lista_compras.php', { params: { modulo: 'Compra' } }).subscribe((data: any) => {
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

  EdicionCompra = [];
  AprobarCompra = false;
  EditarCompra(id, modal) {
    this.router.navigate(['/compraseditar',id]);
  }

  fetchFilterData(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', this.globales.ruta + 'php/compras/vista_compra.php');

    req.onload = () => {
      cb(JSON.parse(req.response));
    };

    req.send();
  }

  LongitudCarateres(i) {
    return parseInt(i.length);
  }

  AnularCompra(valor){
    let datos = new FormData();
    datos.append("compra", valor);
    this.http.post(this.globales.ruta + 'php/compras/anular_compra.php', datos)
      .subscribe((data: any) => {
        this.ActualizarVista();
      });    
  }


}