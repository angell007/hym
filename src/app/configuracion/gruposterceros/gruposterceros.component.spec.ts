import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupostercerosComponent } from './gruposterceros.component';

describe('GrupostercerosComponent', () => {
  let component: GrupostercerosComponent;
  let fixture: ComponentFixture<GrupostercerosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrupostercerosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrupostercerosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
