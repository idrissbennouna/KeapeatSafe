import React, { createContext, useState, useCallback } from 'react';
import { calculateCalories } from '../services/calculations/calorieCalculator';
import { calculateMacros } from '../services/calculations/macroCalculator';
import { calculateBMI } from '../services/calculations/bmiCalculator';
import { fetchNutritionData, calculateTotalCalories } from '../services/api/nutritionApi';

export const NutritionContext = createContext();

export const NutritionProvider = ({ children }) => {
  // Valeurs par défaut pour éviter un profil vide
  const [dailyCalories, setDailyCalories] = useState(2000);
  const [macros, setMacros] = useState(calculateMacros(2000));
  const [bmi, setBmi] = useState({ value: 0, interpretation: '' });
  const [meals, setMeals] = useState([]);

  const updateNutritionData = useCallback((weight, height, age, gender, activity) => {
    const calories = calculateCalories(weight, height, age, gender, activity);
    const macrosData = calculateMacros(calories);
    const bmiData = calculateBMI(weight, height);

    setDailyCalories(calories);
    setMacros(macrosData);
    setBmi(bmiData);
  }, []);

  const addMeal = useCallback((meal) => {
    setMeals((prevMeals) => [...prevMeals, meal]);
  }, []);

  const resetDay = useCallback(() => {
    setMeals([]);
  }, []);

  // Récupère la nutrition d'un ingrédient via API Ninjas (par défaut)
  const fetchIngredientNutrition = useCallback(async (name, quantity_g = 100, options = {}) => {
    const queryName = String(name || '').trim();
    if (!queryName) throw new Error('Nom d\'ingrédient manquant');
    const info = await fetchNutritionData(`${queryName} ${quantity_g}g`, {
      provider: options.provider || 'apiNinjas',
      apiKey: options.apiKey,
      appId: options.appId,
      appKey: options.appKey,
    });
    return info;
  }, []);

  // Ajoute un repas à partir d'une liste d'ingrédients et calcule les calories via l'API
  const addMealFromIngredients = useCallback(async (ingredients = [], meta = {}, options = {}) => {
    const totalCalories = await calculateTotalCalories(ingredients, {
      provider: options.provider || 'apiNinjas',
      apiKey: options.apiKey,
      appId: options.appId,
      appKey: options.appKey,
    });
    const meal = { id: Date.now().toString(), ingredients, totalCalories, ...meta };
    setMeals((prevMeals) => [...prevMeals, meal]);
    return meal;
  }, []);

  return (
    <NutritionContext.Provider
      value={{
        dailyCalories,
        macros,
        bmi,
        meals,
        updateNutritionData,
        addMeal,
        addMealFromIngredients,
        fetchIngredientNutrition,
        resetDay,
      }}
    >
      {children}
    </NutritionContext.Provider>
  );
};