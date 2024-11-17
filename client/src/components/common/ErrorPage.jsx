import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <>
      <h1>Oops!</h1>
      <p>Errore non previsto. Ci scusiamo per il disagio creato.</p>
      <p>Per favore, riprova più tardi.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </>
  );
}