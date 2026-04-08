import { MOCK_PROPERTIES } from '../data/mockProperties';

export const getFeaturedProperties = async () =>
  MOCK_PROPERTIES.filter(p => p.featured);

export const getAllProperties = async (filters = {}) => {
  let results = [...MOCK_PROPERTIES];
  if (filters.location && filters.location !== "") {
    results = results.filter(p => p.location === filters.location);
  }
  if (filters.type && filters.type !== "") {
    results = results.filter(p => p.type === filters.type);
  }
  if (filters.priceMax && filters.priceMax !== "") {
    results = results.filter(p => p.price <= Number(filters.priceMax));
  }
  return results;
};

export const getPropertyById = async (id) =>
  MOCK_PROPERTIES.find(p => p.id === id) ?? null;
