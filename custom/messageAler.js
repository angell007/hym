// Message alert
if (this.Venta) {
    if (tasa > parseFloat(this.MonedaParaCambio.Valores.Max_Venta_Efectivo) || tasa <
        parseFloat(this.MonedaParaCambio.Valores.Min_Venta_Efectivo)) {
            this.ShowSwal('warning', 'Tasa Incorrecta'
                , 'La tasa de cambio indicada es inferior/superior a los límites establecidos.\nRevise nuevamente.');
        this.CambioModel.Tasa = Math.round((parseFloat(this.MonedaParaCambio.Valores.Max_Venta_Efectivo) +
            parseFloat(this.MonedaParaCambio.Valores.Min_Venta_Efectivo)) / 2); if (tipo_cambio == 'o') {
                this.CambioModel.Valor_Destino = ''; this.CambioModel.Valor_Origen = '';
            } else {
                this.CambioModel.Valor_Origen = '';
            this.CambioModel.Valor_Destino = '';
        } return false;
    } else { console.log("limite venta true"); return true; }
}
//   Modal egreso tiene alertas
[swal] = "{title:'¿Está Seguro?',text : 'Se dispone a anular este cambio, esta acción no se puede revertir' , type:'warning', showCancelButton: true, confirmButtonText: 'Si, Anular', cancelButtonText:'No, Dejame Comprobar!'}"
    (confirm) = "AnulaCambio(cambio.Id_Cambio)" >