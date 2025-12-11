import {
  Users,
  Boxes,
  UserSquare2,
  Landmark,
  Briefcase,
  IdCard,
  Building2,
  Flag,
  GraduationCap,
  HeartHandshake,
  Tags,
  MapPin,
} from "lucide-react";

export default [
  { title: "Pessoas", href: "/cadastros/pessoa", icon: Users },
  { title: "Produtos", href: "/cadastros/produto", icon: Boxes },
  { title: "Colaboradores", href: "/cadastros/colaborador", icon: UserSquare2 },
  {
    title: "Outros Cadastros",
    icon: Landmark,
    items: [
      { title: "Bancos", href: "/cadastros/bancos", icon: Landmark },
      { title: "Cargo", href: "/cadastros/cargo", icon: Briefcase },
      { title: "CBO", href: "/cadastros/cbo", icon: IdCard },
      { title: "Setor", href: "/cadastros/setor", icon: Building2 },
      { title: "País", href: "/cadastros/pais", icon: Flag },
      {
        title: "Diversos",
        icon: Tags,
        masterOnly: true,
        items: [
          {
            title: "Nível de Formação",
            href: "/cadastros/nivel-formacao",
            icon: GraduationCap,
          },
          {
            title: "Estado Civil",
            href: "/cadastros/estado-civil",
            icon: HeartHandshake,
          },
          {
            title: "Tabela de Preços",
            href: "/cadastros/tabela-preco",
            icon: Tags,
          },
          { title: "Municípios", href: "/cadastros/municipio", icon: MapPin },
        ],
      },
    ],
  },
];
