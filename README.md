# UEvent Frontend

**UEvent** is a modern, feature-rich event management platform designed to help organizers create, manage, and promote events while providing attendees with a seamless registration experience. The frontend delivers an intuitive user interface that connects seamlessly with the UEvent backend API.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Requirements and Dependencies](#requirements-and-dependencies)
- [Setup Instructions](#setup-instructions)
- [User Interface](#user-interface)
- [State Management](#state-management)
- [Event Management](#event-management)
- [Responsive Design](#responsive-design)
- [Screenshots](#screenshots)

## Overview
The **UEvent Frontend** offers a comprehensive and user-friendly interface for event management. It enables organizers to create and manage events, while allowing attendees to discover, register for, and track events they're interested in. The application focuses on delivering a smooth user experience with intuitive event browsing, seamless ticket purchasing, and robust organizer tools.

## Features
- **Event Discovery**: Browse events with filtering and search capabilities
- **Event Registration**: Purchase tickets with promo code support
- **Attendee Management**: View and manage event attendees
- **Event Creation**: Intuitive interface for creating and editing events
- **Company Profiles**: Organization pages with all their events
- **Promo Codes**: Create and apply discount codes for events
- **User Profiles**: Personal dashboards for event management
- **Responsive Design**: Works on mobile, tablet, and desktop devices
- **News & Updates**: Event-specific news announcements
- **Social Features**: View other attendees and manage visibility

## Requirements and Dependencies
- **Modern Browser**: Chrome, Firefox, Safari, or Edge
- **Node.js** (v14+ recommended)
- **Next.js** framework
- **UEvent Backend API** running and accessible

## Setup Instructions

Ensure the UEvent Backend is set up and running before starting the frontend.

1. **Clone the Repository**:
   ```bash
   git clone [repository-url]
   cd ucode-connect-Track-FullStack-uevent-frontend
   cd uevent
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```


3. **Start the Development Server**:
   ```bash
   npm run dev
   ```

## User Interface
The application features a clean, modern interface with:
- **Navigation Header**: Access to user profile, events, and search
- **Event Cards**: Visual representation of events with key information
- **Event Details**: Comprehensive view of event information
- **Ticket Purchase Modal**: Streamlined interface for buying tickets
- **Attendee Display**: View other attendees with privacy controls
- **Company Profiles**: Dedicated pages for event organizers
- **User Dashboard**: Personal event management and tickets

## State Management
The frontend uses React Context API for state management:
- **Auth Context**: User authentication and profile information
- **Event Context**: Event data, filtering, and management functions
- **Order Context**: Ticket purchasing and order management
- **PromoCode Context**: Promo code validation and application
- **Company Context**: Company information and related events
- **Notification Context**: System-wide alerts and messages
- **Subscription Context**: Event subscription management
- **Theme Context**: Light/dark mode preferences

## Event Management
Organizers can manage events through:
- **Event Creation**: Detailed forms for creating event listings
- **Ticket Management**: Create and manage ticket types and availability
- **Attendee Management**: View and manage event participants
- **News Updates**: Post and manage event-specific announcements
- **Promo Codes**: Create and distribute discount codes
- **Event Statistics**: Track registrations and attendance

## Responsive Design
The application is designed to work across devices:
- **Mobile Layout**: Optimized for smaller screens with touch interactions
- **Tablet View**: Balanced layout for medium-sized screens
- **Desktop Experience**: Full-featured interface for larger displays
- **Dark/Light Modes**: Theme support for different lighting conditions and user preferences