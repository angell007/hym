import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BalancegeneralComponent } from './balancegeneral.component';

describe('BalancegeneralComponent', () => {
  let component: BalancegeneralComponent;
  let fixture: ComponentFixture<BalancegeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BalancegeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BalancegeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
