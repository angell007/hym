export class CompraCuentaModel{
    public Id_Compra_Cuenta:number = 0;
    public Id_Cuenta_Bancaria:number = 0;
    public Id_Funcionario:number = 0;
    public Valor:number = 0;
    public Numero_Transaccion:string = '';
    public Estado:string = 'Bloqueada';
    public Detalle:string = '';
    public Fecha:string = '';
    public Id_Consultor_Apertura:number = null;
}