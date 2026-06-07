import { Component, output } from '@angular/core';

@Component({
  selector: 'app-trip-filters',
  standalone: true,
  imports: [],
  templateUrl: './trip-filters.html',
  styleUrl: './trip-filters.css',
})
export class TripFilters {
  // 4 צינורות שיוצאים החוצה לאבא
  destinationChange = output<string>();
  dateChange = output<string>();
  maxPriceChange = output<number>(); // ה-Output החדש לסינון מחיר
  sortChange = output<string>();     // ה-Output המעודכן למיון הכללי

  onDestinationInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.destinationChange.emit(value);
  }

  onDateChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.dateChange.emit(value);
  }

  onMaxPriceInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    // אם השדה ריק נשלח 0, אחרת נמיר את הטקסט למספר אמיתי
    this.maxPriceChange.emit(value ? Number(value) : 0);
  }

  onSortChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.sortChange.emit(value);
  }
}