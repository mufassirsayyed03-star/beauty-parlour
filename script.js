// SETUP: replace the number below with the business WhatsApp number (country code + digits).
const WHATSAPP_NUMBER = "919371544016";
const PHONE_NUMBER = "+919371544016";
const SERVICE_AREAS = [
  // Replace these sample map pins with the exact neighbourhoods actually served.
  {name:"Add your first service area", lat:19.0760, lng:72.8777},
  {name:"Add your second service area", lat:19.1136, lng:72.8697},
  {name:"Add your third service area", lat:19.0596, lng:72.8295}
];

const menuButton=document.querySelector(".menu");
const nav=document.querySelector(".nav");
menuButton?.addEventListener("click",()=>{const open=nav.classList.toggle("open");menuButton.setAttribute("aria-expanded",String(open));});
nav?.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));
document.querySelectorAll("[data-year]").forEach(el=>el.textContent=new Date().getFullYear());

function waLink(message){return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;}
document.querySelectorAll(".whatsapp-link").forEach(a=>a.href=waLink("Hello Glow & Grace! I would like to enquire about your ladies-only at-home beauty services."));
document.querySelectorAll(".call-link").forEach(a=>a.href=`tel:${PHONE_NUMBER}`);
document.querySelectorAll("[data-book-service]").forEach(a=>a.addEventListener("click",()=>{sessionStorage.setItem("ggSelectedService",a.dataset.bookService);}));

// Home / contact: service-area pins. These are demo placeholders until the owner confirms coverage.
const areaMapEl=document.getElementById("serviceAreaMap");
if(areaMapEl && window.L){
  const map=L.map(areaMapEl).setView([19.0760,72.8777],10);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:'&copy; OpenStreetMap contributors'}).addTo(map);
  const redIcon=L.divIcon({className:"",html:'<div class="pin-dot"></div>',iconSize:[25,25],iconAnchor:[12,24]});
  SERVICE_AREAS.forEach(area=>L.marker([area.lat,area.lng],{icon:redIcon}).addTo(map).bindPopup(`<strong>${area.name}</strong><br>Doorstep coverage area — confirm with our team.`));
}

// Booking map and address picker (Leaflet + OpenStreetMap; no Google API key required).
const bookingMapEl=document.getElementById("bookingMap");
if(bookingMapEl && window.L){
  const status=document.getElementById("locationStatus");
  const address=document.getElementById("bookingAddress");
  const latField=document.getElementById("latitude");
  const lngField=document.getElementById("longitude");
  const map=L.map(bookingMapEl).setView([19.0760,72.8777],11);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:'&copy; OpenStreetMap contributors'}).addTo(map);
  const redIcon=L.divIcon({className:"",html:'<div class="pin-dot"></div>',iconSize:[25,25],iconAnchor:[12,24]});
  let marker=null;
  async function reverseLookup(lat,lng){
    status.textContent="Getting address from map pin…";
    latField.value=lat.toFixed(6);lngField.value=lng.toFixed(6);
    try{
      const res=await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
      if(!res.ok) throw new Error("Address lookup unavailable");
      const data=await res.json();
      if(data.display_name) address.value=data.display_name;
      status.textContent="Location selected. Please verify the address before submitting.";
    }catch(e){status.textContent="Pin saved. Please type your full address in the address box.";}
  }
  function setPin(lat,lng,zoom=true){
    if(marker) marker.setLatLng([lat,lng]); else marker=L.marker([lat,lng],{icon:redIcon,draggable:true}).addTo(map);
    marker.off("dragend");marker.on("dragend",e=>{const p=e.target.getLatLng();reverseLookup(p.lat,p.lng);});
    if(zoom) map.setView([lat,lng],16);
    reverseLookup(lat,lng);
  }
  map.on("click",e=>setPin(e.latlng.lat,e.latlng.lng,false));
  
const locationButton = document.getElementById("useMyLocation");

locationButton?.addEventListener("click", async () => {

  // Check browser support
  if (!navigator.geolocation) {
    status.textContent =
      "Your browser does not support location. Please select your location manually.";
    return;
  }

  // Location requires HTTPS or localhost
  if (!window.isSecureContext) {
    status.textContent =
      "Location requires a secure HTTPS connection. Please open the website using HTTPS.";
    return;
  }

  locationButton.disabled = true;
  locationButton.textContent = "Locating...";

  status.textContent = "Please allow location access in your browser.";

  try {

    // Check current browser permission
    if (navigator.permissions) {
      const permission = await navigator.permissions.query({
        name: "geolocation"
      });

      if (permission.state === "denied") {
        throw new Error("PERMISSION_DENIED");
      }
    }

    // This triggers the browser's native Allow / Block popup
    navigator.geolocation.getCurrentPosition(

      async (position) => {

        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        // Automatically place the red pin
        setPin(latitude, longitude, true);

        status.textContent =
          "Location detected successfully! Getting your address...";

        locationButton.disabled = false;
        locationButton.textContent = "◎ Use my current location";

      },

      (error) => {

        if (error.code === 1) {
          status.textContent =
            "Location permission denied. Please allow location access from your browser site settings.";
        }

        else if (error.code === 2) {
          status.textContent =
            "Your location is currently unavailable. Please try again.";
        }

        else if (error.code === 3) {
          status.textContent =
            "Location request timed out. Please try again.";
        }

        else {
          status.textContent =
            "Unable to detect your location. Please select the map pin manually.";
        }

        locationButton.disabled = false;
        locationButton.textContent = "◎ Use my current location";

      },

      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0
      }

    );

  } catch (error) {

    if (error.message === "PERMISSION_DENIED") {
      status.textContent =
        "Location is blocked for this website. Open browser site settings and change Location to Allow.";
    } else {
      status.textContent =
        "Unable to request location permission. Please check your browser settings.";
    }

    locationButton.disabled = false;
    locationButton.textContent = "◎ Use my current location";

  }

});

  document.getElementById("findAddress")?.addEventListener("click",async()=>{
    const q=address.value.trim();if(!q){status.textContent="Type an address or area first.";return;}
    status.textContent="Searching for this address…";
    try{
      const res=await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(q+", Mumbai, India")}`);
      const results=await res.json();if(!results.length) throw new Error("No result");
      setPin(Number(results[0].lat),Number(results[0].lon));
    }catch(e){status.textContent="Address not found. Try a nearby landmark or select the pin on the map.";}
  });
  document.getElementById("bookingForm")?.addEventListener("submit",e=>{
    e.preventDefault();const form=e.currentTarget;
    if(!form.reportValidity()) return;
    if(WHATSAPP_NUMBER.includes("X")){document.getElementById("bookingError").textContent="Setup needed: add the real WhatsApp number in script.js.";return;}
    const d=new FormData(form);
    const msg=[
      "Hello Glow & Grace! I would like to request an at-home beauty appointment.","",
      `Name: ${d.get("name")}`,`Mobile: ${d.get("phone")}`,`Service: ${d.get("service")}`,
      `Date: ${d.get("date")}`,`Time: ${d.get("time")}`,`Address: ${d.get("address")}`,
      `Map coordinates: ${d.get("latitude")||"Not shared"}, ${d.get("longitude")||"Not shared"}`,
      `Notes: ${d.get("notes")||"None"}`,"",
      "Please confirm service availability, travel coverage and final price. I understand the booking is confirmed only after your team replies."
    ].join("\\n");
    window.open(waLink(msg),"_blank","noopener,noreferrer");
  });
}
