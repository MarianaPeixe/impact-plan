import { createContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../utils/firebase.utils';

//cria o contexto de autenticação do utilizador e é utilizddo em toda a ferramenta

export const Context = createContext();

export function AuthContext ({children}){
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() =>{
        let unsubscribe;
        unsubscribe = onAuthStateChanged(auth, (currentUser) =>{
            setLoading(false);
            if(currentUser) setUser(currentUser)
            else {setUser(null)}
        });
        return()=>{
            if(unsubscribe)unsubscribe();
        }
    },[])

    const values = {
        user: user,
        setUser: setUser,
        loading: loading
    }

return <Context.Provider value={values}>
        {!loading &&
        children
        }
    </Context.Provider>
}