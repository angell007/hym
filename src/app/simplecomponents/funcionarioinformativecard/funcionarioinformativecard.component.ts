import { Component, OnInit, Input } from '@angular/core';
import { Globales } from '../../shared/globales/globales';
import { HttpClient } from '@angular/common/http';
import { Funcionario } from '../../shared/funcionario/funcionario.model';
import { Router } from '@angular/router';
import { Route } from '@angular/compiler/src/core';
import { SwalService } from '../../shared/services/swal/swal.service';

@Component({
  selector: 'app-funcionarioinformativecard',
  templateUrl: './funcionarioinformativecard.component.html',
  styleUrls: ['./funcionarioinformativecard.component.scss']
})

export class FuncionarioinformativecardComponent implements OnInit {

  @Input() Funcionario:any = {};
  @Input() Fecha:string = '';

  public Funcionarios_Activos:Array<any> = []; 
  public SesionAbierta:boolean = false;

  constructor(public globales:Globales, private client:HttpClient, public router:Router, private _swalService:SwalService) { }

  ngOnInit() {
    this.SesionAbierta = this.Funcionario.Hora_Cierre == '00:00:00' ? true : false;
  }

  AbrirCierreFuncionario(){
    console.log(this.Funcionario.Identificacion_Funcionario);
    console.log(this.Fecha);
    if (this.Fecha == '') {
      this._swalService.ShowMessage(['warning','Alerta','La fecha para la consulta del cierre esta vacia, contacte con el administrador del sistema!']);
    }else{
      this.router.navigate(['/cierrecaja', this.Funcionario.Identificacion_Funcionario, true, this.Fecha]);
    }
  }
}
