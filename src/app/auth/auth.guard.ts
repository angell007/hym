import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router : Router){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      if(localStorage.getItem("Token")!=null){
        /*if(this.router.url==='/login'){
          this.router.navigate(["/tablero"]);
        }else{
          return true;
        }*/ 
        return true;
      }
      this.router.navigate(["/login"]);
      return false;
  }
}
