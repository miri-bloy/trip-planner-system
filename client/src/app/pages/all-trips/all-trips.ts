import { Component, computed, effect, inject, signal } from '@angular/core';
import { TripCard } from '../../components/trip-card/trip-card';
import { RouterLink } from "@angular/router";
import { TripsService } from '../../services/trips.service';
import { AuthService } from '../../services/auth.service';
import { BookingService } from '../../services/booking.service';
import { Trip } from '../../modules/trip.moduel';
import { Booking } from '../../modules/booking.module';
import { TripFilters } from '../../components/trip-filters/trip-filters';

@Component({
  selector: 'app-all-trips',
  imports: [TripCard, RouterLink, TripFilters],
  templateUrl: './all-trips.html',
  styleUrl: './all-trips.css',
})

export class AllTrips {
  
  allTripsService = inject(TripsService);
  authService = inject(AuthService);
  bookingService = inject(BookingService);

  trips = signal<Trip[]>([]);
  myBookings = signal<Booking[]>([]);
  selectedDestination = signal<string>('');
  selectedDate = signal<string>('');
  priceSortOrder = signal<string>('default');
  maxPrice = signal<number>(0);

  constructor() {
    effect(() => {
      const user = this.authService.currentUser();
      if (user && user.id) {
        this.bookingService.getBookings().subscribe(allBookings => {
          const filteredBookings = allBookings.filter(booking => String(booking.userId) === String(user.id));
          this.myBookings.set(filteredBookings);
        });
      } else {
        this.myBookings.set([]);
      }
    });
  }

  ngOnInit() {
    this.allTripsService.getTrips().subscribe(data => {
      this.trips.set(data);
    });
  }


  isUserRegisteredToTrip(tripId: string | undefined): boolean {
    if (!tripId) return false;
    return this.myBookings().some(booking => String(booking.tripId) === tripId);
  }

  //פונקציית סינון דינאמית
  filteredTrips = computed(() => {
    let trips = [...this.trips()];

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