import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Globales } from '../shared/globales/globales';
import { DestinatarioService } from '../shared/services/destinatarios/destinatario.service';
import { MonedaService } from '../shared/services/monedas/moneda.service';
import { SwalService } from '../shared/services/swal/swal.service';
import { debounceTime, distinctUntilChanged, map, switchMap, delay, tap } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { GeneralService } from '../shared/services/general/general.service';


@Component({
  selector: 'app-tablerocajerorecaudador',
  templateUrl: './tablerocajerorecaudador.component.html',
  styleUrls: ['./tablerocajerorecaudador.component.scss']
})

export class TablerocajerorecaudadorComponent implements OnInit {

  @ViewChild('alertSwal') alertSwal: any;
  @ViewChild('errorSwal') errorSwal: any;

  public MonedasTransferencia: Array<any> = [];
  public ActulizarTablaRecibos: Subject<any> = new Subject<any>();
  public Transferencia1: Boolean = true;
  public Transferencia2: Boolean = false;
  public DeshabilitarValor: boolean = true;
  public Porcentaje_Recauda: Number;

  public Monedas: Array<any> = [];
  public TransferenciaPesos: boolean = false;
  public InputBolsaBolivares: boolean = false;
  public PosicionDestinatarioActivo: any = '';
  public AbrirModalDestinatario: Subject<any> = new Subject<any>();
  public validateInputDocumentSmall: any = [];
  public CuentasPersonales: any = [];
  public EditRemitenteTransferencia: boolean = false;
  public funcionario_data: any = this.generalService.SessionDataModel.funcionarioData;



  public ControlVisibilidadTransferencia: any = {
    DatosCambio: true,
    Destinatarios: true,
    DatosRemitente: true,
    DatosCredito: false,
    DatosConsignacion: false,
    SelectCliente: false
  };

