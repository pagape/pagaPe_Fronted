import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepResetPasswordComponent } from './step.reset-password.component';

describe('StepResetPasswordComponent', () => {
  let component: StepResetPasswordComponent;
  let fixture: ComponentFixture<StepResetPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepResetPasswordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StepResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
