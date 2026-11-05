export interface IModel {
  id: number;
  name: string;
  type: string;
  filepath: string;
  description: string;
  /** average rating, null when the model has no ratings */
  stars: number | null;
  usageCount: number;
  user_id: number;
  username: string;
  firstname: string;
  lastname: string;
  createTime: string;
}
