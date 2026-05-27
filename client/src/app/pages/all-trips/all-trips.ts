import { Component, inject, signal } from '@angular/core';
import { TripsService } from '../../services/trips-service';
import { AuthService } from '../../services/auth-service';
import { TripCard } from '../../components/trip-card/trip-card';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-all-trips',
  imports: [TripCard, RouterLink],
  templateUrl: './all-trips.html',
  styleUrl: './all-trips.css',
})
export class AllTrips {
   allTripsService=inject(TripsService)
   authService=inject(AuthService)
   trips=signal<any[]>([])

   ngOnInit() {
  this.allTripsService.getTrips().subscribe(data => {
    this.trips.set(data);
  });
}




}
