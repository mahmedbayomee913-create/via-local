import { db } from './_lib/db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return res.status(405).end(); }
  try {
    const [destinations, guides, experiences, reviews] = await Promise.all([
      db('destinations?select=*&published=eq.true&order=featured.desc,name_en.asc&limit=200'),
      db('guides?select=*&published=eq.true&order=verified.desc,name_en.asc&limit=200'),
      db('experiences?select=*&published=eq.true&order=created_at.desc&limit=200'),
      db('reviews?select=id,destination_id,guide_id,author_name,rating,comment,created_at&approved=eq.true&order=created_at.desc&limit=500')
    ]);
    const destinationRatings = {};
    const guideRatings = {};
    for (const review of reviews || []) {
      const key = review.destination_id ? 'destination' : 'guide';
      const id = review.destination_id || review.guide_id;
      const map = key === 'destination' ? destinationRatings : guideRatings;
      if (!map[id]) map[id] = { total: 0, count: 0, average: 0 };
      map[id].total += Number(review.rating);
      map[id].count += 1;
      map[id].average = Math.round((map[id].total / map[id].count) * 10) / 10;
    }
    return res.status(200).json({ destinations, guides, experiences, reviews, ratings: { destinations: destinationRatings, guides: guideRatings } });
  } catch (e) {
    console.error('catalog load error', e.message);
    return res.status(503).json({ error: 'Catalog is temporarily unavailable.' });
  }
}
