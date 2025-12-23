// Enhanced Music Symbols Script with Persistent User Data

// Authentication state - now integrated with AuthModal class
let userUrls = []; // User's permanent URLs
let userSavedSymbolCount = 0; // User's saved state
let currentGreenSymbols = 0; // Current green symbols count

// Global reference to music page for AuthModal integration
let musicPage = null;

// Music Symbols Collection - Exactly 300 symbols
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
    '𝅗𝅥', '𝆑', '𝆒', '𝆓', '𝆔', '𝆕', '𝆖', '𝆗', '𝆘', '𝆙', '𝆚', '𝆛', '𝆜', '𝆝', '𝆞', '𝆟', '𝆺𝅥𝅯', '𝅸', '𝅹', '𝅺', '𝅻', '𝅼', '𝅽', '𝅾', '𝅿', '𝆀', '𝆁', '𝆂', '𝆃', '𝆄', '𝆅', '𝆆', '𝆇', '𝆈', '𝆉', '𝆊', '𝆋',
    
    // Extended collections to reach exactly 300 symbols
    '♫', '♬', '♪', '♩', '𝄞', '♭', '♮', '♯', '𝄡', '𝄢', '𝄪', '𝄫', '𓏢', '𝄤', '𝄥', '𝄦', '𝄧', '𝄨', '𝄩', '𝄪', '𝄫', '𝄬', '𝄭', '𝄮', '𝄯', '𝄰', '𝄱', '𝄲', '𝄳', '𝅘𝅥𝅯', '𝅘𝅥𝅰', '𝅘𝅥𝅱', '𝅘𝅥𝅲', '𝅘𝅥𝅮', '𝅘𝅥𝅭', '𝅘𝅥𝅮𝅯', '𝆕𝆖𝆕𝆖', '𝆕𝆖𝆕', '𝆖𝆕𝆖', '𝆕𝆖', '𝆖', '𝇁', '𝇂', '𝇃', '𝇄', '𝇅', '𝇆', '𝇇', '𝇈', '𝇉', '𝇊', '𝇍', '𝇎', '𝇏', '𝇐', '𝇑', '𝇴', '𝇓', '𝇔', '𝇕', '𝇖',
    '𝄾', '𝄿', '𝅀', '𝅁', '𝅂', '𝅃', '𝅄', '𝅅', '𝅆', '𝅇', '𝅈', '𝅉', '𝅊', '𝅋', '𝅌', '𝅍', '𝅎', '𝅏', '𝅐', '𝅑', '𝅒', '𝅓', '𝅔', '𝅕', '𝅖', '𝅗', '𝅘', '𝅙', '𝅚', '𝅛', '𝅜', '𝅝', '𝄆', '𝄇', '𝄈', '𝄉', '𝄊', '𝄋', '𝄌', '𝄍', '𝄎', '𝄏', '𝄐', '𝄑', '𝄒', '𝄓', '𝄔', '𝄕', '𝄖', '𝄗', '𝄘', '𝄙',
    '𝄢', '𝄣', '𝄤', '𝄥', '𝄦', '𝄧', '𝄨', '𝄩', '𝄪', '𝄫', '𝄬', '𝄭', '𝄮', '𝄯', '𝄰', '𝄱', '𝄲', '𝄳', '𝅗𝅥', '𝆑', '𝆒', '𝆓', '𝆔', '𝆕', '𝆖', '𝆗', '𝆘', '𝆙', '𝆚', '𝆛', '𝆜', '𝆝', '𝆞', '𝆟', '𝆺𝅥𝅯', '𝅸', '𝅹', '𝅺', '𝅻', '𝅼', '𝅽', '𝅾', '𝅿', '𝆀', '𝆁', '𝆂', '𝆃', '𝆄', '𝆅', '𝆆', '𝆇', '𝆈', '𝆉', '𝆊', '𝆋',
    '♫', '♬', '♪', '♩', '𝄞', '♭', '♮', '♯', '𝄡', '𝄢', '𝄪', '𝄫', '𓏢', '𝄤', '𝄥', '𝄦', '𝄧', '𝄨', '𝄩', '𝄪', '𝄫', '𝄬', '𝄭', '𝄮', '𝄯', '𝄰', '𝄱', '𝄲', '𝄳', '𝅘𝅥𝅯', '𝅘𝅥𝅰', '𝅘𝅥𝅱', '𝅘𝅥𝅲', '𝅘𝅥𝅮', '𝅘𝅥𝅭', '𝅘𝅥𝅮𝅯', '𝆕𝆖𝆕𝆖', '𝆕𝆖𝆕', '𝆖𝆕𝆖', '𝆕𝆖', '𝆖', '𝇁', '𝇂', '𝇃', '𝇄', '𝇅', '𝇆', '𝇇', '𝇈', '𝇉', '𝇊', '𝇍', '𝇎', '𝇏', '𝇐', '𝇑', '𝇴', '𝇓', '𝇔', '𝇕', '𝇖',
    '𝄾', '𝄿', '𝅀', '𝅁', '𝅂', '𝅃', '𝅄', '𝅅', '𝅆', '𝅇', '𝅈', '𝅉', '𝅊', '𝅋', '𝅌', '𝅍', '𝅎', '𝅏', '𝅐', '𝅑', '𝅒', '𝅓', '𝅔', '𝅕', '𝅖', '𝅗', '𝅘', '𝅙', '𝅚', '𝅛', '𝅜', '𝅝', '𝄆', '𝄇', '𝄈', '𝄉', '𝄊', '𝄋', '𝄌', '𝄍', '𝄎', '𝄏', '𝄐', '𝄑', '𝄒', '𝄓', '𝄔', '𝄕', '𝄖', '𝄗', '𝄘', '𝄙',
    '𝄢', '𝄣', '𝄤', '𝄥', '𝄦', '𝄧', '𝄨', '𝄩', '𝄪', '𝄫', '𝄬', '𝄭', '𝄮', '𝄯', '𝄰', '𝄱', '𝄲', '𝄳', '𝅗𝅥', '𝆑', '𝆒', '𝆓', '𝆔', '𝆕', '𝆖', '𝆗', '𝆘', '𝆙', '𝆚', '𝆛', '𝆜', '𝆝', '𝆞', '𝆟', '𝆺𝅥𝅯', '𝅸', '𝅹', '𝅺', '𝅻', '𝅼', '𝅽', '𝅾', '𝅿', '𝆀', '𝆁', '𝆂', '𝆃', '𝆄', '𝆅', '𝆆', '𝆇', '𝆈', '𝆉', '𝆊', '𝆋',
    '♫', '♬', '♪', '♩', '𝄞', '♭', '♮', '♯', '𝄡', '𝄢', '𝄪', '𝄫', '𓏢', '𝄤', '𝄥', '𝄦', '𝄧', '𝄨', '𝄩', '𝄪', '𝄫', '𝄬', '𝄭', '𝄮', '𝄯', '𝄰', '𝄱', '𝄲', '𝄳', '𝅘𝅥𝅯', '𝅘𝅥𝅰', '𝅘𝅥𝅱', '𝅘𝅥𝅲', '𝅘𝅥𝅮', '𝅘𝅥𝅭', '𝅘𝅥𝅮𝅯', '𝆕𝆖𝆕𝆖', '𝆕𝆖𝆕', '𝆖𝆕𝆖', '𝆕𝆖', '𝆖', '𝇁', '𝇂', '𝇃', '𝇄', '𝇅', '𝇆', '𝇇', '𝇈', '𝇉', '𝇊', '𝇍', '𝇎', '𝇏', '𝇐', '𝇑', '𝇴', '𝇓', '𝇔', '𝇕', '𝇖',
    '𝄾', '𝄿', '𝅀', '𝅁', '𝅂', '𝅃', '𝅄', '𝅅', '𝅆', '𝅇', '𝅈', '𝅉', '𝅊', '𝅋', '𝅌', '𝅍', '𝅎', '𝅏', '𝅐', '𝅑', '𝅒', '𝅓', '𝅔', '𝅕', '𝅖', '𝅗', '𝅘', '𝅙', '𝅚', '𝅛', '𝅜', '𝅝', '𝄆', '𝄇', '𝄈', '𝄉', '𝄊', '𝄋', '𝄌', '𝄍', '𝄎', '𝄏', '𝄐', '𝄑', '𝄒', '𝄓', '𝄔', '𝄕', '𝄖', '𝄗', '𝄘', '𝄙',
    '𝄢', '𝄣', '𝄤', '𝄥', '𝄦', '𝄧', '𝄨', '𝄩', '𝄪', '𝄫', '𝄬', '𝄭', '𝄮', '𝄯', '𝄰', '𝄱', '𝄲', '𝄳', '𝅗𝅥', '𝆑', '𝆒', '𝆓', '𝆔', '𝆕', '𝆖', '𝆗', '𝆘', '𝆙', '𝆚', '𝆛', '𝆜', '𝆝', '𝆞', '𝆟', '𝆺𝅥𝅯', '𝅸', '𝅹', '𝅺', '𝅻', '𝅼', '𝅽', '𝅾', '𝅿', '𝆀', '𝆁', '𝆂', '𝆃', '𝆄', '𝆅', '𝆆', '𝆇', '𝆈', '𝆉', '𝆊', '𝆋'
];

