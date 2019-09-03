import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablatercerosComponent } from './tablaterceros.component';

describe('TablatercerosComponent', () => {
  let component: TablatercerosComponent;
  let fixture: ComponentFixture<TablatercerosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablatercerosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablatercerosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
