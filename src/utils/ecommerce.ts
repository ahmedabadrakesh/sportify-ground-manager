
import { Product } from "@/types/models";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Get all products from inventory_items
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .is('deleted_at', null);
    
    if (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
    
    return data.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description || '',
      price: item.price,
      category: item.category,
      stock: item.quantity || 0,
      featured: false, // inventory_items doesn't have featured field
      images: item.image ? [item.image] : ["/placeholder.svg"]
    }));
  } catch (error) {
    console.error("Error in getAllProducts:", error);
    toast.error("Failed to load products");
    return [];
  }
};

// Get product by ID from inventory_items
export const getProductById = async (productId: string): Promise<Product | undefined> => {
  try {
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .eq('id', productId)
      .is('deleted_at', null)
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
      stock: data.quantity || 0,
      featured: false,
      images: data.image ? [data.image] : ["/placeholder.svg"]
    };
  } catch (error) {
    console.error("Error in getProductById:", error);
    toast.error("Failed to load product details");
    return undefined;
  }
};

// Add new product to inventory_items
export const addProduct = async (productData: Omit<Product, 'id' | 'images'>): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('inventory_items')
      .insert({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        category: productData.category,
        quantity: productData.stock,
        purchase_price: productData.price * 0.7, // Assume 30% markup
        purchase_quantity: productData.stock,
        image: "/placeholder.svg" // Default image
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
      stock: data.quantity || 0,
      featured: false,
      images: data.image ? [data.image] : ["/placeholder.svg"]
    };
  } catch (error) {
    console.error("Error in addProduct:", error);
    toast.error("Failed to add product");
    return null;
  }
};

// Update product in inventory_items
export const updateProduct = async (
  productId: string, 
  productData: Partial<Omit<Product, 'id' | 'images'>>
): Promise<Product | null> => {
  try {
    const updateData: any = {};
    if (productData.name) updateData.name = productData.name;
    if (productData.description) updateData.description = productData.description;
    if (productData.price) updateData.price = productData.price;
    if (productData.category) updateData.category = productData.category;
    if (productData.stock !== undefined) updateData.quantity = productData.stock;
    
    const { data, error } = await supabase
      .from('inventory_items')
      .update(updateData)
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
      stock: data.quantity || 0,
      featured: false,
      images: data.image ? [data.image] : ["/placeholder.svg"]
    };
  } catch (error) {
    console.error("Error in updateProduct:", error);
    toast.error("Failed to update product");
    return null;
  }
};

// Delete product (soft delete in inventory_items)
export const deleteProduct = async (productId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('inventory_items')
      .update({ deleted_at: new Date().toISOString() })
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

// Get featured products (return first 6 products since inventory_items doesn't have featured field)
export const getFeaturedProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .is('deleted_at', null)
      .limit(6);
    
    if (error) {
      console.error("Error fetching featured products:", error);
      throw error;
    }
    
    return data.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description || '',
      price: item.price,
      category: item.category,
      stock: item.quantity || 0,
      featured: true, // Mark as featured since this is the featured list
      images: item.image ? [item.image] : ["/placeholder.svg"]
    }));
  } catch (error) {
    console.error("Error in getFeaturedProducts:", error);
    toast.error("Failed to load featured products");
    return [];
  }
};

// Get products by category from inventory_items
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .eq('category', category)
      .is('deleted_at', null);
    
    if (error) {
      console.error("Error fetching products by category:", error);
      throw error;
    }
    
    return data.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description || '',
      price: item.price,
      category: item.category,
      stock: item.quantity || 0,
      featured: false,
      images: item.image ? [item.image] : ["/placeholder.svg"]
    }));
  } catch (error) {
    console.error("Error in getProductsByCategory:", error);
    toast.error("Failed to load products by category");
    return [];
  }
};

// Search products in inventory_items
export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    const searchTerm = query.toLowerCase();
    
    // Load all inventory items and filter
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .is('deleted_at', null);
    
    if (error) {
      console.error("Error fetching products for search:", error);
      throw error;
    }
    
    return data
      .filter(item => 
        item.name.toLowerCase().includes(searchTerm) || 
        (item.description && item.description.toLowerCase().includes(searchTerm)) || 
        item.category.toLowerCase().includes(searchTerm)
      )
      .map(item => ({
        id: item.id,
        name: item.name,
        description: item.description || '',
        price: item.price,
        category: item.category,
        stock: item.quantity || 0,
        featured: false,
        images: item.image ? [item.image] : ["/placeholder.svg"]
      }));
  } catch (error) {
    console.error("Error in searchProducts:", error);
    toast.error("Failed to search products");
    return [];
  }
};
