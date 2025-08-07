// Toggle Headers for Notablog
// Automatically converts H1 headers into toggleable sections

document.addEventListener('DOMContentLoaded', function () {
    // Find all H1 headers in the post content only
    // Exclude headers in navigation, site header, and other non-content areas
    const contentArea = document.querySelector('.PageRoot') || document.body;
    const h1Headers = contentArea.querySelectorAll('h1');

    h1Headers.forEach(function (h1, index) {
        // Skip headers that are in navigation, site header, or other non-content areas
        if (h1.closest('.Header') ||
            h1.closest('header') ||
            h1.closest('nav') ||
            h1.closest('.navbar') ||
            h1.classList.contains('Header__Title')) {
            return;
        }

        // Create a wrapper div for the toggle
        const toggleWrapper = document.createElement('details');
        toggleWrapper.className = 'Toggle';
        
        // Keep the last (newest) toggle open, close all others
        if (index === h1Headers.length - 1) {
            toggleWrapper.setAttribute('open', ''); // Keep newest open
        }
        // All other toggles start closed by default

        // Create the summary element (the clickable header)
        const summary = document.createElement('summary');
        summary.className = 'Toggle__Summary';

        // Create an H1 element inside the summary to maintain typography
        const h1Element = document.createElement('h1');
        h1Element.className = h1.className; // Preserve original classes
        h1Element.innerHTML = h1.innerHTML; // Move the H1 content

        // Add the H1 element to the summary
        summary.appendChild(h1Element);

        // Create content wrapper
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'Toggle__Content';

        // Find all elements that should be inside this toggle
        // (everything between this H1 and the next H1 or end of content)
        let nextElement = h1.nextElementSibling;
        const elementsToMove = [];

        while (nextElement && nextElement.tagName !== 'H1') {
            elementsToMove.push(nextElement);
            nextElement = nextElement.nextElementSibling;
        }

        // Move all elements to the content wrapper
        elementsToMove.forEach(function (element) {
            contentWrapper.appendChild(element);
        });

        // Assemble the toggle
        toggleWrapper.appendChild(summary);
        toggleWrapper.appendChild(contentWrapper);

        // Replace the H1 with the toggle
        h1.parentNode.insertBefore(toggleWrapper, h1);
        h1.remove();
    });

    // Add keyboard navigation support
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            const activeElement = document.activeElement;
            if (activeElement && activeElement.classList.contains('Toggle__Summary')) {
                e.preventDefault();
                const toggle = activeElement.closest('.Toggle');
                if (toggle) {
                    toggle.open = !toggle.open;
                }
            }
        }
    });

    // Add click outside to close functionality (optional)
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.Toggle')) {
            // Optional: Close all toggles when clicking outside
            // Uncomment the next line if you want this behavior
            // document.querySelectorAll('.Toggle').forEach(toggle => toggle.open = false);
        }
    });
}); 