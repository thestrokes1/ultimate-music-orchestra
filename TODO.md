# Music Symbols Global URLs Implementation Plan

## Current Problem Analysis
- **Issue 1**: Visitors see no green symbols when opening the page
- **Issue 2**: Each user has private URLs (not shared)
- **Issue 3**: Login required to see symbols (should only be required to ADD symbols)
- **Issue 4**: No global shared pool of URLs for everyone

## Required Changes

### 1. Frontend Changes (music_script.js)
- ✅ `loadGlobalUrls()` function already exists
- ❌ Not called on page load - FIX: Call immediately after DOMContentLoaded
- ❌ Add URL button adds to user private URLs - FIX: Add to global pool
- ❌ Restore function uses user URLs - FIX: Use global URLs
- ❌ Statistics show user URLs - FIX: Show global URL counts

### 2. Backend Changes (server.js)
- ✅ `global_urls` table exists
- ✅ `/api/urls/public` endpoint exists
- ✅ `/api/add-url` should add to global pool instead of user pool
- ❌ Some endpoints still reference user_symbol_urls - FIX: Update to use global_urls

### 3. Database Changes
- ✅ `global_urls` table already exists with proper structure
- ✅ No changes needed - table is ready for use

## Implementation Steps

### Step 1: Fix Frontend Loading
- Make `loadGlobalUrls()` call immediately on page load
- Remove authentication requirement for viewing symbols
- Update statistics to show global counts

### Step 2: Fix Add URL Functionality  
- Change `/api/user/add-url` to `/api/add-url` (global)
- Remove authentication requirement for adding to global pool
- Update button logic to not require login for viewing

### Step 3: Fix Restore Functionality
- Update restore to work with global URLs
- Make it available to all users (not just authenticated)

### Step 4: Update Statistics Display
- Show total global URLs count
- Show current green symbols (from global URLs)
- Show available symbols

## Expected Result
- **Visitors**: See green symbols immediately, cannot add URLs
- **Logged-in Users**: See green symbols + can add URLs to global pool
- **Global Pool**: URLs added by any user visible to everyone
- **No Login Required**: For viewing existing green symbols

