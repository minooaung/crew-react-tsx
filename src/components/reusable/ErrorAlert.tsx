import React from "react";

interface ErrorAlertProps {
  error: string | Record<string, string[] | string> | null | undefined;
  variant?: "default" | "auth"; // default for form errors, auth for login/signup
}

export default function ErrorAlert({
  error,
  variant = "default",
}: ErrorAlertProps) {
  if (!error) return null;

  const containerClass =
    variant === "auth"
      ? "bg-red-500 text-white p-4 rounded-lg mb-4"
      : "rounded-md bg-red-100 text-red-800 p-4 mb-4";

  const textClass = "text-sm font-medium";

  const renderMessages = (): React.ReactNode => {
    if (typeof error === "string") {
      return <p className={textClass}>{error}</p>;
    }

    if (typeof error === "object" && error !== null) {
      return Object.keys(error).map((key) => {
        const value = error[key];
        const message = Array.isArray(value) ? value[0] : value;
        return (
          <p key={key} className={textClass}>
            {message}
          </p>
        );
      });
    }

    return null;
  };

  return (
    <div className={containerClass}>
      <div className="flex">
        <div className="ml-3">{renderMessages()}</div>
      </div>
    </div>
  );
}
