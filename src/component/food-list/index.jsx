// ** React Imports
import React, {useEffect, useState} from "react";

import "../../CSS/FoodList.css"

// ** Custom Component Imports
import Category from './category'

const FoodList = () => {

    // ** State
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [currentPage, setCurrentPage] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [foods, setFoods] = useState([]);
    const [filteredFoods, setFilteredFoods] = useState([]);
    const itemsPerPage = 6;

    // ** Get Food Items List
    useEffect(() => {
        const fetchFoodList = async () => {
            try {
                const response = await fetch('https://gist.githubusercontent.com/wilson-wego/8311b463cd331099e34a1f251dad4cbf/raw/f1b04f9afe0fcc0c9270cb486b927641b7d27436/food.json');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setFoods(data.foods);
                setFilteredFoods(data.foods);
            } catch (error) {
                alert(`Error fetching categories: ${error}`)
            }
        };

        fetchFoodList();
    }, []);

    // ** Handle Category Change
    useEffect(() => {
        let filtered = foods;
        if (selectedCategory && selectedCategory !== 'all') {
            filtered = foods.filter(food => food.categoryId === selectedCategory);
        }

        if (searchQuery) {
            filtered = filtered.filter(food =>
                food.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        setFilteredFoods(filtered);
        setCurrentPage(0);
    }, [selectedCategory, searchQuery, foods]);

    const displayFoods = () => {
        const start = currentPage * itemsPerPage;
        const end = start + itemsPerPage;
        return filteredFoods.slice(0, end);
    };

    const handleShowMore = () => {
        setCurrentPage(currentPage + 1);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const renderPromotionIcon = (food) => {
        if (food.promotion === 'gift') {
            return (
                <div className="icon icon-gift">
                    <i className="fas fa-gift"/>
                </div>
            );
        } else if (food.promotion === 'discount') {
            return (
                <div className="icon icon-discount">
                    <i className="fas fa-percentage"/>
                </div>
            );
        } else if (food.promotion === '1+1') {
            return (
                <div className="icon icon-1plus1" style={{padding:'10px 16px', fontSize:'13px'}}>
                    1+1
                </div>
            );
        } else {
            return null;
        }
    };

    return(
        <div>
            <div className="input-container">
              <span className="icon">
                <i className="fas fa-search"/>
              </span>
              <input
                  type="text"
                  className="input-field"
                  placeholder="Enter restaurant name..."
                  value={searchQuery}
                  onChange={handleSearchChange}
              />
            </div>

            <Category categories={categories} setCategories={setCategories} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}/>

            <div className="food-list" style={{marginTop: '40px'}}>
                {displayFoods().map(food => (
                    <div className="food-card" key={food.id}>
                        {renderPromotionIcon(food)}

                        <img src={food.imageUrl} alt={food.name} />
                        <h4>{food.name}</h4>
                        <p>
                            <span>
                                <i className="fas fa-star" style={{color: '#6C6567', paddingRight: '5px'}}/>
                                {(Math.floor(food.rating * 10) / 10).toFixed(1)}
                            </span>

                            <span style={{marginLeft:'10px'}}>
                                {food.minCookTime}-{food.maxCookTime} min
                            </span>

                            {food.isNew &&
                                <span style={{marginLeft:'10px', color:'#0EB37B', fontWeight: 'bold'}}>
                                    New
                                </span>
                            }
                        </p>
                    </div>
                ))}
            </div>

            {((currentPage + 1) * itemsPerPage < filteredFoods.length) && (
                <button className="show-more" onClick={handleShowMore}>
                    <i className="fas fa-plus" style={{color: '#6C6567', paddingRight: '5px'}}/>
                    Show More
                </button>
            )}
        </div>
    )
}

export default FoodList;