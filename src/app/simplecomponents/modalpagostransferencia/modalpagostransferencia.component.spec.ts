import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalpagostransferenciaComponent } from './modalpagostransferencia.component';

describe('ModalpagostransferenciaComponent', () => {
  let component: ModalpagostransferenciaComponent;
  let fixture: ComponentFixture<ModalpagostransferenciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalpagostransferenciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalpagostransferenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