// Symbol management
let currentSymbolAssignments = new Map(); // Maps symbols to URLs

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Enhanced Music Symbols Animation Initialized');
    
    // Initialize music page instance for AuthModal integration
    musicPage = {
        onUserLogin: onUserLogin,
        onUserLogout: onUserLogout
    };
    window.musicPage = musicPage;
    
    initializeWelcomeMessage();
    generateMusicSymbols();
    startSymbolAnimations();
    initializeURLManager();
    setupEventListeners();
    
    // Wait for AuthModal to be initialized, then load user data if authenticated
    setTimeout(() => {
        if (window.authModal && window.authModal.isAuthenticated()) {
            loadUserData();
        }
    }, 500);
});

// AuthModal integration functions
function onUserLogin() {
    console.log('User logged in via AuthModal');
    loadUserData();
}

function onUserLogout() {
    console.log('User logged out via AuthModal');
    // Clear all symbol assignments
    currentSymbolAssignments.clear();
    userUrls = [];
    userSavedSymbolCount = 0;
    currentGreenSymbols = 0;
    
    // Remove all URL assignments from symbols
    const symbols = document.querySelectorAll('.music-symbol.has-url');
    symbols.forEach(symbol => {
        symbol.dataset.link = '';
        symbol.classList.remove('has-url');
    });
    
    updateSymbolStats();
}

