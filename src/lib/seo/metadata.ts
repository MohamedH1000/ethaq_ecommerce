import { metaKeywords } from "./keywords";
import type { Metadata } from "next";
import { siteConfig } from "./site";

export const defaultMetadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "ايثاق ماركت",
    template: "ايثاق ماركت",
  },
  description:
    "مرحبًا بكم في ايثاق ماركت، وجهتكم المثالية للتسوق عبر الإنترنت! نحن نقدم سوقًا متكاملًا يشمل مجموعة متنوعة من المنتجات المقدمة من بائعين موثوقين لتجربة تسوق سهلة وآمنة.",
  keywords: metaKeywords.join(", "),
  creator: "Nashama Technology",
  publisher: "Nashama Technology",
  applicationName: "Ethaq Mart",
  viewport: "width=device-width, initial-scale=1.0",
  colorScheme: "light",
  category: "ايثاق ماركت: سوق متعدد الفئات لجميع احتياجاتك",
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  authors: [
    {
      name: "Nashama Technology",
      url: "https://nashamatech.tech/",
    },
  ],
  themeColor: "#ffffff",
  appLinks: {
    web: {
      url: siteConfig.url,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: "ايثاق مارت",
    title: "ايثاق ماركت",
    description:
      "مرحبًا بكم في ايثاق ماركت، وجهتكم المثالية للتسوق عبر الإنترنت! نحن نقدم سوقًا متكاملًا يشمل مجموعة متنوعة من المنتجات المقدمة من بائعين موثوقين لتجربة تسوق سهلة وآمنة.",
    images: [
      {
        url: `https://res.cloudinary.com/dbyc0sncy/image/upload/v1745439493/Logo_light_h4dulg.png`,
        width: 800,
        height: 600,
        alt: "ايثاق ماركت",
      },
    ],
    emails: ["ethaq0@gmail.com"],
    phoneNumbers: ["00966559681110"],
    countryName: "Saudi Arabia",
  },
  // icons: {
  //   // TODO: Add icons
  //   icon: {},
  // },
  instagram: {
    creator: "@ethaq_0",
    site: "@Ethaq_store",
    card: "summary_large_image",
    title: "ايثاق ماركت",
    description:
      "مرحبًا بكم في ايثاق ماركت، وجهتكم المثالية للتسوق عبر الإنترنت! نحن نقدم سوقًا متكاملًا يشمل مجموعة متنوعة من المنتجات المقدمة من بائعين موثوقين لتجربة تسوق سهلة وآمنة.",
    images: [
      {
        url: `https://res.cloudinary.com/dbyc0sncy/image/upload/v1745439493/Logo_light_h4dulg.png`,
        width: 800,
        height: 600,
        alt: "ايثاق ماركت",
      },
    ],
  },
} as Metadata;
