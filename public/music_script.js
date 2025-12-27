// Enhanced Music Symbols Script with Persistent User Data

// Global variables
let userUrls = [];
let userSavedSymbolCount = 0;
let currentGreenSymbols = 0;
let isAdmin = false;
let musicPage = null;

// Music Symbols Collection - Exactly 300 symbols
const musicSymbols = [
    '♫', '♬', '♪', '♩', '𝄞', '♭', '♮', '♯', 
    '𝄡', '𝄢', '𝄪', '𝄫', '𓏢', '𝄤', '𝄥', '𝄦', '𝄧', '𝄨', '𝄩', '𝄪', '𝄫', '𝄬', '𝄭', '𝄮', '𝄯', '𝄰', '𝄱', '𝄲', '𝄳',
    '𝅘𝅥𝅯', '𝅘𝅥𝅰', '𝅘𝅥𝅱', '𝅘𝅥𝅲', '𝅘𝅥𝅮', '𝅘𝅥𝅭', '𝅘𝅥𝅮𝅯', '𝆕𝆖𝆕𝆖', '𝆕𝆖𝆕', '𝆖𝆕𝆖', '𝆕𝆖', '𝆖', '𝇁', '𝇂', '𝇃', '𝇄', '𝇅', '𝇆', '𝇇', '𝇈', '𝇉', '𝇊', '𝇍', '𝇎', '𝇏', '𝇐', '𝇑', '𝇴', '𝇓', '𝇔', '𝇕', '𝇖',
    '𝄾', '𝄿', '𝅀', '𝅁', '𝅂', '𝅃', '𝅄', '𝅅', '𝅆', '𝅇', '𝅈', '𝅉', '𝅊', '𝅋', '𝅌', '𝅍', '𝅎', '𝅏', '𝅐', '𝅑', '𝅒', '𝅓', '𝅔', '𝅕', '𝅖', '𝅗', '𝅘', '𝅙', '𝅚', '𝅛', '𝅜', '𝅝',
    '𝄆', '𝄇', '𝄈', '𝄉', '𝄊', '𝄋', '𝄌', '𝄍', '𝄎', '𝄏', '𝄐', '𝄑', '𝄒', '𝄓', '𝄔', '𝄕', '𝄖', '𝄗', '𝄘', '𝄙',
    '𝄢', '𝄣', '𝄤', '𝄥', '𝄦', '𝄧', '𝄨', '𝄩', '𝄪', '𝄫', '𝄬', '𝄭', '𝄮', '𝄯', '𝄰', '𝄱', '𝄲', '𝄳',
    '𝅗𝅥', '𝆑', '𝆒', '𝆓', '𝆔', '𝆕', '𝆖', '𝆗', '𝆘', '𝆙', '𝆚', '𝆛', '𝆜', '𝆝', '𝆞', '𝆟', '𝆺𝅥𝅯', '𝅸', '𝅹', '𝅺', '𝅻', '𝅼', '𝅽', '𝅾', '𝅿', '𝆀', '𝆁', '𝆂', '𝆃', '𝆄', '𝆅', '𝆆', '𝆇', '𝆈', '𝆉', '𝆊', '𝆋'
];

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Enhanced Music Symbols Animation Initialized');
    
    // Initialize music page instance for AuthModal integration
    musicPage = {
        onUserLogin: onUserLogin,
        onUserLogout: onUserLogout,
        updateURLCount: updateSymbolStats
    };
    window.musicPage = musicPage;
    
    initializeWelcomeMessage();
    generateMusicSymbols();
    
    // Load global URLs
    setTimeout(() => {
        console.log('Loading global URLs on page init...');
        loadGlobalUrls();
    }, 100);
    
    startSymbolAnimations();
    initializeURLManager();
    setupEventListeners();
    
    // Load user data if authenticated
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
    
    // Clear all symbol assignments first
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
    
    // Load global URLs after logout
    setTimeout(() => {
        console.log('Loading global URLs after logout...');
        loadGlobalUrls();
    }, 100);
    
    updateSymbolStats();
}

// Symbol management
let currentSymbolAssignments = new Map();

