export type Application = {
  id: string;
  title: string;
  description: string;
  customer: string;
  category: Category;
  status: "new" | "complete";
  offers: Offer[];
  review: Review | null;
  file: {
    type: string;
    name: string;
    url: string;
  } | null;
};

export type Offer = {
  id: string;
  performer: string;
  price: string;
  estimate: string;
  comment: string;
};

export type Review = {
  id: string;
  offerId: string;
  rating: string;
  comment: string;
};

export enum Category {
  category1 = "category1",
  category2 = "category2",
  category3 = "category3",
}
