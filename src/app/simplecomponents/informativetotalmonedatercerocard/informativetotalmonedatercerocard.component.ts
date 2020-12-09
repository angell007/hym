import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-informativetotalmonedatercerocard',
  templateUrl: './informativetotalmonedatercerocard.component.html',
  styleUrls: ['./informativetotalmonedatercerocard.component.scss']
})
export class InformativetotalmonedatercerocardComponent implements OnInit, OnChanges {

  @Input() SaldoMoneda:any = 0;
  @Input() CodigoMoneda:string = 'Cod';
  @Input() NombreMoneda:string = 'Moneda';
  @Input() IconoCard:string = 'ti-control-shuffle';
  @Input() CardClass:string = 'bg-success';
  @Input() TextColor:string = 'white';

  constructor() {
   }

  ngOnInit() {
    if (this.SaldoMoneda > 0) {
      this.CardClass = 'bg-success';
      this.TextColor = 'black';
    }else if (this.SaldoMoneda < 0) {
      this.CardClass = 'bg-danger';
    }else if (this.SaldoMoneda == 0) {
      this.CardClass = 'bg-info';
    }
  }

  ngOnChanges(changes:SimpleChanges): void {
    
  }

}
