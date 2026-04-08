import { MOCK_PROPERTIES } from '../data/mockProperties';
import { CATEGORY_IMAGES } from '../data/categoryImages';

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

const ALL_DATA = [
  ...MOCK_PROPERTIES,
  ...Object.values(CATEGORY_IMAGES).flat()
];

export const getPropertyById = async (id) =>
  ALL_DATA.find(p => p.id === id) ?? null;
