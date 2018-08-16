import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-serviciosexternos',
  templateUrl: './serviciosexternos.component.html',
  styleUrls: ['./serviciosexternos.component.css']
})
export class ServiciosexternosComponent implements OnInit {


  public serviciosexternos: any[];

  //variables que hacen referencia a los campos del formulario editar   

  public Identificacion: any[];
  public Nombre: any[];
  public Comision: any[];

  public boolNombre:boolean = false;
  public boolComision:boolean = false;

  @ViewChild('ModalServicio') ModalServicio: any;
  @ViewChild('ModalEditarServicio') ModalEditarServicio: any;
  @ViewChild('FormServicio') FormServicio: any;
  @ViewChild('deleteSwal') deleteSwal: any;
  @ViewChild('errorSwal') errorSwal:any;
  @ViewChild('saveSwal') saveSwal:any;
  readonly ruta = 'https://hym.corvuslab.co/';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.ActualizarVista();
    this.http.get(this.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Servicio_Externo' } }).subscribe((data: any) => {
      this.serviciosexternos = data;
      console.log(this.serviciosexternos);
    });
  }


  @HostListener('document:keyup', ['$event']) handleKeyUp(event) {
    if (event.keyCode === 27) {
      this.FormServicio.reset();
      this.OcultarFormulario(this.ModalServicio);
      this.OcultarFormulario(this.ModalEditarServicio);
    }
  }

  OcultarFormularios()
  {
    this.InicializarBool();
    /*this.OcultarFormulario(this.ModalE);
    this.OcultarFormulario(this.ModalEditarTraslado);*/
  }

  InicializarBool()
  {
    this.boolNombre = false;
    this.boolComision = false;
  }

  ActualizarVista() {
    this.http.get(this.ruta + 'php/serviciosexternos/lista.php').subscribe((data: any) => {
      this.serviciosexternos = data;
    });
  }

  GuardarServicio(formulario: NgForm, modal: any) {
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    datos.append("modulo", 'Servicio_Externo');
    datos.append("datos", info);

    this.OcultarFormulario(modal);
    this.http.post(this.ruta + 'php/genericos/guardar_generico.php', datos).subscribe((data: any) => {
      this.ActualizarVista();
      formulario.reset();
    });
  }

  EditarServicio(id, modal) {
    this.http.get(this.ruta + 'php/genericos/detalle.php', {
      params: { modulo: 'Servicio_Externo', id: id }
    }).subscribe((data: any) => {

      console.log(id);
      this.Identificacion = id;
      this.Nombre = data.Nombre;
      this.Comision = data.Comision;
      modal.show();
    });
  }

  EliminarServicio(id) {
    console.log(id);
    console.log("algo más");
    let datos = new FormData();
    datos.append("modulo", 'Servicio_Externo');
    datos.append("id", id);
    this.http.post(this.ruta + 'php/genericos/eliminar_generico.php', datos).subscribe((data: any) => {
      this.ActualizarVista();
      this.deleteSwal.show();
    })
  }

  OcultarFormulario(modal) {
    this.Identificacion = null;
    this.Nombre = null;
    this.Comision = null;
    modal.hide();
  }
}