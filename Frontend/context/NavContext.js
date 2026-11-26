import { createContext, useContext } from 'react';

// go('inventory') / go('orders') ... switches the bottom tab
export const NavContext = createContext({ tab: 'home', go: () => {}, openCart: () => {} });
export const useNav = () => useContext(NavContext);
