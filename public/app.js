document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('add-owner-pet-form');
    form.addEventListener('submit', handleSubmit);

    // Función para manejar el submit del formulario
    async function handleSubmit(event) {
        event.preventDefault();

        const ownerName = document.getElementById('owner-name').value;
        const petName = document.getElementById('pet-name').value;
        const petBreed = document.getElementById('pet-breed').value;
        const petBirthdate = document.getElementById('pet-birthdate').value;

        const petData = {
            ownerName,
            petName,
            petBreed,
            petBirthdate
        };

        // Enviar los datos al microservicio
        const response = await fetch('http://localhost:3000/api/pets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(petData)
        });

        const result = await response.json();
        if (response.ok) {
            alert('Mascota registrada exitosamente');
            loadPets();  // Cargar nuevamente las mascotas
        } else {
            alert('Error al registrar la mascota');
        }
    }

    // Función para cargar las mascotas registradas
    async function loadPets() {
        const response = await fetch('http://localhost:3000/api/pets');
        const pets = await response.json();

        const petsTable = document.getElementById('pets-table');
        petsTable.innerHTML = ''; // Limpiar la lista antes de renderizar

        if (pets.length === 0) {
            petsTable.innerHTML = "<p>No hay mascotas registradas.</p>";
        }

        pets.forEach(pet => {
            const petElement = document.createElement('div');
            petElement.classList.add('pet-item');
            petElement.innerHTML = `
                <strong>Dueño:</strong> ${pet.ownerName}<br>
                <strong>Mascota:</strong> ${pet.petName}<br>
                <strong>Raza:</strong> ${pet.petBreed}<br>
                <strong>Fecha de nacimiento:</strong> ${pet.petBirthdate}<br>
                <button onclick="deletePet('${pet.id}')">Eliminar</button>
            `;
            petsTable.appendChild(petElement);
        });
    }

    // Función para eliminar una mascota
    async function deletePet(id) {
        const response = await fetch(`http://localhost:3000/api/pets/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('Mascota eliminada');
            loadPets();  // Recargar la lista después de eliminar la mascota
        } else {
            alert('Error al eliminar la mascota');
        }
    }

    loadPets();  // Cargar las mascotas al cargar la página
});
