import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export const RouteError = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h2>{error.status}</h2>
        <p>{error.statusText}</p>
      </div>
    );
  }

  if (error instanceof Error) {
    return (
      <div>
        <h2>Something went wrong</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  return <p>Unknown error occurred.</p>;
};
