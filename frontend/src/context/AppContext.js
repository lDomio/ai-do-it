import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [activeOrders, setActiveOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [isOffline, setIsOffline] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const updateSearchQuery = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const updateUser = useCallback((newUser) => {
    setUser(newUser);
  }, []);

  const setActive = useCallback((orders) => {
    setActiveOrders(orders);
  }, []);

  const setCompleted = useCallback((orders) => {
    setCompletedOrders(orders);
  }, []);

  const addOrder = useCallback((newOrder) => {
    setActiveOrders((prev) => {
      if (prev.some((o) => o.id === newOrder.id)) return prev;
      return [newOrder, ...prev];
    });
  }, []);

  const updateOrder = useCallback((updatedOrder) => {
    setActiveOrders((prev) => prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)));
    setCompletedOrders((prev) => {
      const exists = prev.some((o) => o.id === updatedOrder.id);
      if (exists) {
        return prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o));
      }
      return updatedOrder.status === 'CANCELADO' || updatedOrder.status === 'COMPLETADO'
        ? [...prev, updatedOrder]
        : prev;
    });
  }, []);

  const setOffline = useCallback((offline) => {
    setIsOffline(offline);
  }, []);

  const value = useMemo(
    () => ({
      user,
      updateUser,
      activeOrders,
      setActive,
      completedOrders,
      setCompleted,
      addOrder,
      updateOrder,
      isOffline,
      setOffline,
      searchQuery,
      updateSearchQuery,
    }),
    [
      user,
      activeOrders,
      completedOrders,
      isOffline,
      updateUser,
      setActive,
      setCompleted,
      addOrder,
      updateOrder,
      setOffline,
      searchQuery,
      updateSearchQuery,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === null) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
