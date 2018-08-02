import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { Funcionario } from './funcionario.model';
import { Globales } from '../../shared/globales/globales';


@Injectable()
export class FuncionarioService {
  constructor(private http : HttpClient, private globales: Globales) { }

  registro(funcionario: Funcionario){
    const body : Funcionario = {
      Nombres : funcionario.Nombres,
      Apellidos : funcionario.Apellidos,
      Username : funcionario.Username,
      Password : funcionario.Password,
      Correo: funcionario.Correo
    }
    return this.http.post(this.globales.ruta+'php/funcionarios/registro.php',body);
  } 
  login(Username, Password){
    //var data = "username="+Username+"&password="+Password;
    let data = new FormData();
    data.append('username', Username);
    data.append('password', Password);
    return this.http.post(this.globales.ruta+'php/sesion/validate.php',data) 
  }
  getDetalles(){
      return this.http.get(this.globales.ruta+'php/funcionarios/datos.php',{headers:new HttpHeaders({'Token':localStorage.getItem('Token')})})
  }
}
