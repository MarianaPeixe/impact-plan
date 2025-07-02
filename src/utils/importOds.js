import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "./firebase.utils";
import ods from "./ods.json"; 

export async function importOdsToFirestore() {
  for (const od of ods) {
    const q = query(collection(db, "ods"), where("id", "==", od.id));
    const existing = await getDocs(q);

    if (existing.empty) {
      try {
        await addDoc(collection(db, "ods"), od);
        console.log("Importado:", od.title);
      } catch (error) {
        console.error("Erro ao adicionar:", od.title, error);
      }
    } else {
      console.log("Já existe:", od.title);
    }
  }
}