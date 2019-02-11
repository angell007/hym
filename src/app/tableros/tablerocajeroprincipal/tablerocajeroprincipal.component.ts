import { Component, OnInit } from '@angular/core';
import { Globales } from '../../shared/globales/globales';
import { HttpClient } from '@angular/common/http';
import { Funcionario } from '../../shared/funcionario/funcionario.model';

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
  public TotalesDepartamento:any = {}; 
  public TotalesMunicipio:Array<any> = []; 
  public TotalesOficina:Array<any> = []; 
  public FechaSeleccionada:any = '2019-02-09';

  constructor(public globales:Globales, private client:HttpClient) { 
    
    this.AsignarDepartamentos();
  }

  ngOnInit() {
  }

  AsignarPaises(){      
    this.Paises = this.globales.Paises;
  }

  AsignarDepartamentos(){      
    this.Departamentos = this.globales.Departamentos;
  }

  ConsultarTotalesDepartamento(){
    let p = {id_funcionario:this.Funcionario.Identificacion_Funcionario, id_departamento:this.DepartamentoId, fecha:this.FechaSeleccionada};
    this.client.get(this.globales.ruta+'php/cajas/totales_caja.php', {params:p}).subscribe((data:any) => {
      
      if (data.codigo == 'success') {
        
        this.TotalesMunicipio = data.totales.municipios;
        console.log(this.TotalesMunicipio);
        
      }
    });
  }

  AsignarDepartamentoSeleccionado(value){

    if (value == '') {
      this.DepartamentoSeleccionado = 'Departamento';
      return;
    }

    this.DepartamentoId = value;
    let d = this.Departamentos.filter(x => x.Id_Departamento == value);
    this.DepartamentoSeleccionado = d[0].Nombre;
    this.ConsultarTotalesDepartamento();
  }

}
