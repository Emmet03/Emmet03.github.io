/* ==========================================
   INAKA WIKI - LIGHTBOX SYSTEM
   Elegant image viewer for wiki images
   ========================================== */

class InakaLightbox {
    constructor() {
        this.lightbox = null;
        this.currentImage = null;
        this.init();
    }

    init() {
        this.createLightbox();
        this.attachEventListeners();
    }

    createLightbox() {
        // Create lightbox container
        this.lightbox = document.createElement('div');
        this.lightbox.className = 'inaka-lightbox';
        this.lightbox.innerHTML = `
            <div class="lightbox-backdrop"></div>
            <div class="lightbox-container">
                <button class="lightbox-close" aria-label="Schließen">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </button>
                <div class="lightbox-content">
                    <img class="lightbox-image" src="" alt="">
                    <div class="lightbox-caption"></div>
                </div>
                <div class="lightbox-loading">
                    <div class="loading-spinner"></div>
                    <p>Bild wird geladen...</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.lightbox);
    }

    attachEventListeners() {
        // Find all clickable images
        const clickableImages = document.querySelectorAll('.infobox img, .midTextImg img');
        
        clickableImages.forEach(img => {
            // Add cursor pointer to indicate clickability
            img.style.cursor = 'pointer';
            img.classList.add('lightbox-clickable');
            
            // Add click event
            img.addEventListener('click', (e) => {
                e.preventDefault();
                this.openLightbox(img);
            });
            
            // Add hover effect
            img.addEventListener('mouseenter', () => {
                img.style.transform = 'scale(1.02)';
                img.style.transition = 'transform 0.3s ease';
            });
            
            img.addEventListener('mouseleave', () => {
                img.style.transform = 'scale(1)';
            });
        });

        // Close lightbox events
        const closeBtn = this.lightbox.querySelector('.lightbox-close');
        const backdrop = this.lightbox.querySelector('.lightbox-backdrop');
        
        closeBtn.addEventListener('click', () => this.closeLightbox());
        backdrop.addEventListener('click', () => this.closeLightbox());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.lightbox.classList.contains('active')) {
                if (e.key === 'Escape') {
                    this.closeLightbox();
                }
            }
        });
    }

    openLightbox(imgElement) {
        this.currentImage = imgElement;
        const lightboxImg = this.lightbox.querySelector('.lightbox-image');
        const lightboxCaption = this.lightbox.querySelector('.lightbox-caption');
        const loadingDiv = this.lightbox.querySelector('.lightbox-loading');
        const contentDiv = this.lightbox.querySelector('.lightbox-content');
        
        // Show loading
        loadingDiv.style.display = 'flex';
        contentDiv.style.display = 'none';
        
        // Show lightbox
        this.lightbox.classList.add('active');
        document.body.classList.add('lightbox-open');
        
        // Load image
        const fullSizeImg = new Image();
        fullSizeImg.onload = () => {
            lightboxImg.src = imgElement.src;
            lightboxImg.alt = imgElement.alt;
            
            // Set caption
            const caption = this.getImageCaption(imgElement);
            lightboxCaption.textContent = caption;
            
            // Hide loading, show content
            loadingDiv.style.display = 'none';
            contentDiv.style.display = 'block';
            
            // Animate in
            requestAnimationFrame(() => {
                lightboxImg.classList.add('loaded');
            });
        };
        
        fullSizeImg.onerror = () => {
            loadingDiv.innerHTML = `
                <div class="loading-error">
                    <p>❌ Fehler beim Laden des Bildes</p>
                    <button onclick="inakaLightbox.closeLightbox()" class="error-close-btn">Schließen</button>
                </div>
            `;
        };
        
        fullSizeImg.src = imgElement.src;
    }

    getImageCaption(imgElement) {
        // Check for various caption sources
        const altText = imgElement.alt;
        const parentFigure = imgElement.closest('figure');
        const parentMidTextImg = imgElement.closest('.midTextImg');
        
        // Try to find caption in parent elements
        if (parentFigure) {
            const figcaption = parentFigure.querySelector('figcaption');
            if (figcaption) return figcaption.textContent;
        }
        
        if (parentMidTextImg) {
            const caption = parentMidTextImg.querySelector('p');
            if (caption) return caption.textContent;
            
            const heading = parentMidTextImg.querySelector('h1');
            if (heading) return heading.textContent;
        }
        
        // Check for title attribute
        if (imgElement.title) return imgElement.title;
        
        // Fallback to alt text
        return altText || 'Kein Titel verfügbar';
    }

    closeLightbox() {
        this.lightbox.classList.add('closing');
        
        setTimeout(() => {
            this.lightbox.classList.remove('active', 'closing');
            document.body.classList.remove('lightbox-open');
            
            // Reset image
            const lightboxImg = this.lightbox.querySelector('.lightbox-image');
            lightboxImg.classList.remove('loaded');
            lightboxImg.src = '';
        }, 300);
    }
}

// Initialize lightbox when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.inakaLightbox = new InakaLightbox();
});

// Add CSS for lightbox
const lightboxStyles = `
/* ==========================================
   INAKA LIGHTBOX STYLES
   ========================================== */
.inaka-lightbox {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10000;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
}

.inaka-lightbox.active {
    opacity: 1;
    visibility: visible;
}

.inaka-lightbox.closing {
    opacity: 0;
}

.lightbox-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(5px);
}

.lightbox-container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
}