// Load user data (URLs and saved symbols)
async function loadUserData() {
    if (!window.authModal || !window.authModal.isAuthenticated()) return;
    
    const authData = window.authModal.getAuthData();
    if (!authData.token) return;
    
    try {
        // Load user's saved symbols count
        const symbolResponse = await fetch('/api/user/symbols', {
            headers: { 'Authorization': `Bearer ${authData.token}` }
        });
        
        if (symbolResponse.ok) {
            const symbolData = await symbolResponse.json();
            userSavedSymbolCount = symbolData.savedSymbolCount;
        }
        
        // Load user's URLs
        const urlResponse = await fetch('/api/user/urls', {
            headers: { 'Authorization': `Bearer ${authData.token}` }
        });
        
        if (urlResponse.ok) {
            const urlData = await urlResponse.json();
            userUrls = urlData.urls || [];
            
            // Assign URLs to random symbols based on saved count
            assignUrlsToSymbols();
        }
        
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

// Assign URLs to random symbols
function assignUrlsToSymbols() {
    const symbolsToAssign = Math.min(userSavedSymbolCount, userUrls.length);
    
    if (symbolsToAssign === 0) {
        updateSymbolStats();
        return;
    }
    
    const symbols = document.querySelectorAll('.music-symbol');
    const shuffledSymbols = Array.from(symbols).sort(() => Math.random() - 0.5);
    
    // Assign URLs to random symbols
    for (let i = 0; i < symbolsToAssign && i < userUrls.length && i < shuffledSymbols.length; i++) {
        const symbol = shuffledSymbols[i];
        const url = userUrls[i];
        
        symbol.dataset.link = url.url;
        symbol.classList.add('has-url');
        currentSymbolAssignments.set(symbol, url.url);
    }
    
    currentGreenSymbols = symbolsToAssign;
    updateSymbolStats();
}

// Welcome Message System
function initializeWelcomeMessage() {
    const welcomeElement = document.getElementById('welcome-message');
    if (!welcomeElement) return;
    
    console.log('Welcome message cycling initialized');
}

// Generate initial music symbols
function generateMusicSymbols() {
    const container = document.getElementById('music-symbols-container');
    if (!container) return;
    
    // Clear any existing symbols
    container.innerHTML = '';
    
    // Create exactly 300 symbols
    for (let i = 0; i < 300; i++) {
        const symbol = musicSymbols[i % musicSymbols.length];
        createMusicSymbol(symbol, i, true);
    }
    
    // Reassign user URLs if logged in
    setTimeout(() => {
        if (window.authModal && window.authModal.isAuthenticated()) {
            assignUrlsToSymbols();
        }
    }, 100);
}

// Create a single music symbol
function createMusicSymbol(symbol, index, initial = false) {
    const container = document.getElementById('music-symbols-container');
    if (!container) return;
    
    const symbolElement = document.createElement('div');
    symbolElement.className = 'music-symbol';
    symbolElement.textContent = symbol;
    
    // Empty symbols have no click interaction
    symbolElement.dataset.link = '';
    
    // Store individual movement characteristics
    symbolElement.dataset.speed = (0.3 + Math.random() * 0.7).toString();
    symbolElement.dataset.startOffset = (Math.random() * 3).toString();
    symbolElement.dataset.baseX = (Math.random() * (1920 - 100) + 50).toString();
    symbolElement.dataset.baseY = (Math.random() * (1080 - 100) + 50).toString();
    symbolElement.dataset.phase = (Math.random() * Math.PI * 2).toString();
    
    // Set initial position
    const baseX = parseFloat(symbolElement.dataset.baseX);
    const baseY = parseFloat(symbolElement.dataset.baseY);
    
    symbolElement.style.left = baseX + 'px';
    symbolElement.style.top = baseY + 'px';
    
    // Add click event listener only for symbols with URLs
    symbolElement.addEventListener('click', function() {
        handleSymbolClick(this);
    });
    
    container.appendChild(symbolElement);
    
    console.log(`Created music symbol: ${symbol}`);
    
    return symbolElement;
}

// Handle symbol click - only works for green symbols with URLs
function handleSymbolClick(symbolElement) {
    const link = symbolElement.dataset.link;
    
    // Only clickable if symbol has a URL (is green)
    if (link && link.trim() !== '') {
        // Open link in new tab
        window.open(link, '_blank');
        
        // Add sparkle effect
        symbolElement.classList.add('sparkle-effect');
        
        // Remove URL assignment and make symbol non-clickable
        symbolElement.classList.add('symbol-removing');
        
        // Remove URL assignment immediately
        symbolElement.dataset.link = '';
        symbolElement.classList.remove('has-url');
        currentSymbolAssignments.delete(symbolElement);
        
        // Update green symbols count immediately when URL is removed
        currentGreenSymbols--;
        updateSymbolStats();
        
        // Remove from DOM after animation
        setTimeout(() => {
            if (symbolElement.parentNode) {
                symbolElement.parentNode.removeChild(symbolElement);
            }
        }, 500);
        
        console.log('Symbol clicked - opened new tab, symbol freed for reuse');
    }
    // Empty symbols are not clickable - do nothing
}

// Enhanced symbol animations
function startSymbolAnimations() {
    function animateSymbols() {
        const symbols = document.querySelectorAll('.music-symbol');
        const windowWidth = 1920;
        const windowHeight = 1080;
        const time = Date.now() * 0.00002;
        
        symbols.forEach((symbol, index) => {
            // Skip symbols being removed
            if (symbol.classList.contains('symbol-removing')) {
                return;
            }
            
            const speed = parseFloat(symbol.dataset.speed);
            const startOffset = parseFloat(symbol.dataset.startOffset);
            const baseX = parseFloat(symbol.dataset.baseX);
            const baseY = parseFloat(symbol.dataset.baseY);
            const phase = parseFloat(symbol.dataset.phase);
            
            const horizontalDistance = (time + startOffset) * speed;
            const verticalDistance = (time + startOffset + phase) * speed * 0.8;
            
            // Horizontal bouncing
            const maxHorizontalDistance = windowWidth - 100;
            const horizontalCycles = Math.floor(horizontalDistance / maxHorizontalDistance);
            const horizontalCycleDistance = horizontalDistance % maxHorizontalDistance;
            
            let moveX;
            if (horizontalCycles % 2 === 0) {
                moveX = 50 + horizontalCycleDistance;
            } else {
                moveX = windowWidth - 50 - horizontalCycleDistance;
            }
            
            // Vertical bouncing
            const maxVerticalDistance = windowHeight - 100;
            const verticalCycles = Math.floor(verticalDistance / maxVerticalDistance);
            const verticalCycleDistance = verticalDistance % maxVerticalDistance;
            
            let moveY;
            if (verticalCycles % 2 === 0) {
                moveY = 50 + verticalCycleDistance;
            } else {
                moveY = windowHeight - 50 - verticalCycleDistance;
            }
            
            // Update position
            symbol.style.left = moveX + 'px';
            symbol.style.top = moveY + 'px';
            
            // Subtle scale animation
            const scale = 1 + Math.sin(time * 2 + index) * 0.1;
            symbol.style.transform = `translate(-50%, -50%) scale(${scale})`;
        });
        
        requestAnimationFrame(animateSymbols);
    }
    
    animateSymbols();
}

// Initialize URL Manager
function initializeURLManager() {
    const addUrlBtn = document.getElementById('add-url-btn');
    const urlInput = document.getElementById('url-input');
    const saveBtn = document.getElementById('save-btn');
    const restoreBtn = document.getElementById('restore-btn');
    const logoutBtn = document.getElementById('music-logout-btn');
    
    if (addUrlBtn) {
        addUrlBtn.addEventListener('click', handleAddUrlClick);
    }
    
    if (urlInput) {
        urlInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleAddUrlClick();
            }
        });
    }
    
    if (saveBtn) {
        saveBtn.addEventListener('click', saveCurrentSymbols);
    }
    
    if (restoreBtn) {
        restoreBtn.addEventListener('click', restoreAllSymbols);
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    updateSymbolStats();
}

