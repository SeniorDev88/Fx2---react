import React, {Component} from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'




/*
 * Global Vars & Functions
 */
import { stripeToken, getStripeCard, becomePlatinum, buyPaypalSubscription, mountWorkoutBuyCallback, checkoutWorkout, cardType } from '../data/data';
import { setVisibilityModal, ModalVisibilityFilters, ModalTypes } from '../actions';
import { setOpenDropdown } from '../App';



/*
 * Components
 */
import F2xInput from '../components/F2xInput'
import F2xButton from '../components/F2xButton'



/*
 * Style
 */
import './F2xBecomePlatinum.css';



/*
 * Icon
 */
import ICON_PAYPAL from '../media/cards/paypal.svg';
import ICON_PAYPAL_DISABLED from '../media/icon_paypal_disabled.svg';
import ICON_CARD_VISA from '../media/cards/visa.svg';
import ICON_CARD_MASTERCARD from '../media/cards/mastercard.svg';
import info from '../media/question-mark-icon.svg';
import ICON_OK from '../media/form_ok.svg';




const actionButton = ({ onClick, enabled, spinner }) => (
	<div style={{marginTop: '5px', textAlign: 'center'}}>
		<F2xButton name="SUBMIT" 
			className={`f2x-new-button-black small-font separated f2x-login-sign-btn ${enabled ? '':' disabled'}`} 
			onClick={ () => onClick()}
			spinner={spinner} />
	</div>
);


const ActionButton = connect()(actionButton)


class f2xBecomePlatinum extends Component {
	constructor(props){
		super(props);
		
		this.state = {
			card: '',
			left: 0,
			deleteCard: 'none',
			send: false,
			send2: true,
			update: false,
			spinner: false,
            paypal: false,
            enableJoin: false,
            startable: false,
            errors:{}
		}
		
		this.sendCard = this.sendCard.bind(this);
		this.toggleCVV = this.toggleCVV.bind(this);
        this.togglePayment = this.togglePayment.bind(this);
        this.update = this.update.bind(this);
	}
	
	
	componentWillMount(){
		getStripeCard();
	}
	
	componentDidMount(){
	
		this.refs.paypalPay.addEventListener('click', (event) => {
			event.preventDefault();
			console.log('paypal login goes here')
		});
	}

    componentWillReceiveProps(nextProps){
        
        const {card} = nextProps
        
		let errors = {
			cardnumber:{status:1, msg:''},
			cardname:{status:1, msg:''},
			expdate:{status:1, msg:''},
			cvv:{status:1, msg:''}
		}
		
		// if (nextProps.flags.errorMail !==  undefined) errors.email = {status:0, msg:nextProps.flags.errorMail};
		// if (nextProps.flags.errorUser !==  undefined) errors.username = {status:0, msg:nextProps.flags.errorUser};
		// if (nextProps.flags.password !==  undefined) errors.username = {status:0, msg:nextProps.flags.errorUser};

		if (nextProps.appState.startable){
			this.setState(
			Object.assign({}, this.state,{
			    	errors: errors,
			    	spinner: false,
					startable: true
		        }))
		} else {
			this.setState(
			Object.assign({}, this.state,{
			    	errors: errors,
			    	spinner: false,
					startable: false
		        }))
		}
	}
	
	
	sendCard() {

		console.log("BecomePlatinum");		
		stripeToken({
			name: this.refs.cardName.refs.text.value,
			number: this.refs.cardNumber.refs.text.value,
			month: this.refs.cardDate.refs.text.value.split("/")[0],
			year: this.refs.cardDate.refs.text.value.split("/")[1],
			cvv: this.refs.cardCVV.refs.text.value
		});
	}
	
	toggleCVV(e) {
		e.stopPropagation();
		e.preventDefault();
		
		this.refs.cvv.style.display = this.refs.cvv.style.display === 'block' ? 'none' : 'block';
		
		setOpenDropdown(this.refs.cvv);
	}

