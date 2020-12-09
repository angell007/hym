import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorresponsalesbancarioscajeroComponent } from './corresponsalesbancarioscajero.component';

describe('CorresponsalesbancarioscajeroComponent', () => {
  let component: CorresponsalesbancarioscajeroComponent;
  let fixture: ComponentFixture<CorresponsalesbancarioscajeroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorresponsalesbancarioscajeroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorresponsalesbancarioscajeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