// Handle Add URL button click
async function handleAddUrlClick() {
    const urlInput = document.getElementById('url-input');
    if (!urlInput) return;
    
    const url = urlInput.value.trim();
    
    if (!url) {
        alert('Please enter a valid URL!');
        return;
    }
    
    // Validate URL
    try {
        new URL(url);
    } catch (e) {
        alert('Please enter a valid URL!');
        return;
    }
    
    // Check if user is logged in using AuthModal
    if (!window.authModal || !window.authModal.isAuthenticated()) {
        window.authModal.show();
        return;
    }
    
    const authData = window.authModal.getAuthData();
    if (!authData.token) {
        window.authModal.show();
        return;
    }
    
    try {
        // Add URL to user's permanent collection
        const response = await fetch('/api/user/add-url', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authData.token}`
            },
            body: JSON.stringify({ url })
        });
        
        if (response.ok) {
            // Add URL to user's URL list
            userUrls.push({ url: url, id: Date.now() }); // Temporary ID
            
            // Assign to a random empty symbol
            assignUrlToRandomSymbol(url);
            
            // Clear input and update displays
            urlInput.value = '';
            currentGreenSymbols++;
            updateSymbolStats();
            
            console.log('URL added and assigned to symbol:', url);
        } else {
            const error = await response.json();
            alert('Failed to add URL: ' + error.error);
        }
    } catch (error) {
        console.error('Error adding URL:', error);
        alert('Failed to add URL. Please try again.');
    }
}

// Assign URL to random empty symbol
function assignUrlToRandomSymbol(url) {
    const emptySymbols = document.querySelectorAll('.music-symbol:not(.has-url)');
    
    if (emptySymbols.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptySymbols.length);
        const targetSymbol = emptySymbols[randomIndex];
        
        targetSymbol.dataset.link = url;
        targetSymbol.classList.add('has-url');
        currentSymbolAssignments.set(targetSymbol, url);
        
        console.log('URL assigned to empty symbol');
    } else {
        // If no empty symbols, find a symbol that's being removed and replace it
        console.log('All symbols are occupied, URL will be available for future assignments');
    }
}

// Save current symbols state
async function saveCurrentSymbols() {
    if (!window.authModal || !window.authModal.isAuthenticated()) {
        window.authModal.show();
        return;
    }
    
    const authData = window.authModal.getAuthData();
    if (!authData.token) {
        window.authModal.show();
        return;
    }
    
    try {
        const response = await fetch('/api/user/save-symbols', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authData.token}`
            },
            body: JSON.stringify({ symbolCount: currentGreenSymbols })
        });
        
        if (response.ok) {
            userSavedSymbolCount = currentGreenSymbols;
            alert(`Successfully saved ${currentGreenSymbols} green symbols!`);
            console.log('Symbols saved successfully');
        } else {
            alert('Failed to save symbols. Please try again.');
        }
    } catch (error) {
        console.error('Error saving symbols:', error);
        alert('Failed to save symbols. Please try again.');
    }
}

