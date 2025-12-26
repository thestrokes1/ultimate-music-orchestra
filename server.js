require('dotenv').config();
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const DATABASE_PATH = process.env.DATABASE_PATH || path.join(__dirname, 'music_app.db');


// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


// Enhanced CORS configuration
app.use('/api', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    next();
});

// Database setup
const db = new sqlite3.Database(DATABASE_PATH);

// Initialize database tables
db.serialize(() => {
    console.log('📁 Initializing database tables...');
    
    // Users table
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) console.error('❌ Error creating users table:', err);
        else console.log('✅ Users table ready');
    });

    // User symbol URLs table - stores all URLs permanently for each user
    db.run(`
        CREATE TABLE IF NOT EXISTS user_symbol_urls (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            url TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
    `, (err) => {
        if (err) console.error('❌ Error creating user_symbol_urls table:', err);
        else console.log('✅ User symbol URLs table ready');
    });

    // User saved symbols table - tracks saved state for each user
    db.run(`
        CREATE TABLE IF NOT EXISTS user_saved_symbols (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            symbol_count INTEGER NOT NULL DEFAULT 0,
            saved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
    `, (err) => {
        if (err) console.error('❌ Error creating user_saved_symbols table:', err);
        else console.log('✅ User saved symbols table ready');
    });

    // GLOBAL URLs table (shared by everyone)
    db.run(`
        CREATE TABLE IF NOT EXISTS global_urls (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url TEXT UNIQUE NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) console.error('❌ Error creating global_urls table:', err);
        else console.log('✅ Global URLs table ready');
        
        // Check if table exists and has data
        db.all('SELECT COUNT(*) as count FROM global_urls', [], (err, rows) => {
            if (err) {
                console.error('❌ Error checking global_urls table:', err);
            } else {
                console.log(`🌍 Global URLs table has ${rows[0].count} URLs`);
            }
        });
    });

});

// Generate 300 unique music symbols
const musicSymbols = [
    // Basic Musical Notation Symbols
    '♫', '♬', '♪', '♩', '𝄞', '♭', '♮', '♯', 
    '𝄡', '𝄢', '𝄪', '𝄫', '𓏢', '𝄤', '𝄥', '𝄦', '𝄧', '𝄨', '𝄩', '𝄪', '𝄫', '𝄬', '𝄭', '𝄮', '𝄯', '𝄰', '𝄱', '𝄲', '𝄳',
    
    // Extended Musical Symbols Collection
    '𝅘𝅥𝅯', '𝅘𝅥𝅰', '𝅘𝅥𝅱', '𝅘𝅥𝅲', '𝅘𝅥𝅮', '𝅘𝅥𝅭', '𝅘𝅥𝅮𝅯', '𝆕𝆖𝆕𝆖', '𝆕𝆖𝆕', '𝆖𝆕𝆖', '𝆕𝆖', '𝆖', '𝇁', '𝇂', '𝇃', '𝇄', '𝇅', '𝇆', '𝇇', '𝇈', '𝇉', '𝇊', '𝇍', '𝇎', '𝇏', '𝇐', '𝇑', '𝇴', '𝇓', '𝇔', '𝇕', '𝇖',
    
    // Ancient Musical Symbols
    '𝄾', '𝄿', '𝅀', '𝅁', '𝅂', '𝅃', '𝅄', '𝅅', '𝅆', '𝅇', '𝅈', '𝅉', '𝅊', '𝅋', '𝅌', '𝅍', '𝅎', '𝅏', '𝅐', '𝅑', '𝅒', '𝅓', '𝅔', '𝅕', '𝅖', '𝅗', '𝅘', '𝅙', '𝅚', '𝅛', '𝅜', '𝅝',
    
    // Rhythm and Timing Symbols
    '𝄆', '𝄇', '𝄈', '𝄉', '𝄊', '𝄋', '𝄌', '𝄍', '𝄎', '𝄏', '𝄐', '𝄑', '𝄒', '𝄓', '𝄔', '𝄕', '𝄖', '𝄗', '𝄘', '𝄙',
    
    // Additional Staff and Clef Symbols
    '𝄢', '𝄣', '𝄤', '𝄥', '𝄦', '𝄧', '𝄨', '𝄩', '𝄪', '𝄫', '𝄬', '𝄭', '𝄮', '𝄯', '𝄰', '𝄱', '𝄲', '𝄳',
    
    // Modern Musical Notation Extensions
    '𝅗𝅥', '𝆑', '𝆒', '𝆓', '𝆔', '𝆕', '𝆖', '𝆗', '𝆘', '𝆙', '𝆚', '𝆛', '𝆜', '𝆝', '𝆞', '𝆟', '𝆺𝅥𝅯', '𝅸', '𝅹', '𝅺', '𝅻', '𝅼', '𝅽', '𝅾', '𝅿', '𝆀', '𝆁', '𝆂', '𝆃', '𝆄', '𝆅', '𝆆', '𝆇', '𝆈', '𝆉', '𝆊', '𝆋'
];

// Generate enough unique symbols to reach 300
const allSymbols = [];
for (let i = 0; i < 300; i++) {
    if (i < musicSymbols.length) {
        allSymbols.push(musicSymbols[i]);
    } else {
        // Repeat symbols to reach 300
        const baseIndex = i % musicSymbols.length;
        allSymbols.push(musicSymbols[baseIndex]);
    }
}

// Authentication middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
}

// Routes

// Register
app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }

        if (username.length < 3) {
            return res.status(400).json({ error: 'Username must be at least 3 characters' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        db.run(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, hashedPassword],
            function(err) {
                if (err) {
                    console.error('Registration error:', err);
                    if (err.message.includes('UNIQUE constraint failed')) {
                        return res.status(400).json({ error: 'Username already exists' });
                    }
                    return res.status(500).json({ error: 'Registration failed: ' + err.message });
                }
                
                const userId = this.lastID;
                const token = jwt.sign({ id: userId, username: username }, JWT_SECRET, { expiresIn: '24h' });
                
                console.log('User registered successfully:', username);
                res.status(201).json({
                    message: 'Registration successful',
                    token,
                    user: { id: userId, username }
                });
            }
        );
    } catch (error) {
        console.error('Server error during registration:', error);
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }

        db.get(
            'SELECT * FROM users WHERE username = ?',
            [username],
            async (err, user) => {
                if (err) {
                    console.error('Database error during login:', err);
                    return res.status(500).json({ error: 'Database error' });
                }
                
                if (!user) {
                    console.log('Login attempt for non-existent user:', username);
                    return res.status(401).json({ error: 'Invalid credentials' });
                }

                const validPassword = await bcrypt.compare(password, user.password);
                
                if (!validPassword) {
                    console.log('Invalid password for user:', username);
                    return res.status(401).json({ error: 'Invalid credentials' });
                }

                const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
                
                console.log('User logged in successfully:', username);
                res.json({
                    message: 'Login successful',
                    token,
                    user: { id: user.id, username: user.username }
                });
            }
        );
    } catch (error) {
        console.error('Server error during login:', error);
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
});

// Get user's saved symbols count (last saved state)
app.get('/api/user/symbols', authenticateToken, (req, res) => {
    const userId = req.user.id;
    
    db.get(
        'SELECT symbol_count, saved_at FROM user_saved_symbols WHERE user_id = ? ORDER BY saved_at DESC LIMIT 1',
        [userId],
        (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            
            res.json({
                savedSymbolCount: row ? row.symbol_count : 0,
                lastSaved: row ? row.saved_at : null
            });
        }
    );
});

// Save current symbols (persist user's current state)
app.post('/api/user/save-symbols', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const { symbolCount } = req.body;
    
    if (typeof symbolCount !== 'number' || symbolCount < 0 || symbolCount > 300) {
        return res.status(400).json({ error: 'Invalid symbol count' });
    }
    
    db.run(
        'INSERT INTO user_saved_symbols (user_id, symbol_count) VALUES (?, ?)',
        [userId, symbolCount],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Save failed' });
            }
            
            res.json({ message: 'Symbols saved successfully', symbolCount });
        }
    );
});

// Add URL to GLOBAL pool (visible to everyone)
app.post('/api/add-url', authenticateToken, (req, res) => {
    const { url } = req.body;
    console.log('🔗 Adding URL to global pool:', url);

    if (!url) {
        console.log('❌ No URL provided');
        return res.status(400).json({ error: 'URL required' });
    }

    try {
        new URL(url);
        console.log('✅ URL validation passed');
    } catch {
        console.log('❌ Invalid URL format');
        return res.status(400).json({ error: 'Invalid URL' });
    }

    db.run(
        'INSERT OR IGNORE INTO global_urls (url) VALUES (?)',
        [url],
        function (err) {
            if (err) {
                console.error('❌ Database error adding URL:', err);
                return res.status(500).json({ error: 'Failed to add URL: ' + err.message });
            }
            
            console.log('✅ URL added to global pool successfully');
            console.log('📊 Insert result - Changes:', this.changes, 'LastID:', this.lastID);
            
            // Verify the URL was actually added by checking the table
            db.get('SELECT COUNT(*) as total FROM global_urls', [], (err, row) => {
                if (!err) {
                    console.log('🌍 Total URLs in global pool now:', row.total);
                }
            });
            
            res.json({ 
                message: 'URL added to global pool', 
                url,
                changes: this.changes 
            });
        }
    );
});




// Global URLs system - no user-specific endpoints needed anymore
// All URLs are now shared globally for everyone

// Simple test endpoint for debugging
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working', timestamp: new Date().toISOString() });
});

// 🌍 PUBLIC: Get all global URLs (no auth)
app.get('/api/urls/public', (req, res) => {
    db.all(
        'SELECT id, url FROM global_urls ORDER BY id ASC LIMIT 300',
        [],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ urls: rows });
        }
    );
});

// Get global symbol statistics
app.get('/api/symbols', authenticateToken, (req, res) => {
    const userId = req.user.id;
    
    db.serialize(() => {
        // Get user's saved symbols count
        db.get(
            'SELECT symbol_count FROM user_saved_symbols WHERE user_id = ? ORDER BY saved_at DESC LIMIT 1',
            [userId],
            (err, savedRow) => {
                if (err) {
                    return res.status(500).json({ error: 'Database error' });
                }
                
                // Get user's total URLs count
                db.get(
                    'SELECT COUNT(*) as totalUrls FROM user_symbol_urls WHERE user_id = ?',
                    [userId],
                    (err2, urlRow) => {
                        if (err2) {
                            return res.status(500).json({ error: 'Database error' });
                        }
                        
                        res.json({
                            totalSymbols: 300,
                            userSavedSymbols: savedRow ? savedRow.symbol_count : 0,
                            userTotalUrls: urlRow.totalUrls,
                            availableSymbols: 300 - (savedRow ? savedRow.symbol_count : 0)
                        });
                    }
                );
            }
        );
    });
});

// Serve music page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'music_page.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🎵 Music app server running on http://localhost:${PORT}`);
    console.log(`🎼 Total music symbols available: ${allSymbols.length}`);
    console.log('🌍 GLOBAL URL SYSTEM: URLs are shared by everyone!');
    console.log('🔗 Add URL endpoint: POST /api/add-url (requires auth)');
    console.log('📡 Get URLs endpoint: GET /api/urls/public (no auth required)');
    console.log('✅ Server is ready for testing!');
});
