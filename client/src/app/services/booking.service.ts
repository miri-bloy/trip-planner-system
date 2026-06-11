import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Booking } from '../modules/booking.module';

@Injectable({
  providedIn: 'root'
})

// ~~~~~~~~~~~~~~~שירות לניהול הזמנות במערכת~~~~~~~~~~~~~~~~

export class BookingService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/bookings';

  // קבלת רשימת כל ההזמנות במערכת
  getBookings(): Observable<Booking[]> {
    console.log(this.apiUrl);
    return this.http.get<Booking[]>(this.apiUrl);
  }

  // יצירת הזמנה חדשה לטיול
  createBooking(booking: Booking): Observable<Booking> {
    return this.http.post<Booking>(this.apiUrl, booking);
  }

  // ביטול הזמנה קיימת לפי מזהה הזמנה
  cancelBooking(bookingId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${bookingId}`);
  }

// ביצוע סינון מקומי באמצעות map כדי לעקוף בעיות בפרמטרי שאילתה בשרת (אי-התאמת טיפוסים)
// שליפת כל ההזמנות וסינון לפי מזהים ע"י המרה למחרוזת וניקוי רווחים להבטחת התאמה מדויקת

//קבלת כל ההזמנות ע"פ מזהה משתמש
  getBookingsByUserId(userId: string | undefined): Observable<Booking[]> {
    return this.getBookings().pipe(
      map(bookings => bookings.filter(b => String(b.userId).trim() === userId))
    );
  }

  // קבלת כל ההזמנות ע"פ מזהה טיול
  getBookingsByTripId(tripId: string | undefined): Observable<Booking[]> {
    return this.getBookings().pipe(
      map(bookings => bookings.filter(b => String(b.tripId).trim() === tripId))
    );
  }

  //קבלת כל ההזמנות ע"פ מזהה טיול ומזהה משתמש
  getBookingsByUserIdAndTripId(userId: string | undefined, tripId: string | undefined): Observable<Booking[]> {
    return this.getBookings().pipe(
      map(bookings => bookings.filter(b => 
        String(b.userId).trim() === userId && 
        String(b.tripId).trim() === tripId
      ))
    );
  }

}