import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const err = useRouteError();
  const status = err?.status || "Unknown";
  const statusText = err?.statusText || "Something went wrong";

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Error!</h1>
      <h2 className="text-2xl text-gray-800">
        {status} : {statusText}
      </h2>
    </div>
  );
};

export default ErrorPage;
