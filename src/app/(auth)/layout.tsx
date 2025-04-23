import GradientLogo from "@/components/common/shared/gradient-logo";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { MoveRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface AuthLayoutProps {
  readonly children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen grid-cols-1 overflow-hidden md:grid-cols-3 lg:grid-cols-2">
      <AspectRatio ratio={16 / 9}>
        <Image
          src="https://res.cloudinary.com/dbyc0sncy/image/upload/v1745439354/Login_cuuhqh.png"
          alt="Ethaq Mart"
          fill
          className="absolute inset-0 object-cover"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-background/60 md:to-background/40" />
      </AspectRatio>
      <main className="container !px-0 absolute top-1/2 col-span-1 flex -translate-y-1/2 items-center md:static md:top-0 md:col-span-2 md:flex md:translate-y-0 lg:col-span-1 justify-center flex-col">
        <Link
          href={"/"}
          className=" font-bold p-2  border-[1px] rounded-md flex 
          items-center justify-center gap-1 text-sm bg-white 
          dark:bg-black dark:text-white dark:border-white"
        >
          <MoveRight />
          الرجوع الى المتجر
        </Link>
        {children}
      </main>
    </div>
  );
}