    togglePayment(e) {
		e.stopPropagation();
		e.preventDefault();
		
		this.refs.payment.style.display = this.refs.payment.style.display === 'block' ? 'none' : 'block';
		
		setOpenDropdown(this.refs.payment);
	}
	
    update() {
		let tForm = {}														   // We defined the form values here

		tForm.cardnumber = 	this.refs.cardNumber.refs.text.value;
		tForm.cardname = 	this.refs.cardName.refs.text.value;
		tForm.expdate = 	this.refs.cardDate.refs.text.value;
		tForm.cvv = 		this.refs.cardCVV.refs.text.value;
		
		let enableJoin =  this.validateCardname(tForm.cardname) && this.validateCardnumber(tForm.cardnumber) && this.validateExpdate(tForm.expdate) && this.validateCvv(tForm.cvv);

		let errors = {}
		//if (this.state.enableValidation){
			errors.cardname = 	  this.validateCardname(tForm.cardname) ? {status:1, msg:''} : undefined;
			errors.cardnumber = 	  this.validateCardnumber(tForm.cardnumber) ? {status:1, msg:''} : undefined;
			errors.expdate = 	  this.validateExpdate(tForm.expdate) ? {status:1, msg:''} : undefined;
			errors.cvv = 	  this.validateCvv(tForm.cvv) ? {status:1, msg:''} : undefined;
		//} 
		
		this.setState(
			Object.assign({}, this.state,{
		    		value: {
						cardname: tForm.cardname,
						cardnumber: tForm.cardnumber,
						expdate: tForm.expdate,
						cvv: tForm.cvv
			    	},
                    card: cardType(this.tForm.cardnumber),
			    	errors: errors,
			    	enableJoin:enableJoin
		        })
	    )
	}

