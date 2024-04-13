import Messages from '@/components/messages.js';
import ProductList from '@/components/productlist.js';
import loadPage from '@/actions/loadpage.js';

const INITIAL_NUMBER_OF_PRODUCTS = 20
var heading="тестовое задание";
const Main = async () => {
    const initialData = await loadPage(1, INITIAL_NUMBER_OF_PRODUCTS)
    return (
        <div className='text-black px-2'>
            <div className='flex'>
            <h1 className='text-[40px] md:text-8xl m-auto bg-[#777] text-white mt-8 mb-10 pt-4 md:pt-1 pb-5 w-[1142px] max-w-full justify-center text-center rounded-lg flex'>{heading}</h1>
            </div>
            <Messages className="flex flex-col md:flex-row md:justify-center gap-5 py-5"></Messages>
            <ProductList initialData={initialData}></ProductList>
        </div>
    );
};

export default Main;
