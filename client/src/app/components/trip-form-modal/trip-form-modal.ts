import { Component, OnChanges, SimpleChanges, inject, input } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TripsService } from '../../services/trips.service';
import { Trip } from '../../modules/trip.moduel';

@Component({
  selector: 'app-trip-form-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './trip-form-modal.html',
  styleUrls: ['./trip-form-modal.css']
})
export class TripFormModal implements OnChanges {
  
  id = input<string | undefined>(); 
  private tripsService = inject(TripsService);
  private router = inject(Router);

  
  tripForm = new FormGroup({
    name: new FormControl('', Validators.required),
    destination: new FormControl('', Validators.required),
    startDate: new FormControl('', Validators.required),
    endDate: new FormControl('', Validators.required),
    price: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
    description: new FormControl(''),
    image: new FormControl('')
  });

  isEditMode = false;

  ngOnChanges(changes: SimpleChanges) {
    if (this.id()) {
      this.isEditMode = true; 
      
      this.tripsService.getTripById(this.id()!).subscribe({
        next: (existingTrip) => {
          console.log('הנתונים שהגיעו מהשרת:', existingTrip);
        
          this.tripForm.patchValue({
            name: existingTrip.name,
            destination: existingTrip.destination,
            startDate: existingTrip.startDate,
            endDate: existingTrip.endDate,
            price: existingTrip.price,
            description: existingTrip.description,
            image: existingTrip.image
          });
        },
        error: (err) => {
          console.error('שגיאה בטעינת נתוני הטיול:', err);
        }
      });
    } else {
      this.isEditMode = false;
      this.tripForm.reset(); 
    }
  }

  onSubmit() {
    if (this.tripForm.invalid) return;

    const tripData = this.tripForm.getRawValue() as Trip;

    if (this.isEditMode) {
      this.tripsService.updateTrip(this.id()!, tripData).subscribe({
        next: () => {
          console.log('הטיול עודכן בהצלחה בשרת!');
          this.router.navigate(['/all-trips']); 
        },
        error: (err) => console.error('שגיאה בעדכון הטיול:', err)
      });
    } else {
      this.tripsService.addTrip(tripData).subscribe({
        next: () => {
          console.log('טיול חדש נוצר בהצלחה בשרת!');
          this.router.navigate(['/all-trips']); 
        },
        error: (err) => console.error('שגיאה בהוספת טיול חדש:', err)
      });
    }
  }
}