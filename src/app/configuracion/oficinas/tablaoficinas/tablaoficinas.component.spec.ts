import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaoficinasComponent } from './tablaoficinas.component';

describe('TablaoficinasComponent', () => {
  let component: TablaoficinasComponent;
  let fixture: ComponentFixture<TablaoficinasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaoficinasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaoficinasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
