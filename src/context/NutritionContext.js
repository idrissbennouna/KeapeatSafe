import React, { createContext, useState, useCallback } from 'react';
import { calculateCalories } from '../services/calculations/calorieCalculator';
import { calculateMacros } from '../services/calculations/macroCalculator';
import { calculateBMI } from '../services/calculations/bmiCalculator';

export const NutritionContext = createContext();

export const NutritionProvider = ({ children }) => {
  const [dailyCalories, setDailyCalories] = useState(0);
  const [macros, setMacros] = useState({ protein: 0, carbs: 0, fat: 0 });
  const [bmi, setBmi] = useState({ value: 0, interpretation: '' });
  const [meals, setMeals] = useState([]);

  const updateNutritionData = useCallback((weight, height, age, gender, activity) => {
    const calories = calculateCalories(gender, weight, height, age, activity);
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

  return (
    <NutritionContext.Provider
      value={{
        dailyCalories,
        macros,
        bmi,
        meals,
        updateNutritionData,
        addMeal,
        resetDay,
      }}
    >
      {children}
    </NutritionContext.Provider>
  );
};