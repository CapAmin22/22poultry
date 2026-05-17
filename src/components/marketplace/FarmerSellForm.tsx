
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { v4 as uuidv4 } from 'uuid';
import NECCPriceAnchor from './NECCPriceAnchor';

interface FarmerSellFormProps {
  onListingCreated: (newListing: any) => void;
}

const marketplaceCategories = [
  { id: 'birds', name: 'Live Birds' },
  { id: 'eggs', name: 'Eggs' },
  { id: 'feed', name: 'Feed & Nutrition' },
  { id: 'equipment', name: 'Equipment & Supplies' },
  { id: 'medicine', name: 'Medicines & Vaccines' },
  { id: 'services', name: 'Services' }
];

const FarmerSellForm: React.FC<FarmerSellFormProps> = ({ onListingCreated }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productImage, setProductImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    subcategory: '',
    price: '',
    quantity: '',
    location: '',
    description: '',
    condition: '',
    contactNumber: ''
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProductImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to create a listing",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let imageUrl = null;
      
      // Upload image if provided
      if (productImage) {
        // Check if marketplace bucket exists and create if it doesn't
        const { data: buckets } = await supabase.storage.listBuckets();
        
        if (!buckets?.some(b => b.name === 'marketplace')) {
          await supabase.storage.createBucket('marketplace', {
            public: true,
            fileSizeLimit: 5 * 1024 * 1024, // 5MB
          });
        }
        
        // Upload image
        const fileExt = productImage.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('marketplace')
          .upload(fileName, productImage);
          
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage
          .from('marketplace')
          .getPublicUrl(fileName);
          
        imageUrl = data.publicUrl;
      }
      
      // Create listing
      const listingData = {
        title: formData.title,
        price: formData.price,
        quantity: formData.quantity,
        location: formData.location,
        description: formData.description,
        category: formData.category,
        subcategory: formData.subcategory || null,
        condition: formData.condition || null,
        contact_number: formData.contactNumber || null,
        image_url: imageUrl,
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from('marketplace_listings')
        .insert(listingData)
        .select('*')
        .single();
        
      if (error) throw error;
      
      toast({
        title: "Listing created successfully",
        description: "Your product is now available on the marketplace",
      });
      
      // Pass the new listing back to parent component
      if (data) {
        onListingCreated(data);
      }
      
      // Reset form
      setFormData({
        title: '',
        category: '',
        subcategory: '',
        price: '',
        quantity: '',
        location: '',
        description: '',
        condition: '',
        contactNumber: ''
      });
      setProductImage(null);
      setImagePreview(null);
      
    } catch (error: any) {
      console.error('Error creating listing:', error);
      toast({
        title: "Error creating listing",
        description: error.message || "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="title">Product Title *</Label>
        <Input
          id="title"
          name="title"
          placeholder="e.g., Day-Old Broiler Chicks"
          value={formData.title}
          onChange={handleFormChange}
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="category">Category *</Label>
          <Select 
            value={formData.category} 
            onValueChange={(value) => handleSelectChange('category', value)}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {marketplaceCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="subcategory">Subcategory (Optional)</Label>
          <Input
            id="subcategory"
            name="subcategory"
            placeholder="e.g., Broiler, Layer, etc."
            value={formData.subcategory}
            onChange={handleFormChange}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="price">Price *</Label>
          <Input
            id="price"
            name="price"
            placeholder="e.g., ₹35 per chick"
            value={formData.price}
            onChange={handleFormChange}
            required
          />
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            name="quantity"
            placeholder="e.g., 500 chicks"
            value={formData.quantity}
            onChange={handleFormChange}
          />
        </div>
      </div>
      
      {/* NECC Price Anchor — shows when category is birds or eggs and price is entered */}
      {(formData.category === 'birds' || formData.category === 'eggs') && (
        <NECCPriceAnchor
          askingPrice={formData.price ? parseFloat(formData.price) : undefined}
          commodity={formData.category === 'eggs' ? 'egg' : 'broiler'}
          className="mt-2"
        />
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            name="location"
            placeholder="e.g., Nashik, Maharashtra"
            value={formData.location}
            onChange={handleFormChange}
            required
          />
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="condition">Condition (for equipment)</Label>
          <Input
            id="condition"
            name="condition"
            placeholder="e.g., New, Used - Like New"
            value={formData.condition}
            onChange={handleFormChange}
          />
        </div>
      </div>
      
      <div className="space-y-1">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Describe your product in detail"
          value={formData.description}
          onChange={handleFormChange}
          rows={4}
          required
        />
      </div>
      
      <div className="space-y-1">
        <Label htmlFor="contactNumber">Contact Number</Label>
        <Input
          id="contactNumber"
          name="contactNumber"
          placeholder="Your contact number for buyers to reach you"
          value={formData.contactNumber}
          onChange={handleFormChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Product Image</Label>
        <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
          {imagePreview ? (
            <div className="relative w-full">
              <img 
                src={imagePreview} 
                alt="Product preview" 
                className="mx-auto max-h-48 object-contain rounded-md"
              />
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="absolute top-2 right-2"
                onClick={() => {
                  setProductImage(null);
                  setImagePreview(null);
                }}
              >
                Remove
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-2 flex text-sm text-gray-600">
                <label
                  htmlFor="product-image-upload"
                  className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 hover:text-blue-500"
                >
                  <span>Upload an image</span>
                  <input
                    id="product-image-upload"
                    name="product-image-upload"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
            </div>
          )}
        </div>
      </div>
      
      <Button
        type="submit"
        className="w-full bg-[#f5565c]"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Listing...
          </>
        ) : (
          'Create Listing'
        )}
      </Button>
    </form>
  );
};

export default FarmerSellForm;
