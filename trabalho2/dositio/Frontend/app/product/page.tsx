"use client";
import React, { useState, useEffect } from 'react';

interface Product {
  _id: string;
  nameProduct: string;
  qtd: number;
  category: string;
}

interface Category {
  name: string;
  img_url: string;
}

const Products = () => {
  const [productList, setProductList] = useState<Product[]>([]);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      try {
        const productResponse = await fetch('http://127.0.0.1:5000/products');
        if (!productResponse.ok) throw new Error('Erro ao buscar produtos');
        const productData = await productResponse.json();

        const categoryResponse = await fetch('http://127.0.0.1:5000/categories');
        if (!categoryResponse.ok) throw new Error('Erro ao buscar categorias');
        const categoryData = await categoryResponse.json();

        setProductList(productData);
        setCategoryList(categoryData);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAndCategories();
  }, []);

  const filterProducts = (category: string) => {
    setSelectedCategory(category);
  };

  const filteredProducts = selectedCategory === 'all'
    ? productList
    : productList.filter(product => product.category === selectedCategory);

  if (isLoading) return <p className="text-center">Carregando...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!productList.length) return <p className="text-center">Nenhum produto disponível</p>;
  if (!categoryList.length) return <p className="text-center">Nenhuma categoria disponível</p>;

  return (
    <main className="flex flex-col items-center p-4 bg-violet-200 min-h-screen">
      <div id="filters" className="mb-4">
        <button 
          onClick={() => filterProducts('all')} 
          className={`bg-purple-500 text-white py-2 px-4 m-2 rounded hover:bg-violet-800 ${selectedCategory === 'all' ? 'bg-violet-800' : ''}`}
        >
          Todos
        </button>
        {categoryList.map(category => (
          <button 
            key={category.name} 
            onClick={() => filterProducts(category.name)} 
            className={`bg-purple-500 text-white py-2 px-4 m-2 rounded hover:bg-violet-800 ${selectedCategory === category.name ? 'bg-violet-800' : ''}`}
          >
            {category.name}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {filteredProducts.map(({ _id, nameProduct, qtd }) => (
          <div key={_id} className="bg-white border border-gray-300 rounded p-4 shadow-md">
            <p className="text-xl font-semibold mb-2">{nameProduct}</p>
            <p className="text-gray-600">Quantidade: {qtd}</p>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Products;
