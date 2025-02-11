"use client";
import Link from "next/link";
import { Drawer, IconButton, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import userIcon from "../../public/user-circle.svg"; // Adjust the path based on your folder structure
import { useState } from "react";

/**
 * HamburgerMenu
 * 
 * A responsive navigation drawer (MUI Drawer) that slides in from the right.
 * Displays menu links, and toggles sign in / sign out based on user state.
 */
const HamburgerMenu = ({ user, handleSignOut }) => {
  // Controls whether the drawer is open or closed
  const [drawerOpen, setDrawerOpen] = useState(false);

  /**
   * toggleDrawer:
   * Takes a boolean (open/close) and returns an event handler
   * that sets the drawer state. Ignores 'Tab'/'Shift' for keyboard events.
   */
  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  return (
    <>
      {/*
        The hamburger icon button. Shown on small screens (hidden on md+ if desired).
        Clicking it opens the drawer.
      */}
      <IconButton onClick={toggleDrawer(true)} className="md:hidden">
        <MenuIcon className="text-black dark:text-white" />
      </IconButton>

      {/*
        MUI Drawer:
        Anchored on the right. On close or backdrop click, it sets drawerOpen to false.
      */}
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <div className="p-4 w-64">
          {/* Drawer Header: includes a title and a close button */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-bold">Menu</span>
            <IconButton onClick={toggleDrawer(false)}>
              <CloseIcon />
            </IconButton>
          </div>

          {/* Nav links in a MUI List. Each link closes the drawer after click. */}
          <List>
            <ListItem disablePadding>
              <Link href="/mywords" passHref>
                <ListItemButton onClick={toggleDrawer(false)}>
                  <ListItemText primary="My Words" />
                </ListItemButton>
              </Link>
            </ListItem>

            <ListItem disablePadding>
              <Link href="/account" passHref>
                <ListItemButton onClick={toggleDrawer(false)}>
                  <ListItemText primary="Account" />
                </ListItemButton>
              </Link>
            </ListItem>

            <ListItem disablePadding>
              <Link href="/contact" passHref>
                <ListItemButton onClick={toggleDrawer(false)}>
                  <ListItemText primary="Contact Us" />
                </ListItemButton>
              </Link>
            </ListItem>

            <ListItem disablePadding>
              <Link href="/quiz" passHref>
                <ListItemButton onClick={toggleDrawer(false)}>
                  <ListItemText primary="Quiz" />
                </ListItemButton>
              </Link>
            </ListItem>

            {/* Sign In/Sign Out Button */}
            <ListItem disablePadding>
              {user ? (
                <ListItemButton
                  onClick={() => {
                    handleSignOut();
                    toggleDrawer(false)(); // Immediately invoke toggle to close
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <img src={userIcon.src} alt="User Icon" className="h-6 w-6" />
                    <span className="text-sm font-medium">Sign Out</span>
                  </div>
                </ListItemButton>
              ) : (
                <Link href="/signin" passHref>
                  <ListItemButton onClick={toggleDrawer(false)}>
                    <div className="flex items-center space-x-2">
                      <img src={userIcon.src} alt="User Icon" className="h-6 w-6" />
                      <span className="text-sm font-medium hover:underline">
                        Sign In/Up
                      </span>
                    </div>
                  </ListItemButton>
                </Link>
              )}
            </ListItem>
          </List>
        </div>
      </Drawer>
    </>
  );
};

export default HamburgerMenu;