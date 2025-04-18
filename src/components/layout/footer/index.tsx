import { Icons } from "@/components/ui/icons";
import {
  CalendarDays,
  Hourglass,
  HourglassIcon,
  Instagram,
  Mail,
  Phone,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const informationNav = [
  { label: "About Us", path: "/about-us" },
  { label: "Privacy Policy", path: "/privacy-policy" },
  { label: "Contact Us", path: "/contact-us" },
  { label: "Site Map", path: "/site-map" },
];

const accountNav = [
  { label: "الحساب", path: "/account/dashboard" },
  { label: "تغيير الباسوورد", path: "/account/change-password" },
  { label: "طلباتي", path: "/account/orders" },
  { label: "العناوين", path: "/account/addresses" },
];

const SOCIAL_NETWORKS = [
  {
    label: "Instagram",
    url: `https://www.instagram.com/ethaq_0/?igsh=MWR0eXRsd3RoZjU3#`,
    icon: <Instagram />,
  },
  {
    label: "Twitter",
    url: `https://x.com/ethaq_0?s=11&t=M3-k8S49w5n7kDxqbs685A`,
    icon: <Icons.twitter className="w-5" />,
  },
  {
    label: "snapchat",
    url: `https://www.snapchat.com/add/ethaq_0?invite_id=yvG_5-Ax&share_id=rDvF3Dv2Ti6r2ATeM5wAOw&sid=3b2b5c87a56e429b88778ae726430f32`,
    icon: (
      <Image
        src={"/assets/snapchat.png"}
        alt="snapchat"
        width={30}
        height={30}
      />
    ),
  },
];

export const Footer = () => {
  // Phone number and email with proper formatting
  const phoneNumber = "00966559681110";
  const email = "ethaq0@gmail.com";

  // WhatsApp link (with international format)
  const whatsappLink = `https://wa.me/${phoneNumber.replace(/^00/, "")}`;

  // Mailto link
  const mailToLink = `mailto:${email}`;

  return (
    <footer className="text-white">
      <div className="bg-[#FAFAFA]">
        <div className="container pt-14 pb-12 flex items-start gap-5 md:gap-10 justify-between max-sm:flex-col max-sm:items-center max-sm:justify-between">
          <div className="space-y-3 md:space-y-6 text-center xl:text-left col-span-12 xl:col-span-4">
            <h5 className="text-2xl font-medium text-black text-right">
              تواصل معنا
            </h5>
            <p className="text-black text-right text-lg">
              مرحباً، نحن دائماً منفتحون على التعاون والاقتراحات، تواصل معنا
              بإحدى الطرق التالية:
            </p>
            <address className="flex flex-wrap not-italic gap-y-5 justify-between text-right">
              <dl className="max-sm:bg-[#000957] space-y-1 bg-text-black py-4 px-3 xl:p-0 xl:bg-transparent rounded xl:rounded-none w-full sm:w-[calc(100%/2-10px)] lg:w-[calc(100%/4-12px)] xl:w-[calc(100%/2-30px-1px)]">
                <dt className="uppercase text-md text-black flex gap-3 max-sm:text-white">
                  رقم الهاتف <Phone />
                </dt>
                <dd className="text-sm text-black max-sm:text-white">
                  <Link
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {phoneNumber}
                  </Link>
                </dd>
              </dl>
              <dl className="space-y-1 bg-gray-600 max-sm:bg-[#000957] py-4 px-3 xl:p-0 xl:bg-transparent rounded xl:rounded-none w-full sm:w-[calc(100%/2-10px)] lg:w-[calc(100%/4-12px)] xl:w-[calc(100%/2-30px-1px)]">
                <dt className="uppercase text-md text-black max-sm:text-white flex gap-3">
                  البريد الالكتروني <Mail />
                </dt>
                <dd className="text-sm break-words text-black max-sm:text-white">
                  <Link href={mailToLink} className="hover:underline">
                    {email}
                  </Link>
                </dd>
              </dl>
              <dl className="space-y-1 max-sm:bg-[#000957] bg-gray-600 py-4 px-3 xl:p-0 xl:bg-transparent rounded xl:rounded-none w-full sm:w-[calc(100%/2-10px)] lg:w-[calc(100%/4-12px)] xl:w-[calc(100%/2-30px-1px)]">
                <dt className="uppercase text-md text-black max-sm:text-white flex gap-3">
                  ايام العمل <CalendarDays />
                </dt>
                <dd className="text-sm text-black max-sm:text-white">
                  جميع ايام الاسبوع
                </dd>
              </dl>
              <dl className="space-y-1 max-sm:bg-[#000957] bg-gray-600 py-4 px-3 xl:p-0 xl:bg-transparent rounded xl:rounded-none w-full sm:w-[calc(100%/2-10px)] lg:w-[calc(100%/4-12px)] xl:w-[calc(100%/2-30px-1px)]">
                <dt className="uppercase text-md text-black max-sm:text-white flex gap-3">
                  ساعات العمل <HourglassIcon />
                </dt>
                <dd className="text-sm text-black max-sm:text-white">
                  24/7 بخدمتكم
                </dd>
              </dl>
            </address>
          </div>
          <div className="space-y-3 md:space-y-6 text-center md:text-start col-span-12 md:col-span-6 xl:col-span-4">
            <dl className="space-y-1 bg-text-black py-4 px-3 xl:p-0 xl:bg-transparent rounded xl:rounded-none w-full sm:w-[calc(100%/2-10px)] lg:w-[calc(100%/4-12px)] xl:w-[calc(100%/2-30px-1px)]">
              <dt className="uppercase text-2xl font-medium text-black mb-5">
                موقعنا
              </dt>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d442447.71208967076!2d40.188472!3d29.961528!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjnCsDU3JzQxLjUiTiA0MMKwMTEnMTguNSJF!5e0!3m2!1sen!2seg!4v1743703806140!5m2!1sen!2seg"
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: "10px" }}
                allow="fullscreen"
                loading="lazy"
                className="aspect-video max-sm:w-[100%] max-sm:h-[100%] w-[300px]"
                allowFullScreen
              ></iframe>
            </dl>
            <p className="text-black">تابعنا على وسائل التواصل الاجتماعي</p>
            <div className="inline-flex items-center gap-5 p-3">
              {SOCIAL_NETWORKS.map((network) => (
                <Link
                  key={network.label}
                  href={{ pathname: network.url }}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:scale-105 text-black"
                >
                  {network.icon}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#000957] dark:bg-[#e11d48]">
        <div className="container py-5 flex items-center justify-center flex-wrap gap-5">
          <p className="text-sm text-gray-400 md:text-start text-center flex dark:text-[white]">
            &copy; {new Date().getFullYear()} حقوق النشر محفوظة لإيثاق للحلول
            المالية . تم التطوير بواسطة &nbsp;
            <Link
              href="https://nashamatech.tech/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src={"/assets/nashama.jpg"}
                alt="Nashama Technology"
                height={20}
                width={20}
                className="rounded-md"
              />
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};
