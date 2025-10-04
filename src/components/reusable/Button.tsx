import React from "react";
import { Link } from "react-router-dom";

export type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'danger' 
  | 'auth' 
  | 'link' 
  | 'pagination' 
  | 'paginationFirst'
  | 'paginationLast'
  | 'paginationNav' 
  | 'paginationActive' 
  | 'small';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'full';

export type ButtonType = 'button' | 'submit' | 'reset';

export type IconPosition = 'left' | 'right';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  type?: ButtonType;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  to?: string;
  className?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: IconPosition;
  [key: string]: any; // For additional props
}

/**
 * Reusable Button Component
 * 
 * @param {Object} props
 * @param {string} props.variant - Button style variant: 'primary', 'secondary', 'danger', 'auth', 'link', 'pagination', 'paginationNav', 'paginationActive', 'small'
 * @param {string} props.size - Button size: 'sm', 'md', 'lg', 'full'
 * @param {string} props.type - Button type: 'button', 'submit', 'reset'
 * @param {boolean} props.disabled - Whether button is disabled
 * @param {boolean} props.loading - Whether button is in loading state
 * @param {string} props.loadingText - Text to show when loading
 * @param {function} props.onClick - Click handler
 * @param {string} props.to - React Router Link destination (makes it a Link instead of button)
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Button content
 * @param {React.ReactNode} props.icon - Icon element to display
 * @param {string} props.iconPosition - Icon position: 'left', 'right'
 */
export default function Button({
  variant = "primary",
  size = "md",
  type = "button",
  disabled = false,
  loading = false,
  loadingText,
  onClick,
  to,
  className = "",
  children,
  icon,
  iconPosition = "left",
  ...props
}: ButtonProps) {
  // Base classes that apply to all buttons
  const baseClasses = "inline-flex items-center justify-center font-medium transition-colors focus:outline-none";

  // Variant classes
  const variantClasses = {
    // Primary blue button (most common)
    primary: "border border-transparent text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50",
    
    // Secondary button (white with border)
    secondary: "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50",
    
    // Danger/Delete button (red text)
    danger: "text-red-600 hover:text-red-900 bg-transparent border-none shadow-none p-0",
    
    // Auth buttons (purple theme for login/signup)
    auth: "text-white bg-purple-800 hover:bg-purple-900 disabled:opacity-70 disabled:cursor-not-allowed border-none",
    
    // Link style buttons (blue text, no background)
    link: "text-blue-600 hover:text-blue-900 bg-transparent border-none shadow-none p-0",
    
    // Pagination buttons (gray theme) - no rounded corners by default for connected appearance
    pagination: "border border-gray-300 text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50 rounded-none -ml-px",
    
    // First pagination button (rounded left)
    paginationFirst: "border border-gray-300 text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50 rounded-l-md rounded-r-none",
    
    // Last pagination button (rounded right)
    paginationLast: "border border-gray-300 text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50 rounded-r-md rounded-l-none -ml-px",
    
    // Pagination navigation buttons (with icons)
    paginationNav: "border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 rounded-none -ml-px",
    
    // Active pagination button
    paginationActive: "border border-blue-500 bg-blue-50 text-blue-600 z-10 rounded-none -ml-px",
    
    // Small buttons (like close buttons in tags)
    small: "text-blue-400 hover:bg-blue-200 hover:text-blue-600 bg-transparent border-none shadow-none rounded-full h-4 w-4"
  };

  // Size classes
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm rounded-md",
    md: "px-4 py-2 text-sm rounded-md",
    lg: "px-6 py-3 text-base rounded-md",
    full: "w-full py-4 px-4 text-base", // For auth forms
    
    // Special sizes for specific variants
    "pagination-sm": "px-4 py-2 text-sm",
    "pagination-nav": "px-2 py-2 text-sm",
    "pagination-nav-left": "px-2 py-2 text-sm rounded-l-md",
    "pagination-nav-right": "px-2 py-2 text-sm rounded-r-md",
    "small-button": "h-4 w-4 text-xs"
  };

  // Determine size class based on variant and size
  let appliedSizeClass = sizeClasses[size];
  
  // Override size for specific variants
  if (variant === "auth") {
    appliedSizeClass = sizeClasses.full;
  } else if (variant === "pagination" || variant === "paginationActive" || variant === "paginationFirst" || variant === "paginationLast") {
    appliedSizeClass = sizeClasses["pagination-sm"];
  } else if (variant === "paginationNav") {
    appliedSizeClass = sizeClasses["pagination-nav"];
  } else if (variant === "small") {
    appliedSizeClass = sizeClasses["small-button"];
  }

  // Shadow classes (most buttons have shadow except some variants)
  const shadowClasses = ["danger", "link", "small", "paginationActive"].includes(variant) 
    ? "" 
    : "shadow-sm";

  // Combine all classes
  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${appliedSizeClass} ${shadowClasses} ${className}`.trim();

  // Loading spinner component
  const LoadingSpinner = () => (
    <svg 
      className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  // Content with icon and loading state
  const buttonContent = (
    <>
      {loading && <LoadingSpinner />}
      {!loading && icon && iconPosition === "left" && <span className="mr-2">{icon}</span>}
      {loading ? (loadingText || children) : children}
      {!loading && icon && iconPosition === "right" && <span className="ml-2">{icon}</span>}
    </>
  );

  // Render as Link if 'to' prop is provided
  if (to) {
    return (
      <Link
        to={to}
        className={buttonClasses}
        {...props}
      >
        {buttonContent}
      </Link>
    );
  }

  // Render as button
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={buttonClasses}
      {...props}
    >
      {buttonContent}
    </button>
  );
}

// Named exports for specific button variants (for convenience)
// These can be used as shortcuts: <PrimaryButton>Save</PrimaryButton> instead of <Button variant="primary">Save</Button>
// Note: Commented out due to TypeScript strict mode issues, use main Button component with variant prop instead
/*
export const PrimaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => <Button variant="primary" {...props} />;
export const SecondaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => <Button variant="secondary" {...props} />;
export const DangerButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => <Button variant="danger" {...props} />;
export const AuthButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => <Button variant="auth" {...props} />;
export const LinkButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => <Button variant="link" {...props} />;
export const PaginationButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => <Button variant="pagination" {...props} />;
*/