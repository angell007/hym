import { Component, OnInit, Input } from '@angular/core';
import { Globales } from '../../shared/globales/globales';
import { HttpClient } from '@angular/common/http';
import { Funcionario } from '../../shared/funcionario/funcionario.model';
import { Router } from '@angular/router';
import { Route } from '@angular/compiler/src/core';

@Component({
  selector: 'app-funcionarioinformativecard',
  templateUrl: './funcionarioinformativecard.component.html',
  styleUrls: ['./funcionarioinformativecard.component.scss']
})

export class FuncionarioinformativecardComponent implements OnInit {

  @Input() Funcionario:any = {};

  public Funcionarios_Activos:Array<any> = []; 
  public SesionAbierta:boolean = false;

  constructor(public globales:Globales, private client:HttpClient, public router:Router) { }

  ngOnInit() {
    this.SesionAbierta = this.Funcionario.Hora_Cierre == '00:00:00' ? true : false;
  }

  AbrirCierreFuncionario(){
    console.log(this.Funcionario.Identificacion_Funcionario);
    
    this.router.navigate(['/cierrecaja', this.Funcionario.Identificacion_Funcionario, true]);
  }
}