// Load user data
async function loadUserData() {
    console.log('Loading user data');
    
    // Check admin status if authenticated
    if (window.authModal && window.authModal.isAuthenticated()) {
        await checkAdminStatus();
    }
    
    updateSymbolStats();
}

// Check admin status - enhanced with JWT token support
async function checkAdminStatus() {
    try {
        const authData = window.authModal.getAuthData();
        if (!authData.token) {
            isAdmin = false;
            updateAdminUI();
            return;
        }
        
        // First, try to decode admin status from JWT token (faster)
        try {
            const tokenPayload = JSON.parse(atob(authData.token.split('.')[1]));
            if (tokenPayload.is_admin === true || tokenPayload.is_admin === 1) {
                isAdmin = true;
                console.log('✅ Admin status detected from JWT token:', isAdmin);
                updateAdminUI();
                return;
            }
        } catch (tokenError) {
            console.log('Could not decode admin status from token, checking database...');
        }
        
        // Fallback to database check if token doesn't have admin info
        const response = await fetch('/api/admin/status', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authData.token}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            isAdmin = data.isAdmin;
            console.log('✅ Admin status from database:', isAdmin);
        } else {
            isAdmin = false;
            console.log('❌ Admin status check failed');
        }
    } catch (error) {
        console.error('Error checking admin status:', error);
        isAdmin = false;
    }
    
    updateAdminUI();
}

// Update admin UI elements
function updateAdminUI() {
    const adminPanel = document.getElementById('admin-panel');
    const adminStatus = document.getElementById('admin-status');
    
    if (isAdmin) {
        if (adminPanel) {
            adminPanel.style.display = 'block';
        }
        
        if (adminStatus) {
            adminStatus.style.display = 'inline-block';
            adminStatus.textContent = '👑 ADMIN';
        }
        
    } else {
        if (adminPanel) {
            adminPanel.style.display = 'none';
        }
        
        if (adminStatus) {
            adminStatus.style.display = 'none';
        }
    }
}

function initializeWelcomeMessage() {
    const welcomeElement = document.getElementById('welcome-message');
    if (!welcomeElement) return;
    
    console.log('Welcome message cycling initialized');
}

