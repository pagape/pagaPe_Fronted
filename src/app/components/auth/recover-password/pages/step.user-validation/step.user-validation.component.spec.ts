import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepUserValidationComponent } from './step.user-validation.component';

describe('StepUserValidationComponent', () => {
  let component: StepUserValidationComponent;
  let fixture: ComponentFixture<StepUserValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepUserValidationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StepUserValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
