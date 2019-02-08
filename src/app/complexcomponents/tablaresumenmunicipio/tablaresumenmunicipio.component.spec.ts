import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaresumenmunicipioComponent } from './tablaresumenmunicipio.component';

describe('TablaresumenmunicipioComponent', () => {
  let component: TablaresumenmunicipioComponent;
  let fixture: ComponentFixture<TablaresumenmunicipioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaresumenmunicipioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaresumenmunicipioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
