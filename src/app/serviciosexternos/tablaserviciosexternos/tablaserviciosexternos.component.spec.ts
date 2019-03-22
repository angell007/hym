import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaserviciosexternosComponent } from './tablaserviciosexternos.component';

describe('TablaserviciosexternosComponent', () => {
  let component: TablaserviciosexternosComponent;
  let fixture: ComponentFixture<TablaserviciosexternosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaserviciosexternosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaserviciosexternosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
