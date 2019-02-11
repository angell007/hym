import { Component, OnInit } from '@angular/core';
import { Globales } from '../../../shared/globales/globales';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-funcionarioactivos',
  templateUrl: './funcionarioactivos.component.html',
  styleUrls: ['./funcionarioactivos.component.scss']
})
export class FuncionarioactivosComponent implements OnInit {

  public test:any = ['a', 'a', 'a', 'a', 'a'];
  public Funcionarios_Activos:Array<any> = [];
  public FuncionariosFiltrados:Array<any> = [];
  public FuncionarioBusqueda = '';

  constructor(public globales:Globales, private client:HttpClient) {
    
    this.GetFuncionariosActivos();
  }

  ngOnInit() {
  }

  GetFuncionariosActivos(){
    this.client.get(this.globales.ruta+'php/funcionarios/cajeros_activos.php').subscribe((data:any) => {

      if (data.codigo == 'success') {
        this.Funcionarios_Activos = data.funcionarios_activos;
        this.FuncionariosFiltrados = data.funcionarios_activos;
      }else{

        this.Funcionarios_Activos = [];
        this.FuncionariosFiltrados = [];
      }
    });
  }

  FiltrarFuncionario(){

    if (this.FuncionarioBusqueda == '') {
      
      this.FuncionariosFiltrados = this.Funcionarios_Activos;
    }else{

      this.FuncionariosFiltrados = this.filterByValue(this.Funcionarios_Activos, this.FuncionarioBusqueda);
    }
  }

  filterByValue(array, string) {
    return array.filter(o =>
        Object.keys(o).some(k => o[k].toLowerCase().includes(string.toLowerCase())));
  }


}
