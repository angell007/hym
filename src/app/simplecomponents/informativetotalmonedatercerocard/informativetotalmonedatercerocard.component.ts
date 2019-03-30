import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-informativetotalmonedatercerocard',
  templateUrl: './informativetotalmonedatercerocard.component.html',
  styleUrls: ['./informativetotalmonedatercerocard.component.scss']
})
export class InformativetotalmonedatercerocardComponent implements OnInit {

  @Input() SaldoMoneda:any = 0;
  @Input() CodigoMoneda:string = 'Cod';
  @Input() NombreMoneda:string = 'Moneda';
  @Input() IconoCard:string = 'ti-control-shuffle';
  @Input() CardClass:string = 'bg-success';
  @Input() TextColor:string = 'white';

  constructor() { }

  ngOnInit() {
  }

}
