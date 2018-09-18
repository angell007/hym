import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Globales } from '../../../shared/globales/globales';
import { Subject } from 'rxjs/Subject';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tercerosver',
  templateUrl: './tercerosver.component.html',
  styleUrls: ['./tercerosver.component.scss']
})
export class TercerosverComponent implements OnInit {

  id = this.route.snapshot.params["id"];
  Tercero = [];

  constructor(private route: ActivatedRoute,private http : HttpClient, private globales: Globales) { }

  ngOnInit() {
    this.http.get(this.globales.ruta+'php/terceros/detalle_tercero.php',{
      params:{id:this.id}
    }).subscribe((data:any)=>{
      this.Tercero = data;  
    });
  }

}
