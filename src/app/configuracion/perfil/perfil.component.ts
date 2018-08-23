import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild, HostListener, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Globales } from '../../shared/globales/globales';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  public id = this.route.snapshot.params["id"];
  public Datos:any[]=[];
  
  constructor(private http : HttpClient, private globales : Globales, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
      
    this.http.get(this.globales.ruta+'php/genericos/detalle.php',{
      params:{modulo:'Perfil', id:this.id}
    }).subscribe((data:any)=>{
     this.Datos=data;
     console.log(this.Datos);
     

    });
  }


}
