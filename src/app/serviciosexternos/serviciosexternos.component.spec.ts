import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiciosexternosComponent } from './serviciosexternos.component';

describe('ServiciosexternosComponent', () => {
  let component: ServiciosexternosComponent;
  let fixture: ComponentFixture<ServiciosexternosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiciosexternosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiciosexternosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
