# Vyasa School Management System - Frontend

A modern, secure school management system built with Next.js, React, and TypeScript.

## 🚀 Features

### Authentication
- **Google OAuth Login** - One-click sign in with Google (no SMS costs!)
- **Mobile OTP Login** - Traditional SMS-based authentication
- **Remember Device** - Auto-login on trusted devices for seamless experience
- **Role-Based Access** - Super Admin, School Admin, Teacher, Parent roles
- **JWT Security** - Secure token-based authentication

### Dashboard Features
- **Multi-Role Dashboards** - Customized views for each user role
- **School Management** - Manage schools, classes, and staff (Super Admin)
- **Student Management** - Track student information and performance
- **Teacher Portal** - Attendance tracking, class management
- **Parent Portal** - View child's progress and announcements
- **Holiday Management** - School calendar and holiday tracking
- **Announcements** - Broadcast messages to school community

### Technical Features
- **Server-Side Rendering** - Fast initial page loads
- **Type Safety** - Full TypeScript coverage
- **React Query** - Efficient data fetching and caching
- **Error Boundaries** - Graceful error handling
- **Responsive Design** - Works on all devices
- **Loading States** - Smooth UX with skeleton screens

---

## 📋 Prerequisites

- Node.js 18+ and npm
- Backend API server running
- Google OAuth credentials (optional, for Google login)

---

## 🔧 Installation

### 1. Clone and Install
```bash
# Clone the repository
git clone <repository-url>
cd vyasa-frontend

# Install dependencies
npm install
```

### 2. Configure Environment Variables
```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local with your configuration
```

**Required variables:**
```env
# Backend API URL
NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.com

# Google OAuth (optional - for Google Sign In)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### 3. Setup Google OAuth (Optional)
For Google Sign In functionality:

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create OAuth 2.0 Client ID
3. Add authorized redirect URIs:
   - Development: `http://localhost:3000/auth/callback/google`
   - Production: `https://your-domain.com/auth/callback/google`
4. Copy Client ID to `.env.local`

**Detailed guide:** See `GOOGLE_OAUTH_QUICKSTART.md`

---

## 🏃 Running the Application

### Development Mode
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### Production Build
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

---

## 🎯 Quick Start

### First-Time Setup
1. ✅ Install dependencies (`npm install`)
2. ✅ Configure `.env.local` with backend URL
3. ✅ (Optional) Set up Google OAuth credentials
4. ✅ Start dev server (`npm run dev`)
5. ✅ Visit `http://localhost:3000/auth/login`

### Testing Authentication
1. **Google Login:** Click "Continue with Google" button
2. **OTP Login:** Enter mobile number, receive OTP
3. **Remember Device:** Check the checkbox for auto-login

---

## 📁 Project Structure

```
vyasa-frontend/
├── app/                          # Next.js app directory
│   ├── auth/                     # Authentication pages
│   │   ├── login/                # Login page
│   │   ├── register/             # Registration page
│   │   ├── verify-otp/           # OTP verification
│   │   └── callback/google/      # Google OAuth callback
│   ├── dashboard/                # Dashboard pages
│   │   ├── super-admin/          # Super admin dashboard
│   │   ├── admin/                # School admin dashboard
│   │   ├── teacher/              # Teacher dashboard
│   │   └── parent/               # Parent dashboard
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── src/
│   ├── components/               # Reusable UI components
│   │   └── ui/                   # Shadcn UI components
│   ├── features/                 # Feature modules
│   │   ├── auth/                 # Authentication logic
│   │   ├── students/             # Student management
│   │   ├── teachers/             # Teacher management
│   │   ├── classes/              # Class management
│   │   ├── attendance/           # Attendance tracking
│   │   ├── holidays/             # Holiday management
│   │   └── announcements/        # Announcements
│   ├── lib/                      # Utility functions
│   │   ├── api.ts                # API client
│   │   ├── env.ts                # Environment config
│   │   ├── storage.ts            # Local storage wrapper
│   │   ├── error-handler.ts     # Error handling
│   │   └── query-client.ts      # React Query setup
│   └── hooks/                    # Custom React hooks
├── public/                       # Static assets
├── .env.example                  # Environment template
└── package.json                  # Dependencies
```

---

## 🔐 Authentication

### Google OAuth Flow
```
User → Click Google Button → Google OAuth → Callback → Dashboard
⏱️ Time: 2-3 seconds
```

### Remember Device Flow
```
Returning User → Auto-Login → Dashboard
⏱️ Time: < 1 second (zero clicks!)
```

### OTP Flow (Mobile)
```
User → Enter Phone → Receive OTP → Enter OTP → Dashboard
⏱️ Time: 10-15 seconds (depends on SMS)
```

