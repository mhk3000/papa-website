// Enhanced Table of Contents for Notion-style interaction
document.addEventListener('DOMContentLoaded', function () {
    // Wait a bit for the page to fully load
    setTimeout(() => {
        initializeTableOfContents();
    }, 100);
});

function initializeTableOfContents() {
    console.log('Initializing Table of Contents...');

    // Check if we have a table of contents on the page
    const existingToc = document.querySelector('.TableOfContents');
    console.log('Existing TOC found:', existingToc);

    // Also check for ColorfulBlock with TableOfContents class
    const colorfulToc = document.querySelector('.ColorfulBlock.TableOfContents');
    console.log('Colorful TOC found:', colorfulToc);

    if (!existingToc && !colorfulToc) {
        console.log('Creating new floating TOC...');
        createFloatingTableOfContents();
    } else {
        console.log('Enhancing existing TOC...');
        const tocToEnhance = existingToc || colorfulToc;
        enhanceExistingTableOfContents(tocToEnhance);
    }

    // Check if TOC was created after a delay
    setTimeout(() => {
        const finalToc = document.querySelector('.TableOfContents');
        console.log('Final TOC check:', finalToc);
        if (finalToc) {
            console.log('TOC successfully created!');
        } else {
            console.log('TOC creation failed!');
        }
    }, 1000);
}

function createFloatingTableOfContents() {
    console.log('Creating floating TOC...');

    const contentArea = document.querySelector('.PageRoot');
    console.log('Content area found:', contentArea);
    if (!contentArea) {
        console.log('No content area found, returning');
        return;
    }

    // Find all headings in the content
    const headings = contentArea.querySelectorAll('h1, h2, h3, h4, h5, h6');
    console.log('Headings found:', headings.length, headings);
    if (headings.length < 2) {
        console.log('Not enough headings, returning');
        return; // Only show TOC if there are enough headings
    }

    console.log('Proceeding to create TOC...');

    // Create the floating table of contents
    const toc = document.createElement('div');
    toc.className = 'TableOfContents TableOfContents--collapsed';
    toc.innerHTML = `
        <div class="TableOfContents__Header">
            <span>Table of Contents</span>
            <button class="TableOfContents__Toggle" aria-label="Toggle table of contents">
                <svg viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                </svg>
            </button>
        </div>
        <div class="TableOfContents__Content">
            ${generateTocItems(headings)}
        </div>
    `;

    // Add to the page
    document.body.appendChild(toc);
    console.log('TOC added to page:', toc);

    // Add event listeners
    setupTableOfContentsEvents(toc);
    setupScrollSpy(toc, headings);
}

function enhanceExistingTableOfContents(existingToc) {
    if (!existingToc) return;

    console.log('Enhancing existing TOC:', existingToc);

    // Convert existing TOC to floating style
    existingToc.className = 'TableOfContents TableOfContents--collapsed';

    // Add header if it doesn't exist
    if (!existingToc.querySelector('.TableOfContents__Header')) {
        const header = document.createElement('div');
        header.className = 'TableOfContents__Header';
        header.innerHTML = `
            <span>Table of Contents</span>
            <button class="TableOfContents__Toggle" aria-label="Toggle table of contents">
                <svg viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                </svg>
            </button>
        `;
        existingToc.insertBefore(header, existingToc.firstChild);
    }

    // Add content wrapper if it doesn't exist
    if (!existingToc.querySelector('.TableOfContents__Content')) {
        const content = document.createElement('div');
        content.className = 'TableOfContents__Content';

        // Move all existing items to the content wrapper
        const items = Array.from(existingToc.querySelectorAll('.TableOfContents__Item'));
        console.log('Found existing TOC items:', items.length);
        items.forEach(item => {
            // Convert existing TOC items to work with our system
            if (item.querySelector('a')) {
                const link = item.querySelector('a');
                const href = link.getAttribute('href');
                const text = link.textContent.trim();

                // Create new button-style item
                const newItem = document.createElement('button');
                newItem.className = 'TableOfContents__Item';
                newItem.textContent = text;
                newItem.setAttribute('data-target', href.replace('#', ''));

                // Determine heading level from margin-left style
                const marginLeft = link.querySelector('div')?.style.marginLeft || '0px';
                const level = Math.floor(parseInt(marginLeft) / 24) + 1;
                newItem.classList.add(`TableOfContents__Item--h${level}`);
                newItem.setAttribute('data-level', level);

                content.appendChild(newItem);
            } else {
                content.appendChild(item);
            }
        });

        existingToc.appendChild(content);
    }

    // Add event listeners
    setupTableOfContentsEvents(existingToc);

    // Get headings for scroll spy
    const contentArea = document.querySelector('.PageRoot');
    if (contentArea) {
        const headings = contentArea.querySelectorAll('h1, h2, h3, h4, h5, h6');
        setupScrollSpy(existingToc, headings);
    }
}

