# Grand Egyptian Museum Ticketing System - Frontend

A modern, responsive web application for booking museum tours at the Grand Egyptian Museum. This frontend connects to a RESTful API backend to provide a complete ticketing and tour management experience.

## 🎯 Project Overview

This is the frontend component of a full-stack museum ticketing system developed as part of a Web Development course project. The application allows visitors to browse available tours, make bookings, leave reviews, and manage their accounts, while administrators can manage tours and monitor bookings.

## ✨ Features

### For Visitors
- **User Authentication**: Register, login, and secure JWT-based session management
- **Tour Browsing**: View all available museum tours with details
- **Tour Booking**: Book tours with automatic availability checking
- **Booking Management**: View and cancel personal bookings
- **Review System**: Leave ratings and reviews for completed tours
- **Responsive Design**: Mobile-friendly interface

### For Administrators
- **Tour Management**: Create, update, and delete tours
- **Booking Overview**: Monitor all bookings across the system
- **User Management**: View registered users
- **Statistics**: Track tour ratings and reviews

## 🛠️ Technology Stack

- **HTML5**: Semantic markup structure
- **CSS3**: Custom styling with responsive design
- **Vanilla JavaScript**: No external frameworks or libraries
- **JWT Authentication**: Secure token-based authentication
- **Fetch API**: RESTful API communication

## 📋 Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- Backend API server running (see backend repository)
- Basic understanding of HTML/CSS/JavaScript

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/habdelgawad1/Museum-Ticketing-System-Frontend.git
cd Museum-Ticketing-System-Frontend
```

### 2. Configure API Endpoint

Open `js/config.js` and verify the API base URL matches your backend server:

```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

### 3. Run the Application

Since this is a static frontend, you can run it in several ways:

**Option A: Using Live Server (Recommended)**
- Install the Live Server extension in VS Code
- Right-click on `index.html` and select "Open with Live Server"

**Option B: Using Python's Built-in Server**
```bash
# Python 3
python -m http.server 8000

# Then open http://localhost:8000 in your browser
```

**Option C: Direct File Opening**
- Simply open `index.html` in your browser
- Note: Some features may not work due to CORS restrictions

### 4. Start Using the Application

1. **Register a new account** or use existing credentials
2. **Browse available tours** on the home page
3. **Book a tour** by clicking "Book Now"
4. **View your bookings** in the "My Bookings" section
5. **Leave reviews** for tours you've attended

## 📁 Project Structure

```
Museum-Ticketing-System-Frontend/
├── index.html              # Main landing page
├── login.html              # User login page
├── register.html           # User registration page
├── tours.html              # Browse all tours
├── bookings.html           # User's booking management
├── admin.html              # Admin dashboard
├── css/
│   └── styles.css          # Main stylesheet
├── js/
│   ├── config.js           # API configuration
│   ├── auth.js             # Authentication utilities
│   ├── tours.js            # Tour-related functions
│   ├── bookings.js         # Booking management
│   ├── reviews.js          # Review system
│   └── admin.js            # Admin panel functions
└── README.md               # This file
```

## 🔐 Authentication Flow

1. User registers or logs in through the authentication pages
2. Upon successful authentication, a JWT token is received
3. Token is stored in `localStorage` for subsequent requests
4. All API requests include the token in the Authorization header
5. Token is validated on each protected route access

## 🌐 API Integration

The frontend communicates with the backend through these main endpoints:

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Tours
- `GET /api/tours` - Get all tours
- `GET /api/tours/:id` - Get specific tour details
- `POST /api/tours` - Create new tour (admin only)
- `PUT /api/tours/:id` - Update tour (admin only)
- `DELETE /api/tours/:id` - Delete tour (admin only)

### Bookings
- `GET /api/bookings` - Get user's bookings
- `GET /api/bookings/all` - Get all bookings (admin only)
- `POST /api/bookings` - Create new booking
- `DELETE /api/bookings/:id` - Cancel booking

### Reviews
- `GET /api/reviews/tour/:tourId` - Get tour reviews
- `POST /api/reviews` - Submit review
- `GET /api/reviews/stats/:tourId` - Get review statistics

### Users
- `GET /api/users` - Get all users (admin only)

## 🧪 Testing the Application

### Manual Testing Checklist

**Authentication:**
- [ ] Register with valid credentials
- [ ] Attempt registration with existing email
- [ ] Login with correct credentials
- [ ] Login with incorrect credentials
- [ ] Logout successfully

**Tour Management:**
- [ ] View all available tours
- [ ] View tour details
- [ ] Book an available tour
- [ ] Attempt to book a full tour
- [ ] View booking confirmation

**Booking Management:**
- [ ] View personal bookings
- [ ] Cancel a booking
- [ ] Verify available spots increase after cancellation

**Review System:**
- [ ] Submit a review with rating
- [ ] View reviews for a tour
- [ ] Check review statistics display

**Admin Functions:**
- [ ] Create a new tour
- [ ] Update tour information
- [ ] Delete a tour
- [ ] View all bookings
- [ ] View all users

### Testing with Different User Roles

**Regular User:**
```
Email: user@example.com
Password: [your test password]
```

**Admin User:**
```
Email: admin@example.com
Password: [your test password]
Role: admin
```

## 🎨 Customization

### Styling
Modify `css/styles.css` to change:
- Color scheme
- Typography
- Layout and spacing
- Responsive breakpoints

### Configuration
Update `js/config.js` to change:
- API base URL
- Request timeout settings
- Default pagination values

## 🐛 Troubleshooting

### Common Issues

**Issue: "Failed to fetch" errors**
- Solution: Ensure backend server is running and CORS is properly configured

**Issue: "Unauthorized" errors**
- Solution: Check if JWT token is valid and not expired, try logging in again

**Issue: Tours not displaying**
- Solution: Verify API endpoint is correct and database has tour data

**Issue: Booking button not working**
- Solution: Check console for errors, ensure tour has available spots

**Issue: Admin features not visible**
- Solution: Ensure logged-in user has admin role in database

### Debug Mode

Enable console logging by adding this to your browser console:
```javascript
localStorage.setItem('debug', 'true');
```

## 🔒 Security Considerations

- JWT tokens are stored in `localStorage` (consider `httpOnly` cookies for production)
- Always validate user input before sending to API
- Passwords are never stored in frontend code
- API requests are made over HTTPS in production
- CORS is configured to allow only trusted origins

## 📱 Browser Compatibility

Tested and working on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

This is a course project, so external contributions are not accepted. However, feedback and suggestions are welcome!

## 📝 Academic Integrity

This project was developed as part of a Web Development course with the following constraints:
- No AI-generated code
- No external JavaScript libraries or frameworks
- Vanilla JavaScript only
- Complete code ownership and understanding required

## 👨‍💻 Author

**Hussein Abdelgawad**
- GitHub: [@habdelgawad1](https://github.com/habdelgawad1)

## 📄 License

This project is developed for educational purposes as part of a Web Development course.

## 🙏 Acknowledgments

- Grand Egyptian Museum for project inspiration
- Web Development course instructors and TAs
- Course peers for testing and feedback

---

**Note**: This frontend requires the corresponding backend API to be running. Please refer to the backend repository for setup instructions.

**Backend Repository**: [Museum-Ticketing-System-Backend](https://github.com/habdelgawad1/Museum-Ticketing-System-Backend)

## 📞 Support

For questions or issues:
1. Check the Troubleshooting section above
2. Review backend API documentation
3. Contact course instructor or TA
