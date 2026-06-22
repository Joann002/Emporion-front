<template>
  <div class="page">
    <PageHeader title="Tableau de bord" subtitle="Vue d'ensemble de votre activité commerciale">
      <template #actions>
        <RouterLink to="/orders/create" class="btn btn--primary">
          <AppIcon name="plus" :size="18" /> Nouvelle commande
        </RouterLink>
      </template>
    </PageHeader>

    <div v-if="statsStore.loading" class="loading-block">
      <span class="spinner" /> Chargement des statistiques…
    </div>

    <template v-else>
      <!-- KPI cards -->
      <div class="grid-auto stats">
        <StatCard label="Clients" :value="statsStore.summary.total_clients" icon="users" tone="info" />
        <StatCard label="Produits" :value="statsStore.summary.total_products" icon="box" tone="primary" />
        <StatCard label="Commandes" :value="statsStore.summary.total_orders" icon="cart" tone="warning" />
        <StatCard label="Chiffre d'affaires" :value="formatMoney(statsStore.summary.total_revenue)" icon="euro" tone="success" />
      </div>

      <!-- Revenue chart -->
      <div class="card" v-if="statsStore.revenueByMonth.length > 0">
        <div class="card__header">
          <h2 class="card__title">Chiffre d'affaires mensuel</h2>
          <span class="badge badge--success"><AppIcon name="trending" :size="14" /> Évolution</span>
        </div>
        <div class="card__body">
          <div class="chart">
            <div
              v-for="item in statsStore.revenueByMonth"
              :key="item.period"
              class="chart__col"
            >
              <div class="chart__bar-wrap">
                <span class="chart__value tabnum">{{ formatMoneyShort(item.revenue) }}</span>
                <div class="chart__bar" :style="{ height: getBarHeight(item.revenue) + '%' }" />
              </div>
              <span class="chart__label">{{ formatMonth(item.period) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Two columns: top products + low stock -->
      <div class="grid-2">
        <div class="card">
          <div class="card__header">
            <h2 class="card__title">Top 5 produits</h2>
            <AppIcon name="trending" :size="18" class="muted" />
          </div>
          <div class="card__body card__body--flush">
            <ul v-if="statsStore.topProducts.length > 0" class="rank">
              <li v-for="(product, i) in statsStore.topProducts" :key="product.product" class="rank__item">
                <span class="rank__pos">{{ i + 1 }}</span>
                <span class="rank__name">{{ product.product }}</span>
                <span class="badge badge--primary tabnum">{{ product.quantity }} vendus</span>
              </li>
            </ul>
            <EmptyState v-else icon="box" title="Aucune vente" description="Les meilleures ventes apparaîtront ici." />
          </div>
        </div>

        <div class="card">
          <div class="card__header">
            <h2 class="card__title">Alertes stock bas</h2>
            <AppIcon name="alert" :size="18" class="muted" />
          </div>
          <div class="card__body card__body--flush">
            <ul v-if="statsStore.lowStockProducts.length > 0" class="rank">
              <li v-for="product in statsStore.lowStockProducts" :key="product.id" class="rank__item">
                <span class="rank__dot rank__dot--danger" />
                <span class="rank__name">{{ product.name }}</span>
                <span class="badge badge--danger tabnum">{{ product.stock }} unités</span>
              </li>
            </ul>
            <EmptyState v-else icon="check" title="Stocks au vert" description="Tous vos produits sont suffisamment approvisionnés." />
          </div>
        </div>
      </div>

      <!-- Recent orders -->
      <div class="card" v-if="statsStore.recentOrders.length > 0">
        <div class="card__header">
          <h2 class="card__title">Commandes récentes</h2>
          <RouterLink to="/orders" class="btn btn--ghost btn--sm">Tout voir</RouterLink>
        </div>
        <div class="card__body--flush">
          <div class="table-wrap">
            <table class="data">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Client</th>
                  <th>Date</th>
                  <th class="text-right">Montant</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in statsStore.recentOrders" :key="order.id">
                  <td class="tabnum">#{{ order.id }}</td>
                  <td>{{ order.client }}</td>
                  <td class="muted">{{ order.date }}</td>
                  <td class="text-right tabnum">{{ formatMoney(order.total) }}</td>
                  <td><StatusBadge :status="order.status" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { useStatsStore } from '../stores/stats';
import PageHeader from '../components/ui/PageHeader.vue';
import StatCard from '../components/ui/StatCard.vue';
import EmptyState from '../components/ui/EmptyState.vue';
import StatusBadge from '../components/ui/StatusBadge.vue';
import AppIcon from '../components/ui/AppIcon.vue';

const statsStore = useStatsStore();

const formatMoney = (amount) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount || 0);

const formatMoneyShort = (amount) => {
  const n = parseFloat(amount) || 0;
  if (n >= 1000) return (n / 1000).toFixed(1).replace('.0', '') + 'k€';
  return Math.round(n) + '€';
};

const formatMonth = (period) => {
  const [year, month] = period.split('-');
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
  return `${months[parseInt(month) - 1]} ${year.slice(2)}`;
};

const maxRevenue = computed(() => {
  if (statsStore.revenueByMonth.length === 0) return 0;
  return Math.max(...statsStore.revenueByMonth.map((i) => parseFloat(i.revenue)));
});

const getBarHeight = (revenue) => {
  if (maxRevenue.value === 0) return 2;
  return Math.max((parseFloat(revenue) / maxRevenue.value) * 100, 4);
};

onMounted(() => statsStore.fetchStats());
</script>

<style scoped>
.stats {
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}
.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

/* Chart */
.chart {
  display: flex;
  align-items: flex-end;
  gap: 14px;
  height: 220px;
  padding-top: 12px;
}
.chart__col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  height: 100%;
}
.chart__bar-wrap {
  position: relative;
  flex: 1;
  width: 100%;
  max-width: 56px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
.chart__bar {
  width: 100%;
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
  background: linear-gradient(180deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 65%, transparent) 100%);
  transition: height 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}
.chart__col:hover .chart__bar {
  filter: brightness(1.08);
}
.chart__value {
  position: absolute;
  top: -20px;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  white-space: nowrap;
}
.chart__label {
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 500;
}

/* Rank lists */
.rank {
  list-style: none;
}
.rank__item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  border-bottom: 1px solid var(--border);
}
.rank__item:last-child {
  border-bottom: none;
}
.rank__pos {
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: var(--radius-sm);
  background: var(--surface-2);
  font-size: 12px;
  font-weight: 700;
  color: var(--text-muted);
}
.rank__dot {
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.rank__dot--danger {
  background: var(--danger);
}
.rank__name {
  flex: 1;
  font-weight: 500;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 860px) {
  .grid-2 {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 600px) {
  .chart {
    gap: 6px;
    height: 180px;
  }
  .chart__value {
    font-size: 10px;
  }
}
</style>
