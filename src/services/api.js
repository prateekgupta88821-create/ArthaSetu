const API_BASE = 'http://localhost:8000/api';

async function fetchJson(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`API call failed to ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  getPersonas: () => fetchJson('/personas/list'),
  switchPersona: (key) => fetchJson(`/personas/switch/${key}`, { method: 'POST' }),
  resetPersona: () => fetchJson('/personas/reset', { method: 'POST' }),

  submitOnboarding: (data) => fetchJson('/onboarding', { method: 'POST', body: JSON.stringify(data) }),

  getDashboard: () => fetchJson('/dashboard'),

  getIncome: () => fetchJson('/income'),
  addIncome: (entry) => fetchJson('/income', { method: 'POST', body: JSON.stringify(entry) }),

  getExpenses: () => fetchJson('/expenses'),
  addExpense: (entry) => fetchJson('/expenses', { method: 'POST', body: JSON.stringify(entry) }),
  deleteExpense: (index) => fetchJson(`/expenses/${index}`, { method: 'DELETE' }),

  getHealth: () => fetchJson('/health'),
  getSavings: () => fetchJson('/savings'),

  getGoals: () => fetchJson('/goals'),
  addGoal: (goal) => fetchJson('/goals', { method: 'POST', body: JSON.stringify(goal) }),

  getInvesting: () => fetchJson('/investing'),

  checkAffordability: (data) => fetchJson('/affordability', { method: 'POST', body: JSON.stringify(data) }),
  getGadgets: () => fetchJson('/gadgets/default-comparison'),
  getVehicles: () => fetchJson('/vehicles/ev-comparison'),
  getTax: () => fetchJson('/tax'),
  getForecast: () => fetchJson('/forecast'),
  runSimulator: (params) => fetchJson('/simulator', { method: 'POST', body: JSON.stringify(params) }),

  askCopilot: (question) => fetchJson('/ai/chat', { method: 'POST', body: JSON.stringify({ question }) }),
  getInsights: () => fetchJson('/insights'),
  getSnapshot: () => fetchJson('/snapshot')
};
