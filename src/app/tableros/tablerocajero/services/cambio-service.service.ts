import { EventEmitter, Injectable, Output } from '@angular/core';
import { GeneralService } from '../../../shared/services/general/general.service';
import { NgForm, FormGroup, FormArray, FormControl } from '@angular/forms';
import { ConsolidadosService } from '../../../customservices/consolidados.service';
import { Observable } from 'rxjs/Observable';
import { Globales } from '../../../shared/globales/globales';
import { Component, OnInit, ViewChild, HostListener, ElementRef, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FiltroService } from '../../../customservices/filtro.service';
import { PermisoService } from '../../../shared/services/permisos/permiso.service';
import { Subject } from 'rxjs';





@Injectable()
export class CambioService {

  public funcionario_data: any = this.generalService.SessionDataModel.funcionarioData;
  public IdCaja: any = this.generalService.SessionDataModel.idCaja;
  public IdOficina: any = this.generalService.SessionDataModel.idOficina;
  public Venta = false;
  public flagCompra: boolean = false;
  public flagVenta: boolean = false;
  public TotalPagoCambio: any = '';
  public HabilitarCampos: boolean;
  public verCambio: any = {};
  public NombreMonedaTasaCambio: string = '';
  public Cambios1 = true;
  public Cambios2 = false
  public devCambio: Array<any> = [];
  public DevolucionesCambio: any = [];

  public formasPago: Array<any> = [];
  public formasPagoAux: Array<any> = [];
  public Motivos: Array<any> = [];

  public savebtn: boolean = true;


  //MODELO CAMBIOS
  public CambioModel: any = {
    Id_Cambio: '',
    Tipo: '',
    Id_Caja: this.IdCaja == '' ? '0' : this.IdCaja,
    Id_Oficina: this.IdOficina == '' ? '0' : this.IdOficina,
    Moneda_Origen: '',
    Moneda_Destino: '',
    Tasa: '',
    Valor_Origen: '',
    Valor_Destino: '',
    TotalPago: '',
    Vueltos: '0',
    Recibido: '',
    Id_Tercero: '',
    fomapago: '',
    Identificacion_Funcionario: this.funcionario_data.Identificacion_Funcionario
  };


  public MonedaParaCambio: any = {
    id: '',
    nombre: '',
    Valores: {
      Min_Venta_Efectivo: '0',
      Max_Venta_Efectivo: '0',
      Sugerido_Venta_Efectivo: '',
      Min_Compra_Efectivo: '0',
      Max_Compra_Efectivo: '0',
      Sugerido_Compra_Efectivo: '',
      Min_Venta_Transferencia: '',
      Max_Venta_Transferencia: '',
      Sugerido_Venta_Transferencia: '',
      Costo_Transferencia: '',
      Comision_Efectivo_Transferencia: '',
      Pagar_Comision_Desde: '',
      Min_No_Cobro_Transferencia: '',
    }
  };

  //MODELO PARA TRANSFERENCIAS
  public TransferenciaModel: any = {
    Forma_Pago: 'Efectivo',
    Tipo_Transferencia: 'Transferencia',

    //DATOS DEL CAMBIO
    Moneda_Origen: JSON.parse(localStorage.getItem('monedaDefault'))['Id_Moneda'],
    Moneda_Destino: '',
    Cantidad_Recibida: '',
    Cantidad_Transferida: '',
    Cantidad_Transferida_Con_Bolivares: '0',
    Tasa_Cambio: '',
    Identificacion_Funcionario: this.funcionario_data.Identificacion_Funcionario,
    Id_Caja: this.IdCaja == '' ? '0' : this.IdCaja,
    Observacion_Transferencia: '',

    //DATOS REMITENTE
    Documento_Origen: '',
    Nombre_Remitente: '',
    Telefono_Remitente: '',

    //DATOS CREDITO
    Cupo_Tercero: 0,
    Bolsa_Bolivares: '0',

    //DATOS CONSIGNACION
    Id_Tercero_Destino: '',
    Id_Cuenta_Bancaria: '',
    Tipo_Origen: 'Remitente',
    Tipo_Destino: 'Destinatario'
  };


  public ListaDestinatarios: any = [
    {
      id_destinatario_transferencia: '',
      Numero_Documento_Destino: '',
      Nombre_Destinatario: '',
      Id_Destinatario_Cuenta: '',
      Valor_Transferencia: '',
      Cuentas: [],
      Id_Moneda: '',
      EditarVisible: false
    }
  ];


