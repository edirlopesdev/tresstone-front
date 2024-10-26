import React, { useState } from 'react';
import { ProdutoForm } from '../components/ProdutoForm';
import { ProdutoList } from '../components/ProdutoList';
import { Produto } from '../types/supabase-types';

export function ProdutosPage() {
  const [produtoParaEditar, setProdutoParaEditar] = useState<Produto | undefined>(undefined);
  const [triggerRefetch, setTriggerRefetch] = useState(false);

  const handleEditProduto = (produto: Produto) => {
    setProdutoParaEditar(produto);
  };

  const handleProdutoSalvo = () => {
    setProdutoParaEditar(undefined);
    setTriggerRefetch(!triggerRefetch);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gerenciar Produtos</h1>
      <div className="space-y-6">
        <ProdutoForm 
          produtoParaEditar={produtoParaEditar} 
          onProdutoSalvo={handleProdutoSalvo} 
        />
        <ProdutoList 
          onEditProduto={handleEditProduto}
          triggerRefetch={triggerRefetch}
        />
      </div>
    </div>
  );
}
