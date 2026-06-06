import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';
import { Trip } from '../../modules/trip.moduel';
import { Booking } from '../../modules/booking.module';
import { TripsService } from '../../services/trips.service';
import { TripCard } from '../../components/trip-card/trip-card';

@Component({
  selector: 'app-my-trips',
  imports: [TripCard],
  templateUrl: './my-trips.html',
  styleUrl: './my-trips.css',
})
export class MyTrips implements OnInit {

  bookingService = inject(BookingService);
  allTripsService = inject(TripsService);
  authService = inject(AuthService);
  
  myBookings = signal<Booking[]>([]);
  allTrips = signal<Trip[]>([]);
  tripItem: Trip | null = null;

 
  myTrips = computed<Trip[]>(() => {
    const bookings = this.myBookings();
    const trips = this.allTrips();
    
    // סינון הטיולים שה-id שלהם קיים בתוך ה-tripId של ההזמנות שלי
    return trips.filter(trip => bookings.some(booking => String(booking.tripId) === String(trip.id)));
  });

  constructor() {
    // ה-effect המעודכן שמבצע את הסינון בפרונטאנד
    effect(() => {
      const user = this.authService.currentUser();
      
      if (user && user.id) {
        console.log('מזהה משתמש עודכן, מביא את כל ההזמנות מהשרת עבור סינון ידני:', user.id);
        
        // קריאה לכל ההזמנות מהשרת
        this.bookingService.getBookings().subscribe(allBookings => {
          console.log('כל ההזמנות הגולמיות שהגיעו מהשרת:', allBookings);
          
// ביצוע סינון בצורה בטוחה כשהכל אצלי ביד
          const filteredBookings = allBookings.filter(booking => String(booking.userId) === String(user.id));
          
          console.log('ההזמנות המסוננות של המשתמש הנוכחי:', filteredBookings);
          
          // עדכון הסיגנל עם ההזמנות הרלוונטיות בלבד
          this.myBookings.set(filteredBookings); 
        });
      } else {
        this.myBookings.set([]);
      }
    });
  }

  ngOnInit() {
    //  כל הטיולים מהשרת
    this.allTripsService.getTrips().subscribe(data => {
      console.log('כל הטיולים מהשרת:', data);
      this.allTrips.set(data);
    });
  }
}