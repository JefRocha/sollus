import {
  DollarSign,
  Wallet,
  Receipt,
  CreditCard,
  Landmark,
  FileText,
  CalendarClock,
} from "lucide-react";

const financeiroSidebarConfig = [
  { title: "Dashboard", href: "/financeiro/dashboard", icon: DollarSign },
  { title: "Caixa", href: "/financeiro/caixa", icon: Wallet },
  { title: "Contas a Pagar", href: "/financeiro/pagar", icon: Receipt },
  { title: "Contas a Receber", href: "/financeiro/receber", icon: CreditCard },
  {
    title: "Banco Conta Caixa",
    href: "/financeiro/banco-conta-caixa",
    icon: CreditCard,
  },
  {
    title: "Bancos",
    icon: Landmark,
    items: [
      { title: "Extratos", href: "/financeiro/extratos", icon: FileText },
      {
        title: "Conciliação",
        href: "/financeiro/conciliacao",
        icon: CalendarClock,
      },
      {
        title: "Cheques emitidos",
        href: "/financeiro/cheque-emitido",
        icon: CalendarClock,
      },
    ],
  },
];

export default financeiroSidebarConfig;
