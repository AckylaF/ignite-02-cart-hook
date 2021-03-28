import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart')

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      // TODO
      const product = (await api.get("/products")
        .then(res => res.data as Product[]))
        .filter(product => product.id === productId)[0]
      
      const existingProduct = cart.find(product => product.id === productId)
      if(existingProduct) {
        updateProductAmount({productId, amount: existingProduct.amount + 1 })
        
      } else {
        setCart(prevState => [...prevState, { ...product, amount: 1 } ])

      }
      
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(cart))
    } catch {
      // TODO
      toast.error('Erro na adição do produto')
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
      setCart(cart.filter(product => product.id !== productId))
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(cart))
    } catch {
      // TODO
      toast.error('Erro na remoção do produto')
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
      const productStock = (await api.get("/stock")
      .then(res => res.data as Stock[]))
      .filter(product => product.id === productId)[0].amount

      if(productStock <= 0) return

      
      if(productStock >= amount) {
        const idx = cart.findIndex(product => product.id === productId)
        let updatedCart = [...cart]
        updatedCart[idx].amount = amount
        
        setCart(updatedCart)

      } else {
        toast.error('Quantidade solicitada fora de estoque')
      }

    } catch {
      // TODO
      toast.error('Erro na adição do produto')
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
