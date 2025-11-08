import React, { createContext, useState, useCallback } from 'react';

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

  const addMealToDay = useCallback((day, meal) => {
    setMealPlan((prevPlan) => ({
      ...prevPlan,
      [day]: [...prevPlan[day], meal],
    }));
  }, []);

  const removeMealFromDay = useCallback((day, mealId) => {
    setMealPlan((prevPlan) => ({
      ...prevPlan,
      [day]: prevPlan[day].filter((meal) => meal.id !== mealId),
    }));
  }, []);

  const resetPlanning = useCallback(() => {
    setMealPlan(initialMealPlan);
  }, []);

  return (
    <PlanningContext.Provider
      value={{
        mealPlan,
        selectedDay,
        setSelectedDay,
        addMealToDay,
        removeMealFromDay,
        resetPlanning,
      }}
    >
      {children}
    </PlanningContext.Provider>
  );
};