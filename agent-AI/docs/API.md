# Endpoint: /hear

## Description

Cet endpoint permet d'enregistrer les discours d'un personnage non-joueur (NPC) spécifique.

## Méthode HTTP

POST

## Paramètres de requête

Aucun

## Corps de la requête

Un objet JSON représentant le discours du NPC. L'objet doit contenir les champs suivants:

- `npc`: Le nom du NPC qui a prononcé le discours. (Obligatoire)
- `speaker`: Le nom du personnage qui a entendu le discours. (Optionnel)
- `content`: Le contenu du discours. (Optionnel)

## Exemple de corps de requête

```json
{
    "id": str # id of the person who is playing the game,
    "firstname": "Gandalf",
    "lastname": "",
    "speaker": "Frodo",
    "distance": "PROCHE",
    "content": "Un grand pouvoir implique de grandes responsabilités.",
    "noAnswerExpected": True,
}
