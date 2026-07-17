export type FooterItem = {
  id: string;
  label: string;
  href?: string;
};

export type FooterColumn = {
  id: string;
  title: string;
  items: FooterItem[];
};
