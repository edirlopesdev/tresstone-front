import React from 'react';

const Dashboard = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Total de Usuários</h2>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Total de Empresas</h2>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Atividades Recentes</h2>
          <p>Nenhuma atividade recente</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
