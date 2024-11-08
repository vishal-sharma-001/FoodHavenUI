
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Body from './components/Body'
import { Provider } from "react-redux";
import store from "./utils/store";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import About from './components/About';
import Help from './components/Help';
import ErrorPage from './components/ErrorPage';
import RestaurantMenu from './components/RestaurantMenu'
import Cart from './components/Cart';
import React from 'react';
import { lazy, Suspense} from 'react';
const Groceries = lazy(()=> import ("./components/Groceries")) 

const appRouter = createBrowserRouter([
    {
        path: '/',
        element: <App/>,
        errorElement: <ErrorPage/>,
        children: [
            {
                path: '/',
                element: <Body/>,                
            },
            {
                path: '/about',
                element: <About/>,
            }, 
            {
                path: '/help',
                element: <Help/>,
            },
            {
                path: '/menu/:resid',
                element: <RestaurantMenu/>,
            },
            {
                path: '/groceries',
                element: <Suspense fallback={<div></div>}> <Groceries/> </Suspense>,                
            },
            {
                path: '/cart',
                element: <Cart/>
            }
        ]
    }
])
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Provider store={store}>
        <RouterProvider router={appRouter}/>
    </Provider>    
)
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
