# Pomodoro Timer

## Overview

A web-based Pomodoro Timer application that helps users manage their productivity using the Pomodoro Technique. The application features work sessions, short breaks, and long breaks with visual and audio feedback. It includes customizable timer durations, progress tracking, statistics, and theme switching based on the current session type.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Single Page Application (SPA)**: Pure HTML, CSS, and JavaScript implementation without frameworks
- **Object-Oriented Design**: Main functionality encapsulated in a `PomodoroTimer` class
- **State Management**: Internal state management within the class including timer state, settings, and cycle tracking
- **DOM Manipulation**: Direct DOM element manipulation for UI updates and user interactions

### UI/UX Design Patterns
- **Responsive Design**: CSS flexbox layout with mobile-first approach
- **Theme System**: CSS custom properties (variables) for dynamic theming
- **Mode-Based Styling**: Different color schemes for work sessions, short breaks, and long breaks
- **Progress Visualization**: Animated progress bar showing session completion
- **Real-time Updates**: Live timer display with minute:second format

### Timer Logic Architecture
- **Session Management**: Automatic cycling between work sessions (25 min), short breaks (5 min), and long breaks (15 min)
- **Cycle Tracking**: 4-session work cycles before long breaks
- **Persistent Settings**: Customizable duration settings for all session types
- **Statistics Tracking**: Daily and total completion counters

### Audio System
- **Web Audio API**: Browser-native audio context for generating notification sounds
- **Programmatic Sound Generation**: Runtime audio synthesis without external audio files

### Data Persistence
- **Local Storage**: Browser localStorage for saving user statistics and preferences
- **Session State**: In-memory state management for current timer session

## External Dependencies

### Browser APIs
- **Web Audio API**: For generating notification beeps and audio feedback
- **localStorage API**: For persisting user statistics and settings across sessions
- **requestAnimationFrame**: For smooth progress bar animations and timer updates

### No External Libraries
- **Framework-free**: Pure vanilla JavaScript implementation
- **No Build Process**: Direct browser execution without compilation or bundling
- **No External CSS**: Custom CSS without frameworks like Bootstrap or Tailwind
- **No CDN Dependencies**: Self-contained application with no external resource loading