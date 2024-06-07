import { PUBLIC_FIREBASE_API_KEY, PUBLIC_FIREBASE_PROJECT_ID } from '$env/static/public';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, updateDoc, doc, getDoc } from 'firebase/firestore/lite';
import Character from './models/Character';
import { SimpleContent } from './models/SimpleContent';

const app = !getApps().length ? initializeApp({
    apiKey: PUBLIC_FIREBASE_API_KEY,
    projectId: PUBLIC_FIREBASE_PROJECT_ID
}) : getApp();

const db = getFirestore(app);

export async function getCharacters() {
    return (await getDocs(collection(db, 'character'))).docs.map((doc) => {
        const data = doc.data();
        data.id = doc.id;
        return Character.fromDTO(data);
    });
}

export async function getCharacter(id: string) {
    const character = await getDoc(doc(db, 'character', id));
    return Character.fromDTO(character.data());
}

export async function upsertCharacter(character: Character) {
    const doc = character.id ? await updateCharacter(character.id, character) : await createCharacter(character);
    const id = doc?.id || character.id;
    if (!id) {
        throw new Error("Upsert failed");
    }
    const retrievedCharacter = await getCharacter(id);
    retrievedCharacter.id = id;
    return Character.fromDTO(retrievedCharacter);
}

export async function createCharacter(character: Character) {
    const dto = character.toDTO();
    delete dto.id;
    return await addDoc(collection(db, 'character'), dto);
}

export async function updateCharacter(id: string, character: Character) {
    return await updateDoc(doc(db, 'character', id), character.toDTO());
}

export async function getSimpleContents(table: string) {
    return (await getDocs(collection(db, table))).docs.map((doc) => {
        const data = doc.data();
        data.id = doc.id;
        return SimpleContent.fromDTO(data);
    });
}

export async function getSimpleContent(table: string, id: string) {
    const content = await getDoc(doc(db, table, id));
    return SimpleContent.fromDTO(content.data());
}

export async function upsertSimpleContent(table: string, content: SimpleContent) {
    const doc = content.id ? await updateSimpleContent(table, content.id, content) : await createSimpleContent(table, content);
    const id = doc?.id || content.id;
    if (!id) {
        throw new Error("Upsert failed");
    }
    const retrievedContent = await getSimpleContent(table, id);
    retrievedContent.id = id;
    return SimpleContent.fromDTO(retrievedContent);
}

export async function createSimpleContent(table: string, content: SimpleContent) {
    const dto = content.toDTO();
    delete dto.id;
    return await addDoc(collection(db, table), dto);
}

export async function updateSimpleContent(table: string, id: string, content: SimpleContent) {
    return await updateDoc(doc(db, table, id), content.toDTO());
}

