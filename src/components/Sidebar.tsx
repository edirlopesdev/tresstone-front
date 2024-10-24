import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Settings, 
  Menu,
  Calendar,
  Palette,
  BadgeCheck,
  CreditCard,
  Package
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { signOut } from '../auth/auth';

const menuItems = [
  { title: "Dashboard", icon: Home, url: "/dashboard" },
  { title: "Agendamentos", icon: Calendar, url: "/agendamentos" },
  { title: "Clientes", icon: Users, url: "/clientes" },
  { title: "Histórico de Coloração", icon: Palette, url: "/historico-coloracao" },
  { title: "Perfis", icon: BadgeCheck, url: "/perfis" },
  { title: "Planos", icon: CreditCard, url: "/planos" },
  { title: "Produtos", icon: Package, url: "/produtos" },
  { title: "Configurações", icon: Settings, url: "/settings" },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className={`bg-gray-800 text-white h-screen ${isCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 ease-in-out`}>
      <div className="flex items-center justify-between p-4">
        {!isCollapsed && <h1 className="text-xl font-bold">TresStone</h1>}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="text-white">
          <Menu size={24} />
        </button>
      </div>
      <nav>
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.url}
            className="flex items-center p-4 hover:bg-gray-700 transition-colors duration-200"
          >
            <item.icon className={`sidebar-icon ${isCollapsed ? 'sidebar-icon-collapsed' : ''}`} size={20} />
            {!isCollapsed && <span className="ml-2">{item.title}</span>}
          </Link>
        ))}
      </nav>
      <div className="absolute bottom-0 w-full p-4">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <button className="flex items-center space-x-2">
              <Avatar>
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              {!isCollapsed && <span>John Doe</span>}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Perfil</DropdownMenuItem>
            <DropdownMenuItem>Configurações</DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut}>Sair</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}