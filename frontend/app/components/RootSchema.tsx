export function RootSchema() {
  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["AutoPartsStore", "LocalBusiness", "AutomotiveBusiness"],
        "@id": "https://revvmotiv.com/#organization",
        name: "RevvMotiv",
        alternateName: ["Revv Motiv", "RevvNation", "RevvMotiv Custom Car Styling"],
        url: "https://revvmotiv.com",
        logo: {
          "@type": "ImageObject",
          "@id": "https://revvmotiv.com/#logo",
          url: "https://revvmotiv.com/icon.png",
          caption: "RevvMotiv Custom Styling & Aero Parts",
          width: 512,
          height: 512,
        },
        image: "https://revvmotiv.com/icon.png",
        description:
          "India's premier custom automotive studio for precision-engineered aero splitters, diffusers, spoilers, carbon fiber styling components, and performance upgrades with Pan-India express delivery.",
        telephone: "+91-83683-43232",
        email: "support@revvmotiv.com",
        priceRange: "₹₹",
        currenciesAccepted: "INR",
        paymentAccepted: "Cash on Delivery, Credit Card, Debit Card, UPI, Net Banking, Razorpay",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Site-5, Kasna",
          addressLocality: "Greater Noida",
          addressRegion: "Uttar Pradesh",
          postalCode: "201306",
          addressCountry: "IN",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 28.4744,
          longitude: 77.504,
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ],
            opens: "10:00",
            closes: "19:00",
          },
        ],
        areaServed: [
          {
            "@type": "Country",
            name: "India",
          },
          {
            "@type": "AdministrativeArea",
            name: "Delhi NCR",
          },
          {
            "@type": "City",
            name: "Greater Noida",
          },
          {
            "@type": "City",
            name: "Noida",
          },
          {
            "@type": "City",
            name: "Delhi",
          },
          {
            "@type": "City",
            name: "Gurgaon",
          },
          {
            "@type": "City",
            name: "Mumbai",
          },
          {
            "@type": "City",
            name: "Bengaluru",
          },
          {
            "@type": "City",
            name: "Hyderabad",
          },
          {
            "@type": "City",
            name: "Pune",
          },
          {
            "@type": "City",
            name: "Chennai",
          },
          {
            "@type": "City",
            name: "Kolkata",
          },
          {
            "@type": "City",
            name: "Ahmedabad",
          },
          {
            "@type": "City",
            name: "Chandigarh",
          },
          {
            "@type": "City",
            name: "Jaipur",
          },
          {
            "@type": "City",
            name: "Kochi",
          },
        ],
        sameAs: [
          "https://www.instagram.com/revv.nation__/",
          "https://www.instagram.com/sonet.4100__/",
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Car Styling & Aero Parts Catalog",
          itemListElement: [
            {
              "@type": "OfferCatalog",
              name: "Front Splitters & Lips",
            },
            {
              "@type": "OfferCatalog",
              name: "Rear Diffusers",
            },
            {
              "@type": "OfferCatalog",
              name: "GT Wings & Spoilers",
            },
            {
              "@type": "OfferCatalog",
              name: "Side Skirt Extensions",
            },
            {
              "@type": "OfferCatalog",
              name: "3D Raised Tyre Lettering Stickers",
            },
            {
              "@type": "OfferCatalog",
              name: "Sequential OLED Lighting",
            },
          ],
        },
      },
      {
        "@type": "WebSite",
        "@id": "https://revvmotiv.com/#website",
        url: "https://revvmotiv.com",
        name: "RevvMotiv",
        description: "Custom Car Styling, Aero Parts & Performance Accessories in India",
        publisher: {
          "@id": "https://revvmotiv.com/#organization",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: "https://revvmotiv.com/shop?q={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
        inLanguage: "en-IN",
      },
      {
        "@type": "FAQPage",
        "@id": "https://revvmotiv.com/#faq",
        mainEntity: [
          {
            "@type": "Question",
            name: "What cars does RevvMotiv manufacture aero parts for?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "RevvMotiv manufactures 1:1 OEM-fitment aero splitters, side skirts, rear diffusers, and spoilers for popular Indian and international performance cars including Maruti Suzuki Swift, Hyundai i20 N Line, Volkswagen Polo GT / Virtus, Mahindra Thar / Scorpio-N, Hyundai Creta / Verna, Kia Sonet / Seltos, Toyota Fortuner, Honda City, and universal track applications.",
            },
          },
          {
            "@type": "Question",
            name: "Does RevvMotiv deliver across India?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, RevvMotiv provides insured Pan-India express shipping across 45+ cities and all postal PIN codes in India. Every package is shipped in heavy-duty impact-resistant crates with edge-protection guards.",
            },
          },
          {
            "@type": "Question",
            name: "What is RevvMotiv's Cash on Delivery (COD) and Advance Payment Policy?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Customers can choose between 100% Full Online Payment or a convenient 20% Advance Payment online via Razorpay (UPI, Credit/Debit Cards, Net Banking) and pay the remaining 80% balance on delivery via Cash on Delivery (COD).",
            },
          },
          {
            "@type": "Question",
            name: "Are RevvMotiv splitters and diffusers real carbon fiber?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "RevvMotiv offers premium authentic 2x2 twill weave carbon fiber, forged carbon composite, and high-impact automotive-grade ABS polymer options with UV-resistant clear coat finishes that withstand harsh Indian road and weather conditions.",
            },
          },
          {
            "@type": "Question",
            name: "How can I verify fitment for my car before ordering?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "You can consult directly with our build technicians via WhatsApp at +91 83683 43232 (Monday to Saturday, 10:00 AM to 7:00 PM IST) or submit your car model details via the on-site Consultant Modal for 100% fitment verification.",
            },
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
