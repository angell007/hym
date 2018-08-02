import { Component, OnInit } from '@angular/core';
import { Funcionario } from '../shared/funcionario/funcionario.model';
import { FuncionarioService } from '../shared/funcionario/funcionario.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  Error: boolean = false;
  Mensaje: string = '';

  constructor(private userService: FuncionarioService, private router : Router) { }

  ngOnInit() {
  }
 
  onSubmit(Username, Password){
    this.userService.login(Username,Password).subscribe((data:any)=>{
        if(data.Error=="No"){
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
}
