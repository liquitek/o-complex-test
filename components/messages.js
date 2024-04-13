
const Messages = async (props) => {
    const fetchReviews = async () => {
        try {
            const response = await fetch('http://o-complex.com:1337/reviews');
            const data = await response.json();
            return(data);
        } catch (error) {
            console.error(error);
        }
    };
    const data = await fetchReviews();
    const filterText = (text) => {
        const filteredText = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        return filteredText;
    };
    return (
                <div className={props.className}>
                    {/* Отзывы */}
                    {data.map(review => (
                        <div className="w-[468px] flex flex-col bg-[#D9D9D9] rounded-2xl p-4 max-w-full mx-auto md:mx-0" key={review.id} dangerouslySetInnerHTML={{ __html: filterText(review.text) }} />
                    ))}
                </div>
    );
}
export default Messages;
