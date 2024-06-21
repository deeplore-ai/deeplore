# Deep Lore

## Origine

L'idée de ce projet a été porté par Matthieu Gindre lors du Hackathon Shift Gen AI Nantes. L'idée est de DeepLore est de créer un écosystème où les personnages prennent vie et évolue dans le temps. Une équipe composé de trois pôles :

- Front : Composé de Matthieu Gindre, Lucas Rouret et Josselin Tillay-Doledec. Ils s'occupent de développer l'application en Kaboom et en TS.
- Back (LLM) : Composé de Pierre Cartier et Thomas Bontemps. Ils s'occupent de développer les requêtes API et le développement "Intelligent" de chaque personnage.
- Designer : Composé de Nicolas Livanis et Matthieu Gindre. Ils s'occupent d'écrire le script et le lien de chaque PNJ.

## Ce projet

DeepLore se sert de sa technologie dans le jeu "Village & Lies". Dans ce jeu, vous incarnez un détective parisien qui se rend en Savoie afin de trouver un criminel dans un village reclu. Pour ce faire, vous devez interroger les villageois afin découvrir le poteau rose ! L'histoire évolue en temps réel car les PNJ peuvent discuter entre eux dans un monde évolutif !

L'envie de l'équipe est de finir le jeu puis de permettre à tout le monde d'essayer cet technologie.
Un petit trailer youtube [ici](https://youtu.be/APyIznX-HLs).  

## La technologie

Deep Lore est un concept où un LLM est affecté à chaque PNJ afin de les augmenter afin d'interagir en langage naturel avec le joueur, mais aussi entre PNJ. Grace à une narration travaillée et riche, chaque PNJ a sa propre histoire, ses propres intentions et ses propres "personnalités". L'histoire va donc évoluer en fonction du joueur, et une bonne ou une mauvaise action va pouvoir se propager à travers les PNJ qui vont discuter les uns avec les autres.  

## Installation

The installation is in two parts, the **Game** and the **Back**. Follows those instructions :  

[Installation backend](https://github.com/deeplore-ai/deeplore/blob/master/server/README.md)

For the Game, install node with Chocolatey :  

```PowerShell
choco install nodejs.install
```

Then, open a command prompt :  

```cmd.exe
cd deeplore/game
npm install 
npm run dev
```

## Remerciements

Merci à notre sponsor principal, **Google** et **Google Cloud Platform** qui nous permet de développer et de travailler autour des modèles de langages.
