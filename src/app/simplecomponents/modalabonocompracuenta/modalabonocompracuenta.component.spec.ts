import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalabonocompracuentaComponent } from './modalabonocompracuenta.component';

describe('ModalabonocompracuentaComponent', () => {
  let component: ModalabonocompracuentaComponent;
  let fixture: ComponentFixture<ModalabonocompracuentaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalabonocompracuentaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalabonocompracuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
