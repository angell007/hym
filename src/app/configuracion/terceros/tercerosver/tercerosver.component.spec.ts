import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TercerosverComponent } from './tercerosver.component';

describe('TercerosverComponent', () => {
  let component: TercerosverComponent;
  let fixture: ComponentFixture<TercerosverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TercerosverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TercerosverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
