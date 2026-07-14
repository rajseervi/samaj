export interface BlogPost {
  slug: string;
  title: string;
  titleHi: string;
  excerpt: string;
  excerptHi: string;
  date: string;
  category: "seva" | "event" | "announcement" | "story";
  imageUrl: string;
  author: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "annadan-mahadan-april-2026",
    title: "Annadan Mahadan at Haridwar Bhojanshala",
    titleHi: "हरिद्वार भोजनशाला में अन्नदान महादान",
    excerpt:
      "Over 500 devotees served with love and devotion at the sacred bhojanshala. A day of selfless service and community bonding.",
    excerptHi:
      "हरिद्वार भवन की भोजनशाला में 500 से अधिक श्रद्धालुओं को प्रेम और श्रद्धा से भोजन कराया गया। निःस्वार्थ सेवा और सामुदायिक जुड़ाव का एक अद्भुत दिन।",
    date: "2026-04-15",
    category: "seva",
    imageUrl: "/mataji-blog.jpg",
    author: "समाज ट्रस्ट",
  },
  {
    slug: "navratri-special-bhandara",
    title: "Navratri Special Bhandara 2026",
    titleHi: "नवरात्रि विशेष भंडारा 2026",
    excerpt:
      "A grand community feast organized during the auspicious nine nights. Thousands joined in prayer, devotion, and community dining.",
    excerptHi:
      "शुभ नौ रात्रियों के दौरान भव्य सामुदायिक भंडारे का आयोजन। हजारों श्रद्धालुओं ने प्रार्थना, भक्ति और सामुदायिक भोजन में भाग लिया।",
    date: "2026-03-24",
    category: "event",
    imageUrl: "/mataji-blog.jpg",
    author: "समाज ट्रस्ट",
  },
  {
    slug: "new-bhojanshala-expansion",
    title: "Bhojanshala Expansion Announcement",
    titleHi: "भोजनशाला विस्तार की घोषणा",
    excerpt:
      "With growing community support, the trust announces expansion of the Haridwar bhojanshala to serve more devotees every day.",
    excerptHi:
      "बढ़ते सामुदायिक समर्थन के साथ, ट्रस्ट ने अधिक श्रद्धालुओं को प्रतिदिन सेवा देने के लिए हरिद्वार भोजनशाला के विस्तार की घोषणा की।",
    date: "2026-02-10",
    category: "announcement",
    imageUrl: "/mataji-blog.jpg",
    author: "समाज ट्रस्ट",
  },
  {
    slug: "bhamashah-samman-samaroh",
    title: "Bhamashah Samman Samaroh — Honoring Our Donors",
    titleHi: "भामाशाह सम्मान समारोह — हमारे दानदाताओं का अभिनंदन",
    excerpt:
      "A heartfelt tribute to the noble donors whose generosity keeps the seva alive. Stories of sacrifice, devotion, and community spirit.",
    excerptHi:
      "उन महान दानदाताओं को हार्दिक श्रद्धांजलि जिनकी उदारता सेवा को जीवित रखती है। त्याग, भक्ति और सामुदायिक भावना की कहानियाँ।",
    date: "2026-01-28",
    category: "story",
    imageUrl: "/mataji-blog.jpg",
    author: "समाज ट्रस्ट",
  },
  {
    slug: "mataji-jayanti-celebration",
    title: "Shri Aai Mataji Jayanti — A Divine Celebration",
    titleHi: "श्री आई माताजी जयंती — एक दिव्य उत्सव",
    excerpt:
      "The trust celebrated the birth anniversary of Jagat Janani Shri Aai Mataji with deep devotion, bhajans, and a grand community feast.",
    excerptHi:
      "ट्रस्ट ने जगत जननी श्री आई माताजी की जयंती गहरी श्रद्धा, भजन और भव्य सामुदायिक भोज के साथ मनाई।",
    date: "2025-12-05",
    category: "event",
    imageUrl: "/mataji-blog.jpg",
    author: "समाज ट्रस्ट",
  },
  {
    slug: "community-outreach-winter",
    title: "Winter Community Outreach Program",
    titleHi: "शीतकालीन सामुदायिक सहायता कार्यक्रम",
    excerpt:
      "Blankets, warm meals, and winter essentials distributed to those in need around Haridwar. Over 1000 families supported.",
    excerptHi:
      "हरिद्वार के आसपास जरूरतमंदों को कंबल, गर्म भोजन और सर्दी की आवश्यक वस्तुएं वितरित की गईं। 1000 से अधिक परिवारों को सहायता।",
    date: "2025-11-20",
    category: "seva",
    imageUrl: "/mataji-blog.jpg",
    author: "समाज ट्रस्ट",
  },
];

export function getBlogPosts(): BlogPost[] {
  return blogPosts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getRelatedPosts(currentSlug: string, count = 3): BlogPost[] {
  return blogPosts
    .filter((p) => p.slug !== currentSlug)
    .slice(0, count);
}
