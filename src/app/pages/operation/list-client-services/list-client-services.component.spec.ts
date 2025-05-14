import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListClientServicesComponent } from './list-client-services.component';

describe('ListClientServicesComponent', () => {
  let component: ListClientServicesComponent;
  let fixture: ComponentFixture<ListClientServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListClientServicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListClientServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
