import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { NgForm, FormGroup, FormArray, FormControl } from '@angular/forms';
import { Globales } from '../shared/globales/globales';

@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.css']
})
export class PosComponent implements OnInit {

  public IdentificacionFuncionario : any[];
  public Destinatarios : any[] = [];
  public Remitentes : any[] = [];
  public Paises : any[] = [];
  public Bancos : any[] = [];
  public DestinatariosFiltrados : any[] = [];
  public RemitentesFiltrados : any[] = [];
  public DatosRemitente : any[] = [];
  public Funcionarios : any[] = [];
  public ServiciosExternos : any[] = [];
  public CorresponsalesBancarios : any[] = [];
  public Documentos : any[];
  public Cuentas : any[] = [{
    Id_Destinatario:'',
    Pais:'',
    Banco: '',
    Numero_Cuenta: ''
   }];
  public CuentasDestinatario : any[];
  public Cajas : any[];
  public Monedas : any[];
  public Recibe : any[];
  public IdCorresponsal : number;
  public IdOficina : number;
  public IdCaja : number;
  public Estado : string;
  public DetalleCorresponsal : string;  
  public Cedula : any[];  
  public Costo : number;
  public PrecioSugerido : number;
  public CantidadRecibida : number;
  public ValorTotal : number;
  public ValorEntrega : number;
  public ValorCorresponsal : number;  
  public CorresponsalBancario : number;  
  public ComisionServicioExterno : number;

  @ViewChild('ModalDestinatario') ModalDestinatario:any;
  @ViewChild('FormCuenta') FormCuenta:any;
  constructor(private http : HttpClient, private globales : Globales, private renderer: Renderer2) { }

