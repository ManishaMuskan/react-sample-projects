import React, { useContext, useState } from 'react';

import Modal from '../UI/Modal';
import CartItem from './CartItem';
import classes from './Cart.module.css';
import CartContext from '../../store/cart-context';
import Checkout from './Checkout';

const Cart = (props) => {
	const cartCtx = useContext(CartContext);
	const [initiateOrder, setInitiateOrder] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [didSubmit, setDidSubmit] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [successMessage, setSuccessMessage] = useState('');

	const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
	const hasItems = cartCtx.items.length > 0;

	const cartItemRemoveHandler = (id) => {
		cartCtx.removeItem(id);
	};

	const cartItemAddHandler = (item) => {
		const itemOfAmountOne = { ...item, amount: 1 };
		cartCtx.addItem(itemOfAmountOne);
	};

	const cartOrderHandler = () => {
		setInitiateOrder(true);
	};

	const clearCartHandler = () => {
		cartCtx.clearCart();
	};

	const confirmOrderHandler = async (userAddress) => {
		setDidSubmit(false);
		setIsSubmitting(true);
		try {
			const response = await fetch(
				'https://react-concept-sample-default-rtdb.firebaseio.com/orders.json',
				{
					method: 'POST',
					body: JSON.stringify({
						orderItems: cartCtx.items,
						userAddress,
					}),
				}
			);
			setIsSubmitting(false);
			setDidSubmit(true);
			if (!response.ok) {
				throw new Error('Something went wrong! Try again!');
			} else {
				setSuccessMessage('Order placed successfully!!');
				clearCartHandler();
			}
		} catch (error) {
			setErrorMessage(error.message);
		}
	};

	const cartItems = (
		<ul className={classes['cart-items']}>
			{cartCtx.items.map((item) => (
				<CartItem
					key={item.id}
					name={item.name}
					amount={item.amount}
					price={item.price}
					onRemove={cartItemRemoveHandler.bind(null, item.id)}
					onAdd={cartItemAddHandler.bind(null, item)}
				/>
			))}
		</ul>
	);

	const cartModalContent = (
		<React.Fragment>
			{cartItems}
			<div className={classes.total}>
				<span>Total Amount</span>
				<span>{totalAmount}</span>
			</div>
			{!initiateOrder && (
				<div className={classes.actions}>
					<button className={classes['button--alt']} onClick={props.onClose}>
						Close
					</button>
					{hasItems && (
						<button className={classes.button} onClick={cartOrderHandler}>
							Order
						</button>
					)}
				</div>
			)}
			{initiateOrder && (
				<Checkout onCancel={props.onClose} onConfirm={confirmOrderHandler} />
			)}
		</React.Fragment>
	);

	const submittingOrderContent = <p>Submitting order data...</p>;
	const didSubmitAndOrderPlacedContent = (
		<React.Fragment>
			<p className={classes['success-message']}>{successMessage}</p>
			<div className={classes.actions}>
				<button className={classes['button--alt']} onClick={props.onClose}>
					Close
				</button>
			</div>
		</React.Fragment>
	);
	const didSubmitAndErrorOccuredContent = (
		<React.Fragment>
			<p className={classes.error}>{errorMessage}</p>
			<div className={classes.actions}>
				<button className={classes['button--alt']} onClick={props.onClose}>
					Close
				</button>
			</div>
		</React.Fragment>
	);

	return (
		<Modal onClose={props.onClose}>
			{!isSubmitting && !didSubmit && cartModalContent}
			{isSubmitting && !didSubmit && submittingOrderContent}
			{!isSubmitting &&
				didSubmit &&
				successMessage &&
				didSubmitAndOrderPlacedContent}
			{!isSubmitting &&
				didSubmit &&
				errorMessage &&
				didSubmitAndErrorOccuredContent}
		</Modal>
	);
};

export default Cart;
