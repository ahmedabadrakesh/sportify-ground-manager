
import { Product } from "@/types/models";
import { products } from "@/data/mockData";

// Get all products
export const getAllProducts = (): Product[] => {
  return [...products];
};

// Get product by ID
export const getProductById = (productId: string): Product | undefined => {
  return products.find(product => product.id === productId);
};

// Add new product
export const addProduct = (productData: Omit<Product, 'id' | 'images'>): Product => {
  const newProduct: Product = {
    id: `product-${Date.now()}`,
    name: productData.name,
    description: productData.description,
    price: productData.price,
    category: productData.category,
    stock: productData.stock,
    featured: productData.featured,
    images: ["/placeholder.svg"], // Default image
  };
  
  products.push(newProduct);
  return newProduct;
};

// Update product
export const updateProduct = (
  productId: string, 
  productData: Partial<Omit<Product, 'id' | 'images'>>
): Product | null => {
  const productIndex = products.findIndex(product => product.id === productId);
  
  if (productIndex === -1) return null;
  
  products[productIndex] = {
    ...products[productIndex],
    ...productData,
  };
  
  return products[productIndex];
};

// Delete product
export const deleteProduct = (productId: string): boolean => {
  const initialLength = products.length;
  const productIndex = products.findIndex(product => product.id === productId);
  
  if (productIndex === -1) return false;
  
  products.splice(productIndex, 1);
  return products.length < initialLength;
};

// Get featured products
export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.featured);
};

// Get products by category
export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};

// Search products
export const searchProducts = (query: string): Product[] => {
  const searchTerm = query.toLowerCase();
  
  return products.filter(product => 
    product.name.toLowerCase().includes(searchTerm) || 
    product.description.toLowerCase().includes(searchTerm) || 
    product.category.toLowerCase().includes(searchTerm)
  );
};
