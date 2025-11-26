// Meal Planning API utilities
// But: générer un planning hebdomadaire, sauvegarder en base locale,
// modifier/supprimer un repas planifié.

import AsyncStorage from '@react-native-async-storage/async-storage';

const DAYS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
const TYPES = ['petit-dej', 'dejeuner', 'diner'];
const STORAGE_KEY = 'MEAL_PLAN';

/**
 * Génère un plan hebdomadaire basique en se basant sur des objectifs.
 * userGoals: { dailyCalories?: number }
 */
export const generateWeeklyPlan = (userGoals = {}) => {
  const daily = Number(userGoals.dailyCalories || 2000);
  const distribution = {
    'petit-dej': 0.25,
    'dejeuner': 0.35,
    'diner': 0.40,
  };

  const plan = {};
  DAYS.forEach((day, idx) => {
    // petite variation quotidienne (±5%) pour éviter des jours identiques
    const variance = 1 + ((idx % 3) - 1) * 0.05; // -5%, 0, +5%
    plan[day] = TYPES.map(type => {
      const base = Math.round(daily * distribution[type]);
      const calories = Math.max(200, Math.round(base * variance));
      return {
        id: `${day}-${type}`,
        type,
        title: `${type} du ${day}`,
        calories,
        ingredients: [
          { name: 'yaourt', quantity_g: 125 },
          { name: 'banane', quantity_g: 100 },
        ],
      };
    });
  });
  return plan;
};

/** Sauvegarde le planning en base locale */
export const saveMealPlanToDB = async (plan) => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
  return true;
};

/** Récupère le planning en base locale */
export const getMealPlanFromDB = async () => {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  const plan = raw ? JSON.parse(raw) : null;
  // Si le plan est vide (aucun repas), force une régénération
  if (plan && typeof plan === 'object') {
    const allDays = DAYS.every(d => Array.isArray(plan[d]));
    const allEmpty = DAYS.every(d => Array.isArray(plan[d]) && plan[d].length === 0);
    if (allDays && allEmpty) return null;
  }
  return plan;
};

/** Met à jour un repas dans le plan sauvegardé */
export const updateMealInPlan = async (day, mealType, newMeal) => {
  const plan = (await getMealPlanFromDB()) || {};
  const dayMeals = Array.isArray(plan[day]) ? plan[day] : [];
  const idx = dayMeals.findIndex(m => m.type === mealType);
  if (idx >= 0) {
    dayMeals[idx] = { ...dayMeals[idx], ...newMeal };
  } else {
    dayMeals.push({ type: mealType, ...newMeal });
  }
  plan[day] = dayMeals;
  await saveMealPlanToDB(plan);
  return plan;
};

/** Supprime un repas planifié */
export const removeMealFromPlan = async (day, mealType) => {
  const plan = (await getMealPlanFromDB()) || {};
  const dayMeals = Array.isArray(plan[day]) ? plan[day] : [];
  plan[day] = dayMeals.filter(m => m.type !== mealType);
  await saveMealPlanToDB(plan);
  return plan;
};

/** Efface complètement le planning sauvegardé */
export const clearMealPlanFromDB = async () => {
  await AsyncStorage.removeItem(STORAGE_KEY);
  return true;
};

export default {
  generateWeeklyPlan,
  saveMealPlanToDB,
  getMealPlanFromDB,
  updateMealInPlan,
  removeMealFromPlan,
  clearMealPlanFromDB,
};