  public MonedaParaTransferencia: any = {
    id: '',
    nombre: '',
    Valores: {
      Min_Venta_Efectivo: '',
      Max_Venta_Efectivo: '',
      Sugerido_Venta_Efectivo: '',
      Min_Compra_Efectivo: '',
      Max_Compra_Efectivo: '',
      Sugerido_Compra_Efectivo: '',
      Min_Venta_Transferencia: '',
      Max_Venta_Transferencia: '',
      Sugerido_Venta_Transferencia: '',
      Costo_Transferencia: '',
      Comision_Efectivo_Transferencia: '',
      Pagar_Comision_Desde: '',
      Min_No_Cobro_Transferencia: '',
    }
  };

  public subject = new Subject<any>();
  public subjectModal = new Subject<any>();

  constructor(
    private generalService: GeneralService,
    private _consolidadoService: ConsolidadosService,
    public globales: Globales,
    private http: HttpClient,
    public fc: FiltroService,
    private permisoService: PermisoService
  ) { }

  guardarCambio(formulario: NgForm, item, select) {
    if ((select != '' || select != undefined) && (this.CambioModel.Id_Tercero == '' || this.CambioModel.Id_Tercero == undefined)) {
      this.subject.next({ type: 'warning', title: 'Alerta', text: 'Debe Ingresar la identificacion de un tercero' });
      return false
    }

    if (this.ValidateCambioBeforeSubmit()) {
      if (this.ValidacionTasaCambio()) {

        this.CambioModel.TotalPago == '' ? "0" : this.CambioModel.TotalPago;

        if (this.Venta) {
          this.CambioModel.Tipo = 'Venta';
          this.CambioModel.Estado = 'Realizado';
        } else {
          this.CambioModel.Tipo = 'Compra';
          this.CambioModel.Recibido = '0';
          this.CambioModel.Estado = 'Realizado';
          this._consolidadoService.TotalRestaIngresosEgresos.forEach(element => {
            if (this.MonedaParaCambio.nombre == element[2]) { }
          });

        }
        if (this.Venta) {
          this._consolidadoService.TotalRestaIngresosEgresos.forEach(element => {
            if (this.MonedaParaCambio.nombre == element[2]) {
              if (parseFloat(element[1]) < parseFloat(this.CambioModel.Valor_Destino)) {
                this.flagVenta = true;
              }
            }
          });

          if (this.flagVenta) {
            this.flagVenta = false;
            this.subject.next({ type: 'warning', title: 'Alerta', text: 'No cuentas con saldo suficiente' });
            return false
          }
          this.CambioModel.Tipo = 'Venta';
          this.CambioModel.Estado = 'Realizado';

        } else {

          this._consolidadoService.TotalRestaIngresosEgresos.forEach(element => {
            if (this.MonedaParaCambio.nombre == element[2]) {
              if (parseFloat(element[1]) < parseFloat(this.CambioModel.Valor_Origen)) {
                this.flagCompra = true;
              }
            }
          });

          if (this.flagCompra) {
            this.flagCompra = false;
            this.subject.next({ type: 'warning', title: 'Alerta', text: 'No cuentas con saldo suficiente' });
            return false
          }

          this.CambioModel.Tipo = 'Compra';
          this.CambioModel.Recibido = '0';
          this.CambioModel.Estado = 'Realizado';
        }
        this.CambioModel.Id_Caja = this.generalService.SessionDataModel.idCaja;
        this.CambioModel.Id_Oficina = this.generalService.SessionDataModel.idOficina;

        let info = this.generalService.normalize(JSON.stringify(this.CambioModel));
        let datos = new FormData();
        datos.append("modulo", 'Cambio');
        datos.append("datos", info);
        datos.append("TotalPago", this.TotalPagoCambio);

        this.http.post(this.globales.rutaNueva + 'cambios', datos).subscribe((data: any) => {
          let msg = this.Venta ? "Se ha guardado correctamente la venta!" : "Se ha guardado correctamente la compra!";
          this.LimpiarModeloCambio();
          this.subject.next({ type: 'success', title: 'Exito', text: 'Operacion realizada correctamente' });
          this.Cambios1 = true;
          this.Cambios2 = false;
          this.fc.CargarCambiosDiarios()
        });
      }
    }

  }

