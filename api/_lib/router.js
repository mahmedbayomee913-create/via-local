import guideRequests from './routes/guide-requests.js';
import catalog from './routes/catalog.js';
import worldDestinations from './routes/world-destinations.js';
import bookings from './routes/bookings.js';
import reviews from './routes/reviews.js';
import itinerary from './routes/itinerary.js';
import passport from './routes/passport.js';
import guideApplications from './routes/guide-applications.js';

import adminLogin from './routes/admin-login.js';
import adminRequests from './routes/admin-requests.js';
import adminRequestsId from './routes/admin-requests-id.js.js';
import adminContent from './routes/admin-content.js';
import adminContentId from './routes/admin-content-id.js.js';
import adminBookings from './routes/admin-bookings.js';
import adminBookingsId from './routes/admin-bookings-id.js.js';
import adminReviews from './routes/admin-reviews.js';
import adminReviewsId from './routes/admin-reviews-id.js.js';
import adminGuideApplications from './routes/admin-guide-applications.js';
import adminGuideApplicationsId from './routes/admin-guide-applications-id.js.js';

import customerAuth from './routes/customer-auth.js';
import customerMe from './routes/customer-me.js';
import customerBookings from './routes/customer-bookings.js';

export default async function handler(req, res) {
  const url = new URL(req.url || '/', 'https://via-local.invalid');
  const pathParts = url.pathname.split('/').filter(Boolean);
  const parts = pathParts[0] === 'api' ? pathParts.slice(1) : pathParts;
  req.query = { ...(req.query || {}), ...Object.fromEntries(url.searchParams.entries()) };

  const [section, sub, id] = parts;
  if (id) req.query.id = decodeURIComponent(id);

  if (section === 'guide-requests') return guideRequests(req, res);
  if (section === 'catalog') return catalog(req, res);
  if (section === 'world-destinations') return worldDestinations(req, res);
  if (section === 'bookings') return bookings(req, res);
  if (section === 'reviews') return reviews(req, res);
  if (section === 'itinerary') return itinerary(req, res);
  if (section === 'passport') return passport(req, res);
  if (section === 'guide-applications') return guideApplications(req, res);

  if (section === 'customer') {
    if (sub === 'auth') return customerAuth(req, res);
    if (sub === 'me') return customerMe(req, res);
    if (sub === 'bookings') return customerBookings(req, res);
  }

  if (section === 'admin') {
    if (sub === 'login') return adminLogin(req, res);
    if (sub === 'requests') return id ? adminRequestsId(req, res) : adminRequests(req, res);
    if (sub === 'content') return id ? adminContentId(req, res) : adminContent(req, res);
    if (sub === 'bookings') return id ? adminBookingsId(req, res) : adminBookings(req, res);
    if (sub === 'reviews') return id ? adminReviewsId(req, res) : adminReviews(req, res);
    if (sub === 'guide-applications') return id ? adminGuideApplicationsId(req, res) : adminGuideApplications(req, res);
  }

  return res.status(404).json({ error: 'API route not found.' });
}
