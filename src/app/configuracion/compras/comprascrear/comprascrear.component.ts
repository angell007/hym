import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild, HostListener, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Globales } from '../../../shared/globales/globales';
import { Router, ActivatedRoute } from '@angular/router';
import { TerceroService } from '../../../shared/services/tercero/tercero.service';
import { ProveedorService } from '../../../shared/services/proveedor/proveedor.service';
import { CambioService } from '../../../shared/services/cambio.service';
import { CompraService } from '../../../shared/services/compra/compra.service';
import { MonedaService } from '../../../shared/services/monedas/moneda.service';
import { SwalService } from '../../../shared/services/swal/swal.service';

@Component({
  selector: 'app-comprascrear',
  templateUrl: './comprascrear.component.html',
  styleUrls: ['./comprascrear.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ComprascrearComponent implements OnInit {

  ComprasPendientes = [];
  ListarCompra = [];

  @ViewChild('mensajeSwal') mensajeSwal: any;
  @ViewChild('alertSwal') alertSwal: any;

  public Funcionario: any = JSON.parse(localStorage['User']);

  public Monedas: Array<any> = [];
  public Proveedores: Array<any> = [];
  public ListaComprasSeleccionadas: any = [];

  public CodigoMoneda: string = '';

  public CompraModel: any = {
    Id_Compra: '',
    Codigo: '',
    Id_Tercero: '',
    Valor_Compra: 0,
    Tasa: '',
    Valor_Peso: 0,
    Detalle: '',
    Id_Moneda_Compra: '1',
    Id_Funcionario: this.Funcionario.Identificacion_Funcionario
  };

  constructor(private http: HttpClient,
    private globales: Globales,
    private router: Router,
    private terceroService: ProveedorService,
    private cambioService: CambioService,
    private compraService: CompraService,
    private activeRoute: ActivatedRoute,
    private _monedaService: MonedaService,
    private _swalService: SwalService) {
  }

  ngOnInit() {
    setTimeout(() => {
      this.AsignarMonedas();
      this.GetProveedores();
    }, 2000);
  }

  ngAfterViewInit() {
  }

  AsignarMonedas() {
    this._monedaService.getMonedasExtranjeras().subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.Monedas = data.query_data;
      } else {
        this.Monedas = [];
        this._swalService.ShowMessage(data);
      }
    });
  }

  GetProveedores() {
    this.terceroService.getP2().subscribe((data: any) => {
      this.Proveedores = data.terceros;
    });
  }

  SetCodigoMoneda() {
    if (this.CompraModel.Id_Moneda_Compra != '') {

      let monedaObj = this.Monedas.find(m => m.Id_Moneda == this.CompraModel.Id_Moneda_Compra);
      this.CodigoMoneda = monedaObj.Codigo;
    } else {

      this.CodigoMoneda = '';
    }
  }

  ActualizarValoresCompra(valores: Array<any>) {
    this.CompraModel.Valor_Compra = 0;

    if (valores.length > 0) {

      this.ListaComprasSeleccionadas = valores;

      valores.forEach(compra => {
        this.CalcularValorCompra(parseFloat(compra.Valor));
      });

      if (this.CompraModel.Tasa != '') {
        this.CalcularCambio();
      }
    } else {

      this.CompraModel.Valor_Peso = 0;
      this.ListaComprasSeleccionadas = [];
    }
  }

  CalcularValorCompra(valor: number) {
    let suma = parseFloat(this.CompraModel.Valor_Compra) + valor;
    this.CompraModel.Valor_Compra = suma.toFixed(4);
  }

  CalcularCambio() {
    let tasa = this.CompraModel.Tasa;

    // console.log(tasa);

    if (tasa == '' || tasa === undefined || tasa === null) {
      this.ShowSwal('warning', 'Alerta', 'Debe colocar una tasa de cambio para la conversión!');
      this.CompraModel.Valor_Peso = 0;
    } else {
      if (this.CompraModel.Valor_Compra != 0) {
        let cambio = this.cambioService.CambioMonedaXPeso(this.CompraModel.Valor_Compra, parseFloat(tasa));

        this.CompraModel.Valor_Peso = Math.round(Number(cambio) * (1 / 100)) / (1 / 100);

      } else {

        this.ShowSwal('warning', 'Alerta', 'Debe escoger compras para poder realizar el cálculo!');
      }
    }
  }

  ValidateCompraBeforeSubmit(): boolean {
    if (this.CompraModel.Id_Moneda == '') {
      this.ShowSwal('warning', 'Alerta', 'Debe escoger la moneda para guardar los datos!');
      return false;
    } else if (this.CompraModel.Id_Tercero == '') {
      this.ShowSwal('warning', 'Alerta', 'Debe escoger el tercero para guardar los datos!');
      return false;
    } else if (this.CompraModel.Valor_Compra == 0) {
      this.ShowSwal('warning', 'Alerta', 'Ha ocurrido un imprevisto con el valor de la compra, verifique los datos antes de guardar!');
      return false;
    } else if (this.CompraModel.Tasa == '') {
      this.ShowSwal('warning', 'Alerta', 'Debe colocar una tasa de cambio para guardar los datos!');
      return false;
    } else if (this.CompraModel.Valor_Peso == 0 || this.CompraModel.Valor_Peso == null) {
      this.ShowSwal('warning', 'Alerta', 'El valor en pesos no puede ser 0 ni vacio!');
      return false;
    } else if (this.ListaComprasSeleccionadas.length == 0) {
      this.ShowSwal('warning', 'Alerta', 'No hay compras seleccionadas para guardar los datos, verifique por favor!');
      return false;
    } else if (this.CompraModel.Tasa != '') {
      if (parseFloat(this.CompraModel.Tasa) < 0) {
        this.ShowSwal('warning', 'Alerta', 'La tasa de cambio no puede ser negativa, corrija el valor de la tasa!');
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }

  }

  GuardarCompra() {
    if (this.ValidateCompraBeforeSubmit()) {
      this.CompraModel.Tasa = this.CompraModel.Tasa.toString();

      let data = new FormData();
      let info = JSON.stringify(this.CompraModel);
      let compras = JSON.stringify(this.ListaComprasSeleccionadas);

      data.append("modelo", info);
      data.append("compras", compras);
      this.compraService.guardarCompra(data).subscribe((data: any) => {

        this.ShowSwal('success', 'Regisro Exitoso', 'Compra generada de manera exitosa!');
        this.LimpiarCompraModel();

        setTimeout(() => {
          this.router.navigate(['/compras']);
        }, 1000);
      });
    }
  }

  LimpiarCompraModel(clearCoin: boolean = false) {
    this.CompraModel = {
      Id_Compra: '',
      Codigo: '',
      Id_Tercero: '',
      Valor_Compra: 0,
      Tasa: '',
      Valor_Peso: 0,
      Detalle: '',
      Id_Moneda_Compra: clearCoin ? '' : this.CompraModel.Id_Moneda_Compra,
      Id_Funcionario: this.Funcionario.Identificacion_Funcionario
    };

    this.ListaComprasSeleccionadas = [];
  }

  MostrarMensajeTabla(msgObj: any) {
    this.ShowSwal(msgObj.type, msgObj.title, msgObj.msg);
  }

  ShowSwal(tipo: string, titulo: string, msg: string) {
    this.alertSwal.type = tipo;
    this.alertSwal.title = titulo;
    this.alertSwal.text = msg;

    this.alertSwal.show();
  }
}
