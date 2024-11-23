import { createSlice } from '@reduxjs/toolkit';

const restaurantSlice = createSlice({
    name: 'restaurants',
    initialState: {
        restaurantsList: [],
        filteredRestaurantsList: [],
        activeFilters: {
            fastDelivery: false,
            new: false,
            rating4Plus: false,
            pureVeg: false,
            offers: false,
            priceRange300To600: false,
            priceRangelessThan300: false,
        },
        selectedCity: "",
        cities: [],
        offers: false,
        selectedRes: null
    },
    reducers: {
        addRestaurants: (state, action) => {
            state.restaurantsList = action.payload;
        },
        addFilteredRestaurants: (state, action) => {
            state.filteredRestaurantsList = action.payload;
        },
        toggleFilter: (state, action) => {
            const filterName = action.payload;
            state.activeFilters[filterName] = !state.activeFilters[filterName];
            state.filteredRestaurantsList = applyFilters(state.restaurantsList, state.activeFilters);
        },
        setSelectedCity : (state, action) => {
            state.selectedCity = action.payload
        },
        setCities : (state, action) => {
            state.cities = action.payload
        },
        setOffer : (state, action) => {state.offers = !state.offers},
        
        setSelectedRes : (state, action) => {state.selectedRes = action.payload},

    },
});

const applyFilters = (res, filters) => {
    return res.filter((restaurant) => {
        if (filters.fastDelivery && restaurant.deliverytime > 20 ) return false;
        if (filters.new && !restaurant.rating !== "--") return false;
        if (filters.rating4Plus && restaurant.rating < 4) return false;
        if (filters.pureVeg && !restaurant.veg) return false;
        if (filters.offers && restaurant?.offers === "") return false;

        if (filters.priceRangelessThan300 && restaurant.costfortwo >= 300) return false;
        if (filters.priceRange300To600 && (restaurant.costfortwo < 300 || restaurant.costfortwo > 600)) return false;

        return true;
    });
};

export const { setSelectedRes, setOffer, addRestaurants, addFilteredRestaurants, toggleFilter, setSelectedCity, setCities} = restaurantSlice.actions;

export default restaurantSlice.reducer;
