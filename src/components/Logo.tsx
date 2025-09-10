import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
  href?: string;
  alt?: string;
}

export default function Logo({ 
  width = 100, 
  height = 15, 
  className = "h-5 md:h-6 w-auto",
  href = "/",
  alt = "EGM HORECA"
}: LogoProps) {
  const logoElement = (
    <Image 
      src="/logo.svg" 
      alt={alt} 
      width={width}
      height={height}
      className={className}
    />
  );

  if (href) {
    return (
      <Link href={href} className="flex items-center">
        {logoElement}
      </Link>
    );
  }

  return logoElement;
}
