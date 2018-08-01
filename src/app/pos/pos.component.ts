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
  public Funcionarios : any[] = [];
  public ServiciosExternos : any[] = [];
  public CorresponsalesBancarios : any[] = [];
  public Documentos : any[];
  public Cajas : any[];
  public Monedas : any[];
  public Recibe : any[];
  public IdCorresponsal : number;
  public IdOficina : number;
  public IdCaja : number;
  public Estado : string;
  public DetalleCorresponsal : string;  
  public Costo : number;
  public PrecioSugerido : number;
  public CantidadRecibida : number;
  public ValorTotal : number;
  public ValorEntrega : number;
  public ValorCorresponsal : number;  
  public CorresponsalBancario : number;  
  public ComisionServicioExterno : number;

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
    this.http.get(this.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Corresponsal_Bancario'}}).subscribe((data:any)=>{
      this.CorresponsalesBancarios= data;
    });
    this.http.get(this.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Servicio_Externo'}}).subscribe((data:any)=>{
      this.ServiciosExternos= data;
    });
    this.http.get(this.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Caja'}}).subscribe((data:any)=>{
      this.Cajas= data;
    });
    this.http.get(this.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Moneda'}}).subscribe((data:any)=>{
      this.Monedas= data;
    });
    this.http.get(this.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Funcionario'}}).subscribe((data:any)=>{
      this.Funcionarios= data;
    });
    this.http.get(this.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Destinatario'}}).subscribe((data:any)=>{
      this.Destinatarios= data;
    });
    this.IdentificacionFuncionario = JSON.parse(localStorage['User']).Identificacion_Funcionario;
    this.IdOficina = 1;
    this.IdCaja = 1;
    this.Costo = 1;
    this.Estado = "Enviado";
  }

  GuardarTransferencia(formulario: NgForm)
  {
    let info = JSON.stringify(formulario.value);
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

  RealizarGiro(remitente: NgForm, destinatario: NgForm, giro: NgForm)
  {
    let formulario = giro.value;
    formulario['Documento_Remitente'] = remitente.value.Documento_Remitente;
    formulario['Nombre_Remitente'] = remitente.value.Nombre + " " + remitente.value.Apellido;
    formulario['Telefono_Remitente'] = remitente.value.Telefono + " - " + remitente.value.Celular;
    formulario['Documento_Destinatario'] = destinatario.value.Documento_Remitente;
    formulario['Nombre_Destinatario'] = destinatario.value.Nombre + " " + destinatario.value.Apellido;
    formulario['Telefono_Destinatario'] = destinatario.value.Telefono + " - " + destinatario.value.Celular;
    let info = JSON.stringify(formulario);       
    let datos = new FormData();
    datos.append("modulo",'Giro');
    datos.append("datos",info);
    this.http.post(this.ruta+'php/genericos/guardar_generico.php',datos).subscribe((data:any)=>{       
      giro.reset();
    });

    let infoRemitente = JSON.stringify(remitente.value);       
    let datosRemitente = new FormData();
    datosRemitente.append("modulo",'Giro_Remitente');
    datosRemitente.append("datos",infoRemitente);
    this.http.post(this.ruta+'php/genericos/guardar_generico.php',datosRemitente).subscribe((data:any)=>{   
      remitente.reset();
    });

    let infoDestinatario = JSON.stringify(destinatario.value);       
    let datosDestinatario = new FormData();
    datosDestinatario.append("modulo",'Giro_Destinatario');
    datosDestinatario.append("datos",infoDestinatario);
    this.http.post(this.ruta+'php/genericos/guardar_generico.php',datosDestinatario).subscribe((data:any)=>{  
      destinatario.reset();
    });
    this.ValorTotal = null;
    this.ValorEntrega = null;
    this.Costo = 0;
    this.Costo = 1;
  }

  CalcularTotal(value)
  {
    this.ValorTotal = Number.parseInt(value) + this.Costo;
    this.ValorEntrega = Number.parseInt(value) - this.Costo;
  }

  RealizarTraslado(formulario: NgForm)
  {
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    datos.append("modulo",'Traslado_Caja');
    datos.append("datos",info);
    this.http.post(this.ruta+'php/genericos/guardar_generico.php',datos).subscribe((data:any)=>{   
      formulario.reset();
    });
  }

  GuardarServicio(formulario: NgForm)
  {
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    datos.append("modulo",'Servicio');
    datos.append("datos",info);
    this.http.post(this.ruta+'php/genericos/guardar_generico.php',datos).subscribe((data:any)=>{   
      formulario.reset();
    });
  }

  AsignarComisionServicioExterno(value)
  {
    this.http.get(this.ruta+'php/genericos/detalle.php',{
      params:{modulo:'Servicio_Externo', id:value}
    }).subscribe((data:any)=>{
      this.ComisionServicioExterno = data.Comision;
    });
  }

  GuardarCorresponsal(formulario: NgForm)
  {
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    datos.append("modulo",'Corresponsal_Diario');
    datos.append("datos",info);
    this.http.post(this.ruta+'php/corresponsaldiario/guardar_corresponsal_diario.php',datos).subscribe((data:any)=>{   
      //formulario.reset();      
      this.ResetFormulario();      
    });
  }

  ConsultarCorresponsal(id)
  {
    this.CorresponsalBancario = id; 
    let datos = new FormData();
    //let funcionario = this.IdentificacionFuncionario;
    datos.append("Identificacion_Funcionario", JSON.parse(localStorage['User']).Identificacion_Funcionario);
    datos.append("Id_Corresponsal_Diario", id);
    this.http.post(this.ruta+'php/corresponsaldiario/lista_corresponsales.php',datos).subscribe((data:any)=>{   
      this.IdCorresponsal = data.Id_Corresponsal_Diario;
      this.ValorCorresponsal = data.Valor;
      this.DetalleCorresponsal = data.Detalle;
    });
  }

  ResetFormulario()
  {
    this.IdCorresponsal = null;
    this.ValorCorresponsal = null;
    this.DetalleCorresponsal = null;
    this.CorresponsalBancario = null;
  }

}
