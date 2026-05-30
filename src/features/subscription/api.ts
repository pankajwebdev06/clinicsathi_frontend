import { apiClient } from "@/core/api/apiClient";

export const subscriptionApi = {
  async getPlans() {
    return apiClient("/subscriptions/plans", { method: "GET" });
  },

  async getActivePromos() {
    return apiClient("/subscriptions/active-promos", { method: "GET" });
  },

  async applyPromo(code: string, plan: "monthly" | "annual") {
    return apiClient("/subscriptions/apply-promo", {
      method: "POST",
      body: JSON.stringify({ code, plan }),
    });
  },

  async createOrder(plan: "monthly" | "annual", promoCode?: string) {
    return apiClient("/subscriptions/create-order", {
      method: "POST",
      body: JSON.stringify({
        plan,
        ...(promoCode ? { promo_code: promoCode } : {}),
      }),
    });
  },

  async verifyPayment(order_id: string) {
    return apiClient("/subscriptions/verify", {
      method: "POST",
      body: JSON.stringify({ order_id }),
    });
  },

  async getStatus() {
    return apiClient("/subscriptions/status", { method: "GET" });
  },
};
