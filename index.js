const express = require('express')
const { initializeApp, cert} = require('firebase-admin/app');
const { getFirestore} = require('firebase-admin/firestore');

const app = express();
app.use(express.json());

const serviceAccount = require('./credentials.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

app.get('/',(req,res)=>{
    res.send('Conexion correcta')
})

app.post("/api/products", async(req,res) => {  // Crear productos
    try {
        await db.collection('products')
        .doc(req.body.id)
        .create({name:req.body.name});
        return res.status(204).json();
    } catch (error) {
        console.log(error)
        return res.status(500).send(error);
    }
})

app.get("/api/products/:id", async(req,res)=>{
    try {
        const doc = db.collection('products').doc(req.params.id);
        const item = await doc.get();
        const response = item.data();
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).send(error);
    }
})

app.get("/api/products", async(req,res)=>{
    try {
        const prod = db.collection("products");
        const querySnapshot = await prod.get();
        const docs = querySnapshot.docs;

        const response = docs.map((doc)=>({
        id:doc.id,
        name: doc.data().name,
    }));

    return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json()
    }
})

app.delete("/api/products/:id", async(req,res)=>{
    try {
        const doc = db.collection("products").doc(req.params.id);
        await doc.delete();
        return res.status(200).json();
    } catch (error) {
        return res.status(500).json();
    }
})

app.put('/api/products/:id', async(req,res)=>{
    try {
        const doc = db.collection('products').doc(req.params.id);
        await doc.update({
            name: req.body.name
        });
        return res.status(200).json()
    } catch (error) {
        return res.status(500).json()
    }
})


// ----------------------- USUARIOS --------------------------

app.post("/api/users", async(req,res) => { // Crear usuario
    try {
        await db.collection('users')
        .doc(req.body.id)
        .create({name:req.body.name, password:req.body.password});
        return res.status(204).json();
    } catch (error) {
        console.log(error)
        return res.status(500).send(error);
    }
})

app.get("/api/users", async(req,res)=>{  // Consultar lista de usuarios
    try {
        const prod = db.collection("users");
        const querySnapshot = await prod.get();
        const docs = querySnapshot.docs;

        const response = docs.map((doc)=>({
        id:doc.id,
        name: doc.data().name,
        password: doc.data().password
    }));

    return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json()
    }
})

app.get("/api/users/:id", async(req,res)=>{ // Consultar usuario
    try {
        const doc = db.collection('users').doc(req.params.id);
        const item = await doc.get();
        const response = item.data();
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).send(error);
    }
})

app.delete("/api/users/:id", async(req,res)=>{  // Eliminar Usuario
    try {
        const doc = db.collection("users").doc(req.params.id);
        await doc.delete();
        return res.status(200).json();
    } catch (error) {
        return res.status(500).json();
    }
})

app.put('/api/users/:id', async(req,res)=>{ // Actualizar usuario
    try {
        const doc = db.collection('users').doc(req.params.id);
        await doc.update({
            name: req.body.name,
            password: req.body.password
        });
        return res.status(200).json()
    } catch (error) {
        return res.status(500).json()
    }
})

// -------------------- Login ----------------

app.get("/api/login",async(req,res)=>{
    res.statusCode(200);
})


const puerto = process.env.PORT || 3000
app.listen(puerto,()=>{
    console.log(`Servidor ejecutandose ${puerto}`)
})

//exports.app = app;