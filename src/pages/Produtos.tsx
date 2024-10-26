import React from 'react';
import { ProdutoForm } from '../components/ProdutoForm';
import { ProdutoList } from '../components/ProdutoList';

export function ProdutosPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gerenciar Produtos</h1>
      <div className="space-y-6">
        <ProdutoForm />
        <ProdutoList />
      </div>
    </div>
  );
}
