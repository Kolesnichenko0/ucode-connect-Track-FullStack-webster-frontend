# Aurelia Frontend

**Aurelia** is a modern, feature-rich graphic design editor developed as a browser-based platform for quick creation of visuals such as social media posts, banners and invitations. It combines intuitive user interaction with powerful design tools and AI-powered image generation.

## Overview
The **Aurelia** delivers a robust and accessible interface for creating graphic projects in the browser. It allows users to build visual compositions using a wide set of design elements, modify object styles, draw manually, manage canvas settings, and generate AI-based content. Aurelia was created as part of an academic research project with the goal of combining simplicity, performance, and extensibility for creative users of all skill levels.

## Features
- **Project Management**: Create, rename, duplicate, search, or delete projects. Projects can be saved and reopened later for further editing
- **Object-Based Editing**: Add and manipulate objects such as shapes, lines, text blocks, and images directly on the canvas
- **Element Styling**: Customize color, opacity, stroke, and size of shapes. Apply rounded corners and align elements with precision (center, edges, top/bottom)
- **Image Tools**: Upload your own images or choose from a built-in library and Unsplash integration. Apply filters, rotate, flip, or use an image as the canvas background
- **Text Editor**: Add text blocks with support for font selection, size, color, alignment, and text decoration (bold, italic, underline, strikethrough)
- **Drawing Tools**: Freehand draw using brush or erase with an eraser. Control stroke width, color, and transparency
- **AI Image Generation**: Generate illustrations or textures from text prompts
- **Undo/Redo System**: Full step-by-step change tracking with ability to navigate through editing history

## Requirements and Dependencies
- **Modern Browser**: Chrome, Firefox, Safari, or Edge
- **Node.js** (v14+ recommended)
- **Next.js** framework
- **Aurelia Backend API** running and accessible

## Setup Instructions

Ensure the Aurelia Backend is set up and running before starting the frontend.

1. **Clone the Repository**:
   ```bash
   git clone [repository-url]
   cd ucode-connect-Track-FullStack-webster-frontend
   cd webster
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
- **Authentication Pages**: Modern registration and login forms with password validation and email verification. Google OAuth support is also integrated
- **Project Dashboard**: A personal workspace where users can view their saved projects, manage them and create new ones
- **Canvas Editor Layout**:
   - **Left Sidebar**: Main tool navigation: edit info, elements, text, images, image filters and paint
   - **Main Canvas Area**: Interactive stage powered by Konva.js, where all design objects are rendered and manipulated
   - **Right Sidebar**: Displays a scrollable history timeline
   - **Header Bar**: Quick access to save/export, undo/redo, zoom controls and share button
- **Tooltips**: Each feature includes tooltip descriptions

## State Management
The frontend uses React Context API for state management:
- **Auth Context**: User authentication and profile information
- **History Context**: Handles undo/redo logic with change descriptions
- **Theme Context**: Light/dark mode preferences

## Project Editing
Users can create, edit, and save graphic design projects. The system supports:
- Adding and editing shapes, text, and images
- Adjusting object properties: color, font, opacity, stroke
- Drawing manually with tools and customizing style
- Exporting the final image (e.g., PNG)
- Editing project metadata (name, description, background)

## Responsive Design
The application is designed to work across devices:
- **Mobile Layout**: Optimized for smaller screens with touch interactions
- **Tablet View**: Balanced layout for medium-sized screens
- **Desktop Experience**: Full-featured interface for larger displays
- **Dark/Light Modes**: Theme support for different lighting conditions and user preferences