import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablatransferenciasrealizadasComponent } from './tablatransferenciasrealizadas.component';

describe('TablatransferenciasrealizadasComponent', () => {
  let component: TablatransferenciasrealizadasComponent;
  let fixture: ComponentFixture<TablatransferenciasrealizadasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablatransferenciasrealizadasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablatransferenciasrealizadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
