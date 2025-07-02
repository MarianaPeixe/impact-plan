import { useContext } from "react";
import { signInWithGooglePopup } from "../utils/firebase.utils";
import { Context } from "../context/AuthContext";

//utiliza o signin withgooglepopup para fazer o login com o google/firebase
const SignIn = () => {
  const { setUser } = useContext(Context);

  const logGoogleUser = async (e) => {
    try {
      e.preventDefault();
      const response = await signInWithGooglePopup();
      setUser(response.user); 
    } catch (err) {
      console.log("Error signing in:", err);
    }
  };

  return (
    <div className="text-start mt-4 p-0">
      <button onClick={logGoogleUser} className="botaoForm">

        Sign in with Google
      </button>
    </div>
  );
};
export default SignIn;