// Generate initial music symbols
function generateMusicSymbols() {
    const container = document.getElementById('music-symbols-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Create exactly 300 symbols
    for (let i = 0; i < 300; i++) {
        const symbol = musicSymbols[i % musicSymbols.length];
        createMusicSymbol(symbol, i, true);
    }
    
    // Reassign URLs if needed
    setTimeout(() => {
        if (window.authModal && window.authModal.isAuthenticated()) {
            loadGlobalUrls();
        }
    }, 100);
}

// Create a single music symbol - fully responsive
function createMusicSymbol(symbol, index, initial = false) {
    const container = document.getElementById('music-symbols-container');
    if (!container) return;
    
    const symbolElement = document.createElement('div');
    symbolElement.className = 'music-symbol';
    symbolElement.textContent = symbol;
    
    symbolElement.dataset.link = '';
    
    // Store individual movement characteristics
    symbolElement.dataset.speed = (0.3 + Math.random() * 0.7).toString();
    symbolElement.dataset.startOffset = (Math.random() * 3).toString();
    
    // Store NORMALIZED coordinates (0-1 range) - this is the key to responsiveness!
    symbolElement.dataset.baseXNormalized = (Math.random() * 0.9 + 0.05).toString(); // 5% to 95%
    symbolElement.dataset.baseYNormalized = (Math.random() * 0.9 + 0.05).toString(); // 5% to 95%
    symbolElement.dataset.phase = (Math.random() * Math.PI * 2).toString();
    
    // Set initial position using current viewport
    const currentWidth = window.innerWidth;
    const currentHeight = window.innerHeight;
    
    const baseXNormalized = parseFloat(symbolElement.dataset.baseXNormalized);
    const baseYNormalized = parseFloat(symbolElement.dataset.baseYNormalized);
    
    const baseX = baseXNormalized * currentWidth;
    const baseY = baseYNormalized * currentHeight;
    
    // Ensure symbols start within viewport bounds
    const safeX = Math.max(25, Math.min(currentWidth - 25, baseX));
    const safeY = Math.max(25, Math.min(currentHeight - 25, baseY));
    
    symbolElement.style.left = safeX + 'px';
    symbolElement.style.top = safeY + 'px';
    
    // Add click event listener
    symbolElement.addEventListener('click', function() {
        handleSymbolClick(this);
    });
    
    container.appendChild(symbolElement);
    
    return symbolElement;
}

// Handle symbol click
function handleSymbolClick(symbolElement) {
    const link = symbolElement.dataset.link;
    
    if (link && link.trim() !== '') {
        window.open(link, '_blank');
        
        symbolElement.classList.add('sparkle-effect');
        symbolElement.classList.add('symbol-removing');
        
        symbolElement.dataset.link = '';
        symbolElement.classList.remove('has-url');
        currentSymbolAssignments.delete(symbolElement);
        
        currentGreenSymbols--;
        updateSymbolStats();
        
        setTimeout(() => {
            if (symbolElement.parentNode) {
                symbolElement.parentNode.removeChild(symbolElement);
            }
        }, 500);
        
        console.log('Symbol clicked - opened new tab, symbol freed for reuse');
    }
}

// Adaptive symbol animations - truly responsive universe
function startSymbolAnimations() {
    function animateSymbols() {
        const symbols = document.querySelectorAll('.music-symbol');
        // Get ACTUAL viewport dimensions - not hardcoded!
        const currentWidth = window.innerWidth;
        const currentHeight = window.innerHeight;
        const time = Date.now() * 0.00002;
        
        symbols.forEach((symbol, index) => {
            if (symbol.classList.contains('symbol-removing')) {
                return;
            }
            
            const speed = parseFloat(symbol.dataset.speed);
            const startOffset = parseFloat(symbol.dataset.startOffset);
            const phase = parseFloat(symbol.dataset.phase);
            
            // Normalize base coordinates to current viewport (0-1 range)
            let baseXNormalized = parseFloat(symbol.dataset.baseXNormalized);
            let baseYNormalized = parseFloat(symbol.dataset.baseYNormalized);
            
            // If coordinates are not normalized yet, convert from old system
            if (isNaN(baseXNormalized) || isNaN(baseYNormalized)) {
                // Convert old hardcoded coordinates to normalized ones
                const oldBaseX = parseFloat(symbol.dataset.baseX) || 1000;
                const oldBaseY = parseFloat(symbol.dataset.baseY) || 500;
                baseXNormalized = oldBaseX / 1920; // Normalize from old 1920x1080
                baseYNormalized = oldBaseY / 1080;
                
                // Store normalized coordinates
                symbol.dataset.baseXNormalized = baseXNormalized.toString();
                symbol.dataset.baseYNormalized = baseYNormalized.toString();
            }
            
            // Convert normalized coordinates to current viewport pixels
            const currentBaseX = baseXNormalized * currentWidth;
            const currentBaseY = baseYNormalized * currentHeight;
            
            const horizontalDistance = (time + startOffset) * speed * 100;
            const verticalDistance = (time + startOffset + phase) * speed * 80;
            
            const maxHorizontalDistance = currentWidth - 100;
            const horizontalCycles = Math.floor(horizontalDistance / maxHorizontalDistance);
            const horizontalCycleDistance = horizontalDistance % maxHorizontalDistance;
            
            let moveX;
            if (horizontalCycles % 2 === 0) {
                moveX = 50 + horizontalCycleDistance;
            } else {
                moveX = currentWidth - 50 - horizontalCycleDistance;
            }
            
            const maxVerticalDistance = currentHeight - 100;
            const verticalCycles = Math.floor(verticalDistance / maxVerticalDistance);
            const verticalCycleDistance = verticalDistance % maxVerticalDistance;
            
            let moveY;
            if (verticalCycles % 2 === 0) {
                moveY = 50 + verticalCycleDistance;
            } else {
                moveY = currentHeight - 50 - verticalCycleDistance;
            }
            
            // Ensure symbols stay within current viewport
            moveX = Math.max(25, Math.min(currentWidth - 25, moveX));
            moveY = Math.max(25, Math.min(currentHeight - 25, moveY));
            
            symbol.style.left = moveX + 'px';
            symbol.style.top = moveY + 'px';
            
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
    
    const adminUrlsBtn = document.getElementById('admin-view-urls-btn');
    
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
    
    // Admin modal event listeners
    if (adminUrlsBtn) {
        adminUrlsBtn.addEventListener('click', () => {
            if (window.adminURLsModal) {
                window.adminURLsModal.show();
            }
        });
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
    
    try {
        new URL(url);
    } catch (e) {
        alert('Please enter a valid URL!');
        return;
    }
    
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
        const response = await fetch('/api/add-url', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authData.token}`
            },
            body: JSON.stringify({ url })
        });
        
        if (response.ok) {
            await loadGlobalUrls();
            
            urlInput.value = '';
            
            console.log('URL added to global pool:', url);
        } else {
            const error = await response.json();
            alert('Failed to add URL: ' + error.error);
        }
    } catch (error) {
        console.error('Error adding URL:', error);
        alert('Failed to add URL. Please try again.');
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

// Restore all symbols
async function restoreAllSymbols() {
    console.log('🔄 RESTORE FUNCTION CALLED - RESTORING ALL GLOBAL URLS');
    
    try {
        const urlResponse = await fetch('/api/urls/public');
        
        if (urlResponse.ok) {
            const urlData = await urlResponse.json();
            const serverUrls = urlData.urls || [];
            
            // Clear all existing green symbols first
            const allGreenSymbols = document.querySelectorAll('.music-symbol.has-url');
            allGreenSymbols.forEach(symbol => {
                symbol.dataset.link = '';
                symbol.classList.remove('has-url');
                currentSymbolAssignments.delete(symbol);
            });
            
            // Assign ALL global URLs to empty symbols
            const freshEmptySymbols = Array.from(document.querySelectorAll('.music-symbol:not(.has-url)'));
            
            for (let i = 0; i < serverUrls.length && i < freshEmptySymbols.length; i++) {
                const serverUrl = serverUrls[i];
                const symbol = freshEmptySymbols[i];
                
                symbol.dataset.link = serverUrl.url;
                symbol.classList.add('has-url');
                currentSymbolAssignments.set(symbol, serverUrl.url);
            }
            
            currentGreenSymbols = document.querySelectorAll('.music-symbol.has-url').length;
            
            updateSymbolStats();
            alert(`✅ RESTORE SUCCESS! Restored ALL ${serverUrls.length} global URLs!`);
        } else {
            alert('Failed to restore symbols. Please try again.');
        }
    } catch (error) {
        console.error('Error restoring symbols:', error);
        alert('Failed to restore symbols. Please try again.');
    }
}

// Logout function
function logout() {
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
        const globalCount = document.querySelectorAll('.music-symbol.has-url').length;
        urlCount.textContent = `Global URLs: ${globalCount}`;
    }
    
    if (assignedCount) {
        assignedCount.textContent = `Green Symbols: ${currentGreenSymbols}`;
    }
    
    if (availableCount) {
        const availableSymbols = 300 - currentGreenSymbols;
        availableCount.textContent = `Available Symbols: ${availableSymbols}`;
    }
}

// Load GLOBAL URLs for everyone
async function loadGlobalUrls() {
    try {
        console.log('🌍 LOADING GLOBAL URLS');
        
        const res = await fetch('/api/urls/public');
        const data = await res.json();
        console.log('🌍 Received data:', data);

        // Clear existing
        document.querySelectorAll('.music-symbol').forEach(symbol => {
            symbol.dataset.link = '';
            symbol.classList.remove('has-url');
        });

        currentGreenSymbols = 0;

        // Assign URLs to symbols
        const symbols = document.querySelectorAll('.music-symbol');
        data.urls.forEach((item, index) => {
            if (symbols[index]) {
                symbols[index].dataset.link = item.url;
                symbols[index].classList.add('has-url');
                currentGreenSymbols++;
            }
        });
        
        updateSymbolStats();
        console.log('✅ GLOBAL URLS LOADING COMPLETE');
        
    } catch (err) {
        console.error('❌ Failed to load global URLs', err);
    }
}

// Setup additional event listeners
function setupEventListeners() {
    // Toggle Manager Content Visibility - Ultra-Simple and Reliable
    let isManagerOpen = false;
    const toggleBtn = document.getElementById('toggle-manager');
    const managerContent = document.getElementById('manager-content');
    const container = document.getElementById('manager-container');
    
    // Toggle button click - immediate response
    if (toggleBtn) {
        toggleBtn.onclick = function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            isManagerOpen = !isManagerOpen;
            
            if (isManagerOpen) {
                managerContent.classList.add('open');
                toggleBtn.setAttribute('aria-expanded', 'true');
            } else {
                managerContent.classList.remove('open');
                toggleBtn.setAttribute('aria-expanded', 'false');
            }
            
            return false;
        };
    }
    
    // Close when clicking outside the container
    if (container) {
        document.onclick = function(event) {
            if (isManagerOpen && !container.contains(event.target)) {
                isManagerOpen = false;
                managerContent.classList.remove('open');
                toggleBtn.setAttribute('aria-expanded', 'false');
            }
        };
    }
    
    // Stop propagation inside manager content
    if (managerContent) {
        managerContent.onclick = function(event) {
            event.stopPropagation();
        };
    }
    
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('auth-modal');
        if (event.target === modal) {
            hideLoginModal();
        }
    });
    
    // Enhanced resize listener for fluid background animation
    setupResponsiveBackground();
    
    // ADAPTIVE RESIZE LISTENER - Creates expanding universe effect
    let resizeTimeout;
    let lastViewportWidth = window.innerWidth;
    let lastViewportHeight = window.innerHeight;
    
    function handleAdaptiveResize() {
        const currentWidth = window.innerWidth;
        const currentHeight = window.innerHeight;
        const symbols = document.querySelectorAll('.music-symbol');
        
        // Detect significant viewport changes (expansion/contraction)
        const widthChange = Math.abs(currentWidth - lastViewportWidth);
        const heightChange = Math.abs(currentHeight - lastViewportHeight);
        const isSignificantChange = widthChange > 50 || heightChange > 50;
        
        if (isSignificantChange) {
            console.log(`🔄 VIEWPORT CHANGE: ${lastViewportWidth}x${lastViewportHeight} → ${currentWidth}x${currentHeight}`);
            
            // For EXPANDING viewport - let some symbols migrate to new areas
            if (currentWidth > lastViewportWidth || currentHeight > lastViewportHeight) {
                const expansionRatio = Math.max(currentWidth / lastViewportWidth, currentHeight / lastViewportHeight);
                const symbolsToRelocate = Math.floor(symbols.length * 0.1 * (expansionRatio - 1)); // 10% per expansion factor
                
                for (let i = 0; i < symbolsToRelocate && i < symbols.length; i++) {
                    const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
                    
                    // Create new normalized coordinates for the newly exposed areas
                    const newNormalizedX = Math.random() * 0.9 + 0.05;
                    const newNormalizedY = Math.random() * 0.9 + 0.05;
                    
                    randomSymbol.dataset.baseXNormalized = newNormalizedX.toString();
                    randomSymbol.dataset.baseYNormalized = newNormalizedY.toString();
                    
                    console.log(`🎯 Relocated symbol to new area: ${newNormalizedX.toFixed(2)}, ${newNormalizedY.toFixed(2)}`);
                }
            }
            
            // For ALL resizes - ensure symbols stay within bounds and recalculate positions
            symbols.forEach(symbol => {
                const rect = symbol.getBoundingClientRect();
                
                // If symbol is outside new bounds, reposition it
                if (rect.right > currentWidth || rect.bottom > currentHeight || 
                    rect.left < 0 || rect.top < 0) {
                    
                    const baseXNormalized = parseFloat(symbol.dataset.baseXNormalized) || 0.5;
                    const baseYNormalized = parseFloat(symbol.dataset.baseYNormalized) || 0.5;
                    
                    const newX = baseXNormalized * currentWidth;
                    const newY = baseYNormalized * currentHeight;
                    
                    const safeX = Math.max(25, Math.min(currentWidth - 25, newX));
                    const safeY = Math.max(25, Math.min(currentHeight - 25, newY));
                    
                    symbol.style.left = safeX + 'px';
                    symbol.style.top = safeY + 'px';
                    
                    console.log(`📍 Repositioned symbol to: ${safeX.toFixed(0)}, ${safeY.toFixed(0)}`);
                }
            });
            
            lastViewportWidth = currentWidth;
            lastViewportHeight = currentHeight;
        }
        
        // Always update responsive background
        updateResponsiveBackground();
    }
    
    // Main resize listener with debouncing
    window.addEventListener('resize', debounce(function() {
        handleAdaptiveResize();
    }, 150));
    
    // Orientation change detection for mobile
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            console.log('📱 Orientation changed, recalculating universe...');
            handleAdaptiveResize();
        }, 100);
    });
    
    // Initial viewport tracking
    lastViewportWidth = window.innerWidth;
    lastViewportHeight = window.innerHeight;
}

// Responsive Background Animation System
function setupResponsiveBackground() {
    let resizeTimeout;
    let isResizing = false;
    
    // Initialize background animation parameters
    updateResponsiveBackground();
    
    // Create a dynamic background animation controller
    const body = document.body;
    let animationPhase = 0;
    
    function animateBackground() {
        animationPhase += 0.001;
        const currentTime = Date.now() * 0.001;
        
        // Dynamic background position based on viewport and time
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Create more fluid movement patterns
        const posX = (Math.sin(currentTime * 0.5) + 1) * 50; // 0-100%
        const posY = (Math.cos(currentTime * 0.3) + 1) * 50; // 0-100%
        
        // Adjust animation speed based on viewport size
        let animationSpeed = 1;
        if (viewportWidth < 768) {
            animationSpeed = 1.3; // Faster on mobile
        } else if (viewportWidth < 480) {
            animationSpeed = 1.6; // Even faster on small screens
        }
        
        // Apply dynamic background positioning
        body.style.backgroundPosition = `${posX}% ${posY}%`;
        
        // Update animation duration based on viewport
        const baseDuration = 15; // Base 15 seconds
        const adjustedDuration = baseDuration / animationSpeed;
        
        if (body.style.animationDuration !== `${adjustedDuration}s`) {
            body.style.animationDuration = `${adjustedDuration}s`;
        }
        
        requestAnimationFrame(animateBackground);
    }
    
    // Start the dynamic background animation
    animateBackground();
}

function updateResponsiveBackground() {
    const body = document.body;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Ensure background always covers viewport
    body.style.backgroundSize = '100vw 100vh';
    
    // Adjust animation parameters based on viewport
    let animationDuration = 15; // Base duration
    
    if (viewportWidth < 768) {
        animationDuration = 12; // Faster on mobile
    } else if (viewportWidth < 480) {
        animationDuration = 10; // Even faster on small screens
    }
    
    // Update animation duration
    body.style.animationDuration = `${animationDuration}s`;
    
    // Adjust gradient intensity based on viewport
    let gradientIntensity = '400% 400%';
    if (viewportWidth < 768) {
        gradientIntensity = '200% 200%'; // Less intensive on mobile
    } else if (viewportWidth > 1200) {
        gradientIntensity = '600% 600%'; // More intensive on large screens
    }
    
    // Force background recalculation for immediate visual feedback
    body.style.background = body.style.background;
    
    console.log(`Background updated for viewport: ${viewportWidth}x${viewportHeight}, duration: ${animationDuration}s`);
}

// Debounce function to prevent excessive resize events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Touch device optimization for background
function setupTouchOptimization() {
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
        
        // Reduce animation intensity on touch devices for better performance
        const style = document.createElement('style');
        style.textContent = `
            .touch-device body {
                animation-duration: 20s !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize touch optimization
setupTouchOptimization();

// Close authentication modal
function closeAuthModal() {
    hideLoginModal();
}

// Legacy logout function for compatibility
function logoutUser() {
    logout();
}

// Legacy function for compatibility
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
console.log('- URLs are permanently saved to global pool');
console.log('- Save button preserves current green symbols count');
console.log('- Restore button clears all user data');
console.log('- Click green symbol to open link and free the symbol for reuse');
console.log('- Exactly 300 total symbols system');
console.log('- Admin panel with URL management and statistics');
