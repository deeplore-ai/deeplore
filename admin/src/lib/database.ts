import { PUBLIC_FIREBASE_API_KEY, PUBLIC_FIREBASE_PROJECT_ID } from '$env/static/public';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore/lite';
import Character from './models/Character';
import Category from './models/Category';

const app = !getApps().length ? initializeApp({
    apiKey: PUBLIC_FIREBASE_API_KEY,
    projectId: PUBLIC_FIREBASE_PROJECT_ID
}) : getApp();

const db = getFirestore(app);

export async function getCharacters() {
    return (await getDocs(collection(db, 'character'))).docs.map((doc) => {
        const data = doc.data();
        const character = new Character();
        character.id = doc.id;
        character.firstname = data.firstname;
        character.lastname = data.lastname;
        character.categories = data.categories.map((_category: any) => {
            const category = new Category();
            category.name = _category.name;
            category.content = _category.content;
            return category;
        }) || [];
        return character;
    });
}

export async function upsertCharacter(character: Character) {
    return character.id ? updateCharacter(character.id, character) : createCharacter(character);
}

export async function createCharacter(character: Character) {
    return await addDoc(collection(db, 'character'), character);
}

export async function updateCharacter(id: string, character: Character) {
    return await updateDoc(doc(db, 'character', id), character.toDTO());
}

