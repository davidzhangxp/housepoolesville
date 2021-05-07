import React from 'react'
import { Navbar } from './Navbar'
import { Products } from './Products'
import Footer from "./Footer"

export const Home = () => {
    return (
        <div>
            <Navbar />
            <Products />
            <Footer />
        </div>
    )
}
