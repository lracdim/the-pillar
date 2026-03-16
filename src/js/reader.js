/**
 * Book-Style Reader Logic
 * Splits vertical content into horizontal pages for a "book-like" experience.
 */

document.addEventListener('DOMContentLoaded', () => {
    const body = document.getElementById('episode-body');
    const wrapper = document.getElementById('book-wrapper');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const indicator = document.getElementById('page-indicator');
    
    if (!body || !wrapper) return;

    // 1. SPLIT CONTENT INTO PAGES
    const rawHTML = body.innerHTML;
    
    // Split by markers: ✦, ────────────────────────────, or H3 headers
    // We use a regex to find these points and split the content
    const markers = [
        /<hr[^>]*>/i, 
        /✦/, 
        /────────────────────────────/,
        /<h3/i
    ];

    // Combine into one master split pattern
    // We want to keep the delimiter in some cases (headers), so we use positive lookahead
    let sections = rawHTML.split(/(?=<h3|<hr|✦|────────────────────────────)/i);
    
    // Filter out very small or empty sections
    sections = sections.filter(s => s.trim().length > 10);

    // If we only have one section, it's not a book! 
    // Let's force split by paragraph if it's too long
    if (sections.length <= 1) {
        const paragraphs = rawHTML.split('</p>');
        sections = [];
        let currentChunk = "";
        for (let p of paragraphs) {
            currentChunk += p + "</p>";
            if (currentChunk.length > 1500) { // Approx 1500 chars per page
                sections.push(currentChunk);
                currentChunk = "";
            }
        }
        if (currentChunk) sections.push(currentChunk);
    }

    // Clear and build pages
    wrapper.innerHTML = '';
    sections.forEach((content, index) => {
        const page = document.createElement('div');
        // Add both classes to keep the beautiful typography
        page.className = `book-page episode-body ${index === 0 ? 'active' : ''}`;
        page.innerHTML = content;
        wrapper.appendChild(page);
    });

    // 2. NAVIGATION LOGIC
    let currentPage = 0;
    const totalPages = sections.length;

    function updateView() {
        const width = wrapper.parentElement.offsetWidth;
        wrapper.style.transform = `translateX(-${currentPage * 100}%)`;
        
        // Update active class
        document.querySelectorAll('.book-page').forEach((p, idx) => {
            p.classList.toggle('active', idx === currentPage);
        });

        // Update buttons
        prevBtn.disabled = currentPage === 0;
        nextBtn.disabled = currentPage === totalPages - 1;
        
        // Update indicator
        indicator.textContent = `Page ${currentPage + 1} of ${totalPages}`;
        
        // Scroll to top of content
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages - 1) {
            currentPage++;
            updateView();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentPage > 0) {
            currentPage--;
            updateView();
        }
    });

    // 3. SWIPE SUPPORT
    let touchStartX = 0;
    let touchEndX = 0;

    wrapper.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    wrapper.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const threshold = 50;
        if (touchStartX - touchEndX > threshold) {
            // Swipe Left -> Next
            nextBtn.click();
        } else if (touchEndX - touchStartX > threshold) {
            // Swipe Right -> Prev
            prevBtn.click();
        }
    }

    // Initialize
    updateView();
});
