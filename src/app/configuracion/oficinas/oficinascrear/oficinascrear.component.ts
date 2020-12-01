import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-oficinascrear',
  templateUrl: './oficinascrear.component.html',
  styleUrls: ['./oficinascrear.component.scss']
})
export class OficinascrearComponent implements OnInit {
  Departamentos: any;
  Municipios: any;

  @ViewChild('confirmacionSwal') confirmacionSwal: any;
  Monedas = [];
  ocultar = true;
  constructor(private route: ActivatedRoute, private http: HttpClient, private globales: Globales, private router: Router) { }
  Campos = [];
  CamposMoneda = [];
  moneda1 = true;
  departamentoDefault:any = '';
  municipioDefault:any = '';

  ngOnInit() {

    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Departamento' } }).subscribe((data: any) => {
      this.Departamentos = data;
    });

    this.http.get(this.globales.ruta + 'php/monedas/lista_monedas.php').subscribe((data: any) => {
      this.Monedas = data;
    });

  }

  Municipios_Departamento(Departamento) {
    this.http.get(this.globales.ruta + 'php/genericos/municipios_departamento.php', { params: { id: Departamento } }).subscribe((data: any) => {
      this.Municipios = data;
    });
  }

  GuardarOficina(formulario: NgForm, modal: any = null) {
    let info = JSON.stringify(formulario.value);
    let moneda = JSON.stringify(this.CamposMoneda);
    let datos = new FormData();
    //this.OcultarFormulario(modal);
    // console.log(info);
    datos.append("modulo", 'Oficina');
    datos.append("datos", info);
    datos.append("monedas", moneda);

    this.http.post(this.globales.ruta + 'php/oficinas/guardar_oficina.php', datos)
      .subscribe((data: any) => {
        formulario.reset();
        this.confirmacionSwal.title = "Creación Oficina";
        this.confirmacionSwal.text = "Oficina creada con éxito";
        this.confirmacionSwal.type = "success";
        this.confirmacionSwal.show();
        this.router.navigate(['oficinas']);
      });
  }

  agregarValor(pos1,pos, valor) {
    this.CamposMoneda[pos1].Campos[pos].Valor = valor
  }

  habilitarCampo(moneda){
    //console.log(moneda)
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
