import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-terceros',
  templateUrl: './terceros.component.html',
  styleUrls: ['./terceros.component.css']
})
export class TercerosComponent implements OnInit {

  // public actualClienteDesde:string;
  // public year:string;
  // public month:string;
  
  constructor() { }

  ngOnInit() {
   
    // this.year = new Date().getFullYear().toString().split('.').join("");
    // this.month = (new Date().getMonth() + 1).toString();
    // if (this.month.length == 1) this.actualClienteDesde = this.year.concat("-0".concat(this.month));
    // else this.actualClienteDesde = this.year.concat("-".concat(this.month));

  }

}
