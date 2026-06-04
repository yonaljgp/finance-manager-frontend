export default interface History {
  id: number;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: "ingreso" | "gasto";
}
