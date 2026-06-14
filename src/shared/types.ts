export interface BaseUserProfile {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: 'buyer' | 'seller' | 'admin';
  avatarUrl: string;
  isVerified: boolean;
  isBanned?: boolean;
  businessName?: string;
  taxId?: string;
  deliveryAddress?: string;
  watchlist?: string[];
}

export interface SellerProfile extends BaseUserProfile {
  role: 'seller';
  businessName: string;
  taxId: string;
}

export interface BuyerProfile extends BaseUserProfile {
  role: 'buyer';
  deliveryAddress: string;
  watchlist: string[];
}

export interface VehicleListing {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  image: string;
  location: string;
  status: 'pending_approval' | 'approved' | 'rejected' | 'sold';
  isInspected: boolean;
  inspectorReport?: string;
  inspectorRating?: number;
  inspectorPhotos?: string[];
  sellerId: string;
  sellerName: string;
}

export interface InspectionRequest {
  id: string;
  vehicleId: string;
  vehicleName: string;
  vehicleImage: string;
  buyerId: string;
  buyerName: string;
  location: string;
  status: 'pending_assignment' | 'assigned' | 'completed';
  assignedInspectorId?: string;
  assignedInspectorName?: string;
  reportDetails?: string;
  rating?: number;
  photos?: string[];
  scheduledDate?: string;
}

export interface DeliveryOrder {
  id: string;
  vehicleId: string;
  vehicleName: string;
  vehicleImage: string;
  buyerId: string;
  buyerName: string;
  deliveryMethod: 'pickup' | 'transport';
  deliveryAddress: string;
  shippingQuote: number;
  status: 'pending' | 'dispatched' | 'in_transit' | 'delivered';
  trackingDetails?: string;
}
