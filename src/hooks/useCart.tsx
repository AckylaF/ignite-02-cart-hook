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
<<<<<<< HEAD
      const product: Product = await api.get(`/products/${productId}`).then(res => res.data)
=======
      const product = (await api.get("/products")
        .then(res => res.data as Product[]))
        .filter(product => product.id === productId)[0]
>>>>>>> a82776b2aad0833bce08893ae648f2d76acf1f6e
      
      const existingProduct = cart.find(product => product.id === productId)
      if(existingProduct) {
        updateProductAmount({productId, amount: existingProduct.amount + 1 })
        
      } else {
<<<<<<< HEAD
        localStorage.setItem('@RocketShoes:cart', JSON.stringify([...cart, { ...product, amount: 1 }]))
        setCart(prevState => [...prevState, { ...product, amount: 1 } ])
      }
      
=======
        setCart(prevState => [...prevState, { ...product, amount: 1 } ])

      }
      
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(cart))
>>>>>>> a82776b2aad0833bce08893ae648f2d76acf1f6e
    } catch {
      // TODO
      toast.error('Erro na adição do produto')
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
      if(cart.filter(product => product.id === productId).length === 0) {
        throw Error
      }
      
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(cart.filter(product => product.id !== productId)))
      setCart(cart.filter(product => product.id !== productId))
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
      if(cart.filter(product => product.id === productId).length === 0) {
        throw Error
      }

      const stock: Stock = await api.get(`/stock/${productId}`).then(res => res.data)

      if(stock.amount <= 0 || amount < 1) return

      if(stock.amount < amount) {
        return toast.error('Quantidade solicitada fora de estoque')
      }

      const idx = cart.findIndex(product => product.id === productId)
      let updatedCart = [...cart]
      
      updatedCart[idx].amount = amount
      
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(updatedCart))
      setCart(updatedCart)

    } catch {
      // TODO
      return toast.error('Erro na alteração de quantidade do produto')
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
