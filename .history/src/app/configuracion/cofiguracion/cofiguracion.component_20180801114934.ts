import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { NgbAccordionModule } from '../../../../node_modules/@ng-bootstrap/ng-bootstrap';
import { Globales } from '../../shared/globales/globales';

@Component({
  selector: 'app-cofiguracion',
  templateUrl: './cofiguracion.component.html',
  styleUrls: ['./cofiguracion.component.css']
})

export class CofiguracionComponent implements OnInit {

  public configuracion : any[];
  public Monedas : any[];
  public Funcionarios : any[];
  public AtributosMonedas: { [email: string]: any; } = {};

  //variables del formulario moneda
  public MaxVentaEfectivo : any[];
  public MinVentaEfectivo : any[];
  public MaxVentaCuenta : any[];
  public MinVentaCuenta : any[];
  public SugeridoVenta : any[];
  public SugeridoCompra : any[];
  public PrecioVentanilla : any[];
  public MaxCompra : any[];
  public MinCompra : any[];
  public MinNoCobro : any[];
  public ComisionEfectivo : any[];
  public PagarComisionDesde : any[];
  public ComisionRecaudo : any[];

  public MaxVentaEfectivoCheck : boolean;
  public MinVentaEfectivoCheck : boolean;
  public MaxVentaCuentaCheck : boolean;
  public MinVentaCuentaCheck : boolean;
  public SugeridoVentaCheck : boolean;
  public SugeridoCompraCheck : boolean;
  public PrecioVentanillaCheck : boolean;
  public MaxCompraCheck : boolean;
  public MinCompraCheck : boolean;
  public MinNoCobroCheck : boolean;
  public ComisionEfectivoCheck : boolean;
  public PagarComisionDesdeCheck : boolean;
  public ComisionRecaudoCheck : boolean;

  public MaxVentaEfectivoFuncionario : any[];
  public MinVentaEfectivoFuncionario : any[];
  public MaxVentaCuentaFuncionario : any[];
  public MinVentaCuentaFuncionario : any[];
  public SugeridoVentaFuncionario : any[];
  public SugeridoCompraFuncionario : any[];
  public PrecioVentanillaFuncionario : any[];
  public MaxCompraFuncionario : any[];
  public MinCompraFuncionario : any[];
  public MinNoCobroFuncionario : any[];
  public ComisionEfectivoFuncionario : any[];
  public PagarComisionDesdeFuncionario : any[];
  public ComisionRecaudoFuncionario : any[];

  @ViewChild('acordeon') acordeon:NgbAccordionModule;

  constructor(private http : HttpClient, private globales:Globales) { }

  /*ngAfterViewInit() {
    console.log("after init");
    this.http.get(this.globales.ruta+'php/configuracion/lista_monedas.php',{ params: { modulo: 'Moneda'}}).subscribe((data:any)=>{
      let consulta= data;   
      for(var i=0; i < consulta.length; ++i)
      {
        this.http.get(this.globales.ruta+'php/configuracion/configuracion_detalle.php',{
          params:{modulo:'Moneda_Funcionario', id:consulta[i].Id_Moneda}
        }).subscribe((data:any)=>{
          for(var j=0; j<data.length; ++j)
          {
            if(this.AtributosMonedas[data[j].Id_Moneda])
            {      
              let dummy: { [email: string]: any; } = { };
              dummy[data[j].Campo] = data[j].Identificacion_Funcionario;
              this.AtributosMonedas[data[j].Id_Moneda] = Object.assign(this.AtributosMonedas[data[j].Id_Moneda], dummy);              
            }
            else{              
              let dummy: { [email: string]: any; } = { };
              dummy[data[j].Campo] = data[j].Identificacion_Funcionario;
              let obj = {dummy};
              this.AtributosMonedas[data[j].Id_Moneda] = dummy;
            }            
          }          
          consulta.forEach(element => {
            if(!element['Campos'])
            {
              if(this.AtributosMonedas[element.Id_Moneda])
              {
                element['Campos'] = this.AtributosMonedas[element.Id_Moneda];
              }
            }            
          }); 
          console.log(consulta);                  
          this.Monedas = consulta;
        });
      }      
    });    
  }*/

