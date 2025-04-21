
import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Tags, ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { Product } from "@/types/models";
import { addProduct, updateProduct, deleteProduct, getAllProducts } from "@/utils/ecommerce";

const EcommerceManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productStock, setProductStock] = useState("");
  const [productImages, setProductImages] = useState<string[]>([]);
  const [productFeatured, setProductFeatured] = useState(false);
  
  useEffect(() => {
    loadProducts();
  }, []);
  
  const loadProducts = async () => {
    setLoading(true);
    try {
      const fetchedProducts = await getAllProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Error loading products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddProduct = async () => {
    try {
      const newProduct = await addProduct({
        name: productName,
        description: productDescription,
        price: parseFloat(productPrice),
        category: productCategory,
        stock: parseInt(productStock),
        featured: productFeatured,
      });
      
      if (newProduct) {
        setProducts([...products, newProduct]);
        resetForm();
        setIsAddDialogOpen(false);
        toast.success("Product added successfully");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product");
    }
  };
  
  const handleEditProduct = async () => {
    if (!selectedProduct) return;
    
    try {
      const updatedProduct = await updateProduct(
        selectedProduct.id,
        {
          name: productName,
          description: productDescription,
          price: parseFloat(productPrice),
          category: productCategory,
          stock: parseInt(productStock),
          featured: productFeatured,
        }
      );
      
      if (updatedProduct) {
        setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
        resetForm();
        setIsEditDialogOpen(false);
        setSelectedProduct(null);
        toast.success("Product updated successfully");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    }
  };
  
  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;
    
    try {
      const success = await deleteProduct(selectedProduct.id);
      if (success) {
        setProducts(products.filter(p => p.id !== selectedProduct.id));
        setIsDeleteDialogOpen(false);
        setSelectedProduct(null);
        toast.success("Product deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };
  
  const openEditDialog = (product: Product) => {
    setSelectedProduct(product);
    setProductName(product.name);
    setProductDescription(product.description || "");
    setProductPrice(product.price.toString());
    setProductCategory(product.category);
    setProductStock(product.stock.toString());
    setProductImages(product.images || []);
    setProductFeatured(product.featured || false);
    setIsEditDialogOpen(true);
  };
  
  const openDeleteDialog = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };
  
  const resetForm = () => {
    setProductName("");
    setProductDescription("");
    setProductPrice("");
    setProductCategory("");
    setProductStock("");
    setProductImages([]);
    setProductFeatured(false);
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">E-commerce Manager</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>
      
      {/* Product Listing */}
      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Products</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="in-stock">In Stock</TabsTrigger>
          <TabsTrigger value="low-stock">Low Stock</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      Loading products...
                    </TableCell>
                  </TableRow>
                ) : products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                      No products found
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded bg-gray-100 mr-3 flex-shrink-0">
                            {product.images && product.images.length > 0 ? (
                              <img 
                                src={product.images[0]} 
                                alt={product.name} 
                                className="h-10 w-10 rounded object-cover"
                              />
                            ) : <div className="h-10 w-10 rounded bg-gray-200"></div>}
                          </div>
                          <span>{product.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>₹{product.price}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>
                        {product.stock > 10 ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            In Stock
                          </span>
                        ) : product.stock > 0 ? (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                            Low Stock
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                            Out of Stock
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => openEditDialog(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-600"
                            onClick={() => openDeleteDialog(product)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        {/* Other tabs content - similar structure to the "all" tab */}
        <TabsContent value="featured">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <Table>
              {/* Similar table structure, filtered for featured products */}
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      Loading products...
                    </TableCell>
                  </TableRow>
                ) : (
                  products
                    .filter(p => p.featured)
                    .map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded bg-gray-100 mr-3 flex-shrink-0">
                              {product.images && product.images.length > 0 ? (
                                <img 
                                  src={product.images[0]} 
                                  alt={product.name} 
                                  className="h-10 w-10 rounded object-cover"
                                />
                              ) : <div className="h-10 w-10 rounded bg-gray-200"></div>}
                            </div>
                            <span>{product.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>₹{product.price}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>
                          {product.stock > 10 ? (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                              In Stock
                            </span>
                          ) : product.stock > 0 ? (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                              Low Stock
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                              Out of Stock
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => openEditDialog(product)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-red-600"
                              onClick={() => openDeleteDialog(product)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        {/* Add Product Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Fill in the details to add a new product to your inventory.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="product-name">Product Name</Label>
                <Input
                  id="product-name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="product-description">Description</Label>
                <Textarea
                  id="product-description"
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="product-price">Price (₹)</Label>
                  <Input
                    id="product-price"
                    type="number"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="product-stock">Stock</Label>
                  <Input
                    id="product-stock"
                    type="number"
                    value={productStock}
                    onChange={(e) => setProductStock(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="product-category">Category</Label>
                <Input
                  id="product-category"
                  value={productCategory}
                  onChange={(e) => setProductCategory(e.target.value)}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddProduct}>Add Product</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Edit Product Dialog - Similar to Add Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>
                Update the details of your product.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-product-name">Product Name</Label>
                <Input
                  id="edit-product-name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-product-description">Description</Label>
                <Textarea
                  id="edit-product-description"
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-product-price">Price (₹)</Label>
                  <Input
                    id="edit-product-price"
                    type="number"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-product-stock">Stock</Label>
                  <Input
                    id="edit-product-stock"
                    type="number"
                    value={productStock}
                    onChange={(e) => setProductStock(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="edit-product-category">Category</Label>
                <Input
                  id="edit-product-category"
                  value={productCategory}
                  onChange={(e) => setProductCategory(e.target.value)}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditProduct}>Save Changes</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Product</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this product? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            
            {selectedProduct && (
              <div className="py-4">
                <p className="font-medium text-gray-900">{selectedProduct.name}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Category: {selectedProduct.category} | Price: ₹{selectedProduct.price}
                </p>
              </div>
            )}
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteProduct}>
                Delete Product
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </Tabs>
    </AdminLayout>
  );
};

export default EcommerceManager;
