import React, { createContext, useContext, useState, useEffect } from 'react';

const ComparisonContext = createContext();

export const useComparison = () => useContext(ComparisonContext);

export const ComparisonProvider = ({ children }) => {
    const [comparedProducts, setComparedProducts] = useState(() => {
        // Load local storage
        const saved = localStorage.getItem('comparedProducts');
        return saved ? JSON.parse(saved) : [];
    });

    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('comparedProducts', JSON.stringify(comparedProducts));
    }, [comparedProducts]);

    const addToCompare = (product) => {
        if (comparedProducts.find(p => p._id === product._id || p.id === product.id)) {
            alert('Product already in comparison!');
            return;
        }

        if (comparedProducts.length >= 3) {
            alert('You can compare max 3 products at a time!');
            return;
        }

        setComparedProducts([...comparedProducts, product]);
        setIsOpen(true);
    };

    const removeFromCompare = (productId) => {
        setComparedProducts(comparedProducts.filter(p => (p._id || p.id) !== productId));
    };

    const clearComparison = () => {
        setComparedProducts([]);
        setIsOpen(false);
    };

    return (
        <ComparisonContext.Provider value={{
            comparedProducts,
            addToCompare,
            removeFromCompare,
            clearComparison,
            isOpen,
            setIsOpen
        }}>
            {children}
        </ComparisonContext.Provider>
    );
};