// Restore all symbols - reload URLs from server and assign to make green symbols
async function restoreAllSymbols() {
    console.log('🔄 RESTORE FUNCTION CALLED - RESTORING ALL URLS');
    alert('DEBUG: Restore function called! Restoring ALL URLs to make them green.');
    
    if (!window.authModal || !window.authModal.isAuthenticated()) {
        console.log('❌ User not authenticated, showing modal');
        window.authModal.show();
        return;
    }
    
    const authData = window.authModal.getAuthData();
    if (!authData.token) {
        console.log('❌ No auth token, showing modal');
        window.authModal.show();
        return;
    }
    
    console.log('✅ User authenticated, proceeding with restore...');
    
    try {
        // Get the user's URLs from server (permanent list)
        console.log('📡 Fetching URLs from /api/user/urls');
        const urlResponse = await fetch('/api/user/urls', {
            headers: { 'Authorization': `Bearer ${authData.token}` }
        });
        
        console.log('📡 URL Response status:', urlResponse.status);
        
        if (urlResponse.ok) {
            const urlData = await urlResponse.json();
            const serverUrls = urlData.urls || [];
            console.log('📦 Received server URLs:', serverUrls);
            
            // Update user URLs from server
            userUrls = serverUrls;
            
            // Get current state before restore
            const currentGreenCount = document.querySelectorAll('.music-symbol.has-url').length;
            const emptySymbols = Array.from(document.querySelectorAll('.music-symbol:not(.has-url)'));
            
            console.log('📊 Current state:', {
                currentGreenSymbols,
                greenSymbolsBeforeRestore: currentGreenCount,
                emptySymbolsCount: emptySymbols.length,
                serverUrlsCount: serverUrls.length
            });
            
            // Clear all existing green symbols first
            console.log('🧹 Clearing all existing green symbol assignments...');
            const allGreenSymbols = document.querySelectorAll('.music-symbol.has-url');
            allGreenSymbols.forEach(symbol => {
                symbol.dataset.link = '';
                symbol.classList.remove('has-url');
                currentSymbolAssignments.delete(symbol);
            });
            
            // Now assign ALL server URLs to empty symbols
            console.log(`🔧 Assigning ALL ${serverUrls.length} URLs to make them green...`);
            let urlIndex = 0;
            
            // Get fresh empty symbols after clearing
            const freshEmptySymbols = Array.from(document.querySelectorAll('.music-symbol:not(.has-url)'));
            
            // Assign ALL URLs to empty symbols
            for (let i = 0; i < serverUrls.length && i < freshEmptySymbols.length; i++) {
                const serverUrl = serverUrls[i];
                const symbol = freshEmptySymbols[i];
                
                // Assign URL to make symbol green
                symbol.dataset.link = serverUrl.url;
                symbol.classList.add('has-url');
                currentSymbolAssignments.set(symbol, serverUrl.url);
                urlIndex++;
                console.log(`✅ Assigned URL ${i + 1}: ${serverUrl.url}`);
            }
            
            // Update counts
            const newGreenCount = document.querySelectorAll('.music-symbol.has-url').length;
            currentGreenSymbols = newGreenCount;
            
            console.log('📈 Final state:', {
                totalUrlsAssigned: urlIndex,
                totalGreenSymbols: newGreenCount,
                serverUrlsCount: serverUrls.length
            });
            
            updateSymbolStats();
            alert(`✅ RESTORE SUCCESS! Restored ALL ${urlIndex} URLs to make green symbols! (Total: ${currentGreenSymbols} green symbols)`);
            console.log(`✅ RESTORE COMPLETED: All ${urlIndex} URLs restored to make green symbols`);
        } else {
            console.error('❌ Failed to fetch URLs:', urlResponse.status, urlResponse.statusText);
            alert('Failed to restore symbols. Please try again.');
        }
    } catch (error) {
        console.error('❌ Error restoring symbols:', error);
        alert('Failed to restore symbols. Please try again.');
    }
}

