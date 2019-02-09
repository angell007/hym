import { Component, OnInit } from '@angular/core';
import { Globales } from '../../shared/globales/globales';

@Component({
  selector: 'app-tablerocajeroprincipal',
  templateUrl: './tablerocajeroprincipal.component.html',
  styleUrls: ['./tablerocajeroprincipal.component.scss']
})
export class TablerocajeroprincipalComponent implements OnInit {

  public Paises:Array<any> = [];
  public Departamentos:Array<any> = [];
  public DepartamentoSeleccionado:string = 'Departamento';
  public DepartamentoId:string = '';
  public Funcionario:any = JSON.parse(localStorage['User']); 

  constructor(public globales:Globales) { }

  ngOnInit() {
    this.AsignarDepartamentos();
  }

  AsignarPaises(){      
    this.Paises = this.globales.Paises;
  }

  AsignarDepartamentos(){      
    this.Departamentos = this.globales.Departamentos;

  }

  AsignarDepartamentoSeleccionado(value){

    if (value == '') {
      this.DepartamentoSeleccionado = 'Departamento';
      return;
    }

    this.DepartamentoId = value;
    let d = this.Departamentos.filter(x => x.Id_Departamento == value);
    this.DepartamentoSeleccionado = d[0].Nombre;
  }

}
