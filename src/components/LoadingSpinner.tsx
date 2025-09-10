import Logo from "./Logo";

interface LoadingSpinnerProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export default function LoadingSpinner({ 
  message = "Loading...", 
  size = "md" 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative mb-4">
        <Logo 
          width={50}
          height={7}
          className="h-5 w-auto opacity-50"
          href=""
        />
        <div className={`absolute inset-0 ${sizeClasses[size]} border-2 border-brand-primary border-t-transparent rounded-full animate-spin`}></div>
      </div>
      <p className="text-sm text-gray-600">{message}</p>
    </div>
  );
}
