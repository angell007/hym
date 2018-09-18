import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[tablero-dinamico]',
})
export class TableroDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}