import React from 'react';
import './Sidebar.css';

const Sidebar = ({ children }) => {
  return <aside className="vk-sidebar">{children}</aside>;
};

export default Sidebar;