// Logout function
function logout() {
    // Clear all symbol assignments
    currentSymbolAssignments.clear();
    userUrls = [];
    userSavedSymbolCount = 0;
    currentGreenSymbols = 0;
    
    // Remove all URL assignments from symbols
    const symbols = document.querySelectorAll('.music-symbol.has-url');
    symbols.forEach(symbol => {
        symbol.dataset.link = '';
        symbol.classList.remove('has-url');
    });
    
    updateSymbolStats();
    
    // Call AuthModal logout if available
    if (window.authModal) {
        window.authModal.logout();
    }
    
    console.log('User logged out');
}

// Update symbol statistics display
function updateSymbolStats() {
    const urlCount = document.getElementById('url-count');
    const assignedCount = document.getElementById('assigned-count');
    const availableCount = document.getElementById('available-count');
    
    if (urlCount) {
        urlCount.textContent = `URLs in Pool: ${userUrls.length}`;
    }
    
    if (assignedCount) {
        assignedCount.textContent = `Green Symbols: ${currentGreenSymbols}`;
    }
    
    if (availableCount) {
        const availableSymbols = 300 - currentGreenSymbols;
        availableCount.textContent = `Available Symbols: ${availableSymbols}`;
    }
}

// Show login modal
function showLoginModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.style.display = 'block';
    }
}

