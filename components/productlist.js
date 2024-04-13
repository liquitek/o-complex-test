"use client"
import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import loadPage from '../actions/loadpage.js';
import Modal from 'react-modal';

const PRODUCTS_TO_FETCH = 20

const ProductList = ({initialData}) => {
    const {ref, inView} = useInView(); 
    const [products, setProducts] = useState(initialData.products);
    const [page, setPage] = useState(initialData.page)
    const [cart, setCart] = useState({});
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [isOpen,setModal] = useState(false);
    
    const loadMore = async () => {
            const data = await loadPage(page+1, PRODUCTS_TO_FETCH)
            setProducts([...products, ...data.products])
            setPage(data.page)
      }

    useEffect(() => {
        if (inView && page*PRODUCTS_TO_FETCH<initialData.total) {
            loadMore();
        }
      }, [inView]);

    const handleAddToCart = (productId) => {
        
        setCart(prevCart => {
            const updatedCart = { ...prevCart };
            updatedCart[productId] = (updatedCart[productId] || 0) + 1;
            return updatedCart;
        });
        
    };

    const handleRemoveFromCart = (productId) => {
        setCart(prevCart => {
            const updatedCart = { ...prevCart };
            if (updatedCart[productId] > 0) {
                updatedCart[productId] -= 1;
            }
            return updatedCart;
        });
    };

    const handlePhoneChange = (event) => {
        setPhone(event.target.value);
    };

    const handleSubmitOrder = () => {
        // Проверка наличия номера телефона
        if (!phone.trim()) {
            setError('Введите номер телефона');
            return;
        }
        // Отправка заказа
        fetch('http://o-complex.com:1337/order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phone, "cart":Object.entries(cart).map(([id, quantity]) => (quantity&&{ id, quantity })).filter(item => item !== 0) })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Успешный заказ
                   /* alert('Заказ успешно оформлен!');*/
                    setCart({});
                    setPhone('');
                    setError('');
                    setModal(true);
                } else {
                    // Ошибка заказа
                    setError(data.error);
                }
            })
            .catch(error => console.error(error));
    };

    return (
        <div>
             
             {/* Корзина */}
             <div className='flex mt-36 mb-10 sticky top-5'>
               <div className='bg-[#D9D9D9]  mx-auto p-3 rounded-2xl shadow-lg shadow-black/25 justify-center text-center md:text-start md:justify-stretch'>
                    <h2 className="text-4xl mb-3">Добавленные товары</h2>
                    {Object.entries(cart).map(([productId, quantity]) => (
                        <div className='flex gap-3 mb-2 justify-center md:justify-stretch'>
                           <div>Товар {productId} x{quantity}</div>
                            <div>{products.map(product=>{if (product.id==productId) return (quantity*product.price+"₽")})}</div>
                        </div>
                    ))}
                    <div className='flex gap-3 text-4xl flex-col md:flex-row'>
                        <div className='bg-black text-white p-4 rounded-2xl whitespace-nowrap flex flex-1'>+<input className="bg-transparent border-none outline-none flex-1 w-0 md:w-full" type="tel" value={phone} onChange={handlePhoneChange} placeholder="7(___) ___ __-__" /></div>
                        <button className='bg-black text-white p-4 rounded-2xl flex-0' onClick={handleSubmitOrder}>Заказать</button>
                    </div>
                    
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    
                </div> 
             </div>
             
            {/* Товары */}
            <div className="text-center">
                <div className='inline-grid grid-cols-1  md:grid-cols-3 max-w-[983px] mx-auto gap-8'>
                {products.map((product,index)=>(
                    <div key={product.id} data-id={product.id} className='bg-[#D9D9D9] p-3 flex flex-col rounded-2xl'>
                        <img className="rounded-2xl" style={{aspectRatio:
                            '0.768',objectFit:'cover'}} src={product.image_url} alt={product.title} />
                        <h3 className='text-4xl break-words my-2'>{product.title}</h3>
                        <p className='mb-2 break-words'>{product.description}</p>
                        <p className='text-center mb-3 mt-auto text-4xl'>Цена: {product.price}</p>
                        {!!Object.getOwnPropertyDescriptor(cart, product.id)?.value&&<div className='flex gap-3 text-4xl' >
                            <button className="bg-[#201717] text-center  p-2 px-4 text-white rounded-2xl " onClick={()=>handleRemoveFromCart(product.id,product.price)}>-</button>
                            <button onClick={()=>handleAddToCart(product.id)} className='bg-[#201717] text-center w-full p-2  text-white rounded-2xl '>{Object.getOwnPropertyDescriptor(cart, product.id).value||("купить")}</button>
                            <button className="bg-[#201717] text-center  p-2 px-4 text-white rounded-2xl " onClick={()=>handleAddToCart(product.id)}>+</button>
                        </div>}
                        {!Object.getOwnPropertyDescriptor(cart, product.id)?.value&&<div className='flex text-4xl' >
                            <button onClick={()=>handleAddToCart(product.id)} className='bg-[#201717] text-center w-full p-2  text-white rounded-2xl '>купить</button>
                        </div>}

                        
                    </div>
                    
                    )
                )}
                {page*PRODUCTS_TO_FETCH<initialData.total&&<div ref={ref} className='bg-[#D9D9D9] loading flex justify-center items-center'></div>}
                </div>
            </div>
            <Modal
                isOpen={isOpen}
                onRequestClose={() => setModal(false)}
                contentLabel="Success Modal" className="absolute top-[50%] left-[50%] w-[80%] max-w-max translate-x-[-50%] translate-y-[-50%] "
                >
                <div className='text-black text-center p-4 py-10 rounded-lg bg-[#D9D9D9] shadow-lg shadow-black/25'>
                    <h2>Заказ успешно оформлен!</h2>
                    <button className="bg-black p-3 rounded-lg text-white mt-4" onClick={() => setModal(false)}>OK</button>
                </div>
            </Modal>
        </div>
    );
};

export default ProductList;
