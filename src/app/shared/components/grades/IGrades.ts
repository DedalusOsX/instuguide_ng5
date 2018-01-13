export interface IGrade {
  label: string;
  icon: string;
  notification?: number;
};

export interface IGrades {
  data: IGrade[];
  selected: number;
}
