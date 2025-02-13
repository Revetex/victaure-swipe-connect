
export type PaymentTypes = {
  Tables: {
    marketplace_services: {
      Row: {
        id: string;
        title: string;
        description: string | null;
        provider_id: string;
        status: 'active' | 'closed' | 'pending' | 'cancelled';
        price: number | null;
        currency: string;
        created_at: string;
        updated_at: string;
        category_id: string | null;
        images: string[] | null;
        type: 'fixed' | 'auction';
        auction_end_date: string | null;
        current_price: number | null;
      };
      Insert: Omit<PaymentTypes['Tables']['marketplace_services']['Row'], 'id' | 'created_at' | 'updated_at'>;
    };
    service_bids: {
      Row: {
        id: string;
        service_id: string;
        bidder_id: string;
        amount: number;
        status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
        created_at: string;
      };
      Insert: Omit<PaymentTypes['Tables']['service_bids']['Row'], 'id' | 'created_at'>;
    };
    marketplace_items: {
      Row: {
        id: string;
        title: string;
        description: string | null;
        seller_id: string;
        price: number;
        status: 'active' | 'sold' | 'cancelled';
        created_at: string;
        updated_at: string;
        category_id: string | null;
        images: string[] | null;
        condition: string | null;
        location: any | null;
        views_count: number | null;
        favorites_count: number | null;
        metadata: any | null;
      };
      Insert: Omit<PaymentTypes['Tables']['marketplace_items']['Row'], 'id' | 'created_at' | 'updated_at' | 'views_count' | 'favorites_count'>;
    };
  };
};