  public ListaDestinatarios = [
    {
      id_destinatario_transferencia: '',
      Numero_Documento_Destino: '',
      Nombre_Destinatario: '',
      Id_Destinatario_Cuenta: '',
      Valor_Transferencia: '',
      copia: '',
      Cuentas: [],
      Id_Moneda: '',
      EditarVisible: false
    }

  ];
  public MonedaParaTransferencia = {
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


  //MODELO PARA TRANSFERENCIAS
  public TransferenciaModel = {

    Porcentaje_Recauda: 0,

    Forma_Pago: 'Efectivo',
    Tipo_Transferencia: 'Transferencia',

    //DATOS DEL CAMBIO
    Moneda_Origen: '',
    Moneda_Destino: '2',
    Cantidad_Recibida: '',
    Cantidad_Transferida: '',
    Cantidad_Transferida_Con_Bolivares: '0',
    Tasa_Cambio: '1',
    Identificacion_Funcionario: '',

    /**************************************************************************************************************************************** */
    // Identificacion_Funcionario: this.funcionario_data.Identificacion_Funcionario,
    // Id_Caja: this.IdCaja == string ? '0' : this.IdCaja,
    /**************************************************************************************************************************************** */

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


  constructor(
    private http: HttpClient,
    public globales: Globales,
    private destinatarioService: DestinatarioService,
    private _monedaService: MonedaService,
    private swalService: SwalService,
    private generalService: GeneralService,


  ) {

    this._getMonedas();
    this.SetDatosIniciales()
    this.TransferenciaModel.Moneda_Origen = JSON.parse(localStorage.getItem('monedaDefault'))['Id_Moneda']
  }

  ngOnInit() {
  }

  CambiarVista(tipo) {
    switch (tipo) {
      case "Transferencia": {
        this.Transferencia1 = false;
        this.Transferencia2 = true;
        break;
      }
    }
  }

  private _getMonedas() {
    this.MonedasTransferencia = [];
    this._monedaService.getMonedas().subscribe((data: any) => {
      this.MonedasTransferencia = []
      if (data != null) {
        for (const prop in data) {
          if (data[prop].Nombre == 'Pesos') {
            this.Monedas = data
            this.MonedasTransferencia.push(data[prop])
          }
        }
      }

    });
  }

  SetMonedaDestinatarios(idMoneda) {
    this.ListaDestinatarios.forEach(d => {
      d.Id_Moneda = idMoneda;
    });
  }

  private _concatenarDocumentosDestinatarios() {
    let ids = '';
    this.ListaDestinatarios.forEach(d => {
      if (d.Numero_Documento_Destino != '') {
        ids += d.Numero_Documento_Destino + ',';
      }
    });
    return ids;
  }

  private _actualizarCuentasDestinatarios() {

    if (this.ListaDestinatarios.length > 0) {
      let id_destinatarios = this._concatenarDocumentosDestinatarios();
      if (id_destinatarios != '') {
        let p = { moneda: this.MonedaParaTransferencia.id, ids: id_destinatarios };
        this.destinatarioService.GetCuentasDestinatarios(p).subscribe((data: any) => {



          if (data.destinatarios.length > 0) {
            data.destinatarios.forEach((id_dest, i) => {
              let index_dest = this.ListaDestinatarios.findIndex(x => x.Numero_Documento_Destino == id_dest);
              this.ListaDestinatarios[index_dest].Cuentas = data.cuentas[i];
              const Id_Destinatario_Cuenta_Default = data.cuentas[0];
              if (data.cuentas[i].length == 0) {
                this.ListaDestinatarios[index_dest].Id_Destinatario_Cuenta = '';
              }
            });
          }
        });
      }
    }
  }

  validateInputDocumentRetard(id: string, accion: string, posicionDestinatario: string) {
    setTimeout(() => {
      this.validateInputDocument(id, accion, posicionDestinatario)
    }, 200);
  }

  LongitudCarateres(i) {
    return parseInt(i.length);
  }

  async validateInputDocument(id: string, accion: string, posicionDestinatario: string) {

    const p = { id_destinatario: this.ListaDestinatarios[posicionDestinatario].Numero_Documento_Destino };

    if (p.id_destinatario != "") {
      await this.destinatarioService.validarExistenciaDestinatario(p).toPromise().then((data: any) => {
        if (data == 0) {
          var longitud = this.LongitudCarateres(this.ListaDestinatarios[posicionDestinatario].Numero_Documento_Destino);
          if (longitud > 6) {
            this.PosicionDestinatarioActivo = posicionDestinatario;
            let objModal = { id_destinatario: this.ListaDestinatarios[posicionDestinatario].Numero_Documento_Destino, accion: accion };
            this.AbrirModalDestinatario.next(objModal);

          } else if (longitud <= 6) {
            this.swalService.ShowMessage(['warning', data.titulo, 'El numero de caracteres debe ser mayor a 6 !']);
          }
        }
        if (data == 1) {
          this.validateInputDocumentSmall[posicionDestinatario] = false
        }
      });
    };
  }

  AutoCompletarDestinatario(modelo, i, listaDestinatarios, dest) {

    if (typeof (modelo) == 'object') {

      console.log('insider');
      listaDestinatarios[i].Numero_Documento_Destino = modelo.id_destinatario;
      listaDestinatarios[i].Nombre_Destinatario = modelo.Nombre;
    } else if (typeof (modelo) == 'string') {
      if (modelo == '') {
        console.log('insider2');
        listaDestinatarios[i].Numero_Documento_Destino = '';
      } else {
        console.log('insider22');
        listaDestinatarios[i].Numero_Documento_Destino = modelo;
      }

      listaDestinatarios[i].id_destinatario_Cuenta = '';
      listaDestinatarios[i].Nombre_Destinatario = '';
      // listaDestinatarios[i].Valor_Transferencia = '';
      // listaDestinatarios[i].EditarVisible = false;
      // listaDestinatarios[i].Cuentas = [];

    }
  }

  SetMonedaTransferencia(value) {

    this._getMonedas();
    this.MonedaParaTransferencia.id = '2';
    this.TransferenciaModel.Moneda_Destino = '2';
    this.SetMonedaDestinatarios('2');


    if (value != '') {
      this._actualizarCuentasDestinatarios();

      let c = {
        Nombre: ''
      }

      c.Nombre = this.Monedas.find(x => x.Id_Moneda == value);

      this.MonedaParaTransferencia.nombre = c.Nombre;

      if (c.Nombre == 'Pesos') {
        this.TransferenciaPesos = true;

      } else {
        this.TransferenciaPesos = false;
        this.http.get(this.globales.ruta + 'php/monedas/buscar_valores_moneda.php', { params: { id_moneda: value } }).subscribe((data: any) => {

          this.MonedaParaTransferencia.Valores = data.query_data;
          this.TransferenciaModel.Tasa_Cambio = data.query_data.Sugerido_Compra_Efectivo;
          if (this.MonedaParaTransferencia.nombre == 'Bolivares Soberanos') {
            this.InputBolsaBolivares = true;
          } else {
            this.InputBolsaBolivares = false;
          }

        });
      }
    } else {
      this._limpiarCuentasBancarias();
      this.MonedaParaTransferencia.nombre = '';
      this.TransferenciaModel.Tasa_Cambio = '1';
      this.InputBolsaBolivares = false;
    }
  }

  private _limpiarCuentasBancarias() {
    if (this.ListaDestinatarios.length > 1) {
      this.ListaDestinatarios.forEach((d, i) => {
        this.ListaDestinatarios[i].Cuentas = [];
      });
    }
  }

  formatterClienteCambioCompra = (x: { id_destinatario: string }) => x.id_destinatario;

  search_destino2 = (text$: Observable<string>) => text$.pipe(debounceTime(200), distinctUntilChanged(),
    switchMap(term => term.length < 2 ? [] : this.http.post(this.globales.rutaNueva + 'tercerosFilterForRecaudo', { id_destinatario: term })
      .map((response, params) => {
        return response;
      }).do(data => { return data })));


  HabilitarCampoValor() {
    if (this.ListaDestinatarios.length > 1) {
      this.DeshabilitarValor = false;
    } else {
      this.DeshabilitarValor = true;
    }
  }

  AgregarDestinatarioTransferencia() {
    let listaDestinatarios = this.ListaDestinatarios;
    for (let index = 0; index < listaDestinatarios.length; index++) {

      if (Number(listaDestinatarios[index].Numero_Documento_Destino) == 0 || listaDestinatarios[index].Numero_Documento_Destino == '' || listaDestinatarios[index].Numero_Documento_Destino === undefined) {
        this.ShowSwal('warning', 'Alerta', 'Debe anexar toda la información del(de los) destinatario(s) antes de agregar uno nuevo');
        return;
      }
    }

    let nuevoDestinatario = {
      id_destinatario_transferencia: '',
      Numero_Documento_Destino: '',
      Nombre_Destinatario: '',
      Id_Destinatario_Cuenta: '',
      Valor_Transferencia: '',
      copia: '',
      Cuentas: [],
      EditarVisible: false,
      Id_Moneda: this.MonedaParaTransferencia.id
    };

    this.ListaDestinatarios.push(nuevoDestinatario);
    this.HabilitarCampoValor();
  }

  ValidarCupoTercero(tipo: string, bolsa: number) {
    return true;
  }

  ValidarTasaCambio(tasa_cambio) {
    return true;
  }

  GetTotalTransferenciaDestinatarios(): number {

    let TotalTransferenciaDestinatario = 0;

    this.ListaDestinatarios.forEach(e => {
      if (e.Valor_Transferencia == undefined || e.Valor_Transferencia == '') {
        TotalTransferenciaDestinatario += 0;
      } else {
        TotalTransferenciaDestinatario += (parseFloat(e.Valor_Transferencia));
      }
    });

    return TotalTransferenciaDestinatario;
  }


  Asignar(valor, total_destinatarios, count) {

    valor = valor - (valor * (this.TransferenciaModel.Porcentaje_Recauda) / 100);

    let MultiplicadorDeConversion = 0;

    if (this.ListaDestinatarios[0].Valor_Transferencia == '') {
      this.ListaDestinatarios[0].Valor_Transferencia = '0';
    }
    this.Monedas.forEach(element => {

      if (element.Id_Moneda == this.TransferenciaModel.Moneda_Destino) {
        MultiplicadorDeConversion = element.valor_moneda.Sugerido_Compra_Efectivo
      }

    });

    let aTransferir = 0;
    for (let i = this.ListaDestinatarios.length - 1; i >= 0; i--) {
      aTransferir += Number(this.ListaDestinatarios[i]['Valor_Transferencia']);
    }

    if (aTransferir == 0) {
      this.ListaDestinatarios[0].Valor_Transferencia = valor;
      this.ListaDestinatarios[0].copia = String(valor * MultiplicadorDeConversion);
    }

    if (valor > aTransferir) {
      for (let i = this.ListaDestinatarios.length - 1; i >= 0; i--) {
        this.ListaDestinatarios[i]['Valor_Transferencia'] = String(0);
        this.ListaDestinatarios[i].copia = String(0);
      }
      this.ListaDestinatarios[0].Valor_Transferencia = valor;
      this.ListaDestinatarios[0].copia = String(valor * MultiplicadorDeConversion);
    }


    if (valor < aTransferir) {
      let diferencia = aTransferir - valor
      for (let i = this.ListaDestinatarios.length - 1; i >= 0; i--) {

        if (diferencia >= Number(this.ListaDestinatarios[i]['Valor_Transferencia'])) {
          diferencia = diferencia - Number(this.ListaDestinatarios[i]['Valor_Transferencia'])
          this.ListaDestinatarios[i]['Valor_Transferencia'] = String(0);
          this.ListaDestinatarios[i].copia = String(0);
        }

        else {
          this.ListaDestinatarios[i]['Valor_Transferencia'] = String(Number(this.ListaDestinatarios[i]['Valor_Transferencia']) - diferencia);
          this.ListaDestinatarios[i].copia = String(Number(this.ListaDestinatarios[i]['Valor_Transferencia']) * MultiplicadorDeConversion);
          diferencia = 0
        }

      }
    }

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

  CalcularCambio(valor: number, tasa: number, tipo: string, permisoJefe: boolean = false) {

    let conversion_moneda = 0;
    let bolsa = 0;


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
        this.TransferenciaModel.Cantidad_Transferida = String(conversion_moneda);
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
        this.TransferenciaModel.Cantidad_Recibida = String(conversion_moneda);
        let conversion_con_bolsa2 = valor + bolsa;
        this.AsignarValorTransferirDestinatario(conversion_con_bolsa2);

        break;

      default:
        // this.confirmacionSwal.title = "Opcion erronea o vacía: " + tipo;
        // this.confirmacionSwal.text = "La opcion para la operacion es erronea! Contacte con el administrador del sistema!";
        // this.confirmacionSwal.type = "error";
        // this.confirmacionSwal.show();
        break;
    }
  }

  LimpiarCantidades() {
    this.TransferenciaModel.Cantidad_Recibida = '';
    this.TransferenciaModel.Cantidad_Transferida = '';

    this.ListaDestinatarios.forEach((d, i) => {
      this.ListaDestinatarios[i].Valor_Transferencia = '';
    });
  }

  ValidarTasaCambioModal(tasa_cambio) {
    return true;
  }

  CalcularCambioMoneda(valor: string, tipo_cambio: string) {
    valor = valor.replace(/\./g, '');

    if (String(this.TransferenciaModel.Moneda_Destino) == '') {
      // this.ShowSwal('warning', 'Alerta', 'Debe escoger la moneda antes de realizar la conversión!');
      this.TransferenciaModel.Cantidad_Recibida = '';
      this.TransferenciaModel.Cantidad_Transferida = '';
      this.TransferenciaModel.Tasa_Cambio = '1';
      return;
    }

    let tasa_cambio = this.TransferenciaModel.Tasa_Cambio;
    let value = parseFloat(valor);


    switch (tipo_cambio) {
      case 'por origen':
        if (value > 0) {

          this.CalcularCambio(value, Number(tasa_cambio), 'recibido');
        } else {
          this.LimpiarCantidades();
        }
        break;

      case 'por destino':
        if (value > 0) {

          this.CalcularCambio(value, Number(tasa_cambio), 'transferencia');
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
          this.CalcularCambio(valor_recibido, Number(tasa_cambio), 'recibido');
        } else {
          this.LimpiarCantidades();
        }
        break;

      default:
        // this.confirmacionSwal.title = "Tipo cambio erroneo: " + tipo_cambio;
        // this.confirmacionSwal.text = "La opcion para la conversion de la moneda es erronea! Contacte con el administrador del sistema!";
        // this.confirmacionSwal.type = "error";
        // this.confirmacionSwal.show();
        break;
    }
  }

  CambiarTipoPersonas() {


    if (this.TransferenciaModel.Tipo_Transferencia == 'Cliente') {
      this.TransferenciaModel.Tipo_Origen = 'Remitente';
      this.TransferenciaModel.Tipo_Destino = 'Tercero';
    } else {
      this.TransferenciaModel.Tipo_Origen = 'Remitente';
      this.TransferenciaModel.Tipo_Destino = 'Destinatario';
    }

  }

  LimpiarModeloTransferencia(dejarFormaPago: boolean = false, dejarTipoTransferencia: boolean = false) {
    //MODELO PARA TRANSFERENCIAS
    this.TransferenciaModel = {
      Forma_Pago: dejarFormaPago ? this.TransferenciaModel.Forma_Pago : 'Efectivo',
      Tipo_Transferencia: dejarTipoTransferencia ? this.TransferenciaModel.Tipo_Transferencia : 'Transferencia',

      Porcentaje_Recauda: 0,

      //DATOS DEL CAMBIO
      Moneda_Origen: '',
      Moneda_Destino: '',
      Cantidad_Recibida: '',
      Cantidad_Transferida: '',
      Cantidad_Transferida_Con_Bolivares: '0',
      Tasa_Cambio: '1',

      /**************************************************************************************************************************************** */
      Identificacion_Funcionario: this.funcionario_data.Identificacion_Funcionario,
      // Id_Caja: this.IdCaja == string ? '0' : this.IdCaja,
      /**************************************************************************************************************************************** */

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
  }

  ControlarValoresSelect(valor) {

    this.CambiarTipoPersonas();
    this.LimpiarModeloTransferencia(true, true);
    this._getMonedas();


    if (valor == 'Credito') {
      this.TransferenciaModel.Tipo_Transferencia = 'Transferencia';
    }

    let Forma_Pago = this.TransferenciaModel.Forma_Pago;
    let tipo = this.TransferenciaModel.Tipo_Transferencia;

    setTimeout(() => {
      this.SetMonedaTransferencia(this.TransferenciaModel.Moneda_Destino);
    }, 500);
  }

  search_tercero_credito_tipo = (text$: Observable<string>) =>
    text$
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap(term =>
          this.http.get(this.globales.ruta + 'php/terceros/filtrar_terceros_custom.php', { params: { nombre: term, tipo: this.TransferenciaModel.Tipo_Transferencia } })
            .map(response => response)
        )
      );

  formatter_tercero_credito = (x: { Nombre: string }) => x.Nombre;

  AsignarCuentasPersonales() {
    this.CuentasPersonales = this.globales.CuentasPersonalesPesos;
  }


  SetDatosIniciales() {

    this.AsignarCuentasPersonales();
  }

  AutoCompletarRemitente(modelo: any) {

    if (typeof (modelo) == 'object') {

      this.TransferenciaModel.Documento_Origen = '';
      this.TransferenciaModel.Documento_Origen = modelo.id_remitente;
      this.TransferenciaModel.Telefono_Remitente = modelo.Telefono;
      this.TransferenciaModel.Nombre_Remitente = modelo.Nombre;
      this.TransferenciaModel.Porcentaje_Recauda = modelo.Porcentaje_Recauda;
      this.Porcentaje_Recauda = modelo.Porcentaje_Recauda

      // console.log(modelo.Porcentaje_Recauda);
      this.EditRemitenteTransferencia = true;

    } else if (typeof (modelo) == 'string') {
      this.TransferenciaModel.Telefono_Remitente = '';
      this.TransferenciaModel.Nombre_Remitente = '';
      this.EditRemitenteTransferencia = false;
    }
  }

  search_remitente2 = (text$: Observable<string>) =>
    text$
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap(term => term.length < 2 ? [] :
          this.http.post(this.globales.rutaNueva + 'tercerosFilterForRecaudo', { id_remitente: term })
            .map(response => response)
            .do(data => data)
        )
      );

  GuardarTransferencia(formulario: NgForm) {
    let forma_pago = this.TransferenciaModel.Forma_Pago;
    this.GuardarTransferenciaEfectivo();
  }


  // ************************************************** GuardarTransferenciaEfectivo **********************************************************************************

  SaveTransferencia(bolsa = '') {
    this.TransferenciaModel.Id_Tercero_Destino = '0';

    let info = this.generalService.normalize(JSON.stringify(this.TransferenciaModel));
    let destinatarios = this.generalService.normalize(JSON.stringify(this.ListaDestinatarios));
    //return;

    let datos = new FormData();
    datos.append("datos", info);
    datos.append("destinatarios", destinatarios);
    datos.append('id_oficina', '0');
    // datos.append('id_oficina', this.IdOficina);

    if (bolsa != '') {
      datos.append("bolsa_restante", bolsa);
    }
    this.http.post(this.globales.ruta + 'php/pos/guardar_transferencia.php', datos)
      .catch(error => {
        console.error('An error occurred:', error.error);
        // this.errorSwal.show();
        return this.handleError(error);
      }).subscribe((data: any) => {
        // this.LimpiarBancosDestinatarios(this.ListaDestinatarios);
        this.LimpiarModeloTransferencia();
        // this.SetTransferenciaDefault();
        // this.transferenciaExitosaSwal.show();
        this.Transferencia1 = true;
        this.Transferencia2 = false;
        // this.CargarTransferenciasDiarias();
        // this.TransferenciaModel.Moneda_Destino = this._getIdMoneda('bolivares soberanos');
        // this._getMonedasExtranjeras();
      });
  }

  GuardarTransferenciaEfectivo() {


    let tipo_transferencia = this.TransferenciaModel.Tipo_Transferencia;
    let total_a_transferir = isNaN((parseFloat(this.TransferenciaModel.Cantidad_Transferida))) ? 0 : (parseFloat(this.TransferenciaModel.Cantidad_Transferida));
    let total_suma_transferir_destinatarios = this.GetTotalTransferenciaDestinatarios();
    this.TransferenciaModel.Identificacion_Funcionario = this.funcionario_data.Identificacion_Funcionario;

    if ((total_suma_transferir_destinatarios > Number(this.TransferenciaModel.Cantidad_Transferida) - (Number(this.TransferenciaModel.Cantidad_Transferida) * (this.TransferenciaModel.Porcentaje_Recauda) / 100))) {
      this.ShowSwal('warning', 'Alerta', 'Haz bien tus cuentas!');
      return false
    }


    if (!this.ValidateBeforeSubmit()) {
      return;
    }

    switch (tipo_transferencia) {
      case 'Transferencia':

        this.http.post(this.globales.rutaNueva + 'recaudos', { 'lista': this.ListaDestinatarios, 'modelo': this.TransferenciaModel }).subscribe((data: any) => {
          this.LimpiarModeloTransferencia();
          this.ListaDestinatarios.forEach((det, index) => {
            this.ListaDestinatarios[index].Numero_Documento_Destino = '';
            this.ListaDestinatarios[index].Nombre_Destinatario = '';
            this.ListaDestinatarios[index].id_destinatario_transferencia = '';
            this.ListaDestinatarios[index].Valor_Transferencia = '0';
          })

          this.Transferencia1 = true;
          this.Transferencia2 = false;

        });


      // return false
      // if (this.TransferenciaModel.Bolsa_Bolivares != '0') {

      //   if (total_suma_transferir_destinatarios > 0) {
      //     let restante_bolsa = (((parseFloat(this.TransferenciaModel.Bolsa_Bolivares) + total_a_transferir) - total_suma_transferir_destinatarios)).toString();
      //     if (total_suma_transferir_destinatarios < (parseFloat(this.TransferenciaModel.Bolsa_Bolivares) + total_a_transferir)) {
      //       this.TransferenciaModel.Cantidad_Transferida_Con_Bolivares = String(total_suma_transferir_destinatarios);
      //     } else if (total_suma_transferir_destinatarios >= (parseFloat(this.TransferenciaModel.Bolsa_Bolivares) + total_a_transferir)) {
      //       this.TransferenciaModel.Cantidad_Transferida_Con_Bolivares = String(parseFloat(this.TransferenciaModel.Bolsa_Bolivares) + total_a_transferir);
      //     }
      //     this.SaveTransferencia(restante_bolsa);
      //   } else {
      //     this.ShowSwal('warning', 'Alerta', 'No se han cargado valores para transferir, ya sea en los destinatarios o en los datos de la transferencia!');
      //   }

      // }
      default:
        break;
    }
  }

  EliminarDestinatarioTransferencia(index) {
    // this.ListaDestinatarios.splice(index, 1);
    this.HabilitarCampoValor();
  }

  ValidateBeforeSubmit() {

    let Forma_Pago = this.TransferenciaModel.Forma_Pago;
    let tipo = this.TransferenciaModel.Tipo_Transferencia;

    if (Forma_Pago == 'Efectivo' && tipo == 'Transferencia') {

      let qty_destinatarios = this.ListaDestinatarios.length;
      for (let index = 0; index < (qty_destinatarios); index++) {
        let d = this.ListaDestinatarios[index];
        if (d.Numero_Documento_Destino == '' || d.Numero_Documento_Destino == undefined) {

          this.ShowSwal('warning', 'Alerta', 'Uno de los destinatarios no tiene asignado su nro. de documento!');
          return false;
        }

        // if (d.Id_Destinatario_Cuenta == '' || d.Id_Destinatario_Cuenta == undefined) {

        //   this.ShowSwal('warning', 'Alerta', 'Uno de los destinatarios no tiene asignada un nro. de cuenta para la transacción!');
        //   return false;
        // }

        // if (d.Valor_Transferencia == '' || d.Valor_Transferencia == undefined) {
        //   this.ShowSwal('warning', 'Alerta', 'Uno de los destinatarios no tiene asignada el valor a transferir o es 0, por favor revise!');
        //   return false;
        // }
      }

      if (this.TransferenciaModel.Cantidad_Recibida == '' || this.TransferenciaModel.Cantidad_Recibida == undefined) {
        this.ShowSwal('warning', 'Alerta', 'La cantidad recibida no puede ser 0 o no se ha asignado!');
        return false;
      }

      if (this.TransferenciaModel.Tasa_Cambio == '' || this.TransferenciaModel.Tasa_Cambio == undefined) {
        if (!this.TransferenciaPesos) {
          this.ShowSwal('warning', 'Alerta', 'La tasa de cambio no ha sido asignada!');
          return false;
        }

      }

      if (this.TransferenciaModel.Cantidad_Transferida == '' || this.TransferenciaModel.Cantidad_Transferida == undefined) {
        this.ShowSwal('warning', 'Alerta', 'La cantidad transferida no puede ser 0 o no se ha asignado!');
        return false;
      }

      if (this.TransferenciaModel.Documento_Origen == '' || this.TransferenciaModel.Documento_Origen == undefined) {
        this.ShowSwal('warning', 'Alerta', 'No se han asignado los datos del remitente!');
        return false;
      }

      return true;

    } else if (Forma_Pago == 'Efectivo' && (tipo == 'Cliente' || tipo == 'Proveedor')) {

      if (this.TransferenciaModel.Documento_Origen == '' || this.TransferenciaModel.Documento_Origen == undefined) {
        this.ShowSwal('warning', 'Alerta', 'No se ha asignado un destinatario para la transferencia!');
        return false;
      }

      if (this.TransferenciaModel.Cantidad_Recibida == '' || this.TransferenciaModel.Cantidad_Recibida == undefined) {
        this.ShowSwal('warning', 'Alerta', 'La cantidad recibida no puede ser 0 o no se ha asignado!');
        return false;
      }

      if (this.TransferenciaModel.Tasa_Cambio == '' || this.TransferenciaModel.Tasa_Cambio == undefined) {
        if (!this.TransferenciaPesos) {
          this.ShowSwal('warning', 'Alerta', 'La tasa de cambio no ha sido asignada!');
          return false;
        }
      }

      if (this.TransferenciaModel.Cantidad_Transferida == '' || this.TransferenciaModel.Cantidad_Transferida == undefined) {
        this.ShowSwal('warning', 'Alerta', 'La cantidad transferida no puede ser 0 o no se ha asignado!');
        return false;
      }

      if (this.TransferenciaModel.Documento_Origen == '' || this.TransferenciaModel.Documento_Origen == undefined) {
        this.ShowSwal('warning', 'Alerta', 'No se han asignado los datos del remitente!');
        return false;
      }

      return true;

    } else if (Forma_Pago == 'Credito' && tipo == 'Transferencia') {

      if (this.TransferenciaModel.Documento_Origen == '' || this.TransferenciaModel.Documento_Origen == undefined) {
        this.ShowSwal('warning', 'Alerta', 'Debe agregar un tercero antes de guardar una transferencia');
        return false;
      }

      let qty_destinatarios = this.ListaDestinatarios.length;
      this.ListaDestinatarios.forEach(d => {
        if (d.Numero_Documento_Destino == '' || d.Numero_Documento_Destino == undefined) {
          this.ShowSwal('warning', 'Alerta', 'Uno de los destinatarios no tiene asignado su nro. de documento!');
          return false;
        }

        if (d.Id_Destinatario_Cuenta == '' || d.Id_Destinatario_Cuenta == undefined) {
          this.ShowSwal('warning', 'Alerta', 'Uno de los destinatarios no tiene asignada un nro. de cuenta para la transacción!');
          return false;
        }

        if (d.Valor_Transferencia == '' || d.Valor_Transferencia == undefined) {
          this.ShowSwal('warning', 'Alerta', 'Uno de los destinatarios no tiene asignada el valor a transferir o es 0, por favor revise!');
          return false;
        }
      });

      if ((this.TransferenciaModel.Cantidad_Recibida == '' || this.TransferenciaModel.Cantidad_Recibida == undefined) && this.TransferenciaModel.Bolsa_Bolivares == '0') {
        this.ShowSwal('warning', 'Alerta', 'La cantidad recibida no puede ser 0 o no se ha asignado!');
        return false;
      }

      if ((this.TransferenciaModel.Tasa_Cambio == '' || this.TransferenciaModel.Tasa_Cambio == undefined) && this.TransferenciaModel.Bolsa_Bolivares == '0') {
        this.ShowSwal('warning', 'Alerta', 'La tasa de cambio no ha sido asignada!');
        return false;
      }

      if ((this.TransferenciaModel.Cantidad_Transferida == '' || this.TransferenciaModel.Cantidad_Transferida == undefined) && this.TransferenciaModel.Bolsa_Bolivares == '0') {
        this.ShowSwal('warning', 'Alerta', 'La cantidad transferida no puede ser 0 o no se ha asignado!');
        return false;
      }

      return true;

    } else if (Forma_Pago == 'Credito' && (tipo == 'Cliente' || tipo == 'Proveedor')) {
      this.ShowSwal('warning', 'Alerta', 'La forma de pago credito no permite tipos de pago a clientes!');
      return false;

    } else if (Forma_Pago == 'Consignacion' && tipo == 'Transferencia') {


      if (this.TransferenciaModel.Id_Cuenta_Bancaria == '' || this.TransferenciaModel.Id_Cuenta_Bancaria == undefined) {
        this.ShowSwal('warning', 'Alerta', 'No se ha asignado la cuenta para la consignacion!');
        return false;
      }

      this.ListaDestinatarios.forEach(d => {
        if (d.Numero_Documento_Destino == '' || d.Numero_Documento_Destino == undefined) {
          this.ShowSwal('warning', 'Alerta', 'Uno de los destinatarios no tiene asignado su nro. de documento!');
          return false;
        }

        if (d.Id_Destinatario_Cuenta == '' || d.Id_Destinatario_Cuenta == undefined) {
          this.ShowSwal('warning', 'Alerta', 'Uno de los destinatarios no tiene asignada un nro. de cuenta para la transacción!');
          return false;
        }

        if (d.Valor_Transferencia == '' || d.Valor_Transferencia == undefined) {
          this.ShowSwal('warning', 'Alerta', 'Uno de los destinatarios no tiene asignada el valor a transferir o es 0, por favor revise!');
          return false;
        }
      });

      if (this.TransferenciaModel.Cantidad_Recibida == '' || this.TransferenciaModel.Cantidad_Recibida == undefined) {
        this.ShowSwal('warning', 'Alerta', 'La cantidad recibida no puede ser 0 o no se ha asignado!');
        return false;
      }

      if (this.TransferenciaModel.Tasa_Cambio == '' || this.TransferenciaModel.Tasa_Cambio == undefined) {
        if (!this.TransferenciaPesos) {
          this.ShowSwal('warning', 'Alerta', 'La tasa de cambio no ha sido asignada!');
          return false;
        }
      }

      if (this.TransferenciaModel.Cantidad_Transferida == '' || this.TransferenciaModel.Cantidad_Transferida == undefined) {
        this.ShowSwal('warning', 'Alerta', 'La cantidad transferida no puede ser 0 o no se ha asignado!');
        return false;
      }

      if (this.TransferenciaModel.Documento_Origen == '' || this.TransferenciaModel.Documento_Origen == undefined) {
        this.ShowSwal('warning', 'Alerta', 'No se han asignado los datos del remitente!');
        return false;
      }

      return true;

    } else if (Forma_Pago == 'Consignacion' && (tipo == 'Cliente' || tipo == 'Proveedor')) {

      if (this.TransferenciaModel.Id_Tercero_Destino == '' || this.TransferenciaModel.Id_Tercero_Destino == undefined) {
        this.ShowSwal('warning', 'Alerta', 'No se ha asignado un destinatario para la consignacion!');
        return false;
      }

      if (this.TransferenciaModel.Id_Cuenta_Bancaria == '' || this.TransferenciaModel.Id_Cuenta_Bancaria == undefined) {
        this.ShowSwal('warning', 'Alerta', 'No se ha asignado la cuenta para la consignacion!');
        return false;
      }

      if (this.TransferenciaModel.Cantidad_Recibida == '' || this.TransferenciaModel.Cantidad_Recibida == undefined) {
        this.ShowSwal('warning', 'Alerta', 'La cantidad recibida no puede ser 0 o no se ha asignado!');
        return false;
      }

      if (this.TransferenciaModel.Tasa_Cambio == '' || this.TransferenciaModel.Tasa_Cambio == undefined) {
        if (!this.TransferenciaPesos) {
          this.ShowSwal('warning', 'Alerta', 'La tasa de cambio no ha sido asignada!');
          return false;
        }
      }

      if (this.TransferenciaModel.Cantidad_Transferida == '' || this.TransferenciaModel.Cantidad_Transferida == undefined) {
        this.ShowSwal('warning', 'Alerta', 'La cantidad transferida no puede ser 0 o no se ha asignado!');
        return false;
      }

      if (this.TransferenciaModel.Documento_Origen == '' || this.TransferenciaModel.Documento_Origen == undefined) {
        this.ShowSwal('warning', 'Alerta', 'No se han asignado los datos del remitente!');
        return false;
      }

      return true;
    }
  }

  volverReciboTransferencia() {
    this.Transferencia1 = true;
    this.Transferencia2 = false;
    this.LimpiarModeloTransferencia();
  }

  //MOSTRAR ALERTAS DESDE LA INSTANCIA DEL SWEET ALERT GLOBAL
  ShowSwal(tipo: string, titulo: string, msg: string, confirmCallback = null, cancelCallback = null) {
    this.alertSwal.type = tipo;
    this.alertSwal.title = titulo;
    this.alertSwal.text = msg;
    this.alertSwal.show();
  }


  handleError(error: Response) {
    return Observable.throw(error);
  }
}
