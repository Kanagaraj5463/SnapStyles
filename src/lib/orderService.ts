export type OrderStatus = "Upcoming" | "Confirmed" | "Completed" | "Cancelled";

export interface Order {
  id: string;
  shootType: string;
  date: string; // ISO string representing the local IST date
  time: string; // HH:mm
  location: string;
  people: number;
  notes?: string;
  status: OrderStatus;
}

const sampleOrders: Order[] = [
  {
    id: "SS-20260815-001",
    shootType: "Portrait",
    date: "2026-08-15",
    time: "18:30",
    location: "Bangalore",
    people: 2,
    notes: "Outdoor sunset shoot",
    status: "Upcoming",
  },
  {
    id: "SS-20260710-004",
    shootType: "Product",
    date: "2026-07-10",
    time: "14:00",
    location: "Mumbai",
    people: 1,
    notes: "Studio product showcase",
    status: "Completed",
  },
];

const saveOrder = (order: Order) => {
  return new Promise<Order>((resolve) => {
    setTimeout(() => resolve(order), 500);
  });
};

export async function fetchOrders(): Promise<Order[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(sampleOrders), 500);
  });
}

export async function fetchOrderById(orderId: string): Promise<Order | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const order = sampleOrders.find((item) => item.id === orderId) ?? null;
      resolve(order);
    }, 500);
  });
}

export async function createOrder(orderInput: Omit<Order, "id" | "status">): Promise<Order> {
  const order: Order = {
    ...orderInput,
    id: `SS-${orderInput.date.replace(/-/g, "")}-00${Math.floor(Math.random() * 90) + 10}`,
    status: "Confirmed",
  };
  return saveOrder(order);
}

export async function cancelOrder(orderId: string): Promise<Order | null> {
  const order = sampleOrders.find((item) => item.id === orderId);
  if (!order) return null;
  const updated = { ...order, status: "Cancelled" as OrderStatus };
  return saveOrder(updated);
}

export async function rescheduleOrder(orderId: string, date: string, time: string): Promise<Order | null> {
  const order = sampleOrders.find((item) => item.id === orderId);
  if (!order) return null;
  const updated = { ...order, date, time, status: "Confirmed" as OrderStatus };
  return saveOrder(updated);
}

// TODO: Replace the sample implementation above with actual backend or Supabase integration when order storage is available.
