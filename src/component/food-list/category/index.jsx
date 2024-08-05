// ** React Imports
import React, {useEffect} from "react";

// ** CSS Imports
import '../../../CSS/Category.css'

const Category = ({categories, setCategories, selectedCategory, setSelectedCategory}) => {

    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
    };

    // ** Get Categories List
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('https://gist.githubusercontent.com/wilson-wego/f7381fcead7a47a7df257a97a033456a/raw/33cd31ce75ba72a809d48944463b53b74b9ccae8/categories.json');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setCategories([{ id: 'all', name: 'All' }, ...data]);
            } catch (error) {
                alert(`Error fetching categories: ${error}`)
            }
        };

        fetchCategories();
    }, []);

    return(
        <div className="btn-group" style={{marginTop: '40px'}}>
            {categories.map((category) => (
                <button
                    key={category.id}
                    className={selectedCategory === category.id ? 'active' : ''}
                    onClick={() => handleCategoryChange(category.id)}
                >
                    {category.name}
                </button>
            ))}
        </div>
    )
}

export default Category