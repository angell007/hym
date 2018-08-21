import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiquidacionsalarioComponent } from './liquidacionsalario.component';

describe('LiquidacionsalarioComponent', () => {
  let component: LiquidacionsalarioComponent;
  let fixture: ComponentFixture<LiquidacionsalarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiquidacionsalarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiquidacionsalarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
