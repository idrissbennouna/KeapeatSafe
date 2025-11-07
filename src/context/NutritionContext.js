import React, { createContext, useState, useMemo } from 'react';

export const NutritionContext = createContext({
  dailyCalories: 0,
  setDailyCalories: () => {},
});

export const NutritionProvider = ({ children }) => {
  const [dailyCalories, setDailyCalories] = useState(2000);

  const value = useMemo(() => ({ dailyCalories, setDailyCalories }), [dailyCalories]);

  return <NutritionContext.Provider value={value}>{children}</NutritionContext.Provider>;
};