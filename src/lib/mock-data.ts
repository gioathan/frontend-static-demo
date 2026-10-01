// Static fixture data for the design-tool demo copy of this app.
// Mirrors backend/app/seed.py so the rendered pages look like the real
// (seeded) dev environment, but everything here is in-memory only — no
// database, no network calls.

import type {
  Booking,
  BookingStatus,
  ContentSection,
  PageContent,
  PendingTripComment,
  RaceCategory,
  SectionType,
  TripCategory,
  TripDetail,
  TripListItem,
  TravelProfile,
  TripStats,
  UserPublic,
} from "@/types/api";

export type Locale = "en" | "el";

function img(seed: string, w = 1200, h = 800): string {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

// --- Race categories ---

const RACE_CATEGORIES_RAW = [
  { slug: "5km", en: "5km", el: "5χλμ" },
  { slug: "10km", en: "10km", el: "10χλμ" },
  { slug: "half-marathon", en: "Half Marathon", el: "Ημιμαραθώνιος" },
  { slug: "marathon", en: "Marathon", el: "Μαραθώνιος" },
] as const;

export function getRaceCategories(locale: Locale): RaceCategory[] {
  return RACE_CATEGORIES_RAW.map((c, i) => ({ id: i + 1, slug: c.slug, name: locale === "el" ? c.el : c.en }));
}

function raceCategoryById(id: number, locale: Locale): RaceCategory {
  const raw = RACE_CATEGORIES_RAW[id - 1];
  return { id, slug: raw.slug, name: locale === "el" ? raw.el : raw.en };
}

const INCLUSIONS_RAW = [
  { icon: "hotel", en: "3 nights in a 4-star hotel near the start line", el: "3 διανυκτερεύσεις σε ξενοδοχείο 4 αστέρων κοντά στην αφετηρία" },
  { icon: "bib", en: "Guaranteed race entry (bib)", el: "Εγγυημένη συμμετοχή στον αγώνα" },
  { icon: "transfer", en: "Airport and race-day transfers", el: "Μεταφορές από/προς αεροδρόμιο και την ημέρα του αγώνα" },
  { icon: "run", en: "Guided shake-out run the day before", el: "Χαλαρό προπονητικό τρέξιμο με οδηγό την προηγούμενη μέρα" },
  { icon: "dinner", en: "Pasta party dinner with the group", el: "Δείπνο pasta party με την ομάδα" },
  { icon: "kit", en: "Team running shirt", el: "Τεχνικό μπλουζάκι της ομάδας" },
] as const;

function inclusionLabels(locale: Locale): string[] {
  return INCLUSIONS_RAW.map((i) => (locale === "el" ? i.el : i.en));
}

// --- Trips ---

interface RawTrip {
  slug: string;
  cityEn: string;
  cityEl: string;
  countryEn: string;
  countryEl: string;
  offsetDays: number;
  nights: number;
  categories: { categoryId: number; price: number }[];
  featured: boolean;
  full: boolean;
}

const TRIPS_RAW: RawTrip[] = [
  { slug: "madrid-10k", cityEn: "Madrid", cityEl: "Μαδρίτη", countryEn: "Spain", countryEl: "Ισπανία", offsetDays: 30, nights: 3, categories: [{ categoryId: 1, price: 390 }, { categoryId: 2, price: 420 }], featured: true, full: false },
  { slug: "lisbon-half", cityEn: "Lisbon", cityEl: "Λισαβόνα", countryEn: "Portugal", countryEl: "Πορτογαλία", offsetDays: 55, nights: 3, categories: [{ categoryId: 2, price: 460 }, { categoryId: 3, price: 520 }], featured: true, full: false },
  { slug: "berlin-marathon", cityEn: "Berlin", cityEl: "Βερολίνο", countryEn: "Germany", countryEl: "Γερμανία", offsetDays: 80, nights: 4, categories: [{ categoryId: 4, price: 890 }], featured: true, full: true },
  { slug: "rome-half", cityEn: "Rome", cityEl: "Ρώμη", countryEn: "Italy", countryEl: "Ιταλία", offsetDays: 110, nights: 3, categories: [{ categoryId: 1, price: 370 }, { categoryId: 3, price: 540 }], featured: false, full: false },
  { slug: "paris-10k", cityEn: "Paris", cityEl: "Παρίσι", countryEn: "France", countryEl: "Γαλλία", offsetDays: 140, nights: 2, categories: [{ categoryId: 2, price: 480 }], featured: false, full: false },
  { slug: "vienna-marathon", cityEn: "Vienna", cityEl: "Βιέννη", countryEn: "Austria", countryEl: "Αυστρία", offsetDays: 175, nights: 4, categories: [{ categoryId: 3, price: 610 }, { categoryId: 4, price: 790 }], featured: true, full: false },
  { slug: "athens-classic", cityEn: "Athens", cityEl: "Αθήνα", countryEn: "Greece", countryEl: "Ελλάδα", offsetDays: -45, nights: 3, categories: [{ categoryId: 1, price: 250 }, { categoryId: 2, price: 280 }, { categoryId: 4, price: 450 }], featured: false, full: false },
  { slug: "prague-half", cityEn: "Prague", cityEl: "Πράγα", countryEn: "Czechia", countryEl: "Τσεχία", offsetDays: -120, nights: 3, categories: [{ categoryId: 3, price: 500 }], featured: false, full: false },
];

function addDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function tripCategories(raw: RawTrip, locale: Locale): TripCategory[] {
  return raw.categories.map((c, i) => ({
    id: raw.slug.length * 100 + i, // stable-ish synthetic id
    race_category: raceCategoryById(c.categoryId, locale),
    price: c.price,
    capacity: 20,
  }));
}

function buildTripListItem(raw: RawTrip, locale: Locale): TripListItem {
  const city = locale === "el" ? raw.cityEl : raw.cityEn;
  const country = locale === "el" ? raw.countryEl : raw.countryEn;
  const start = addDays(raw.offsetDays);
  const end = addDays(raw.offsetDays + raw.nights);
  const title = locale === "el" ? `Δρομικό ταξίδι: ${raw.cityEl}` : `Run ${raw.cityEn}`;
  const summary =
    locale === "el"
      ? `Τρέξε στους δρόμους της πόλης ${raw.cityEl} με ξενοδοχείο, συμμετοχή και μεταφορές οργανωμένα για σένα.`
      : `Race through the streets of ${raw.cityEn} with hotel, entry and transfers all sorted for you.`;
  const durationLabel =
    locale === "el" ? `${raw.nights + 1} ημέρες / ${raw.nights} νύχτες` : `${raw.nights + 1} days / ${raw.nights} nights`;

  return {
    id: TRIPS_RAW.indexOf(raw) + 1,
    slug: raw.slug,
    cover_image_url: img(raw.slug),
    location_city: city,
    location_country: country,
    start_date: start,
    end_date: end,
    title,
    summary,
    duration_label: durationLabel,
    categories: tripCategories(raw, locale),
    inclusion_labels: inclusionLabels(locale),
    is_full: raw.full,
    is_featured: raw.featured,
  };
}

function tripDescription(raw: RawTrip, locale: Locale): string {
  const city = locale === "el" ? raw.cityEl : raw.cityEn;
  if (locale === "el") {
    return (
      `Έλα μαζί μας για ένα αγωνιστικό Σαββατοκύριακο στην πόλη ${city}. Αναλαμβάνουμε όλη την ` +
      `οργάνωση — συμμετοχή, διαμονή και μεταφορές — ώστε να επικεντρωθείς στο τρέξιμο.\n\n` +
      `Χαλαρή μέρα άφιξης, προπονητικό τρέξιμο με οδηγό, pasta party με άλλους δρομείς ` +
      `και άφθονος χρόνος για να γνωρίσεις την πόλη μετά τον τερματισμό.`
    );
  }
  return (
    `Join our group for a race weekend in ${city}. We handle the logistics — race entry, ` +
    `accommodation and transfers — so you can focus on the run.\n\n` +
    `Expect a relaxed arrival day, a guided shake-out run, a pasta party with fellow runners, ` +
    `and plenty of time to explore the city after you cross the finish line.`
  );
}

function buildTripDetail(raw: RawTrip, locale: Locale): TripDetail {
  return {
    ...buildTripListItem(raw, locale),
    description: tripDescription(raw, locale),
    images: [0, 1, 2].map((i) => img(`${raw.slug}-${i}`)),
  };
}

export function listTrips(locale: Locale): TripListItem[] {
  return TRIPS_RAW.map((raw) => buildTripListItem(raw, locale));
}

export function getTripDetail(slug: string, locale: Locale): TripDetail | null {
  const raw = TRIPS_RAW.find((t) => t.slug === slug);
  if (!raw) return null;
  return buildTripDetail(raw, locale);
}

export function getTripStats(): TripStats {
  const countries = new Set(TRIPS_RAW.map((t) => t.countryEn)).size;
  return {
    races_organized: TRIPS_RAW.length,
    countries,
  };
}

export function getPendingTripComments(): PendingTripComment[] {
  return TRIPS_RAW.slice(0, 3).map((raw, index) => {
    const trip = buildTripListItem(raw, "en");
    return {
      trip_id: trip.id,
      slug: trip.slug,
      title: trip.title,
      cover_image_url: trip.cover_image_url,
      start_date: trip.start_date,
      end_date: trip.end_date,
    };
  });
}

// --- Content pages (CMS sections) ---

function section(id: number, type: SectionType, sort_order: number, data: Record<string, unknown>): ContentSection {
  return { id, type, sort_order, data };
}

const FAQ_EN = [
  { question: "Is race entry included?", answer: "Yes — every trip includes a guaranteed bib for the distance you book." },
  { question: "Can I bring a non-running companion?", answer: "Yes. Contact us and we'll arrange a companion package." },
  { question: "What is the cancellation policy?", answer: "Full refund up to 60 days before departure, 50% up to 30 days." },
];
const FAQ_EL = [
  { question: "Περιλαμβάνεται η συμμετοχή στον αγώνα;", answer: "Ναι — κάθε ταξίδι περιλαμβάνει εγγυημένη συμμετοχή στην απόσταση που επιλέγεις." },
  { question: "Μπορώ να φέρω συνοδό που δεν τρέχει;", answer: "Ναι. Επικοινώνησε μαζί μας και θα οργανώσουμε πακέτο συνοδού." },
  { question: "Ποια είναι η πολιτική ακύρωσης;", answer: "Πλήρης επιστροφή έως 60 ημέρες πριν την αναχώρηση, 50% έως 30 ημέρες." },
];

const CONTENT_PAGES: Record<Locale, Record<string, PageContent>> = {
  en: {
    home: {
      slug: "home",
      sections: [
        section(1, "hero", 0, {
          eyebrow: "Running trips across Europe",
          headline: "Travel beyond the finish line",
          body: "Race weekends in Europe's best cities — entry, hotel and transfers handled. You just run.",
          primaryCta: { label: "Browse trips", href: "/trips" },
          secondaryCta: { label: "How it works", href: "/services" },
          statCards: [
            { title: "Races organized", value: "40+", badge: "Since 2018", sublabel: "Across Europe" },
            { title: "Runners hosted", value: "1,200+", badge: "Growing", sublabel: "And counting" },
            { title: "Cities on the map", value: "15", variant: "dark-highlight", badge: "Explore", sublabel: "Your next finish line" },
          ],
        }),
        section(2, "widget_list", 1, {
          eyebrow: "Our philosophy",
          headline: "Run the race. We'll handle the rest.",
          items: [
            { icon: "route", title: "Curated races", body: "Fast, scenic courses we've run ourselves." },
            { icon: "hotel", title: "Stay close", body: "Hotels within walking distance of the start." },
            { icon: "group", title: "Run together", body: "A small group of runners at every level." },
          ],
        }),
        section(3, "testimonials", 2, {
          eyebrow: "Runners say",
          headline: "From our last trips",
          items: [
            { quote: "I only had to show up and run. Everything else just worked.", name: "Maria K.", role: "Lisbon Half" },
            { quote: "Great group, perfect hotel, and a PB in Berlin.", name: "Nikos P.", role: "Berlin Marathon" },
            { quote: "My first race abroad and it felt effortless.", name: "Eleni D.", role: "Madrid 10K" },
          ],
        }),
        section(4, "cta_banner", 3, {
          headline: "Ready for your next race?",
          body: "Spots are limited on every trip.",
          primaryCta: { label: "See upcoming trips", href: "/trips" },
        }),
      ],
    },
    services: {
      slug: "services",
      sections: [
        section(5, "widget_list", 0, {
          eyebrow: "What we do",
          headline: "Everything a race trip needs",
          items: [
            { icon: "bib", numberLabel: "01", title: "Race entry", body: "Guaranteed bibs, even for sold-out races." },
            { icon: "hotel", numberLabel: "02", title: "Accommodation", body: "Hand-picked hotels near the start line." },
            { icon: "bus", numberLabel: "03", title: "Transfers", body: "Airport and race-day transport included." },
            { icon: "coach", numberLabel: "04", title: "Coaching", body: "Pre-race shake-out and pacing advice." },
            { icon: "group", numberLabel: "05", title: "Community", body: "Meet runners who share your goals." },
          ],
        }),
        section(6, "comparison_table", 1, {
          headline: "Going alone vs. going with us",
          columnLabels: ["On your own", "With us"],
          rows: [
            { feature: "Race entry", values: ["Lottery / sold out", "Guaranteed"] },
            { feature: "Hotel near start", values: ["Hard to find", "Included"] },
            { feature: "Transfers", values: ["DIY", "Included"] },
            { feature: "Group runs", values: ["—", "Included"] },
          ],
        }),
        section(7, "faq", 2, { headline: "FAQ", items: FAQ_EN }),
        section(8, "cta_banner", 3, {
          headline: "Find your next race",
          primaryCta: { label: "Browse trips", href: "/trips" },
        }),
      ],
    },
    contact: {
      slug: "contact",
      sections: [
        section(9, "widget_list", 0, {
          headline: "Get in touch",
          items: [
            { title: "Email", body: "hello@example.com" },
            { title: "Phone", body: "+30 210 000 0000" },
            { title: "Office", body: "Athens, Greece — Mon–Fri, 10:00–18:00" },
          ],
        }),
        section(10, "faq", 1, { headline: "FAQ", items: FAQ_EN, layout: "grid" }),
      ],
    },
  },
  el: {
    home: {
      slug: "home",
      sections: [
        section(1, "hero", 0, {
          eyebrow: "Δρομικά ταξίδια σε όλη την Ευρώπη",
          headline: "Ταξίδεψε πέρα από τον τερματισμό",
          body: "Αγωνιστικά Σαββατοκύριακα στις ωραιότερες πόλεις της Ευρώπης — συμμετοχή, ξενοδοχείο και μεταφορές. Εσύ απλώς τρέχεις.",
          primaryCta: { label: "Δες τα ταξίδια", href: "/trips" },
          secondaryCta: { label: "Πώς λειτουργεί", href: "/services" },
          stats: [
            { value: "40+", label: "Αγώνες" },
            { value: "1.200", label: "Δρομείς" },
            { value: "15", label: "Πόλεις" },
          ],
          imageUrl: img("hero-run", 1600, 1000),
        }),
        section(2, "widget_list", 1, {
          eyebrow: "Η φιλοσοφία μας",
          headline: "Εσύ τρέχεις. Εμείς φροντίζουμε τα υπόλοιπα.",
          items: [
            { icon: "route", title: "Επιλεγμένοι αγώνες", body: "Γρήγορες, όμορφες διαδρομές που έχουμε τρέξει κι εμείς." },
            { icon: "hotel", title: "Διαμονή κοντά", body: "Ξενοδοχεία σε απόσταση περπατήματος από την αφετηρία." },
            { icon: "group", title: "Τρέχουμε μαζί", body: "Μικρή ομάδα δρομέων κάθε επιπέδου." },
          ],
        }),
        section(3, "testimonials", 2, {
          eyebrow: "Οι δρομείς λένε",
          headline: "Από τα τελευταία μας ταξίδια",
          items: [
            { quote: "Το μόνο που έπρεπε να κάνω ήταν να τρέξω. Όλα τα άλλα απλώς λειτούργησαν.", name: "Μαρία Κ.", role: "Ημιμαραθώνιος Λισαβόνας" },
            { quote: "Υπέροχη ομάδα, τέλειο ξενοδοχείο και ατομικό ρεκόρ στο Βερολίνο.", name: "Νίκος Π.", role: "Μαραθώνιος Βερολίνου" },
            { quote: "Ο πρώτος μου αγώνας στο εξωτερικό και ήταν πανεύκολο.", name: "Ελένη Δ.", role: "10K Μαδρίτης" },
          ],
        }),
        section(4, "cta_banner", 3, {
          headline: "Έτοιμος για τον επόμενο αγώνα;",
          body: "Οι θέσεις είναι περιορισμένες σε κάθε ταξίδι.",
          primaryCta: { label: "Δες τα επόμενα ταξίδια", href: "/trips" },
        }),
      ],
    },
    services: {
      slug: "services",
      sections: [
        section(5, "widget_list", 0, {
          eyebrow: "Τι κάνουμε",
          headline: "Ό,τι χρειάζεται ένα δρομικό ταξίδι",
          items: [
            { icon: "bib", numberLabel: "01", title: "Συμμετοχή", body: "Εγγυημένη συμμετοχή, ακόμη και σε sold-out αγώνες." },
            { icon: "hotel", numberLabel: "02", title: "Διαμονή", body: "Επιλεγμένα ξενοδοχεία κοντά στην αφετηρία." },
            { icon: "bus", numberLabel: "03", title: "Μεταφορές", body: "Μεταφορές αεροδρομίου και ημέρας αγώνα." },
            { icon: "coach", numberLabel: "04", title: "Προπόνηση", body: "Προπονητικό τρέξιμο και συμβουλές ρυθμού." },
            { icon: "group", numberLabel: "05", title: "Κοινότητα", body: "Γνώρισε δρομείς με κοινούς στόχους." },
          ],
        }),
        section(6, "comparison_table", 1, {
          headline: "Μόνος σου ή μαζί μας",
          columnLabels: ["Μόνος σου", "Μαζί μας"],
          rows: [
            { feature: "Συμμετοχή", values: ["Κλήρωση / sold out", "Εγγυημένη"] },
            { feature: "Ξενοδοχείο κοντά στην αφετηρία", values: ["Δύσκολο", "Περιλαμβάνεται"] },
            { feature: "Μεταφορές", values: ["Μόνος σου", "Περιλαμβάνονται"] },
            { feature: "Ομαδικά τρεξίματα", values: ["—", "Περιλαμβάνονται"] },
          ],
        }),
        section(7, "faq", 2, { headline: "Συχνές ερωτήσεις", items: FAQ_EL }),
        section(8, "cta_banner", 3, {
          headline: "Βρες τον επόμενο αγώνα σου",
          primaryCta: { label: "Δες τα ταξίδια", href: "/trips" },
        }),
      ],
    },
    contact: {
      slug: "contact",
      sections: [
        section(9, "widget_list", 0, {
          headline: "Επικοινωνία",
          items: [
            { title: "Email", body: "hello@example.com" },
            { title: "Τηλέφωνο", body: "+30 210 000 0000" },
            { title: "Γραφείο", body: "Αθήνα — Δευ–Παρ, 10:00–18:00" },
          ],
        }),
        section(10, "faq", 1, { headline: "Συχνές ερωτήσεις", items: FAQ_EL, layout: "grid" }),
      ],
    },
  },
};

export function getPageContent(slug: string, locale: Locale): PageContent {
  return CONTENT_PAGES[locale]?.[slug] ?? { slug, sections: [] };
}

// --- Fake logged-in user / auth state ---

export const DEMO_EMAIL = "runner@example.com";
export const DEMO_PASSWORD = "runner12345";

export const state = {
  user: {
    id: 1,
    email: DEMO_EMAIL,
    full_name: "Demo Runner",
    role: "user" as const,
    locale: "en" as Locale,
    email_verified: true,
  } satisfies UserPublic,
  travelProfile: {
    date_of_birth: null,
    nationality: "Greek",
    passport_number: null,
    emergency_contact_name: null,
    emergency_contact_phone: null,
    shirt_size: "M",
    extra: {},
  } satisfies TravelProfile,
  bookings: [] as Booking[],
  nextBookingId: 4,
};

function findRaw(slug: string): RawTrip {
  const raw = TRIPS_RAW.find((t) => t.slug === slug);
  if (!raw) throw new Error(`unknown trip ${slug}`);
  return raw;
}

function seedBooking(slug: string, status: BookingStatus, participantNames: string[], id: number): Booking {
  const raw = findRaw(slug);
  const detail = buildTripDetail(raw, "en");
  const price = detail.categories[0]?.price ?? 0;
  return {
    id,
    trip: {
      id: detail.id,
      slug: detail.slug,
      title: detail.title,
      cover_image_url: detail.cover_image_url,
      start_date: detail.start_date,
      end_date: detail.end_date,
    },
    status,
    participant_count: participantNames.length,
    total_amount_cents: price * 100 * participantNames.length,
    participants: participantNames.map((name, i) => ({ id: i + 1, full_name: name, nationality: "Greek", shirt_size: "M" })),
    created_at: new Date().toISOString(),
  };
}

state.bookings = [
  seedBooking("madrid-10k", "confirmed", ["Demo Runner", "Anna Runner"], 1),
  seedBooking("rome-half", "awaiting_payment", ["Demo Runner"], 2),
  seedBooking("athens-classic", "confirmed", ["Demo Runner"], 3),
];

export function bookingsForStatus(status: "upcoming" | "past"): Booking[] {
  const today = new Date().toISOString().slice(0, 10);
  return state.bookings.filter((b) => (status === "upcoming" ? b.trip.start_date >= today : b.trip.start_date < today));
}

export function createBooking(tripId: number, tripCategoryId: number, participants: { full_name: string }[]): Booking {
  const raw = TRIPS_RAW[tripId - 1];
  const detail = buildTripDetail(raw, "en");
  const category = detail.categories.find((c) => c.id === tripCategoryId) ?? detail.categories[0];
  const booking: Booking = {
    id: state.nextBookingId++,
    trip: {
      id: detail.id,
      slug: detail.slug,
      title: detail.title,
      cover_image_url: detail.cover_image_url,
      start_date: detail.start_date,
      end_date: detail.end_date,
    },
    status: "awaiting_payment",
    participant_count: participants.length,
    total_amount_cents: (category?.price ?? 0) * 100 * participants.length,
    participants: participants.map((p, i) => ({ id: i + 1, full_name: p.full_name })),
    created_at: new Date().toISOString(),
  };
  state.bookings.push(booking);
  return booking;
}
