# Trip Planner System - Angular Project

<p dir="ltr" align="left">מערכת לניהול ותכנון טיולים שנבנתה כפרויקט מסכם עבור קורס אנגולר (תשפ"ו).</p>
<p dir="ltr" align="left">המערכת מאפשרת למשתמשים לצפות בטיולים, לסנן ולמיין אותם, להירשם לטיולים ולנהל את ההזמנות שלהם, לצד ממשק ניהול (Admin) להוספה, עריכה ומחיקה של טיולים.</p>

---

## 📂 מבנה התיקיות בפרויקט (Project Structure)

<p dir="ltr" align="left">הפרויקט מנוהל תחת תקיית client ובנוי בצורה מודולרית המפרידה בין עמודי האפליקציה המרכזיים, רכיבי משנה עצמאיים ושירותי לוגיקה:</p>

* `src/app/pages/` - <p dir="ltr" align="left">מכיל את עמודי המערכת הראשיים המנוהלים על ידי הראוטינג (all-trips, home, login, my-trips, register, trip-details).</p>
* `src/app/components/` - <p dir="ltr" align="left">רכיבי משנה לשימוש חוזר בעמודים השונים (trip-card לתצוגת טיול בודד, trip-filters לסינון, trip-form-modal כטופס מודאלי לעדכון והוספה, ו-welcome להודעה כללית).</p>
* `src/app/services/` - <p dir="ltr" align="left">מכיל את שירותי המערכת לניהול קריאות ה-HTTP והלוגיקה העסקית (auth.service.ts, booking.service.ts, trips.service.ts).</p>
* `src/app/app.routes.ts` - <p dir="ltr" align="left">קובץ ניתוב הנתיבים (Routing) של האפליקציה בדפדפן.</p>

---

## ⚙️ חלוקת אחריות ושירותים מרכזיים (Services)

<p dir="ltr" align="left">המערכת משתמשת בארכיטקטורת Services על מנת לנתק את הלוגיקה העסקית והתקשורת מול ה-JSON Server משכבת התצוגה.</p>

### 1. `AuthService`
* **נתיב קובץ:** `src/app/services/auth.service.ts`
* **תפקיד:** <p dir="ltr" align="left">ניהול זרימת ההתחברות והרישום, שמירת המצב של המשתמש הנוכחי המחובר, וביצוע אימות מול השרת.</p>
* **פונקציות מרכזיות:**
  * `login(credentials)` - <p dir="ltr" align="left">שולחת קריאת GET/POST לבדיקת פרטי משתמש לפי name ו-password.</p>
  * `register(newUser)` - <p dir="ltr" align="left">שולחת קריאת POST ליצירת משתמש חדש לאחר בדיקה ששם המשתמש אינו תפוס.</p>
  * `logout()` - <p dir="ltr" align="left">מאפסת את מצב המשתמש ומנתקת אותו.</p>

### 2. `TripsService`
* **נתיב קובץ:** `src/app/services/trips.service.ts`
* **תפקיד:** <p dir="ltr" align="left">ניהול כל הישויות של הטיולים במערכת, תמיכה בפעולות CRUD עבור מנהל המערכת.</p>
* **פונקציות מרכזיות:**
  * `getTrips()` - <p dir="ltr" align="left">משיכת כל הטיולים מהנתיב GET /trips.</p>
  * `getTripById(id)` - <p dir="ltr" align="left">משיכת פרטי טיול ספציפי (GET /trips/:id).</p>
  * `createTrip(trip)` - <p dir="ltr" align="left">הוספת טיול חדש (POST /trips) - זמין לאדמין בלבד.</p>
  * `updateTrip(id, trip)` - <p dir="ltr" align="left">עדכון טיול קיים (PUT /trips/:id).</p>
  * `deleteTrip(id)` - <p dir="ltr" align="left">מחיקת טיול (DELETE /trips/:id).</p>

### 3. `BookingService`
* **נתיב קובץ:** `src/app/services/booking.service.ts`
* **תפקיד:** <p dir="ltr" align="left">ניהול רישום המשתמשים לטיולים השונים וביטולי הרשמות.</p>
* **פונקציות מרכזיות:**
  * `getBookings()` - <p dir="ltr" align="left">משיכת כל ההזמנות במערכת.</p>
  * `createBooking(booking)` - <p dir="ltr" align="left">יצירת הזמנה חדשה לטיול (POST /bookings).</p>
  * `cancelBooking(bookingId)` - <p dir="ltr" align="left">ביטול הזמנה ומחיקתה מהשרת.</p>

---

## 🔄 תהליכים מרכזיים באפליקציה (Application Flows)

### 1. זרימת התחברות ורישום (Login & Register Flow)
* **התחברות:** <p dir="ltr" align="left">עמוד login (בנתיב src/app/pages/login/) מנהל טופס המקבל שם וסיסמה. בעת הפעלת onSubmit(), מבוצעת קריאה ל-login() ב-AuthService. השירות בודק מול ה-API בנתיב /users האם קיים משתמש תואם. אם כן, המשתמש נשמר במערכת והאפליקציה מנווטת לעמוד home. אם לא, מוצגת שגיאה מתאימה.</p>
* **רישום:** <p dir="ltr" align="left">עמוד register מנהלת טופס עם וידוא סיסמה. פונקציית הרישום מוודאת תחילה ששם המשתמש אינו קיים במערכת, ואם הוא ייחודי, מבוצעת קריאת POST /users והמשתמש מועבר למסך home.</p>

### 2. זרימת הרשמה וביטול טיול (Booking Flow)
* **בדיקת הרשמה כפולה:** <p dir="ltr" align="left">בעת כניסה לעמוד פרטי טיול (trip-details), המערכת קוראת ל-getBookings() כדי לבדוק האם המשתמש המחובר כבר רשום לטיול זה. במידה וכן, כפתור "הירשם" נחסם אוטומטית (Disabled) ומוצגת הודעה: "משתמש רשום כבר לטיול".</p>
* **הרשמה:** <p dir="ltr" align="left">לחיצה על "הרשם" מפעילה את createBooking() ב-BookingService, אשר מעדכנת את ה-API בנתיב POST /bookings עם מזהה המשתמש, מזהה הטיול וכמות הנוסעים שהוזנה.</p>
* **ביטול הרשמה:** <p dir="ltr" align="left">בעמוד my-trips, המשתמש צופה בטיולים שלו. לחיצה על "בטל הרשמה" מפעילה את פונקציית הביטול בשירות, שמבצעת מחיקה מהשרת ומעדכנת את התצוגה באופן מיידי.</p>

---

## 📊 ניהול מצב (State Management)

<p dir="ltr" align="left">האפליקציה מנהלת את המצב (State) שלה בצורה ריאקטיבית באמצעות שירותים מרכזיים המשמשים כ-Single Source of Truth, תוך שימוש ב-BehaviorSubject ו-Observables:</p>

* <p dir="ltr" align="left">המשתמש המחובר הנוכחי מנוהל בתוך AuthService על ידי משתנה מסוג BehaviorSubject. כל עמוד (כמו עמוד home להצגת השם בכותרת או עמוד all-trips לבדיקת הרשאות אדמין) נרשם (Subscribe) ל-Observable זה ומקבל עדכון חי בכל שינוי במצב החיבור.</p>
* <p dir="ltr" align="left">רשימות הטיולים וההזמנות נמשכות מהשרת ומנוהלות ב-Services כדי למנוע קריאות כפולות ומיותרות ל-API ולשמור על סנכרון נתונים מלא בין קומפוננטות ועמודים שונים.</p>

---

## 🛠 סינון ומיון (Filtering & Sorting)

<p dir="ltr" align="left">בעמוד all-trips נעשה שימוש ברכיב המשנה trip-filters, בו ממומשת לוגיקת סינון ומיון דינמית על גבי רשימת הטיולים:</p>

* **סינון:** <p dir="ltr" align="left">מתבצע בזמן אמת לפי שלושה פרמטרים: יעד (טקסט חופשי), תאריך, ומחיר מקסימלי, באמצעות פונקציית filterTrips().</p>
* **מיון:** <p dir="ltr" align="left">המשתמש יכול למיין את הרשימה לפי מחיר או תאריך (בסדר עולה/יורד) באמצעות פונקציית sortTrips().</p>

---

## 🚀 הוראות הרצה (Installation & Setup)

<p dir="ltr" align="left">כדי להריץ את הפרויקט באופן מקומי, יש לעקוב אחר הצעדים הבאים:</p>

1. **שכפול הפרויקט מהגיטהאב:**
   ```bash
   git clone <קישור לריפוזיטורי שלכן>
   cd TRIP-PLANNER-SYSTEM/client
