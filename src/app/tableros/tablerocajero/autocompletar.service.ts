import { Injectable } from '@angular/core';

@Injectable()
export class AutocompletarService {
  public user = JSON.parse(localStorage['User']);

  //MODELO PARA TRANSFERENCIAS
  public TransferenciaModel: any = {
    Forma_Pago: 'Efectivo',
    Tipo_Transferencia: 'Transferencia',

    //DATOS DEL CAMBIO
    Moneda_Origen: '2',
    Moneda_Destino: '',
    Cantidad_Recibida: '',
    Cantidad_Transferida: '',
    Cantidad_Transferida_Con_Bolivares: '0',
    Tasa_Cambio: '',
    Identificacion_Funcionario: this.user.Identificacion_Funcionario,
    // Id_Caja: this.IdCaja == '' ? '0' : this.IdCaja,
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

  constructor() { }
  AutoCompletarRemitente(modelo: any) {

    if (typeof (modelo) == 'object') {

      this.TransferenciaModel.Documento_Origen = modelo.Id_Transferencia_Remitente;
      this.TransferenciaModel.Telefono_Remitente = modelo.Telefono;
      this.TransferenciaModel.Nombre_Remitente = modelo.Nombre;
      // this.EditRemitenteTransferencia = true;

    } else if (typeof (modelo) == 'string') {

      this.TransferenciaModel.Documento_Origen = '';
      this.TransferenciaModel.Telefono_Remitente = '';
      this.TransferenciaModel.Nombre_Remitente = '';
      // this.EditRemitenteTransferencia = false;

    }
  }
}
