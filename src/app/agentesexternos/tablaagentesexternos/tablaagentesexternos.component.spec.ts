import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaagentesexternosComponent } from './tablaagentesexternos.component';

describe('TablaagentesexternosComponent', () => {
  let component: TablaagentesexternosComponent;
  let fixture: ComponentFixture<TablaagentesexternosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaagentesexternosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaagentesexternosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
