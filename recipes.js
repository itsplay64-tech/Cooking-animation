// Base de recettes du jeu
const recipes = [
    {
        id: 1,
        name: '🍝 Pâtes Simples',
        emoji: '🍝',
        description: 'Une simple mais délicieuse pâte',
        ingredients: ['🍅', '🍝'],
        points: 50,
        difficulty: 'Facile'
    },
    {
        id: 2,
        name: '🍕 Pizza Margherita',
        emoji: '🍕',
        description: 'La reine des pizzas avec tomates et fromage',
        ingredients: ['🧀', '🍅', '🫒'],
        points: 100,
        difficulty: 'Moyen'
    },
    {
        id: 3,
        name: '🥗 Salade Verte',
        emoji: '🥗',
        description: 'Une salade fraîche et saine',
        ingredients: ['🥬', '🥒', '🫒'],
        points: 75,
        difficulty: 'Facile'
    },
    {
        id: 4,
        name: '🍔 Burger Classique',
        emoji: '🍔',
        description: 'Le burger parfait avec tous les toppings',
        ingredients: ['🍞', '🍖', '🧀', '🍅'],
        points: 120,
        difficulty: 'Moyen'
    },
    {
        id: 5,
        name: '🍜 Ramen Asiatique',
        emoji: '🍜',
        description: 'Un délicieux bouillon avec nouilles',
        ingredients: ['🍜', '🥣', '🥚', '🧅'],
        points: 150,
        difficulty: 'Difficile'
    },
    {
        id: 6,
        name: '🥞 Pancakes Sucrés',
        emoji: '🥞',
        description: 'Des pancakes moelleux et savoureux',
        ingredients: ['🥞', '🍓', '🍯'],
        points: 100,
        difficulty: 'Moyen'
    },
    {
        id: 7,
        name: '🍱 Sushi Box',
        emoji: '🍱',
        description: 'Un assortiment de sushis délicieux',
        ingredients: ['🍚', '🐟', '🥒', '🥢'],
        points: 200,
        difficulty: 'Difficile'
    },
    {
        id: 8,
        name: '🥩 Steak Grillé',
        emoji: '🥩',
        description: 'Un steak juteux avec herbes',
        ingredients: ['🥩', '🧈', '🧄'],
        points: 175,
        difficulty: 'Difficile'
    },
    {
        id: 9,
        name: '🌮 Tacos Délicieux',
        emoji: '🌮',
        description: 'Des tacos croustillants savoureux',
        ingredients: ['🌮', '🍖', '🧅', '🌶️'],
        points: 130,
        difficulty: 'Moyen'
    },
    {
        id: 10,
        name: '🍰 Gâteau au Chocolat',
        emoji: '🍰',
        description: 'Un riche et délicieux gâteau au chocolat',
        ingredients: ['🍫', '🥚', '🍯', '🧈'],
        points: 160,
        difficulty: 'Difficile'
    },
    {
        id: 11,
        name: '🌽 Maïs Grillé',
        emoji: '🌽',
        description: 'Du maïs sucré grillé avec beurre',
        ingredients: ['🌽', '🧈', '🧂'],
        points: 60,
        difficulty: 'Facile'
    },
    {
        id: 12,
        name: '🥙 Sandwich Gourmet',
        emoji: '🥙',
        description: 'Un sandwich riche et savoureux',
        ingredients: ['🍞', '🍖', '🥬', '🍅'],
        points: 110,
        difficulty: 'Moyen'
    },
    {
        id: 13,
        name: '🍣 Nigiri Sushi',
        emoji: '🍣',
        description: 'Des nigiri frais et délicieux',
        ingredients: ['🍚', '🐟', '🥢'],
        points: 140,
        difficulty: 'Difficile'
    },
    {
        id: 14,
        name: '🥧 Tarte aux Fruits',
        emoji: '🥧',
        description: 'Une tarte généreuse aux fruits rouges',
        ingredients: ['🍓', '🍒', '🥧'],
        points: 150,
        difficulty: 'Difficile'
    },
    {
        id: 15,
        name: '🍲 Soupe Chaude',
        emoji: '🍲',
        description: 'Une soupe réconfortante et savoureuse',
        ingredients: ['🥕', '🧅', '🥔', '💧'],
        points: 90,
        difficulty: 'Moyen'
    },
    {
        id: 16,
        name: '🍖 Poulet Rôti',
        emoji: '🍖',
        description: 'Un poulet rôti croustillant',
        ingredients: ['🍖', '🧄', '🫒', '🌿'],
        points: 135,
        difficulty: 'Difficile'
    },
    {
        id: 17,
        name: '🥕 Carottes Braisées',
        emoji: '🥕',
        description: 'Des carottes cuites tendrement',
        ingredients: ['🥕', '🧈', '🧄'],
        points: 70,
        difficulty: 'Facile'
    },
    {
        id: 18,
        name: '🍓 Tarte à la Fraise',
        emoji: '🍓',
        description: 'Une délicieuse tarte aux fraises',
        ingredients: ['🍓', '🍞', '🍯'],
        points: 155,
        difficulty: 'Difficile'
    }
];

