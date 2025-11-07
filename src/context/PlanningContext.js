import React, { createContext, useState, useMemo } from 'react';

export const PlanningContext = createContext({
  plans: [],
  addPlan: () => {},
});

export const PlanningProvider = ({ children }) => {
  const [plans, setPlans] = useState([]);

  const addPlan = (plan) => setPlans((prev) => [...prev, plan]);

  const value = useMemo(() => ({ plans, addPlan }), [plans]);

  return <PlanningContext.Provider value={value}>{children}</PlanningContext.Provider>;
};