function generateTocItems(headings) {
    return Array.from(headings).map(heading => {
        const level = parseInt(heading.tagName.charAt(1));
        const text = heading.textContent.trim();
        const id = heading.id || generateId(text);

        // Ensure heading has an ID
        if (!heading.id) {
            heading.id = id;
        }

        return `
            <button class="TableOfContents__Item TableOfContents__Item--h${level}" 
                    data-target="${id}" 
                    data-level="${level}">
                ${text}
            </button>
        `;
    }).join('');
}

function generateId(text) {
    return text.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

function setupTableOfContentsEvents(toc) {
    const toggle = toc.querySelector('.TableOfContents__Toggle');
    const items = toc.querySelectorAll('.TableOfContents__Item');

    // Toggle expand/collapse
    if (toggle) {
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toc.classList.toggle('TableOfContents--collapsed');
            toc.classList.toggle('TableOfContents--expanded');
        });
    }

    // Click on TOC to expand (mobile)
    toc.addEventListener('click', (e) => {
        if (e.target === toc && toc.classList.contains('TableOfContents--collapsed')) {
            toc.classList.remove('TableOfContents--collapsed');
            toc.classList.add('TableOfContents--expanded');
        }
    });

    // Handle item clicks
    items.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                // Smooth scroll to target
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Update active state
                updateActiveItem(toc, targetId);

                // On mobile, collapse TOC after clicking
                if (window.innerWidth <= 1200) {
                    setTimeout(() => {
                        toc.classList.add('TableOfContents--collapsed');
                        toc.classList.remove('TableOfContents--expanded');
                    }, 500);
                }
            }
        });
    });

    // Close TOC when clicking outside (mobile)
    document.addEventListener('click', (e) => {
        if (!toc.contains(e.target) && toc.classList.contains('TableOfContents--expanded')) {
            toc.classList.add('TableOfContents--collapsed');
            toc.classList.remove('TableOfContents--expanded');
        }
    });

    // Handle escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && toc.classList.contains('TableOfContents--expanded')) {
            toc.classList.add('TableOfContents--collapsed');
            toc.classList.remove('TableOfContents--expanded');
        }
    });
}

function setupScrollSpy(toc, headings) {
    const items = toc.querySelectorAll('.TableOfContents__Item');
    if (items.length === 0) return;

    // Create intersection observer for headings
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetId = entry.target.id;
                updateActiveItem(toc, targetId);
            }
        });
    }, {
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    });

    // Observe all headings
    headings.forEach(heading => {
        if (heading.id) {
            observer.observe(heading);
        }
    });
}

function updateActiveItem(toc, targetId) {
    const items = toc.querySelectorAll('.TableOfContents__Item');

    items.forEach(item => {
        item.classList.remove('TableOfContents__Item--active');
        if (item.getAttribute('data-target') === targetId) {
            item.classList.add('TableOfContents__Item--active');

            // Scroll the active item into view in the TOC
            if (toc.classList.contains('TableOfContents--expanded')) {
                item.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }
        }
    });
}

// Handle window resize
window.addEventListener('resize', () => {
    const toc = document.querySelector('.TableOfContents');
    if (toc && window.innerWidth > 1200) {
        // On desktop, ensure TOC is expanded
        toc.classList.remove('TableOfContents--collapsed');
        toc.classList.remove('TableOfContents--expanded');
    }
}); 