**Full documentation:** See `GOOGLE_OAUTH_IMPLEMENTATION.md`

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [VISUAL_SUMMARY.txt](VISUAL_SUMMARY.txt) | Visual overview of implementation |
| [GOOGLE_OAUTH_QUICKSTART.md](GOOGLE_OAUTH_QUICKSTART.md) | Quick reference for OAuth setup |
| [GOOGLE_OAUTH_IMPLEMENTATION.md](GOOGLE_OAUTH_IMPLEMENTATION.md) | Complete OAuth implementation guide |
| [BACKEND_IMPLEMENTATION_GUIDE.md](BACKEND_IMPLEMENTATION_GUIDE.md) | Backend API implementation |
| [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) | Implementation status and checklist |
| [ERROR_HANDLING_GUIDE.md](ERROR_HANDLING_GUIDE.md) | Error handling patterns |
| [SECURITY_ARCHITECTURE.md](SECURITY_ARCHITECTURE.md) | Security best practices |

---

## 🛠️ Technology Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **UI Library:** React 19
- **Styling:** Tailwind CSS 4
- **UI Components:** Radix UI + Shadcn
- **Data Fetching:** TanStack React Query
- **HTTP Client:** Axios
- **Form Handling:** React Hook Form
- **Validation:** Zod
- **Icons:** Lucide React
- **Notifications:** Sonner

---

## 🔒 Security Features

- ✅ OAuth 2.0 authentication
- ✅ JWT token management
- ✅ Device token security
- ✅ Role-based access control
- ✅ XSS protection
- ✅ CSRF protection (via JWT)
- ✅ Secure token storage
- ✅ Automatic token cleanup

**See:** [SECURITY_ARCHITECTURE.md](SECURITY_ARCHITECTURE.md)

---

## 🧪 Testing

### Manual Testing Checklist
```bash
# Authentication
□ Google login works
□ OTP login works
□ Remember device works
□ Auto-login works
□ Logout clears tokens

# Role-Based Access
□ Super Admin can access all features
□ School Admin limited to school
□ Teacher limited to classes
□ Parent limited to child's data

# UI/UX
□ Loading states show
□ Errors display properly
□ Mobile responsive
□ Cross-browser compatible
```

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables on Vercel
1. Go to Project Settings → Environment Variables
2. Add:
   - `NEXT_PUBLIC_API_BASE_URL`
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID`

### Other Platforms
- **Netlify:** Works out of the box
- **AWS Amplify:** Configure build settings
- **Docker:** Included Dockerfile (if needed)

---

## 💡 Tips & Best Practices

### Development
- Use TypeScript strictly - no `any` types
- Follow component structure in `src/components`
- Use React Query for all API calls
- Handle errors with error boundaries
- Add loading states for all async operations

### Performance
- Use Next.js Image component for images
- Implement code splitting for large features
- Use React.memo for expensive components
- Optimize bundle size with tree shaking

### Security
- Never commit `.env.local` to git
- Validate all user inputs
- Sanitize data before rendering
- Use HTTPS in production
- Rotate JWT secrets regularly

---

## 🐛 Troubleshooting

### Common Issues

**Issue:** Google OAuth not working
**Solution:** Check `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set and redirect URIs match

**Issue:** API calls failing
**Solution:** Verify `NEXT_PUBLIC_API_BASE_URL` is correct and backend is running

**Issue:** Auto-login not working
**Solution:** Check device token in localStorage and backend `/auth/device-login` endpoint

**Issue:** CORS errors
**Solution:** Configure backend to allow requests from frontend domain

**See more:** [ERROR_HANDLING_GUIDE.md](ERROR_HANDLING_GUIDE.md)

---

## 📊 Performance Metrics

- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3s
- **Lighthouse Score:** 90+
- **Bundle Size:** < 200KB (gzipped)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is proprietary software for Vyasa School Management System.

---

## 📞 Support

For issues or questions:
1. Check the documentation in the `/docs` folder
2. Review code comments in relevant files
3. Check browser console for errors
4. Contact the development team

---

## 🎉 Recent Updates

### December 2025 - Google OAuth & Remember Device
- ✅ Added Google OAuth login with one-click experience
- ✅ Implemented "Remember Device" for auto-login
- ✅ Enhanced security with device token management
- ✅ Improved UX with loading states and error handling
- ✅ Comprehensive documentation added

---

## 🔗 Links

- [Next.js Documentation](https://nextjs.org/docs)
- [React Query Documentation](https://tanstack.com/query)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)

---

**Built with ❤️ for schools by the Vyasa team**

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
