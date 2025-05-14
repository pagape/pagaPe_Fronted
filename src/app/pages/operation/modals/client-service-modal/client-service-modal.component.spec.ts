import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientServiceModalComponent } from './client-service-modal.component';

describe('ClientServiceModalComponent', () => {
  let component: ClientServiceModalComponent;
  let fixture: ComponentFixture<ClientServiceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientServiceModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientServiceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
