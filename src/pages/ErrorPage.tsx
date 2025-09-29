import { Link } from "react-router";

type Props = {
  message?: string;
};

export const ErrorPage = ({ message }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
      <h1 className="text-3xl font-bold text-red-600">Something went wrong</h1>
      <p className="text-gray-500">
        {message || "We couldn’t deliver your request. Please try again later."}
      </p>
      <Link
        to="/"
        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
      >
        Back to Home
      </Link>
    </div>
  );
};
