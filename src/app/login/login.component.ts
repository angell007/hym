import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../shared/globales/globales';
import { Funcionario } from '../shared/funcionario/funcionario.model';
import { FuncionarioService } from '../shared/funcionario/funcionario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  readonly ruta = 'https://sigespro.corvuslab.co/'; 
  @ViewChild('confirmacionSwal') confirmacionSwal: any;

  Error: boolean = false;
  Exito: boolean = false;
  Mensaje: string = '';

  constructor(private userService: FuncionarioService, private router : Router, private http: HttpClient, private globales: Globales) { }

  ngOnInit() {
    if(localStorage.getItem("User")){
      this.router.navigate(['/tablero']);
    }
  }
 
  onSubmit(Username, Password){
    this.userService.login(Username,Password).subscribe((data:any)=>{
        if(data.Error=="No"){
            this.Error=false;
            this.Exito=true;
            this.Mensaje="Usted ha iniciado sesion correctamente, esta siendo dirijido al tablero principal.";
            localStorage.setItem('Token',data.Token);
            localStorage.setItem('User',JSON.stringify(data.Funcionario));
            this.router.navigate(['/tablero']);
        }else{
          this.Error=true;
          this.Mensaje=data.Mensaje;
        }
       
    },
  (err: HttpErrorResponse)=>{
    this.Error=true;
    this.Mensaje="Falló la Conexión";
  });
  }


  saveIdentificacion(id){
    let datos = new FormData();
    datos.append("id",id);
    this.http.post(this.globales.ruta + 'php/funcionarios/reset_clave.php',datos).subscribe((data: any) => {
      this.confirmacionSwal.title = "Clave Restablecida";
      this.confirmacionSwal.text = data.Mensaje;
      this.confirmacionSwal.type = data.Tipo;
      this.confirmacionSwal.show(); 

    });


  }





}
