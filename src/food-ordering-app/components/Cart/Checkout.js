import classes from './Checkout.module.css';
import { useRef, useState } from 'react';

const isEmpty = (value) => value.trim().length === 0;
const isFiveChars = (value) => value.trim().length === 5;

const Checkout = (props) => {
	const nameRef = useRef();
	const streetRef = useRef();
	const postalCodeRef = useRef();
	const cityRef = useRef();

	const [formValidity, setFormValidity] = useState({
		name: true,
		street: true,
		postalCode: true,
		city: true,
	});

	const confirmHandler = (event) => {
		event.preventDefault();

		const enteredName = nameRef.current.value;
		const enteredStreet = streetRef.current.value;
		const enteredPostalCode = postalCodeRef.current.value;
		const enteredCity = cityRef.current.value;

		const isNameInputValid = !isEmpty(enteredName);
		const isStreetInputValid = !isEmpty(enteredStreet);
		const isPostalCodeInputValid = isFiveChars(enteredPostalCode);
		const isCityInputValid = !isEmpty(enteredCity);

		const isFormValid =
			isNameInputValid &&
			isStreetInputValid &&
			isPostalCodeInputValid &&
			isCityInputValid;

		setFormValidity({
			name: isNameInputValid,
			street: isStreetInputValid,
			postalCode: isPostalCodeInputValid,
			city: isCityInputValid,
		});

		if (isFormValid) {
			const userAddress = {
				name: enteredName,
				street: enteredStreet,
				poatalCode: enteredPostalCode,
				city: enteredCity,
			};
			props.onConfirm(userAddress);
		}
	};

	return (
		<form className={classes.form} onSubmit={confirmHandler}>
			<div
				className={`${classes.control} ${
					!formValidity.name ? classes.invalid : ''
				}`}>
				<label htmlFor='name'>Your Name</label>
				<input type='text' id='name' ref={nameRef} />
				{!formValidity.name && <p>Please enter a valid name</p>}
			</div>
			<div
				className={`${classes.control} ${
					!formValidity.street ? classes.invalid : ''
				}`}>
				<label htmlFor='street'>Street</label>
				<input type='text' id='street' ref={streetRef} />
				{!formValidity.street && <p>Please enter a valid street</p>}
			</div>
			<div
				className={`${classes.control} ${
					!formValidity.postalCode ? classes.invalid : ''
				}`}>
				<label htmlFor='postal'>Postal Code</label>
				<input type='text' id='postal' ref={postalCodeRef} />
				{!formValidity.postalCode && <p>Please enter a valid postal code</p>}
			</div>
			<div
				className={`${classes.control} ${
					!formValidity.city ? classes.invalid : ''
				}`}>
				<label htmlFor='city'>City</label>
				<input type='text' id='city' ref={cityRef} />
				{!formValidity.city && <p>Please enter a valid city</p>}
			</div>
			<div className={classes.actions}>
				<button type='button' onClick={props.onCancel}>
					Cancel
				</button>
				<button className={classes.submit}>Confirm</button>
			</div>
		</form>
	);
};

export default Checkout;
