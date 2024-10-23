import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Building2, 
  Settings, 
  ChevronRight, 
  ChevronsUpDown,
  LogOut,
  Menu,
  Sparkles,
  BadgeCheck,
  CreditCard,
  Bell
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

const menuItems = [
  { title: "Dashboard", icon: Home, url: "/dashboard" },
  { 
    title: "Usuários", 
    icon: Users, 
    url: "/users",
    submenu: [
      { title: "Lista de Usuários", url: "/users/list" },
      { title: "Adicionar Usuário", url: "/users/add" },
    ]
  },
  { 
    title: "Empresas", 
    icon: Building2, 
    url: "/companies",
    submenu: [
      { title: "Lista de Empresas", url: "/companies/list" },
      { title: "Adicionar Empresa", url: "/companies/add" },
    ]
  },
  { title: "Configurações", icon: Settings, url: "/settings" },
];

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleSubmenu = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title) 
        : [...prev, title]
    );
  };

  return (
    <div className={`bg-gray-800 text-white ${isCollapsed ? 'w-16' : 'w-64'} min-h-screen p-4 flex flex-col transition-all duration-300`}>
      <div className="flex justify-between items-center mb-6">
        {!isCollapsed && <h1 className="text-xl font-bold">Acme Inc</h1>}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 rounded-md hover:bg-gray-700">
          <Menu className="w-5 h-5" />
        </button>
      </div>
      <nav className="flex-grow">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.title}>
              {item.submenu ? (
                <Collapsible open={expandedItems.includes(item.title)}>
                  <CollapsibleTrigger 
                    className="flex items-center w-full p-2 rounded hover:bg-gray-700 cursor-pointer"
                    onClick={() => toggleSubmenu(item.title)}
                  >
                    <item.icon className="w-5 h-5 mr-2" />
                    {!isCollapsed && (
                      <>
                        <span>{item.title}</span>
                        <ChevronRight className={`ml-auto w-4 h-4 transition-transform duration-200 ${expandedItems.includes(item.title) ? 'rotate-90' : ''}`} />
                      </>
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    {!isCollapsed && (
                      <ul className="ml-6 mt-2 space-y-2">
                        {item.submenu.map((subItem) => (
                          <li key={subItem.title}>
                            <Link to={subItem.url} className="block p-2 rounded hover:bg-gray-700">
                              {subItem.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <Link to={item.url} className="flex items-center p-2 rounded hover:bg-gray-700">
                  <item.icon className="w-5 h-5 mr-2" />
                  {!isCollapsed && <span>{item.title}</span>}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center w-full p-2 rounded hover:bg-gray-700 cursor-pointer">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src="/path-to-avatar.jpg" alt="User" />
              <AvatarFallback>UN</AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <>
                <div className="flex-grow text-left">
                  <div className="font-semibold">shadcn</div>
                  <div className="text-xs text-gray-400">m@example.com</div>
                </div>
                <ChevronsUpDown className="ml-2 w-4 h-4" />
              </>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="absolute bottom-full mb-1">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem icon={<Sparkles className="h-4 w-4" />}>
              Upgrade to Pro
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem icon={<BadgeCheck className="h-4 w-4" />}>
              Account
            </DropdownMenuItem>
            <DropdownMenuItem icon={<CreditCard className="h-4 w-4" />}>
              Billing
            </DropdownMenuItem>
            <DropdownMenuItem icon={<Bell className="h-4 w-4" />}>
              Notifications
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem icon={<LogOut className="h-4 w-4" />}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Sidebar;
