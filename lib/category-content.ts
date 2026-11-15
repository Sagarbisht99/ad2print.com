/**
 * Long-form content for every newspaper ad category.
 *
 * The JSON in data/categories.json holds the shared card data. This file adds
 * the unique page copy that each category page needs for search: its own
 * headline, description, formats, FAQs and internal links.
 */

export type CategoryFaq = { q: string; a: string };

export type CategoryContent = {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  eyebrow: string;
  intro: string[];
  priceNote: string;
  highlights: string[];
  formats: { name: string; text: string }[];
  faqs: CategoryFaq[];
  keywords: string[];
  related: string[];
};

export const CATEGORY_CONTENT: Record<string, CategoryContent> = {
  "change-of-name": {
    metaTitle: "Change of Name Newspaper Ad Online",
    metaDescription:
      "Book a change of name newspaper ad online for passport, PAN, Aadhaar, bank or Gazette records. Free drafting in English and Hindi, proof after publication. 280+ Indian newspapers.",
    h1: "Change of Name Newspaper Ad",
    eyebrow: "Personal & legal notices",
    intro: [
      "A change of name notice is a short classified advertisement that publicly records your old name and your new name. Passport offices, banks, Aadhaar centres, schools and Gazette authorities often ask for the printed cutting as part of the name-change file.",
      "AD2PRINT drafts the notice in the format newspapers accept, helps you choose one English and one regional-language paper where required, and sends the published page as proof after it prints.",
    ],
    priceNote:
      "Name change ads are usually charged per line or per word. A typical two-paper notice costs less than a display ad, and the exact rate depends on the paper, city edition and line count.",
    highlights: [
      "Passport, PAN, Aadhaar, bank and Gazette-ready wording",
      "English + Hindi and other regional language drafts",
      "Choose one paper or a two-paper combination",
      "e-paper proof with date and page after publication",
    ],
    formats: [
      { name: "Text classified", text: "The standard few-line notice used by most passport and bank applications." },
      { name: "Classified display", text: "A boxed notice with a border or photograph when an office asks for a more formal record." },
      { name: "Affidavit-supported notice", text: "Wording that refers to your affidavit date, drafted from the details you provide." },
    ],
    faqs: [
      {
        q: "Which newspapers are accepted for a name change?",
        a: "Many offices ask for one English daily and one regional-language daily from the state where you live. Tell the desk which office is asking and we will suggest a commonly accepted combination.",
      },
      {
        q: "How many lines should a name change ad have?",
        a: "Most notices run between 4 and 8 lines. The exact minimum varies by newspaper. Send us the old name, new name, parent name, address and affidavit date, and we will fit the wording to the paper's format.",
      },
      {
        q: "Do I need an affidavit before booking?",
        a: "The notice usually refers to an affidavit date, so it is best to have the affidavit ready first. If it is not ready, tell the desk and we will explain the order in which most people complete the process.",
      },
      {
        q: "Can the notice be published in Hindi?",
        a: "Yes. Drafting and translation are included. We can prepare English, Hindi, Marathi, Gujarati, Tamil, Telugu, Kannada, Malayalam, Bengali and other language versions of the same notice.",
      },
      {
        q: "Will the cutting be accepted as proof?",
        a: "We send the e-paper page with the publication date. A hard copy can be arranged on request. Acceptance is always decided by the office receiving your application, so confirm its requirement before booking.",
      },
    ],
    keywords: [
      "change of name newspaper ad",
      "name change ad online",
      "name change notice for passport",
      "name change ad for PAN card",
      "name change ad for Aadhaar",
      "gazette name change newspaper ad",
      "naam parivartan newspaper ad",
    ],
    related: ["statutory", "lost-and-found", "announcement"],
  },

  matrimonial: {
    metaTitle: "Matrimonial Newspaper Ads Online",
    metaDescription:
      "Book matrimonial ads in English and regional Indian newspapers. Free profile drafting, photo boxed options, Sunday editions and proof after publication.",
    h1: "Matrimonial Newspaper Ads",
    eyebrow: "Personal classifieds",
    intro: [
      "Matrimonial classifieds remain one of the most trusted ways to reach families who still read the newspaper cover to cover. A clear, respectful profile in the right Sunday edition can bring more serious responses than a scattered online listing.",
      "We help you write the profile, choose between English and regional-language papers, and decide whether a plain text line or a photo boxed ad suits your budget.",
    ],
    priceNote:
      "Matrimonial ads are priced per line, per word or per box depending on the paper. Sunday and premium editions cost more than weekday runs, and a photo box adds to the base rate.",
    highlights: [
      "Bride and groom profiles drafted with you",
      "English, Hindi and regional language publication",
      "Sunday and weekday edition options",
      "Photo boxed ads for more visibility",
    ],
    formats: [
      { name: "Text classified", text: "A concise profile in the matrimonial columns — the most economical option." },
      { name: "Classified display", text: "A bordered box with larger type, ideal for families who want more detail." },
      { name: "Photo boxed ad", text: "Adds a photograph and a short profile, usually booked in Sunday editions." },
    ],
    faqs: [
      {
        q: "Which day is best for a matrimonial ad?",
        a: "Sunday editions get the most readers for matrimonial classifieds in most papers. If your deadline is tight, a weekday edition can still work, but book a day earlier for the weekend.",
      },
      {
        q: "Should I choose English or a regional paper?",
        a: "It depends on the family you want to reach. English nationals carry prestige and metro reach; regional-language dailies often deliver a stronger local response. Many families book one of each.",
      },
      {
        q: "Can you write the profile for me?",
        a: "Yes. Send the basic details — age, education, profession, family background and preferences — and we will draft a clear, respectful profile for your approval.",
      },
      {
        q: "Can I include a photograph?",
        a: "Photo boxed matrimonial ads are available in many papers. Ask the desk for the sizes offered in your chosen edition and we will confirm the rate before booking.",
      },
    ],
    keywords: [
      "matrimonial newspaper ad",
      "matrimonial classifieds online",
      "bride groom newspaper ad",
      "matrimonial ad in Times of India",
      "Hindi matrimonial ad",
      "Sunday matrimonial classified",
    ],
    related: ["announcement", "change-of-name", "education"],
  },

  property: {
    metaTitle: "Property Newspaper Ads — Sale & Rent",
    metaDescription:
      "Book property classified and display ads in city newspapers. Sell or rent flats, plots, shops and land, or publish property notices with proof after print.",
    h1: "Property Newspaper Ads",
    eyebrow: "Real estate classifieds",
    intro: [
      "Property buyers still open the city edition first. A well-written sale or rent ad in the local paper reaches neighbours, investors and families who already know the area — often faster than a national listing alone.",
      "Book a text classified for a straightforward sale, a classified display for a project or broker, or a public notice for land, deed and possession matters.",
    ],
    priceNote:
      "Property ads are priced by line for text classifieds and by square centimetre for display. City editions are usually cheaper than national editions, and a photo or map adds to the size.",
    highlights: [
      "Sale, rent, lease and requirement formats",
      "City editions for local buyer reach",
      "Photo, map and logo options",
      "Public notices for land and possession",
    ],
    formats: [
      { name: "Text classified", text: "A few lines covering location, size, price and contact — the standard for individual sellers." },
      { name: "Classified display", text: "A boxed ad with photos, a floor plan or a project logo for brokers and builders." },
      { name: "Property public notice", text: "Land verification, lost deed and possession notices in the format authorities expect." },
    ],
    faqs: [
      {
        q: "Which edition should I choose for a property ad?",
        a: "Choose the city edition where the property is located. Local buyers and tenants read that edition, and the rate is usually lower than a national run.",
      },
      {
        q: "Can I add photos or a floor plan?",
        a: "Yes, in classified display. Send the image and the details, and we will confirm the size and rate for the edition you choose.",
      },
      {
        q: "How long should a property ad run?",
        a: "Most individual sellers book one or two insertions. Brokers and projects often run a series across weekdays or weekends. We can schedule multiple dates in one order.",
      },
      {
        q: "Do you publish land and possession notices?",
        a: "Yes. We handle land verification, lost deed, possession and other property notices. Send the exact wording from your advocate or the format required by the office.",
      },
    ],
    keywords: [
      "property newspaper ad",
      "flat for sale newspaper ad",
      "house for rent classified",
      "land verification notice",
      "possession notice newspaper",
      "property classifieds India",
    ],
    related: ["vehicles", "business", "statutory"],
  },

  vehicles: {
    metaTitle: "Vehicle Newspaper Ads — Cars & Bikes",
    metaDescription:
      "Sell or buy cars, bikes and commercial vehicles with a newspaper classified. Choose city editions, add a photo box, and get proof after publication.",
    h1: "Vehicle Newspaper Ads",
    eyebrow: "Auto classifieds",
    intro: [
      "A vehicle classified works because it reaches buyers who are already scanning the local market. City editions put your car, bike or commercial vehicle in front of readers who can inspect it the same week.",
      "Book a short text ad for a quick sale or a photo classified display when you want the listing to stand out.",
    ],
    priceNote:
      "Vehicle ads are charged per line or per box depending on the format. A single city edition is usually the most economical; premium and Sunday editions cost more.",
    highlights: [
      "Cars, two-wheelers and commercial vehicles",
      "City and regional edition targeting",
      "Photo classified display option",
      "Help with model, year and price wording",
    ],
    formats: [
      { name: "Text classified", text: "Model, year, kilometres, condition and contact number in a few lines." },
      { name: "Classified display", text: "A boxed listing with a photo, useful for premium or commercial vehicles." },
      { name: "Dealer display", text: "A larger display ad for showrooms, dealers and fleet sellers." },
    ],
    faqs: [
      {
        q: "What details should a vehicle ad include?",
        a: "Include the make and model, year, fuel type, kilometres driven, ownership, insurance status, expected price and a contact number. Clear details reduce low-quality calls.",
      },
      {
        q: "Can I add a photo of the vehicle?",
        a: "Yes, in a classified display ad. Send a clear horizontal photo and we will confirm the available box size and rate for your chosen paper.",
      },
      {
        q: "Which paper is best for selling a used car?",
        a: "Start with the city edition where the vehicle is registered or parked. A regional-language paper can work well for local buyers; an English metro paper can widen the reach.",
      },
      {
        q: "Can dealers book multiple cities?",
        a: "Yes. We can combine several editions in one order, confirm the total rate and schedule the same ad across locations.",
      },
    ],
    keywords: [
      "vehicle newspaper ad",
      "used car classified ad",
      "bike for sale newspaper ad",
      "commercial vehicle ad",
      "auto classifieds India",
    ],
    related: ["property", "business", "lost-and-found"],
  },

  recruitment: {
    metaTitle: "Recruitment Newspaper Ads — Hiring",
    metaDescription:
      "Book recruitment ads in national and regional newspapers. Hire for walk-ins, campus drives and senior roles with logo display options and proof after print.",
    h1: "Recruitment Newspaper Ads",
    eyebrow: "Jobs & hiring",
    intro: [
      "Recruitment advertising still works best when you need a wide, trusted reach in one day. A Sunday appointment section or a city edition can fill walk-in slots faster than a job board that gets lost in search results.",
      "We help HR teams write the ad, choose the right edition, and book a text classified or a logo display within budget.",
    ],
    priceNote:
      "Recruitment ads are priced by line for text classifieds and by size for display. Sunday appointments and premium pages cost more; multi-city orders are quoted together.",
    highlights: [
      "Walk-in, campus and senior hiring formats",
      "Sunday and weekday edition options",
      "Logo, QR code and display creative support",
      "One order across multiple cities",
    ],
    formats: [
      { name: "Text classified", text: "Role, qualification, experience, location and contact details in the appointments column." },
      { name: "Classified display", text: "A boxed ad with a logo, job summary and application instructions." },
      { name: "Main-page display", text: "A larger brand-led hiring ad for mass recruitment and campus drives." },
    ],
    faqs: [
      {
        q: "Which edition gets the best job responses?",
        a: "Sunday appointment sections have the largest readership in most papers. For urgent walk-ins, a weekday city edition can still deliver candidates for the next day.",
      },
      {
        q: "Can you design the recruitment ad?",
        a: "We can set clean text and logo-led classified display ads. For a full display creative, share your brand assets and we will confirm what the paper accepts.",
      },
      {
        q: "How do I handle applications?",
        a: "Include a phone number, email, WhatsApp link or walk-in address. QR codes can be added to display ads where the paper's production team supports them.",
      },
      {
        q: "Can I book the same ad in several cities?",
        a: "Yes. Send the list of cities and we will confirm the editions, sizes and combined rate before booking.",
      },
    ],
    keywords: [
      "recruitment newspaper ad",
      "job advertisement in newspaper",
      "walk-in interview ad",
      "hiring display ad",
      "Sunday appointment ads",
    ],
    related: ["education", "business", "announcement"],
  },

  business: {
    metaTitle: "Business Newspaper Ads — Offers & Launches",
    metaDescription:
      "Promote your shop, service or product launch with newspaper classified display and main-page display ads. Get rates, creative guidance and publication proof.",
    h1: "Business Newspaper Ads",
    eyebrow: "Retail & brand advertising",
    intro: [
      "A newspaper ad puts your offer in front of readers who are already planning their day, their shopping and their next purchase. For local businesses, the city edition is often the most direct route to customers.",
      "Book a classified display for a seasonal offer, a main-page display for a launch, or a multi-paper schedule for a wider campaign.",
    ],
    priceNote:
      "Business ads are priced by size and edition. A small classified display is the most affordable branded option; main-page display rates depend on the page, position and colour.",
    highlights: [
      "Store offers, launches and service promotions",
      "Classified display and main-page display",
      "City, metro and multi-city schedules",
      "Creative sizing guidance before you book",
    ],
    formats: [
      { name: "Classified display", text: "A compact boxed ad in the classified pages — good for offers and local services." },
      { name: "Main-page display", text: "A larger ad on a news page for launches, festivals and brand campaigns." },
      { name: "Multi-paper package", text: "The same creative across several editions, with one consolidated quote." },
    ],
    faqs: [
      {
        q: "What is the difference between classified display and display?",
        a: "Classified display sits in the classified section and is charged by size within that section. Main-page display appears alongside news and is priced by page, position and edition.",
      },
      {
        q: "Do you design the advertisement?",
        a: "We can adapt your existing creative to the newspaper's size and print requirements. Send the artwork, logo and offer details, and we will confirm the specs with the publication.",
      },
      {
        q: "How early should I book a festival ad?",
        a: "Festival and weekend editions fill up early. Book at least three to five days ahead for a preferred page; urgent bookings depend on available space.",
      },
      {
        q: "Can I advertise in more than one city?",
        a: "Yes. Tell us the cities and the budget, and we will propose a combination of editions with a single rate confirmation.",
      },
    ],
    keywords: [
      "business newspaper ad",
      "shop offer advertisement",
      "product launch newspaper ad",
      "classified display ad",
      "main page display ad",
    ],
    related: ["recruitment", "education", "announcement"],
  },

  obituary: {
    metaTitle: "Obituary Newspaper Ads — Remembrance",
    metaDescription:
      "Place an obituary or remembrance notice in an Indian newspaper with sensitive drafting support, photo box options and proof after publication.",
    h1: "Obituary & Remembrance Ads",
    eyebrow: "Personal notices",
    intro: [
      "An obituary notice is a quiet record of a life and a way to inform family, friends and colleagues. The wording matters, and so does choosing a paper that the family and community actually read.",
      "Our desk handles these bookings with care. Share the details and we will prepare a draft for your approval before anything is sent to the paper.",
    ],
    priceNote:
      "Obituary notices are usually charged per line or per box. A photo remembrance box costs more than a text notice, and rates vary by edition and day.",
    highlights: [
      "Sensitive drafting help",
      "Text and photo remembrance formats",
      "English and regional language papers",
      "Next-day print where the deadline allows",
    ],
    formats: [
      { name: "Text notice", text: "A simple remembrance announcement with names, dates and family details." },
      { name: "Photo remembrance", text: "A boxed notice with a photograph and a short tribute." },
      { name: "Condolence announcement", text: "A notice from an organisation, association or extended family." },
    ],
    faqs: [
      {
        q: "How quickly can an obituary notice be published?",
        a: "Many papers can accept a notice for the next edition if it is confirmed before the cut-off. Call the desk and we will check the available date before you pay.",
      },
      {
        q: "Can you help with the wording?",
        a: "Yes. Send the name, age, date, family details and any message you want included. We will prepare a respectful draft for your approval.",
      },
      {
        q: "Can we include a photograph?",
        a: "Photo remembrance boxes are available in many publications. The size and rate depend on the paper and edition.",
      },
      {
        q: "Which newspaper should we choose?",
        a: "Choose the paper that family, friends and the community read. A local regional-language daily often reaches the right readers; an English national can add wider reach.",
      },
    ],
    keywords: [
      "obituary newspaper ad",
      "remembrance notice newspaper",
      "condolence ad in newspaper",
      "shraddhanjali newspaper ad",
      "obituary ad online",
    ],
    related: ["announcement", "change-of-name", "matrimonial"],
  },

  "lost-and-found": {
    metaTitle: "Lost & Found Newspaper Ads",
    metaDescription:
      "Publish a lost document, share certificate, marksheet, deed or belonging notice in the newspaper format authorities expect. Book online with proof after print.",
    h1: "Lost & Found Newspaper Notices",
    eyebrow: "Public notices",
    intro: [
      "When a document goes missing, a newspaper notice creates a public record that banks, universities, registrars and police often ask for. The wording needs to identify the document clearly without exposing unnecessary personal details.",
      "We publish lost share certificates, marksheets, deeds, identity documents and belonging notices in the right city edition.",
    ],
    priceNote:
      "Lost and found notices are usually short text classifieds charged per line. The final rate depends on the newspaper, edition and the number of lines needed.",
    highlights: [
      "Lost share certificates and deeds",
      "Marksheets, certificates and identity documents",
      "Standard public-notice wording",
      "Low-cost text classified option",
    ],
    formats: [
      { name: "Lost document notice", text: "Identifies the document, number (if appropriate) and the fact that it is lost." },
      { name: "Lost share certificate", text: "The format companies and registrars commonly ask for before issuing a duplicate." },
      { name: "Lost & found classified", text: "A short notice for belongings, pets or other missing items." },
    ],
    faqs: [
      {
        q: "What should a lost document notice say?",
        a: "Include the document type, the name on it, the approximate date of loss and a statement that it is lost. Avoid publishing full ID numbers unless the authority specifically asks for them.",
      },
      {
        q: "Which paper do banks and companies accept?",
        a: "Requirements vary. Many ask for a newspaper circulating in the area where the loss occurred. Tell the desk which organisation requested the notice and we will suggest a suitable paper.",
      },
      {
        q: "Can I publish a lost share certificate notice?",
        a: "Yes. Send the company name, folio or certificate details and the wording from the registrar. We will confirm the format with the newspaper.",
      },
      {
        q: "How many days does it take?",
        a: "A text notice confirmed before the cut-off can usually run in the next edition. Ask the desk for the exact deadline for your chosen paper.",
      },
    ],
    keywords: [
      "lost document newspaper ad",
      "lost share certificate notice",
      "lost marksheet newspaper ad",
      "lost and found classified",
      "public notice for lost documents",
    ],
    related: ["statutory", "change-of-name", "property"],
  },

  "court-notice": {
    metaTitle: "Court & Public Notice Newspaper Ads",
    metaDescription:
      "Publish court notices, public notices, tender and auction notices in leading newspapers. Fixed-format booking, online payment and publication proof.",
    h1: "Court & Public Notice Newspaper Ads",
    eyebrow: "Legal & public notices",
    intro: [
      "Court notices, public notices and tender invitations must appear in an approved newspaper in the format the authority specifies. A missing line or the wrong edition can send the process back.",
      "We work from the exact draft supplied by your advocate or organisation, confirm the publication details, and send the printed proof once it runs.",
    ],
    priceNote:
      "Public and court notices are usually charged by size or by a fixed minimum box. Rates depend on the newspaper, edition and the number of insertions ordered.",
    highlights: [
      "Court, public and legal notices",
      "Tender, e-tender and auction formats",
      "Publication in the edition specified by the authority",
      "Proof and invoice for your records",
    ],
    formats: [
      { name: "Court notice", text: "Published exactly as directed by the court or your advocate." },
      { name: "Public notice", text: "General notices for statutory, property and administrative requirements." },
      { name: "Tender / auction notice", text: "Invitations for tenders, e-tenders, auctions and expressions of interest." },
    ],
    faqs: [
      {
        q: "Can I supply my own notice wording?",
        a: "Yes. Court and legal notices should be published exactly as supplied. Send the final draft and we will confirm the size and edition before booking.",
      },
      {
        q: "Which newspaper should a court notice go in?",
        a: "The court order usually specifies the newspaper or the area of circulation. Follow that direction; if it is unclear, ask your advocate before booking.",
      },
      {
        q: "How is a public notice priced?",
        a: "Most papers charge by the column centimetre or a fixed minimum size. We confirm the size, rate and GST before you pay.",
      },
      {
        q: "Do you provide a publication affidavit?",
        a: "We provide the published page and invoice. If a specific affidavit or certificate is needed, tell us before booking and we will confirm what the publication can issue.",
      },
    ],
    keywords: [
      "court notice newspaper ad",
      "public notice publication",
      "tender notice newspaper",
      "auction notice ad",
      "legal notice in newspaper",
    ],
    related: ["statutory", "property", "lost-and-found"],
  },

  education: {
    metaTitle: "Education Newspaper Ads — Admissions",
    metaDescription:
      "Book education ads for admissions, coaching batches, results and institute promotions in local and metro newspapers. Display and classified options with proof.",
    h1: "Education Newspaper Ads",
    eyebrow: "Admissions & institutes",
    intro: [
      "Admission season is local. Parents read the city paper, compare institutes and visit the one that looks credible. A clear newspaper ad with the course, eligibility, deadlines and contact details still brings enquiries that a social post may not.",
      "Book a classified display for a coaching batch or a larger display ad for a school, college or university admission campaign.",
    ],
    priceNote:
      "Education ads are priced by size and edition. Small classified display boxes suit coaching centres; main-page display rates depend on the paper, page and colour.",
    highlights: [
      "Admissions, coaching and results announcements",
      "City and metro edition targeting",
      "Logo, photo and QR code display options",
      "Seasonal and multi-insertion schedules",
    ],
    formats: [
      { name: "Classified display", text: "Course list, eligibility, timings and contact details in a compact box." },
      { name: "Admission display", text: "A larger branded ad for schools, colleges and universities." },
      { name: "Result / merit notice", text: "Result announcements, merit lists and counselling schedules." },
    ],
    faqs: [
      {
        q: "When should admission ads be booked?",
        a: "Start two to four weeks before the application deadline and repeat the ad closer to the last date. Weekend editions often get more parent attention.",
      },
      {
        q: "Can you include a QR code?",
        a: "Many papers accept QR codes in display ads. Send the link and we will confirm the production requirement with the publication.",
      },
      {
        q: "Which edition works for a coaching centre?",
        a: "The city edition where the centre is located is usually the best starting point. Add a regional-language paper if the course is taught in that language.",
      },
      {
        q: "Do you handle result notices?",
        a: "Yes. Send the result or merit list artwork in the required size and we will book it in the edition you choose.",
      },
    ],
    keywords: [
      "education newspaper ad",
      "admission advertisement in newspaper",
      "coaching class ad",
      "school admission newspaper ad",
      "result notice publication",
    ],
    related: ["recruitment", "business", "announcement"],
  },

  announcement: {
    metaTitle: "Announcement Newspaper Ads",
    metaDescription:
      "Publish personal and public announcements in Indian newspapers. Events, openings, greetings and general information in English or any regional language.",
    h1: "Announcement Newspaper Ads",
    eyebrow: "General announcements",
    intro: [
      "Some messages deserve more than a group chat. An announcement in the local newspaper reaches neighbours, customers and community members who may not follow you online.",
      "Use it for an event, a shop opening, a public information notice, a greeting or any message that should be seen in print.",
    ],
    priceNote:
      "Announcement ads are charged by line or by box depending on the format. Short text notices are the most economical; photo and display boxes cost more.",
    highlights: [
      "Events, openings and public information",
      "English and regional language papers",
      "Text, boxed and photo options",
      "Same-week booking in most editions",
    ],
    formats: [
      { name: "Text announcement", text: "A short message in the classified columns." },
      { name: "Boxed announcement", text: "A bordered box with larger type for events and openings." },
      { name: "Photo announcement", text: "A photo with a greeting, tribute or event message." },
    ],
    faqs: [
      {
        q: "What can I announce in a newspaper?",
        a: "Events, openings, public information, greetings, reunions, society notices and general messages. Content must follow the publication's advertising policy.",
      },
      {
        q: "Can I choose the language?",
        a: "Yes. We can draft and publish in English, Hindi and other regional languages supported by the newspaper you choose.",
      },
      {
        q: "How quickly can an announcement run?",
        a: "Most papers accept a confirmed announcement for the next edition if it is booked before the cut-off. Ask the desk for your paper's deadline.",
      },
      {
        q: "Can I include a logo or photo?",
        a: "Yes, in a boxed or display format. Send the image and we will confirm the size and rate for your chosen edition.",
      },
    ],
    keywords: [
      "announcement newspaper ad",
      "public announcement in newspaper",
      "shop opening ad",
      "event announcement newspaper",
      "greeting ad in newspaper",
    ],
    related: ["obituary", "education", "business"],
  },

  statutory: {
    metaTitle: "Statutory Notices in Newspapers",
    metaDescription:
      "Publish statutory notices for company results, AGM, lost shares, IPO, property, possession, auction, insolvency and tender requirements in Indian newspapers.",
    h1: "Statutory & Legal Notices",
    eyebrow: "Company & compliance notices",
    intro: [
      "Statutory notices have to match the format the registrar, court or regulator expects. The wrong heading, a missing resolution line or an edition outside the required circulation can mean starting again.",
      "AD2PRINT publishes company, share, property and recovery notices in national and regional newspapers, working from the final draft approved by your company secretary or advocate.",
    ],
    priceNote:
      "Statutory notices are priced by size, edition and the number of insertions. Company results and AGM notices often use a fixed box; property and recovery notices vary with the wording.",
    highlights: [
      "Company results, board meetings and AGM notices",
      "Lost shares, IPO, buyback and postal ballot",
      "Land, deed, possession and public notices",
      "Auction, demand, insolvency and tender notices",
    ],
    formats: [
      { name: "Company notice", text: "Unaudited results, board meeting, AGM, amalgamation and registered-office changes." },
      { name: "Share notice", text: "Lost share certificate, IPO, rights issue, buyback, transfer and e-voting notices." },
      { name: "Property notice", text: "Land verification, lost deed, possession and public notices." },
      { name: "Recovery notice", text: "Auction, demand, insolvency and tender / e-tender notices." },
    ],
    faqs: [
      {
        q: "Which newspapers are accepted for statutory notices?",
        a: "It depends on the requirement — company law, court direction, lender or regulator. Tell us the rule or the authority asking, and we will confirm a suitable English and regional combination.",
      },
      {
        q: "Can you publish a company's unaudited financial results?",
        a: "Yes. Send the final results box in the prescribed format and we will place it in the newspaper and edition you select.",
      },
      {
        q: "Do you handle tender and e-tender notices?",
        a: "Yes. We publish tender invitations, corrections, auctions and expressions of interest in the editions specified by the organisation.",
      },
      {
        q: "How is the final rate calculated?",
        a: "The paper charges by column centimetre or a fixed minimum box. We confirm the size, edition, date and GST before booking.",
      },
    ],
    keywords: [
      "statutory notice newspaper",
      "AGM notice publication",
      "lost share certificate notice",
      "unaudited financial results newspaper ad",
      "possession notice newspaper",
      "tender notice publication",
    ],
    related: ["court-notice", "property", "lost-and-found"],
  },
};

export function getCategoryContent(slug: string) {
  return CATEGORY_CONTENT[slug];
}

export const CATEGORY_STEPS = [
  {
    name: "Choose the category and paper",
    text: "Pick the notice type, then the newspaper and city edition. The desk confirms availability before you pay.",
  },
  {
    name: "Send or draft the wording",
    text: "Type the matter, upload a document, or ask us to draft it. Translation into the paper's language is included.",
  },
  {
    name: "Approve the proof",
    text: "Check the final wording, size and publication date. Nothing prints until you approve.",
  },
  {
    name: "Publish and collect proof",
    text: "The ad runs after editorial approval. You receive the e-paper page and a GST invoice for your records.",
  },
];
