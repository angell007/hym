import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Observable } from "rxjs";
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.css']
})
export class PosComponent implements OnInit {

  public IdentificacionFuncionario : any[];
  public Destinatarios : any[] = [];
  public Documentos : any[];
  public Monedas : any[];
  public Recibe : any[];
  public IdOficina : number;
  public IdCaja : number;
  public Estado : string;
  public Costo : number;
  public PrecioSugerido : number;
  public CantidadRecibida : number;

  readonly ruta = 'https://hym.corvuslab.co/'; 
  constructor(private http : HttpClient) { }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term.length < 4 ? []
        : this.Destinatarios.filter(v => v.Nombre.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );
  formatter = (x: { Nombre: string }) => x.Nombre;

  ngOnInit() {
    this.http.get(this.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Tipo_Documento'}}).subscribe((data:any)=>{
      this.Documentos= data;
    });
    this.http.get(this.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Moneda'}}).subscribe((data:any)=>{
      this.Monedas= data;
    });
    this.http.get(this.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Destinatario'}}).subscribe((data:any)=>{
      this.Destinatarios= data;
      console.log(this.Destinatarios);      
    });
    console.log(JSON.parse(localStorage['User']));    
    this.IdentificacionFuncionario = JSON.parse(localStorage['User']).Identificacion_Funcionario;
    this.IdOficina = 1;
    this.IdCaja = 1;
    this.Costo = 1;
    this.Estado = "Enviado";
  }

  GuardarTransferencia(formulario: NgForm)
  {
    let info = JSON.stringify(formulario.value);
    console.log(info);    
    let datos = new FormData();
    datos.append("modulo",'Transferencia');
    datos.append("datos",info);
    this.http.post(this.ruta+'php/genericos/guardar_generico.php',datos).subscribe((data:any)=>{   
      formulario.reset();
    });
  }

  CambiarTasa(value)
  {
    if(value>0)
    {
      this.PrecioSugerido = this.Monedas[value-1].Sugerido_Venta;
    }    
  }

  RealizarCambio()
  {
    console.log(this.PrecioSugerido);    
  }

  SeleccionarTipo(tipo)
  {
    this.Recibe = tipo;
    console.log(this.Recibe);    
  }

}
