import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReminderService } from './reminder.service';
import { ReminderRequestDTO, ReminderResponseDTO, ReminderStatusUpdateDTO } from '../models/reminder.model';
import { environment } from '../../environments/environment';

describe('ReminderService', () => {
  let service: ReminderService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/api/reminders`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReminderService]
    });
    service = TestBed.inject(ReminderService);
    httpMock = TestBed.inject(HttpTestingController);
    
    localStorage.setItem('access_token', 'test-token');
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a reminder', () => {
    const mockRequest: ReminderRequestDTO = {
      clientId: 1,
      sendDateTime: '2023-12-01T10:00:00',
      typeService: 'PAYMENT_REMINDER',
      description: 'Test reminder'
    };

    const mockResponse: ReminderResponseDTO = {
      id: 1,
      description: 'Test reminder',
      sendDateTime: '2023-12-01T10:00:00',
      responseStatus: 'PENDIENTE',
      typeService: 'PAYMENT_REMINDER',
      clientWhatsappPhoneNumber: '+1234567890',
      isDebtor: false,
      clientId: 1,
      clientName: 'John Doe'
    };

    service.createReminder(mockRequest).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    req.flush(mockResponse);
  });

  it('should get all reminders', () => {
    const mockResponse: ReminderResponseDTO[] = [{
      id: 1,
      description: 'Test reminder',
      sendDateTime: '2023-12-01T10:00:00',
      responseStatus: 'PENDIENTE',
      typeService: 'PAYMENT_REMINDER',
      clientWhatsappPhoneNumber: '+1234567890',
      isDebtor: false,
      clientId: 1,
      clientName: 'John Doe'
    }];

    service.getAllReminders().subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get reminders by client', () => {
    const clientId = 1;
    const mockResponse: ReminderResponseDTO[] = [{
      id: 1,
      description: 'Test reminder',
      sendDateTime: '2023-12-01T10:00:00',
      responseStatus: 'PENDIENTE',
      typeService: 'PAYMENT_REMINDER',
      clientWhatsappPhoneNumber: '+1234567890',
      isDebtor: false,
      clientId: 1,
      clientName: 'John Doe'
    }];

    service.getRemindersByClient(clientId).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/by-client/${clientId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get today reminders', () => {
    const mockResponse: ReminderResponseDTO[] = [];

    service.getTodayReminders().subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/today`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get upcoming reminders with default days', () => {
    const mockResponse: ReminderResponseDTO[] = [];

    service.getUpcomingReminders().subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/upcoming?days=3`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should update reminder status', () => {
    const reminderId = 1;
    const statusUpdate: ReminderStatusUpdateDTO = { status: 'ENVIADO' };

    service.updateReminderStatus(reminderId, statusUpdate).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/${reminderId}/status`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(statusUpdate);
    req.flush(null);
  });
});