# 📚 Homework Management System

A modern web-based homework management system built with Next.js 15, designed for educational institutions to streamline homework submission, review, and tracking processes.

## 🌟 Overview

The Homework Management System provides a comprehensive platform for students and teachers to manage homework assignments efficiently. Students can submit their work, track progress, and receive feedback, while teachers can review submissions, provide grades, and monitor student performance.

## ✨ Key Features

### 👨‍🎓 Student Features
- **Homework Submission**: Submit assignments with text content and file attachments
- **Progress Tracking**: Monitor submission status and grades
- **Subject Management**: View and filter assignments by subject
- **Search & Sort**: Find assignments quickly with advanced filtering
- **Dashboard Analytics**: Visual representation of academic performance

### 👩‍🏫 Teacher Features
- **Assignment Review**: Review and grade student submissions
- **Feedback System**: Provide detailed feedback on assignments
- **Student Management**: Track student progress across subjects
- **Bulk Operations**: Manage multiple assignments efficiently
- **Analytics Dashboard**: Comprehensive overview of class performance

### 🔐 Security & Authentication
- **Role-based Access Control**: Student, Teacher, and Admin roles
- **Secure Authentication**: NextAuth.js with session management
- **Data Validation**: Server-side and client-side validation
- **Protected Routes**: Secure access to sensitive areas

## 🛠 Technology Stack

### **Frontend Technologies**
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe JavaScript for better development experience
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Shadcn/ui**: Modern UI component library
- **Lucide React**: Beautiful icon library
- **React Hook Form**: Efficient form handling and validation

### **Backend Technologies**
- **Next.js API Routes**: Server-side API endpoints
- **NextAuth.js**: Authentication and session management
- **Prisma ORM**: Type-safe database access and migrations
- **PostgreSQL**: Relational database for data storage
- **bcryptjs**: Password hashing and security

### **Development Tools**
- **Git**: Version control system
- **GitHub**: Code repository and collaboration
- **ESLint**: Code linting and quality assurance
- **Prettier**: Code formatting
- **TypeScript Compiler**: Type checking and compilation
- **Prisma Studio**: Database management interface

### **Deployment & Infrastructure**
- **Vercel**: Deployment platform (recommended)
- **Docker**: Containerization support
- **Environment Variables**: Configuration management
- **Database Migrations**: Automated schema updates

## 🚀 Getting Started

### Prerequisites

Before running the application, ensure you have the following installed:

- **Node.js** (version 18.0 or higher)
- **npm** or **yarn** package manager
- **PostgreSQL** database (local or cloud)
- **Git** for version control

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/homework-system.git
   cd homework-system
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Database Configuration
   DATABASE_URL="postgresql://username:password@localhost:5432/homework_db"
   
   # NextAuth Configuration
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   
   # Optional: External Authentication Providers
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate dev
   
   # Seed the database (optional)
   npm run seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Access the Application**
   
   Open your browser and navigate to: `http://localhost:3000`

### 🗃 Database Schema

The system uses the following main entities:

- **Users**: Student and teacher accounts with role-based access
- **Subjects**: Academic subjects managed by teachers
- **Homework**: Assignment submissions with status tracking
- **Attachments**: File uploads associated with homework

### 📝 API Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/register` - User registration

#### Homework Management
- `GET /api/homework` - Fetch homework with filters
- `POST /api/homework` - Create new homework submission
- `GET /api/homework/[id]` - Get specific homework
- `PATCH /api/homework/[id]` - Update homework
- `DELETE /api/homework/[id]` - Delete homework
- `PATCH /api/homework/[id]/review` - Review homework (teachers)

#### Subjects
- `GET /api/subjects` - Fetch all subjects
- `GET /api/subjects/[id]` - Get specific subject

#### Users
- `GET /api/users` - Fetch users
- `GET /api/users/[id]` - Get specific user
- `GET /api/stats/[userId]` - Get user statistics

## 🎯 Usage Guide

### For Students

1. **Register/Login**: Create an account or login with existing credentials
2. **Submit Homework**: Navigate to "Submit Homework" and fill out the form
3. **Track Progress**: Use "Submitted Works" to monitor assignment status
4. **View Dashboard**: Check analytics and recent activity

### For Teachers

1. **Login**: Access the system with teacher credentials
2. **Review Assignments**: Use "Pending Reviews" to grade submissions
3. **Provide Feedback**: Add comments and grades to student work
4. **Monitor Progress**: Use the dashboard to track class performance

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `NEXTAUTH_URL` | Application URL | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Authentication secret | Required |

### Database Configuration

The application uses Prisma for database management. Configuration is stored in `prisma/schema.prisma`.

## 🧪 Testing

Run the development server and test the following features:

1. **User Registration/Login**
2. **Homework Submission**
3. **Assignment Review**
4. **Search and Filtering**
5. **Dashboard Analytics**

## 📦 Deployment

### Vercel Deployment (Recommended)

1. **Connect GitHub Repository**
2. **Configure Environment Variables**
3. **Deploy Automatically**

### Docker Deployment

```bash
# Build the Docker image
docker build -t homework-system .

# Run the container
docker run -p 3000:3000 homework-system
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📋 Project Structure

```
homework-system/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Protected dashboard pages
│   ├── login/            # Authentication pages
│   └── register/
├── components/            # Reusable UI components
├── lib/                  # Utilities and configurations
├── prisma/               # Database schema and migrations
├── public/               # Static assets
└── scripts/              # Database seeding scripts
```

## 🔒 Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **Session Management**: NextAuth.js with secure cookies
- **Input Validation**: Server-side and client-side validation
- **SQL Injection Prevention**: Prisma ORM with parameterized queries
- **XSS Protection**: React's built-in XSS prevention

## 📊 Performance Optimizations

- **Database Connection Pooling**: Singleton Prisma client
- **React Optimization**: useMemo and useCallback hooks
- **Code Splitting**: Next.js automatic code splitting
- **Static Generation**: ISR for improved performance

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check DATABASE_URL in .env.local
   - Ensure PostgreSQL is running
   - Verify database credentials

2. **Authentication Issues**
   - Check NEXTAUTH_SECRET is set
   - Verify NEXTAUTH_URL matches your domain

3. **Build Errors**
   - Run `npm install` to update dependencies
   - Check for TypeScript errors
   - Ensure all environment variables are set

## 📞 Support

For support and questions:

- Create an issue on GitHub
- Check the documentation
- Review the troubleshooting section

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** for the amazing React framework
- **Prisma Team** for the excellent ORM
- **Vercel** for hosting and deployment solutions
- **Shadcn** for beautiful UI components
- **Open Source Community** for invaluable resources and inspiration

---

**Built with ❤️ using modern web technologies**
