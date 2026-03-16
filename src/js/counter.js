import { functions, FN_INCREMENT } from './appwrite.js';

export async function incrementVisitor(slug) {
  try {
    // Attempt via function first (cleaner, prevents race conditions)
    await functions.createExecution(FN_INCREMENT, JSON.stringify({ slug }));
  } catch (err) {
    console.warn("Function increment failed, trying client-side fallback...");
    
    // Fallback: Direct database update
    const { databases, DB_ID, COL_VISITORS } = await import('./appwrite.js');
    const { Query } = await import("https://cdn.jsdelivr.net/npm/appwrite@16/dist/esm/sdk.js");

    try {
      const result = await databases.listDocuments(DB_ID, COL_VISITORS, [Query.equal('slug', slug)]);
      if (result.documents.length > 0) {
        const doc = result.documents[0];
        await databases.updateDocument(DB_ID, COL_VISITORS, doc.$id, {
          count: (doc.count || 0) + 1
        });
      } else {
        await databases.createDocument(DB_ID, COL_VISITORS, 'unique()', {
          slug: slug,
          count: 1
        });
      }
    } catch (dbErr) {
      console.error("Direct increment also failed:", dbErr.message);
    }
  }
}

async function fetchVisitorCount(slug) {
  const { databases, DB_ID, COL_VISITORS } = await import('./appwrite.js');
  const { Query } = await import("https://cdn.jsdelivr.net/npm/appwrite@16/dist/esm/sdk.js");
  
  try {
    const result = await databases.listDocuments(DB_ID, COL_VISITORS, [
      Query.equal('slug', slug),
      Query.limit(1)
    ]);
    
    if (result.documents.length > 0) {
      return result.documents[0].count;
    }
  } catch (err) {
    console.warn("Failed to fetch visitor count:", err.message);
  }
  return null;
}

export async function updateVisitorDisplay(slug) {
  const countEl = document.getElementById('visitor-count');
  if (!countEl) return;
  
  const count = await fetchVisitorCount(slug);
  if (count !== null) {
    countEl.textContent = count.toLocaleString();
  }
}

export async function updateHomePageStats() {
  const { databases, DB_ID, COL_VISITORS } = await import('./appwrite.js');
  
  try {
    const result = await databases.listDocuments(DB_ID, COL_VISITORS);
    
    // Visitors = Total sum of all counts
    const totalVisitors = result.documents.reduce((sum, doc) => sum + (doc.count || 0), 0);
    
    // Readers = Sum of only episodes (slugs starting with 'ep')
    const totalReaders = result.documents
      .filter(doc => doc.slug && doc.slug.startsWith('ep'))
      .reduce((sum, doc) => sum + (doc.count || 0), 0);
    
    const visitorsEl = document.getElementById('total-visitors');
    if (visitorsEl) {
      visitorsEl.textContent = totalVisitors.toLocaleString();
    }
    
    const readersEl = document.getElementById('total-readers');
    if (readersEl) {
      readersEl.textContent = totalReaders.toLocaleString();
    }
  } catch (err) {
    console.warn("Failed to fetch home page stats:", err.message);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const slug = document.body.dataset.slug;
  const lang = document.body.dataset.lang;
  
  if (!slug) {
    await updateHomePageStats();
    return;
  }
  
  const isHomepage = slug === '' || slug === 'about' || slug === 'characters';
  
  if (isHomepage) {
    await updateHomePageStats();
    return;
  }
  
  const isEpisode = slug.startsWith('ep');
  if (isEpisode) {
    await incrementVisitor(slug);
    await updateVisitorDisplay(slug);
  }
});
