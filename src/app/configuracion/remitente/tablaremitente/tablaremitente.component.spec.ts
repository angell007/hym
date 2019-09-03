import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaremitenteComponent } from './tablaremitente.component';

describe('TablaremitenteComponent', () => {
  let component: TablaremitenteComponent;
  let fixture: ComponentFixture<TablaremitenteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaremitenteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaremitenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
