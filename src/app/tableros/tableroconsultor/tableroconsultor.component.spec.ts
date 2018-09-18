import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableroconsultorComponent } from './tableroconsultor.component';

describe('TableroconsultorComponent', () => {
  let component: TableroconsultorComponent;
  let fixture: ComponentFixture<TableroconsultorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableroconsultorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableroconsultorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
