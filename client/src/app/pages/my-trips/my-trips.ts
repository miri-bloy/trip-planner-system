import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';
import { Trip } from '../../modules/trip.moduel';
import { Booking } from '../../modules/booking.module';
import { TripsService } from '../../services/trips.service';
import { TripCard } from '../../components/trip-card/trip-card';
import { TripFilters } from '../../components/trip-filters/trip-filters';

@Component({
  selector: 'app-my-trips',
  imports: [TripCard,TripFilters],
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

  // פילטר ומיון
  selectedDestination = signal<string>('');
  selectedDate = signal<string>('');
  priceSortOrder = signal<string>('default');
  maxPrice = signal<number>(0);


  myTrips = computed<Trip[]>(() => {
    const bookings = this.myBookings();
    const trips = this.allTrips();

    return trips.filter(trip => bookings.some(booking => String(booking.tripId) === String(trip.id)));
  });

  constructor() {
    effect(() => {
      const user = this.authService.currentUser();
  
      if (user && user.id) {
        console.log('מזהה משתמש עודכן, מביא הזמנות מסוננות מהשרת:', user.id);
  
        this.bookingService.getBookingsByUserId(String(user.id)).subscribe(filteredBookings => {
          console.log('ההזמנות המסוננות של המשתמש הנוכחי:', filteredBookings);
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
  filteredMyTrips = computed(() => {
    let trips = [...this.myTrips()];


    const destQuery = this.selectedDestination().toLowerCase().trim();
    if (destQuery) {
      trips = trips.filter(trip =>
        trip.destination.toLowerCase().includes(destQuery)
      );
    }


    const dateQuery = this.selectedDate();
    if (dateQuery) {
      trips = trips.filter(trip => trip.startDate >= dateQuery);
    }

    const priceLimit = this.maxPrice();
    if (priceLimit > 0) {
      trips = trips.filter(trip => trip.price <= priceLimit);
    }

    if (this.priceSortOrder() === 'priceAsc') {
      trips.sort((a, b) => a.price - b.price);
    } else if (this.priceSortOrder() === 'priceDesc') {
      trips.sort((a, b) => b.price - a.price);
    } else if (this.priceSortOrder() === 'dateAsc') {
      trips.sort((a, b) => a.startDate.localeCompare(b.startDate));
    } else if (this.priceSortOrder() === 'dateDesc') {
      trips.sort((a, b) => b.startDate.localeCompare(a.startDate));
    }

    return trips;
  });
}