import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrarfuncionarioComponent } from './administrarfuncionario.component';

describe('AdministrarfuncionarioComponent', () => {
  let component: AdministrarfuncionarioComponent;
  let fixture: ComponentFixture<AdministrarfuncionarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdministrarfuncionarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministrarfuncionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
