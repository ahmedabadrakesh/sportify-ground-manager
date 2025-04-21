
import { Product } from "@/types/models";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Get all products
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*');
    
    if (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
    
    return data.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description || '',
      price: product.price,
      category: product.category,
      stock: product.stock,
      featured: product.featured || false,
      images: product.images || ["/placeholder.svg"]
    }));
  } catch (error) {
    console.error("Error in getAllProducts:", error);
    toast.error("Failed to load products");
    return [];
  }
};

// Get product by ID
export const getProductById = async (productId: string): Promise<Product | undefined> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();
    
    if (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
    
    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      price: data.price,
      category: data.category,
      stock: data.stock,
      featured: data.featured || false,
      images: data.images || ["/placeholder.svg"]
    };
  } catch (error) {
    console.error("Error in getProductById:", error);
    toast.error("Failed to load product details");
    return undefined;
  }
};

// Add new product
export const addProduct = async (productData: Omit<Product, 'id' | 'images'>): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        category: productData.category,
        stock: productData.stock,
        featured: productData.featured,
        images: ["/placeholder.svg"] // Default image
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error adding product:", error);
      throw error;
    }
    
    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      price: data.price,
      category: data.category,
      stock: data.stock,
      featured: data.featured || false,
      images: data.images || ["/placeholder.svg"]
    };
  } catch (error) {
    console.error("Error in addProduct:", error);
    toast.error("Failed to add product");
    return null;
  }
};

// Update product
export const updateProduct = async (
  productId: string, 
  productData: Partial<Omit<Product, 'id' | 'images'>>
): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', productId)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating product:", error);
      throw error;
    }
    
    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      price: data.price,
      category: data.category,
      stock: data.stock,
      featured: data.featured || false,
      images: data.images || ["/placeholder.svg"]
    };
  } catch (error) {
    console.error("Error in updateProduct:", error);
    toast.error("Failed to update product");
    return null;
  }
};

// Delete product
export const deleteProduct = async (productId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);
    
    if (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Error in deleteProduct:", error);
    toast.error("Failed to delete product");
    return false;
  }
};

// Get featured products
export const getFeaturedProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('featured', true);
    
    if (error) {
      console.error("Error fetching featured products:", error);
      throw error;
    }
    
    return data.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description || '',
      price: product.price,
      category: product.category,
      stock: product.stock,
      featured: product.featured || false,
      images: product.images || ["/placeholder.svg"]
    }));
  } catch (error) {
    console.error("Error in getFeaturedProducts:", error);
    toast.error("Failed to load featured products");
    return [];
  }
};

// Get products by category
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category);
    
    if (error) {
      console.error("Error fetching products by category:", error);
      throw error;
    }
    
    return data.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description || '',
      price: product.price,
      category: product.category,
      stock: product.stock,
      featured: product.featured || false,
      images: product.images || ["/placeholder.svg"]
    }));
  } catch (error) {
    console.error("Error in getProductsByCategory:", error);
    toast.error("Failed to load products by category");
    return [];
  }
};

// Search products
export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    const searchTerm = query.toLowerCase();
    
    // Ideally this would use a fulltext search, but for simplicity we'll load all and filter
    const { data, error } = await supabase
      .from('products')
      .select('*');
    
    if (error) {
      console.error("Error fetching products for search:", error);
      throw error;
    }
    
    return data
      .filter(product => 
        product.name.toLowerCase().includes(searchTerm) || 
        (product.description && product.description.toLowerCase().includes(searchTerm)) || 
        product.category.toLowerCase().includes(searchTerm)
      )
      .map(product => ({
        id: product.id,
        name: product.name,
        description: product.description || '',
        price: product.price,
        category: product.category,
        stock: product.stock,
        featured: product.featured || false,
        images: product.images || ["/placeholder.svg"]
      }));
  } catch (error) {
    console.error("Error in searchProducts:", error);
    toast.error("Failed to search products");
    return [];
  }
};
