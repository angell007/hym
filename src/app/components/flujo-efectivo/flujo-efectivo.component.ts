import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Globales } from '../../shared/globales/globales';
import { NuevofuncionarioService } from '../../shared/services/funcionarios/nuevofuncionario.service';
import { GeneralService } from '../../shared/services/general/general.service';

@Component({
  selector: 'app-flujo-efectivo',
  templateUrl: './flujo-efectivo.component.html',
  styleUrls: ['./flujo-efectivo.component.scss']
})
export class FlujoEfectivoComponent implements OnInit {

  public id_funcionario;
  public Monedas: Array<string> = [];
  public MonedasSistema: any = [];
  public ValoresMonedasApertura: any = [];
  public sizeColunm: any = 0 + '%';
  public Modulos = [];
  public Fecha_inicio = '';
  public Fecha_fin = '';


  constructor(public globales: Globales, private cliente: HttpClient, public router: Router, public activeRoute: ActivatedRoute, private _generalService: GeneralService, private _funcionarioService: NuevofuncionarioService) {
  }

  ngOnInit() {
    this.ConsultarTotalesCierre();
  }

  ConsultarTotalesCierre() {
    this.Modulos = [];
    let p = { id: this.id_funcionario, Fecha_fin: this.Fecha_fin, Fecha_inicio: this.Fecha_inicio };
    this.cliente.get(`${this.globales.rutaNueva}flujo-efectivo`, { params: p }).subscribe((data: any) => {
      data[0]['mov'].forEach(element => {
        this.Modulos.push(element.Nombre)
      });
      this.Monedas = data;
    });
  }

  reduce(a) {

    let suma = 0;
    a.forEach((element) => {
      suma += parseFloat(element.Total)
    })
    return suma;
  }

  Ingresos(a) {
    let suma = 0;
    a.forEach((element) => {
      suma += parseFloat(element.Ingreso_Total)
    })
    return suma;
  }

  onDataChange() {
    this.ConsultarTotalesCierre();
  }
}
