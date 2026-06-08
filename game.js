// State du jeu
let gameState = {
    score: 0,
    level: 1,
    dishesCreated: 0,
    combinedIngredients: [],
    preparedDish: null,
    completedDishes: [],
    activeCustomers: []
};

// Éléments du DOM
const ingredientSearch = document.getElementById('ingredientSearch');
const ingredientsList = document.getElementById('ingredientsList');
const potContent = document.getElementById('potContent');
const combinedList = document.getElementById('combinedList');
const cookBtn = document.getElementById('cookBtn');
const resetBtn = document.getElementById('resetBtn');
const recipesToggle = document.getElementById('recipesToggle');
const recipesPanel = document.getElementById('recipesPanel');
const recipesList = document.getElementById('recipesList');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');
const dishesDisplay = document.getElementById('dishes');
const serviceArea = document.getElementById('serviceArea');
const completedDishesArea = document.getElementById('completedDishes');
const preparedDishDiv = document.getElementById('preparedDish');
const dishEmojiSpan = document.getElementById('dishEmoji');
const dishNameSpan = document.getElementById('dishName');

// Modals
const successModal = document.getElementById('successModal');
const errorModal = document.getElementById('errorModal');
const deliveredModal = document.getElementById('deliveredModal');

let currentPreparedDish = null;
let draggedDish = null;

// Initialisation
function initGame() {
    loadGameState();
    renderIngredients('');
    renderRecipes();
    addInitialCustomers();
    updateDisplay();
    setupEventListeners();
}

function setupEventListeners() {
    ingredientSearch.addEventListener('input', (e) => {
        renderIngredients(e.target.value);
    });
    
    cookBtn.addEventListener('click', cookDish);
    resetBtn.addEventListener('click', resetPot);
    recipesToggle.addEventListener('click', toggleRecipes);
    
    // Fermer modals
    document.getElementById('closeModal').addEventListener('click', closeSuccessModal);
    document.getElementById('continueBtn').addEventListener('click', closeSuccessModal);
    document.getElementById('closeErrorModal').addEventListener('click', () => {
        errorModal.style.display = 'none';
    });
    document.getElementById('tryAgainBtn').addEventListener('click', () => {
        errorModal.style.display = 'none';
    });
    document.getElementById('closeDeliveredModal').addEventListener('click', () => {
        deliveredModal.style.display = 'none';
    });
    document.getElementById('continueDeliveredBtn').addEventListener('click', () => {
        deliveredModal.style.display = 'none';
    });
}

// Charger état
function loadGameState() {
    const saved = localStorage.getItem('restaurantGameState');
    if (saved) {
        gameState = JSON.parse(saved);
    }
}

// Sauvegarder état
function saveGameState() {
    localStorage.setItem('restaurantGameState', JSON.stringify(gameState));
}

