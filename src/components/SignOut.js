import { signOut, getAuth } from "firebase/auth";

import logoutIcon from './imgs/Nav/logout.svg';

//fazer signout/logout da ferramenta
function SignOut(){
    const auth = getAuth();
    async function handleSignOut() {
    try {
      await signOut(auth);
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <img
      src={logoutIcon}
      alt="Logout"
      onClick={handleSignOut}
      className="sidebar-icon"
      style={{ cursor: "pointer" }}
      title="Logout"
    />
  )
}

export default SignOut;