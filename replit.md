# Overview

This is a PDF processing web application called "sPdfHub" that provides various PDF manipulation tools. The application allows users to upload PDF files and perform operations like merging, splitting, and compressing PDFs directly in the browser. It's built as a full-stack application with a React frontend and Express backend, designed to handle PDF processing tasks with a modern, user-friendly interface.

# User Preferences

Preferred communication style: Simple, everyday language.
Deployment platform: Netlify (configured for static hosting)
AdSense integration: Prepared with placeholder ad spaces and ads.txt file

# System Architecture

## Frontend Architecture
The frontend is built with React and TypeScript, using a component-based architecture with the following key decisions:

- **UI Framework**: Uses shadcn/ui components built on top of Radix UI primitives for consistent, accessible design
- **Routing**: Implements client-side routing with Wouter for lightweight navigation
- **State Management**: Uses React Query (@tanstack/react-query) for server state management and built-in React hooks for local state
- **Styling**: Tailwind CSS with custom CSS variables for theming and design consistency
- **PDF Processing**: Client-side PDF manipulation using pdf-lib library for operations like merge, split, and compress

## Backend Architecture
The backend follows a REST API pattern with Express.js:

- **Framework**: Express.js with TypeScript for type safety
- **Storage Interface**: Abstracted storage layer with in-memory implementation (MemStorage) and interface for future database integration
- **Development Setup**: Vite integration for hot module replacement during development
- **Build Process**: ESBuild for production bundling

## Data Storage Solutions
The application uses a flexible storage architecture:

- **Database ORM**: Drizzle ORM configured for PostgreSQL with schema definitions for users and processed files
- **Current Implementation**: In-memory storage for development with interface designed for easy database migration
- **Schema Design**: Includes user management, file processing tracking, and premium feature support

## Authentication and Authorization
The application is prepared for user authentication:

- **User Schema**: Includes username, email, password fields with premium user support
- **Session Management**: Uses connect-pg-simple for PostgreSQL session storage
- **Security**: Prepared for password hashing and secure session handling

## External Service Integrations
The application is designed to be self-contained with minimal external dependencies:

- **PDF Processing**: Client-side processing using pdf-lib to avoid server load and privacy concerns
- **Database**: Neon Database serverless PostgreSQL for scalable data storage
- **Development Tools**: Replit-specific integrations for development environment

The architecture prioritizes client-side processing for PDF operations to reduce server load and ensure user privacy, while maintaining a scalable backend structure for user management and file tracking.

## Netlify Deployment Configuration

The application has been optimized for Netlify deployment with the following setup:

- **Build Configuration**: Uses Vite for client-side build with optimized chunking
- **Static Files**: Includes robots.txt, sitemap.xml, ads.txt for SEO and AdSense
- **SPA Routing**: Configured with _redirects file for proper client-side routing
- **Security Headers**: Implemented via netlify.toml for enhanced security
- **SEO Optimization**: Complete meta tags, Open Graph, and structured data
- **Performance**: Code splitting, font optimization, and caching headers
- **AdSense Ready**: Placeholder ad spaces and configuration for Google AdSense integration

## Recent Changes (January 2025)

- ✅ Configured application for Netlify static hosting deployment
- ✅ Added comprehensive SEO optimization with meta tags and structured data
- ✅ Implemented Google AdSense preparation with ads.txt and placeholder ad spaces
- ✅ Created deployment documentation and build scripts
- ✅ Fixed PDF-lib rotation API compatibility issues
- ✅ Enhanced responsive design for mobile and desktop
- ✅ Added Font Awesome icons for better visual consistency