// Hide login modal
function hideLoginModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Setup additional event listeners
function setupEventListeners() {
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('auth-modal');
        if (event.target === modal) {
            hideLoginModal();
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        const symbols = document.querySelectorAll('.music-symbol');
        
        symbols.forEach(symbol => {
            const rect = symbol.getBoundingClientRect();
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            
            if (rect.right > windowWidth || rect.bottom > windowHeight) {
                const newX = Math.random() * (windowWidth - 80) + 40;
                const newY = Math.random() * (windowHeight - 80) + 40;
                
                symbol.style.left = newX + 'px';
                symbol.style.top = newY + 'px';
            }
        });
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Press 'M' to add more symbols (for demo)
    if (event.key.toLowerCase() === 'm') {
        generateAdditionalSymbols(5);
    }
});

// Add additional symbols over time
function generateAdditionalSymbols(count) {
    for (let i = 0; i < count; i++) {
        const randomSymbol = musicSymbols[Math.floor(Math.random() * musicSymbols.length)];
        setTimeout(() => {
            createMusicSymbol(randomSymbol, 0, false);
        }, i * 500);
    }
}

// Legacy compatibility functions

// Close authentication modal
function closeAuthModal() {
    hideLoginModal();
}

// Legacy logout function for compatibility
function logoutUser() {
    logout();
}

// Restart orchestra function (legacy)
function restartOrchestra() {
    if (confirm('Are you sure you want to restart the orchestra? This will regenerate all symbols.')) {
        generateMusicSymbols();
        console.log('Orchestra restarted');
    }
}

// Console log for debugging
console.log('Enhanced Music Symbols Animation Script Loaded Successfully!');
console.log('Features:');
console.log('- Only green symbols (with URLs) are clickable');
console.log('- URLs are permanently saved to user account');
console.log('- Save button preserves current green symbols count');
console.log('- Restore button clears all user data');
console.log('- Click green symbol to open link and free the symbol for reuse');
console.log('- Exactly 300 total symbols system');
