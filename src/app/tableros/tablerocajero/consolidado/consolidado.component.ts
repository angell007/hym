import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Globales } from '../../../shared/globales/globales';
import { GeneralService } from '../../../shared/services/general/general.service';

@Component({
  selector: 'app-consolidado',
  templateUrl: './consolidado.component.html',
  styleUrls: ['./consolidado.component.scss']
})
export class ConsolidadoComponent implements OnInit {
  public id_funcionario = this.activeRoute.snapshot.params["id_funcionario"];
  public Funcionario = JSON.parse(localStorage['User']);
  public pag: string;
  public datos: any;
  public lengt: any;
  public myDate: Date;
  public ValoresMonedasApertura: any = [];
  public ValoresMonedasApertura2: any = [];
  public saldo: any;

  constructor(public globales: Globales, private http: HttpClient, public router: Router, public activeRoute: ActivatedRoute, private _generalService: GeneralService) {
    this.myDate = new Date();
  }


  ngOnInit() {
    this.getDatos();
  }

  async getDatos() {
    await this.GetRegistroDiario();
    this.http.get(this.globales.ruta + 'php/consolidados/getConsolidados.php', { params: { id_funcionario: this.id_funcionario, pag: '1000' } }).subscribe(async (data: any) => {
      this.datos = data;
      await this.datos.forEach(async (element: any, index: number) => {
        element.query_data.forEach(async (elements: any) => {
          this.ValoresMonedasApertura[index] += elements.Ingreso - elements.Egreso
          elements.saldo = this.ValoresMonedasApertura[index]
          elements.codigo = this.ValoresMonedasApertura2[index].Codigo
        });
      });
    });
  }

  async GetRegistroDiario() {
    await this.http
      .get(this.globales.ruta + 'php/diario/get_valores_diario.php', { params: { id: this.id_funcionario } })
      .pipe().toPromise().then((data: any) => {
        data.valores_diario.forEach((valores: any, i) => {
          this.ValoresMonedasApertura.push(parseFloat(valores.Valor_Moneda_Apertura));
          this.ValoresMonedasApertura2.push(valores);
        });
      });
  }


  calculateSaldo(ingreso) {
    console.log(ingreso);
    return ingreso
  }


  isEqual(str1: string, str2: string) {
    return str1.toUpperCase() === str2.toUpperCase()
  }
}
