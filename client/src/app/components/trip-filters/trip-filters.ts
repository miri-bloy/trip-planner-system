import { Component, output } from '@angular/core';

@Component({
  selector: 'app-trip-filters',
  standalone: true,
  imports: [],
  templateUrl: './trip-filters.html',
  styleUrl: './trip-filters.css',
})
export class TripFilters {
  destinationChange = output<string>();
  dateChange = output<string>();
  maxPriceChange = output<number>();
  sortChange = output<string>();

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
    this.maxPriceChange.emit(value ? Number(value) : 0);
  }

  onSortChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.sortChange.emit(value);
  }
}