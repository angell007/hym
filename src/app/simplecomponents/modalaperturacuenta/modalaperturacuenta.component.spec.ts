import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalaperturacuentaComponent } from './modalaperturacuenta.component';

describe('ModalaperturacuentaComponent', () => {
  let component: ModalaperturacuentaComponent;
  let fixture: ComponentFixture<ModalaperturacuentaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalaperturacuentaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalaperturacuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
