import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Trip } from '../modules/trip.moduel';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TripsService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/trips';
      
    // קבלת רשימת כל הטיולים במערכת
  getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(this.apiUrl);
  }

  // קבלת פרטי טיול ספציפי לפי מזהה
  getTripById(id: string): Observable<Trip> {
    return this.http.get<Trip>(`${this.apiUrl}/${id}`);
  }

  // פונקציות לשימוש המנהל:

  // הוספת טיול חדש 
  addTrip(trip: Trip): Observable<Trip> {
    return this.http.post<Trip>(this.apiUrl, trip);
  }

  // עדכון טיול קיים
  updateTrip(id: string, trip: Trip): Observable<Trip> {
    return this.http.put<Trip>(`${this.apiUrl}/${id}`, trip);
  }

  // מחיקת טיול
  deleteTrip(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}