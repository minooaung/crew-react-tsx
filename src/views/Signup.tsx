import { useRef, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSignup } from "../hooks/queries/useAuth";
import { SignupData } from "../types";
import ErrorAlert from "../utils/ErrorAlert";

interface ValidationErrors {
  [key: string]: string[];
}

export default function Signup(): JSX.Element {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmationRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const signupMutation = useSignup();

  const onSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    if (
      !nameRef.current ||
      !emailRef.current ||
      !passwordRef.current ||
      !passwordConfirmationRef.current
    )
      return;

    const payload: SignupData = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      password_confirmation: passwordConfirmationRef.current.value,
    };

    try {
      await signupMutation.mutateAsync(payload);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      // Error handling is done in the mutation hook
      console.error("Signup failed:", err);
    }
  };

  const validationErrors = signupMutation.error as ValidationErrors | null;

  return (
    <div className="w-[360px] bg-white p-8 shadow-sm relative z-10 animated fadeInDown">
      <form onSubmit={onSubmit}>
        <h1 className="text-xl mb-4 text-center font-bold text-gray-900">
          Create an account
        </h1>

        {validationErrors && (
          <ErrorAlert error={validationErrors} variant="auth" />
        )}

        {/* {validationErrors && (
          <div className="bg-red-500 text-white p-4 rounded-lg mb-4">
            {Object.keys(validationErrors).map((key) => (
              <p key={key}>{validationErrors[key][0]}</p>
            ))}
          </div>
        )} */}

        <input
          ref={nameRef}
          placeholder="Full Name"
          className="w-full border-2 border-gray-200 p-4 mb-4 text-sm transition-all focus:border-purple-700 outline-none"
          required
          autoComplete="name"
        />
        <input
          ref={emailRef}
          type="email"
          placeholder="Email"
          className="w-full border-2 border-gray-200 p-4 mb-4 text-sm transition-all focus:border-purple-700 outline-none"
          required
          autoComplete="username"
        />
        <input
          ref={passwordRef}
          type="password"
          placeholder="Password"
          className="w-full border-2 border-gray-200 p-4 mb-4 text-sm transition-all focus:border-purple-700 outline-none"
          required
          autoComplete="new-password"
        />
        <input
          ref={passwordConfirmationRef}
          type="password"
          placeholder="Password Confirmation"
          className="w-full border-2 border-gray-200 p-4 mb-4 text-sm transition-all focus:border-purple-700 outline-none"
          required
          autoComplete="new-password"
        />

        <button
          className="w-full bg-purple-800 text-white py-4 px-4 text-base transition-all hover:bg-purple-900 disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={signupMutation.isPending}
        >
          {signupMutation.isPending ? "Creating account..." : "Signup"}
        </button>

        <p className="mt-4 text-center text-gray-400 text-base">
          Already registered?{" "}
          <Link
            to="/login"
            className="text-purple-800 no-underline hover:text-purple-900"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
