import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TripsService {
  private http= inject(HttpClient);
  getTrips() {
  return this.http.get<any[]>('/api/trips');
}
 

 
}
