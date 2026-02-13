<script setup>
import { ref, computed, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import TopBar from '@/components/admin/TopBar.vue';
import { useAdminStore } from '@/stores/admin';

const adminStore = useAdminStore();

onMounted(async () => {
    await adminStore.fetchStats();
});

const stats = computed(() => adminStore.stats);

// KPI cards - more refined
const statCards = computed(() => {
    if (!stats.value) return [];
    return [
        {
            label: 'Revenue',
            value: `$${Number(stats.value.totalRevenue).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
            icon: 'mdi:cash-multiple',
            gradient: 'from-emerald-500 to-teal-600',
            iconBg: 'bg-emerald-500'
        },
        {
            label: 'Orders',
            value: stats.value.totalOrders,
            icon: 'mdi:package-variant-closed-check',
            gradient: 'from-blue-500 to-indigo-600',
            iconBg: 'bg-blue-500'
        },
        {
            label: 'Customers',
            value: stats.value.totalCustomers,
            icon: 'mdi:account-group',
            gradient: 'from-violet-500 to-purple-600',
            iconBg: 'bg-violet-500'
        },
        {
            label: 'Products',
            value: stats.value.totalProducts,
            icon: 'mdi:cpu-64-bit',
            gradient: 'from-amber-500 to-orange-600',
            iconBg: 'bg-amber-500'
        },
        {
            label: 'Low Stock',
            value: stats.value.lowStockCount,
            icon: 'mdi:alert-circle',
            gradient: 'from-rose-500 to-red-600',
            iconBg: 'bg-rose-500'
        }
    ];
});

// Radar chart data with text wrapping
const radarData = computed(() => {
    if (!stats.value?.revenueByCategory?.length) return null;
    
    const maxRevenue = Math.max(...stats.value.revenueByCategory.map(c => c.revenue));
    const categories = stats.value.revenueByCategory;
    const numPoints = categories.length;
    const centerX = 150;
    const centerY = 150;
    const maxRadius = 95;
    
    // Generate polygon points
    const points = categories.map((cat, i) => {
        const angle = (Math.PI * 2 * i) / numPoints - Math.PI / 2;
        const radius = (cat.revenue / maxRevenue) * maxRadius;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        return { x, y, angle, cat, radius };
    });
    
    // Grid circles (5 levels)
    const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];
    const gridCircles = gridLevels.map(level => {
        const r = maxRadius * level;
        return { r, label: `$${Math.round(maxRevenue * level).toLocaleString()}` };
    });
    
    // Axis lines with wrapped labels
    const axisLines = categories.map((cat, i) => {
        const angle = (Math.PI * 2 * i) / numPoints - Math.PI / 2;
        const x = centerX + maxRadius * Math.cos(angle);
        const y = centerY + maxRadius * Math.sin(angle);
        const labelX = centerX + (maxRadius + 45) * Math.cos(angle);
        const labelY = centerY + (maxRadius + 45) * Math.sin(angle);
        
        // Split long names into multiple lines (wrap at ~10 chars)
        const words = cat.name.split(' ');
        const lines = [];
        let currentLine = '';
        
        words.forEach(word => {
            if ((currentLine + ' ' + word).trim().length > 10 && currentLine.length > 0) {
                lines.push(currentLine.trim());
                currentLine = word;
            } else {
                currentLine = (currentLine + ' ' + word).trim();
            }
        });
        if (currentLine) lines.push(currentLine);
        
        return { x, y, labelX, labelY, name: cat.name, lines };
    });
    
    return { points, gridCircles, axisLines, centerX, centerY };
});

// Orders chart data with metrics for 30 days
const ordersMetrics = computed(() => {
    if (!stats.value?.recentOrders?.length) return null;
    
    const orders = stats.value.recentOrders;
    const total = orders.reduce((sum, o) => sum + o.amount, 0);
    const average = total / orders.length;
    
    // Calculate trend (compare last half vs first half)
    const firstHalf = orders.slice(0, Math.ceil(orders.length / 2));
    const secondHalf = orders.slice(Math.ceil(orders.length / 2));
    const firstAvg = firstHalf.reduce((sum, o) => sum + o.amount, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, o) => sum + o.amount, 0) / secondHalf.length;
    const trend = ((secondAvg - firstAvg) / firstAvg) * 100;
    
    return {
        total: total.toFixed(2),
        average: average.toFixed(2),
        trend: trend.toFixed(1),
        trendUp: trend >= 0
    };
});

const maxOrderAmount = computed(() => {
    if (!stats.value?.recentOrders?.length) return 1;
    return Math.max(...stats.value.recentOrders.map(o => o.amount), 1);
});

const formatDay = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const categoryColors = [
    '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899',
    '#06b6d4', '#f97316', '#6366f1', '#84cc16', '#d946ef'
];
</script>

<template>
    <div class="min-h-screen bg-gray-50 dark:bg-zinc-950 font-sans text-gray-900 dark:text-gray-100">
        <TopBar />

        <main class="max-w-[1400px] mx-auto p-6 space-y-6">

            <!-- Header - more compact -->
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-3xl font-black tracking-tight" style="font-family: 'Outfit', sans-serif;">
                        Analytics Dashboard
                    </h2>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium uppercase tracking-wider" style="font-family: 'JetBrains Mono', monospace; letter-spacing: 0.15em;">
                        Performance Metrics
                    </p>
                </div>
                <div class="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                    <div class="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span class="text-xs font-bold text-emerald-700 dark:text-emerald-400" style="font-family: 'JetBrains Mono', monospace;">LIVE</span>
                </div>
            </div>

            <!-- Loading -->
            <div v-if="adminStore.isLoading && !stats" class="flex justify-center p-20">
                <Icon icon="eos-icons:loading" class="text-5xl text-blue-500 animate-spin" />
            </div>

            <template v-else-if="stats">

                <!-- KPI Cards - compact grid -->
                <div class="grid grid-cols-5 gap-4">
                    <div
                        v-for="(card, i) in statCards"
                        :key="i"
                        class="group bg-white dark:bg-zinc-900 rounded-xl p-4 border border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 transition-all hover:shadow-lg"
                    >
                        <div class="flex items-start justify-between mb-3">
                            <div class="p-2 rounded-lg" :class="card.iconBg">
                                <Icon :icon="card.icon" class="text-lg text-white" />
                            </div>
                        </div>
                        <p class="text-2xl font-black tracking-tight bg-gradient-to-br bg-clip-text text-transparent mb-1" :class="card.gradient" style="font-family: 'JetBrains Mono', monospace;">
                            {{ card.value }}
                        </p>
                        <p class="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            {{ card.label }}
                        </p>
                    </div>
                </div>

                <!-- Charts Section -->
                <div class="grid grid-cols-2 gap-6">

                    <!-- Revenue Radar Chart - Larger with wrapped labels -->
                    <div class="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-5">
                        <div class="flex items-center gap-2 mb-5">
                            <div class="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg">
                                <Icon icon="mdi:radar" class="text-white text-lg" />
                            </div>
                            <div>
                                <h3 class="font-black text-lg tracking-tight">Revenue Distribution</h3>
                                <p class="text-xs text-gray-500 dark:text-gray-400">by category</p>
                            </div>
                        </div>

                        <div v-if="radarData" class="flex items-center justify-center">
                            <svg viewBox="0 0 300 300" class="w-full max-w-md">
                                <!-- Grid circles -->
                                <g v-for="(circle, i) in radarData.gridCircles" :key="`grid-${i}`">
                                    <circle
                                        :cx="radarData.centerX"
                                        :cy="radarData.centerY"
                                        :r="circle.r"
                                        fill="none"
                                        :stroke="i === radarData.gridCircles.length - 1 ? '#d1d5db' : '#e5e7eb'"
                                        :stroke-width="i === radarData.gridCircles.length - 1 ? '2' : '1'"
                                        class="dark:stroke-zinc-700"
                                        stroke-dasharray="2,2"
                                    />
                                </g>

                                <!-- Axis lines -->
                                <g v-for="(axis, i) in radarData.axisLines" :key="`axis-${i}`">
                                    <line
                                        :x1="radarData.centerX"
                                        :y1="radarData.centerY"
                                        :x2="axis.x"
                                        :y2="axis.y"
                                        stroke="#d1d5db"
                                        stroke-width="1"
                                        class="dark:stroke-zinc-700"
                                    />
                                    <!-- Category labels with line wrapping -->
                                    <text
                                        :x="axis.labelX"
                                        :y="axis.labelY"
                                        text-anchor="middle"
                                        class="fill-gray-700 dark:fill-gray-300"
                                        style="font-family: 'JetBrains Mono', monospace;"
                                    >
                                        <tspan
                                            v-for="(line, lineIdx) in axis.lines"
                                            :key="`line-${i}-${lineIdx}`"
                                            :x="axis.labelX"
                                            :dy="lineIdx === 0 ? 0 : '1em'"
                                            class="text-[9px] font-bold"
                                        >
                                            {{ line }}
                                        </tspan>
                                    </text>
                                </g>

                                <!-- Data polygon -->
                                <polygon
                                    :points="radarData.points.map(p => `${p.x},${p.y}`).join(' ')"
                                    fill="url(#radarGradient)"
                                    stroke="#f59e0b"
                                    stroke-width="3"
                                    opacity="0.7"
                                />

                                <!-- Data points -->
                                <g v-for="(point, i) in radarData.points" :key="`point-${i}`">
                                    <circle
                                        :cx="point.x"
                                        :cy="point.y"
                                        r="4"
                                        :fill="categoryColors[i % categoryColors.length]"
                                        stroke="white"
                                        stroke-width="2"
                                        class="cursor-pointer hover:r-6 transition-all"
                                    />
                                    <!-- Value labels on hover -->
                                    <text
                                        :x="point.x"
                                        :y="point.y - 10"
                                        text-anchor="middle"
                                        class="text-[9px] font-bold fill-gray-900 dark:fill-white opacity-0 hover:opacity-100 transition-opacity"
                                        style="font-family: 'JetBrains Mono', monospace;"
                                    >
                                        ${{ point.cat.revenue.toFixed(0) }}
                                    </text>
                                </g>

                                <!-- Gradient definition -->
                                <defs>
                                    <radialGradient id="radarGradient">
                                        <stop offset="0%" stop-color="#fbbf24" stop-opacity="0.6"/>
                                        <stop offset="100%" stop-color="#f97316" stop-opacity="0.2"/>
                                    </radialGradient>
                                </defs>
                            </svg>
                        </div>
                        <div v-else class="flex items-center justify-center h-64 text-gray-400 text-sm">
                            No revenue data
                        </div>
                    </div>

                    <!-- Enhanced Order Activity Chart - 30 Days -->
                    <div class="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-5">
                        <div class="flex items-center justify-between mb-4">
                            <div class="flex items-center gap-2">
                                <div class="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                                    <Icon icon="mdi:chart-timeline-variant" class="text-white text-lg" />
                                </div>
                                <div>
                                    <h3 class="font-black text-lg tracking-tight">Order Activity</h3>
                                    <p class="text-xs text-gray-500 dark:text-gray-400">last 30 days</p>
                                </div>
                            </div>
                        </div>

                        <!-- Key Metrics -->
                        <div v-if="ordersMetrics" class="grid grid-cols-3 gap-3 mb-5">
                            <div class="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-800 dark:to-zinc-900 rounded-lg p-3 border border-gray-200 dark:border-zinc-700">
                                <p class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Total</p>
                                <p class="text-xl font-black tracking-tight" style="font-family: 'JetBrains Mono', monospace;">
                                    ${{ ordersMetrics.total }}
                                </p>
                            </div>
                            <div class="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-800 dark:to-zinc-900 rounded-lg p-3 border border-gray-200 dark:border-zinc-700">
                                <p class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Average</p>
                                <p class="text-xl font-black tracking-tight" style="font-family: 'JetBrains Mono', monospace;">
                                    ${{ ordersMetrics.average }}
                                </p>
                            </div>
                            <div class="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-800 dark:to-zinc-900 rounded-lg p-3 border border-gray-200 dark:border-zinc-700">
                                <p class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Trend</p>
                                <div class="flex items-center gap-1">
                                    <Icon :icon="ordersMetrics.trendUp ? 'mdi:trending-up' : 'mdi:trending-down'" 
                                          :class="ordersMetrics.trendUp ? 'text-emerald-600' : 'text-red-600'" 
                                          class="text-xl" />
                                    <p class="text-xl font-black tracking-tight" 
                                       :class="ordersMetrics.trendUp ? 'text-emerald-600' : 'text-red-600'"
                                       style="font-family: 'JetBrains Mono', monospace;">
                                        {{ ordersMetrics.trend }}%
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- Bar Chart with cleaner date labels -->
                        <div v-if="stats.recentOrders?.length" class="space-y-3">
                            <!-- Chart area -->
                            <div class="flex items-end gap-1 h-48 px-2">
                                <div
                                    v-for="(order, idx) in stats.recentOrders"
                                    :key="order.date"
                                    class="flex-1 flex flex-col items-center justify-end h-full group relative"
                                >
                                    <!-- Tooltip with date and amount -->
                                    <div class="absolute -top-14 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                                        <div class="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap text-center shadow-xl" style="font-family: 'JetBrains Mono', monospace;">
                                            <div class="text-gray-300 dark:text-gray-600 mb-1">{{ formatDay(order.date) }}</div>
                                            <div class="text-blue-400 dark:text-blue-600 text-sm">${{ order.amount.toFixed(2) }}</div>
                                        </div>
                                    </div>

                                    <!-- Bar -->
                                    <div
                                        class="w-full bg-gradient-to-t from-blue-500 to-indigo-600 rounded-t-lg hover:from-blue-400 hover:to-indigo-500 transition-all cursor-pointer shadow-sm hover:shadow-md"
                                        :style="{ height: `${Math.max((order.amount / maxOrderAmount) * 100, 5)}%` }"
                                    ></div>
                                </div>
                            </div>
                            
                            <!-- Date labels below - show every 7th -->
                            <div class="flex justify-between px-2 pt-2 border-t border-gray-100 dark:border-zinc-800">
                                <span 
                                    v-for="(order, idx) in stats.recentOrders.filter((_, i) => i % 7 === 0 || i === stats.recentOrders.length - 1)"
                                    :key="order.date"
                                    class="text-[10px] font-bold text-gray-500 dark:text-gray-400"
                                    style="font-family: 'JetBrains Mono', monospace;"
                                >
                                    {{ formatDay(order.date) }}
                                </span>
                            </div>
                        </div>
                        <div v-else class="flex items-center justify-center h-48 text-gray-400 text-sm">
                            No orders in the last 30 days
                        </div>
                    </div>
                </div>

                <!-- Top Products - more compact -->
                <div class="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-5">
                    <div class="flex items-center gap-2 mb-5">
                        <div class="p-2 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg">
                            <Icon icon="mdi:trophy" class="text-white text-lg" />
                        </div>
                        <div>
                            <h3 class="font-black text-lg tracking-tight">Top Performers</h3>
                            <p class="text-xs text-gray-500 dark:text-gray-400">best-selling products</p>
                        </div>
                    </div>

                    <div v-if="stats.topProducts?.length" class="grid grid-cols-5 gap-4">
                        <div
                            v-for="(product, i) in stats.topProducts"
                            :key="i"
                            class="group relative p-4 bg-gray-50 dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 hover:border-amber-300 dark:hover:border-amber-600 transition-all hover:shadow-lg"
                        >
                            <!-- Rank -->
                            <div class="absolute -top-2 -right-2 h-8 w-8 rounded-full flex items-center justify-center font-black text-xs shadow-lg border-2 border-white dark:border-zinc-900"
                                :class="i === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-yellow-900' :
                                         i === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-gray-800' :
                                         'bg-gradient-to-br from-orange-400 to-orange-600 text-white'"
                            >
                                {{ i + 1 }}
                            </div>

                            <!-- Image -->
                            <div class="h-20 w-full mb-3 bg-white dark:bg-zinc-900 rounded-lg flex items-center justify-center p-2 border border-gray-200 dark:border-zinc-700">
                                <img v-if="product.ImageUrl" :src="product.ImageUrl" :alt="product.name" class="w-full h-full object-contain" />
                                <Icon v-else icon="mdi:package-variant" class="text-3xl text-gray-300" />
                            </div>

                            <!-- Info -->
                            <p class="text-xs font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight mb-1">
                                {{ product.name }}
                            </p>
                            <p class="text-[10px] text-gray-500 dark:text-gray-400 truncate mb-2">
                                {{ product.brand }}
                            </p>
                            
                            <!-- Sales -->
                            <div class="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 dark:bg-amber-900/30 rounded-md">
                                <Icon icon="mdi:fire" class="text-orange-500 text-xs" />
                                <span class="text-xs font-black text-orange-700 dark:text-orange-400" style="font-family: 'JetBrains Mono', monospace;">
                                    {{ product.totalSold }}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div v-else class="text-center py-12 text-gray-400 text-sm">
                        No sales data yet
                    </div>
                </div>

            </template>

            <!-- Error State -->
            <div v-else class="text-center py-20">
                <Icon icon="mdi:alert-circle-outline" class="text-6xl text-gray-300 dark:text-zinc-700 mx-auto mb-3" />
                <p class="text-gray-500 text-lg font-semibold">Unable to load analytics</p>
            </div>

        </main>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&family=JetBrains+Mono:wght@400;700&display=swap');
</style>
