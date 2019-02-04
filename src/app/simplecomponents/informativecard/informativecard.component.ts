import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-informativecard',
  templateUrl: './informativecard.component.html',
  styleUrls: ['./informativecard.component.scss']
})
export class InformativecardComponent implements OnInit {

  @Input() CantidadMostrar:any = 0;
  @Input() TituloCard:any = 'Titulo';
  @Input() IconoCard:any = 'ti-control-shuffle';
  @Input() CardClass:any = 'bg-success';

  constructor() { }

  ngOnInit() {
  }

}
