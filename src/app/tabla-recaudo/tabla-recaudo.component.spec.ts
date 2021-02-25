import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaRecaudoComponent } from './tabla-recaudo.component';

describe('TablaRecaudoComponent', () => {
  let component: TablaRecaudoComponent;
  let fixture: ComponentFixture<TablaRecaudoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaRecaudoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaRecaudoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
