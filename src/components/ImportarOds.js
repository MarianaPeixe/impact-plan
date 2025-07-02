import { importOdsToFirestore } from "../utils/importOds";
//importa as imgs dos ODS para o Firestore, nao está a ser utilizado no momento
function ImportarOds() {
  return (
    <button onClick={importOdsToFirestore}>
      Importar ODS
    </button>
  );
}

export default ImportarOds;