  ObtenerVueltos() {

    if (this.Venta) {
      let pagoCon = this.CambioModel.Recibido;
      let recibido = this.CambioModel.Valor_Destino;
      if (pagoCon == '' || pagoCon == undefined || isNaN(pagoCon)) {
        this.subject.next({ type: 'warning', title: 'Alerta', text: 'El valor del campo "Pago con" debe ser un valor numerico ' });
        return;
      }

      recibido = parseFloat(recibido);
      pagoCon = parseFloat(pagoCon);

      if (pagoCon > 0) {

        if (pagoCon < recibido) {
          this.subject.next({ type: 'warning', title: 'Alerta', text: 'El valor a cambiar no puede ser mayor al recibido' });
          this.CambioModel.Recibido = '';
          return;
        } else {
          this.CambioModel.Vueltos = parseFloat(this.CambioModel.Recibido) - (parseFloat(this.CambioModel.Tasa) * parseFloat(this.CambioModel.Valor_Origen))
        }
      }
    }
  }

  ObtenerVueltosEnCompra() {

    let pagoCon = this.CambioModel.Recibido;
    let recibido = this.CambioModel.Valor_Destino;

    if (pagoCon == '' || pagoCon == undefined || isNaN(pagoCon)) {
      return;
    }

    recibido = parseFloat(recibido);
    pagoCon = parseFloat(pagoCon);

    if (pagoCon > 0) {
      if (pagoCon < recibido) {
        this.subject.next({ type: 'warning', title: 'Alerta', text: 'El valor a cambiar no puede ser mayor al recibido' });
        this.CambioModel.Recibido = '';
        return;
      } else {
        this.CambioModel.Vueltos = parseFloat(this.CambioModel.Recibido) - (parseFloat(this.CambioModel.Tasa) * parseFloat(this.CambioModel.Valor_Origen))
      }
    }
  }
  conversionMoneda(tipo_cambio: string, tipo_moneda_origen: string) {

    if (tipo_cambio == 'o') {

      if (this.CambioModel.Valor_Origen == '' || this.CambioModel.Valor_Origen === undefined) {
        return false;
      }

      if (this.ValidarAntesDeConversion(tipo_cambio)) {
        if (tipo_moneda_origen == 'l') {
          var cambio = (parseFloat(this.CambioModel.Valor_Origen) % parseFloat(this.CambioModel.Tasa));
          this.CambioModel.Valor_Destino = cambio;
          console.log('if', cambio);
        } else {
          var cambio = (parseFloat(this.CambioModel.Valor_Origen) * parseFloat(this.CambioModel.Tasa));
          this.CambioModel.Valor_Destino = cambio;
        }
      }
    } else if (tipo_cambio == 'd') {

      if (this.CambioModel.Valor_Destino == '' || this.CambioModel.Valor_Destino === undefined) {
        return false
      }

      if (this.ValidarAntesDeConversion(tipo_cambio)) {
        if (tipo_moneda_origen == 'l') {

          var cambio = Math.floor(parseFloat(this.CambioModel.Valor_Destino) / parseFloat(this.CambioModel.Tasa));
          this.CambioModel.Valor_Origen = cambio;

        } else {
          var cambio = (parseFloat(this.CambioModel.Valor_Destino) * parseFloat(this.CambioModel.Tasa));
          this.CambioModel.Valor_Origen = cambio;
          console.log('else2', cambio);
        }
      }
    }
  }

  ValidarAntesDeConversion(tipo: string): boolean {
    if (!this.ValidacionTipoCambio(tipo))
      return false;

    if (!this.ValidacionTasa(tipo))
      return false;

    return true;
  }
  ValidacionTipoCambio(tipo: string): boolean {
    if (tipo == 'o') {
      if (this.CambioModel.Valor_Origen == '' || this.CambioModel.Valor_Origen === undefined) {
        this.subject.next({ type: 'warning', title: 'Alerta', text: 'Debe colocar el valor a cambiar' });
        this.CambioModel.Valor_Destino = '';
        return false;
      } else {
        return true;
      }
    } else {
      if (this.CambioModel.Valor_Destino == '' || this.CambioModel.Valor_Destino === undefined) {
        this.subject.next({ type: 'warning', title: 'Alerta', text: 'Debe colocar el valor a cambiar' });
        this.CambioModel.Valor_Origen = '';
        return false;
      } else {
        return true;
      }
    }
  }
  ValidacionTasa(tipo_cambio: string): boolean {
    if (this.CambioModel.Tasa == '' || this.CambioModel.Tasa == 0 || this.CambioModel.Tasa === undefined) {
      this.subject.next({ type: 'warning', title: 'Alerta', text: 'No se ha establecido una tasa de cambio' });
      this.CambioModel.Tasa = '';
      if (tipo_cambio == 'o') {
        this.CambioModel.Valor_Destino = '';
      } else {
        this.CambioModel.Valor_Origen = '';
      }
      return false;

    } else {
      let tasa = parseFloat(this.CambioModel.Tasa);
      if (this.Venta) {
        if (tasa > parseFloat(this.MonedaParaCambio.Valores.CambioModel) || tasa < parseFloat(this.MonedaParaCambio.Valores.Min_Venta_Efectivo)) {
          this.subject.next({ type: 'warning', title: 'Alerta', text: 'La tasa de cambio indicada es inferior/superior a los límites establecidos.\nRevise nuevamente.' });
          this.CambioModel.Tasa = Math.round((parseFloat(this.MonedaParaCambio.Valores.Max_Venta_Efectivo) + parseFloat(this.MonedaParaCambio.Valores.Min_Venta_Efectivo)) / 2);
          return false;
        } else {
          return true;
        }
      } else {

        if (tasa > parseFloat(this.MonedaParaCambio.Valores.Max_Compra_Efectivo) || tasa < parseFloat(this.MonedaParaCambio.Valores.Min_Compra_Efectivo)) {
          this.subject.next({ type: 'warning', title: 'Alerta', text: 'La tasa de cambio indicada es inferior/superior a los límites establecidos.\nRevise nuevamente.' });
          this.CambioModel.Tasa = Math.round((parseFloat(this.MonedaParaCambio.Valores.Max_Compra_Efectivo) + parseFloat(this.MonedaParaCambio.Valores.Min_Compra_Efectivo)) / 2);
          if (tipo_cambio == 'o') {
            this.CambioModel.Valor_Destino = '';
          } else {
            this.CambioModel.Valor_Origen = '';
          }
          return false;
        } else {
          return true;
        }
      }
    }
  }

