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
  bookingService= inject(BookingService)
  router = inject(Router);
  currentTrip = input.required<Trip>();
  showDeleteModal = false;
  tripToDelete: any = null;
onEdit() {
  const currentTripId = String(this.currentTrip().id).trim();

  console.log('בודק נרשמים עבור טיול מספר:', currentTripId);

  this.bookingService.getBookings().subscribe({
    next: (allBookings) => {
      
      // מסננים את כל ההזמנות שקיבלנו, ומשאירים רק את אלו של הטיול הנוכחי
      const relevantBookings = allBookings.filter(b => String(b.tripId).trim() === currentTripId);

      console.log('ההזמנות הרלוונטיות שנמצאו לאחר סינון:', relevantBookings);

      // תנאי חסימה/ניווט לפי אורך המערך המסונן
      if (relevantBookings.length === 0) {
        // אין נרשמים - מנווטים לעריכה
        this.router.navigate(['/edit-trip', this.currentTrip().id]);
      } else {
        // יש נרשמים - חוסמים
        alert('לא ניתן לערוך טיול זה מכיוון שיש אליו כבר נרשמים!');
      }
    },
    error: (err) => {
      console.error('שגיאה בקבלת ההזמנות:', err);
    }
  });
}
  onDelete() {
    this.tripToDelete = this.currentTrip();
    this.showDeleteModal = true;
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




}
