import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild, HostListener, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Globales } from '../../shared/globales/globales';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfilcrear',
  templateUrl: './perfilcrear.component.html',
  styleUrls: ['./perfilcrear.component.scss']
})
export class PerfilcrearComponent implements OnInit {

  @ViewChild('FormPerfil') FormPerfil: any;
  @ViewChild('errorSwal') errorSwal: any;
  @ViewChild('saveSwal') saveSwal: any;
  @ViewChild('deleteSwal') deleteSwal: any;
  @ViewChild('confirmacionSwal') confirmacionSwal: any;
  public Permisos: any = [] = [
    {
      "Titulo_Modulo": "Agentes Externos",
      "Modulo": "AgentesExternos",
      "Ver": false,
      "Crear": false,
      "Editar": false,
      "Eliminar": false
    },
    {
      "Titulo_Modulo": "Transferencias",
      "Modulo": "Transferencias",
      "Ver": false,
      "Crear": false,
      "Editar": false,
      "Eliminar": false
    },
    {
      "Titulo_Modulo": "Traslados",
      "Modulo": "Traslados",
      "Ver": false,
      "Crear": false,
      "Editar": false,
      "Eliminar": false
    },
    {
      "Titulo_Modulo": "POS",
      "Modulo": "POS",
      "Ver": false,
      "Crear": false,
      "Editar": false,
      "Eliminar": false
    },
    {
      "Titulo_Modulo": "Egresos",
      "Modulo": "Egresos",
      "Ver": false,
      "Crear": false,
      "Editar": false,
      "Eliminar": false
    },
    {
      "Titulo_Modulo": "Giros",
      "Modulo": "Giros",
      "Ver": false,
      "Crear": false,
      "Editar": false,
      "Eliminar": false
    },
    {
      "Titulo_Modulo": "Corresponsal Bancario",
      "Modulo": "CorresponsalBancario",
      "Ver": false,
      "Crear": false,
      "Editar": false,
      "Eliminar": false
    },
    {
      "Titulo_Modulo": "Servicio Externo",
      "Modulo": "ServicioExterno",
      "Ver": false,
      "Crear": false,
      "Editar": false,
      "Eliminar": false
    },
    {
      "Titulo_Modulo": "Indicadores",
      "Modulo": "Indicadores",
      "Ver": false,
      "Crear": false,
      "Editar": false,
      "Eliminar": false
    },
    {
      "Titulo_Modulo": "Balance General",
      "Modulo": "BalanceGeneral",
      "Ver": false,
      "Crear": false,
      "Editar": false,
      "Eliminar": false
    },
    {
      "Titulo_Modulo": "Flujo Efectivo",
      "Modulo": "FlujoEfectivo",
      "Ver": false,
      "Crear": false,
      "Editar": false,
      "Eliminar": false
    },
    {
      "Titulo_Modulo": "Cuentas por Cobrar (cartera)",
      "Modulo": "CuentasCobrar",
      "Ver": false,
      "Crear": false,
      "Editar": false,
      "Eliminar": false
    },
    {
      "Titulo_Modulo": "Cuentas por Pagar",
      "Modulo": "CuentasPagar",
      "Ver": false,
      "Crear": false,
      "Editar": false,
      "Eliminar": false
    },
    {
      "Titulo_Modulo": "Cuentas Terceros",
      "Modulo": "CuentasTerceros",
      "Ver": false,
      "Crear": false,
      "Editar": false,
      "Eliminar": false
    },
    {
      "Titulo_Modulo": "Configuracion",
      "Modulo": "Configuracion",
      "Ver": false,
      "Crear": false,
      "Editar": false,
      "Eliminar": false
    },
    {
      "Titulo_Modulo": "Configuracion General",
      "Modulo": "ConfiguracionGeneral",
      "Ver": false,
      "Crear": false,
      "Editar": false,
      "Eliminar": false
    },
    {
      "Titulo_Modulo": "Cargo",
      "Modulo": "Cargo",
      "Ver": false,
      "Crear": false,
      "Editar": false,
      "Eliminar": false
    },
    {
      "Titulo_Modulo": "Oficinas",
      "Modulo": "Oficinas",
      "Ver": false,
      "Crear": false,
      "Editar": false,
      "Eliminar": false
    },
    {
      "Titulo_Modulo": "Cajas",
      "Modulo": "Cajas",
      "Ver": false,
      "Crear": false,
      "Editar": false,
      "Eliminar": false
    },
    {
      "Titulo_Modulo": "Bancos",
      "Modulo": "Bancos",
      "Ver": false,
      "Crear": false,
      "Editar": false,
      "Eliminar": false
    },
    {
      "Titulo_Modulo": "Cuentas Bancarias",
      "Modulo": "CuentasBancarias",
      "Ver": false,
      "Crear": false,
      "Editar": false,
      "Eliminar": false
    },
    {
      "Titulo_Modulo": "Destinatarios",
      "Modulo": "Destinatarios",
      "Ver": false,
      "Crear": false,
      "Editar": false,
      "Eliminar": false
    },
    {
      "Titulo_Modulo": "Cajas Recaudos",
      "Modulo": "CajasRecaudos",
      "Ver": false,
      "Crear": false,
      "Editar": false,
      "Eliminar": false
    },
    {
      "Titulo_Modulo": "Perfiles",
      "Modulo": "Perfiles",
      "Ver": false,
      "Crear": false,
      "Editar": false,
      "Eliminar": false
    },
    {
      "Titulo_Modulo": "Remitentes",
      "Modulo": "Remitentes",
      "Ver": false,
      "Crear": false,
      "Editar": false,
      "Eliminar": false
    },
    {
      "Titulo_Modulo": "Funcionarios",
      "Modulo": "Funcionarios",
      "Ver": false,
      "Crear": false,
      "Editar": false,
      "Eliminar": false
    },
    {
      "Titulo_Modulo": "Terceros",
      "Modulo": "Terceros",
      "Ver": false,
      "Crear": false,
      "Editar": false,
      "Eliminar": false
    },
    {
      "Titulo_Modulo": "Grupos",
      "Modulo": "Grupos",
      "Ver": false,
      "Crear": false,
      "Editar": false,
      "Eliminar": false
    },
    {
      "Titulo_Modulo": "Tipos de Documentos",
      "Modulo": "TiposDocumentos",
      "Ver": false,
      "Crear": false,
      "Editar": false,
      "Eliminar": false
    },
    {
      "Titulo_Modulo": "Tipos de Cuentas",
      "Modulo": "TiposCuentas",
      "Ver": false,
      "Crear": false,
      "Editar": false,
      "Eliminar": false
    },
    {
      "Titulo_Modulo": "Monedas",
      "Modulo": "Monedas",
      "Ver": false,
      "Crear": false,
      "Editar": false,
      "Eliminar": false
    },
    {
      "Titulo_Modulo": "Informacion Giros",
      "Modulo": "InformacionGiros",
      "Ver": false,
      "Crear": false,
      "Editar": false,
      "Eliminar": false
    },
    {
      "Titulo_Modulo": "Compras",
      "Modulo": "Compras",
      "Ver": false,
      "Crear": false,
      "Editar": false,
      "Eliminar": false
    },
    {
      "Titulo_Modulo": "Log de Sistema",
      "Modulo": "LogSistema",
      "Ver": false,
      "Crear": false,
      "Editar": false,
      "Eliminar": false
    }
  ];

