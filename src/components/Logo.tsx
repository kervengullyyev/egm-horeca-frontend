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
  width = 120, 
  height = 18, 
  className = "h-6 md:h-8 w-auto",
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
