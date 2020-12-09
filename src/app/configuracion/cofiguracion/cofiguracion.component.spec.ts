import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CofiguracionComponent } from './cofiguracion.component';

describe('CofiguracionComponent', () => {
  let component: CofiguracionComponent;
  let fixture: ComponentFixture<CofiguracionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CofiguracionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CofiguracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
