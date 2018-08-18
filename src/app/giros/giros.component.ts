import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-giros',
  templateUrl: './giros.component.html',
  styleUrls: ['./giros.component.css']
})
export class GirosComponent implements OnInit {

  readonly ruta = 'https://hym.corvuslab.co/';
  public fecha = new Date();
  public giros = [];

  public Identificacion: any[];

  public Giro: any[];

  public Datos : any[] = [];
  public Origen : any[] = [];
  public Nombre_Remitente : any[] = [];
  public Documento_Remitente : any[] = [];
  public Telefono_Remitente : any[] = [];
  public Nombre_Destinatario : any[] = [];
  public Documento_Destinatario : any[] = [];
  public Telefono_Destinatario : any[] = [];
  public Valor_Recibido : any[] = [];
  public Valor_Entrega : any[] = [];
  public Comision : any[] = [];
  public Detalle : any[] = [];
  public Estado : any[] = [];
  public IdentificacionFuncionario: any[];

  @ViewChild('deleteSwal') deleteSwal:any;
  @ViewChild('errorSwal') errorSwal:any;
  @ViewChild('saveSwal') saveSwal:any;

  /*public Origen : any[];
  public Remitente : any[];
  public Destinatario : any[];
  public Monto : any[];
  public Estado : any[];*/

  conteoGiros = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get(this.ruta + 'php/giros/lista.php').subscribe((data: any) => {
      this.giros = data;
    });

    this.http.get(this.ruta + 'php/giros/conteo.php').subscribe((data: any) => {
      this.conteoGiros = data[0];
    });
    this.ActualizarVista();
  }

  VerGiro(id, modal) {
    this.http.get(this.ruta + 'php/giros/detalle.php', {
      params: { modulo: 'Giro', id: id }
    }).subscribe((data: any) => {
      this.Giro = data;
      this.Identificacion = id;

      //this.Datos=data;
      this.Origen=data.Origen;
      this.Nombre_Remitente=data.Nombre_Remitente;
      this.Documento_Remitente=data.Documento_Remitente;
      this.Telefono_Remitente=data.Telefono_Remitente;
      this.Nombre_Destinatario=data.Nombre_Destinatario;
      this.Documento_Destinatario=data.Documento_Destinatario;
      this.Telefono_Destinatario=data.Telefono_Destinatario;
      this.Valor_Recibido=data.Valor_Recibido;
      this.Valor_Entrega=data.Valor_Entrega;
      this.Comision=data.Comision;
      this.Detalle=data.Detalle;
      this.Estado=data.Estado;
      this.Identificacion = id;

      console.log(this.Giro);
      console.log(this.Identificacion);
      /*this.Grupos.forEach(element => {
        if (element.Id_Grupo == data.Id_Grupo) this.Grupo = element.Nombre;
      });

      this.Terceros.forEach(element => {
        if (element.Id_Tercero == data.Id_Tercero) this.Tercero = element.Nombre;
      });
      this.Moneda = data.Moneda;
      this.Valor = data.Valor;
      this.Detalle = data.Detalle;*/
      modal.show();
    });
  }

  InicializarBool()
  {
  }

  EditarGiro(id, modal) {
    this.InicializarBool();
    this.http.get(this.ruta + 'php/giros/detalle.php', {
      params: { modulo: 'Giro', id: id }
    }).subscribe((data: any) => {
      this.Giro = data;
      this.Identificacion = id;

      console.log(this.Giro);
      console.log(data.Identificacion_Funcionario);

      //this.Datos=data;
      this.Origen=data.Origen;
      this.Nombre_Remitente=data.Nombre_Remitente;
      this.Documento_Remitente=data.Documento_Remitente;
      this.Telefono_Remitente=data.Telefono_Remitente;
      this.Nombre_Destinatario=data.Nombre_Destinatario;
      this.Documento_Destinatario=data.Documento_Destinatario;
      this.Telefono_Destinatario=data.Telefono_Destinatario;
      this.Valor_Recibido=data.Valor_Recibido;
      this.Valor_Entrega=data.Valor_Entrega;
      this.Comision=data.Comision;
      this.Detalle=data.Detalle;
      this.Estado=data.Estado;
      this.Identificacion = id;
      this.IdentificacionFuncionario = data.Identificacion_Funcionario;
      
      modal.show();
    });
  }

  ActualizarVista()
  {
    this.http.get(this.ruta+'php/giros/lista.php').subscribe((data:any)=>{
      this.giros= data;
    });
  }

  EliminarGiro(id){
    let datos = new FormData();
    datos.append("modulo", 'Giro');
    datos.append("id", id); 
    this.http.post(this.ruta + 'php/genericos/anular_generico.php', datos ).subscribe((data: any) => {
      this.deleteSwal.show();
      this.ActualizarVista();
    });
  }

}
