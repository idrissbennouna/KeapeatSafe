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
  const perMeal = Math.round(daily / 3);

  const plan = {};
  for (const day of DAYS) {
    plan[day] = TYPES.map(type => ({
      id: `${day}-${type}`,
      type,
      title: `${type} équilibré`,
      calories: perMeal,
      ingredients: [],
    }));
  }
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
  return raw ? JSON.parse(raw) : null;
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

export default {
  generateWeeklyPlan,
  saveMealPlanToDB,
  getMealPlanFromDB,
  updateMealInPlan,
  removeMealFromPlan,
};