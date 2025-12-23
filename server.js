require('dotenv').config();
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const DATABASE_PATH = process.env.DATABASE_PATH || './music_app.db';

// Middleware
app.use(express.json());
app.use(express.static('.'));
app.use('/api', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
});

// Database setup
const db = new sqlite3.Database(DATABASE_PATH);

// Initialize database tables
db.serialize(() => {
    // Users table
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // User symbol URLs table - stores all URLs permanently for each user
    db.run(`
        CREATE TABLE IF NOT EXISTS user_symbol_urls (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            url TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
    `);

    // User saved symbols table - tracks saved state for each user
    db.run(`
        CREATE TABLE IF NOT EXISTS user_saved_symbols (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            symbol_count INTEGER NOT NULL DEFAULT 0,
            saved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
    `);
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

// Add URL to user's permanent collection
app.post('/api/user/add-url', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const { url } = req.body;
    
    if (!url) {
        return res.status(400).json({ error: 'URL required' });
    }
    
    // Validate URL
    try {
        new URL(url);
    } catch (e) {
        return res.status(400).json({ error: 'Invalid URL' });
    }
    
    db.run(
        'INSERT INTO user_symbol_urls (user_id, url) VALUES (?, ?)',
        [userId, url],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to add URL' });
            }
            
            res.json({ message: 'URL added successfully', url });
        }
    );
});

// Get all user URLs (for symbol assignment)
app.get('/api/user/urls', authenticateToken, (req, res) => {
    const userId = req.user.id;
    
    db.all(
        'SELECT id, url FROM user_symbol_urls WHERE user_id = ?',
        [userId],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            
            res.json({ urls: rows });
        }
    );
});

// Restore all symbols (clear user's URLs and saved state)
app.post('/api/restore-symbols', authenticateToken, (req, res) => {
    const userId = req.user.id;
    
    db.serialize(() => {
        db.run('DELETE FROM user_symbol_urls WHERE user_id = ?', [userId], function(err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to clear URLs' });
            }
            
            db.run('DELETE FROM user_saved_symbols WHERE user_id = ?', [userId], function(err2) {
                if (err2) {
                    return res.status(500).json({ error: 'Failed to clear saved symbols' });
                }
                
                res.json({ message: 'All symbols restored successfully' });
            });
        });
    });
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
    res.sendFile(path.join(__dirname, 'music_page.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Music app server running on http://localhost:${PORT}`);
    console.log(`Total music symbols available: ${allSymbols.length}`);
});
