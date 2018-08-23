import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, map, elementAt } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Globales } from '../../../shared/globales/globales';
import { Router } from '@angular/router';

@Component({
  selector: 'app-oficinaver',
  templateUrl: './oficinaver.component.html',
  styleUrls: ['./oficinaver.component.scss']
})
export class OficinaverComponent implements OnInit {
  id = this.route.snapshot.params["id"];
  oficina: any;
  Municipios: any;
  Departamentos: any;

  constructor(private route: ActivatedRoute, private http: HttpClient, private globales: Globales, private router: Router) { }


  ngOnInit() {

    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Departamento' } }).subscribe((data: any) => {
      this.Departamentos = data;
    });

    this.http.get(this.globales.ruta + '/php/oficinas/detalle_oficina.php', { params: { modulo: 'Oficina', id: this.id } }).subscribe((data: any) => {
      this.Municipios_Departamento(data.Id_Departamento);
      this.oficina = data;
    });
  }

  Municipios_Departamento(Departamento) {
    this.http.get(this.globales.ruta + 'php/genericos/municipios_departamento.php', { params: { id: Departamento } }).subscribe((data: any) => {
      this.Municipios = data;
    });
  }

}
