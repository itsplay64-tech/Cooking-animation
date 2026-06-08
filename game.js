// State du jeu
let gameState = {
    score: 0,
    level: 1,
    dishesCreated: 0,
    combinedIngredients: [],
    lastRecipeName: ''
};

// Éléments du DOM
const ingredientsGrid = document.getElementById('ingredientsGrid');
const potContent = document.getElementById('potContent');
const combinedList = document.getElementById('combinedList');
const cookBtn = document.getElementById('cookBtn');
const resetBtn = document.getElementById('resetBtn');
const recipesList = document.getElementById('recipesList');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');
const dishesDisplay = document.getElementById('dishes');
const successModal = document.getElementById('successModal');
const errorModal = document.getElementById('errorModal');

// Variables de drag and drop
let draggedElement = null;

// Initialisation du jeu
function initGame() {
    loadGameState();
    renderIngredients();
    renderRecipes();
    updateDisplay();
}

// Charger l'état du jeu depuis localStorage
function loadGameState() {
    const saved = localStorage.getItem('cookingGameState');
    if (saved) {
        gameState = JSON.parse(saved);
    }
}

// Sauvegarder l'état du jeu
function saveGameState() {
    localStorage.setItem('cookingGameState', JSON.stringify(gameState));
}

// Afficher les ingrédients
function renderIngredients() {
    ingredientsGrid.innerHTML = '';
    
    availableIngredients.forEach(ingredient => {
        const div = document.createElement('div');
        div.className = 'ingredient-item';
        div.draggable = true;
        div.innerHTML = `
            <span class="ingredient-emoji">${ingredient.emoji}</span>
            <span>${ingredient.name}</span>
        `;
        
        div.addEventListener('dragstart', dragStart);
        div.addEventListener('dragend', dragEnd);
        
        ingredientsGrid.appendChild(div);
    });
}

// Afficher les recettes
function renderRecipes() {
    recipesList.innerHTML = '';
    
    recipes.forEach(recipe => {
        const div = document.createElement('div');
        div.className = 'recipe-item';
        
        const ingredientSpans = recipe.ingredients
            .map(ing => `<span class="recipe-ingredient-tag">${ing}</span>`)
            .join('');
        
        const difficultyColor = recipe.difficulty === 'Facile' ? '#4caf50' : 
                               recipe.difficulty === 'Moyen' ? '#ff9500' : '#f44336';
        
        div.innerHTML = `
            <div class="recipe-name">${recipe.emoji} ${recipe.name}</div>
            <div class="recipe-ingredients">
                ${ingredientSpans}
            </div>
            <div style="font-size: 0.8em; color: ${difficultyColor}; margin-top: 5px; font-weight: bold;">
                ${recipe.difficulty} - ${recipe.points} pts
            </div>
        `;
        
        recipesList.appendChild(div);
    });
}

// Drag and Drop
function dragStart(e) {
    draggedElement = e.target.closest('.ingredient-item');
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('text/plain', draggedElement.textContent);
    draggedElement.style.opacity = '0.5';
}

function dragEnd(e) {
    if (draggedElement) {
        draggedElement.style.opacity = '1';
    }
}

potContent.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    potContent.classList.add('drag-over');
});

potContent.addEventListener('dragleave', () => {
    potContent.classList.remove('drag-over');
});

potContent.addEventListener('drop', (e) => {
    e.preventDefault();
    potContent.classList.remove('drag-over');
    
    if (draggedElement) {
        const ingredientEmoji = draggedElement.querySelector('.ingredient-emoji').textContent;
        addIngredientToPot(ingredientEmoji);
    }
});

// Ajouter un ingrédient à la casserole
function addIngredientToPot(emoji) {
    gameState.combinedIngredients.push(emoji);
    updatePotDisplay();
    updateCookButtonState();
}

// Mettre à jour l'affichage de la casserole
function updatePotDisplay() {
    potContent.innerHTML = '';
    
    if (gameState.combinedIngredients.length === 0) {
        potContent.innerHTML = '<p class="empty-text">Glissez les ingrédients ici</p>';
        return;
    }
    
    gameState.combinedIngredients.forEach((ingredient, index) => {
        const tag = document.createElement('div');
        tag.className = 'ingredient-tag';
        
        const ingredientName = availableIngredients.find(ing => ing.emoji === ingredient)?.name || 'Ingrédient';
        
        tag.innerHTML = `
            ${ingredient} ${ingredientName}
            <button class="remove-ingredient" data-index="${index}">×</button>
        `;
        
        tag.querySelector('.remove-ingredient').addEventListener('click', () => {
            removeIngredient(index);
        });
        
        potContent.appendChild(tag);
    });
    
    // Mettre à jour la liste des ingrédients combinés
    updateCombinedList();
}

