Music Symbols Animation & URL Management App

The music page is an interactive web application featuring 300 unique music symbols that users can animate and interact with. Key functionality includes:

Core Features:

Interactive Music Symbols: 300 animated music symbols (♫, ♬, ♩, 𝄞, etc.) that users can click and interact with
User Authentication: Secure login/registration system with JWT tokens and bcrypt password hashing
URL-to-Symbol Mapping: Users can input URLs and assign them to music symbols, with assigned symbols turning green
Persistent Storage: User progress, saved symbols, and URL collections are stored in SQLite database
Symbol Statistics: Real-time tracking of available symbols, user progress, and collection statistics
Save/Restore System: Users can save their current symbol assignments and restore/clear their data when needed
User Experience:

Users register or login to access the full functionality
They see a control panel to add URLs and manage their symbol assignments
Each URL added creates a permanent symbol assignment (turning it green)
Users can save their progress and restore their symbol collection
The interface provides real-time statistics about their symbol usage
Purpose:
The app essentially creates a personal music symbol gallery where users can assign meaningful URLs (like favorite songs, playlists, or music-related links) to beautiful animated music symbols, creating a personalized and interactive music-themed experience.