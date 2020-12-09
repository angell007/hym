import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentesexternosComponent } from './agentesexternos.component';

describe('AgentesexternosComponent', () => {
  let component: AgentesexternosComponent;
  let fixture: ComponentFixture<AgentesexternosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentesexternosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentesexternosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
