import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from '../pages/Landing';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import BuyerDashboard from '../pages/dashboard/BuyerDashboard';
import VendorDashboard from '../pages/dashboard/VendorDashboard';
import ProductsList from '../pages/products/ProductsList';
import ProductDetails from '../pages/products/ProductDetails';
import MyOrders from '../pages/orders/MyOrders';
import Notifications from '../pages/Notifications';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../components/common/MainLayout';
import { useAuth } from '../hooks/useAuth';
import Cart from '../pages/Cart';
import AddProduct from '../pages/products/AddProduct';

const AppRouter = () => {
    const { isAuthenticated, role } = useAuth();
    
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route 
                path="/dashboard"
                element={
                    <ProtectedRoute allowedRoles={['buyer', 'vendor']}>
                        <MainLayout>
                           {isAuthenticated && (role === 'buyer' ? <BuyerDashboard /> : <VendorDashboard />)}
                        </MainLayout>
                    </ProtectedRoute>
                } 
            />
            
            <Route path="/products" element={
                <ProtectedRoute allowedRoles={['buyer', 'vendor']}>
                    <MainLayout><ProductsList /></MainLayout>
                </ProtectedRoute>
            } />
            <Route path="/products/:id" element={
                <ProtectedRoute allowedRoles={['buyer', 'vendor']}>
                    <MainLayout><ProductDetails /></MainLayout>
                </ProtectedRoute>
            } />
            
            <Route path="/add-product" element={
                <ProtectedRoute allowedRoles={['vendor']}>
                    <MainLayout><AddProduct /></MainLayout>
                </ProtectedRoute>
            } />

            <Route path="/orders" element={
                <ProtectedRoute allowedRoles={['buyer']}>
                    <MainLayout><MyOrders /></MainLayout>
                </ProtectedRoute>
            } />
            
            <Route path="/cart" element={
                <ProtectedRoute allowedRoles={['buyer']}>
                    <MainLayout><Cart /></MainLayout>
                </ProtectedRoute>
            } />

            <Route path="/notifications" element={
                <ProtectedRoute allowedRoles={['buyer', 'vendor']}>
                    <MainLayout><Notifications /></MainLayout>
                </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

export default AppRouter;