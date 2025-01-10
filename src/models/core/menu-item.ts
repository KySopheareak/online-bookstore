export interface MenuItem {
  name: string; // Title to be displayed
  path?: string; // Link to redirect when click
  children?: MenuItem[]; // Children of the menu
  icon?: string; // Icon to be displayed
  root?: string;
  expanded?: boolean; // Show children or not
  isNoPermission?: boolean;
}
