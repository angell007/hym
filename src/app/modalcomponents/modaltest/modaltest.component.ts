import { Component, OnInit, ViewChild, Input } from '@angular/core';

@Component({
  selector: 'app-modaltest',
  templateUrl: './modaltest.component.html',
  styleUrls: ['./modaltest.component.scss']
})
export class ModaltestComponent implements OnInit {

  @Input() ShowHide = false;

  constructor() { }

  ngOnInit() {


  }

}