  constructor(private http: HttpClient, private globales: Globales, private router: Router) { }

  ngOnInit() {
  }

  GuardarPerfil(formulario: NgForm) {

    let info = JSON.stringify(formulario.value);
    let modulos=JSON.stringify(this.Permisos);
    let datos = new FormData();
    datos.append("modulo", 'Perfil');
    datos.append("datos", info);
    datos.append("modulos", modulos);
    //console.log(datos);
    this.http.post(this.globales.ruta + 'php/perfiles/guardar_perfil.php', datos)
      .catch(error => {
        console.error('An error occurred:', error.error);
        return this.handleError(error);
      })
      .subscribe((data: any) => {
        this.confirmacionSwal.title = "Perfil creado";
        this.confirmacionSwal.text = data.mensaje;
        this.confirmacionSwal.type = data.tipo;
        this.confirmacionSwal.show();
        this.VerPantallaLista();
        formulario.reset();
      });
  }

  VerPantallaLista() {
    this.router.navigate(['/perfiles']);
  }

  handleError(error: Response) {
    return Observable.throw(error);
  }
  /*customReset()
  {
    this.nombreVal.reset();
    this.detallesVal.reset();
  }
  /*InicializarBool()
  {
    this.boolNombre = false;
    this.transfVerVal = false;
    this.transfEditarVal = false;
    this.transfEliminarVal = false;
    this.traslVerVal = false;
    this.traslEditarVal = false;
    this.traslEliminarVal = false;
    this.cajasVerVal = false;
    this.cajasEditarVal = false;
    this.cajasEliminarVal = false;
    this.girosVerVal = false;
    this.girosEditarVal = false;
    this.girosEliminarVal = false;
    this.corrVerVal = false;
    this.corrEditarVal = false;
    this.corrEliminarVal = false;
    this.servVerVal = false;
    this.servEditarVal = false;
    this.servEliminarVal = false;
    this.confVerVal = false;
    this.confEditarVal = false;
    this.confEliminarVal = false;
    this.indiVerVal = false;
    this.indiEditarVal = false;
    this.indiEliminarVal = false;
    this.reporVerVal = false;
    this.reporEditarVal = false;
    this.reporEliminarVal = false;
  }*/


}
