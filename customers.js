// Messages aléatoires des clients
const customerMessages = [
    'Salut un {dish} s\'il vous plaît!',
    'Bonjour je voudrais un {dish}',
    'Excusez-moi, un {dish} pour moi',
    'Vous auriez un {dish}?',
    'Je prendrais un {dish} s\'il te plaît',
    'Un {dish} rapidement!',
    'Je viens pour un {dish}',
    'Donnez-moi un {dish} s\'il vous plaît',
    'Un {dish} pour emporter',
    'Je reviens toujours pour votre {dish}!'
];

// Noms des clients
const customerNames = [
    'Marco',
    'Giulia',
    'Sophie',
    'Pierre',
    'Emma',
    'Luc',
    'Marie',
    'Tom',
    'Alice',
    'Jean',
    'Claire',
    'Patrick',
    'Lily',
    'Antoine',
    'Manon',
    'Philippe',
    'Isabelle',
    'François',
    'Charlotte',
    'Vincent'
];

// Fonction pour générer des clients
function generateCustomers(count) {
    const customers = [];
    
    for (let i = 0; i < count; i++) {
        // Sélectionner une recette aléatoire basée sur la difficulté
        const randomRecipe = getRandomRecipeByDifficulty(gameState.level);
        
        // Sélectionner un message et un nom aléatoires
        const message = customerMessages[Math.floor(Math.random() * customerMessages.length)]
            .replace('{dish}', randomRecipe.name.replace(/.*\s/, '').toLowerCase());
        
        const name = customerNames[Math.floor(Math.random() * customerNames.length)];
        
        customers.push({
            id: Date.now() + i,
            name: name,
            message: message,
            requestedDish: randomRecipe,
            timestamp: Date.now()
        });
    }
    
    return customers;
}

// Obtenir une recette aléatoire basée sur la difficulté
function getRandomRecipeByDifficulty(level) {
    let availableRecipes;
    
    if (level === 1) {
        // Niveau 1: 60% Facile, 40% Moyen
        availableRecipes = recipes.filter(r => 
            r.difficulty === 'Facile' || 
            (r.difficulty === 'Moyen' && Math.random() < 0.4)
        );
    } else if (level <= 3) {
        // Niveau 2-3: 30% Facile, 50% Moyen, 20% Difficile
        availableRecipes = recipes.filter(r => {
            if (r.difficulty === 'Facile') return Math.random() < 0.3;
            if (r.difficulty === 'Moyen') return Math.random() < 0.5;
            if (r.difficulty === 'Difficile') return Math.random() < 0.2;
            return false;
        });
    } else {
        // Niveau 4+: 10% Facile, 40% Moyen, 50% Difficile
        availableRecipes = recipes.filter(r => {
            if (r.difficulty === 'Facile') return Math.random() < 0.1;
            if (r.difficulty === 'Moyen') return Math.random() < 0.4;
            if (r.difficulty === 'Difficile') return Math.random() < 0.5;
            return false;
        });
    }
    
    if (availableRecipes.length === 0) {
        availableRecipes = recipes;
    }
    
    return availableRecipes[Math.floor(Math.random() * availableRecipes.length)];
}