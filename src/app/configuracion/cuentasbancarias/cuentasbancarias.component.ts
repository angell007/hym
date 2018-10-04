import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Globales } from '../../shared/globales/globales';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-cuentasbancarias',
  templateUrl: './cuentasbancarias.component.html',
  styleUrls: ['./cuentasbancarias.component.css']
})
export class CuentasbancariasComponent implements OnInit {
  public cuentas: any[];
  public Bancos: any[];

 

  //Valores por defecto
  bancoDefault: string = "";

  rowsFilter = [];
  tempFilter = [];

  @ViewChild('ModalEditarCuenta') ModalEditarCuenta: any;
  @ViewChild('ModalVerCuenta') ModalVerCuenta: any;
  @ViewChild('ModalCuenta') ModalCuenta: any;
  @ViewChild('FormCuenta') FormCuenta: any;
  @ViewChild('errorSwal') errorSwal: any;
  @ViewChild('saveSwal') saveSwal: any;
  @ViewChild('deleteSwal') deleteSwal: any;
  @ViewChild('confirmacionSwal') confirmacionSwal: any;

  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  Monedas = [];
  Identificacion: any;
  CuentaBancaria=[];

  constructor(private http: HttpClient, private globales: Globales) { }

  ngOnInit() {
    this.ActualizarVista();
    /*this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Banco' } }).subscribe((data: any) => {
      this.Bancos = data;
    });*/
  }

  @HostListener('document:keyup', ['$event']) handleKeyUp(event) {
    if (event.keyCode === 27) {
      this.OcultarFormularios();
    }
  }

  OcultarFormularios() {
    this.OcultarFormulario(this.ModalCuenta);
    this.OcultarFormulario(this.ModalVerCuenta);
    this.OcultarFormulario(this.ModalEditarCuenta);
  }


  Paises =[];
  ActualizarVista() {
    this.http.get(this.globales.ruta + 'php/cuentasbancarias/lista_cuentas.php').subscribe((data: any) => {
      this.cuentas = data;
      this.dtTrigger.next();
    });

    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Pais' } }).subscribe((data: any) => {
      this.Paises = data;
    });

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      dom: 'Bfrtip',
      responsive: true,
      /* below is the relevant part, e.g. translated to spanish */
      language: {
        processing: "Procesando...",
        search: "Buscar:",
        lengthMenu: "Mostrar _MENU_ &eacute;l&eacute;ments",
        info: "Mostrando desde _START_ al _END_ de _TOTAL_ elementos",
        infoEmpty: "Mostrando ningún elemento.",
        infoFiltered: "(filtrado _MAX_ elementos total)",
        infoPostFix: "",
        loadingRecords: "Cargando registros...",
        zeroRecords: "No se encontraron registros",
        emptyTable: "No hay datos disponibles en la tabla",
        paginate: {
          first: "<<",
          previous: "<",
          next: ">",
          last: ">>"
        },
        aria: {
          sortAscending: ": Activar para ordenar la tabla en orden ascendente",
          sortDescending: ": Activar para ordenar la tabla en orden descendente"
        }
      }
    };

    this.http.get(this.globales.ruta + '/php/genericos/lista_generales.php', {
      params: { modulo: 'Moneda' }
    }).subscribe((data: any) => {
      this.Monedas = data;
    });
  }

  Bancos_Pais(Pais) {
    this.http.get(this.globales.ruta + 'php/genericos/bancos_pais.php', { params: { id: Pais } }).subscribe((data: any) => {
      this.Bancos = data;
    });
  }

  GuardarCuenta(formulario: NgForm, modal) {
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    datos.append("modulo", 'Cuenta_Bancaria');
    datos.append("datos", info);
    this.OcultarFormulario(modal);
    this.http.post(this.globales.ruta + 'php/cuentasbancarias/guardar_cuenta_bancaria.php', datos)
      .catch(error => {
        console.error('An error occurred:', error.error);
        this.errorSwal.show();
        return this.handleError(error);
      })
      .subscribe((data: any) => {
        formulario.reset();
        this.ActualizarVista();
        this.bancoDefault = "";
        this.saveSwal.show();
      });

  }

  handleError(error: Response) {
    return Observable.throw(error);
  }

  VerCuenta(id, modal) {
    this.http.get(this.globales.ruta + 'php/cuentasbancarias/detalle_cuenta_bancaria.php', {
      params: { id: id }
    }).subscribe((data: any) => {
      this.Identificacion = id;

      modal.show();
    });
  }

  EliminarCuenta(id) {
    let datos = new FormData();
    datos.append("modulo", 'Cuenta_Bancaria');
    datos.append("id", id);
    this.http.post(this.globales.ruta + 'php/genericos/anular_generico.php', datos).subscribe((data: any) => {
      this.deleteSwal.show();
      this.ActualizarVista();
    });
  }

  EditarCuenta(id) {
    this.http.get(this.globales.ruta + 'php/genericos/detalle.php', {
      params: { modulo: 'Cuenta_Bancaria', id: id }
    }).subscribe((data: any) => {
      this.Identificacion = id;
      this.CuentaBancaria = data;
      this.Bancos_Pais(data.Id_Pais);
      this.ModalEditarCuenta.show();
    });
  }

  OcultarFormulario(modal) {  
    modal.hide();
  }


  Cerrar(modal) {
    this.OcultarFormulario(modal)
  }

  ////
  EstadoCuentaBancaria(value, estado) {
    let datos = new FormData();
    var titulo;
    var texto;
    datos.append("modulo", "Cuenta_Bancaria");
    datos.append("id", value);
    switch (estado) {
      case "Activo": {
        datos.append("estado", "Activo");
        titulo = "Banco Inactivada";
        texto = "Se ha inactivado correctamente la cuenta bancaria seleccionada";
        break;
      }
      case "Inactivo": {
        datos.append("estado", "Inactivo");
        titulo = "Banco Activada";
        texto = "Se ha Activado correctamente la cuenta bancaria seleccionada";
        break;
      }
    }

    this.http.post(this.globales.ruta + 'php/genericos/anular_generico.php', datos).subscribe((data: any) => {
      this.confirmacionSwal.title = titulo;
      this.confirmacionSwal.text = texto;
      this.confirmacionSwal.type = "success";
      this.confirmacionSwal.show();
      this.cuentas = data;
    });
  }

}