// Afficher les ingrédients avec recherche
function renderIngredients(searchTerm) {
    ingredientsList.innerHTML = '';
    const filtered = availableIngredients.filter(ing => 
        ing.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    filtered.forEach(ingredient => {
        const div = document.createElement('div');
        div.className = 'ingredient-item';
        div.innerHTML = `
            <span class="ingredient-emoji">${ingredient.emoji}</span>
            <span>${ingredient.name}</span>
        `;
        
        div.addEventListener('click', () => {
            addIngredientToPot(ingredient.emoji);
        });
        
        ingredientsList.appendChild(div);
    });
}

// Ajouter ingrédient à la casserole
function addIngredientToPot(emoji) {
    gameState.combinedIngredients.push(emoji);
    updatePotDisplay();
    updateCookButtonState();
}

// Mettre à jour l'affichage de la casserole
function updatePotDisplay() {
    potContent.innerHTML = '';
    
    if (gameState.combinedIngredients.length === 0) {
        potContent.innerHTML = '<p class="empty-text">Commencez à ajouter des ingrédients</p>';
        return;
    }
    
    gameState.combinedIngredients.forEach((ingredient, index) => {
        const tag = document.createElement('div');
        tag.className = 'ingredient-tag';
        
        const ingredientName = availableIngredients.find(ing => ing.emoji === ingredient)?.name || 'Ingrédient';
        
        tag.innerHTML = `
            ${ingredient}
            <button class="remove-ingredient" data-index="${index}">×</button>
        `;
        
        tag.querySelector('.remove-ingredient').addEventListener('click', () => {
            gameState.combinedIngredients.splice(index, 1);
            updatePotDisplay();
            updateCookButtonState();
        });
        
        potContent.appendChild(tag);
    });
    
    updateCombinedList();
}

function updateCombinedList() {
    if (gameState.combinedIngredients.length === 0) {
        combinedList.innerHTML = '<p class="empty-text">Aucun ingrédient</p>';
        return;
    }
    
    combinedList.innerHTML = gameState.combinedIngredients
        .map(ing => `<span class="recipe-ingredient-tag">${ing}</span>`)
        .join('');
}

function updateCookButtonState() {
    cookBtn.disabled = gameState.combinedIngredients.length === 0;
}

// Cuisiner le plat
function cookDish() {
    const recipe = getRecipeByIngredients(gameState.combinedIngredients);
    
    if (recipe) {
        currentPreparedDish = recipe;
        gameState.preparedDish = recipe;
        gameState.combinedIngredients = [];
        
        // Afficher le plat préparé
        dishEmojiSpan.textContent = recipe.emoji;
        dishNameSpan.textContent = recipe.name;
        preparedDishDiv.style.display = 'block';
        
        // Ajouter aux plats complétés
        gameState.completedDishes.push({
            recipe: recipe,
            timestamp: Date.now()
        });
        
        gameState.dishesCreated += 1;
        
        updatePotDisplay();
        updateCookButtonState();
        renderCompletedDishes();
        updateDisplay();
        
        showSuccessModal(recipe);
    } else {
        showErrorModal();
    }
}

// Réinitialiser la casserole
function resetPot() {
    gameState.combinedIngredients = [];
    updatePotDisplay();
    updateCookButtonState();
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
            <div class="recipe-difficulty" style="color: ${difficultyColor};">
                ${recipe.difficulty} - ${recipe.points} pts
            </div>
        `;
        
        recipesList.appendChild(div);
    });
}

function toggleRecipes() {
    recipesPanel.classList.toggle('active');
}

// Afficher les plats complétés
function renderCompletedDishes() {
    completedDishesArea.innerHTML = '';
    
    if (gameState.completedDishes.length === 0) {
        completedDishesArea.innerHTML = '<p class="empty-text">Aucun plat préparé</p>';
        return;
    }
    
    gameState.completedDishes.forEach((dish, index) => {
        const div = document.createElement('div');
        div.className = 'completed-dish';
        div.draggable = true;
        
        div.innerHTML = `
            <div class="dish-info">
                <span class="dish-emoji-small">${dish.recipe.emoji}</span>
                <div class="dish-details">
                    <div class="dish-title">${dish.recipe.name}</div>
                </div>
            </div>
            <button class="dish-delivery-btn" onclick="deliverDishToCustomer(${index})">Servir</button>
        `;
        
        div.addEventListener('dragstart', (e) => {
            draggedDish = index;
            e.dataTransfer.effectAllowed = 'move';
        });
        
        completedDishesArea.appendChild(div);
    });
}

// Ajouter des clients
function addInitialCustomers() {
    const initialCustomers = generateCustomers(3);
    gameState.activeCustomers = initialCustomers;
    renderCustomers();
    
    // Ajouter des clients toutes les 15 secondes
    setInterval(() => {
        if (gameState.activeCustomers.length < 5) {
            const newCustomer = generateCustomers(1)[0];
            gameState.activeCustomers.push(newCustomer);
            renderCustomers();
        }
    }, 15000);
}

// Afficher les clients
function renderCustomers() {
    serviceArea.innerHTML = '';
    
    if (gameState.activeCustomers.length === 0) {
        serviceArea.innerHTML = '<p class="waiting-text">En attente de clients...</p>';
        return;
    }
    
    gameState.activeCustomers.forEach((customer, index) => {
        const div = document.createElement('div');
        div.className = 'customer';
        
        const dish = customer.requestedDish;
        const pointsText = `+${dish.points} pts`;
        
        div.innerHTML = `
            <div class="customer-name">${customer.name}</div>
            <div class="customer-request">"${customer.message}"</div>
            <div class="customer-dish">
                <span class="customer-dish-emoji">${dish.emoji}</span>
                <span>${dish.name}</span>
            </div>
            <div class="customer-points">${pointsText}</div>
        `;
        
        serviceArea.appendChild(div);
    });
}

// Livrer un plat à un client
function deliverDishToCustomer(dishIndex) {
    if (!gameState.completedDishes[dishIndex]) return;
    
    const dish = gameState.completedDishes[dishIndex];
    
    // Chercher un client qui demande ce plat
    const customerIndex = gameState.activeCustomers.findIndex(
        c => c.requestedDish.id === dish.recipe.id
    );
    
    if (customerIndex !== -1) {
        const customer = gameState.activeCustomers[customerIndex];
        gameState.score += dish.recipe.points;
        
        // Augmenter le niveau
        if (gameState.score % 500 === 0) {
            gameState.level += 1;
        }
        
        showDeliveredModal(customer, dish.recipe);
        
        // Retirer le client et le plat
        gameState.activeCustomers.splice(customerIndex, 1);
        gameState.completedDishes.splice(dishIndex, 1);
        
        renderCustomers();
        renderCompletedDishes();
        updateDisplay();
        saveGameState();
    } else {
        alert('❌ Ce client n\'a pas commandé ce plat!');
    }
}

// Afficher le modal de succès de livraison
function showDeliveredModal(customer, dish) {
    document.getElementById('deliveredMessage').textContent = 
        `${customer.name} a adoré le ${dish.name}! 😋`;
    document.getElementById('deliveredPoints').textContent = 
        `+${dish.points} points!`;
    deliveredModal.style.display = 'block';
}

// Modals de cuisine
function showSuccessModal(recipe) {
    document.getElementById('modalTitle').textContent = `🎉 ${recipe.name}`;
    document.getElementById('modalMessage').textContent = recipe.description;
    
    document.getElementById('recipeDetails').innerHTML = `
        <h3>Ingrédients:</h3>
        <p>${recipe.ingredients.map(ing => {
            const name = availableIngredients.find(i => i.emoji === ing)?.name || 'Ingrédient';
            return `${ing} ${name}`;
        }).join(', ')}</p>
        <p><strong>Difficulté:</strong> ${recipe.difficulty}</p>
    `;
    
    document.getElementById('modalPoints').textContent = `Plat prêt à servir!`;
    successModal.style.display = 'block';
}

function closeSuccessModal() {
    successModal.style.display = 'none';
}

function showErrorModal() {
    const ingList = gameState.combinedIngredients
        .map(ing => {
            const name = availableIngredients.find(i => i.emoji === ing)?.name || 'Ingrédient';
            return `${ing} ${name}`;
        })
        .join(', ');
    
    document.getElementById('errorMessage').textContent = 
        `La combinaison "${ingList}" n'existe pas! Consultez les recettes.`;
    errorModal.style.display = 'block';
}

// Mettre à jour l'affichage
function updateDisplay() {
    scoreDisplay.textContent = gameState.score;
    levelDisplay.textContent = gameState.level;
    dishesDisplay.textContent = gameState.dishesCreated;
}

// Initialiser au chargement
window.addEventListener('load', initGame);
setInterval(saveGameState, 10000);