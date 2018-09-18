import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableroauditoriaComponent } from './tableroauditoria.component';

describe('TableroauditoriaComponent', () => {
  let component: TableroauditoriaComponent;
  let fixture: ComponentFixture<TableroauditoriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableroauditoriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableroauditoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
