import { useState, useEffect } from 'react';
import { Save, Globe, Mail, MessageSquare, CreditCard, Power } from 'lucide-react';
import { kvStore } from '../../../services/kvStore';

interface GeneralSettings {
    websiteName: string;
    logoUrl: string;
    supportEmail: string;
    headerLinks: { label: string; url: string }[];
    smtp: {
        host: string;
        port: string;
        user: string;
        pass: string;
        secure: boolean;
    };
    sms: {
        provider: string; // e.g. Twilio, AfricasTalking
        apiKey: string;
        senderId: string;
    };
    payment: {
        pesaPalEnabled: boolean;
        pesaPalMerchantId: string;
        offlineEnabled: boolean;
        offlineInstruction: string;
    };
}

const defaultSettings: GeneralSettings = {
    websiteName: 'Music Studio Builder',
    logoUrl: '',
    supportEmail: '',
    headerLinks: [],
    smtp: { host: '', port: '587', user: '', pass: '', secure: true },
    sms: { provider: '', apiKey: '', senderId: '' },
    payment: { pesaPalEnabled: true, pesaPalMerchantId: '', offlineEnabled: true, offlineInstruction: '' }
};

export function AdminSettings() {
    const [settings, setSettings] = useState<GeneralSettings>(defaultSettings);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        setIsLoading(true);
        try {
            const result = await kvStore.get<GeneralSettings>('settings:general');
            if (result) {
                setSettings({ ...defaultSettings, ...result });
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await kvStore.set('settings:general', settings);
            alert('Settings saved successfully!');
        } catch (error) {
            console.error('Failed to save settings:', error);
            alert('Failed to save settings.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = (section: keyof GeneralSettings, field: string, value: any) => {
        setSettings(prev => {
            if (section === 'websiteName' || section === 'logoUrl' || section === 'supportEmail') {
                return { ...prev, [section]: value };
            }
            return {
                ...prev,
                [section]: {
                    ...(prev[section] as object),
                    [field]: value
                }
            };
        });
    };

    if (isLoading) return <div className="text-white p-6">Loading settings...</div>;

    return (
        <form onSubmit={handleSave} className="space-y-8 max-w-4xl pb-10">
            <h2 className="text-3xl font-bold text-white mb-6">General Settings</h2>

            {/* General Info */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-blue-500/20 rounded-xl">
                        <Globe className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Website Information</h3>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        <label className="block text-slate-400 mb-2">Website Name</label>
                        <input
                            type="text"
                            value={settings.websiteName}
                            onChange={(e) => handleChange('websiteName', '', e.target.value)}
                            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-400 mb-2">Logo URL</label>
                        <input
                            type="text"
                            value={settings.logoUrl}
                            onChange={(e) => handleChange('logoUrl', '', e.target.value)}
                            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                            placeholder="https://..."
                        />
                    </div>
                    <div>
                        <label className="block text-slate-400 mb-2">Support Email</label>
                        <input
                            type="email"
                            value={settings.supportEmail}
                            onChange={(e) => handleChange('supportEmail', '', e.target.value)}
                            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                        />
                    </div>
                </div>
            </div>

            {/* SMTP Configuration */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-green-500/20 rounded-xl">
                        <Mail className="w-6 h-6 text-green-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">SMTP Email Configuration</h3>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        <label className="block text-slate-400 mb-2">Host</label>
                        <input
                            type="text"
                            value={settings.smtp.host}
                            onChange={(e) => handleChange('smtp', 'host', e.target.value)}
                            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-400 mb-2">Port</label>
                        <input
                            type="text"
                            value={settings.smtp.port}
                            onChange={(e) => handleChange('smtp', 'port', e.target.value)}
                            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-400 mb-2">User</label>
                        <input
                            type="text"
                            value={settings.smtp.user}
                            onChange={(e) => handleChange('smtp', 'user', e.target.value)}
                            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-400 mb-2">Password</label>
                        <input
                            type="password"
                            value={settings.smtp.pass}
                            onChange={(e) => handleChange('smtp', 'pass', e.target.value)}
                            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                        />
                    </div>
                </div>
            </div>

            {/* SMS Configuration */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-yellow-500/20 rounded-xl">
                        <MessageSquare className="w-6 h-6 text-yellow-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">SMS Configuration</h3>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        <label className="block text-slate-400 mb-2">Provider</label>
                        <select
                            value={settings.sms.provider}
                            onChange={(e) => handleChange('sms', 'provider', e.target.value)}
                            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                        >
                            <option value="">Select Provider</option>
                            <option value="twilio">Twilio</option>
                            <option value="africastalking">AfricasTalking</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-slate-400 mb-2">API Key</label>
                        <input
                            type="password"
                            value={settings.sms.apiKey}
                            onChange={(e) => handleChange('sms', 'apiKey', e.target.value)}
                            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-400 mb-2">Sender ID</label>
                        <input
                            type="text"
                            value={settings.sms.senderId}
                            onChange={(e) => handleChange('sms', 'senderId', e.target.value)}
                            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                        />
                    </div>
                </div>
            </div>

            {/* Payment Configuration */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-pink-500/20 rounded-xl">
                        <CreditCard className="w-6 h-6 text-pink-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Payment Methods</h3>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-slate-800 rounded-xl">
                        <div>
                            <h4 className="font-semibold text-white">PesaPal</h4>
                            <p className="text-sm text-slate-400">Enable PesaPal payment gateway (Default)</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.payment.pesaPalEnabled}
                                onChange={(e) => handleChange('payment', 'pesaPalEnabled', e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-800 rounded-xl">
                        <div>
                            <h4 className="font-semibold text-white">Offline Payment</h4>
                            <p className="text-sm text-slate-400">Allow customers to pay offline (Cash, Bank Transfer)</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.payment.offlineEnabled}
                                onChange={(e) => handleChange('payment', 'offlineEnabled', e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                        </label>
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={isSaving}
                className="fixed bottom-6 right-6 flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full shadow-lg hover:shadow-cyan-500/25 transition-all text-white font-bold text-lg z-50 hover:scale-105"
            >
                <Save className="w-6 h-6" />
                {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
        </form>
    );
}
