# Glow & Grace — Premium multi-page website

## Pages
- `index.html` — premium home page, doorstep highlights and Mumbai service-area map
- `services.html` — categorized ladies' beauty service catalogue
- `booking.html` — separate appointment request page with address search, current location and draggable map pin
- `contact.html` — contact details, service-area map and pricing enquiry cards
- `styles.css` — responsive luxury styling
- `script.js` — navigation, call/WhatsApp links, map markers and booking form

## Required setup before publishing
1. Open `script.js` and replace `WHATSAPP_NUMBER = "91XXXXXXXXXX"` with the business WhatsApp number (country code + digits only; e.g. 919876543210).
2. Replace `PHONE_NUMBER = "+91XXXXXXXXXX"` with the actual business phone number.
3. Replace the `SERVICE_AREAS` sample coordinates/names with exact areas where the Mumbai business really provides doorstep services. The current pins are explicitly placeholders near central Mumbai and must not be represented as confirmed coverage.
4. In `contact.html`, add actual business hours, contact details and approved service prices. Prices are currently “Enquire” because no price list was provided.
5. Review the service catalogue and remove any treatments the business does not offer. Add exact inclusions, durations and rates supplied by the owner.
6. Replace the stock photos with licensed business photos where possible.
7. The booking form opens WhatsApp with customer details, address and selected map coordinates. It does not store data in a database or auto-confirm bookings.
8. Map tiles use OpenStreetMap via Leaflet. Address search/reverse lookup uses the public Nominatim endpoint; it requires internet and is subject to its usage policy/rate limits. For production/high-volume usage, configure a suitable geocoding provider. Browser geolocation requires HTTPS (or localhost) and customer permission.
9. The red floating phone button has a ringing/pulsing visual animation; tapping it starts a normal phone call via `tel:`. It cannot force the phone to ring remotely.
10. The service area map uses illustrative placeholder pins until exact operating areas are supplied.

## Run locally
Open `index.html` or use VS Code Live Server. Internet is needed for Google Fonts, Leaflet map assets, map tiles and geocoding.

## Publish
Upload all files to a static host such as Netlify, GitHub Pages or Vercel. Keep the files together in the same directory.
