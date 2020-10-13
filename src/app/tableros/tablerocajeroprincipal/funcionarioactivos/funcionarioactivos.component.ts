import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Globales } from '../../../shared/globales/globales';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-funcionarioactivos',
  templateUrl: './funcionarioactivos.component.html',
  styleUrls: ['./funcionarioactivos.component.scss']
})
export class FuncionarioactivosComponent implements OnInit, OnChanges {

  @Input() Fecha_Consulta: string = '';

  public Funcionarios_Activos: Array<any> = [];
  public FuncionariosFiltrados: Array<any> = [];
  public FuncionarioBusqueda = '';
  public MensajeAlerta: string = 'No hay registros de inicio de sesión';

  constructor(public globales: Globales, private client: HttpClient) {
    let d = new Date();
    this.Fecha_Consulta = d.toISOString().split("T")[0];
    this.GetFuncionariosActivos();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.Fecha_Consulta.previousValue != undefined && changes.Fecha_Consulta.currentValue != '') {
      this.GetFuncionariosActivos();
    }
  }

  ngOnInit() {
  }

  GetFuncionariosActivos() {
    if (this.Fecha_Consulta == '') {
      this.VaciarDatos();
      return;
    }

    this.client.get(this.globales.ruta + 'php/funcionarios/cajeros_activos.php', { params: { fecha: this.Fecha_Consulta } }).subscribe((data: any) => {
      this.FuncionariosFiltrados = [];

      if (data.codigo == 'success') {

        this.Funcionarios_Activos = data.funcionarios_activos;
        const aux = data.funcionarios_activos;
        aux.forEach((element: any) => {
          if (element.Identificacion_Funcionario != JSON.parse(localStorage['User']).Identificacion_Funcionario) {
            // console.log(element);
            this.FuncionariosFiltrados.push(element)
          }
        })

      } else {
        this.VaciarDatos();
      }
    });
  }

  VaciarDatos() {
    this.MensajeAlerta = 'No hay registros de inicio de sesión';
    this.Funcionarios_Activos = [];
    this.FuncionariosFiltrados = [];
  }

  FiltrarFuncionario() {

    if (this.FuncionarioBusqueda == '') {

      this.FuncionariosFiltrados = this.Funcionarios_Activos;

      if (this.FuncionariosFiltrados.length == 0 && this.Funcionarios_Activos.length == 0) {
        this.MensajeAlerta = 'No hay registros de inicio de sesión';
      }

    } else {

      this.FuncionariosFiltrados = this.filterByValue(this.Funcionarios_Activos, this.FuncionarioBusqueda);

      if (this.FuncionariosFiltrados.length == 0 && this.Funcionarios_Activos.length > 0) {
        this.MensajeAlerta = 'La búsqueda no coincide con ningún cajero';
      }
    }
  }

  filterByValue(array, string) {
    return array.filter(o =>
      Object.keys(o).some(k => o[k].toLowerCase().includes(string.toLowerCase())));
  }

}
