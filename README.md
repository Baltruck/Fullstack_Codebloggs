# Collaboration et Conception
 Jeremy Gagnon et Sébastien Doyon
## How To Run
Create an Atlas URI connection parameter in `mern/server/config.env` with your Atlas URI:
```
ATLAS_URI=mongodb+srv://<username>:<password>@sandbox.jadwj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
PORT=5000
```

Start server:
```
cd mern/server
npm install
npm start
```

Start Web server
```
cd mern/client
npm install
npm start
```

## Disclaimer

Use at your own risk; not a supported MongoDB product

# DOCUMENT DE RECHERCHE
CONCEPTION RÉACTIVE:
Est une approche de conception Web qui vise à rendre les sites Web fluides et flexibles, en s'adaptant automatiquement à la taille de l'écran de l'utilisateur. Elle repose sur l'utilisation de grilles fluides, d'images flexibles et de requêtes médias CSS pour ajuster la mise en page et les éléments de la page en fonction de la résolution d'affichage et de l'orientation de l'appareil. Elle permet de créer une seule version d'un site Web qui fonctionne bien sur une variété d'appareils tels que ordinateurs, smartphones et tablettes.

CONCEPTION ADAPTATIVE:
Est une approche de conception Web qui consiste à créer plusieurs versions d'un site Web, spécifiquement conçues pour fonctionner sur différentes tailles d'écran ou types d'appareils. Cette approche nécessite généralement de détecter l'appareil et la taille de l'écran de l'utilisateur, puis de servir la version la plus appropriée du site en fonction de ces informations. La conception adaptative permet une expérience utilisateur plus personnalisée et optimisée pour chaque type d'appareil, mais elle peut demander plus de temps et d'efforts pour le développement et la maintenance, car plusieurs versions du site doivent être créées et mises à jour séparément.

COMPARAISAON:
La conception réactive est plus simple à mettre en œuvre et à maintenir, car elle nécessite généralement la création d'une seule version du site Web. Cependant, la conception adaptative offre une expérience utilisateur plus personnalisée et optimisée pour chaque type d'appareil, car elle permet de créer des versions distinctes du site pour chaqun. La conception réactive est donc plus adaptée aux sites Web qui doivent être accessibles sur une large gamme d'appareils, tandis que la conception adaptative est plus adaptée aux sites Web qui doivent être optimisés pour un type d'appareil spécifique.

COMMENT NOUS LES IMPLÉMENTONS DANS LE PROJET:
