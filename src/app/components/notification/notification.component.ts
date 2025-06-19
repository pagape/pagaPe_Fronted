import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { NotificationService, Notification } from '../../services/notification.service';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="notification" class="notification-container" [@slideInOut]="notificationState">
      <div class="notification" [ngClass]="notification.type">
        <div class="notification-content">
          <span class="notification-icon">
            <i class="material-symbols-outlined">
              {{ getIconForType(notification.type) }}
            </i>
          </span>
          <span class="notification-message">{{ notification.message }}</span>
        </div>
        <button class="notification-close" (click)="hideNotification()">
          <i class="material-symbols-outlined">close</i>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .notification-container {
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      width: auto;
      max-width: 90%;
    }
    
    .notification {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      min-width: 300px;
    }
    
    .notification-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .notification-icon {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .notification-message {
      font-size: 16px;
      font-weight: 500;
    }
    
    .notification-close {
      background: transparent;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      margin-left: 10px;
      color: inherit;
      opacity: 0.7;
    }
    
    .notification-close:hover {
      opacity: 1;
    }
    
    .success {
      background-color: #ecfdf5;
      color: #065f46;
      border-left: 4px solid #10b981;
    }
    
    .error {
      background-color: #fef2f2;
      color: #991b1b;
      border-left: 4px solid #ef4444;
    }
    
    .warning {
      background-color: #fffbeb;
      color: #92400e;
      border-left: 4px solid #f59e0b;
    }
    
    .info {
      background-color: #eff6ff;
      color: #1e40af;
      border-left: 4px solid #3b82f6;
    }
  `],
  animations: [
    trigger('slideInOut', [
      state('void', style({
        transform: 'translateY(-30px)',
        opacity: 0
      })),
      state('visible', style({
        transform: 'translateY(0)',
        opacity: 1
      })),
      state('hidden', style({
        transform: 'translateY(-30px)',
        opacity: 0
      })),
      transition('void => visible', animate('200ms ease-out')),
      transition('visible => hidden', animate('200ms ease-in'))
    ])
  ]
})
export class NotificationComponent implements OnInit, OnDestroy {
  notification: Notification | null = null;
  notificationState: 'visible' | 'hidden' = 'hidden';
  private subscription: Subscription = new Subscription();
  private timeout: any;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.subscription = this.notificationService.notification$.subscribe(notification => {
      this.showNotification(notification);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  showNotification(notification: Notification): void {
    // Clear any existing timeout
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    
    this.notification = notification;
    this.notificationState = 'visible';
    
    // Auto-hide after duration
    this.timeout = setTimeout(() => {
      this.hideNotification();
    }, notification.duration || 5000);
  }

  hideNotification(): void {
    this.notificationState = 'hidden';
    setTimeout(() => {
      this.notification = null;
    }, 200);
  }

  getIconForType(type: string): string {
    switch (type) {
      case 'success':
        return 'check_circle';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'info';
    }
  }
} 