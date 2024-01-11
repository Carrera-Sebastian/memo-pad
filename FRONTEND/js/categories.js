
function loadCategories(){
    fetch('http://127.0.0.1:3000/categorie')
        .then(response => response.json())
        .then(categories => {
            addToCategoriesList(categories, 'categ');
            addToCategoriesList(categories, 'categFilter');
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