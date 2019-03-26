import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModaltipocuentaComponent } from './modaltipocuenta.component';

describe('ModaltipocuentaComponent', () => {
  let component: ModaltipocuentaComponent;
  let fixture: ComponentFixture<ModaltipocuentaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModaltipocuentaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModaltipocuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
