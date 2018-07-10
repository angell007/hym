import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-funcionariocrear',
  templateUrl: './funcionariocrear.component.html',
  styleUrls: ['./funcionariocrear.component.css']
})
export class FuncionariocrearComponent implements OnInit {
  public isCompleted: any;
  public onStep2Next: any;
  public onStep3Next: any;
  public onComplete: any;

  constructor() { }

  ngOnInit() {
  }

}