// Ingrédients disponibles
const availableIngredients = [
    { emoji: '🍅', name: 'Tomate' },
    { emoji: '🍝', name: 'Pâtes' },
    { emoji: '🧀', name: 'Fromage' },
    { emoji: '🫒', name: 'Huile d\'olive' },
    { emoji: '🥬', name: 'Salade' },
    { emoji: '🥒', name: 'Concombre' },
    { emoji: '🍞', name: 'Pain' },
    { emoji: '🍖', name: 'Viande' },
    { emoji: '🥣', name: 'Bouillon' },
    { emoji: '🥚', name: 'Œuf' },
    { emoji: '🧅', name: 'Oignon' },
    { emoji: '🍜', name: 'Nouilles' },
    { emoji: '🥞', name: 'Pancakes' },
    { emoji: '🍓', name: 'Fraise' },
    { emoji: '🍯', name: 'Miel' },
    { emoji: '🍚', name: 'Riz' },
    { emoji: '🐟', name: 'Poisson' },
    { emoji: '🥢', name: 'Baguettes' },
    { emoji: '🥩', name: 'Steak' },
    { emoji: '🧈', name: 'Beurre' },
    { emoji: '🧄', name: 'Ail' },
    { emoji: '🌮', name: 'Tacos' },
    { emoji: '🌶️', name: 'Piment' },
    { emoji: '🍫', name: 'Chocolat' },
    { emoji: '🧂', name: 'Sel' },
    { emoji: '🌽', name: 'Maïs' },
    { emoji: '🥔', name: 'Pomme de terre' },
    { emoji: '💧', name: 'Eau' },
    { emoji: '🍒', name: 'Cerise' },
    { emoji: '🥕', name: 'Carotte' },
    { emoji: '🌿', name: 'Herbes' },
    { emoji: '🥧', name: 'Tarte' }
];

// Fonction pour obtenir une recette par ses ingrédients
function getRecipeByIngredients(ingredients) {
    const sorted = ingredients.slice().sort();
    
    for (let recipe of recipes) {
        const recipeIngredients = recipe.ingredients.slice().sort();
        
        if (sorted.length === recipeIngredients.length &&
            sorted.every((ingredient, index) => ingredient === recipeIngredients[index])) {
            return recipe;
        }
    }
    
    return null;
}

// Fonction pour obtenir les suggestions de recettes basées sur les ingrédients actuels
function getSuggestedRecipes(currentIngredients) {
    const suggestions = [];
    
    for (let recipe of recipes) {
        const matchCount = recipe.ingredients.filter(ing => 
            currentIngredients.includes(ing)
        ).length;
        
        if (matchCount > 0) {
            suggestions.push({
                recipe: recipe,
                matchCount: matchCount,
                totalNeeded: recipe.ingredients.length
            });
        }
    }
    
    // Trier par nombre de correspondances décroissantes
    return suggestions.sort((a, b) => b.matchCount - a.matchCount).slice(0, 5);
}