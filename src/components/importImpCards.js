import { importCardsToFirestore } from '../utils/importCards';
//importar as cartas para o firestore
function ImportarCartas(){
    return (
        <button onClick={importCardsToFirestore}>Importar Cartas</button>
    )
}

export default ImportarCartas;