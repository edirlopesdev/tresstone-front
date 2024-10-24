import React from 'react';
import { ProdutoForm } from '../components/ProdutoForm';
import { ProdutoList } from '../components/ProdutoList';

export function ProdutosPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gerenciar Produtos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ProdutoForm />
        <ProdutoList />
      </div>
    </div>
  );
}
