# 🎓 Skill Script - Complete Learning Management System

A full-stack EdTech platform built with React, Node.js, and MongoDB. This platform enables students to enroll in courses, instructors to create and manage courses, and admins to oversee the entire platform.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Running the Project](#-running-the-project)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Features Overview](#-features-overview)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

## ✨ Features

### For Students
- 🔐 Secure authentication with OTP verification
- 📚 Browse and search courses
- 🛒 Shopping cart functionality
- 💳 Payment integration with Razorpay
- 📹 Video course playback with progress tracking
- ⭐ Rate and review courses
- 📊 Track learning progress
- 👤 Profile management

### For Instructors
- 🎓 Create and manage courses
- 📝 Multi-step course creation wizard
- 🎬 Upload course videos and thumbnails
- 📈 Instructor analytics dashboard
- 📊 View course statistics
- ✏️ Edit and update courses

### For Admins
- 👥 User management
- 📚 Course moderation (approve/publish courses)
- 🏷️ Category management
- 📊 Platform-wide analytics
- 🔍 View all courses (published & draft)

## 🛠️ Tech Stack

### Frontend
- **React 18.2** - UI library
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications
- **React Hook Form** - Form handling
- **Video-react** - Video player
- **Chart.js** - Data visualization

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Cloudinary** - Media storage
- **Razorpay** - Payment gateway
- **Nodemailer** - Email service
- **Multer** - File upload handling

## 📦 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher recommended, v20 LTS for best compatibility)
- **npm** or **yarn**
- **MongoDB** (local or cloud instance like MongoDB Atlas)
- **Git**

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd EdTech-Complete
   ```

2. **Install client dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Install server dependencies**
   ```bash
   cd ../server
   npm install
   ```

## 🔐 Environment Variables

### Server Environment Variables

Create a `.env` file in the `server` directory:

```env
# Server Configuration
PORT=4002
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database
MONGO_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key

# Cloudinary (Media Storage)
CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLD_THUMBNAIL_FOLDER=thumbnails
CLD_PROFILE_PIC_FOLDER=profile-pics
CLD_LECTURES_FOLDER=lectures
FOLDER_NAME_CLOUDINARY=edtech

# Razorpay (Payment Gateway)
RAZORPAY_KEY=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret

# Email (Nodemailer)
MAIL_HOST=smtp.gmail.com
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password

# Admin
ADMIN_SECRET_KEY=your_admin_secret_key

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
```

### Client Environment Variables

Create a `.env` file in the `client` directory:

```env
REACT_APP_BASE_URL=http://localhost:4002
REACT_APP_RAZORPAY_KEY=your_razorpay_public_key
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

## 🏃 Running the Project

### Development Mode

**Option 1: Run both client and server concurrently**
```bash
cd client
npm run con
```

**Option 2: Run separately**

Terminal 1 - Start the server:
```bash
cd server
npm run dev
```

Terminal 2 - Start the client:
```bash
cd client
npm start
```

### Production Build

**Build the client:**
```bash
cd client
npm run build
```

**Build and run the server:**
```bash
cd server
npm run start:prod
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:4002

## 📁 Project Structure

```
EdTech-Complete/
├── client/                 # React frontend application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── Auth/      # Authentication components
│   │   │   ├── DashBoard/ # Dashboard components
│   │   │   ├── Home/      # Home page components
│   │   │   └── ...
│   │   ├── pages/         # Route-level pages
│   │   ├── services/      # API integration layer
│   │   ├── toolkit/       # Redux state management
│   │   ├── utils/         # Utility functions
│   │   └── assets/        # Images, videos, logos
│   └── package.json
│
├── server/                # Node.js backend application
│   ├── src/
│   │   ├── config/       # Configuration files
│   │   ├── controllers/  # Business logic
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # API routes
│   │   ├── middlewares/  # Custom middlewares
│   │   ├── utils/        # Helper functions
│   │   └── mail/         # Email templates
│   └── package.json
│
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/v1/auth/sendOtp` - Send OTP for email verification
- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/resetPasswordToken` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password
- `POST /api/v1/auth/google` - Google OAuth authentication

### Courses
- `GET /api/v1/course/getAllCourses-published` - Get all published courses
- `GET /api/v1/course/getCourseDetails` - Get course details
- `POST /api/v1/course/createCourse` - Create new course (Instructor)
- `PUT /api/v1/course/editCourse` - Edit course (Instructor)
- `DELETE /api/v1/course/deleteCourse` - Delete course (Instructor)

### Profile
- `GET /api/v1/profile/getUserDetails` - Get user profile
- `PUT /api/v1/profile/updateProfile` - Update profile
- `PUT /api/v1/profile/updateDisplayPicture` - Update profile picture
- `GET /api/v1/profile/getEnrolledCourses` - Get enrolled courses (Student)

### Payments
- `POST /api/v1/payment/capturePayment` - Create payment order
- `POST /api/v1/payment/verifyPayment` - Verify payment

### Categories
- `GET /api/v1/category/showAllCategories` - Get all categories
- `POST /api/v1/category/createCategory` - Create category (Admin)
- `DELETE /api/v1/category/deleteCategory` - Delete category (Admin)

## 🎯 Features Overview

### Authentication & Authorization
- JWT-based authentication with refresh tokens
- Role-based access control (Student, Instructor, Admin)
- OTP verification for email
- Password reset functionality
- Google OAuth integration

### Course Management
- Multi-step course creation wizard
- Section and subsection management
- Video upload and streaming
- Course thumbnail upload
- Course status (Draft/Published)
- Course rating and reviews

### Payment Integration
- Razorpay payment gateway
- Shopping cart functionality
- Multiple course purchase
- Payment verification
- Email notifications on payment success

### Media Management
- Cloudinary integration for media storage
- Image and video upload
- Automatic file optimization

### Analytics
- Instructor dashboard with statistics
- Admin dashboard with platform metrics
- Course progress tracking
- Student enrollment statistics

## 📸 Screenshots

_Add screenshots of your application here_

## 🐛 Known Issues

- Node.js v25 compatibility issue with `buffer-equal-constant-time` (use Node.js v20 LTS for best compatibility)
- Some security vulnerabilities in dependencies (run `npm audit fix`)

## 🔮 Future Enhancements

- [ ] Add delete all options in sections/courses/subsection
- [ ] Delete courses from categories
- [ ] Show category name instead of category ID in frontend
- [ ] Add filtering for courses
- [ ] Implement nested routes (allCourse/courseId/sectionId/subSectionId)
- [ ] Add unit and integration tests
- [ ] Implement code splitting for better performance
- [ ] Add API rate limiting
- [ ] Add Redis caching layer

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👤 Author

**Raj Chhalotre**

- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- Thanks to all the open-source libraries and frameworks that made this project possible
- Special thanks to the React and Node.js communities

---

**Note**: Make sure to set up all environment variables before running the application. Refer to the [Environment Variables](#-environment-variables) section for details.
