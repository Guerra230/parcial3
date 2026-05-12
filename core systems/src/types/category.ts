export interface MegaMenuColumn {
  title: string;
  icon?: string;
  groups: {
    heading: string;
    items: string[];
  }[];
}

export interface CategoryNavItem {
  id: string;
  label: string;
  slug: string;
  highlight?: boolean;
  megaMenu?: MegaMenuColumn[];
}
