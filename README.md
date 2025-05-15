# AndCook - Recipe Sharing Platform

AndCook is a modern recipe sharing platform built with Next.js, MongoDB, and Tailwind CSS.

## Features

- User authentication with NextAuth
- Recipe creation, browsing, and searching
- User profiles with saved recipes
- Recipe ratings and reviews
- Dark/light mode toggle with animated food-themed navigation
- Responsive design
- Admin dashboard
- Contact form

## Deployment to Vercel

### Prerequisites

1. A MongoDB Atlas database
2. A Vercel account
3. Gmail account for the contact form (with App Password)

### Steps to Deploy

1. Fork or clone this repository
2. Create a new project on Vercel
3. Connect your GitHub repository to Vercel
4. Add the following environment variables in Vercel:

```
MONGODB_URI=mongodb+srv://your-mongodb-connection-string
NEXTAUTH_URL=https://your-vercel-deployment-url.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret-key
EMAIL_USER=your-gmail-address@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
```

5. Deploy the project

### Important Notes

- For the `NEXTAUTH_URL`, use the URL of your Vercel deployment (you can update this after the first deployment)
- For the `NEXTAUTH_SECRET`, generate a secure random string (you can use `openssl rand -base64 32` in a terminal)
- For the email functionality, you need to use a Gmail App Password, not your regular Gmail password

## Local Development

1. Clone the repository
2. Install dependencies with `npm install`
3. Create a `.env.local` file with the required environment variables
4. Run the development server with `npm run dev`

## Environment Variables

```
# Database
MONGODB_URI=mongodb+srv://your-mongodb-connection-string

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key

# Email configuration for contact form
EMAIL_USER=your-gmail-address@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
```

## Admin Access

The email `lukafartenadze2004@gmail.com` is automatically granted admin privileges.
