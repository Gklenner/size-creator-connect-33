import { useEffect } from 'react';
import { useProductStore } from '../store/productStore';
import { useProductActions } from '../store/productActions';

export const useProducts = () => {
  const productState = useProductStore();
  const productActions = useProductActions();

  useEffect(() => {
    productActions.loadProducts();
  }, []);

  return {
    ...productState,
    ...productActions,
  };
};