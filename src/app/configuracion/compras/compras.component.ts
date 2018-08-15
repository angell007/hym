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

  public Identificacion : any[];
  public Proveedor : any[];
  public Valor : any[];
  public TasaCambio : any[];
  public Funcionario : any[];

  public boolProveedor:boolean = false;
  public boolValor:boolean = false;
  public boolTasaCambio:boolean = false;
  public boolFuncionario:boolean = false;

  //Valores por defecto
  proveedorDefault: string = "";
  funcionarioDefault: string = "";

  rowsFilter = [];
  tempFilter = [];

  @ViewChild('ModalCompra') ModalCompra:any;
  @ViewChild('ModalVerCompra') ModalVerCompra:any;
  @ViewChild('ModalEditarCompra') ModalEditarCompra:any;
  @ViewChild('FormCompra') FormCompra:any;
  @ViewChild('errorSwal') errorSwal:any;
  @ViewChild('deleteSwal') deleteSwal:any;
  @ViewChild('saveSwal') saveSwal:any;

  constructor(private http: HttpClient,private globales: Globales) { }

    ngOnInit() {

      this.ActualizarVista();
      this.http.get(this.globales.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Proveedor'}}).subscribe((data:any)=>{
        this.Proveedores= data;
      });
      this.http.get(this.globales.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Funcionario'}}).subscribe((data:any)=>{
        this.Funcionarios= data;
      });
    }

  @HostListener('document:keyup', ['$event']) handleKeyUp(event) {
    if (event.keyCode === 27) {     
      this.FormCompra.reset();
      this.OcultarFormularios();
    }
  }

  OcultarFormularios()
  {
    this.InicializarBool();
    this.OcultarFormulario(this.ModalCompra);
    this.OcultarFormulario(this.ModalVerCompra);
    this.OcultarFormulario(this.ModalEditarCompra);
  }

  InicializarBool()
  {
    this.boolProveedor = false;
    this.boolValor = false;
    this.boolTasaCambio = false;
    this.boolFuncionario = false;
  }

  ActualizarVista()
  {
    this.http.get(this.globales.ruta+'php/compras/lista_compras.php').subscribe((data:any)=>{
      this.compras= data;
    });
  }

  GuardarCompra(formulario: NgForm, modal:any){
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    datos.append("modulo",'Compra');
    datos.append("datos",info);
    this.OcultarFormulario(modal);
    this.http.post(this.globales.ruta+'php/genericos/guardar_generico.php',datos)
    .catch(error => { 
      console.error('An error occurred:', error.error);
      this.errorSwal.show();
      return this.handleError(error);
    })
    .subscribe((data:any)=>{      
      this.ActualizarVista();
      this.InicializarBool();
      formulario.reset();
      this.proveedorDefault = "";
      this.funcionarioDefault = "";
      this.saveSwal.show();
    });

    
  }

  handleError(error: Response) {
    return Observable.throw(error);
  }

  VerCompra(id, modal){
    this.http.get(this.globales.ruta+'php/compras/detalle_compra.php',{
      params:{id:id}
    }).subscribe((data:any)=>{
      this.Identificacion = id;
      this.Proveedor = data.Proveedor;
      this.Valor = data.Valor;
      this.TasaCambio = data.Tasa_Cambio;
      this.Funcionario = data.Funcionario;
      modal.show();
    });
  }


  EditarCompra(id, modal){
    this.InicializarBool();
    this.http.get(this.globales.ruta+'php/genericos/detalle.php',{
      params:{modulo:'Compra', id:id}
    }).subscribe((data:any)=>{
  console.log(id);
      this.Identificacion = id;
      this.Proveedor = data.Id_Proveedor;
      this.Valor = data.Valor;
      this.TasaCambio = data.Tasa_Cambio;
      this.Funcionario = data.Identificacion_Funcionario;
      modal.show();
    });
  }


  EliminarCompra(id){
    let datos = new FormData();
    datos.append("modulo", 'Compra');
    datos.append("id", id); 
    this.http.post(this.globales.ruta + 'php/genericos/anular_generico.php', datos ).subscribe((data: any) => {
      this.deleteSwal.show();
      this.ActualizarVista();
    });
  }



  fetchFilterData(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', this.globales.ruta+'php/compras/vista_compra.php');

    req.onload = () => {
      cb(JSON.parse(req.response));
    };

    req.send();
  }



  OcultarFormulario(modal){
    this.Identificacion = null;
    this.Proveedor = null;
    this.Valor = null;
    this.TasaCambio = null;
    this.Funcionario = null;
    modal.hide();
  }


  Cerrar(modal){
    this.OcultarFormulario(modal)
  }


}