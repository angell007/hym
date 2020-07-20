import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaprincipalconsultorComponent } from './vistaprincipalconsultor.component';

describe('VistaprincipalconsultorComponent', () => {
  let component: VistaprincipalconsultorComponent;
  let fixture: ComponentFixture<VistaprincipalconsultorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VistaprincipalconsultorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VistaprincipalconsultorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
