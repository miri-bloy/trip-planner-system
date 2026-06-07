import { Component, OnChanges, SimpleChanges, inject, input } from '@angular/core'; // שימי לב לייבוא של OnChanges
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TripsService } from '../../services/trips.service';
import { Trip } from '../../modules/trip.moduel';

@Component({
  selector: 'app-trip-form',
  standalone: true,
  imports: [ReactiveFormsModule],
templateUrl: './trip-form-modal.html', 
  styleUrls: ['./trip-form-modal.css']
})
export class TripFormModal implements OnChanges { // שינינו מ-OnInit ל-OnChanges
  
  id = input<string | undefined>(); 

  private tripsService = inject(TripsService);
  private router = inject(Router);

  tripForm = new FormGroup({
    name: new FormControl('', Validators.required),
    destination: new FormControl('', Validators.required),
    image: new FormControl('')
  });

  isEditMode = false;

  // הפונקציה הזו רצה אוטומטית ברגע שה-input של ה-ID מתעדכן מה-URL
  ngOnChanges(changes: SimpleChanges) {
    
    // בודקים אם ה-ID קיים ויש בו ערך אמיתי
    if (this.id()) {
      this.isEditMode = true; // מעבירים מיד למצב עריכה כדי שהכותרת ב-HTML תתעדכן
      
      // פנייה לסרביס לקבלת הנתונים
      this.tripsService.getTripById(this.id()!).subscribe({
        next: (existingTrip) => {
          // מילוי הטופס בנתונים שהגיעו מהשרת
          this.tripForm.patchValue({
            name: existingTrip.name,
            destination: existingTrip.destination,
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
      this.tripsService.updateTrip(this.id()!, tripData);
      console.log('הטיול עודכן בהצלחה!');
    } else {
      this.tripsService.addTrip(tripData);
      console.log('טיול חדש נוצר בהצלחה!');
    }
    
    this.router.navigate(['/trips']);
  }
}