.lightbox-close {
    position: absolute;
    top: 2rem;
    right: 2rem;
    background: rgba(26, 26, 26, 0.8);
    border: 2px solid #D4AF37;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    color: #D4AF37;
    cursor: pointer;
    z-index: 10001;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
}

.lightbox-close:hover {
    background: rgba(212, 175, 55, 0.2);
    transform: scale(1.1);
    box-shadow: 0 4px 20px rgba(212, 175, 55, 0.3);
}

.lightbox-content {
    max-width: 90%;
    max-height: 90%;
    display: none;
    text-align: center;
    animation: lightboxSlideIn 0.4s ease-out;
}

.lightbox-image {
    max-width: 100%;
    max-height: 80vh;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
    border: 2px solid #8B4513;
    opacity: 0;
    transform: scale(0.8);
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.lightbox-image.loaded {
    opacity: 1;
    transform: scale(1);
}

.lightbox-caption {
    margin-top: 1rem;
    color: #ffffff;
    font-size: 1.1rem;
    font-weight: 500;
    background: rgba(26, 26, 26, 0.8);
    padding: 0.75rem 1.5rem;
    border-radius: 25px;
    backdrop-filter: blur(10px);
    border: 1px solid #D4AF37;
    display: inline-block;
    max-width: 100%;
}

.lightbox-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-size: 1.2rem;
}

.loading-spinner {
    width: 50px;
    height: 50px;
    border: 4px solid rgba(212, 175, 55, 0.3);
    border-top: 4px solid #D4AF37;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
}

.loading-error {
    text-align: center;
    color: #ff6b6b;
}

.error-close-btn {
    background: #D4AF37;
    color: #1a1a1a;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 1rem;
    font-weight: bold;
    transition: all 0.3s ease;
}

.error-close-btn:hover {
    background: #B8941F;
    transform: translateY(-2px);
}

/* Clickable image indicator */
.lightbox-clickable {
    position: relative;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.lightbox-clickable:hover {
    box-shadow: 0 8px 25px rgba(212, 175, 55, 0.3) !important;
}

.lightbox-clickable::after {
    content: '🔍';
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(26, 26, 26, 0.8);
    color: #D4AF37;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9rem;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
}

.lightbox-clickable:hover::after {
    opacity: 1;
}

/* Prevent body scroll when lightbox is open */
body.lightbox-open {
    overflow: hidden;
}

/* Animations */
@keyframes lightboxSlideIn {
    from {
        opacity: 0;
        transform: translateY(50px) scale(0.9);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Mobile responsiveness */
@media (max-width: 768px) {
    .lightbox-container {
        padding: 1rem;
    }
    
    .lightbox-close {
        top: 1rem;
        right: 1rem;
        width: 40px;
        height: 40px;
    }
    
    .lightbox-content {
        max-width: 95%;
        max-height: 95%;
    }
    
    .lightbox-image {
        max-height: 70vh;
    }
    
    .lightbox-caption {
        font-size: 1rem;
        padding: 0.5rem 1rem;
        margin-top: 0.5rem;
    }
    
    .lightbox-clickable::after {
        width: 25px;
        height: 25px;
        font-size: 0.8rem;
        top: 5px;
        right: 5px;
    }
}
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = lightboxStyles;
document.head.appendChild(styleSheet);