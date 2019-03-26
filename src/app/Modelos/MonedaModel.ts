import { ValoresMonedaModel } from './ValoresMonedaModel';

export class MonedaModel{
    public Id_Moneda:string = '';
    public Codigo:string = '';
    public Nombre:string = '';
    public Estado:string = 'Activo';
    public Orden:string = '';
    public Compras:boolean = false;
    public Transferencias:boolean = false;
    public Gasto:boolean = false;
    public ServicioExterno:boolean = false;
    public CorresponsalBancario:boolean = false;
    public Traslado:boolean = false;
    public Giro:boolean = false;
    public Cambio:boolean = false;
    public ValoresMoneda:ValoresMonedaModel = new ValoresMonedaModel();
}