  ValidacionTasaCambio() {
    if (this.CambioModel.Valor_Origen == '' || this.CambioModel.Valor_Origen == 0 || this.CambioModel.Valor_Origen === undefined) {
      this.subject.next({ type: 'warning', title: 'Alerta', text: 'Debe ingresar un valor a cambiar' });
      this.CambioModel.Valor_Destino = '';
      return false;
    } else {

      if (this.CambioModel.Tasa == '' || this.CambioModel.Tasa == 0 || this.CambioModel.Tasa === undefined) {
        this.subject.next({ type: 'warning', title: 'Alerta', text: 'No se ha establecido una tasa de cambio' });
        this.CambioModel.Tasa = '';
        this.CambioModel.Valor_Destino = '';
        return false;

      } else {

        let tasa = parseFloat(this.CambioModel.Tasa);

        if (this.Venta) {
          if (tasa > parseFloat(this.MonedaParaCambio.Valores.Max_Venta_Efectivo) || tasa < parseFloat(this.MonedaParaCambio.Valores.Min_Venta_Efectivo)) {
            this.subject.next({ type: 'warning', title: 'Alerta', text: 'La tasa de cambio indicada es inferior/superior a los límites establecidos.\nRevise nuevamente.' });
            this.CambioModel.Tasa = (parseFloat(this.MonedaParaCambio.Valores.Max_Venta_Efectivo) + parseFloat(this.MonedaParaCambio.Valores.Min_Venta_Efectivo)) / 2;
            this.CambioModel.Valor_Destino = '';
            return false;
          }
        } else {
          if (tasa > parseFloat(this.MonedaParaCambio.Valores.Max_Compra_Efectivo) || tasa < parseFloat(this.MonedaParaCambio.Valores.Min_Compra_Efectivo)) {
            this.subject.next({ type: 'warning', title: 'Alerta', text: 'La tasa de cambio indicada es inferior/superior a los límites establecidos.\nRevise nuevamente.' });
            this.CambioModel.Tasa = (parseFloat(this.MonedaParaCambio.Valores.Max_Compra_Efectivo) + parseFloat(this.MonedaParaCambio.Valores.Min_Compra_Efectivo)) / 2;
            this.CambioModel.Valor_Destino = '';
            return false;
          }
        }

      }
    }

    return true;
  }

  AnulaCambio(id) {
    let datos = new FormData();
    datos.append("id", id);
    this.http.post(this.globales.ruta + 'php/cambio/anular_cambio.php', datos).subscribe((data: any) => {
      this.subject.next({ type: 'success', title: 'Exito', text: 'Operacion realizada correctamente' });
      setTimeout(() => {
        this.fc.CargarCambiosDiarios()
      }, 300);
    });

  }

  tituloCambio = "Compras o Ventas";
  VerCambio(id, modal) {
    this.http.get(this.globales.ruta + 'php/cambio/get_detalle_cambio.php', { params: { id_cambio: id } }).subscribe((data: any) => {
      this.verCambio = data;
      modal.show();
    });

  }

