import { Box, Center, Stack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import axios from 'axios';
import Card from '../common-components/Card'
import Navbar from "../common-components/Navbar.jsx"

const ItemStore = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get("https://fakestoreapi.com/products");
                setProducts(data);  // Store the products from the API
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

    const checkoutHandler = async (amount, itemName) => {
        const { data: { key } } = await axios.get("https://my-product-backend-api-1.onrender.com/api/getkey");

        const { data: { order } } = await axios.post("https://my-product-backend-api-1.onrender.com/api/checkout", { amount, itemName });

        const options = {
            key,
            amount: order.amount,
            currency: "INR",
            name: "Himanshu Shivgotra",
            description: "Learning Payment Gateway",
            image: "https://media.licdn.com/media/AAYQAQSOAAgAAQAAAAAAAB-zrMZEDXI2T62PSuT6kpB6qg.png",
            order_id: order.id,
            callback_url: "https://my-product-backend-api-1.onrender.com/api/paymentverification",
            prefill: {
                name: "Himanshu Shivgotra",
                email: "himanshushivgotra@example.com",
                contact: "9000090000"
            },
            notes: {
                address: "Razorpay Corporate Office"
            },
            theme: {
                color: "#3399cc"
            },
            method: {
                upi: true
            }
        };
        const razor = new window.Razorpay(options);
        razor.open();
    };

    return (
        <>
            <Navbar  />
            <Box mt={"5%"} >
                <Stack h={"100vh"} justifyContent="center" direction={["column", "row"]} wrap="wrap">
                    {products.length > 0 ? (
                        products.map(product => (
                            <Card
                                key={product.id}
                                amount={product.price}
                                itemName={product.title}
                                img={product.image}
                                checkoutHandler={checkoutHandler}
                            />
                        ))
                    ) : (
                        <Center>Loading products...</Center>
                    )}
                </Stack>
            </Box>
        </>
    );
}

export default ItemStore;