import { useContext } from "react";
import { Context } from "../context/AuthContext";

//se utilizador não estiver com login feito, é direcionado para esta pagina
export function Protected({ children }) {
  const { user } = useContext(Context);

  if (!user) {
    return (
      <div className="centro altura">
        <h2 className="text-center">
          Access Restricted. Please log in to continue.
        </h2>
      </div>
    );
  }

  return children;
}