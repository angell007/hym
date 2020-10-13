import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appThousandSeparator]'
})
export class ThousandSeparatorDirective {

  constructor(el:ElementRef) {
    // console.log(el.nativeElement);
    el.nativeElement = "HOla";
   }

}