  ngOnInit() {
    this.http.get(this.globales.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Tipo_Documento'}}).subscribe((data:any)=>{
      this.Documentos= data;
    });
    this.http.get(this.globales.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Corresponsal_Bancario'}}).subscribe((data:any)=>{
      this.CorresponsalesBancarios= data;
    });
    this.http.get(this.globales.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Servicio_Externo'}}).subscribe((data:any)=>{
      this.ServiciosExternos= data;
    });
    this.http.get(this.globales.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Caja'}}).subscribe((data:any)=>{
      this.Cajas= data;
    });
    this.http.get(this.globales.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Moneda'}}).subscribe((data:any)=>{
      this.Monedas= data;
    });
    this.http.get(this.globales.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Funcionario'}}).subscribe((data:any)=>{
      this.Funcionarios= data;
    });
    this.http.get(this.globales.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Destinatario'}}).subscribe((data:any)=>{
      this.Destinatarios= data;
    });
    this.http.get(this.globales.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Transferencia_Remitente'}}).subscribe((data:any)=>{
      this.Remitentes= data;
      console.log(this.Remitentes); 
    });
    this.http.get(this.globales.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Pais'}}).subscribe((data:any)=>{
      this.Paises= data;
    });
    this.http.get(this.globales.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Banco'}}).subscribe((data:any)=>{
      this.Bancos= data;           
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
    this.http.post(this.globales.ruta+'php/genericos/guardar_generico.php',datos).subscribe((data:any)=>{   
      formulario.reset();
    });
  }

  AutoCompletarDestinatario(modelo){ 
    if(modelo.length > 0)
    {
      this.DestinatariosFiltrados = this.Destinatarios.filter(number => number.Id_Destinatario.slice(0, modelo.length) == modelo);
    }
    else
    {
      this.DestinatariosFiltrados = null;
    }
  }

  LlenarValoresDestinatario(destinatario)
  {
    this.CuentasDestinatario = null; 
    if(destinatario.length < 5)
    {
      console.log("número de documento inconrrecto.");      
    }
    else
    {       
      this.http.get(this.globales.ruta+'php/pos/cuentas_destinatarios.php',{ params: { id: destinatario}}).subscribe((data:any)=>{
             
        if(data.length == 0)
        {
          this.CrearDestinatario(destinatario);
        }
        else
        {
          this.CuentasDestinatario = data;
        }        
      });
    }    
  }

  AutoCompletarRemitente(modelo){ 
    console.log(modelo);
    
    this.RemitentesFiltrados = this.Remitentes.filter(number => number.Id_Transferencia_Remitente.slice(0, modelo.length) == modelo);
  }

  LlenarValoresRemitente(remitente)
  {    
    this.DatosRemitente = null; 
    if(remitente.length < 5)
    {
      console.log("número de documento inconrrecto.");      
    }
    else
    {       
      this.http.get(this.globales.ruta+'php/pos/cuentas_destinatarios.php',{ params: { id: remitente}}).subscribe((data:any)=>{
             
        if(data.length == 0)
        {
          this.CrearRemitente(remitente);
        }
        else
        {
          this.DatosRemitente = data;
        }        
      });
    }     
  }

  CrearRemitente(remitente)
  {

  }

  CrearDestinatario(destinatario)
  {
    this.ModalDestinatario.show();
    for(let i = 0; i < this.Cuentas.length; ++i)
    {
      this.Cuentas[i].Id_Destinatario = destinatario;
    } 
    this.Cedula = destinatario;
  }

  AgregarFormCuenta()
  {
    let agregar:boolean = true;  
    for(let i = 0; i < this.Cuentas.length; ++i)
    {
      if(this.Cuentas[i].Banco === "" || this.Cuentas[i].Pais === "" || this.Cuentas[i].Numero_Cuenta === "")
      {
        agregar = false;
        return;
      }
    }
    if(agregar)
    {
      this.Cuentas.push({
        Id_Destinatario: this.Cedula,
        Pais:'',
        Banco: '',
        Numero_Cuenta: ''
      });
      console.log(this.Cuentas);
      
    }    
  }

  GuardarDestinatario(formulario:NgForm)
  { 
    for(let i = 0; i < this.Cuentas.length; ++i)
    {
      this.Cuentas[i].Id_Destinatario = formulario.value.Id_Destinatario;
    }
    let info = JSON.stringify(formulario.value);
    let cuentas = JSON.stringify(this.Cuentas);
    let datos = new FormData();
    datos.append("datos",info);
    datos.append("cuentas",cuentas);
    this.http.post(this.globales.ruta+'php/destinatarios/guardar_destinatario.php',datos).subscribe((data:any)=>{ 
      console.log(data);           
      this.ModalDestinatario.hide();
      this.LlenarValoresDestinatario(formulario.value.Id_Destinatario);
      formulario.reset();
      this.Cedula = null;
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
    this.http.post(this.globales.ruta+'php/genericos/guardar_generico.php',datos).subscribe((data:any)=>{       
      giro.reset();
    });

    let infoRemitente = JSON.stringify(remitente.value);       
    let datosRemitente = new FormData();
    datosRemitente.append("modulo",'Giro_Remitente');
    datosRemitente.append("datos",infoRemitente);
    this.http.post(this.globales.ruta+'php/genericos/guardar_generico.php',datosRemitente).subscribe((data:any)=>{   
      remitente.reset();
    });

    let infoDestinatario = JSON.stringify(destinatario.value);       
    let datosDestinatario = new FormData();
    datosDestinatario.append("modulo",'Giro_Destinatario');
    datosDestinatario.append("datos",infoDestinatario);
    this.http.post(this.globales.ruta+'php/genericos/guardar_generico.php',datosDestinatario).subscribe((data:any)=>{  
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
    this.http.post(this.globales.ruta+'php/genericos/guardar_generico.php',datos).subscribe((data:any)=>{   
      formulario.reset();
    });
  }

  GuardarServicio(formulario: NgForm)
  {
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    datos.append("modulo",'Servicio');
    datos.append("datos",info);
    this.http.post(this.globales.ruta+'php/genericos/guardar_generico.php',datos).subscribe((data:any)=>{   
      formulario.reset();
    });
  }

  AsignarComisionServicioExterno(value)
  {
    this.http.get(this.globales.ruta+'php/genericos/detalle.php',{
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
    this.http.post(this.globales.ruta+'php/corresponsaldiario/guardar_corresponsal_diario.php',datos).subscribe((data:any)=>{   
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
    this.http.post(this.globales.ruta+'php/corresponsaldiario/lista_corresponsales.php',datos).subscribe((data:any)=>{   
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

   CrearForm(form:NgForm)
   {
      console.log(form);      
   }

}