// Mettre à jour la liste affichée
function updateCombinedList() {
    if (gameState.combinedIngredients.length === 0) {
        combinedList.innerHTML = '<p class="empty-text">Aucun ingrédient</p>';
        return;
    }
    
    combinedList.innerHTML = gameState.combinedIngredients
        .map(ing => `<span class="recipe-ingredient-tag">${ing}</span>`)
        .join('');
}

// Retirer un ingrédient
function removeIngredient(index) {
    gameState.combinedIngredients.splice(index, 1);
    updatePotDisplay();
    updateCookButtonState();
}

// Mettre à jour l'état du bouton cuire
function updateCookButtonState() {
    cookBtn.disabled = gameState.combinedIngredients.length === 0;
}

// Cuisiner le plat
cookBtn.addEventListener('click', () => {
    cookDish();
});

function cookDish() {
    const recipe = getRecipeByIngredients(gameState.combinedIngredients);
    
    if (recipe) {
        // Succès !
        showSuccessModal(recipe);
        gameState.score += recipe.points;
        gameState.dishesCreated += 1;
        gameState.lastRecipeName = recipe.name;
        
        // Augmenter le niveau tous les 3 plats
        if (gameState.dishesCreated % 3 === 0) {
            gameState.level += 1;
        }
        
        saveGameState();
        updateDisplay();
    } else {
        // Pas une recette valide
        showErrorModal();
    }
}

// Réinitialiser
resetBtn.addEventListener('click', () => {
    gameState.combinedIngredients = [];
    updatePotDisplay();
    updateCookButtonState();
});

// Afficher le modal de succès
function showSuccessModal(recipe) {
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    const recipeDetails = document.getElementById('recipeDetails');
    const modalPoints = document.getElementById('modalPoints');
    
    modalTitle.textContent = `🎉 ${recipe.name}`;
    modalMessage.textContent = recipe.description;
    
    recipeDetails.innerHTML = `
        <h3>Ingrédients utilisés:</h3>
        <p>${recipe.ingredients.map(ing => {
            const name = availableIngredients.find(i => i.emoji === ing)?.name || 'Ingrédient';
            return `${ing} ${name}`;
        }).join(', ')}</p>
        <p><strong>Difficulté:</strong> ${recipe.difficulty}</p>
    `;
    
    modalPoints.textContent = `+${recipe.points} points!`;
    
    successModal.style.display = 'block';
    successModal.querySelector('.modal-content').classList.add('success-animation');
}

// Afficher le modal d'erreur
function showErrorModal() {
    const errorMessage = document.getElementById('errorMessage');
    const ingList = gameState.combinedIngredients
        .map(ing => {
            const name = availableIngredients.find(i => i.emoji === ing)?.name || 'Ingrédient';
            return `${ing} ${name}`;
        })
        .join(', ');
    
    errorMessage.textContent = `La combinaison "${ingList}" n'existe pas dans notre recettaire. Essayez une autre combinaison!`;
    
    errorModal.style.display = 'block';
}

// Fermer les modals
document.getElementById('closeModal').addEventListener('click', () => {
    successModal.style.display = 'none';
    successModal.querySelector('.modal-content').classList.remove('success-animation');
    gameState.combinedIngredients = [];
    updatePotDisplay();
    updateCookButtonState();
});

document.getElementById('continueBtn').addEventListener('click', () => {
    successModal.style.display = 'none';
    successModal.querySelector('.modal-content').classList.remove('success-animation');
    gameState.combinedIngredients = [];
    updatePotDisplay();
    updateCookButtonState();
});

document.getElementById('closeErrorModal').addEventListener('click', () => {
    errorModal.style.display = 'none';
});

document.getElementById('tryAgainBtn').addEventListener('click', () => {
    errorModal.style.display = 'none';
});

// Fermer les modals en cliquant en dehors
window.addEventListener('click', (e) => {
    if (e.target === successModal) {
        successModal.style.display = 'none';
        successModal.querySelector('.modal-content').classList.remove('success-animation');
        gameState.combinedIngredients = [];
        updatePotDisplay();
        updateCookButtonState();
    }
    if (e.target === errorModal) {
        errorModal.style.display = 'none';
    }
});

// Mettre à jour l'affichage
function updateDisplay() {
    scoreDisplay.textContent = gameState.score;
    levelDisplay.textContent = gameState.level;
    dishesDisplay.textContent = gameState.dishesCreated;
}

// Ajouter des raccourcis clavier
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !cookBtn.disabled) {
        cookDish();
    }
    if (e.key === 'Escape') {
        resetBtn.click();
    }
});

// Initialiser le jeu au chargement
window.addEventListener('load', initGame);

// Sauvegarder périodiquement
setInterval(saveGameState, 10000);