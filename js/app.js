function startApp(){
    console.log("App started");

    const result = document.querySelector('#resultado');
    const seletCategories = document.querySelector('#categorias');

    const favorites = document.querySelector('#favorites');


    showFavorites();

    if(seletCategories){
        seletCategories.addEventListener('change', selectCategory);
        getCategories();
    }
    
    function getCategories(){
        const url = 'https://www.themealdb.com/api/json/v1/1/categories.php';
        fetch(url)
            .then(response => response.json())
            .then(result => 
                showCategories(result.categories)
            );
    }

    function showCategories( categories = []){
        categories.forEach( category => {
            const { strCategory } = category;
            const option = document.createElement('OPTION');
            option.value = strCategory;
            option.textContent = strCategory;
            seletCategories.appendChild(option);
        });
    }

    function selectCategory(e){
        const category = e.target.value;
        const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
        fetch(url)
            .then(response => response.json())
            .then(result => showRecipes(result.meals));
    }

    function showRecipes( recipes = []){

        clearHtml(result)

        

        recipes.forEach( recipes => {
            const { idMeal, strMeal, strMealThumb } = recipes;

            const recipeContainer = document.createElement('DIV');
            recipeContainer.classList.add('col-md-4');

            const recipeCard = document.createElement('DIV');
            recipeCard.classList.add('card', 'mb-4', 'text-center', 'border-2', 'border-sky-500', 'shadow-lg', 'rounded-lg', 'bg-white');

            recipeCard.innerHTML = `
                <img src="${strMealThumb}" alt="${strMeal}" class="card-img-top">
                <div class="card-body">
                    <h2 class="card-title
                    ">${strMeal}</h2>
                </div>
            `;

            // button recipe
            const button = document.createElement('BUTTON');
            button.classList.add('btn', 'btn-primary', 'btn-block');
            button.classList.add('w-100', 'border-b-4' ,'border-indigo-500' , 'hover:bg-sky-700', 'font-bold', 'uppercase', 'rounded-lg', 'p-2', 'mt-2');
            button.textContent = 'View Recipe';
            button.onclick = () => {
                console.log(idMeal);
                selectRecipe(idMeal);
            }

            const buttonFavorite = document.createElement('BUTTON');
            buttonFavorite.classList.add('btn', 'btn-primary', 'btn-block');
            buttonFavorite.classList.add('w-100', 'border-b-4' ,'border-indigo-500' , 'hover:bg-sky-700', 'font-bold', 'uppercase', 'rounded-lg', 'p-2', 'mt-2');
            buttonFavorite.textContent = '❤️';
            buttonFavorite.onclick = () => {
                addFavorite(
                    {
                        id: idMeal,
                        title: strMeal,
                        image: strMealThumb
                    }
                );
            }

            recipeCard.appendChild(buttonFavorite);
            recipeCard.appendChild(button);



            result.appendChild(recipeCard);
        }
        )
    }

    function selectRecipe(id){
        const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
        fetch(url)
            .then(response => response.json())
            .then(result => showRecipe(result.meals[0]));
    }

    function showRecipe(recipe){

        // show recipe in modal create by javeScript
        console.log("mostrado la receta");
        
    }

    function addFavorite(recipe){
        console.log("add favorite");
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        console.log(favorites);
        localStorage.setItem('favorites', JSON.stringify([...favorites, recipe]));
        showFavorites();
    }

    function showFavorites(){
    
        const favoritos= JSON.parse(localStorage.getItem('favorites')) || [];

        clearHtml(favoritos);

        favoritos.forEach( recipe => {
            const { id, title, image } = recipe;

            const favoriteCard = document.createElement('DIV');
            favoriteCard.classList.add('col-md-4');

            favoriteCard.innerHTML = `
                <div class="card">
                    <img src="${image}" alt="${title}" class="card-img-top">
                    <div class="card-body">
                        <h2 class="card-title
                        ">${title}</h2>
                    </div>
                </div>
            `;
            favorites.appendChild(favoriteCard);

            
            const button = document.createElement('BUTTON');
            button.classList.add('btn', 'btn-danger', 'btn-block');
            button.textContent = 'Delete';
            button.onclick = () => {
                deleteFavorite(id);
            }
            favoriteCard.appendChild(button);


        });   
    }

    function deleteFavorite(id){
        const favorites = JSON.parse(localStorage.getItem('favorites'));
        const newFavorites = favorites.filter( recipe => recipe.id !== id);
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
        showFavorites();
    }

    



    function clearHtml(element){
        while(element.firstChild){
            element.removeChild(element.firstChild);
        }
    }



}

document.addEventListener('DOMContentLoaded', startApp);