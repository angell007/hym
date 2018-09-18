import { Component, OnInit, ViewChild} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-cuentasbancariasver',
  templateUrl: './cuentasbancariasver.component.html',
  styleUrls: ['./cuentasbancariasver.component.scss']
})
export class CuentasbancariasverComponent implements OnInit {


  @ViewChild('confirmacionSwal') confirmacionSwal: any;
  Movimientos=[];
  id = this.route.snapshot.params["id"];
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  SaldoActual: any;

  constructor(private route: ActivatedRoute,private http : HttpClient, private globales: Globales) { }

  ngOnInit() {
    this.ActualizarVista();
    this.calcularSaldoActual();
  }

  ActualizarVista(){
    this.id = this.route.snapshot.params["id"];
    this.http.get(this.globales.ruta + '/php/genericos/lista_generales.php', {
      params: { modulo: ' Movimiento_Cuenta_Bancaria' }
    }).subscribe((data: any) => {
      this.Movimientos = data;
      this.dtTrigger.next();
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
  }

  GuardarMovimiento(formulario: NgForm, modal) {
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    datos.append("modulo", 'Movimiento_Cuenta_Bancaria');
    datos.append("datos", info);
    this.http.post(this.globales.ruta + 'php/genericos/guardar_generico.php', datos)
      .subscribe((data: any) => {
        formulario.reset();
        modal.hide();
        this.ActualizarVista();
        this.confirmacionSwal.title = "Movimiento Realizado"
        this.confirmacionSwal.text = "Se ha guardado correctamente el movimiento"
        this.confirmacionSwal.type = "success";
        this.confirmacionSwal.show();
        this.calcularSaldoActual();
      });

  }
  calcularSaldoActual(){
    this.http.get(this.globales.ruta + '/php/cuentasbancarias/saldo_actual_cuenta.php', {
      params: { id: this.id }
    }).subscribe((data: any) => {
      if(data > 0){
        this.SaldoActual = data;
      }else{
        this.SaldoActual = 0;
      }

    });
  }

}
