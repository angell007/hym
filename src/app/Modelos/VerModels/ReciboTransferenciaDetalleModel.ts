import { TransferenciaModel } from '../TransferenciaModel';

export class ReciboTransferenciaDetalleModel extends TransferenciaModel{
    public Remitente:string = '';
    public Destinatarios:Array<any> = [];
    public CodigoRecibo:string = '';
}