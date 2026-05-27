import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TripsService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000';
      getTrips() {
  return this.http.get<any[]>('/api/trips');
}
}