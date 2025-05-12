import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepCodeValidationComponent } from './step.code-validation.component';

describe('StepCodeValidationComponent', () => {
  let component: StepCodeValidationComponent;
  let fixture: ComponentFixture<StepCodeValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepCodeValidationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StepCodeValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
