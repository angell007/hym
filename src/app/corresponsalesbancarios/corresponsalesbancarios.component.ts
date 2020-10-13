import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { CorresponsalModel } from '../Modelos/CorresponsalModel';
import { CorresponsalbancarioService } from '../shared/services/corresponsalesbancarios/corresponsalbancario.service';
import { SwalService } from '../shared/services/swal/swal.service';
import { Globales } from '../shared/globales/globales';

@Component({
  selector: 'app-corresponsalesbancarios',
  templateUrl: './corresponsalesbancarios.component.html',
  styleUrls: ['./corresponsalesbancarios.component.css', '../../style.scss']
})
export class CorresponsalesbancariosComponent implements OnInit {

  public corresponsales: any = [];
  public Departamentos: any = [];
  public Municipios: any = [];

  public CorresponsalModel: CorresponsalModel = new CorresponsalModel();
  //variables que hacen referencia a los campos del formulario editar   

  public Identificacion: any = [];
  public Nombre: any = [];
  public Cupo: any = [];
  public Departamento: any = [];
  public Municipio: any = [];

  public boolCorresponsal: boolean = false;
  public boolCupo: boolean = false;
  public boolDepartamento: boolean = false;
  public boolMunicipio: boolean = false;

  //Valores por defecto
  departamentoDefault: string = "";
  municipioDefault: string = "";

  @ViewChild('ModalCorresponsal') ModalCorresponsal: any;
  @ViewChild('ModalEditarCorresponsal') ModalEditarCorresponsal: any;
  @ViewChild('ModalVerCorresponsal') ModalVerCorresponsal: any;
  @ViewChild('FormCorresponsal') FormCorresponsal: any;
  @ViewChild('deleteSwal') deleteSwal: any;
  @ViewChild('errorSwal') errorSwal: any;
  @ViewChild('saveSwal') saveSwal: any;

  // readonly ruta = 'https://hym.corvuslab.co/';

  constructor(private http: HttpClient, private _corresponsalService: CorresponsalbancarioService,
    private _swalService: SwalService, public globales: Globales) { }

  ngOnInit() {
    this.ActualizarVista();
    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Departamento' } }).subscribe((data: any) => {
      this.Departamentos = data;
    });
  }

  @HostListener('document:keyup', ['$event']) handleKeyUp(event) {
    if (event.keyCode === 27) {
      this.FormCorresponsal.reset();
      this.OcultarFormulario(this.ModalCorresponsal);
      this.OcultarFormulario(this.ModalEditarCorresponsal);
    }
  }

  OcultarFormularios() {
    this.InicializarBool();
    /*this.OcultarFormulario(this.ModalE);
    this.OcultarFormulario(this.ModalEditarTraslado);*/
  }

  InicializarBool() {
    this.boolCorresponsal = false;
    this.boolCupo = false;
    this.boolDepartamento = false;
    this.boolMunicipio = false;
  }

  ActualizarVista() {
    this.http.get(this.globales.ruta + 'php/corresponsalesbancarios/lista_corresponsales.php').subscribe((data: any) => {
      this.corresponsales = data;
    });
  }

  Municipios_Departamento(Departamento) {
    this.http.get(this.globales.ruta + 'php/genericos/municipios_departamento.php', { params: { id: Departamento } }).subscribe((data: any) => {
      this.Municipios = data;
    });
  }

  // GuardarCorresponsal(formulario: NgForm, modal: any) {
  //   let info = JSON.stringify(formulario.value);
  //   console.log(formulario);

  //   // let datos = new FormData();

  //   // datos.append("modulo", 'Corresponsal_Bancario');
  //   // datos.append("datos", info);

  //   // this.OcultarFormulario(modal);
  //   // this.http.post(this.globales.ruta + 'php/genericos/guardar_generico.php', datos).subscribe((data: any) => {
  //   //   this.saveSwal.show();
  //   //   this.ActualizarVista();
  //   //   formulario.reset();
  //   //   this.InicializarBool();
  //   //   this.municipioDefault = "";
  //   //   this.departamentoDefault = "";
  //   // });
  // }

  GuardarCorresponsal() {
    let info = JSON.stringify(this.CorresponsalModel);
    // console.log(CorresponsalModel);

    let datos = new FormData();

    datos.append("modulo", 'Corresponsal_Bancario');
    datos.append("datos", info);

    this._corresponsalService.GuardarCorresponsalBancario(datos).subscribe((data: any) => {
      this.ActualizarVista();
      this.CerrarModalGuardar();
      this._swalService.ShowMessage(data);
    });
  }

  VerCorresponsal(id, modal) {
    this.http.get(this.globales.ruta + 'php/corresponsalesbancarios/detalle_corresponsales.php', {
      params: { modulo: 'Corresponsal', id: id }
    }).subscribe((data: any) => {
      this.CorresponsalModel.Cupo = parseInt(data.Cupo);
      this.CorresponsalModel.Nombre = data.Nombre;
      this.CorresponsalModel.Departamento = data.Departamento;
      this.CorresponsalModel.Municipio = data.Municipio;
      // this.Nombre=data.Nombre;
      // this.Cupo=data.Cupo;
      // this.Departamento=data.Departamento;
      // this.Municipio=data.Municipio;
      // this.Identificacion = id;

      this.ModalVerCorresponsal.show();
    });
  }

  EditarCorresponsal(id, modal) {
    this.http.get(this.globales.ruta + 'php/genericos/detalle.php', {
      params: { modulo: 'Corresponsal_Bancario', id: id }
    }).subscribe((data: any) => {

      // console.log(id);
      this.CorresponsalModel.Cupo = parseInt(data.Cupo);
      this.CorresponsalModel.Nombre = data.Nombre;
      this.CorresponsalModel.Departamento = data.Departamento;
      this.CorresponsalModel.Municipio = data.Municipio;
      // this.Identificacion = id;
      // this.Nombre = data.Nombre;
      // this.Departamento = data.Id_Departamento;
      // this.Cupo = data.Cupo;
      // this.AutoSleccionarMunicipio(data.Id_Departamento, data.Id_Municipio);
      this.ModalEditarCorresponsal.show();
    });
  }

  EliminarCorresponsal(id) {
    // console.log(id);
    let datos = new FormData();
    datos.append("modulo", 'Corresponsal_Bancario');
    datos.append("id", id);
    this.http.post(this.globales.ruta + 'php/genericos/eliminar_generico.php', datos).subscribe((data: any) => {
      this.ActualizarVista();
      this.deleteSwal.show();
    })
  }

  AutoSleccionarMunicipio(Departamento, Municipio) {
    this.http.get(this.globales.ruta + 'php/genericos/municipios_departamento.php', { params: { id: Departamento } }).subscribe((data: any) => {
      this.Municipios = data;
      this.Municipio = Municipio;
    });
  }

  OcultarFormulario(modal) {
    this.Identificacion = null;
    this.Nombre = null;
    this.Cupo = null;
    this.Departamento = null;
    this.Municipio = null;
    modal.hide();
  }

  public CerrarModalGuardar() {
    this._limpiarModelo();
    this.ModalCorresponsal.hide();
    this.ModalEditarCorresponsal.hide();
  }

  public CerrarModalEditar() {
    this._limpiarModelo();
    this.ModalEditarCorresponsal.hide();
  }

  public CerrarModalVer() {
    this._limpiarModelo();
    this.ModalEditarCorresponsal.hide();
  }

  private _limpiarModelo() {
    this.CorresponsalModel = new CorresponsalModel();
  }
}