  HabilitarCamposCambio() {

    if (this.Venta) {

      if (this.CambioModel.Moneda_Destino == '' || this.CambioModel.Moneda_Destino == undefined) {
        this.HabilitarCampos = true;
      } else {
        this.HabilitarCampos = false;
      }

    } else {

      if (this.CambioModel.Moneda_Origen == '' || this.CambioModel.Moneda_Origen == undefined) {
        this.HabilitarCampos = true;
      } else {
        this.HabilitarCampos = false;
      }
    }
  }

  LimpiarModeloCambio() {
    this.CambioModel = {
      Id_Cambio: '',
      Tipo: '',
      Id_Caja: this.IdCaja == '' ? '0' : this.IdCaja,
      Id_Oficina: '5',
      Moneda_Origen: '',
      Moneda_Destino: '',
      Tasa: '',
      Valor_Origen: '',
      Valor_Destino: '',
      TotalPago: '',
      Vueltos: '0',
      Recibido: '',
      Identificacion_Funcionario: this.funcionario_data.Identificacion_Funcionario
    };

    this.MonedaParaCambio = {
      id: '',
      nombre: '',
      Valores: {
        Min_Venta_Efectivo: '0',
        Max_Venta_Efectivo: '0',
        Sugerido_Venta_Efectivo: '',
        Min_Compra_Efectivo: '0',
        Max_Compra_Efectivo: '0',
        Sugerido_Compra_Efectivo: '',
        Min_Venta_Transferencia: '',
        Max_Venta_Transferencia: '',
        Sugerido_Venta_Transferencia: '',
        Costo_Transferencia: '',
        Comision_Efectivo_Transferencia: '',
        Pagar_Comision_Desde: '',
        Min_No_Cobro_Transferencia: '',
      }
    };

    this.HabilitarCampos = false;
    this.TotalPagoCambio = '';
    this.NombreMonedaTasaCambio = '';
  }

  ValidateCambioBeforeSubmit() {
    if (this.Venta) {

      if (this.CambioModel.Moneda_Destino == '') {

        this.subject.next({ type: 'warning', title: 'Alerta', text: 'Debe escoger una moneda para el cambio!' });
        return false;

      } else if (this.CambioModel.Valor_Origen == '') {
        this.subject.next({ type: 'warning', title: 'Alerta', text: 'El monto a cambiar no puede ser 0!' })
        return false;

      } else if (this.CambioModel.Tasa == '') {
        this.subject.next({ type: 'warning', title: 'Alerta', text: 'Debe colocar una tasa para el cambio!' });
        return false;

      } else if (this.CambioModel.Valor_Destino == '') {
        this.subject.next({ type: 'warning', title: 'Alerta', text: 'Debe recalcular el monto a entregar!' });
        return false;

      } else if (this.CambioModel.Recibido == '') {
        this.subject.next({ type: 'warning', title: 'Alerta', text: 'Debe colocar el monto en el campo "Paga Con"!' });
        return false;

      } else {
        return true;
      }

    } else {

      if (this.CambioModel.Moneda_Origen == '') {

        this.subject.next({ type: 'warning', title: 'Alerta', text: 'Debe escoger una moneda para el cambio!' });
        return false;

      } else if (this.CambioModel.Valor_Origen == '') {

        this.subject.next({ type: 'warning', title: 'Alerta', text: 'El monto a cambiar no puede ser 0!' })
        return false;

      } else if (this.CambioModel.Tasa == '') {

        this.subject.next({ type: 'warning', title: 'Alerta', text: 'Debe colocar una tasa para el cambio!' });
        return false;

      } else if (this.CambioModel.Valor_Destino == '') {

        this.subject.next({ type: 'warning', title: 'Alerta', text: 'Debe recalcular el monto a entregar!' });
        return false;

      } else {

        return true;
      }
    }
  }



  //#endregion

  //#region FUNCIONES TRANSFERENCIAS

