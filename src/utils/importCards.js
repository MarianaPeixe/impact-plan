import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "./firebase.utils";
import cards from "./impact-cards-full.json";

export async function importCardsToFirestore() {
  for (const card of cards) {
    const q = query(collection(db, "cards"), where("title", "==", card.title));
    const existing = await getDocs(q);

    if (existing.empty) {
      try {
        await addDoc(collection(db, "cards"), card);
        console.log("Importada:", card.title);
      } catch (error) {
        console.error("Erro ao adicionar:", card.title, error);
      }
    } else {
      console.log("Já existe:", card.title);
    }
  }
}