import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Trip } from '../../modules/trip.moduel';
import { TripsService } from '../../services/trips.service';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';
import { Booking } from '../../modules/booking.module';

@Component({
  selector: 'app-trip-details',
  imports: [FormsModule],
  templateUrl: './trip-details.html',
  styleUrl: './trip-details.css',
})
export class TripDetails implements OnInit {

  tripsService = inject(TripsService);
  bookingService = inject(BookingService);
  authService = inject(AuthService);

  isRegistered = signal<boolean>(false);
  tripID = input.required<string>();
  currentTrip = signal<Trip | null>(null);
  bookingDetails = signal<Booking | null>(null);
  
  newBooking = signal<Booking>({
    tripId: '',
    userId: '',
    people: 1
  });

  //הרשמה לטיול
  registerToTrip(peopleCount: number) {
    const userId = this.authService.currentUser()?.id;
    const tripId = this.currentTrip()?.id;

    if (!userId) {
      alert('עליך להתחבר למערכת כדי להירשם לטיול.');
      return;
    }

    if (!tripId) {
      return;
    }

    this.newBooking.set({
      tripId: tripId,
      userId: userId,
      people: peopleCount > 0 ? peopleCount : 1
    });

    //הרשמה בפועל
    this.bookingService.createBooking(this.newBooking()).subscribe({
      next: (response) => {
        console.log('נרשם לטיול בהצלחה!', response);
        this.bookingDetails.set(response);
        this.isRegistered.set(true);
      },
      error: (err) => {
        console.error('ההרשמה נכשלה:', err);
      }
    });
  }

  //ביטול הרשמה לטיול
  cancelTripRegistration() {
    const userId = this.authService.currentUser()?.id;
    const tripId = this.currentTrip()?.id;

    if (!userId || !tripId) {
      alert('עליך להתחבר למערכת כדי לבטל הרשמה לטיול.');
      return;
    }

    this.bookingService.getBookingsByUserIdAndTripId(userId, tripId).subscribe({
      next: (bookings: Booking[]) => {
        if (bookings.length === 0) {
          console.log('לאמצאה הרשמה לביטול');
          return;
        }
        const bookingId = bookings[0].id;
        if (!bookingId) {
          console.error('מזהה ההזמנה אינו תקין');
          return;
        }
        
        // ביצוע הביטול בפועל
        this.bookingService.cancelBooking(bookingId).subscribe({
          next: (response) => {
            console.log('ההרשמה לטיול בוטלה!', response);
            this.bookingDetails.set(null);
            this.isRegistered.set(false);
          },
          error: (err) => {
            console.error('הבקשה לביטול נכשלה:', err);
          }
        });
      },
      error: (err) => {
        console.error('שגיאה בשליפת ההזמנות:', err);
      }
    });
  }

  ngOnInit() {
    this.tripsService.getTripById(this.tripID()).subscribe({
      next: (data) => {
        this.currentTrip.set(data);

        const userId = this.authService.currentUser()?.id;
        const tripId = this.tripID();

        if (userId && tripId) {
          this.bookingService.getBookings().subscribe({
            next: (allBookings: Booking[]) => {
              
              const foundBooking = allBookings.find(b => 
                String(b.userId).trim() === String(userId).trim() && 
                String(b.tripId).trim() === String(tripId).trim()
              );
              
              this.bookingDetails.set(foundBooking || null);
              this.isRegistered.set(!!foundBooking);
            },
            error: (err) => console.error('שגיאה בשליפת כל ההזמנות:', err)
          });
        }
      },
      error: (err) => console.error('שגיאה בטעינת הטיול:', err)
    });
  }
}