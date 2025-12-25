import { kvStore } from './kvStore';
import { Product, LibraryPack } from '../app/components/StudioBuilder';
import { StorageType } from '../app/components/StorageSelector';

export interface OrderItem {
    type: 'product' | 'library-pack';
    id: string;
    name: string;
    price: number; // Assuming 0 for now as pricing logic is complex
}

export interface Order {
    id: string;
    customer: {
        name: string;
        location: string;
        email: string;
    };
    items: {
        products: Product[];
        libraryPacks: LibraryPack[];
    };
    storage: {
        type: StorageType;
        capacity: number;
    };
    totalStorage: number;
    totalAmount: number; // Add price field
    status: 'pending_payment' | 'paid' | 'processing' | 'completed' | 'cancelled';
    paymentMethod?: 'pesapal' | 'other';
    pesapalTrackingId?: string; // Pesapal order tracking ID
    createdAt: string;
}

export const orderService = {
    async createOrder(order: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<Order> {
        const id = crypto.randomUUID();
        const newOrder: Order = {
            ...order,
            id,
            status: 'pending_payment',
            createdAt: new Date().toISOString(),
        };

        await kvStore.set(`order:${id}`, newOrder);
        return newOrder;
    },

    async getOrder(id: string): Promise<Order | null> {
        return kvStore.get<Order>(`order:${id}`);
    },

    async updateOrderStatus(
        id: string,
        status: Order['status'],
        paymentMethod?: Order['paymentMethod'],
        pesapalTrackingId?: string
    ): Promise<void> {
        const order = await this.getOrder(id);
        if (!order) throw new Error('Order not found');

        const updatedOrder = {
            ...order,
            status,
            paymentMethod: paymentMethod || order.paymentMethod,
            pesapalTrackingId: pesapalTrackingId || order.pesapalTrackingId,
        };
        await kvStore.set(`order:${id}`, updatedOrder);
    },

    async getAllOrders(): Promise<Order[]> {
        const records = await kvStore.listByPrefix<Order>('order:');
        return records.map(r => r.value).sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
};
