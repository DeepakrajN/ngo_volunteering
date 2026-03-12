# Thunder Client API Tests - NGO Volunteer Platform

## 🔧 Setup
Base URL: `http://localhost:5000/api`

---

## 1️⃣ VOLUNTEER APIs

### Register Volunteer
**POST** `/volunteers/register`
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "password": "password123",
  "age": 25,
  "bloodGroup": "O+",
  "address": "123 Main St",
  "occupation": "Software Engineer",
  "interests": ["Education", "Environment"],
  "availability": "Weekends",
  "hobby": "Reading",
  "maritalStatus": "Single",
  "educationalQualification": "Bachelor's",
  "nativeLocation": "New York",
  "currentLocation": "Los Angeles"
}
```

### Login Volunteer
**POST** `/volunteers/login`
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
**Response**: Copy the `token` from response

### Get My Profile
**GET** `/volunteers/me`
**Headers**:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

### Get All Volunteers
**GET** `/volunteers`

---

## 2️⃣ ADMIN APIs

### Admin Login
**POST** `/admin/login`
```json
{
  "username": "admin",
  "password": "admin123"
}
```
**Response**: Copy the `token` and use as `adminToken`

---

## 3️⃣ EVENT APIs

### Get All Events
**GET** `/events`

### Create Event (Admin Only)
**POST** `/events`
**Headers**:
```
Authorization: Bearer ADMIN_TOKEN_HERE
```
**Body**:
```json
{
  "title": "Beach Cleanup Drive",
  "description": "Join us for a beach cleanup event",
  "date": "2024-12-25",
  "location": "Santa Monica Beach",
  "Headedby": "Environmental Club",
  "image": "https://example.com/image.jpg"
}
```

### Register for Event
**POST** `/events/register`
**Body**:
```json
{
  "eventId": "EVENT_ID_HERE",
  "volunteerId": "VOL123456789",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890"
}
```

### Check-In to Event
**POST** `/events/check-in`
**Body**:
```json
{
  "eventId": "EVENT_ID_HERE",
  "volunteerId": "VOL123456789",
  "location": {
    "latitude": 34.0195,
    "longitude": -118.4912,
    "accuracy": 10
  },
  "photos": ["data:image/png;base64,iVBORw0KG..."],
  "deviceInfo": "Chrome on Windows"
}
```

### Get Event Attendance (Admin)
**GET** `/events/EVENT_ID_HERE/attendance`
**Headers**:
```
Authorization: Bearer ADMIN_TOKEN_HERE
```

---

## 4️⃣ CERTIFICATE APIs

### Get Pending Certificates (Admin)
**GET** `/certificates/pending`
**Headers**:
```
Authorization: Bearer ADMIN_TOKEN_HERE
```

### Verify Certificate (Admin)
**PATCH** `/certificates/CERTIFICATE_ID_HERE/verify`
**Headers**:
```
Authorization: Bearer ADMIN_TOKEN_HERE
```

### Reject Certificate (Admin)
**PATCH** `/certificates/CERTIFICATE_ID_HERE/reject`
**Headers**:
```
Authorization: Bearer ADMIN_TOKEN_HERE
```

### Get My Certificates (Volunteer)
**GET** `/certificates/volunteer/VOL123456789`
**Headers**:
```
Authorization: Bearer VOLUNTEER_TOKEN_HERE
```

### Get All My Certificates (Volunteer - including pending)
**GET** `/certificates/volunteer/VOL123456789/all`
**Headers**:
```
Authorization: Bearer VOLUNTEER_TOKEN_HERE
```

### Get Certificate by ID
**GET** `/certificates/CERT123456789`

---

## 5️⃣ ANNOUNCEMENT APIs

### Get All Announcements
**GET** `/announcements`

### Create Announcement (Admin)
**POST** `/announcements`
**Headers**:
```
Authorization: Bearer ADMIN_TOKEN_HERE
```
**Body**:
```json
{
  "title": "New Volunteer Program",
  "content": "We are launching a new volunteer program starting next month!"
}
```

### Update Announcement (Admin)
**PUT** `/announcements/ANNOUNCEMENT_ID_HERE`
**Headers**:
```
Authorization: Bearer ADMIN_TOKEN_HERE
```
**Body**:
```json
{
  "title": "Updated Title",
  "content": "Updated content"
}
```

### Delete Announcement (Admin)
**DELETE** `/announcements/ANNOUNCEMENT_ID_HERE`
**Headers**:
```
Authorization: Bearer ADMIN_TOKEN_HERE
```

---

## 6️⃣ CLUB APIs

### Get All Clubs
**GET** `/clubs`

### Create Club (Admin)
**POST** `/clubs`
**Body**:
```json
{
  "name": "Environmental Club",
  "description": "Dedicated to environmental conservation",
  "category": "Environment",
  "image": "https://example.com/club.jpg"
}
```

### Get Club by ID
**GET** `/clubs/CLUB_ID_HERE`

### Join Club
**POST** `/clubs/CLUB_ID_HERE/join`
**Body**:
```json
{
  "volunteerId": "VOL123456789"
}
```

---

## 7️⃣ GALLERY APIs

### Get All Gallery Images
**GET** `/gallery`

### Add Gallery Image (Admin)
**POST** `/gallery`
**Body**:
```json
{
  "title": "Beach Cleanup 2024",
  "url": "data:image/png;base64,iVBORw0KG...",
  "description": "Volunteers cleaning the beach"
}
```

### Delete Gallery Image (Admin)
**DELETE** `/gallery/IMAGE_ID_HERE`

---

## 📝 Quick Test Flow

### Test Certificate System:
1. **Register/Login as Volunteer** → Get token
2. **Get Events** → Copy an event ID
3. **Register for Event** → Use volunteerId and eventId
4. **Check-In to Event** → Provide location and photos
5. **Login as Admin** → Get admin token
6. **Get Pending Certificates** → See the auto-generated certificate
7. **Verify Certificate** → Change status to verified
8. **Get My Certificates** (as volunteer) → See verified certificate

---

## 🔑 Token Management

After login, save tokens:
- **Volunteer Token**: Use in `Authorization: Bearer TOKEN` for volunteer endpoints
- **Admin Token**: Use in `Authorization: Bearer TOKEN` for admin endpoints

**Get Token from Browser**:
```javascript
// Open browser console (F12) on http://localhost:3000
localStorage.getItem('token')        // Volunteer token
localStorage.getItem('adminToken')   // Admin token
```

---

## ⚠️ Common Issues

1. **401 Unauthorized**: Token expired or invalid - Login again
2. **404 Not Found**: Check if server is running on port 5000
3. **500 Server Error**: Check MongoDB connection
4. **CORS Error**: Make sure backend allows requests from Thunder Client

---

## 🎯 Testing Tips

1. **Save Requests**: Create a Thunder Client collection for reuse
2. **Environment Variables**: Set `baseUrl` = `http://localhost:5000/api`
3. **Copy IDs**: After creating resources, copy their IDs for subsequent requests
4. **Test Order**: Follow the flow: Register → Login → Use Token → Test APIs