	validateCardname(data){
		var re = /^[a-z ,.'-]+$/i;
		return data !== '' && re.test(data);
	}

	validateCardnumber(data){
		var re = /^4[0-9]{12}(?:[0-9]{3})?$/;

		return data !== '' && re.test(data);
	}

	validateExpdate(data){
		var re = /^(0[1-9]|1[0-2])\/([0-9][0-9])$/
		return data !== '' && re.test(data)
	}

	validateCvv(data){
		var re = /^[0-9]{3,4}$/;
		return data !== '' && re.test(data)
	}
	
	render(){
		return (
			<div className="cuerpo" style={{ maxWidth: '560px', margin: '0 auto', position: 'relative', paddingTop: '75px', textAlign: 'center'}}>
				<div className='f2x-btn-back' onClick={ browserHistory.goBack }/>
                <div className={ this.state.startable? 'hidden' : 'f2x-modal-title'}>BECOME A</div>
                <div className="f2x-modal-title">PLATINUM MEMBER</div>
				<div className={ this.state.startable? "hidden" : "f2x-price-format" } style={{fontSize: '36px', margin: '10px 0 0 0'}}>
					<span>$</span>12.99<span>/mo</span>
				</div>
				
				<div className={ this.state.startable? 'hidden' : ''} style={{fontSize: '12px', margin: '12px auto 0 auto', maxWidth: '360px'}}>
					<strong>Unlimited</strong> online streaming access to all F2X content 
				</div>
				
                <div className={ this.state.startable? 'f2x-welcome' : 'hidden'} />
				
				<div className={ this.state.startable? 'hidden' : ''} style={{width: '300px', margin: '40px auto 15px auto'}}>

					<F2xInput 	placeholder='Name on Card' 
								ref="cardName" refID="text" 
								className="f2x-input-full" 
								style={{width: '100%'}} 
								styleBox={{width: '100%', marginTop: '23px'}}
								onChange={(e) => { this.update(e) }} />
					
					<F2xInput 	placeholder='Card Number' 
								ref="cardNumber" refID="text" 
								style={{margin: '0', width: 'CALC(100% - '+ this.state.left +'px)', paddingLeft: this.state.left +'px'}} 
								styleBox={{width: '300px', marginTop: '23px'}} 
								icon={this.state.card}
								onChange={(e) => { this.update(e) }} />
					
					<div style={{position: 'relative', height: '60px'}}>

                        <F2xInput 	placeholder='Exp. Date' 
								ref="cardDate" refID="text" 
								className="f2x-input-full" 
								style={{width: '140px'}} 
								styleBox={{float: 'left', width: '140px', marginTop: '23px'}}
								onChange={(e) => { this.update(e) }} />

						<F2xInput 	placeholder='CVV' 
									ref="cardCVV" refID="text"
									className="f2x-input-full" 
									style={{width: '140px'}} 
									styleBox={{float: 'right', width: '140px', marginTop: '23px'}} 
									iconR={info}
									onChange={(e) => { this.update(e) }}
									iconClick={this.toggleCVV} />
									
						<div ref="cvv" className="f2x-billing-cvv" style={{top: '-111px', left: '91px', bottom: 'auto'}}>
							The CVV Number on your credit card or debit card is a 3 digit number on the rear of VISA®.
							<br />
							MasterCard® and Discover® branded credit and debit cards. On your American Express® branded credit or debit card it is a 4 digit numeric code located on the front.
						</div>
					</div>
                    <div className={ this.state.startable? "hidden" : "small-font separated" } style={{fontSize: '10px', margin: '25px auto 10px auto', textDecoration: 'underline', cursor: 'pointer', position: 'relative'}} onClick={this.togglePayment}>Payment Terms & Conditions
                        <div ref="payment" className="f2x-payment-terms" style={{bottom: '40px', left: '150px'}} onClick={this.togglePayment}>
                            Lorem the quick brown fox jumps over lazy dog, Lorem the quick brown fox jumps over lazy dog Lorem the quick brown fox jumps over lazy dog Lorem the quick brown fox jumps over lazy dog Lorem the quick brown fox jumps over lazy dog Lorem the quick brown fox jumps over lazy dog Lorem the quick brown fox jumps over lazy dog Lorem the quick brown fox jumps over lazy dog Lorem the quick brown fox jumps over lazy dog Lorem the quick brown fox jumps over lazy dog.
                        </div>
                    </div>
				
				    <ActionButton
                            enabled = {this.state.enableJoin}
							spinner={this.state.spinner} 
							spinnerStyle={{marginBottom: '50px'}}
							onClick={ this.sendCard } />
					
					<div style={{clear: 'both'}} />
				</div>
                <button className = {this.state.startable? 'f2x-new-button-black' : 'hidden'  }  style={{width: '210px', height: '52px'}} onClick={ () => { browserHistory.push('/set-goal') } }>SET A GOAL</button>

                <div className={ this.state.startable? 'hidden' : ''} style={{fontSize: '14px', width: '170px', margin: '10px auto'}}>
					<div className="cursor" style={{paddingTop: '2px'}} ref="paypalPay">
					{/*<div style={{paddingTop: '2px',cursor:'pointer'}} ref="paypalPay">*/}
						<img src={ ICON_PAYPAL } width="20" height="20" alt="Pay Pal" style={{paddingRight: '20px', float: 'left', marginTop: '-2px'}} /> PAY WITH PAYPAL
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	const {modal, workouts, card, appState} = state;
	
	let newWorkout = ''
	
	workouts.list.map(
		(item) =>{
			const searchWorkout = item.exercises.find(x => x.uid === modal.param);
			
			if(searchWorkout)
				newWorkout = item.title;
				
			return null;
		}
	)
	
	
	return {
		title: newWorkout,
		card: card.card,
        appState: appState
	}
}


const F2xBecomePlatinum = connect(
	mapStateToProps
)(f2xBecomePlatinum);

export default F2xBecomePlatinum