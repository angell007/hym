import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablerocajerorecaudadorComponent } from './tablerocajerorecaudador.component';

describe('TablerocajerorecaudadorComponent', () => {
  let component: TablerocajerorecaudadorComponent;
  let fixture: ComponentFixture<TablerocajerorecaudadorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablerocajerorecaudadorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablerocajerorecaudadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
