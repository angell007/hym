import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { CorresponsalModel } from '../Modelos/CorresponsalModel';
import { CorresponsalbancarioService } from '../shared/services/corresponsalesbancarios/corresponsalbancario.service';
import { SwalService } from '../shared/services/swal/swal.service';
import { Globales } from '../shared/globales/globales';
import { Observable } from 'rxjs/Observable';
import { debounceTime, distinctUntilChanged, map, switchMap, delay, tap } from 'rxjs/operators';
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
  public tercero_credito: any = [];
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


  search_tercero_credito = (text$: Observable<string>) =>
    text$
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap(term => term.length < 3 ? [] :
          this.http.get(this.globales.ruta + 'php/terceros/get_terceros_corresponsal.php', { params: { Nombre: term } })
            .map(response => response)
        )
      );

  formatter_tercero_credito = (x: { Nombre: string }) => x.Nombre;


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

  GuardarCorresponsal() {
    if (typeof (this.CorresponsalModel.Tercero) != 'object') {
      this._swalService.ShowMessage(['warning', 'Datos Incompletos', 'Debe escoger un tercero'])
      return
    }

    let info = JSON.stringify(this.CorresponsalModel);
    let datos = new FormData();
    datos.append("modulo", 'Corresponsal_Bancario');
    datos.append("datos", info);
    this._corresponsalService.GuardarCorresponsalBancario(datos).subscribe((data: any) => {
      this.ActualizarVista();
      this.CerrarModalGuardar();
      this._swalService.ShowMessage(data);
    });
  }

  GuardarCorresponsalEditado() {

    let info = JSON.stringify(this.CorresponsalModel);

    // console.log(this.CorresponsalModel);

    let datos = new FormData();
    datos.append("modulo", 'Corresponsal_Bancario');
    datos.append("datos", info);

    this.http.post(this.globales.rutaNueva + 'corresponsales/update', datos).subscribe((data: any) => {
      this.ActualizarVista();
      this.CerrarModalGuardar();
    })
  }

  VerCorresponsal(id, modal) {
    this.http.get(this.globales.ruta + 'php/corresponsalesbancarios/detalle_corresponsales.php', {
      params: { modulo: 'Corresponsal', id: id }
    }).subscribe((data: any) => {
      this.CorresponsalModel.Cupo = parseInt(data.Cupo);
      this.CorresponsalModel.Nombre = data.Nombre;
      this.CorresponsalModel.Departamento = data.Departamento;
      this.CorresponsalModel.Municipio = data.Municipio;
      this.ModalVerCorresponsal.show();
    });
  }

  EditarCorresponsal(id, modal) {
    this.http.get(this.globales.ruta + 'php/genericos/detalle.php', {
      params: { modulo: 'Corresponsal_Bancario', id: id }
    }).subscribe((data: any) => {

      // console.log(data);

      this.CorresponsalModel.Cupo = parseInt(data.Cupo);
      this.CorresponsalModel.Nombre = data.Nombre;
      this.CorresponsalModel.Departamento = data.Id_Departamento;
      this.CorresponsalModel.Id_Corresponsal_Bancario = data.Id_Corresponsal_Bancario;
      this.AutoSleccionarMunicipio(data.Id_Departamento, data.Id_Municipio);
      this.ModalEditarCorresponsal.show();
    });
  }

  EliminarCorresponsal(id) {
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
      this.CorresponsalModel.Municipio = Municipio;
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
    this.ModalVerCorresponsal.hide();
  }

  private _limpiarModelo() {
    this.CorresponsalModel = new CorresponsalModel();
  }
}