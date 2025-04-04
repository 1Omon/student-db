<template>
  <div class="fees-view">
    <div class="header">
      <h2>My Fees</h2>
      <div class="filters">
        <select v-model="selectedTerm">
          <option value="">All Terms</option>
          <option v-for="term in terms" :key="term.id" :value="term.id">
            {{ term.name }}
          </option>
        </select>
      </div>
    </div>

    <div class="fees-summary">
      <div class="summary-card">
        <h4>Total Fees</h4>
        <div class="big-number">{{ formatCurrency(totalFees) }}</div>
        <div class="subtext">for selected period</div>
      </div>

      <div class="summary-card">
        <h4>Paid</h4>
        <div class="big-number">{{ formatCurrency(totalPaid) }}</div>
        <div class="subtext">{{ paymentPercentage }}% of total</div>
      </div>

      <div class="summary-card">
        <h4>Balance</h4>
        <div class="big-number" :class="{ 'negative': balance < 0 }">
          {{ formatCurrency(balance) }}
        </div>
        <div class="subtext">Due {{ dueDate }}</div>
      </div>
    </div>

    <div class="fees-table">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Receipt</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="fee in filteredFees" :key="fee.id">
            <td>{{ formatDate(fee.date) }}</td>
            <td>{{ fee.description }}</td>
            <td>{{ formatCurrency(fee.amount) }}</td>
            <td :class="['status', fee.status.toLowerCase()]">
              {{ fee.status }}
            </td>
            <td>
              <button v-if="fee.receipt" class="receipt-btn" @click="downloadReceipt(fee)">
                Download
              </button>
              <span v-else>--</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="payment-actions" v-if="balance > 0">
      <button class="pay-btn" @click="initiatePayment">
        Pay Balance
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// Sample data - replace with API calls in production
const feesData = ref([
  {
    id: 1,
    date: '2023-09-15',
    description: 'Tuition Fee - Term 1',
    amount: 50000,
    status: 'PAID',
    receipt: 'receipt_001.pdf',
    term: 't1'
  },
  {
    id: 2,
    date: '2023-09-20',
    description: 'Activity Fee',
    amount: 5000,
    status: 'PAID',
    receipt: 'receipt_002.pdf',
    term: 't1'
  },
  {
    id: 3,
    date: '2023-11-15',
    description: 'Tuition Fee - Term 2',
    amount: 50000,
    status: 'PARTIAL',
    receipt: null,
    term: 't2'
  },
  {
    id: 4,
    date: '2023-11-20',
    description: 'Library Fee',
    amount: 3000,
    status: 'PENDING',
    receipt: null,
    term: 't2'
  }
]);

const terms = ref([
  { id: 't1', name: 'Term 1' },
  { id: 't2', name: 'Term 2' },
  { id: 't3', name: 'Term 3' }
]);

const selectedTerm = ref('');

// Computed properties
const filteredFees = computed(() => {
  if (!selectedTerm.value) return feesData.value;
  return feesData.value.filter(fee => fee.term === selectedTerm.value);
});

const totalFees = computed(() => {
  return filteredFees.value.reduce((sum, fee) => sum + fee.amount, 0);
});

const totalPaid = computed(() => {
  return filteredFees.value
    .filter(fee => fee.status === 'PAID')
    .reduce((sum, fee) => sum + fee.amount, 0);
});

const balance = computed(() => {
  return totalFees.value - totalPaid.value;
});

const paymentPercentage = computed(() => {
  if (totalFees.value === 0) return 0;
  return Math.round((totalPaid.value / totalFees.value) * 100);
});

const dueDate = computed(() => {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return nextMonth.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
});

// Methods
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'KES'
  }).format(amount);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const downloadReceipt = (fee) => {
  console.log('Downloading receipt for:', fee.id);
  // Implement actual download logic
};

const initiatePayment = () => {
  console.log('Initiating payment for balance:', balance.value);
  // Implement payment logic
};
</script>

<style scoped>
.fees-view {
  padding: 1rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.filters {
  display: flex;
  gap: 1rem;
}

.filters select {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
}

.fees-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.summary-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.summary-card h4 {
  color: #666;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.big-number {
  font-size: 2rem;
  font-weight: bold;
  color: #3a4a6b;
  margin: 0.5rem 0;
}

.big-number.negative {
  color: #f44336;
}

.subtext {
  color: #666;
  font-size: 0.9rem;
}

.fees-table {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.fees-table table {
  width: 100%;
  border-collapse: collapse;
}

.fees-table th,
.fees-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.fees-table th {
  background: #f8f9fa;
  font-weight: 500;
  color: #555;
}

.fees-table tr:hover {
  background: #f8f9fa;
}

.status {
  font-weight: bold;
  text-transform: capitalize;
}

.status.paid {
  color: #4caf50;
}

.status.partial {
  color: #ffc107;
}

.status.pending {
  color: #f44336;
}

.receipt-btn {
  padding: 0.25rem 0.5rem;
  background: #3a4a6b;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.receipt-btn:hover {
  background: #2c3a57;
}

.payment-actions {
  text-align: right;
}

.pay-btn {
  padding: 0.75rem 1.5rem;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}

.pay-btn:hover {
  background: #3d8b40;
}
</style>