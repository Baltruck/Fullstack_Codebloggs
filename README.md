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

### 
![Logo](./mern/client/public/CodeBloggs.png)
TYPE | NOM | DESCRIPTIF
--- | --- | --- |
POST | /login | Fetch