  ngOnInit() {
    this.http.get(this.globales.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Configuracion'}}).subscribe((data:any)=>{
      this.configuracion= data;      
    });    
    this.http.get(this.globales.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Funcionario'}}).subscribe((data:any)=>{
      this.Funcionarios= data;     
    });
    this.http.get(this.globales.ruta+'php/configuracion/lista_monedas.php',{ params: { modulo: 'Moneda'}}).subscribe((data:any)=>{
      this.Monedas= data;   
      console.log(this.Monedas);                 
    });
  }

  GuardarMoneda(formularios: NgForm[]){
    for (var i = 0; i < formularios.length; i++) {  
      if(formularios[i].value.Diario)
      {
        let info = JSON.stringify(formularios[i].value)
        let datos = new FormData(); 
        datos.append("modulo",'Moneda_Funcionario');
        datos.append("datos",info);   
        this.http.post(this.globales.ruta+'php/genericos/guardar_generico.php',datos).subscribe((data:any)=>{
          console.log("guardo");          
        });
      }
    }  
  }

  EditarMoneda(id){
    this.ResetFormulario();
    this.http.get(this.globales.ruta+'php/genericos/detalle.php',{
      params:{modulo:'Moneda', id:id}
    }).subscribe((data:any)=>{   
      this.MaxVentaEfectivo = data.Max_Venta_Efectivo;
      this.MinVentaEfectivo = data.Min_Venta_Efectivo;
      this.MaxVentaCuenta = data.Max_Venta_Cuenta;
      this.MinVentaCuenta = data.Min_Venta_Cuenta;
      this.SugeridoVenta = data.Sugerido_Venta;
      this.SugeridoCompra = data.Sugerido_Compra;
      this.PrecioVentanilla = data.Precio_Ventanilla;
      this.MaxCompra = data.Max_Compra;
      this.MinCompra = data.Min_Compra;
      this.MinNoCobro = data.Min_No_Cobro;
      this.ComisionEfectivo = data.Comision_Efectivo;
      this.PagarComisionDesde = data.Pagar_Comision_Desde;
      this.ComisionRecaudo = data.Comision_Recaudo;
    });
    
  }

  ResetFormulario()
  {
    this.MaxVentaEfectivo = null;
    this.MinVentaEfectivo = null;
    this.MaxVentaCuenta = null;
    this.MinVentaCuenta = null;
    this.SugeridoVenta = null;
    this.SugeridoCompra = null;
    this.PrecioVentanilla = null;
    this.MaxCompra = null;
    this.MinCompra = null;
    this.MinNoCobro = null;
    this.ComisionEfectivo = null;
    this.PagarComisionDesde = null;
    this.ComisionRecaudo = null;
    this.MaxVentaEfectivoCheck = null;
    this.MaxVentaEfectivoFuncionario = null;          
    this.MinVentaEfectivoCheck = null;
    this.MinVentaEfectivoFuncionario = null;          
    this.MaxVentaCuentaCheck = null;
    this.MaxVentaCuentaFuncionario = null;          
    this.MinVentaCuentaCheck = null;
    this.MinVentaCuentaFuncionario = null;          
    this.MaxCompraCheck = null;
    this.MaxCompraFuncionario = null;          
    this.MinCompraCheck = null;
    this.MinCompraFuncionario = null;          
    this.SugeridoVentaCheck = null;
    this.SugeridoVentaFuncionario = null;          
    this.SugeridoCompraCheck = null;
    this.SugeridoCompraFuncionario = null;          
    this.PrecioVentanillaCheck = null;
    this.PrecioVentanillaFuncionario = null;          
    this.MinNoCobroCheck = null;
    this.MinNoCobroFuncionario = null;          
    this.ComisionRecaudoCheck = null;
    this.ComisionRecaudoFuncionario = null;          
    this.ComisionEfectivoCheck = null;
    this.ComisionEfectivoFuncionario = null;          
    this.PagarComisionDesdeCheck = null;
    this.PagarComisionDesdeFuncionario = null;
  }

}
