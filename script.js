// ==== CONFIG ====
const SUPABASE_URL = "https://jywhymtctdnvwwvxtcpw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_8-VfhsJiclZMwjjkZ-k18A_gLYKbaGR";
const BUSINESS_ID = "glammed-by-j";
const BUSINESS_NAME = "Glammed By J";
const SLOT_MINUTES = 30;

// EmailJS — fill these in once you've created your account, service, and
// template (see chat for the steps). Same account/template can be reused
// across all your sites.
const EMAILJS_SERVICE_ID = "service_zzjha2e";
const EMAILJS_TEMPLATE_ID = "template_khedkjr";
const EMAILJS_PUBLIC_KEY = "fs6q7ZsiYGhRUtas5";

// ASSUMPTION — real opening hours not confirmed yet. Swap these before
// this site is shown as final: Tuesday-Saturday, 9am-6pm.
const SCHEDULES = {
  standard: { days: [2, 3, 4, 5, 6], startHour: 9, endHour: 18 },
};

// ---- Demo data ----
// Glammed By J's real service list, pulled from the business's existing
// booking page. Each item's "duration" (minutes) is what the diary uses
// to block out the full length of an appointment, not just its start time.
const PRODUCTS = [
  // Manicure & Brows
  { id: 1, section: "manicure", name: "Gel Manicure", desc: "Classic gel polish manicure.", price: 20.00, emoji: "💅", duration: 60 },
  { id: 2, section: "manicure", name: "Nail Art Manicure", desc: "Gel manicure with custom nail art.", price: 30.00, emoji: "✨", duration: 105 },
  { id: 3, section: "manicure", name: "Soak Off", desc: "Removal of existing gel/acrylic.", price: 15.00, emoji: "🧴", duration: 90 },
  { id: 4, section: "manicure", name: "Brows (Wax & Tint)", desc: "Brow shaping with wax and tint.", price: 15.00, emoji: "👁️", duration: 30 },
  { id: 5, section: "manicure", name: "Gel Toes", desc: "Gel polish on toes.", price: 18.00, emoji: "🦶", duration: 60 },

  // Biab
  { id: 6, section: "biab", name: "Biab — Plain (One Colour)", desc: "Builder gel overlay, single colour.", price: 35.00, emoji: "💅", duration: 75 },
  { id: 7, section: "biab", name: "Biab — French Tip", desc: "Builder gel with a classic French tip.", price: 40.00, emoji: "💅", duration: 90 },
  { id: 8, section: "biab", name: "Biab — Simple Nail Art", desc: "Builder gel with a simple design or French tip art.", price: 40.00, emoji: "✨", duration: 105 },
  { id: 9, section: "biab", name: "Biab — Detailed Nail Art (3D)", desc: "Builder gel with detailed 3D nail art.", price: 40.00, emoji: "🎨", duration: 120 },
  { id: 10, section: "biab", name: "Biab On Toes", desc: "Builder gel overlay on toes.", price: 20.00, emoji: "🦶", duration: 60 },

  // Acrylic - New Set
  { id: 11, section: "acrylic-new", name: "Acrylic — Plain (One Gel Colour)", desc: "New acrylic set, single gel colour.", price: 38.00, emoji: "💅", duration: 80 },
  { id: 12, section: "acrylic-new", name: "Acrylic — French Tip", desc: "New acrylic set with French tip.", price: 40.00, emoji: "💅", duration: 105 },
  { id: 13, section: "acrylic-new", name: "Acrylic — Simple Nail Art", desc: "New acrylic set with French tip or simple design.", price: 40.00, emoji: "✨", duration: 120 },
  { id: 14, section: "acrylic-new", name: "Acrylic — Detailed Nail Art (3D)", desc: "New acrylic set with detailed 3D nail art.", price: 45.00, emoji: "🎨", duration: 140 },
  { id: 15, section: "acrylic-new", name: "Acrylic XL Nails", desc: "New acrylic set, extra length.", price: 50.00, emoji: "💎", duration: 165 },
  { id: 16, section: "acrylic-new", name: "Acrylic Overlay (Natural Nail)", desc: "Acrylic overlay on the natural nail.", price: 40.00, emoji: "💅", duration: 90 },

  // Acrylic - Infill
  { id: 17, section: "acrylic-infill", name: "Acrylic Infill — Plain", desc: "Infill of existing acrylics, single colour.", price: 35.00, emoji: "💅", duration: 90 },
  { id: 18, section: "acrylic-infill", name: "Acrylic Infill — French Tip/Design", desc: "Infill with French tip or simple design.", price: 40.00, emoji: "✨", duration: 105 },
  { id: 19, section: "acrylic-infill", name: "Acrylic Infill — Detailed Design (3D+)", desc: "Infill with detailed 3D nail art.", price: 40.00, emoji: "🎨", duration: 120 },
  { id: 20, section: "acrylic-infill", name: "XL Acrylic Infill", desc: "Infill for extra-length acrylics.", price: 50.00, emoji: "💎", duration: 150 },

  // Combos
  { id: 21, section: "combos", name: "Acrylic Nails + Brow", desc: "Acrylic set combined with brow wax & tint.", price: 53.00, emoji: "💅", duration: 110 },
  { id: 22, section: "combos", name: "Acrylic Set + Gel Toes", desc: "Acrylic nail set paired with gel polish on toes.", price: 58.00, emoji: "💅", duration: 165 },
];

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

