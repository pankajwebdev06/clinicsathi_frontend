import { apiClient } from "@/core/api/apiClient";

export const subscriptionApi = {
  async getPlans() {
    return apiClient("/subscriptions/plans", { method: "GET" });
  },

  async createOrder(plan: "monthly" | "annual") {
    return apiClient("/subscriptions/create-order", {
      method: "POST",
      body: JSON.stringify({ plan }),
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
