import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablamovimientoscorresponsalComponent } from './tablamovimientoscorresponsal.component';

describe('TablamovimientoscorresponsalComponent', () => {
  let component: TablamovimientoscorresponsalComponent;
  let fixture: ComponentFixture<TablamovimientoscorresponsalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablamovimientoscorresponsalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablamovimientoscorresponsalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
