import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablerogerenciaComponent } from './tablerogerencia.component';

describe('TablerogerenciaComponent', () => {
  let component: TablerogerenciaComponent;
  let fixture: ComponentFixture<TablerogerenciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablerogerenciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablerogerenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
