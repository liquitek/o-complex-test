export default async function loadPage (page,size) {
    const res = await fetch(`http://o-complex.com:1337/products?page=${page}&page_size=${size}`);
    if (!res.ok) {
        throw new Error('Failed to fetch data')
    }
    const data = await res.json()
    return data;
};