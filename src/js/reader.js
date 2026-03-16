/**
 * Book-Style Reader Logic
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
    
    // Split by markers or headers
    // Using a more robust splitting strategy
    let sections = rawHTML.split(/(?=<h3|<hr|✦|────────────────────────────|<h2>)/i);
    
    // Filter out empty sections
    sections = sections.filter(s => s.trim().length > 5);

    // If we only have one section or it's too long, split by paragraphs
    if (sections.length <= 1 || sections.some(s => s.length > 3000)) {
        const tempSections = [];
        for (let section of sections) {
            if (section.length > 3000) {
                const paragraphs = section.split('</p>');
                let currentChunk = "";
                for (let p of paragraphs) {
                    if (!p.trim()) continue;
                    currentChunk += p + "</p>";
                    if (currentChunk.length > 2000) {
                        tempSections.push(currentChunk);
                        currentChunk = "";
                    }
                }
                if (currentChunk) tempSections.push(currentChunk);
            } else {
                tempSections.push(section);
            }
        }
        sections = tempSections;
    }

    // fallback if everything went wrong
    if (sections.length === 0) {
        sections = [rawHTML];
    }

    // Clear and build pages
    wrapper.innerHTML = '';
    sections.forEach((content, index) => {
        const page = document.createElement('div');
        page.className = `book-page episode-body ${index === 0 ? 'active' : ''}`;
        page.innerHTML = content;
        wrapper.appendChild(page);
    });

    // 2. NAVIGATION LOGIC
    let currentPage = 0;
    const totalPages = sections.length;

    function updateView(instant = false) {
        if (instant) {
            wrapper.style.transition = 'none';
        } else {
            wrapper.style.transition = 'transform 0.4s cubic-bezier(0.2, 0, 0.2, 1)';
        }
        
        wrapper.style.transform = `translateX(-${currentPage * 100}%)`;
        
        document.querySelectorAll('.book-page').forEach((p, idx) => {
            p.classList.toggle('active', idx === currentPage);
        });

        if (prevBtn) prevBtn.disabled = currentPage === 0;
        if (nextBtn) nextBtn.disabled = currentPage === totalPages - 1;
        
        if (indicator) {
            indicator.textContent = `Page ${currentPage + 1} of ${totalPages}`;
        }
        
        if (!instant) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    nextBtn?.addEventListener('click', () => {
        if (currentPage < totalPages - 1) {
            currentPage++;
            updateView();
        }
    });

    prevBtn?.addEventListener('click', () => {
        if (currentPage > 0) {
            currentPage--;
            updateView();
        }
    });

    // 3. KEYBOARD SUPPORT
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') nextBtn?.click();
        if (e.key === 'ArrowLeft') prevBtn?.click();
    });

    // 4. SWIPE SUPPORT
    let touchStartX = 0;
    let touchEndX = 0;

    wrapper.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    wrapper.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const threshold = 50;
        if (touchStartX - touchEndX > threshold) nextBtn?.click();
        else if (touchEndX - touchStartX > threshold) prevBtn?.click();
    }, { passive: true });

    // Initialize
    updateView(true);
});
