import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablacuentasbancariasComponent } from './tablacuentasbancarias.component';

describe('TablacuentasbancariasComponent', () => {
  let component: TablacuentasbancariasComponent;
  let fixture: ComponentFixture<TablacuentasbancariasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablacuentasbancariasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablacuentasbancariasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
