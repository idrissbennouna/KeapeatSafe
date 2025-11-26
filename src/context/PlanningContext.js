import React, { createContext, useState, useCallback, useEffect, useContext } from 'react';
import { saveMealPlanToDB, getMealPlanFromDB, generateWeeklyPlan, clearMealPlanFromDB } from '../services/api/mealPlanningAPI';
import { NutritionContext } from './NutritionContext';

export const PlanningContext = createContext();

const initialMealPlan = {
  lundi: [],
  mardi: [],
  mercredi: [],
  jeudi: [],
  vendredi: [],
  samedi: [],
  dimanche: [],
};

export const PlanningProvider = ({ children }) => {
  const [mealPlan, setMealPlan] = useState(initialMealPlan);
  const [selectedDay, setSelectedDay] = useState('lundi');
  const { dailyCalories } = useContext(NutritionContext) || { dailyCalories: 2000 };

  const addMealToDay = useCallback((day, meal) => {
    setMealPlan((prevPlan) => {
      const next = { ...prevPlan, [day]: [...prevPlan[day], meal] };
      // Persistance
      saveMealPlanToDB(next).catch(() => {});
      return next;
    });
  }, []);

  const removeMealFromDay = useCallback((day, mealId) => {
    setMealPlan((prevPlan) => {
      const next = { ...prevPlan, [day]: prevPlan[day].filter((meal) => meal.id !== mealId) };
      saveMealPlanToDB(next).catch(() => {});
      return next;
    });
  }, []);

  const resetPlanning = useCallback(async () => {
    await clearMealPlanFromDB().catch(() => {});
    const plan = generateWeeklyPlan({ dailyCalories: Number(dailyCalories) || 2000 });
    setMealPlan(plan);
    await saveMealPlanToDB(plan).catch(() => {});
  }, [dailyCalories]);

  // Charge le planning sauvegardé ou génère un plan hebdo basique
  const loadMealPlan = useCallback(async () => {
    const saved = await getMealPlanFromDB();
    if (saved && typeof saved === 'object') {
      setMealPlan(saved);
      return saved;
    }
    const plan = generateWeeklyPlan({ dailyCalories: Number(dailyCalories) || 2000 });
    setMealPlan(plan);
    await saveMealPlanToDB(plan).catch(() => {});
    return plan;
  }, [dailyCalories]);

  useEffect(() => {
    loadMealPlan().catch(() => {});
  }, [loadMealPlan]);

  return (
    <PlanningContext.Provider
      value={{
        mealPlan,
        selectedDay,
        setSelectedDay,
        addMealToDay,
        removeMealFromDay,
        resetPlanning,
        loadMealPlan,
      }}
    >
      {children}
    </PlanningContext.Provider>
  );
};