import { useState, useEffect } from 'react';
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { formatCurrency } from '../../../utils/utils';
import { reportService } from '../../../services/reportService';
import type { ReportFilterParams, SalesChartData } from '../../../features/reports/types/report.types';

interface SalesChartProps {
    data?: SalesChartData[];
    metricType?: 'revenue' | 'volume';
    onMetricChange?: (metric: 'revenue' | 'volume') => void;
}

export function SalesChart({ data: externalData, metricType: externalMetric, onMetricChange }: SalesChartProps) {
    const [periodFilter, setPeriodFilter] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
    const [internalMetric, setInternalMetric] = useState<'revenue' | 'volume'>('revenue');
    const [chartData, setChartData] = useState<SalesChartData[]>([]);
    const [loading, setLoading] = useState(false);

    const metricType = externalMetric ?? internalMetric;
    const setMetricType = (m: 'revenue' | 'volume') => {
        if (onMetricChange) onMetricChange(m);
        else setInternalMetric(m);
    };

    useEffect(() => {
        if (externalData) return;

        const params: ReportFilterParams = { group_by: periodFilter };
        setLoading(true);
        reportService.getSalesSummary(params)
            .then((res) => setChartData(res.chart_data ?? []))
            .catch(() => setChartData([]))
            .finally(() => setLoading(false));
    }, [periodFilter, externalData]);

    const data = externalData ?? chartData;

    return (
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Sales Trends</h3>
                    <p className="text-xs text-slate-500">
                        Revenue and volume trajectory across selected time intervals
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <select
                        value={periodFilter}
                        onChange={(e) => setPeriodFilter(e.target.value as 'daily' | 'weekly' | 'monthly')}
                        className="text-xs font-semibold text-slate-700 bg-slate-100 border-none rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>

                    <select
                        value={metricType}
                        onChange={(e) => setMetricType(e.target.value as 'revenue' | 'volume')}
                        className="text-xs font-semibold text-slate-700 bg-slate-100 border-none rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="revenue">Revenue (IDR)</option>
                        <option value="volume">Units Sold</option>
                    </select>
                </div>
            </div>

            <div className="h-72 w-full pt-2">
                {loading ? (
                    <div className="h-full flex items-center justify-center text-sm text-slate-400">
                        Loading chart data...
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="periode"
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontSize: 12, fill: '#64748b' }}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontSize: 11, fill: '#64748b' }}
                                tickFormatter={(val) =>
                                    metricType === 'revenue' ? `Rp${val / 1000000}M` : val
                                }
                            />
                            <Tooltip
                                formatter={(value) =>
                                    metricType === 'revenue'
                                        ? [formatCurrency(Number(value)), 'Revenue']
                                        : [`${value} Units`, 'Volume']
                                }
                                contentStyle={{
                                    backgroundColor: '#0f172a',
                                    borderRadius: '8px',
                                    color: '#fff',
                                    fontSize: '12px',
                                }}
                                itemStyle={{ color: '#38bdf8' }}
                            />
                            <Area
                                type="monotone"
                                dataKey={metricType === 'revenue' ? 'total_penjualan' : 'jumlah_transaksi'}
                                stroke="#2563eb"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorTrend)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}