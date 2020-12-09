import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, map, elementAt } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Globales } from '../../../shared/globales/globales';
import { Router } from '@angular/router';

@Component({
  selector: 'app-oficinaseditar',
  templateUrl: './oficinaseditar.component.html',
  styleUrls: ['./oficinaseditar.component.scss']
})
export class OficinaseditarComponent implements OnInit {
  Municipios: any;
  oficina:any = {};
  id = this.route.snapshot.params["id"];
  Departamentos: any;
  moneda1 = true;

  @ViewChild('confirmacionSwal') confirmacionSwal: any;
  CamposMoneda =[];
  Campos=[];
  Monedas=[];
  ocultar = true;

  public departamentoDefault:string = '';
  public municipioDefault:string = '';

  constructor(private route: ActivatedRoute, private http: HttpClient, private globales: Globales, private router: Router) { }

  ngOnInit() {
    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Departamento' } }).subscribe((data: any) => {
      this.Departamentos = data;
    });

    this.http.get(this.globales.ruta + '/php/oficinas/detalle_oficina.php', { params: { modulo: 'Oficina', id: this.id } }).subscribe((data: any) => {
      this.Municipios_Departamento(data.Id_Departamento);
      //console.log(data)
      this.oficina = data.detalle;
      this.CamposMoneda = data.moneda;
      
      if(this.Monedas.length == 0){
        this.ocultar = false;
      }

    });

  }

  Municipios_Departamento(Departamento) {
    this.http.get(this.globales.ruta + 'php/genericos/municipios_departamento.php', { params: { id: Departamento } }).subscribe((data: any) => {
      this.Municipios = data;
    });
  }

  GuardarOficina(formulario: NgForm) {
    let info = JSON.stringify(formulario.value);
    let moneda = JSON.stringify(this.CamposMoneda);

    let datos = new FormData();
    datos.append("modulo", 'Oficina');
    datos.append("datos", info);
    datos.append("monedas", moneda);

    this.http.post(this.globales.ruta + 'php/oficinas/guardar_oficina.php', datos).subscribe((data: any) => {
      this.confirmacionSwal.title = "Oficina Actualizada";
      this.confirmacionSwal.text = "Se ha realizado la actualización correctamente";
      this.confirmacionSwal.type = "success";
      this.confirmacionSwal.show();
      formulario.reset();
      this.router.navigate(['oficinas']);
    });

  }

  agregarValor(pos1,pos, valor) {
    this.CamposMoneda[pos1].Campos[pos].Valor = valor
    //console.log(this.CamposMoneda[pos1]);
  }

  habilitarCampo(moneda){
    ////console.log(moneda)
    this.http.get(this.globales.ruta+'/php/configuracion/lista_moneda_campo.php').subscribe((data:any)=>{
      this.Campos= data;
      var datosMoneda= {
        "Id_Moneda": moneda,
        "Titulo" : this.Monedas[(moneda-1)].Nombre,
        "Campos" : this.Campos
      }
  
      this.CamposMoneda.push(datosMoneda);
      this.moneda1 = false;

      this.Monedas.splice((moneda-1));

      if(this.Monedas.length == 0){
        this.ocultar = false;
      }

    }); 
  }

}
