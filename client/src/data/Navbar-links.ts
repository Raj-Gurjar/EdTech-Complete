export interface NavbarLink {
  title: string;
  path: string;
}

export const NavbarLinks: NavbarLink[] = [
  {
    title: "Home",
    path: "/",
  },
  {
    title: "Courses",
    path: "/allCourses",
  },
  {
    title: "About Us",
    path: "/about",
  },
  {
    title: "Contact Us",
    path: "/contact",
  },
];
