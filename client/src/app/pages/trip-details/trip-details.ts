import { Component, inject, input, OnInit, signal } from '@angular/core';
import { Trip } from '../../modules/trip.moduel';
import { TripsService } from '../../services/trips.service';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-trip-details',
  imports: [],
  templateUrl: './trip-details.html',
  styleUrl: './trip-details.css',
})
export class TripDetails implements OnInit {
  
  tripID= input.required<string>();
  currentTrip=signal<Trip | null>(null);
  tripsService = inject(TripsService);
  bookingService = inject(BookingService);
  authService = inject(AuthService);

  isRegistered= signal<boolean>(false);


  ngOnInit(){
    this.tripsService.getTripById(this.tripID()).subscribe(data => {
      console.log('פרטי הטיול הנוכחי:', data);
      this.currentTrip.set(data);
    });
    // this.isRegistered.set(this.bookingService.getBookingsByUserIdAndTripId(this.authService.currentUser()?.id,this.currentTrip()?.id)?true:false)
  }

}
