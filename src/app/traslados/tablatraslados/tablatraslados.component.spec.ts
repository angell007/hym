import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablatrasladosComponent } from './tablatraslados.component';

describe('TablatrasladosComponent', () => {
  let component: TablatrasladosComponent;
  let fixture: ComponentFixture<TablatrasladosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablatrasladosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablatrasladosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