if (window.emailjs && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

let basket = []; // { id, name, price, qty, duration }

function formatPrice(amount) {
  return `£${amount.toFixed(2)}`;
}

function formatDuration(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

const SECTIONS = [
  { key: "manicure", elementId: "product-list-manicure" },
  { key: "biab", elementId: "product-list-biab" },
  { key: "acrylic-new", elementId: "product-list-acrylic-new" },
  { key: "acrylic-infill", elementId: "product-list-acrylic-infill" },
  { key: "combos", elementId: "product-list-combos" },
];

function renderProducts() {
  SECTIONS.forEach(section => {
    const list = document.getElementById(section.elementId);
    list.innerHTML = "";
    PRODUCTS.filter(p => p.section === section.key).forEach(product => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <div class="product-photo">${product.emoji}</div>
        <div class="product-name">${product.name}</div>
        <div class="product-desc">${product.desc}</div>
        <div class="product-duration">${formatDuration(product.duration)}</div>
        <div class="product-footer">
          <span class="product-price">${formatPrice(product.price)}</span>
          <button class="add-btn" data-id="${product.id}">Add</button>
        </div>
      `;
      list.appendChild(card);
    });
  });

  document.querySelectorAll(".add-btn").forEach(btn => {
    btn.addEventListener("click", () => addToBasket(Number(btn.dataset.id)));
  });
}

function addToBasket(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  const existing = basket.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    basket.push({ id: product.id, name: product.name, price: product.price, qty: 1, duration: product.duration });
  }
  renderBasket();
  refreshSlotsForCurrentDate();
}

function removeFromBasket(productId) {
  basket = basket.filter(item => item.id !== productId);
  renderBasket();
  refreshSlotsForCurrentDate();
}

function renderBasket() {
  const container = document.getElementById("basket-items");
  const totalEl = document.getElementById("basket-total");

  if (basket.length === 0) {
    container.innerHTML = `<p class="empty-basket">Nothing added yet</p>`;
    totalEl.textContent = formatPrice(0);
    updateCheckoutAvailability();
    return;
  }

  container.innerHTML = "";
  let total = 0;
  basket.forEach(item => {
    const lineTotal = item.price * item.qty;
    total += lineTotal;
    const row = document.createElement("div");
    row.className = "basket-row";
    row.innerHTML = `
      <span>${item.qty} × ${item.name}</span>
      <span>${formatPrice(lineTotal)} <button data-id="${item.id}">remove</button></span>
    `;
    container.appendChild(row);
  });

  container.querySelectorAll("button[data-id]").forEach(btn => {
    btn.addEventListener("click", () => removeFromBasket(Number(btn.dataset.id)));
  });

  totalEl.textContent = formatPrice(total);
  updateCheckoutAvailability();
}

function getTotalDurationForBasket() {
  return basket.reduce((sum, item) => sum + item.duration * item.qty, 0);
}

function pad(n) {
  return String(n).padStart(2, "0");
}

function timeToMinutes(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function formatTimeLabel(t) {
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${pad(m)} ${period}`;
}

function buildAllSlotsForDay(schedule) {
  const slots = [];
  for (let mins = schedule.startHour * 60; mins < schedule.endHour * 60; mins += SLOT_MINUTES) {
    slots.push(`${pad(Math.floor(mins / 60))}:${pad(mins % 60)}`);
  }
  return slots;
}

async function refreshSlotsForCurrentDate() {
  const dateInput = document.getElementById("booking-date");
  const timeSelect = document.getElementById("time-slot");
  const message = document.getElementById("slot-message");
  const schedule = SCHEDULES.standard;

  if (basket.length === 0) {
    timeSelect.innerHTML = "";
    message.textContent = "Add something to your booking first.";
    updateCheckoutAvailability();
    return;
  }

  if (!dateInput.value) {
    timeSelect.innerHTML = "";
    message.textContent = "";
    updateCheckoutAvailability();
    return;
  }

  const selectedDate = new Date(dateInput.value + "T00:00:00");
  const dayOfWeek = selectedDate.getDay();

  if (!schedule.days.includes(dayOfWeek)) {
    timeSelect.innerHTML = "";
    message.textContent = "Glammed By J isn't open on that day — please pick Tuesday to Saturday.";
    updateCheckoutAvailability();
    return;
  }

  message.textContent = "Checking availability…";
  timeSelect.innerHTML = "";

  const totalDuration = getTotalDurationForBasket();
  const allSlots = buildAllSlotsForDay(schedule);
  const closingMinutes = schedule.endHour * 60;

  const { data, error } = await supabaseClient
    .from("bookings")
    .select("booking_time, duration_minutes")
    .eq("business_id", BUSINESS_ID)
    .eq("booking_date", dateInput.value);

  const existingBookings = error ? [] : data.map(row => ({
    start: timeToMinutes(row.booking_time.slice(0, 5)),
    end: timeToMinutes(row.booking_time.slice(0, 5)) + (row.duration_minutes || SLOT_MINUTES),
  }));

  const availableSlots = allSlots.filter(t => {
    const start = timeToMinutes(t);
    const end = start + totalDuration;
    if (end > closingMinutes) return false;
    const overlaps = existingBookings.some(b => start < b.end && end > b.start);
    return !overlaps;
  });

  if (availableSlots.length === 0) {
    message.textContent = "No times left on that day — please try another date.";
  } else {
    message.textContent = `This booking needs ${formatDuration(totalDuration)} in total.`;
    availableSlots.forEach(t => {
      const opt = document.createElement("option");
      opt.value = t;
      opt.textContent = formatTimeLabel(t);
      timeSelect.appendChild(opt);
    });
  }

  updateCheckoutAvailability();
}

function updateCheckoutAvailability() {
  const dateInput = document.getElementById("booking-date");
  const timeSelect = document.getElementById("time-slot");
  const nameInput = document.getElementById("customer-name");
  const emailInput = document.getElementById("customer-email");
  const phoneInput = document.getElementById("customer-phone");
  const checkoutBtn = document.getElementById("checkout-btn");
  checkoutBtn.disabled = basket.length === 0 || !dateInput.value || !timeSelect.value
    || !nameInput.value.trim() || !emailInput.value.trim() || !phoneInput.value.trim();
}

async function confirmBooking() {
  const dateInput = document.getElementById("booking-date");
  const timeSelect = document.getElementById("time-slot");
  const nameInput = document.getElementById("customer-name");
  const emailInput = document.getElementById("customer-email");
  const phoneInput = document.getElementById("customer-phone");
  const date = dateInput.value;
  const time = timeSelect.value;

  if (basket.length === 0 || !date || !time || !nameInput.value.trim() || !emailInput.value.trim() || !phoneInput.value.trim()) return;

  const serviceNames = basket.map(i => `${i.qty} x ${i.name}`).join(", ");
  const total = basket.reduce((sum, i) => sum + i.price * i.qty, 0);
  const totalDuration = getTotalDurationForBasket();

  const { error } = await supabaseClient.from("bookings").insert({
    business_id: BUSINESS_ID,
    booking_date: date,
    booking_time: time,
    service_names: serviceNames,
    total_price: total,
    customer_name: nameInput.value.trim(),
    customer_email: emailInput.value.trim(),
    customer_phone: phoneInput.value.trim(),
    duration_minutes: totalDuration,
  });

  if (error) {
    if (error.code === "23505") {
      alert("Sorry, someone just booked that exact start time. Please pick a different time.");
      refreshSlotsForCurrentDate();
    } else {
      alert("Something went wrong saving the booking — please try again.");
      console.error(error);
    }
    return;
  }

  // Send a confirmation email — if this fails for any reason (EmailJS not
  // configured yet, network issue) the booking itself has still succeeded,
  // so we don't block the confirmation on it.
  if (window.emailjs && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      to_email: emailInput.value.trim(),
      to_name: nameInput.value.trim(),
      business_name: BUSINESS_NAME,
      service_names: serviceNames,
      booking_date: date,
      booking_time: formatTimeLabel(time),
      total_price: formatPrice(total),
    }).catch(err => console.error("Confirmation email failed to send:", err));
  }

  document.getElementById("confirmation-overlay").classList.remove("hidden");
  basket = [];
  renderBasket();
  document.getElementById("time-slot").innerHTML = "";
  document.getElementById("slot-message").textContent = "";
  nameInput.value = "";
  emailInput.value = "";
  phoneInput.value = "";
}

function setupCheckout() {
  const overlay = document.getElementById("confirmation-overlay");
  const closeBtn = document.getElementById("close-overlay");
  document.getElementById("checkout-btn").addEventListener("click", confirmBooking);
  closeBtn.addEventListener("click", () => overlay.classList.add("hidden"));
}

function setupDatePicker() {
  const dateInput = document.getElementById("booking-date");
  const today = new Date();
  dateInput.min = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
  dateInput.addEventListener("change", refreshSlotsForCurrentDate);
}

document.getElementById("time-slot").addEventListener("change", updateCheckoutAvailability);
document.getElementById("customer-name").addEventListener("input", updateCheckoutAvailability);
document.getElementById("customer-email").addEventListener("input", updateCheckoutAvailability);
document.getElementById("customer-phone").addEventListener("input", updateCheckoutAvailability);

renderProducts();
renderBasket();
setupDatePicker();
setupCheckout();