  CalcularCambioMoneda(valor: string, tipo_cambio: string) {
    valor = valor.replace(/\./g, '');

    if (this.TransferenciaModel.Moneda_Destino == '') {
      this.subject.next({ type: 'warning', title: 'Alerta', text: 'Debe escoger la moneda antes de realizar la conversión!' });
      this.TransferenciaModel.Cantidad_Recibida = '';
      this.TransferenciaModel.Cantidad_Transferida = '';
      this.TransferenciaModel.Tasa_Cambio = '';
      return;
    }

    let tasa_cambio = this.TransferenciaModel.Tasa_Cambio;
    let value = parseFloat(valor);

    switch (tipo_cambio) {
      case 'por origen':
        if (value > 0) {

          this.CalcularCambio(value, tasa_cambio, 'recibido');
        } else {
          this.LimpiarCantidades();
        }
        break;

      case 'por destino':
        if (value > 0) {

          this.CalcularCambio(value, tasa_cambio, 'transferencia');
        } else {
          this.LimpiarCantidades();
        }
        break;

      case 'por tasa':
        if (!this.ValidarTasaCambioModal(tasa_cambio)) {
          return;
        }

        let valor_recibido = parseFloat(this.TransferenciaModel.Cantidad_Recibida);

        if (value > 0) {
          this.CalcularCambio(valor_recibido, tasa_cambio, 'recibido');
        } else {
          this.LimpiarCantidades();
        }
        break;

      default:
        this.subject.next({ type: 'warning', title: "Tipo cambio erroneo: " + tipo_cambio, text: 'La opcion para la conversion de la moneda es erronea! Contacte con el administrador del sistema!' });
        break;
    }
  }

  public ColocarMontoSoloPesos(montoPesos: string) {
    if (montoPesos == '') {
      this.TransferenciaModel.Cantidad_Transferida = '';
      this.TransferenciaModel.Tasa_Cambio = 0;
    } else {
      montoPesos = montoPesos.replace(/\./g, '');

      this.TransferenciaModel.Cantidad_Transferida = montoPesos;
      this.TransferenciaModel.Tasa_Cambio = 0;
    }

    setTimeout(() => {
      this.AsignarValorTransferirDestinatario(montoPesos);
    }, 300);
  }

  LimpiarCantidades() {
    this.TransferenciaModel.Cantidad_Recibida = '';
    this.TransferenciaModel.Cantidad_Transferida = '';

    this.ListaDestinatarios.forEach((d, i) => {
      this.ListaDestinatarios[i].Valor_Transferencia = '';
    });
  }

  ValidarTasaCambio(tasa_cambio) {
    let max = parseFloat(this.MonedaParaTransferencia.Valores.Max_Compra_Efectivo);
    let min = parseFloat(this.MonedaParaTransferencia.Valores.Min_Compra_Efectivo);
    let sug = parseFloat(this.MonedaParaTransferencia.Valores.Sugerido_Compra_Efectivo);
    //tasa_cambio = parseFloat(tasa_cambio);

    console.log(max);
    console.log(min);
    console.log(sug);
    console.log(tasa_cambio);
    console.log(tasa_cambio > max || tasa_cambio < min);
    console.log(tasa_cambio > max && tasa_cambio < min);
    console.log(tasa_cambio > max);
    console.log(tasa_cambio < min);

    if (tasa_cambio > max || tasa_cambio < min) {
      this.TransferenciaModel.Tasa_Cambio = sug;
      this.subject.next({ type: 'warning', title: 'Alerta', text: 'La tasa digitada es inferior/superior al mínimo(" + min + ")/máximo(" + max + ") establecido para la moneda' });
      return false;
    }

    return true;
  }

  ValidarTasaCambioModal(tasa_cambio) {
    let max = parseFloat(this.MonedaParaTransferencia.Valores.Max_Compra_Efectivo);
    let min = parseFloat(this.MonedaParaTransferencia.Valores.Min_Compra_Efectivo);
    let sug = parseFloat(this.MonedaParaTransferencia.Valores.Sugerido_Compra_Efectivo);
    if (tasa_cambio > max || tasa_cambio < min) {
      this.TransferenciaModel.Tasa_Cambio = sug;
      //ABRIR MODAL DE PERMISO PARA PROCEDER
      let p = { accion: "transferencia_cajero", value: tasa_cambio };
      this.permisoService._openSubject.next(p);
      return false;
    }

    return true;
  }

  ValidarCupoTercero(tipo: string, bolsa: number) {
    //EL TIPO SE REFIERE A ORIGEN DEL CAMBIO SI ES DESDE MONEDA RECBIDA O DESDE MONEDA DE TRANSFERENCIA
    //Valores: recibido para moneda recibida, transferencia para moneda de transferencia

    if (this.TransferenciaModel.Forma_Pago == 'Credito') {

      if (this.TransferenciaModel.Cupo_Tercero == '' || this.TransferenciaModel.Cupo_Tercero == '0' || this.TransferenciaModel.Cupo_Tercero == undefined) {
        this.subject.next({ type: 'warning', title: 'Alerta', text: 'El tercero no posee un cupo de crédito disponible!' });
        this.TransferenciaModel.Cantidad_Recibida = '';
        return false;
      }

      let cupo = parseFloat(this.TransferenciaModel.Cupo_Tercero);
      let valor_digitado = tipo == 'recibido' ? parseFloat(this.TransferenciaModel.Cantidad_Recibida) : (parseFloat(this.TransferenciaModel.Tasa_Cambio) * parseFloat(this.TransferenciaModel.Cantidad_Transferida));

      if (cupo < valor_digitado) {
        this.subject.next({ type: 'warning', title: 'Alerta', text: 'El cupo disponible es menor a la cantidad recibida!' });
        this.TransferenciaModel.Cantidad_Recibida = cupo;
        this.TransferenciaModel.Cantidad_Transferida = cupo / parseFloat(this.TransferenciaModel.Tasa_Cambio);

        let conversion_con_bolsa2 = (cupo / parseFloat(this.TransferenciaModel.Tasa_Cambio)) + bolsa;
        this.AsignarValorTransferirDestinatario(conversion_con_bolsa2);
        return false;
      }

      return true;
    } else {
      return true;
    }
  }

