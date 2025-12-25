import { useState, useEffect } from 'react';
import { OrderList } from './OrderList';
import { orderService, Order } from '../../../services/orderService';

export function AdminOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const ordersData = await orderService.getAllOrders();
            setOrders(ordersData);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div>
            <OrderList
                orders={orders}
                onRefresh={fetchData}
            />
        </div>
    );
}
