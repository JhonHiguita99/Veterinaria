const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // Importamos uuid para generar identificadores únicos

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Base de datos en memoria
let pets = [];

// Ruta para registrar una mascota
app.post('/api/pets', (req, res) => {
    const { ownerName, petName, petBreed, petBirthdate } = req.body;

    if (!ownerName || !petName || !petBreed || !petBirthdate) {
        return res.status(400).json({ error: 'Faltan datos' });
    }

    const pet = {
        id: uuidv4(),  // Asignamos un identificador único
        ownerName,
        petName,
        petBreed,
        petBirthdate
    };
    pets.push(pet);
    res.status(201).json(pet);
});

// Ruta para obtener todas las mascotas
app.get('/api/pets', (req, res) => {
    res.set('Cache-Control', 'no-store');
    res.json(pets);
});

// Ruta para eliminar una mascota por ID
app.delete('/api/pets/:id', (req, res) => {
    const { id } = req.params;  // Obtenemos el id de los parámetros de la URL

    // Buscamos el índice de la mascota con el id proporcionado
    const petIndex = pets.findIndex(pet => pet.id === id);

    if (petIndex === -1) {
        return res.status(404).json({ error: 'Mascota no encontrada' });
    }

    // Eliminamos la mascota
    const deletedPet = pets.splice(petIndex, 1); // Elimina la mascota del array
    res.status(200).json(deletedPet[0]);
});

// Ruta principal que servirá el archivo index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
