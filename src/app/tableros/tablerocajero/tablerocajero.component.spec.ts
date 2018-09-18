import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablerocajeroComponent } from './tablerocajero.component';

describe('TablerocajeroComponent', () => {
  let component: TablerocajeroComponent;
  let fixture: ComponentFixture<TablerocajeroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablerocajeroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablerocajeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
