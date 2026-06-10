import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { TripsService } from '../../services/trips.service';
import { AuthService } from '../../services/auth.service';
import { Trip } from '../../modules/trip.moduel';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-trip-card',
  imports: [],
  templateUrl: './trip-card.html',
  styleUrl: './trip-card.css',
})
export class TripCard {
  tripService = inject(TripsService);
  authService = inject(AuthService);
  bookingService = inject(BookingService)
  router = inject(Router);
  currentTrip = input.required<Trip>();
  showDeleteModal = false;
  tripToDelete: any = null;




  onEdit() {
    const currentTripId = String(this.currentTrip().id).trim();

    console.log('בודק נרשמים עבור טיול מספר:', currentTripId);

    this.bookingService.getBookings().subscribe({
      next: (allBookings) => {
        const relevantBookings = allBookings.filter(b => String(b.tripId).trim() === currentTripId);
        console.log('ההזמנות הרלוונטיות שנמצאו לאחר סינון:', relevantBookings);

        if (relevantBookings.length === 0) {
          this.router.navigate(['/edit-trip', this.currentTrip().id]);
        } else {
          alert('לא ניתן לערוך טיול זה מכיוון שיש אליו כבר נרשמים!');
        }
      },
      error: (err) => {
        console.error('שגיאה בקבלת ההזמנות:', err);
      }
    });
  }
  onDelete() {
    const currentTripId = String(this.currentTrip().id).trim();

    console.log('בודק נרשמים לפני מחיקת טיול מספר:', currentTripId);

    this.bookingService.getBookings().subscribe({
      next: (allBookings) => {
        const relevantBookings = allBookings.filter(
          b => String(b.tripId).trim() === currentTripId
        );

        if (relevantBookings.length === 0) {
          this.tripToDelete = this.currentTrip();
          this.showDeleteModal = true;
        } else {
          alert('לא ניתן למחוק טיול זה מכיוון שיש אליו כבר נרשמים!');
        }
      },
      error: (err) => {
        console.error('שגיאה בבדיקת ההזמנות לפני מחיקה:', err);
      }
    });
  }
  confirmDelete() {
    console.log('delete:', this.tripToDelete);

    this.showDeleteModal = false;
    this.tripToDelete = null;
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.tripToDelete = null;
  }

  goToTripDetails() {
    this.router.navigate(['/all-trips', this.currentTrip().id]);
  }

}
