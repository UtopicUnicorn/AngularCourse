import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecduckFrontendComponent } from './recduck-frontend.component';

describe('RecduckFrontendComponent', () => {
  let component: RecduckFrontendComponent;
  let fixture: ComponentFixture<RecduckFrontendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecduckFrontendComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecduckFrontendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
