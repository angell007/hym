import { Pipe, PipeTransform } from '@angular/core';
import { log } from 'util';

@Pipe({
    name: 'customcurrency'
})

export class CustomcurrencyPipe implements PipeTransform {
    transform(value: string, currency_symbol:string = "$"): string {
        if(value) {
        //     let val = value.split('.');
        //     if (!val[1]) {
        //         val[1] = '00';
        //     }
            
        //   return currency_symbol+" "+val[0].replace(/\,/g,'.')+','+val[1];

        return currency_symbol+" "+this.formatMoney(value, 2, ".", ",");
        }
        return '';
    }

    formatMoney(n, c, d, t) {
        var c = isNaN(c = Math.abs(c)) ? 2 : c,
          d = d == undefined ? "." : d,
          t = t == undefined ? "," : t,
          s = n < 0 ? "-" : "",
          i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
          j = (j = i.length) > 3 ? j % 3 : 0;
      
        return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - parseFloat(i)).toFixed(c).slice(2) : "");
    };
}