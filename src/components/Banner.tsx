export default function Banner(): JSX.Element {
  let bannerText = "Welcome to Min Oo's Laravel & React App!";
  if (import.meta.env.VITE_BACKEND_FRAMEWORK === "ASP.NET") {
    bannerText = "Welcome to Min Oo's ASP.NET & React App!";
  }
  return (
    <div className="bg-blue-600 text-white text-center py-4 shadow-md">
      <h2 className="text-xl font-bold text-white">{bannerText}</h2>
      <p className="text-sm text-white">
        Please sign in or create an account to continue
      </p>
    </div>
  );
}
