import React from 'react';
import type { CartItem } from '../types';

interface CartPageProps {
  cartItems: CartItem[];
  onNavigate: (page: string) => void;
  onRemoveFromCart: (itemId: string) => void;
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onPurchase: () => void;
}

const CartPage: React.FC<CartPageProps> = ({ cartItems, onNavigate, onRemoveFromCart, onUpdateQuantity, onPurchase }) => {
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="bg-white py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold font-heading text-gray-900 text-center mb-12">Your Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <div className="text-center">
            <p className="text-xl text-gray-600 mb-8">Your cart is empty.</p>
            <button
              onClick={() => onNavigate('home')}
              className="bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-900 transition-transform transform hover:scale-105 shadow-lg"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16">
            <div className="lg:col-span-7">
              <ul role="list" className="divide-y divide-gray-200 border-t border-b border-gray-200">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex py-6">
                    <div className="flex-shrink-0">
                      <img src={item.imageUrl} alt={item.title} className="h-24 w-24 rounded-md object-cover sm:h-32 sm:w-32" />
                    </div>
                    <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                      <div>
                        <div className="flex justify-between">
                          <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                          <p className="ml-4 text-lg font-bold text-primary">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">by {item.developer}</p>
                        <div className="mt-2 flex items-center">
                          <p className="text-sm text-gray-500 mr-4">Quantity:</p>
                          <div className="flex items-center border border-gray-300 rounded-md">
                            <button
                              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                              className="px-3 py-1 text-lg font-semibold text-gray-600 hover:bg-gray-100 rounded-l-md"
                              aria-label={`Decrease quantity of ${item.title}`}
                            >
                              -
                            </button>
                            <span className="px-4 py-1 text-center font-medium w-12">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                              className="px-3 py-1 text-lg font-semibold text-gray-600 hover:bg-gray-100 rounded-r-md"
                              aria-label={`Increase quantity of ${item.title}`}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <button
                          onClick={() => onRemoveFromCart(item.id)}
                          type="button"
                          className="text-sm font-medium text-red-600 hover:text-red-500"
                        >
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-16 rounded-lg bg-secondary px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
              <h2 className="text-lg font-medium text-gray-900">Order summary</h2>
              <dl className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">Subtotal</dt>
                  <dd className="text-sm font-medium text-gray-900">${subtotal.toFixed(2)}</dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <dt className="text-base font-medium text-gray-900">Order total</dt>
                  <dd className="text-base font-medium text-gray-900">${subtotal.toFixed(2)}</dd>
                </div>
              </dl>
              <div className="mt-6">
                <button
                  onClick={onPurchase}
                  type="button"
                  className="w-full bg-accent text-white font-bold py-3 px-4 rounded-lg shadow-sm hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                >
                  Checkout
                </button>
              </div>
               <div className="mt-6 text-center text-sm">
                <p>
                  or{' '}
                  <button onClick={() => onNavigate('home')} className="font-medium text-primary hover:text-blue-700">
                    Continue Shopping<span aria-hidden="true"> &rarr;</span>
                  </button>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;