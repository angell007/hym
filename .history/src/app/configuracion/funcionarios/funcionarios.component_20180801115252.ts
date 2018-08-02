import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../shared/globales/globales';

@Component({
  selector: 'app-funcionarios',
  templateUrl: './funcionarios.component.html',
  styleUrls: ['./funcionarios.component.css']
})
export class FuncionariosComponent implements OnInit {
  public funcionarios : any[];

  constructor(private http : HttpClient, private globales : Globales) { }

  ngOnInit() {
    this.http.get(this.globales.ruta+'php/funcionarios/lista_funcionarios.php').subscribe((data:any)=>{
      this.funcionarios= data;
    });
  }

}
