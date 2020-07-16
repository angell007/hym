import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalamovertransferenciaComponent } from './modalamovertransferencia.component';

describe('ModalamovertransferenciaComponent', () => {
  let component: ModalamovertransferenciaComponent;
  let fixture: ComponentFixture<ModalamovertransferenciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalamovertransferenciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalamovertransferenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
