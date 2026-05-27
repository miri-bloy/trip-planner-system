import { Component, inject, input } from '@angular/core';
import { TripsService } from '../../services/trips-service';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trip-card',
  imports: [],
  templateUrl: './trip-card.html',
  styleUrl: './trip-card.css',
})
export class TripCard {
  tripService = inject(TripsService);
  authService = inject(AuthService);
  router = inject(Router);
  currentTrip = input.required<any>();//זמני עד שיהיה מודול מסודר
  showDeleteModal = false;
  tripToDelete: any = null;
  onEdit() {
    this.router.navigate(['/trip-form-modal']);
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