  ValidarBolsaBolivares() {

    if (this.TransferenciaModel.Forma_Pago == 'Credito') {
      if (this.MonedaParaTransferencia.nombre == 'Bolivares Soberanos') {
        if (this.TransferenciaModel.Bolsa_Bolivares == '' || this.TransferenciaModel.Bolsa_Bolivares == '0' || this.TransferenciaModel.Bolsa_Bolivares == undefined) {
          return true;
        } else {
          let bolsa = parseFloat(this.TransferenciaModel.Bolsa_Bolivares);
          let transferido = parseFloat(this.TransferenciaModel.Cantidad_Transferida);

          if (bolsa < transferido) {
            this.subject.next({ type: 'warning', title: 'Alerta', text: 'El valor a transferir es mayor a la cantidad bolsa pendiente!' });
            return false;
          } else {
            return true;
          }
        }
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  CalcularCambio(valor: number, tasa: number, tipo: string, permisoJefe: boolean = false) {

    let conversion_moneda = 0;
    let bolsa = 0;
    if (this.TransferenciaModel.Bolsa_Bolivares != '0' && this.TransferenciaModel.Forma_Pago == "Credito") {
      bolsa = parseFloat(this.TransferenciaModel.Bolsa_Bolivares);
    }

    switch (tipo) {
      case 'recibido':

        if (!this.ValidarCupoTercero(tipo, bolsa)) {
          return;
        }

        if (!permisoJefe)
          if (!this.ValidarTasaCambio(tasa)) {
            return;
          }

        conversion_moneda = (valor / tasa);
        this.TransferenciaModel.Cantidad_Transferida = conversion_moneda;
        let conversion_con_bolsa = (valor / tasa) + bolsa;
        this.AsignarValorTransferirDestinatario(conversion_con_bolsa);
        break;

      case 'transferencia':

        if (!this.ValidarCupoTercero(tipo, bolsa)) {
          return;
        }

        if (!this.ValidarTasaCambio(tasa)) {
          return;
        }

        conversion_moneda = (valor * tasa);
        this.TransferenciaModel.Cantidad_Recibida = (conversion_moneda);
        let conversion_con_bolsa2 = valor + bolsa;
        this.AsignarValorTransferirDestinatario(conversion_con_bolsa2);

        break;

      default:

        this.subject.next({ type: 'warning', title: "Opcion erronea o vacía: " + tipo, text: 'La opcion para la operacion es erronea! Contacte con el administrador del sistema!' });
        break;
    }
  }



  GetTotalTransferenciaDestinatarios(): number {

    let TotalTransferenciaDestinatario = 0;

    this.ListaDestinatarios.forEach(e => {
      if (e.Valor_Transferencia == undefined || isNaN(e.Valor_Transferencia) || e.Valor_Transferencia == '') {
        TotalTransferenciaDestinatario += 0;
      } else {
        TotalTransferenciaDestinatario += (parseFloat(e.Valor_Transferencia));
      }
    });

    return TotalTransferenciaDestinatario;
  }

  Asignar(valor, total_destinatarios, count) {

    if (this.ListaDestinatarios[0].Valor_Transferencia == '') {
      this.ListaDestinatarios[0].Valor_Transferencia = '0';
    }

    let v_transferir = parseFloat(this.ListaDestinatarios[0].Valor_Transferencia);
    let operacion = (v_transferir + (valor - total_destinatarios));
    this.ListaDestinatarios[0].Valor_Transferencia = operacion;

  }



  AsignarValorTransferirDestinatario(valor) {

    if (valor == '' || valor == '0') {
      this.ListaDestinatarios.forEach(d => {
        d.Valor_Transferencia = '';
      });
      return;
    }

    valor = (parseFloat(valor));
    let total_destinatarios = this.GetTotalTransferenciaDestinatarios();
    let count = this.ListaDestinatarios.length;

    setTimeout(() => {
      this.Asignar(valor, total_destinatarios, count);
    }, 300);
  }


  getInfo(Tercero: any, otro: any, another: any) {
    console.log(Tercero, otro, another);
    this.CambioModel.Id_Tercero = Tercero.Id_Tercero
    console.log(this.CambioModel.Id_Tercero);
  }

  setFormaPago() {
    this.formasPago = [];
    this.http.get(`${this.globales.rutaNueva}foma-pago`).subscribe((data: any) => {
      this.formasPagoAux = data;
      for (const forma of this.formasPagoAux) {
        if (forma['nombre'] == "Efectivo") {
          this.formasPago.push(forma);
        }
      }
    });
  }

  devolverCambio(id: any, modal: any) {

    this.http.get(this.globales.rutaNueva + `cambios/${id}`,).subscribe((data: any) => {
      console.log(data);

      this.devCambio = data['cambio'];
      this.Motivos = data['motivos'];
      this.devCambio['Valor_Devolver'] = this.devCambio['Valor_Destino'];
      this.devCambio['Valor_Devuelto'] = this.devCambio['Valor_Devolver'] * this.devCambio['Tasa'];
      modal.show();
    });


    modal.show();
  }

  printCambio(id) {
    this.http.get(this.globales.rutaNueva + 'print-cambio', { params: { id: id }, responseType: 'blob' }).subscribe((data: any) => {
      console.log(data);
      const link = document.createElement('a');
      link.setAttribute('target', '_blank');
      const url = window.URL.createObjectURL(new Blob([data], { type: "application/pdf" }));
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  calcularDevolucion() {

    if (this.devCambio['Valor_Destino'] < this.devCambio['Valor_Devolver']) {
      this.subject.next({ type: 'warning', title: "Alerta", text: 'No puedes devolver mas de lo que vendiste !' });
      this.savebtn = true
      return false;
    }
    this.devCambio['Valor_Devuelto'] = parseFloat(this.devCambio['Tasa']) * parseFloat(this.devCambio['Valor_Devolver'])
    this.savebtn = false;
  }

  saveDevolucion() {
    let datos = new FormData();
    datos.append("data", JSON.stringify(this.devCambio));
    this.http.post(this.globales.rutaNueva + 'devolucion/store', datos).subscribe((data: any) => {
      console.log(data);
    })
  };


  verDevoluciones(Id_Cambio: number, ModalverDevoluciones: any) {
    this.http.get(this.globales.rutaNueva + 'devoluciones/show/' + Id_Cambio).subscribe((data: any) => {
      this.DevolucionesCambio = data;
      ModalverDevoluciones.show();
    })
  };

  ResetMonedaParaCambio() {
    this.MonedaParaCambio = {
      id: '',
      nombre: '',
      Valores: {
        Min_Venta_Efectivo: '0',
        Max_Venta_Efectivo: '0',
        Sugerido_Venta_Efectivo: '',
        Min_Compra_Efectivo: '0',
        Max_Compra_Efectivo: '0',
        Sugerido_Compra_Efectivo: '',
        Min_Venta_Transferencia: '',
        Max_Venta_Transferencia: '',
        Sugerido_Venta_Transferencia: '',
        Costo_Transferencia: '',
        Comision_Efectivo_Transferencia: '',
        Pagar_Comision_Desde: '',
        Min_No_Cobro_Transferencia: '',
      }
    };
  }

  public _limpiarCompraVenta(value: string = '') {
    if (this.Venta) {
      this.CambioModel.Valor_Origen = 0;
      this.CambioModel.Valor_Destino = '';
      this.CambioModel.Tasa = '';
      this.CambioModel.TotalPago = '';
      this.CambioModel.Vueltos = '';
      this.CambioModel.Moneda_Origen = JSON.parse(localStorage.getItem('monedaDefault'))['Id_Moneda'];
      this.CambioModel.Moneda_Destino = value;
    } else {
      this.CambioModel.Valor_Origen = 0;
      this.CambioModel.Valor_Destino = '';
      this.CambioModel.Tasa = '';
      this.CambioModel.Moneda_Origen = value;
      this.CambioModel.Moneda_Destino = JSON.parse(localStorage.getItem('monedaDefault'))['Id_Moneda'];
    }
  }

  limpiarImputCliente(selectCustomClient) {
    this.CambioModel.Id_Tercero = '';
    if (selectCustomClient == '') {
      this.setFormaPago();
    } else {
      this.formasPago = this.formasPagoAux;
    }
  }
}
