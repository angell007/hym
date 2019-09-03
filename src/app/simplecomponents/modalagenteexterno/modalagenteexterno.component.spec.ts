import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalagenteexternoComponent } from './modalagenteexterno.component';

describe('ModalagenteexternoComponent', () => {
  let component: ModalagenteexternoComponent;
  let fixture: ComponentFixture<ModalagenteexternoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalagenteexternoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalagenteexternoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
