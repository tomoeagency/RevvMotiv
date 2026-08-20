export const BUSINESS_DETAILS = {
  legalName: "RevvMotiv",
  shortName: "RevvMotiv",
  registeredAddress: "Site-5, Kasna, Greater Noida, Uttar Pradesh, India",
  supportEmail: "support@revvmotiv.com",
  whatsappNumber: "+91 83683 43232",
  whatsappDigits: "918368343232",
  supportHours: "Monday to Saturday, 10:00 AM – 7:00 PM IST",
  turnaroundTime: "24–48 business hours",
  instagramBuilds: [
    { handle: "@revv.nation__", url: "https://www.instagram.com/revv.nation__/" },
    { handle: "@sonet.4100__", url: "https://www.instagram.com/sonet.4100__/" },
  ],
} as const;

export const FALLBACK_CATEGORIES = [
  { id: 1, name: "Splitters/Side Skirts", slug: "splitters-side-skirts" },
  { id: 2, name: "Spoilers", slug: "spoilers" },
  { id: 3, name: "Aero Mirror & Styling", slug: "aero-mirror-styling" },
  { id: 4, name: "Diffusers", slug: "diffusers" },
  { id: 5, name: "Tyre Stickers", slug: "tyre-stickers" },
  { id: 6, name: "Lights & Flashers", slug: "lights-flashers" },
  { id: 7, name: "Combo", slug: "combo" },
  { id: 8, name: "Car Audio & Utilities", slug: "car-audio-utilities" },
] as const;

export const FALLBACK_REVIEWS = [
  {
    id: 101,
    product_id: 1,
    customer_name: "Aman Sharma",
    rating: 5,
    comment: "Precision 1:1 OEM fitment on the front splitter. Packaging was top-notch and delivery to Chandigarh was seamless.",
    media_urls: ["/images/projects/verna-after-1.png"],
    verified_purchase: true,
    product: { id: 1, title: "Hyundai Verna 2019 Front Splitter", slug: "verna-2019-splitter" },
    created_at: "2026-06-15T10:00:00Z",
  },
  {
    id: 102,
    product_id: 2,
    customer_name: "Rahul Verma",
    rating: 5,
    comment: "The gloss black finish and aerodynamic contour on the rear diffuser completely transformed the road stance.",
    media_urls: ["/images/projects/sonet-after-1.png"],
    verified_purchase: true,
    product: { id: 2, title: "Kia Sonet 2025 Rear Diffuser", slug: "sonet-2025-diffuser" },
    created_at: "2026-07-02T12:00:00Z",
  },
  {
    id: 103,
    product_id: 3,
    customer_name: "Karan Patel",
    rating: 5,
    comment: "High-strength composite material with deep UV clear coat. Direct bolt-on with zero drilling required.",
    media_urls: ["/images/projects/tiago-after-1.png"],
    verified_purchase: true,
    product: { id: 3, title: "Tata Tiago 2023 Aero Kit", slug: "tiago-2023-kit" },
    created_at: "2026-07-18T14:30:00Z",
  },
  {
    id: 104,
    product_id: 4,
    customer_name: "Vikram Malhotra",
    rating: 5,
    comment: "Best aero styling studio in India. Team assisted directly on WhatsApp for fitment confirmation.",
    media_urls: ["/images/fitment/fitment_step1.webp"],
    verified_purchase: true,
    product: { id: 4, title: "VW Polo GT Splitter", slug: "polo-gt-splitter" },
    created_at: "2026-08-01T09:15:00Z",
  },
];

