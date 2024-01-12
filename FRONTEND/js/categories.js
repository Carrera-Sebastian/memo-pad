let categories = [];

function loadCategories(){
    fetch('http://127.0.0.1:3000/categorie')
        .then(response => response.json())
        .then(categories => {
            addToCategoriesList(categories, 'categ');
            addToCategoriesList(categories, 'categFilter');
            displayCategoriesWithDeleteButton(categories);
        })
        .catch(error => console.error('Error: ', error));
}

function addToCategoriesList(categories, selectedId) {
    const select = document.getElementById(selectedId);
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        select.appendChild(option);
    });
}

document.getElementById('filterCategoryButton').addEventListener('click', () => {
    const selectedCategory = document.getElementById('categFilter').value;
    filterByCategory(selectedCategory);
});

function filterByCategory(selectedCategoryId) {
    console.log("Filtrando por categoría:", selectedCategoryId); // Para verificar la categoría seleccionada
    const allNotes = document.querySelectorAll('.note'); // Es asi la clase?

    allNotes.forEach(note => {
        const noteCategoryId = note.getAttribute('data-category-id');
        console.log("Nota:", note, "Categoría de la nota:", noteCategoryId); // Para ver la categoría de cada nota


        if (selectedCategoryId === 'all' || noteCategoryId === selectedCategoryId) {
            note.style.display = ''; 
        } else {
            note.style.display = 'none'; 
        }
    });
}

document.getElementById('addCategoryButton').addEventListener('click', () => {
    const categoryName = document.getElementById('newCategoryName').value.trim();
    if (categoryName.trim() === ''){
        alert("A category name cannot be empty");
        return;
    }
    if (categoryName) {
        // Aquí agregas la categoría a tu almacenamiento de categorías
        addCategory(categoryName);
        updateCategorySelects();
        document.getElementById('newCategoryName').value = ''; // Limpiar campo
        alert('New category added');
    }
});

function addCategory(categoryName) {

    fetch('http://127.0.0.1:3000/categorie', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: categoryName })
    })
    .then(response => response.json())
    .then(data => {
        categories.push({ id: data.id, name: categoryName });
        updateCategorySelects();
    })
    .catch(error => console.error('Error:', error));
}

function updateCategorySelects() {
    // Actualiza los select de categorías en toda la aplicación
    const categorySelects = document.querySelectorAll('.category-select');
    categorySelects.forEach(select => {
        updateSelectOptions(select);
    });
}

function updateSelectOptions(select) {
    // Limpia las opciones actuales
    select.innerHTML = '';
    // Agrega las nuevas opciones
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        select.appendChild(option);
    });
}

function deleteCategory(categoryId) {
    fetch(`http://127.0.0.1:3000/categorie/${categoryId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        categories = categories.filter(category => category.id !== categoryId);
        updateCategorySelects();
    })
    .catch(error => console.error('Error:', error));
}

function displayCategoriesWithDeleteButton(categories) {
    const categoriesList = document.getElementById('categoriesList');
    categoriesList.innerHTML = ''; // Clean existing list

    categories.forEach(category => {
        const listItem = document.createElement('li');
        listItem.textContent = category.name;

        const deleteCategoryButton = document.createElement('button');
        deleteCategoryButton.className = 'btn btn-outline-danger';
        deleteCategoryButton.textContent = 'Delete';
        deleteCategoryButton.onclick = function() { 
            deleteCategory(category.id); 
            alert('Category deleted');
        };
        listItem.appendChild(deleteCategoryButton);

        categoriesList.appendChild(listItem);
    });
}