import { useState } from 'react';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import { kvStore } from '../../../services/kvStore';
import { Order, Product } from '../../../types';

export function AdminReports() {
    const [isExporting, setIsExporting] = useState(false);

    const exportData = async (type: 'orders' | 'products', format: 'csv' | 'json') => {
        setIsExporting(true);
        try {
            let data: any[] = [];
            let prefix = '';
            let filename = '';

            if (type === 'orders') {
                const records = await kvStore.listByPrefix<Order>('order:');
                data = records.map(r => r.value);
                prefix = 'orders';
            } else {
                const records = await kvStore.listByPrefix<Product>('product:');
                data = records.map(r => r.value);
                prefix = 'products';
            }

            filename = `${prefix}_report_${new Date().toISOString().split('T')[0]}`;

            if (format === 'json') {
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                downloadFile(blob, `${filename}.json`);
            } else {
                // Flatten JSON to CSV
                const csv = convertToCSV(data);
                const blob = new Blob([csv], { type: 'text/csv' });
                downloadFile(blob, `${filename}.csv`);
            }

        } catch (error) {
            console.error('Export failed:', error);
            alert('Export failed. Please try again.');
        } finally {
            setIsExporting(false);
        }
    };

    const convertToCSV = (objArray: any[]) => {
        const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
        if (array.length === 0) return '';

        // Collect all unique keys
        const keys = Array.from(new Set(array.flatMap(Object.keys)));

        let str = keys.join(',') + '\r\n';

        for (let i = 0; i < array.length; i++) {
            let line = '';
            for (const key of keys) {
                if (line !== '') line += ',';
                let value = array[i][key];

                // Handle objects/arrays in CSV
                if (typeof value === 'object') {
                    value = JSON.stringify(value).replace(/"/g, '""'); // Escape quotes
                    value = `"${value}"`;
                } else if (typeof value === 'string') {
                    value = `"${value.replace(/"/g, '""')}"`;
                }

                line += value !== undefined ? value : '';
            }
            str += line + '\r\n';
        }
        return str;
    };

    const downloadFile = (blob: Blob, filename: string) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-6">Reports & Exports</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Orders Report */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-500/20 rounded-xl">
                            <FileSpreadsheet className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Orders Report</h3>
                            <p className="text-slate-400 text-sm">Export all order history and details</p>
                        </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                        <button
                            onClick={() => exportData('orders', 'csv')}
                            disabled={isExporting}
                            className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <Download className="w-4 h-4" /> CSV
                        </button>
                        <button
                            onClick={() => exportData('orders', 'json')}
                            disabled={isExporting}
                            className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <Download className="w-4 h-4" /> JSON
                        </button>
                    </div>
                </div>

                {/* Products Report */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-purple-500/20 rounded-xl">
                            <FileText className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Products Inventory</h3>
                            <p className="text-slate-400 text-sm">Export full product catalog list</p>
                        </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                        <button
                            onClick={() => exportData('products', 'csv')}
                            disabled={isExporting}
                            className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <Download className="w-4 h-4" /> CSV
                        </button>
                        <button
                            onClick={() => exportData('products', 'json')}
                            disabled={isExporting}
                            className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <Download className="w-4 h-4" /> JSON
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
