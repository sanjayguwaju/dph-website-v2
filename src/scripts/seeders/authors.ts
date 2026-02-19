import type { Payload } from "payload";
import type { Author, Media } from "../../payload-types";

interface AuthorSeedData {
  name: string;
  slug: string;
  email: string;
  bio: string;
  role: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
    instagram?: string;
  };
  featured: boolean;
}

const authorsData: AuthorSeedData[] = [
  {
    name: "Sarah Johnson",
    slug: "sarah-johnson",
    email: "sarah.johnson@hamronews.com",
    bio: "Sarah is a senior political correspondent with over 15 years of experience covering national and international politics. She has reported from conflict zones and interviewed world leaders.",
    role: "Senior Political Correspondent",
    social: {
      twitter: "https://twitter.com/sarahjohnson",
      linkedin: "https://linkedin.com/in/sarahjournalist",
    },
    featured: true,
  },
  {
    name: "Michael Chen",
    slug: "michael-chen",
    email: "michael.chen@hamronews.com",
    bio: "Michael covers technology and innovation, with a focus on AI, startups, and digital transformation. Former software engineer turned tech journalist.",
    role: "Technology Editor",
    social: {
      twitter: "https://twitter.com/michaelchentech",
      linkedin: "https://linkedin.com/in/michaelchen",
    },
    featured: true,
  },
  {
    name: "Emily Rodriguez",
    slug: "emily-rodriguez",
    email: "emily.rodriguez@hamronews.com",
    bio: "Emily is our lead business reporter, specializing in market analysis, corporate news, and economic policy. MBA from Wharton.",
    role: "Business Reporter",
    social: {
      twitter: "https://twitter.com/emilyrbiz",
      linkedin: "https://linkedin.com/in/emilyrodriguez",
    },
    featured: false,
  },
  {
    name: "David Park",
    slug: "david-park",
    email: "david.park@hamronews.com",
    bio: "David is a sports journalist covering major leagues and international sporting events. Former college athlete with a passion for storytelling.",
    role: "Sports Correspondent",
    social: {
      twitter: "https://twitter.com/davidparksports",
      instagram: "https://instagram.com/davidparksports",
    },
    featured: false,
  },
  {
    name: "Lisa Thompson",
    slug: "lisa-thompson",
    email: "lisa.thompson@hamronews.com",
    bio: "Lisa covers entertainment and pop culture, from Hollywood blockbusters to indie music scenes. Entertainment journalist for 10+ years.",
    role: "Entertainment Editor",
    social: {
      twitter: "https://twitter.com/lisatentertainment",
      instagram: "https://instagram.com/lisathompson",
    },
    featured: true,
  },
  {
    name: "Dr. James Wilson",
    slug: "james-wilson",
    email: "james.wilson@hamronews.com",
    bio: "Dr. Wilson is our health and science correspondent. With a background in medicine, he translates complex scientific topics for general audiences.",
    role: "Health & Science Correspondent",
    social: {
      twitter: "https://twitter.com/drjameswilson",
      linkedin: "https://linkedin.com/in/drjameswilson",
    },
    featured: false,
  },
  {
    name: "Priya Sharma",
    slug: "priya-sharma",
    email: "priya.sharma@hamronews.com",
    bio: "Priya reports on world news with a focus on South Asia and the Middle East. Multilingual journalist based in our international bureau.",
    role: "International Correspondent",
    social: {
      twitter: "https://twitter.com/priyasharmanews",
    },
    featured: false,
  },
  {
    name: "Alex Turner",
    slug: "alex-turner",
    email: "alex.turner@hamronews.com",
    bio: "Alex writes opinion pieces and editorials on current affairs, social issues, and public policy. Known for thought-provoking commentary.",
    role: "Opinion Columnist",
    social: {
      twitter: "https://twitter.com/alexturnerop",
    },
    featured: false,
  },
];

export async function seedAuthors(payload: Payload, avatars: Media[] = []): Promise<Author[]> {
  const createdAuthors: Author[] = [];

  for (let i = 0; i < authorsData.length; i++) {
    const authorData = authorsData[i];
    const avatar = avatars[i]; // Optional - may be undefined

    const author = await payload.create({
      collection: "authors",
      data: {
        ...authorData,
        ...(avatar ? { avatar: avatar.id } : {}),
      },
    });
    createdAuthors.push(author);
  }

  return createdAuthors;
}
