import React, { useState, useEffect } from "react";
import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import Image from "next/image";
import { Link } from "react-scroll";

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState("Services");
  const menuItems = [
    // { name: "Principal", href: "#principal" },
    // { name: 'Services', href: '#services' },
    // { name: 'Our Consulting', href: '#consulting' },
    // { name: 'Schema', href: '#schema' },
    // { name: 'Success Stories', href: '#stories' },
    // { name: 'Collaboration', href: '#agile' },
  ];

  const handleMenuItemClick = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSetActiveSection = (section) => {
    setActiveSection(section);
  };

  return (
    <Navbar
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className="bg-gray-100"
    >
      <NavbarContent className="text-black sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>

      <NavbarContent className="pr-3 sm:hidden" justify="center">
        <NavbarBrand>
          <Image src={"/logo.png"} width={50} height={50} alt={"logo"} />{" "}
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden gap-4 sm:flex" justify="center">
        <NavbarBrand>
          <Image src={"/logo.png"} width={50} height={50} alt={"logo"} />
        </NavbarBrand>
        {menuItems.map((item, index) => (
          <NavbarItem key={`${item.name}-${index}`}>
            <Link
              to={item.href.replace("#", "")}
              className={`text-black hover:text-red-700 ${
                activeSection === item.href.replace("#", "")
                  ? "font-bold text-red-700"
                  : ""
              }`} // Agregamos la clase CSS correspondiente
              onClick={() => {
                handleMenuItemClick(item.href);
              }} // Actualizamos la sección activa al hacer clic
              onSetActive={() => {
                handleSetActiveSection(item.href.replace("#", ""));
              }} // Actualizamos la sección activa cuando llegamos a la sección
              smooth={true}
              duration={1000}
              spy={true}
            >
              {item.name}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <div className="space-x-2">
            <Link
              href="https://wa.me/526646429633?text=Im%20interested%20
          in%20create%20my%20page"
              target="_blank"
            >
              <Button color="danger">CONTACT US</Button>
            </Link>
            <Link href="/dashboard">
              <Button color="primary">DASHBOARD</Button>
            </Link>
          </div>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.name}-${index}`}>
            <Link
              className={`w-full text-red-800 hover:text-blue-700 ${
                activeSection === item.href.replace("#", "") ? "font-bold" : ""
              }`}
              onClick={() => handleMenuItemClick(item.href)}
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
