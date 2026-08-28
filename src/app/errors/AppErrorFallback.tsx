//TODO find appropriate name for this
export const AppErrorFallback = () => {
  return (
    <main>
      <h1>Something went wrong</h1>
      <p>An unexpected error occurred. Please reload window and try again.</p>

      <button onClick={() => window.location.reload()}>
        Reload application
      </button>
    </main>
  );
};
